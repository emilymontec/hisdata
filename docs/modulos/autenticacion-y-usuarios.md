# Módulo: Autenticación y gestión de usuarios

**Código fuente:** `apps/api/src/modules/auth`, `apps/api/src/modules/users`

## Objetivo
Controlar quién puede entrar al sistema y qué puede hacer una vez dentro, de forma segura y auditable.

## Actores
- Todo usuario interno (Administrador, Médico, Enfermería, Administrativo, Auditor).
- El propio sistema (bloqueo automático por intentos fallidos).

## Flujos principales
1. Login con correo/contraseña → emite access token (15 min) + refresh token rotativo (7 días).
2. Refresh de sesión con rotación del token usado.
3. Logout (revoca el refresh token).
4. Recuperación de contraseña por token de un solo uso (30 min de vigencia).
5. Administrador crea usuarios con contraseña temporal; el usuario debe cambiarla en el primer ingreso.
6. Bloqueo automático tras 5 intentos fallidos consecutivos.

## Dependencias
Ninguna — es el módulo base del que dependen todos los demás (vía `JwtAuthGuard`/`RolesGuard`).

## Datos (modelo Prisma)
`User`, `Role`, `Permission`, `RefreshToken`, `PasswordResetToken`.

## Decisiones pendientes
- El modelo de `Permission` existe en el esquema pero aún no se usa para autorización fina (hoy la autorización es por rol, no por permiso individual). Evaluar si se necesita antes de producción.
- Envío real de correos de recuperación de contraseña: depende del módulo de Notificaciones y de un canal externo aprobado.
