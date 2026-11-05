import { fileURLToPath } from 'node:url';
import express from 'express';
import { getMeta } from './db.js';
import { ultimaTasa, tasaVigenteEn, primeraFechaValor } from './store.js';
import { confirmarPendiente, importarHistorial } from './jobs.js';
import { ahoraCaracas } from './tiempo.js';

const MONEDAS = ['USD', 'EUR'];
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

const publica = (f) => f && ({
  moneda: f.moneda, tasa: f.tasa, fechaValor: f.fecha_valor, fechaOperacion: f.fecha_operacion,
  publicadoEn: f.publicado_en, fuente: f.fuente, provisional: f.provisional ?? false,
});

// Igual que dolarapi: fechaActualizacion = medianoche (Caracas) de la fecha valor.
// La hora real de publicación del BCV va aparte, en `publicadoEn`.
const fechaActualizacion = (fechaValor) => `${fechaValor}T00:00:00-04:00`;

const MENSAJE_SIN_TASA = {
  'sin-datos': 'aún no hay tasas cargadas',
  'antes-del-historial': 'la fecha es anterior al historial disponible',
  hueco: 'falta la publicación del BCV que cubre esa fecha',
};

export function crearApp(db) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '5mb' }));

  // Lectura pública desde cualquier origen (apps web, n8n, etc.). Las rutas /v1/admin no llevan CORS.
  app.use((req, res, next) => {
    if (!req.path.startsWith('/v1/admin')) {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      if (req.method === 'OPTIONS') return res.sendStatus(204);
    }
    next();
  });

  // Página de documentación de las rutas (estática, en public/).
  app.use(express.static(fileURLToPath(new URL('../public', import.meta.url)), { maxAge: '5m' }));

  const exigirAdmin = (req, res, next) => {
    const token = process.env.ADMIN_TOKEN;
    if (!token || req.get('authorization') !== `Bearer ${token}`) return res.status(401).json({ error: 'no autorizado' });
    next();
  };

  /** Responde 404 con el motivo y desde cuándo hay historial, para que el cliente decida su respaldo. */
  const sinTasa = (res, r, extra = {}) => res.status(404).json({
    error: MENSAJE_SIN_TASA[r.sinTasa] ?? 'sin tasa', motivo: r.sinTasa, historialDesde: primeraFechaValor(db), ...extra,
  });

  app.get('/health', (_req, res) => {
    const ult = ultimaTasa(db, 'USD');
    res.json({
      ok: true,
      ultimaFechaValor: ult?.fecha_valor ?? null,
      primeraFechaValor: primeraFechaValor(db),
      ultimoExcel: getMeta(db, 'ultimo_excel'),
      historialCargado: getMeta(db, 'historial_cargado'),
    });
  });

  // Tasa vigente "hoy". Incluye promedio/fecha/fechaActualizacion por compatibilidad con dolarapi.
  app.get('/v1/oficial', (req, res) => {
    const moneda = String(req.query.moneda || 'USD').toUpperCase();
    if (!MONEDAS.includes(moneda)) return res.status(400).json({ error: 'moneda debe ser USD o EUR' });
    const f = tasaVigenteEn(db, moneda, ahoraCaracas().fecha);
    if (f.sinTasa) return sinTasa(res, f);
    res.json({ promedio: f.tasa, fecha: f.fecha_valor, fechaActualizacion: fechaActualizacion(f.fecha_valor), ...publica(f) });
  });

  // Tasa aplicable a una fecha: la última anunciada ANTES de ese día.
  app.get('/v1/tasa', (req, res) => {
    const moneda = String(req.query.moneda || 'USD').toUpperCase();
    const fecha = String(req.query.fecha || ahoraCaracas().fecha);
    if (!MONEDAS.includes(moneda)) return res.status(400).json({ error: 'moneda debe ser USD o EUR' });
    if (!FECHA.test(fecha)) return res.status(400).json({ error: 'fecha debe ser YYYY-MM-DD' });
    const f = tasaVigenteEn(db, moneda, fecha);
    if (f.sinTasa) return sinTasa(res, f, { fechaConsulta: fecha, moneda });
    res.json({ fechaConsulta: fecha, ...publica(f) });
  });

  // Histórico por fecha valor (descendente).
  app.get('/v1/historico', (req, res) => {
    const moneda = String(req.query.moneda || 'USD').toUpperCase();
    const desde = String(req.query.desde || '0000-01-01');
    const hasta = String(req.query.hasta || '9999-12-31');
    if (!MONEDAS.includes(moneda) || !FECHA.test(desde) && req.query.desde || !FECHA.test(hasta) && req.query.hasta) {
      return res.status(400).json({ error: 'parámetros inválidos' });
    }
    const filas = db.prepare('SELECT * FROM tasas WHERE moneda=? AND fecha_valor BETWEEN ? AND ? ORDER BY fecha_valor DESC')
      .all(moneda, desde, hasta);
    res.json(filas.map(publica));
  });

  // --- Rutas con el mismo formato que dolarapi (ve.dolarapi.com), para cambiar solo la URL base. ---
  // El BCV solo publica Venta (ASK); `compra` va null y `promedio` = `venta`.
  const SLUG = { dolares: 'USD', euros: 'EUR' };
  const NOMBRE = { USD: 'Dólar', EUR: 'Euro' };

  app.get('/v1/:slug(dolares|euros)/oficial', (req, res) => {
    const moneda = SLUG[req.params.slug];
    const f = tasaVigenteEn(db, moneda, ahoraCaracas().fecha);
    if (f.sinTasa) return sinTasa(res, f);
    res.json({
      moneda, fuente: 'oficial', nombre: NOMBRE[moneda], compra: null, venta: f.tasa, promedio: f.tasa,
      fechaActualizacion: fechaActualizacion(f.fecha_valor), fecha: f.fecha_valor,
    });
  });

  const itemHistorico = (f) => ({ fuente: 'oficial', compra: null, venta: f.tasa, promedio: f.tasa, fecha: f.fecha_valor });

  app.get('/v1/historicos/:slug(dolares|euros)/oficial', (req, res) => {
    const { desde = '0000-01-01', hasta = '9999-12-31' } = req.query;
    if (!FECHA.test(desde) && req.query.desde || !FECHA.test(hasta) && req.query.hasta) {
      return res.status(400).json({ error: 'desde/hasta deben ser YYYY-MM-DD' });
    }
    const filas = db.prepare('SELECT * FROM tasas WHERE moneda=? AND fecha_valor BETWEEN ? AND ? ORDER BY fecha_valor ASC')
      .all(SLUG[req.params.slug], desde, hasta);
    res.json(filas.map(itemHistorico));
  });

  // Fila exacta de esa fecha valor (como dolarapi). Para "la tasa que aplica a un día" usar /v1/tasa.
  app.get('/v1/historicos/:slug(dolares|euros)/oficial/:fecha', (req, res) => {
    if (!FECHA.test(req.params.fecha)) return res.status(400).json({ error: 'fecha debe ser YYYY-MM-DD' });
    const f = db.prepare('SELECT * FROM tasas WHERE moneda=? AND fecha_valor=?').get(SLUG[req.params.slug], req.params.fecha);
    if (!f) return res.status(404).json({ error: 'sin tasa con esa fecha valor' });
    res.json(itemHistorico(f));
  });

  app.get('/v1/admin/pendientes', exigirAdmin, (_req, res) => {
    res.json(db.prepare("SELECT * FROM pendientes WHERE estado='pendiente' ORDER BY id").all());
  });

  app.post('/v1/admin/pendientes/:id/confirmar', exigirAdmin, (req, res) => {
    const par = confirmarPendiente(db, Number(req.params.id), ahoraCaracas().fecha);
    if (!par) return res.status(404).json({ error: 'pendiente no encontrado' });
    res.json({ confirmada: par });
  });

  // Rellena huecos con el historial de otro sistema. Nunca pisa lo leído del BCV.
  app.post('/v1/admin/importar', exigirAdmin, (req, res) => {
    try {
      res.json(importarHistorial(db, req.body, { hoy: ahoraCaracas().fecha }));
    } catch (e) {
      res.status(e.status ?? 500).json({ error: e.message });
    }
  });

  return app;
}
