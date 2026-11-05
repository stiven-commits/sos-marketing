# bcv-api

API propia de la tasa oficial del BCV (USD y EUR, Venta/ASK en Bs). Lee **directo del BCV** (portal + Excel
trimestral), valida, guarda para siempre en SQLite y la sirve por HTTP. Pensada para reutilizarla en varios
proyectos (Habioo, n8n, Chatwoot/Dify, etc.). Adaptación del plan `Habioo/docs/planes/2026-11-05-tasa-bcv-directa.md`.

## Cómo funciona

| Cuándo (Caracas) | Qué hace |
|---|---|
| lun–vie, cada 15 min de 15:00 a 19:59 | Lee el portal; si la fecha valor es nueva, valida y guarda; deja de consultar ese día |
| todos los días 07:00 | Lee el Excel del trimestre (y el anterior en los primeros 10 días) y rellena/confirma |
| lun–vie 20:00 sin tasa nueva | Prueba dolarapi; si tampoco hay, manda alarma |
| arranque con base vacía | Carga el Excel del trimestre |

- **TLS:** el BCV envía un intermedio equivocado. `src/fetchBcv.js` añade el intermedio Sectigo DV R36
  (`certs/sectigo-dv-r36.pem`) solo para ese agente. Nunca se desactiva la verificación. El certificado del BCV
  vence el **2026-11-20**: si falla, salta la alarma (`BcvTlsError`) y entra dolarapi.
- **Precedencia:** `BCV excel` > `BCV portal` > `dolarapi`. Un monto distinto entre portal y Excel gana el Excel y avisa.
- **Validaciones:** USD/EUR > 0, EUR ≥ 10, EUR/USD entre 0,9 y 1,4, fecha valor ≤ hoy+5 y no anterior a la última,
  variación ≤ 10 %. Un salto mayor se aparta en `pendientes` hasta confirmarlo.
- **Regla de fines de semana/feriados:** la tasa de un día es la última anunciada **antes** de ese día
  (`mayor fecha_operacion < fecha`). Sábado 31-oct → 889,5754 (anunciada el viernes 30).

## API

| Ruta | Descripción |
|---|---|
| `GET /health` | estado y última fecha valor |
| `GET /v1/oficial?moneda=USD\|EUR` | tasa vigente hoy (incluye `promedio`, `fecha`, `fechaActualizacion`, compatible con dolarapi) |
| `GET /v1/tasa?moneda=&fecha=YYYY-MM-DD` | tasa aplicable a esa fecha (regla única); `provisional:true` si la fecha es posterior a lo publicado |
| `GET /v1/historico?moneda=&desde=&hasta=` | histórico por fecha valor |
| `GET /v1/admin/pendientes` · `POST /v1/admin/pendientes/:id/confirmar` | requieren `Authorization: Bearer $ADMIN_TOKEN` |

## Variables de entorno

`PORT` (3000) · `DB_PATH` (`./data/bcv.db`) · `ADMIN_TOKEN` · `ALERT_WEBHOOK_URL` (Webhook de n8n que reenvía a
correo/WhatsApp) · `DOLARAPI_URL` (opcional).

## Uso

```bash
npm install
npm test            # 8 pruebas con fixtures reales (23 publicaciones oct–nov 2026)
npm run qa:live     # lee el BCV en vivo en una base en memoria, sin escribir en disco
npm start
```

Despliegue en Coolify: Dockerfile incluido; montar un volumen en `/data`.

## Uso desde n8n

Nodo HTTP Request → `GET https://<tu-dominio>/v1/tasa?moneda=USD&fecha={{$today.toFormat('yyyy-MM-dd')}}`.
Para alarmas: crear un Webhook en n8n y pegar su URL en `ALERT_WEBHOOK_URL`; el cuerpo trae
`{servicio, clave, titulo, detalle, fecha}`.

## Pendiente

- Desplegar y renovar el PEM del intermedio si el BCV cambia su cadena tras el 20-nov.
- Cache HTTP / API key de lectura si se expone a internet (hoy lectura abierta, escritura con token).
- Conciliar contra dolarapi los últimos 90 días antes de usarla en contabilidad.
