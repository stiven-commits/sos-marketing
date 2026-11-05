import { getMeta, setMeta } from './db.js';
import { fetchBcv, BcvTlsError } from './fetchBcv.js';
import { URL_PORTAL, URL_LISTADO, leerPortal, leerExcel, listarExcels, urlExcelPorPatron } from './parse.js';
import { guardarTasa, ultimaFechaValor } from './store.js';
import { validarPar } from './validate.js';
import { alertar } from './alerta.js';

/** Valida y guarda USD+EUR de una publicación. Devuelve estado legible. */
export async function persistirPar(db, par, { fuente, fechaOperacion = null, publicadoEn = null, hoy, backfill = false }) {
  const v = validarPar(db, par, { hoy, backfill });
  if (!v.ok) {
    if (v.requiereConfirmacion) {
      db.prepare('INSERT INTO pendientes(payload,motivo) VALUES(?,?)')
        .run(JSON.stringify({ par, fuente, fechaOperacion, publicadoEn }), v.rechazo);
    }
    await alertar(db, { clave: `rechazo:${par.fechaValor}`, titulo: `Tasa BCV rechazada (${fuente})`, detalle: v.rechazo }, hoy);
    return { estado: v.requiereConfirmacion ? 'pendiente' : 'rechazada', motivo: v.rechazo };
  }
  const base = { fechaValor: par.fechaValor, fechaOperacion, publicadoEn, fuente };
  const r = [guardarTasa(db, { ...base, moneda: 'USD', tasa: par.usd }), guardarTasa(db, { ...base, moneda: 'EUR', tasa: par.eur })];
  if (r.includes('conflicto')) {
    await alertar(db, { clave: `conflicto:${par.fechaValor}`, titulo: 'Portal y Excel del BCV difieren', detalle: `fecha valor ${par.fechaValor}: se conserva ${fuente}` }, hoy);
  }
  return { estado: r.every((x) => x === 'ignorada') ? 'ignorada' : 'guardada', detalle: r };
}

/** Lee el portal; si trae una fecha valor nueva, la guarda. Idempotente. */
export async function capturarPortal(db, ctx) {
  const html = await fetchBcv(URL_PORTAL);
  const p = leerPortal(html);
  if (!p) {
    await alertar(db, { clave: 'portal-ilegible', titulo: 'No se reconoce el portal del BCV', detalle: 'cambió el HTML; revisar el parser' }, ctx.hoy);
    return { estado: 'ilegible' };
  }
  const ult = ultimaFechaValor(db);
  if (ult && p.fechaValor <= ult) return { estado: 'sin-novedad', fechaValor: p.fechaValor };
  const r = await persistirPar(db, p, { fuente: 'BCV portal', fechaOperacion: ctx.hoy, publicadoEn: new Date().toISOString(), hoy: ctx.hoy });
  if (r.estado === 'guardada') setMeta(db, 'captura_portal_dia', ctx.hoy);
  return { ...r, fechaValor: p.fechaValor };
}

/** Lee el Excel del trimestre (y el anterior al inicio de trimestre) y rellena/confirma. */
export async function sincronizarExcel(db, ctx) {
  const [anio, mes, dia] = ctx.hoy.split('-').map(Number);
  const q = Math.ceil(mes / 3);
  const objetivos = [{ anio, trimestre: q }];
  if ((mes - 1) % 3 === 0 && dia <= 10) objetivos.push(q === 1 ? { anio: anio - 1, trimestre: 4 } : { anio, trimestre: q - 1 });
  let listado = [];
  try { listado = listarExcels(await fetchBcv(URL_LISTADO)); } catch { /* se usa el patrón */ }
  const resumen = [];
  for (const o of objetivos) {
    const url = listado.find((x) => x.anio === o.anio && x.trimestre === o.trimestre)?.url ?? urlExcelPorPatron(o.anio, o.trimestre);
    const filas = leerExcel(await fetchBcv(url, { binario: true }));
    let guardadas = 0;
    for (const f of filas) {
      const r = await persistirPar(db, { fechaValor: f.fechaValor, usd: f.usd, eur: f.eur }, {
        fuente: 'BCV excel', fechaOperacion: f.fechaOperacion, publicadoEn: f.publicadoA, hoy: ctx.hoy, backfill: true,
      });
      if (r.estado === 'guardada') guardadas++;
    }
    resumen.push({ url, hojas: filas.length, guardadas });
  }
  setMeta(db, 'ultimo_excel', ctx.hoy);
  return resumen;
}

/** 20:00 de un día hábil: ¿faltó la tasa? Si sí, alarma (el Excel de las 07:00 la recupera si el BCV publica tarde). */
export async function cierreDelDia(db, ctx) {
  if (getMeta(db, 'captura_portal_dia') === ctx.hoy) return { estado: 'ok' };
  const ult = ultimaFechaValor(db);
  // Solo se espera tasa nueva si la última vigente vence hoy o antes (así los feriados no alarman).
  if (ult && ult > ctx.hoy) return { estado: 'no-se-esperaba' };
  await alertar(db, { clave: 'sin-tasa', titulo: 'No hay tasa BCV nueva', detalle: `última fecha valor: ${ult ?? 'ninguna'}` }, ctx.hoy);
  return { estado: 'sin-tasa' };
}

export function confirmarPendiente(db, id, hoy) {
  const fila = db.prepare("SELECT * FROM pendientes WHERE id=? AND estado='pendiente'").get(id);
  if (!fila) return null;
  const { par, fuente, fechaOperacion, publicadoEn } = JSON.parse(fila.payload);
  const base = { fechaValor: par.fechaValor, fechaOperacion, publicadoEn, fuente };
  guardarTasa(db, { ...base, moneda: 'USD', tasa: par.usd });
  guardarTasa(db, { ...base, moneda: 'EUR', tasa: par.eur });
  db.prepare("UPDATE pendientes SET estado='confirmada' WHERE id=?").run(id);
  setMeta(db, 'captura_portal_dia', hoy);
  return par;
}

export { BcvTlsError };
