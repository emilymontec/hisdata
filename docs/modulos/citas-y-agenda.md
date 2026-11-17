# Módulo: Citas y agenda

**Código fuente:** `apps/api/src/modules/appointments`

## Objetivo
Programar, consultar y gestionar el ciclo de vida de las citas médicas.

## Actores
Administrativo (programa/cancela/reprograma), Médico (consulta su agenda, completa citas), Paciente (futuro, vía portal).

## Flujos principales
1. Creación de cita, validando que no se solape con otra cita activa del mismo profesional.
2. Cancelación.
3. Reprogramación: la cita original pasa a `RESCHEDULED` y se crea una nueva vinculada (`rescheduledFromId`), preservando el historial.
4. Marcar como completada (también ocurre automáticamente al registrar una consulta vinculada).
5. Consulta por paciente o por profesional + rango de fechas.

## Dependencias
`Patients` (paciente), `Users` (profesional).

## Datos (modelo Prisma)
`Appointment` (estados: `SCHEDULED`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`, `RESCHEDULED`).

## Decisiones pendientes
- Recordatorios y notificaciones automáticas de citas: el módulo de Notificaciones existe, pero la integración activa (ej. recordatorio 24h antes) no está conectada todavía.
- Gestión de disponibilidad/horarios base por profesional (plantillas de agenda) no implementada: hoy solo se valida solapamiento contra citas ya creadas.
