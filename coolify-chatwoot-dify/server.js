const express = require('express');
const axios = require('axios');
const https = require('https');
const insecureAgent = new https.Agent({ rejectUnauthorized: false });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

async function getAttachmentAsBase64(url) {
  if (!url || !url.startsWith('http')) return url;
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      httpsAgent: insecureAgent,
      timeout: 10000,
    });
    const mime = res.headers['content-type'] || 'image/jpeg';
    const base64 = Buffer.from(res.data).toString('base64');
    console.log(`[Bridge] Adjunto descargado y convertido a Base64 (${base64.length} caracteres)`);
    return `data:${mime};base64,${base64}`;
  } catch (err) {
    console.error('[Bridge] Error descargando adjunto:', err.message);
    return url;
  }
}

async function transcribeAudio(audioUrl) {
  if (!audioUrl || !audioUrl.startsWith('http')) return '';
  try {
    console.log(`[Bridge] Descargando audio para transcribir: ${audioUrl.substring(0, 80)}...`);
    const res = await axios.get(audioUrl, {
      responseType: 'arraybuffer',
      httpsAgent: insecureAgent,
      timeout: 15000,
    });

    const formData = new FormData();
    const blob = new Blob([res.data], { type: 'audio/ogg' });
    formData.append('file', blob, 'audio.ogg');
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');

    const whisperRes = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const text = whisperRes.data?.text || '';
    console.log(`[Bridge] Audio transcrito con éxito: "${text}"`);
    return text;
  } catch (err) {
    console.error('[Bridge] Error transcribiendo audio con Whisper:', err.response?.data || err.message);
    return '';
  }
}

async function analyzeImage(imageUrl, userCaption) {
  if (!imageUrl || !imageUrl.startsWith('http')) return userCaption || '';
  try {
    console.log(`[Bridge] Analizando imagen con GPT-4o-mini Vision...`);
    const base64Url = await getAttachmentAsBase64(imageUrl);
    const promptText = userCaption
      ? `El usuario envió esta imagen con el texto: "${userCaption}". Describe detalladamente lo que ves (tratamientos, promociones, precios de la clínica CLEO) y formula la consulta para responderle.`
      : `El usuario envió este flyer/imagen. Describe detalladamente todos los nombres de tratamientos, precios en USD y promociones que aparecen en la imagen para que el asistente de CLEO pueda responder y agendar al paciente.`;

    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            { type: 'image_url', image_url: { url: base64Url } },
          ],
        },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const desc = res.data?.choices?.[0]?.message?.content || '';
    console.log(`[Bridge] Imagen analizada con éxito: "${desc.substring(0, 80)}..."`);
    return desc;
  } catch (err) {
    console.error('[Bridge] Error analizando imagen:', err.response?.data || err.message);
    return userCaption || 'Consulta sobre imagen adjunta';
  }
}

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('OK'));

const CHATWOOT_URL = process.env.CHATWOOT_URL || 'https://buddychat.sosmarketing.agency';
const CHATWOOT_TOKEN = process.env.CHATWOOT_TOKEN || 'NSF6H1StEgKrk9YGTP5Vijbc';
const DIFY_URL = process.env.DIFY_URL || 'https://buddydify.sosmarketing.agency/v1';

// Mapeo de Inboxes a Apps de Dify (Fácil de escalar para otros clientes)
const INBOX_ROUTING = {
  '6': 'app-3Z5n5pjhzirvYseQrsrCcpXy', // CLEO
  // '7': 'app-otra-key-dr-sira',
};

// Mapeo de Inbox a nombre de canal (para que el prompt de Dify adapte formato/tono)
const INBOX_CHANNEL = {
  '6': 'instagram', // CLEO Instagram
  // '<id_inbox_whatsapp_cleo>': 'whatsapp',
};

const messageBuffers = new Map(); // Anti-ráfaga de mensajes de Instagram

/**
 * Builds an identity that does not change when a contact changes their display
 * name or Instagram username. Chatwoot's contact_inbox.source_id is the
 * external contact identifier for the channel; contact_id/sender.id are stable
 * fallbacks for payload variants that do not include it.
 */
function getStableContactIdentity(body) {
  const contactInbox = body.conversation?.contact_inbox;
  const sourceId = String(contactInbox?.source_id || '').trim();
  if (sourceId) return `source:${sourceId}`;

  const contactId = contactInbox?.contact_id ?? body.sender?.id;
  if (contactId !== null && contactId !== undefined && String(contactId).trim()) {
    return `contact:${String(contactId).trim()}`;
  }

  return null;
}

function buildContactKey(accountId, inboxId, contactIdentity) {
  return `chatwoot:${accountId}:${inboxId}:${contactIdentity}`;
}

function getInstagramUsername(body) {
  const attributes = body.sender?.additional_attributes ||
    body.conversation?.meta?.sender?.additional_attributes || {};
  const username = attributes.social_instagram_user_name || attributes.social_profiles?.instagram || '';
  return String(username).trim().replace(/^@/, '');
}

app.post('/webhook/chatwoot', async (req, res) => {
  res.sendStatus(200); // Responder rápido a Chatwoot

  const body = req.body;
  const conversation = body.conversation;
  if (!conversation) return;

  const accountId = body.account?.id || 1;
  const conversationId = conversation.id;
  const inboxId = String(body.inbox?.id);
  const difyKey = INBOX_ROUTING[inboxId];

  // 1. Si no es un canal configurado con Dify, ignorar
  if (!difyKey) return;

  // 2. Intervención humana: Si un asesor humano escribe, pausar bot 12 horas
  if (body.message_type === 'outgoing' && !body.private && body.content_attributes?.sent_by !== 'habioo_bot') {
    const hasta = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
    await axios.post(`${CHATWOOT_URL}/api/v1/accounts/${accountId}/conversations/${conversationId}/custom_attributes`, {
      custom_attributes: { bot_paused: true, paused_by: 'agente_humano', bot_paused_until: hasta },
    }, { headers: { api_access_token: CHATWOOT_TOKEN } });
    return;
  }

  // 3. Si el mensaje es entrante del usuario de Instagram
  if (body.message_type === 'incoming') {
    // Si el bot está pausado por un humano, no responder
    const pausedUntil = conversation.custom_attributes?.bot_paused_until;
    if (conversation.custom_attributes?.bot_paused && pausedUntil && new Date(pausedUntil) > new Date()) return;

    const contactIdentity = getStableContactIdentity(body);
    if (!contactIdentity) {
      console.error(`[Bridge] Mensaje entrante sin identidad estable: conv ${conversationId}`);
      return;
    }

    const contactKey = buildContactKey(accountId, inboxId, contactIdentity);
    const bufferKey = `${inboxId}_${conversationId}`;

    const attachment = body.attachments?.[0];
    const itemData = {
      text: body.content || '',
      attachmentUrl: attachment?.data_url || '',
      fileType: attachment?.file_type || (body.attachments?.length ? 'image' : body.content_type) || 'text',
      rawBody: body,
    };

    // Buffer de 8 segundos para juntar mensajes consecutivos
    if (!messageBuffers.has(bufferKey)) messageBuffers.set(bufferKey, []);
    messageBuffers.get(bufferKey).push(itemData);

    setTimeout(async () => {
      const buffer = messageBuffers.get(bufferKey);
      if (!buffer || buffer.length === 0) return;
      messageBuffers.delete(bufferKey);

      // Combinar textos
      const textParts = buffer.map(item => item.text).filter(Boolean);
      let combinedMessage = textParts.join(' ').trim();

      // Buscar si hubo algún archivo adjunto en los mensajes del buffer
      const itemWithAttachment = buffer.find(item => item.attachmentUrl);
      const attachmentUrl = itemWithAttachment?.attachmentUrl || '';
      const contentType = itemWithAttachment?.fileType || 'text';
      const lastBody = buffer[buffer.length - 1].rawBody;

      // Si es audio, transcribir con Whisper de OpenAI
      if (contentType === 'audio' && attachmentUrl) {
        const audioText = await transcribeAudio(attachmentUrl);
        if (audioText) {
          combinedMessage = combinedMessage ? `${combinedMessage} ${audioText}` : audioText;
        }
      }

      // Si es imagen, analizar con GPT-4o-mini Vision
      if (contentType === 'image' && attachmentUrl) {
        const imageText = await analyzeImage(attachmentUrl, combinedMessage);
        if (imageText) {
          combinedMessage = imageText;
        }
      }

      // Si no hubo texto pero sí imagen/audio/video, asignar mensaje por defecto para que Dify procese
      if (!combinedMessage) {
        if (contentType === 'image') {
          combinedMessage = 'Analiza la imagen adjunta y responde a la consulta del usuario.';
        } else if (contentType === 'audio') {
          combinedMessage = 'Nota de voz recibida pero no se pudo transcribir.';
        } else if (contentType === 'video') {
          combinedMessage = 'Video adjunto.';
        } else {
          return; // No hay texto ni archivo
        }
      }

      try {
        console.log(`[Bridge] Enviando a Dify: Conv ${conversationId} | Tipo: ${contentType} | Query: "${combinedMessage}" | Url: ${attachmentUrl.substring(0, 60)}...`);

        // Enviar a Dify
        const difyRes = await axios.post(`${DIFY_URL}/chat-messages`, {
          inputs: {
            conversation_id: String(conversationId),
            contact_name: lastBody.sender?.name || 'Usuario',
            // Stable key for the lead and telegram_msg_id lookup. Never use a
            // display name or @username here: both can vary across events.
            user_id: contactKey,
            // Presentation-only value for the Instagram link shown in Telegram.
            instagram_username: getInstagramUsername(lastBody),
            content_type: contentType,
            attachment_url: attachmentUrl,
            message_type: lastBody.message_type || 'incoming',
            bot_paused: Boolean(conversation.custom_attributes?.bot_paused),
            current_time: new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas', dateStyle: 'full', timeStyle: 'short' }),
            current_hour: new Date().toLocaleTimeString('es-VE', { timeZone: 'America/Caracas', hour: '2-digit', hour12: false }),
            canal: INBOX_CHANNEL[inboxId] || 'instagram',
          },
          query: combinedMessage,
          response_mode: 'blocking',
          user: contactKey,
          conversation_id: '',
        }, {
          headers: {
            Authorization: `Bearer ${difyKey}`,
            'Content-Type': 'application/json',
          },
        });

        let answer = difyRes.data?.answer;
        if (!answer) return;

        // Limpiar Markdown y enviar a Chatwoot
        answer = answer.replace(/\*\*/g, '').replace(/###/g, '').replace(/^#\s/gm, '').trim();

        await axios.post(`${CHATWOOT_URL}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`, {
          content: answer,
          message_type: 'outgoing',
          private: false,
          content_attributes: { sent_by: 'habioo_bot', automation: true },
        }, { headers: { api_access_token: CHATWOOT_TOKEN } });
      } catch (err) {
        console.error('Error procesando Dify/Chatwoot:', err.response?.data || err.message);
      }
    }, 8000);
  }
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Chatwoot-Dify Bridge corriendo en puerto ${PORT}`));
}

module.exports = { app, buildContactKey, getInstagramUsername, getStableContactIdentity };
