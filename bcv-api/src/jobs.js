import { getMeta, setMeta } from './db.js';
import { fetchBcv, BcvTlsError } from './fetchBcv.js';
import { URL_PORTAL, URL_LISTADO, leerPortal, leerExcel, listarExcels, urlExcelPorPatron } from './parse.js';
import { guardarTasa, ultimaFechaValor } from './store.js';
import { validarPar } from './validate.js';
import { alertar } from './alerta.js';

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Valida y guarda USD+EUR de una publicación. Devuelve estado legible.
 * `historial: true` (carga masiva de años pasados): un rechazo no alerta ni va a `pendientes`;
 * se informa en el resumen de la carga.
 */
export async function persistirPar(db, par, { fuente, fechaOperacion = null, publicadoEn = null, hoy, backfill = false, historial = false }) {
  const v = validarPar(db, par, { hoy, backfill: backfill || historial, historial });
  if (!v.ok) {
    if (historial) return { estado: 'rechazada', motivo: v.rechazo };
    if (v.requiereConfirmacion) {
      db.prepare('INSERT INTO pendientes(payload,motivo) VALUES(?,?)')
        .run(JSON.stringify({ par, fuente, fechaOperacion, publicadoEn }), v.rechazo);
    }
    await alertar(db, { clave: `rechazo:${par.fechaValor}`, titulo: `Tasa BCV rechazada (${fuente})`, detalle: v.rechazo }, hoy);
    return { estado: v.requiereConfirmacion ? 'pendiente' : 'rechazada', motivo: v.rechazo };
  }
  const base = { fechaValor: par.fechaValor, fechaOperacion, publicadoEn, fuente };
  const r = [guardarTasa(db, { ...base, moneda: 'USD', tasa: par.usd }), guardarTasa(db, { ...base, moneda: 'EUR', tasa: par.eur })];
  if (r.includes('conflicto') && !historial) {
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

async function listadoExcels() {
  try { return listarExcels(await fetchBcv(URL_LISTADO)); } catch { return []; /* se usa el patrón del nombre */ }
}

/** Descarga y guarda un trimestre. Un 404 no es error: el archivo aún no existe (o nunca existió). */
async function cargarTrimestre(db, { anio, trimestre }, listado, opciones) {
  const url = listado.find((x) => x.anio === anio && x.trimestre === trimestre)?.url ?? urlExcelPorPatron(anio, trimestre);
  let filas;
  try {
    filas = leerExcel(await fetchBcv(url, { binario: true, timeoutMs: 60000 }));
  } catch (e) {
    if (e.status === 404) return { anio, trimestre, url, estado: 'no-existe' };
    throw e;
  }
  let guardadas = 0;
  const rechazadas = [];
  for (const f of filas) {
    const r = await persistirPar(db, { fechaValor: f.fechaValor, usd: f.usd, eur: f.eur }, {
      fuente: 'BCV excel', fechaOperacion: f.fechaOperacion, publicadoEn: f.publicadoA, ...opciones,
    });
    if (r.estado === 'guardada') guardadas++;
    else if (r.estado !== 'ignorada') rechazadas.push({ fechaValor: f.fechaValor, motivo: r.motivo });
  }
  return { anio, trimestre, url, estado: 'leido', hojas: filas.length, guardadas, rechazadas };
}

/**
 * 07:00 diario: Excel del trimestre actual (y del anterior en los primeros 10 días del trimestre).
 * Al empezar un trimestre el BCV tarda unos días en publicar el archivo nuevo: ese 404 no alarma.
 */
export async function sincronizarExcel(db, ctx) {
  const [anio, mes, dia] = ctx.hoy.split('-').map(Number);
  const q = Math.ceil(mes / 3);
  const inicioTrimestre = (mes - 1) % 3 === 0 && dia <= 10;
  const objetivos = [{ anio, trimestre: q }];
  if (inicioTrimestre) objetivos.push(q === 1 ? { anio: anio - 1, trimestre: 4 } : { anio, trimestre: q - 1 });
  const listado = await listadoExcels();
  const resumen = [];
  for (const o of objetivos) {
    try {
      const r = await cargarTrimestre(db, o, listado, { hoy: ctx.hoy, backfill: true });
      if (r.estado === 'no-existe' && !inicioTrimestre) {
        await alertar(db, { clave: 'excel-no-existe', titulo: 'No aparece el Excel del trimestre en el BCV', detalle: r.url }, ctx.hoy);
      }
      resumen.push(r);
    } catch (e) {
      // Un trimestre que falla no impide leer el otro.
      if (e instanceof BcvTlsError) throw e;
      await alertar(db, { clave: `excel-error:${o.anio}-${o.trimestre}`, titulo: 'Fallo leyendo el Excel del BCV', detalle: e.message }, ctx.hoy);
      resumen.push({ ...o, estado: 'error', error: e.message });
    }
  }
  if (resumen.some((r) => r.estado === 'leido')) setMeta(db, 'ultimo_excel', ctx.hoy);
  return resumen;
}

/**
 * Carga todos los trimestres desde `desdeAnio` hasta hoy, en orden. Se usa al arrancar por primera
 * vez (o si nunca se cargó el historial). Idempotente: lo ya guardado por el BCV no se reescribe.
 * Antes de 2022 los archivos del BCV están casi vacíos y cruzan la reconversión de oct-2021.
 */
export async function cargarHistorial(db, ctx, { desdeAnio = Number(process.env.HISTORIAL_DESDE_ANIO || 2022) } = {}) {
  const [anio, mes] = ctx.hoy.split('-').map(Number);
  const qHoy = Math.ceil(mes / 3);
  const listado = await listadoExcels();
  const resumen = [];
  for (let a = desdeAnio; a <= anio; a++) {
    for (let t = 1; t <= 4 && (a < anio || t <= qHoy); t++) {
      try {
        resumen.push(await cargarTrimestre(db, { anio: a, trimestre: t }, listado, { hoy: ctx.hoy, historial: true }));
      } catch (e) {
        if (e instanceof BcvTlsError) throw e;
        resumen.push({ anio: a, trimestre: t, estado: 'error', error: e.message });
      }
    }
  }
  const rechazadas = resumen.flatMap((r) => r.rechazadas ?? []);
  const errores = resumen.filter((r) => r.estado === 'error');
  if (rechazadas.length || errores.length) {
    await alertar(db, {
      clave: 'historial',
      titulo: 'Carga del historial BCV con observaciones',
      detalle: `${rechazadas.length} publicaciones rechazadas, ${errores.length} trimestres con error`,
    }, ctx.hoy);
  }
  if (resumen.some((r) => r.estado === 'leido')) {
    setMeta(db, 'historial_cargado', ctx.hoy);
    setMeta(db, 'ultimo_excel', ctx.hoy);
  }
  return resumen;
}

/**
 * Importa tasas de otro sistema para rellenar huecos del BCV.
 * Acepta [{ fecha|fechaValor, moneda: 'USD'|'EUR', tasa|promedio }]. Fuente 'importado': nunca pisa
 * una tasa leída del BCV, y el BCV la reemplaza si luego aparece. Valida igual que el BCV (cociente
 * EUR/USD y saltos frente a la tasa vecina).
 */
export function importarHistorial(db, filas, { hoy }) {
  if (!Array.isArray(filas)) throw Object.assign(new Error('se espera un arreglo'), { status: 400 });
  const porFecha = new Map();
  const rechazadas = [];
  for (const x of filas) {
    const fecha = String(x?.fechaValor ?? x?.fecha ?? '').slice(0, 10);
    const moneda = String(x?.moneda ?? '').toUpperCase();
    const tasa = Number(x?.tasa ?? x?.promedio);
    if (!FECHA.test(fecha) || !['USD', 'EUR'].includes(moneda) || !(tasa > 0)) {
      rechazadas.push({ fila: x, motivo: 'fila inválida (fecha YYYY-MM-DD, moneda USD|EUR, tasa > 0)' });
      continue;
    }
    porFecha.set(fecha, { ...porFecha.get(fecha), [moneda.toLowerCase()]: tasa });
  }
  const cuenta = { insertada: 0, actualizada: 0, ignorada: 0, conflicto: 0 };
  // En orden ascendente: así cada fila infiere su fecha_operacion de la anterior.
  for (const fecha of [...porFecha.keys()].sort()) {
    const { usd, eur } = porFecha.get(fecha);
    if (usd && eur) {
      const v = validarPar(db, { fechaValor: fecha, usd, eur }, { hoy, backfill: true });
      if (!v.ok) { rechazadas.push({ fecha, motivo: v.rechazo }); continue; }
    }
    for (const [moneda, tasa] of [['USD', usd], ['EUR', eur]]) {
      if (tasa) cuenta[guardarTasa(db, { fechaValor: fecha, moneda, tasa, fuente: 'importado' })]++;
    }
  }
  return { fechas: porFecha.size, ...cuenta, rechazadas };
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
