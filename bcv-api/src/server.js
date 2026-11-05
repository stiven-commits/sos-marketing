import { abrirDb, getMeta, setMeta } from './db.js';
import { crearApp } from './app.js';
import { ahoraCaracas } from './tiempo.js';
import { capturarPortal, sincronizarExcel, cierreDelDia, cargarHistorial } from './jobs.js';
import { alertar } from './alerta.js';

const db = abrirDb();
const app = crearApp(db);
let ocupado = false;

async function tick() {
  if (ocupado) return;
  ocupado = true;
  const t = ahoraCaracas();
  const ctx = { hoy: t.fecha };
  try {
    // 07:00 todos los días: Excel (rellena huecos y confirma lo del portal).
    if (t.hora === 7 && t.minuto === 0 && getMeta(db, 'ultimo_excel') !== t.fecha) await sincronizarExcel(db, ctx);
    if (t.habil) {
      // 15:00–19:59 cada 15 min mientras no haya tasa nueva hoy.
      if (t.hora >= 15 && t.hora < 20 && t.minuto % 15 === 0 && getMeta(db, 'captura_portal_dia') !== t.fecha) {
        const r = await capturarPortal(db, ctx);
        console.log('[portal]', JSON.stringify(r));
      }
      if (t.hora === 20 && t.minuto === 0) console.log('[cierre]', JSON.stringify(await cierreDelDia(db, ctx)));
    }
  } catch (e) {
    console.error('[tick]', e.message);
    await alertar(db, { clave: `error:${e.name}`, titulo: 'Fallo del job de tasas BCV', detalle: e.message }, t.fecha);
  } finally {
    ocupado = false;
  }
}

// Alinea al inicio de cada minuto.
setTimeout(() => { tick(); setInterval(tick, 60_000); }, 60_000 - (Date.now() % 60_000));

// Historial nunca cargado (base nueva, o una base que solo tenía el trimestre actual): carga todos los
// Excel del BCV desde HISTORIAL_DESDE_ANIO (2022) sin esperar a las 7:00. Se reintenta en cada arranque
// hasta que funcione.
if (!getMeta(db, 'historial_cargado')) {
  ocupado = true;
  cargarHistorial(db, { hoy: ahoraCaracas().fecha })
    .then((r) => console.log('[bootstrap historial]', JSON.stringify(r.map(({ rechazadas, ...x }) => ({ ...x, rechazadas: rechazadas?.length ?? 0 })))))
    .catch((e) => console.error('[bootstrap]', e.message))
    .finally(() => { ocupado = false; });
}

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`bcv-api escuchando en :${port}`));
setMeta(db, 'arranque', new Date().toISOString());
