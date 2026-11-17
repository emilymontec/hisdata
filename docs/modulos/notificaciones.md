# Módulo: Notificaciones

**Código fuente:** `apps/api/src/modules/notifications`

## Objetivo
Registrar y entregar avisos internos a usuarios o pacientes.

## Actores
Cualquier módulo que necesite avisar a un usuario o paciente (hoy: creación manual vía API; a futuro: disparada por otros módulos como citas o resultados).

## Flujos principales
1. Creación de notificación dirigida a un usuario interno o a un paciente, por canal `IN_APP` o `EMAIL`.
2. Consulta de notificaciones por usuario o por paciente.
3. Marcar como leída.

## Dependencias
Ninguna obligatoria; es consumido potencialmente por `Appointments` (recordatorios) y `Laboratory`/`Imaging` (aviso de resultados disponibles) — esas integraciones activas aún no están conectadas.

## Datos (modelo Prisma)
`Notification`.

## Decisiones pendientes
- El canal `EMAIL` solo registra la intención: el envío real requiere un proveedor de correo configurado y autorizado (módulo 19 del alcance original lo marca como condicional a esa aprobación).
- Preferencias de comunicación por usuario/paciente (qué canal prefiere, qué eventos quiere recibir) no implementadas todavía.
