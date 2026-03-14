# SOS Marketing Web

Landing page de SOS Marketing construida con React + Vite + TypeScript.

## Estado del proyecto

Actualizado al **2026-03-13** con remanufacturacion del flujo de contacto:

- Formulario conectado a `POST /api/contact`.
- Envio de correo con Resend.
- Envio de campos: `name`, `email`, `service`, `message`.
- Soporte en desarrollo local con middleware en Vite para evitar `404` en `/api/contact`.
- Endpoint serverless separado para despliegue (`api/contact.ts`).

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui

## Estructura clave

- `src/components/ContactForm.tsx`: formulario y `handleSubmit`.
- `vite.config.ts`: middleware dev para `POST /api/contact`.
- `api/contact.ts`: handler serverless (uso en despliegue).

## Variables de entorno

Crear `.env.local` en la raiz:

```env
RESEND_API_KEY=tu_api_key_de_resend
```

Notas:

- `.env.local` no debe versionarse.
- Si una key se expone, rotarla en Resend.

## Ejecucion local

```bash
npm install
npm run dev
```

El sitio corre en `http://localhost:8080`.

## Flujo del formulario de contacto

1. Usuario completa nombre, correo, servicio de interes y mensaje.
2. Frontend hace `fetch("/api/contact", { method: "POST" })`.
3. En local, Vite middleware procesa la ruta y llama API de Resend.
4. En despliegue serverless, `api/contact.ts` procesa la ruta.
5. Se envia correo a `atencion@sosmarketing.agency`.

## Troubleshooting rapido

- Error `404 /api/contact`:
  - Verificar que se este ejecutando con `npm run dev`.
  - Reiniciar dev server despues de cambios en `vite.config.ts`.
- Error `Falta RESEND_API_KEY en el entorno`:
  - Confirmar `RESEND_API_KEY` en `.env.local`.
  - Reiniciar `npm run dev` para recargar variables.
- Llega el correo sin servicio:
  - Verificar que `service` se envie desde `ContactForm.tsx`.
  - Verificar que se renderice `<b>Servicio:</b>` en handler.

## Build y validacion

```bash
npm run build
```

Se ha validado build correcto despues de los cambios del flujo de contacto.

## Memoria tecnica para futuras sesiones IA

Decisiones importantes tomadas:

- Se evito exponer la API key en codigo y se migro a `RESEND_API_KEY`.
- Se mantuvo compatibilidad entre desarrollo local (Vite middleware) y despliegue serverless (`api/contact.ts`).
- Se priorizo envio de datos esenciales de contacto en el correo: nombre, email, servicio y mensaje.
