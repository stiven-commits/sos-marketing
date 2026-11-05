import { tasaAnterior, ultimaFechaValor } from './store.js';

const MAX_VARIACION = 0.10;
const MAX_DIAS_ADELANTE = 5;
// La variación solo se compara contra una tasa cercana: tras un hueco del historial (o en una carga
// histórica fuera de orden) la "anterior" puede ser de semanas atrás y un salto grande es legítimo.
const MAX_DIAS_VECINA = 7;
// Cociente EUR/USD. Detecta errores de escala (1.006 en vez de 1.006,03 da un cociente de 0,001) sin
// depender del nivel del bolívar: en 2022 el euro valía 5 Bs, así que un mínimo fijo en Bs no sirve.
const COCIENTE_MIN = 0.9;
const COCIENTE_MAX = 1.4;

const diasEntre = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

/**
 * Valida un par { fechaValor, usd, eur } antes de guardarlo.
 * @returns {{ok:boolean, rechazo?:string, requiereConfirmacion?:boolean}}
 *  - rechazo: la tasa no se guarda (datos imposibles).
 *  - requiereConfirmacion: salto grande; se aparta en `pendientes` hasta que alguien lo confirme.
 */
export function validarPar(db, { fechaValor, usd, eur }, { hoy, backfill = false, historial = false } = {}) {
  if (!(usd > 0) || !(eur > 0)) return { ok: false, rechazo: 'USD y EUR deben ser > 0' };
  const cociente = eur / usd;
  if (cociente < COCIENTE_MIN || cociente > COCIENTE_MAX) {
    return { ok: false, rechazo: `cociente EUR/USD=${cociente.toFixed(3)} fuera de ${COCIENTE_MIN}–${COCIENTE_MAX} (USD=${usd}, EUR=${eur}; posible error de escala)` };
  }
  if (hoy && diasEntre(hoy, fechaValor) > MAX_DIAS_ADELANTE) return { ok: false, rechazo: `fecha valor ${fechaValor} más de ${MAX_DIAS_ADELANTE} días por delante de hoy` };
  if (!backfill) {
    const ult = ultimaFechaValor(db);
    if (ult && fechaValor < ult) return { ok: false, rechazo: `fecha valor ${fechaValor} anterior a la última guardada (${ult})` };
  }
  // Historial oficial del BCV (Excel de años pasados): las devaluaciones reales (p. ej. +25 % en
  // agosto de 2022) no son errores. El freno de saltos protege solo la captura diaria e importaciones.
  if (historial) return { ok: true };
  for (const [moneda, tasa] of [['USD', usd], ['EUR', eur]]) {
    const prev = tasaAnterior(db, moneda, fechaValor);
    if (prev && diasEntre(prev.fecha_valor, fechaValor) <= MAX_DIAS_VECINA && Math.abs(tasa / prev.tasa - 1) > MAX_VARIACION) {
      return {
        ok: false,
        requiereConfirmacion: true,
        rechazo: `${moneda} varía ${(100 * (tasa / prev.tasa - 1)).toFixed(1)} % frente a ${prev.fecha_valor} (${prev.tasa})`,
      };
    }
  }
  return { ok: true };
}

export { COCIENTE_MIN, COCIENTE_MAX };
