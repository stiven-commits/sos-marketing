import express from 'express';
import { getMeta } from './db.js';
import { ultimaTasa, tasaVigenteEn } from './store.js';
import { confirmarPendiente } from './jobs.js';
import { ahoraCaracas } from './tiempo.js';

const MONEDAS = ['USD', 'EUR'];
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

const publica = (f) => f && ({
  moneda: f.moneda, tasa: f.tasa, fechaValor: f.fecha_valor, fechaOperacion: f.fecha_operacion,
  publicadoEn: f.publicado_en, fuente: f.fuente, provisional: f.provisional ?? false,
});

export function crearApp(db) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());

  const exigirAdmin = (req, res, next) => {
    const token = process.env.ADMIN_TOKEN;
    if (!token || req.get('authorization') !== `Bearer ${token}`) return res.status(401).json({ error: 'no autorizado' });
    next();
  };

  app.get('/health', (_req, res) => {
    const ult = ultimaTasa(db, 'USD');
    res.json({ ok: true, ultimaFechaValor: ult?.fecha_valor ?? null, ultimoExcel: getMeta(db, 'ultimo_excel') });
  });

  // Tasa vigente "hoy" (última publicada). Incluye promedio/fecha/fechaActualizacion por compatibilidad.
  app.get('/v1/oficial', (req, res) => {
    const moneda = String(req.query.moneda || 'USD').toUpperCase();
    if (!MONEDAS.includes(moneda)) return res.status(400).json({ error: 'moneda debe ser USD o EUR' });
    const f = tasaVigenteEn(db, moneda, ahoraCaracas().fecha);
    if (!f) return res.status(404).json({ error: 'sin datos' });
    res.json({ promedio: f.tasa, fecha: f.fecha_valor, fechaActualizacion: f.publicado_en ?? f.updated_at, ...publica(f) });
  });

  // Tasa aplicable a una fecha: la última anunciada ANTES de ese día.
  app.get('/v1/tasa', (req, res) => {
    const moneda = String(req.query.moneda || 'USD').toUpperCase();
    const fecha = String(req.query.fecha || ahoraCaracas().fecha);
    if (!MONEDAS.includes(moneda)) return res.status(400).json({ error: 'moneda debe ser USD o EUR' });
    if (!FECHA.test(fecha)) return res.status(400).json({ error: 'fecha debe ser YYYY-MM-DD' });
    const f = tasaVigenteEn(db, moneda, fecha);
    if (!f) return res.status(404).json({ error: 'sin datos' });
    res.json({ fechaConsulta: fecha, ...publica(f) });
  });

  // Histórico por fecha valor.
  app.get('/v1/historico', (req, res) => {
    const moneda = String(req.query.moneda || 'USD').toUpperCase();
    const desde = String(req.query.desde || '0000-01-01');
    const hasta = String(req.query.hasta || '9999-12-31');
    if (!MONEDAS.includes(moneda) || !FECHA.test(desde) && req.query.desde || !FECHA.test(hasta) && req.query.hasta) {
      return res.status(400).json({ error: 'parámetros inválidos' });
    }
    const filas = db.prepare('SELECT * FROM tasas WHERE moneda=? AND fecha_valor BETWEEN ? AND ? ORDER BY fecha_valor DESC LIMIT 1000')
      .all(moneda, desde, hasta);
    res.json(filas.map(publica));
  });

  app.get('/v1/admin/pendientes', exigirAdmin, (_req, res) => {
    res.json(db.prepare("SELECT * FROM pendientes WHERE estado='pendiente' ORDER BY id").all());
  });

  app.post('/v1/admin/pendientes/:id/confirmar', exigirAdmin, (req, res) => {
    const par = confirmarPendiente(db, Number(req.params.id), ahoraCaracas().fecha);
    if (!par) return res.status(404).json({ error: 'pendiente no encontrado' });
    res.json({ confirmada: par });
  });

  return app;
}
