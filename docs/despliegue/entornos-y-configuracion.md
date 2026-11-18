# Entornos y configuración — HISDATA

## Entornos previstos

| Entorno | Estado | Notas |
|---|---|---|
| Desarrollo local | 🟡 Documentado, no ejecutado todavía | Ver `docs/despliegue/instalacion-local.md` |
| Pruebas/QA | ⬜ No existe | Se recomienda una base de datos separada (`hisdata_test`) antes de escribir pruebas de integración (ver `docs/pruebas/estrategia-de-pruebas.md`) |
| Producción | ⬜ No existe | Requiere las decisiones de `docs/gestion/pendientes-manuales.md` (hosting, almacenamiento, correo, dominio) |

## Variables de entorno (`apps/api`)

| Variable | Obligatoria | Descripción | Valor de ejemplo |
|---|---|---|---|
| `NODE_ENV` | Sí | `development` desactiva ciertas protecciones (ej. expone Swagger, devuelve el token de recuperación de contraseña en la respuesta para pruebas) | `development` / `production` |
| `PORT` | No | Puerto del backend | `3000` |
| `CORS_ORIGIN` | Sí en producción | Orígenes permitidos, separados por coma | `https://app.hisdata.ejemplo.com` |
| `DATABASE_URL` | Sí | Cadena de conexión PostgreSQL | `postgresql://usuario:password@host:5432/hisdata` |
| `JWT_ACCESS_SECRET` | Sí | Secreto de firma de los JWT de acceso — **debe ser distinto por entorno** y nunca compartirse entre desarrollo y producción | generado con `openssl rand -hex 64` |

## Variables de entorno (`apps/web`)

| Variable | Obligatoria | Descripción |
|---|---|---|
| `VITE_API_URL` | No (default `http://localhost:3000/api/v1`) | URL base de la API que consume el frontend |

## Diferencias de comportamiento por entorno ya implementadas en el código

- **Swagger** (`/api/docs`) solo se registra si `NODE_ENV !== 'production'` (`apps/api/src/main.ts`).
- **Token de recuperación de contraseña en la respuesta** (`debugToken`) solo se devuelve si `NODE_ENV !== 'production'` (`AuthService.requestPasswordReset`) — en producción, ese token solo debe viajar por el canal de notificación real (pendiente, ver `docs/gestion/pendientes-manuales.md`).

## Secretos: reglas que ya aplica el código

- Ninguna contraseña, token o secreto se registra en logs (ver `AllExceptionsFilter`, que nunca expone detalles internos al cliente ni los registra con datos sensibles).
- Los refresh tokens y los tokens de recuperación de contraseña se almacenan **solo como hash**, nunca en texto plano (`AuthService`, usando SHA-256).

## Pendiente antes de tener un entorno de producción real

Ver la lista completa en `docs/gestion/pendientes-manuales.md` — en resumen: hosting, almacenamiento de archivos, proveedor de correo, dominio/SSL, backups configurados y probados, y revisión normativa.
