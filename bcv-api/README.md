# bcv-api

API de la tasa oficial del BCV (USD y EUR, **Venta/ASK** en Bs). Lee **directo del Banco Central de Venezuela**
(portal + Excel trimestral oficial), valida cada tasa antes de guardarla, la conserva para siempre en SQLite y la
sirve por HTTP. Es un servicio genérico, pensado para reutilizarlo desde cualquier aplicación, flujo de n8n o script.

Al abrir la URL del servicio en un navegador se muestra una **página de documentación** (`public/index.html`) con
todas las rutas y un botón para probarlas en vivo.

## Cómo funciona

| Cuándo (hora de Caracas) | Qué hace |
|---|---|
| lun–vie, cada 15 min de 15:00 a 19:59 | Lee el portal; si la fecha valor es nueva, valida y guarda; deja de consultar ese día |
| todos los días 07:00 | Lee el Excel del trimestre (y el anterior en los primeros 10 días) y rellena/confirma |
| lun–vie 20:00 sin tasa nueva | Manda una alarma (el Excel de las 07:00 la recupera si el BCV publicó tarde) |
| arranque sin historial cargado | Carga **todos** los Excel desde `HISTORIAL_DESDE_ANIO` (2022), aunque el listado del BCV solo muestre desde 2024 (los anteriores existen con el mismo patrón de nombre) |

- **TLS:** el BCV envía un intermedio equivocado. `src/fetchBcv.js` añade el intermedio Sectigo DV R36
  (`certs/sectigo-dv-r36.pem`) solo para ese agente. Nunca se desactiva la verificación. El certificado del BCV
  vence el **2026-11-20**: si falla, salta la alarma (`BcvTlsError`) y no se guarda nada.
- **Precedencia:** `BCV excel` > `BCV portal` > `importado`. Un monto distinto entre portal y Excel gana el Excel
  y avisa. Lo importado de otro sistema solo rellena huecos: nunca pisa al BCV.
- **Validaciones:** USD/EUR > 0, cociente EUR/USD entre 0,9 y 1,4 (detecta errores de escala como un euro de
  `1.006` en vez de `1.006,03`, sin depender del nivel del bolívar), fecha valor ≤ hoy+5 y no anterior a la
  última. Variación ≤ 10 % frente a una tasa de los 7 días previos: un salto mayor se aparta en `pendientes`
  hasta confirmarlo. La carga del historial oficial no aplica ese freno (hubo devaluaciones reales, p. ej. +25 %
  en agosto de 2022).
- **Regla de fines de semana y feriados:** la tasa de un día es la última anunciada **antes** de ese día
  (`mayor fecha_operacion < fecha`). Ejemplo: el sábado 31-oct-2026 aplica 889,5754, anunciada el viernes 30.
- **Nunca inventa una tasa.** Una fecha anterior al historial, o dentro de un hueco (falta la publicación que la
  cubre), responde **404** con `motivo` (`antes-del-historial` | `hueco` | `sin-datos`) e `historialDesde`. Solo una
  fecha **posterior** a lo publicado recibe la más reciente con `provisional: true`.
- **Cobertura verificada (2026-11-05):** 1.042 publicaciones del BCV (ene-2022 → hoy) + 90 días importados de
  otro sistema para los huecos de los Excel de 2023. Sin tasa: 50 días de 2022 (8-sep → 3-oct y 10-dic →
  2-ene-2023) que ni el BCV ni la fuente importada tienen.

## API

Todas las rutas de lectura son `GET`, públicas, sin API key y con `Access-Control-Allow-Origin: *` (se pueden
consumir desde un navegador).

| Ruta | Descripción |
|---|---|
| `GET /` | página de documentación con las rutas y pruebas en vivo |
| `GET /health` | estado, primera y última fecha valor, último Excel, fecha de carga del historial |
| `GET /v1/tasa?moneda=&fecha=YYYY-MM-DD` | tasa aplicable a esa fecha (regla única); `provisional:true` si la fecha es posterior a lo publicado; 404 con `motivo` si no hay tasa. **Ruta recomendada para cálculos** |
| `GET /v1/oficial?moneda=USD\|EUR` | tasa vigente hoy (incluye `promedio`, `fecha`, `fechaActualizacion`, `publicadoEn`) |
| `GET /v1/historico?moneda=&desde=&hasta=` | histórico por fecha valor (descendente, sin límite) |

### Formato dolarapi

Mismo formato que `ve.dolarapi.com`, para migrar cambiando solo la URL base. El BCV solo publica Venta:
`compra` es `null` y `promedio` es igual a `venta`. `fechaActualizacion` es la medianoche de la fecha valor, como
dolarapi; la hora real de publicación va aparte, en `publicadoEn` de las rutas `/v1/tasa` y `/v1/oficial`.

| Ruta | Descripción |
|---|---|
| `GET /v1/dolares/oficial` · `GET /v1/euros/oficial` | tasa de hoy (`moneda, fuente, nombre, compra, venta, promedio, fechaActualizacion, fecha`) |
| `GET /v1/historicos/dolares\|euros/oficial?desde=&hasta=` | histórico, ascendente por fecha valor |
| `GET /v1/historicos/dolares\|euros/oficial/:fecha` | fila exacta de esa fecha valor (404 si no existe, p. ej. en fin de semana); para "la tasa que aplica a un día" usar `/v1/tasa` |

### Administración (requiere `Authorization: Bearer $ADMIN_TOKEN`, sin CORS)

| Ruta | Descripción |
|---|---|
| `GET /v1/admin/pendientes` | tasas con un salto mayor al 10 % en espera de confirmación |
| `POST /v1/admin/pendientes/:id/confirmar` | confirma una tasa pendiente |
| `POST /v1/admin/importar` | rellena huecos con `[{fecha, moneda, tasa\|promedio}]` de otro sistema (fuente `importado`, nunca pisa al BCV) |

### Ejemplo

```bash
curl "https://<tu-dominio>/v1/tasa?moneda=USD&fecha=2026-10-31"
```

```json
{
  "fechaConsulta": "2026-10-31",
  "moneda": "USD",
  "tasa": 889.5754,
  "fechaValor": "2026-11-02",
  "fechaOperacion": "2026-10-30",
  "publicadoEn": "2026-10-30T16:15:00-04:00",
  "fuente": "BCV excel",
  "provisional": false
}
```

## Variables de entorno

| Variable | Por defecto | Uso |
|---|---|---|
| `PORT` | `3000` | puerto HTTP |
| `DB_PATH` | `./data/bcv.db` | archivo SQLite (en el contenedor: `/data/bcv.db`) |
| `ADMIN_TOKEN` | — | token de las rutas `/v1/admin`; sin él quedan deshabilitadas |
| `ALERT_WEBHOOK_URL` | — | URL a la que se envía un `POST` JSON `{servicio, clave, titulo, detalle, fecha}` en cada alarma (p. ej. un Webhook de n8n que reenvíe a Telegram, correo o WhatsApp). Máximo una alarma por clave y por día |
| `HISTORIAL_DESDE_ANIO` | `2022` | primer año del historial; antes los Excel están casi vacíos y cruzan la reconversión de oct-2021 |

## Desarrollo

```bash
npm install
npm test              # pruebas con fixtures reales del BCV (23 publicaciones oct–nov 2026)
npm run qa:live       # lee el BCV en vivo en una base en memoria, sin escribir en disco
npm run qa:historial  # carga en vivo todo el historial (en memoria, o en DB_PATH) y lista huecos
npm start
```

Requiere Node ≥ 22.5 (usa `node:sqlite`). El Excel `.xls` (BIFF) se lee con SheetJS, instalado desde su CDN oficial.

## Despliegue

Dockerfile incluido (`node:24-alpine`). Monta un **volumen persistente en `/data`**: ahí vive la base con todo el
historial. Expone el puerto 3000 y tiene `HEALTHCHECK` sobre `/health`. Funciona detrás de cualquier proxy con TLS.

## Pendiente

- Renovar el PEM del intermedio (`certs/`) si el BCV cambia su cadena tras el vencimiento de su certificado (2026-11-20).
- Caché HTTP y API key de lectura si se expone con mucho tráfico (hoy la lectura es abierta y la escritura exige token).
- Fuente única: **solo BCV directo**. Quien necesite respaldo puede agregarlo del lado cliente (consultar esta API y,
  si falla, su propia fuente alternativa).
