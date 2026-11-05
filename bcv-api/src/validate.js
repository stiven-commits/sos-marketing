import { tasaAnterior, ultimaFechaValor } from './store.js';

const MAX_VARIACION = 0.10;
const MAX_DIAS_ADELANTE = 5;

const diasEntre = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

/**
 * Valida un par { fechaValor, usd, eur } antes de guardarlo.
 * @returns {{ok:boolean, rechazo?:string, requiereConfirmacion?:boolean}}
 *  - rechazo: la tasa no se guarda (datos imposibles).
 *  - requiereConfirmacion: salto grande; se aparta en `pendientes` hasta que alguien lo confirme.
 */
export function validarPar(db, { fechaValor, usd, eur }, { hoy, backfill = false } = {}) {
  if (!(usd > 0) || !(eur > 0)) return { ok: false, rechazo: 'USD y EUR deben ser > 0' };
  if (eur < 10) return { ok: false, rechazo: `EUR=${eur} < 10 Bs (posible error de escala)` };
  const cociente = eur / usd;
  if (cociente < 0.9 || cociente > 1.4) return { ok: false, rechazo: `cociente EUR/USD=${cociente.toFixed(3)} fuera de 0,9–1,4` };
  if (hoy && diasEntre(hoy, fechaValor) > MAX_DIAS_ADELANTE) return { ok: false, rechazo: `fecha valor ${fechaValor} más de ${MAX_DIAS_ADELANTE} días por delante de hoy` };
  if (!backfill) {
    const ult = ultimaFechaValor(db);
    if (ult && fechaValor < ult) return { ok: false, rechazo: `fecha valor ${fechaValor} anterior a la última guardada (${ult})` };
  }
  for (const [moneda, tasa] of [['USD', usd], ['EUR', eur]]) {
    const prev = tasaAnterior(db, moneda, fechaValor);
    if (prev && Math.abs(tasa / prev.tasa - 1) > MAX_VARIACION) {
      return {
        ok: false,
        requiereConfirmacion: true,
        rechazo: `${moneda} varía ${(100 * (tasa / prev.tasa - 1)).toFixed(1)} % frente a ${prev.fecha_valor} (${prev.tasa})`,
      };
    }
  }
  return { ok: true };
}
