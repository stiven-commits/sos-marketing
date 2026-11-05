import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { abrirDb } from '../src/db.js';
import { parseNumeroVenezolano, leerPortal, listarExcels, leerExcel } from '../src/parse.js';
import { guardarTasa, tasaVigenteEn } from '../src/store.js';
import { validarPar } from '../src/validate.js';
import { persistirPar } from '../src/jobs.js';

const fx = (n, enc) => fs.readFileSync(new URL(`./fixtures/${n}`, import.meta.url), enc);

test('parseNumeroVenezolano', () => {
  assert.equal(parseNumeroVenezolano('1.006,03263992'), 1006.03263992);
  assert.equal(parseNumeroVenezolano(' 894,88760000 '), 894.8876);
});

test('leerPortal', () => {
  const p = leerPortal(fx('portal.html', 'utf8'));
  assert.deepEqual(p, { usd: 894.8876, eur: 1006.03263992, fechaValor: '2026-11-05' });
  assert.equal(leerPortal('<html>nada</html>'), null);
});

test('listarExcels trae el trimestre actual', () => {
  const l = listarExcels(fx('smc.html', 'utf8'));
  assert.equal(l[0].anio, 2026);
  assert.ok(l.some((x) => x.url.endsWith('2_1_2d26_smc.xls') && x.trimestre === 4));
});

const filas = leerExcel(fx('2_1_2d26_smc.xls'));

test('leerExcel reproduce las 23 publicaciones de oct–nov', () => {
  assert.equal(filas.length, 23);
  const por = Object.fromEntries(filas.map((f) => [f.fechaOperacion, f]));
  assert.equal(por['2026-10-01'].fechaValor, '2026-10-02');
  assert.equal(por['2026-10-02'].fechaValor, '2026-10-05');
  assert.equal(por['2026-10-09'].fechaValor, '2026-10-13'); // feriado 12-oct
  assert.equal(por['2026-10-23'].fechaValor, '2026-10-27');
  assert.equal(por['2026-10-30'].fechaValor, '2026-11-02');
  assert.equal(por['2026-10-01'].usd, 866.5612);
  assert.equal(por['2026-10-01'].publicadoA, '2026-10-01T16:14:00-04:00');
  assert.ok(filas.every((f) => f.eur > 10));
});

function dbConExcel() {
  const db = abrirDb(':memory:');
  for (const f of filas) {
    for (const [moneda, tasa] of [['USD', f.usd], ['EUR', f.eur]]) {
      guardarTasa(db, { fechaValor: f.fechaValor, moneda, tasa, fechaOperacion: f.fechaOperacion, fuente: 'BCV excel' });
    }
  }
  return db;
}

test('regla única: sábado/domingo/feriado usan lo anunciado el último día hábil anterior', () => {
  const db = dbConExcel();
  const dia = (f) => tasaVigenteEn(db, 'USD', f);
  assert.equal(dia('2026-10-31').fecha_operacion, '2026-10-30'); // sábado
  assert.equal(dia('2026-10-31').fecha_valor, '2026-11-02');
  assert.equal(dia('2026-11-01').fecha_valor, '2026-11-02'); // domingo
  assert.equal(dia('2026-10-12').fecha_valor, '2026-10-13'); // lunes feriado
  assert.equal(dia('2026-10-29').fecha_operacion, '2026-10-28'); // hábil: = fecha valor del día
  assert.equal(dia('2026-10-29').fecha_valor, '2026-10-29');
  assert.equal(dia('2026-10-31').provisional, false);
  assert.equal(dia('2026-12-01').provisional, true); // posterior a lo publicado
});

test('validaciones', () => {
  const db = dbConExcel();
  const hoy = '2026-11-05';
  assert.equal(validarPar(db, { fechaValor: '2026-11-05', usd: 894.8876, eur: 1006.03 }, { hoy, backfill: true }).ok, true);
  assert.match(validarPar(db, { fechaValor: '2026-11-06', usd: 895, eur: 1.006 }, { hoy }).rechazo, /EUR=1.006/);
  assert.match(validarPar(db, { fechaValor: '2026-11-06', usd: 895, eur: 2000 }, { hoy }).rechazo, /cociente/);
  assert.match(validarPar(db, { fechaValor: '2026-11-20', usd: 895, eur: 1006 }, { hoy }).rechazo, /por delante/);
  const salto = validarPar(db, { fechaValor: '2026-11-06', usd: 1100, eur: 1240 }, { hoy });
  assert.equal(salto.requiereConfirmacion, true);
});

test('precedencia: el Excel corrige al portal, el portal no pisa al Excel', async () => {
  const db = abrirDb(':memory:');
  const p = { fechaValor: '2026-11-05', usd: 894.8876, eur: 1006.03 };
  await persistirPar(db, p, { fuente: 'BCV portal', fechaOperacion: '2026-11-04', hoy: '2026-11-04' });
  await persistirPar(db, { ...p, usd: 894.9 }, { fuente: 'BCV excel', fechaOperacion: '2026-11-04', hoy: '2026-11-04' });
  assert.equal(tasaVigenteEn(db, 'USD', '2026-11-05').tasa, 894.9);
  const r = await persistirPar(db, p, { fuente: 'BCV portal', fechaOperacion: '2026-11-04', hoy: '2026-11-04' });
  assert.equal(r.estado, 'ignorada');
  assert.equal(tasaVigenteEn(db, 'USD', '2026-11-05').fuente, 'BCV excel');
});

test('dolarapi rellena fecha_operacion con la fecha valor anterior', () => {
  const db = abrirDb(':memory:');
  guardarTasa(db, { fechaValor: '2026-10-30', moneda: 'USD', tasa: 889, fuente: 'dolarapi' });
  guardarTasa(db, { fechaValor: '2026-11-02', moneda: 'USD', tasa: 889.5754, fuente: 'dolarapi' });
  assert.equal(tasaVigenteEn(db, 'USD', '2026-10-31').tasa, 889.5754);
});
