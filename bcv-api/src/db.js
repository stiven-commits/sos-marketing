import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export function abrirDb(ruta = process.env.DB_PATH || './data/bcv.db') {
  if (ruta !== ':memory:') fs.mkdirSync(path.dirname(ruta), { recursive: true });
  const db = new DatabaseSync(ruta);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasas (
      fecha_valor     TEXT NOT NULL,            -- YYYY-MM-DD
      moneda          TEXT NOT NULL,            -- USD | EUR
      tasa            REAL NOT NULL,            -- Bs por unidad (Venta/ASK)
      fecha_operacion TEXT,                     -- tarde en que el BCV la publicó
      publicado_en    TEXT,                     -- ISO con offset
      fuente          TEXT NOT NULL,            -- BCV excel | BCV portal | dolarapi
      created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      PRIMARY KEY (fecha_valor, moneda)
    );
    CREATE INDEX IF NOT EXISTS idx_tasas_op ON tasas (moneda, fecha_operacion);
    CREATE TABLE IF NOT EXISTS pendientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payload TEXT NOT NULL,
      motivo TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'pendiente',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
    CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL);
  `);
  return db;
}

export const getMeta = (db, k) => db.prepare('SELECT v FROM meta WHERE k=?').get(k)?.v ?? null;
export const setMeta = (db, k, v) =>
  db.prepare('INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').run(k, String(v));
