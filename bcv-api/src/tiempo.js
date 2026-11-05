// America/Caracas es UTC-4 fijo (sin horario de verano).
export function ahoraCaracas(d = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Caracas', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short',
    }).formatToParts(d).map((x) => [x.type, x.value]),
  );
  return {
    fecha: `${p.year}-${p.month}-${p.day}`,
    hora: Number(p.hour),
    minuto: Number(p.minute),
    habil: !['Sat', 'Sun'].includes(p.weekday),
  };
}
