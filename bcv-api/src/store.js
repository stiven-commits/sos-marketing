// Precedencia: una fuente de rango menor nunca pisa a una mayor.
// 'importado' = historial traído de otro sistema (p. ej. otra API o base de datos) solo para rellenar huecos del BCV.
export const RANGO = { 'BCV excel': 2, 'BCV portal': 1, importado: 0 };

export function ultimaFechaValor(db) {
  return db.prepare("SELECT MAX(fecha_valor) f FROM tasas WHERE moneda='USD'").get().f ?? null;
}

export function primeraFechaValor(db, moneda = 'USD') {
  return db.prepare('SELECT MIN(fecha_valor) f FROM tasas WHERE moneda=?').get(moneda).f ?? null;
}

export function tasaAnterior(db, moneda, fechaValor) {
  return db.prepare('SELECT * FROM tasas WHERE moneda=? AND fecha_valor<? ORDER BY fecha_valor DESC LIMIT 1').get(moneda, fechaValor) ?? null;
}

/**
 * Upsert con precedencia BCV excel > BCV portal > importado.
 * Devuelve 'insertada' | 'actualizada' | 'ignorada' | 'conflicto' (una fuente BCV mayor corrigió un monto distinto).
 */
export function guardarTasa(db, { fechaValor, moneda, tasa, fechaOperacion = null, publicadoEn = null, fuente }) {
  if (!(fuente in RANGO)) throw new Error(`fuente desconocida: ${fuente}`);
  const previa = db.prepare('SELECT * FROM tasas WHERE fecha_valor=? AND moneda=?').get(fechaValor, moneda);
  // Sin fecha_operacion explícita: cada publicación se hizo en la fecha valor anterior de la misma moneda.
  fechaOperacion ??= tasaAnterior(db, moneda, fechaValor)?.fecha_valor ?? null;
  if (!previa) {
    db.prepare('INSERT INTO tasas(fecha_valor,moneda,tasa,fecha_operacion,publicado_en,fuente) VALUES(?,?,?,?,?,?)')
      .run(fechaValor, moneda, tasa, fechaOperacion, publicadoEn, fuente);
    return 'insertada';
  }
  if (RANGO[fuente] < RANGO[previa.fuente]) return 'ignorada';
  const difiere = Math.abs(previa.tasa - tasa) > 1e-6;
  db.prepare(`UPDATE tasas SET tasa=?, fecha_operacion=COALESCE(?,fecha_operacion), publicado_en=COALESCE(?,publicado_en),
              fuente=?, updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE fecha_valor=? AND moneda=?`)
    .run(tasa, fechaOperacion, publicadoEn, fuente, fechaValor, moneda);
  return difiere && RANGO[previa.fuente] >= 1 ? 'conflicto' : 'actualizada';
}

/**
 * Regla única: la tasa de un día es la última anunciada ANTES de ese día (mayor fecha_operacion < fecha).
 *
 * Devuelve la fila (con `provisional`) o `{ sinTasa: motivo }`:
 *  - 'sin-datos'           la base está vacía.
 *  - 'antes-del-historial' la fecha es anterior a la primera publicación guardada.
 *  - 'hueco'               falta la publicación que cubre esa fecha (la fila encontrada vence antes de ella).
 * Nunca devuelve una tasa de otra época como si fuera la de esa fecha. Solo una fecha POSTERIOR a lo
 * publicado recibe la más reciente, marcada `provisional: true`.
 */
export function tasaVigenteEn(db, moneda, fecha) {
  const ult = ultimaTasa(db, moneda);
  if (!ult) return { sinTasa: 'sin-datos' };
  if (fecha > ult.fecha_valor) return { ...ult, provisional: true };
  const fila = db.prepare(
    'SELECT * FROM tasas WHERE moneda=? AND fecha_operacion<? ORDER BY fecha_operacion DESC LIMIT 1',
  ).get(moneda, fecha);
  if (!fila) return { sinTasa: 'antes-del-historial' };
  // Con publicaciones encadenadas, la fila elegida vence (fecha valor) el mismo día o después.
  // Si vence antes, falta la publicación siguiente: no se adivina.
  if (fila.fecha_valor < fecha) return { sinTasa: 'hueco' };
  return { ...fila, provisional: false };
}

export function ultimaTasa(db, moneda) {
  return db.prepare('SELECT * FROM tasas WHERE moneda=? ORDER BY fecha_valor DESC LIMIT 1').get(moneda) ?? null;
}
