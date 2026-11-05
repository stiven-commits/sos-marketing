// Carga en vivo todo el historial del BCV (Excel desde HISTORIAL_DESDE_ANIO) y muestra resumen y huecos.
// Escribe en DB_PATH si se indica; si no, en memoria. Nunca toca la base de producción por defecto.
//   DB_PATH=/tmp/bcv-qa.db npm run qa:historial
import { abrirDb } from './db.js';
import { ahoraCaracas } from './tiempo.js';
import { cargarHistorial } from './jobs.js';

const db = abrirDb(process.env.DB_PATH || ':memory:');
const hoy = ahoraCaracas().fecha;
const resumen = await cargarHistorial(db, { hoy });
for (const r of resumen) {
  console.log(`${r.anio} T${r.trimestre}  ${r.estado.padEnd(9)} hojas=${r.hojas ?? '-'} guardadas=${r.guardadas ?? '-'} rechazadas=${r.rechazadas?.length ?? 0}${r.error ? ' ' + r.error : ''}`);
  for (const x of r.rechazadas ?? []) console.log('    rechazada', x.fechaValor, x.motivo);
}
const filas = db.prepare("SELECT fecha_valor FROM tasas WHERE moneda='USD' ORDER BY fecha_valor").all().map((x) => x.fecha_valor);
console.log(`\nUSD: ${filas.length} fechas valor, de ${filas[0]} a ${filas.at(-1)}`);
// Huecos: más de 4 días entre dos fechas valor consecutivas (un fin de semana largo con feriado da 4).
const dias = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
for (let i = 1; i < filas.length; i++) {
  if (dias(filas[i - 1], filas[i]) > 4) console.log(`hueco: ${filas[i - 1]} → ${filas[i]} (${dias(filas[i - 1], filas[i])} días)`);
}
