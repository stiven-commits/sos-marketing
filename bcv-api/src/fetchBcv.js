// HTTP hacia bcv.org.ve con TLS verificado. El BCV envía un intermedio equivocado,
// así que se añade el intermedio correcto SOLO para este agente (nunca rejectUnauthorized:false).
import fs from 'node:fs';
import tls from 'node:tls';
import { Agent, fetch } from 'undici';

const pem = fs.readFileSync(new URL('../certs/sectigo-dv-r36.pem', import.meta.url), 'utf8');
const agent = new Agent({ connect: { ca: [...tls.rootCertificates, pem] } });

export class BcvTlsError extends Error {}

export async function fetchBcv(url, { binario = false, timeoutMs = 20000 } = {}) {
  if (new URL(url).hostname !== 'www.bcv.org.ve') throw new Error('fetchBcv solo admite www.bcv.org.ve');
  try {
    const res = await fetch(url, {
      dispatcher: agent,
      headers: { 'user-agent': 'bcv-api/1.0 (+sosmarketing.agency)' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw Object.assign(new Error(`BCV ${res.status} en ${url}`), { status: res.status });
    return binario ? Buffer.from(await res.arrayBuffer()) : await res.text();
  } catch (e) {
    const code = e?.cause?.code ?? e?.code ?? '';
    if (/CERT|SELF_SIGNED|UNABLE_TO_VERIFY/.test(code)) throw new BcvTlsError(`TLS del BCV no verificable (${code})`);
    throw e;
  }
}
