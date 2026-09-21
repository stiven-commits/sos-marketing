const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

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

    const content = body.content || '';
    const senderId = body.sender?.id || 'anon';
    const bufferKey = `${inboxId}_${conversationId}`;

    // Buffer de 8 segundos para juntar mensajes consecutivos
    if (!messageBuffers.has(bufferKey)) messageBuffers.set(bufferKey, []);
    messageBuffers.get(bufferKey).push(content);

    setTimeout(async () => {
      const buffer = messageBuffers.get(bufferKey);
      if (!buffer || buffer.length === 0) return;
      messageBuffers.delete(bufferKey);

      const combinedMessage = buffer.join(' ').trim();
      if (!combinedMessage) return;

      try {
        // Enviar a Dify
        const difyRes = await axios.post(`${DIFY_URL}/chat-messages`, {
          inputs: {
            conversation_id: String(conversationId),
            contact_name: body.sender?.name || 'Usuario',
            user_id: body.conversation?.contact_inbox?.source_id || body.sender?.additional_attributes?.social_profiles?.instagram || String(senderId),
            content_type: body.attachments?.[0]?.file_type || body.content_type || 'text',
            attachment_url: body.attachments?.[0]?.data_url || '',
            message_type: body.message_type || 'incoming',
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
        console.error('Error procesando Dify/Chatwoot:', err.message);
      }
    }, 8000);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Chatwoot-Dify Bridge corriendo en puerto ${PORT}`));
