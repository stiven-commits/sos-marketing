export const RANGO = { 'BCV excel': 3, 'BCV portal': 2, dolarapi: 1 };

export function ultimaFechaValor(db) {
  return db.prepare("SELECT MAX(fecha_valor) f FROM tasas WHERE moneda='USD'").get().f ?? null;
}

export function tasaAnterior(db, moneda, fechaValor) {
  return db.prepare('SELECT * FROM tasas WHERE moneda=? AND fecha_valor<? ORDER BY fecha_valor DESC LIMIT 1').get(moneda, fechaValor) ?? null;
}

/**
 * Upsert con precedencia BCV excel > BCV portal > dolarapi.
 * Devuelve 'insertada' | 'actualizada' | 'ignorada' | 'conflicto' (una fuente mayor corrigió un monto distinto).
 */
export function guardarTasa(db, { fechaValor, moneda, tasa, fechaOperacion = null, publicadoEn = null, fuente }) {
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
  return difiere && RANGO[previa.fuente] >= 2 ? 'conflicto' : 'actualizada';
}

/** Regla única: la tasa de un día es la última anunciada ANTES de ese día (mayor fecha_operacion < fecha). */
export function tasaVigenteEn(db, moneda, fecha) {
  const fila = db.prepare(
    'SELECT * FROM tasas WHERE moneda=? AND fecha_operacion<? ORDER BY fecha_operacion DESC LIMIT 1',
  ).get(moneda, fecha);
  const ult = ultimaTasa(db, moneda);
  // Posterior a lo publicado (o aún sin publicación): la más reciente, marcada provisional.
  if (!fila || (ult && fecha > ult.fecha_valor)) return ult ? { ...ult, provisional: true } : null;
  return { ...fila, provisional: false };
}

export function ultimaTasa(db, moneda) {
  return db.prepare('SELECT * FROM tasas WHERE moneda=? ORDER BY fecha_valor DESC LIMIT 1').get(moneda) ?? null;
}
