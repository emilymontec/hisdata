# Módulo: Auditoría y seguridad

**Código fuente:** `apps/api/src/modules/audit`

## Objetivo
Registrar de forma centralizada toda operación sensible del sistema, para trazabilidad y supervisión.

## Actores
Auditor (consulta restringida), Administrador (consulta), todos los demás módulos (productores del registro, vía `AuditService.record`).

## Flujos principales
1. Cada módulo invoca `AuditService.record({ actorUserId, action, entityType, entityId, metadata })` en cada operación sensible: login/logout, creación/edición de pacientes, toda lectura y escritura de historia clínica, cambios de estado de órdenes/admisiones/laboratorio, dispensación de farmacia, etc.
2. Consulta de auditoría por tipo+id de entidad, o por usuario actor — restringida a roles `AUDITOR`/`ADMIN`.

## Dependencias
Es transitivamente dependido por prácticamente todos los módulos (importa `AuditModule`). No depende de ningún otro módulo de negocio.

## Datos (modelo Prisma)
`AuditLog` (nunca incluye contenido clínico completo ni credenciales en `metadata`, solo identificadores).

## Decisiones pendientes
- Monitoreo activo de eventos de seguridad (alertas en tiempo real, ej. múltiples accesos fallidos) no implementado — hoy el registro es pasivo, para consulta posterior.
- Gestión de incidentes (flujo formal de respuesta) no implementada — ver `docs/seguridad/gestion-incidentes.md` (pendiente de crear cuando se defina el proceso con el responsable de seguridad).
- Política de retención/purga de logs de auditoría no definida.
