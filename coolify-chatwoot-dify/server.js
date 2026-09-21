const https = require('https');
const insecureAgent = new https.Agent({ rejectUnauthorized: false });

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

const messageBuffers = new Map(); // Anti-ráfaga de mensajes de Instagram

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

    const senderId = body.sender?.id || 'anon';
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

      // Si no hubo texto pero sí imagen/audio/video, asignar mensaje por defecto para que Dify procese
      if (!combinedMessage) {
        if (contentType === 'image') {
          combinedMessage = 'Analiza la imagen adjunta y responde a la consulta del usuario.';
        } else if (contentType === 'audio') {
          combinedMessage = 'Nota de voz adjunta.';
        } else if (contentType === 'video') {
          combinedMessage = 'Video adjunto.';
        } else {
          return; // No hay texto ni archivo
        }
      }

      // Si es imagen, convertir a Base64 para que OpenAI la procese sin problemas de certificados ni bloqueos de Meta
      let finalAttachmentUrl = attachmentUrl;
      if (contentType === 'image' && attachmentUrl) {
        finalAttachmentUrl = await getAttachmentAsBase64(attachmentUrl);
      }

      try {
        console.log(`[Bridge] Enviando a Dify: Conv ${conversationId} | Tipo: ${contentType} | Query: "${combinedMessage}" | Url: ${attachmentUrl.substring(0, 60)}...`);

        // Enviar a Dify
        const difyRes = await axios.post(`${DIFY_URL}/chat-messages`, {
          inputs: {
            conversation_id: String(conversationId),
            contact_name: lastBody.sender?.name || 'Usuario',
            user_id: lastBody.conversation?.contact_inbox?.source_id || lastBody.sender?.additional_attributes?.social_profiles?.instagram || String(senderId),
            content_type: contentType,
            attachment_url: finalAttachmentUrl,
            message_type: lastBody.message_type || 'incoming',
            bot_paused: Boolean(conversation.custom_attributes?.bot_paused),
          },
          query: combinedMessage,
          response_mode: 'blocking',
          user: `chatwoot_${senderId}`,
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
app.listen(PORT, () => console.log(`Chatwoot-Dify Bridge corriendo en puerto ${PORT}`));
