// Alarma por webhook (pensado para un Webhook de n8n que reenvía a correo/WhatsApp/Telegram).
// Máximo una alarma por clave y por día.
import { getMeta, setMeta } from './db.js';

export async function alertar(db, { clave, titulo, detalle }, hoy) {
  console.error(`[ALERTA] ${titulo} — ${detalle}`);
  if (getMeta(db, `alerta:${clave}`) === hoy) return false;
  setMeta(db, `alerta:${clave}`, hoy);
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ servicio: 'bcv-api', clave, titulo, detalle, fecha: hoy }),
      signal: AbortSignal.timeout(10000),
    });
    return true;
  } catch (e) {
    console.error('[ALERTA] webhook falló:', e.message);
    return false;
  }
}
