// Lee el BCV en vivo y muestra lo que guardaría. No escribe en disco (base en memoria).
import { abrirDb } from './db.js';
import { ahoraCaracas } from './tiempo.js';
import { capturarPortal, sincronizarExcel } from './jobs.js';
import { tasaVigenteEn } from './store.js';

const db = abrirDb(':memory:');
const ctx = { hoy: ahoraCaracas().fecha };
console.log('excel  ', JSON.stringify(await sincronizarExcel(db, ctx)));
console.log('portal ', JSON.stringify(await capturarPortal(db, ctx)));
for (const m of ['USD', 'EUR']) console.log(m, 'hoy ->', JSON.stringify(tasaVigenteEn(db, m, ctx.hoy)));
