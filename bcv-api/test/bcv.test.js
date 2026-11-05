import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { abrirDb } from '../src/db.js';
import { parseNumeroVenezolano, leerPortal, listarExcels, leerExcel } from '../src/parse.js';
import { guardarTasa, tasaVigenteEn } from '../src/store.js';
import { validarPar } from '../src/validate.js';
import { persistirPar, importarHistorial } from '../src/jobs.js';

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

test('sin fecha_operacion explícita se rellena fecha_operacion con la fecha valor anterior', () => {
  const db = abrirDb(':memory:');
  guardarTasa(db, { fechaValor: '2026-10-30', moneda: 'USD', tasa: 889, fuente: 'BCV portal' });
  guardarTasa(db, { fechaValor: '2026-11-02', moneda: 'USD', tasa: 889.5754, fuente: 'BCV portal' });
  assert.equal(tasaVigenteEn(db, 'USD', '2026-10-31').tasa, 889.5754);
});

test('rutas con formato dolarapi', async () => {
  const { crearApp } = await import('../src/app.js');
  const db = dbConExcel();
  const srv = crearApp(db).listen(0);
  const base = `http://127.0.0.1:${srv.address().port}`;
  try {
    const hoy = await (await fetch(`${base}/v1/euros/oficial`)).json();
    assert.equal(hoy.fuente, 'oficial');
    assert.equal(hoy.venta, hoy.promedio);
    assert.ok(hoy.venta > 10);
    const hist = await (await fetch(`${base}/v1/historicos/dolares/oficial?desde=2026-10-01&hasta=2026-10-05`)).json();
    assert.deepEqual(hist.map((h) => h.fecha), ['2026-10-02', '2026-10-05']);
    const uno = await (await fetch(`${base}/v1/historicos/dolares/oficial/2026-11-02`)).json();
    assert.equal(uno.venta, 889.5754);
    assert.equal((await fetch(`${base}/v1/historicos/dolares/oficial/2026-11-01`)).status, 404);
    assert.equal((await fetch(`${base}/v1/monedas/oficial`)).status, 404);
  } finally { srv.close(); }
});

test('nunca devuelve la tasa de hoy para una fecha anterior al historial ni dentro de un hueco', () => {
  const db = dbConExcel();
  assert.deepEqual(tasaVigenteEn(db, 'USD', '2026-10-01'), { sinTasa: 'antes-del-historial' });
  assert.deepEqual(tasaVigenteEn(db, 'USD', '2023-01-10'), { sinTasa: 'antes-del-historial' });
  assert.deepEqual(tasaVigenteEn(abrirDb(':memory:'), 'USD', '2026-11-05'), { sinTasa: 'sin-datos' });
  assert.equal(tasaVigenteEn(db, 'USD', '2026-10-02').tasa, 866.5612); // primera fecha valor del historial
  // Hueco: se borra la publicación del 15-oct (fecha valor 16-oct) y el 16-oct queda sin tasa.
  db.prepare("DELETE FROM tasas WHERE fecha_valor='2026-10-16'").run();
  assert.deepEqual(tasaVigenteEn(db, 'USD', '2026-10-16'), { sinTasa: 'hueco' });
  assert.equal(tasaVigenteEn(db, 'USD', '2026-10-15').fecha_valor, '2026-10-15'); // vecinos intactos
  assert.equal(tasaVigenteEn(db, 'USD', '2026-10-19').fecha_valor, '2026-10-19');
});

test('validaciones sin mínimo fijo en Bs: el historial de 2022 (USD 4,58) es válido', () => {
  const db = abrirDb(':memory:');
  assert.equal(validarPar(db, { fechaValor: '2022-01-04', usd: 4.5877, eur: 5.18566081 }, { hoy: '2026-11-05', backfill: true }).ok, true);
  // El salto solo se mide contra una tasa vecina (≤ 7 días), no a través de un hueco de semanas.
  guardarTasa(db, { fechaValor: '2022-09-07', moneda: 'USD', tasa: 5.5, fechaOperacion: '2022-09-06', fuente: 'BCV excel' });
  guardarTasa(db, { fechaValor: '2022-09-07', moneda: 'EUR', tasa: 5.6, fechaOperacion: '2022-09-06', fuente: 'BCV excel' });
  assert.equal(validarPar(db, { fechaValor: '2022-10-04', usd: 8.17, eur: 8.02 }, { hoy: '2026-11-05', backfill: true }).ok, true);
  assert.equal(validarPar(db, { fechaValor: '2022-09-08', usd: 8.17, eur: 8.02 }, { hoy: '2026-11-05', backfill: true }).requiereConfirmacion, true);
});

test('importarHistorial rellena huecos, no pisa al BCV y aplica la regla de fin de semana', () => {
  const db = dbConExcel();
  const r = importarHistorial(db, [
    { fecha: '2026-09-29', moneda: 'USD', promedio: 857.8876 }, { fecha: '2026-09-29', moneda: 'EUR', promedio: 974.71473336 },
    { fecha: '2026-09-30', moneda: 'USD', promedio: 859.0629 }, { fecha: '2026-09-30', moneda: 'EUR', promedio: 973.30967507 },
    { fecha: '2026-10-01', moneda: 'USD', promedio: 860.1753 }, { fecha: '2026-10-01', moneda: 'EUR', promedio: 976.84087593 },
    { fecha: '2026-10-02', moneda: 'USD', promedio: 1 }, // intenta pisar al BCV: se ignora
    { fecha: '2026-09-28', moneda: 'USD', promedio: 857.0058 }, { fecha: '2026-09-28', moneda: 'EUR', promedio: 0.976 }, // EUR ÷1000
    { fecha: 'mal', moneda: 'USD', promedio: 1 },
  ], { hoy: '2026-11-05' });
  assert.equal(r.insertada, 6);
  assert.equal(r.ignorada, 1);
  assert.equal(r.rechazadas.length, 2);
  assert.equal(tasaVigenteEn(db, 'USD', '2026-10-02').tasa, 866.5612); // sigue el del BCV
  assert.equal(tasaVigenteEn(db, 'USD', '2026-10-01').tasa, 860.1753);
  assert.equal(tasaVigenteEn(db, 'USD', '2026-10-01').fecha_operacion, '2026-09-30'); // inferida
  assert.equal(tasaVigenteEn(db, 'USD', '2026-09-28').sinTasa, 'antes-del-historial'); // la primera no tiene anuncio
});

test('HTTP: 404 explicado para fechas sin tasa, formato dolarapi exacto, CORS y admin', async () => {
  const { crearApp } = await import('../src/app.js');
  const db = dbConExcel();
  process.env.ADMIN_TOKEN = 'secreto-de-prueba';
  const srv = crearApp(db).listen(0);
  const base = `http://127.0.0.1:${srv.address().port}`;
  try {
    const vieja = await fetch(`${base}/v1/tasa?fecha=2025-03-10`);
    assert.equal(vieja.status, 404);
    const cuerpo = await vieja.json();
    assert.equal(cuerpo.motivo, 'antes-del-historial');
    assert.equal(cuerpo.historialDesde, '2026-10-02');

    const futura = await (await fetch(`${base}/v1/tasa?fecha=2030-01-01&moneda=EUR`)).json();
    assert.equal(futura.provisional, true);
    assert.equal(futura.tasa, 1006.03263992);

    const sab = await (await fetch(`${base}/v1/tasa?fecha=2026-10-31`)).json();
    assert.equal(sab.tasa, 889.5754);

    const hoy = await fetch(`${base}/v1/dolares/oficial`);
    assert.equal(hoy.headers.get('access-control-allow-origin'), '*');
    const j = await hoy.json();
    assert.deepEqual(Object.keys(j).sort(), ['compra', 'fecha', 'fechaActualizacion', 'fuente', 'moneda', 'nombre', 'promedio', 'venta']);
    assert.equal(j.moneda, 'USD');
    assert.equal(j.nombre, 'Dólar');
    assert.match(j.fechaActualizacion, /^\d{4}-\d{2}-\d{2}T00:00:00-04:00$/);
    assert.equal(j.fechaActualizacion.slice(0, 10), j.fecha);

    assert.equal((await fetch(`${base}/v1/admin/importar`, { method: 'POST' })).status, 401);
    assert.equal((await fetch(`${base}/v1/admin/pendientes`)).headers.get('access-control-allow-origin'), null);
    const imp = await fetch(`${base}/v1/admin/importar`, {
      method: 'POST',
      headers: { authorization: 'Bearer secreto-de-prueba', 'content-type': 'application/json' },
      body: JSON.stringify([{ fecha: '2026-10-01', moneda: 'USD', tasa: 860.1753 }, { fecha: '2026-10-01', moneda: 'EUR', tasa: 976.84087593 }]),
    });
    assert.equal(imp.status, 200);
    assert.equal((await imp.json()).insertada, 2);
  } finally { srv.close(); delete process.env.ADMIN_TOKEN; }
});
