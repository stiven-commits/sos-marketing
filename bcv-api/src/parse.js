// Parsers puros del BCV. Leen por contenido, no por posición fija.
import XLSX from 'xlsx';

export const BASE = 'https://www.bcv.org.ve';
export const URL_PORTAL = `${BASE}/seccionportal/tipo-de-cambio-oficial-del-bcv`;
export const URL_LISTADO = `${BASE}/estadisticas/tipo-cambio-de-referencia-smc`;

/** "1.006,03263992" -> 1006.03263992 ; "894,88760000" -> 894.8876 */
export function parseNumeroVenezolano(texto) {
  const limpio = String(texto).replace(/[^\d.,-]/g, '');
  if (!limpio) return NaN;
  const n = Number(limpio.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}

function tasaDeBloque(html, id) {
  const i = html.indexOf(`id="${id}"`);
  if (i < 0) return null;
  const m = html.slice(i, i + 1500).match(/<strong[^>]*class="strong-tb"[^>]*>\s*([\d.,]+)\s*<\/strong>/);
  if (!m) return null;
  const n = parseNumeroVenezolano(m[1]);
  return n > 0 ? n : null;
}

/** Portal -> { usd, eur, fechaValor:'YYYY-MM-DD' } (null si no se reconoce) */
export function leerPortal(html) {
  const usd = tasaDeBloque(html, 'dolar');
  const eur = tasaDeBloque(html, 'euro');
  const f = html.match(/Fecha\s*Valor:\s*<span[^>]*content="(\d{4}-\d{2}-\d{2})/i);
  if (!usd || !eur || !f) return null;
  return { usd, eur, fechaValor: f[1] };
}

export const nombreExcel = (anio, trimestre) =>
  `2_1_2${'abcd'[trimestre - 1]}${String(anio).slice(-2)}_smc.xls`;

/** Listado -> [{ url, anio, trimestre }] del más reciente al más antiguo */
export function listarExcels(html) {
  const vistos = new Map();
  for (const m of html.matchAll(/EstadisticasGeneral\/(2_1_2([a-d])(\d{2})_smc\.xls)/g)) {
    vistos.set(m[1], {
      url: `${BASE}/sites/default/files/EstadisticasGeneral/${m[1]}`,
      anio: 2000 + Number(m[3]),
      trimestre: 'abcd'.indexOf(m[2]) + 1,
    });
  }
  return [...vistos.values()].sort((a, b) => b.anio - a.anio || b.trimestre - a.trimestre);
}

export function urlExcelPorPatron(anio, trimestre) {
  return `${BASE}/sites/default/files/EstadisticasGeneral/${nombreExcel(anio, trimestre)}`;
}

const aIso = (dd, mm, aaaa) => `${aaaa}-${mm}-${dd}`;

/** Excel .xls (BIFF) -> una fila por hoja { fechaOperacion, fechaValor, publicadoA, usd, eur } */
export function leerExcel(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const out = [];
  for (const nombre of wb.SheetNames) {
    const filas = XLSX.utils.sheet_to_json(wb.Sheets[nombre], { header: 1, raw: true, defval: null });
    let fechaOperacion = null, fechaValor = null, publicadoA = null;
    const tasas = {};
    for (const fila of filas) {
      for (const celda of fila) {
        if (typeof celda !== 'string') continue;
        let m;
        if ((m = celda.match(/Fecha\s*Operaci[oó]n:\s*(\d{2})\/(\d{2})\/(\d{4})/i))) fechaOperacion = aIso(m[1], m[2], m[3]);
        else if ((m = celda.match(/Fecha\s*Valor:\s*(\d{2})\/(\d{2})\/(\d{4})/i))) fechaValor = aIso(m[1], m[2], m[3]);
        else if ((m = celda.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i))) {
          let h = Number(m[4]) % 12;
          if (m[6].toUpperCase() === 'PM') h += 12;
          publicadoA = `${aIso(m[1], m[2], m[3])}T${String(h).padStart(2, '0')}:${m[5]}:00-04:00`;
        }
      }
      const cod = typeof fila[0] === 'string' ? fila[0].trim().toUpperCase() : '';
      if (cod === 'USD' || cod === 'EUR') {
        const nums = fila.slice(1).filter((c) => typeof c === 'number' && c > 0);
        if (nums.length) tasas[cod] = nums[nums.length - 1]; // última columna = Venta (ASK) en Bs
      }
    }
    if (fechaOperacion && fechaValor && tasas.USD && tasas.EUR) {
      out.push({ fechaOperacion, fechaValor, publicadoA, usd: tasas.USD, eur: tasas.EUR });
    }
  }
  return out.sort((a, b) => a.fechaValor.localeCompare(b.fechaValor));
}
