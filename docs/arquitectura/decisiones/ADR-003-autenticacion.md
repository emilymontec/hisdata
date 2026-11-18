# ADR-003 — Autenticación y gestión de sesiones

**Estado:** Aceptado (ya implementado en código)
**Fecha:** 2026-11-17

## Contexto

HISDATA necesita un mecanismo de autenticación propio (sin depender de un proveedor externo para el MVP), que permita sesiones seguras, revocables y auditable, sin almacenar credenciales en texto plano.

## Decisión

- **Credenciales:** contraseña con hash `bcrypt` (costo 12), nunca almacenada ni registrada en texto plano.
- **Tokens de acceso:** JWT firmado (HS256 vía `@nestjs/jwt`), vigencia 15 minutos, payload mínimo (`sub`, `email`, `roleCode`) — sin datos clínicos ni sensibles en el token.
- **Tokens de refresco:** aleatorios (40 bytes), almacenados **solo como hash SHA-256** en base de datos, vigencia 7 días, con **rotación obligatoria**: cada uso de un refresh token lo revoca y emite uno nuevo. Esto limita el daño de un token de refresco filtrado — solo es válido hasta el siguiente uso legítimo.
- **Recuperación de contraseña:** token de un solo uso (32 bytes aleatorios, hash SHA-256 almacenado), vigencia 30 minutos. La respuesta del endpoint es idéntica exista o no el correo, para no filtrar qué cuentas existen.
- **Bloqueo por fuerza bruta:** 5 intentos fallidos consecutivos bloquean la cuenta hasta intervención de un administrador (no hay desbloqueo automático por tiempo en esta versión).
- **Cambio de contraseña:** revoca todas las sesiones activas (todos los refresh tokens) del usuario.
- **Autorización:** basada en rol (`RolesGuard`), validada siempre en el servidor — nunca se confía en lo que el frontend oculte o muestre.

## Alternativas consideradas

- **OAuth2/OIDC con proveedor externo (ej. Keycloak autoalojado):** más robusto para integraciones futuras y SSO institucional, pero añade una pieza de infraestructura adicional a operar desde el día 1. Se descarta para esta fase; se reconsiderará si la institución necesita SSO con otros sistemas (ver Fase 7/Integraciones).
- **Sesiones de servidor (cookies + almacenamiento en Redis):** evita exponer tokens al cliente, pero complica el uso desde un frontend separado (SPA) y añade una dependencia de infraestructura (Redis) no justificada todavía.

## Consecuencias

- El sistema es autosuficiente para autenticación sin dependencias externas adicionales, a costa de tener que mantener nosotros mismos la lógica de rotación y revocación (ya implementada en `AuthService`).
- Si en el futuro se requiere SSO institucional o integración con un proveedor de identidad externo, se deberá migrar el flujo de login sin cambiar el resto del sistema (los guards y el payload del JWT pueden mantenerse compatibles).
- Pendiente de decisión futura: expiración/renovación automática de bloqueo por intentos fallidos (hoy requiere intervención manual de un administrador).
