# Módulo: Consultas médicas

**Código fuente:** `apps/api/src/modules/medical-consultation`

## Objetivo
Registrar el acto de atención médica: motivo, hallazgos y plan, vinculado a la historia clínica.

## Actores
Médico (crea y consulta), Enfermería/Admin (consulta).

## Flujos principales
1. Creación de consulta, vinculada opcionalmente a una cita (si existe, la cita se marca `COMPLETED` automáticamente).
2. Consulta del historial de atenciones de un paciente (con sus órdenes y prescripciones asociadas).

## Dependencias
`Patients`, `ClinicalRecord` (toda consulta cuelga de la historia clínica del paciente), `Appointments` (opcional).

## Datos (modelo Prisma)
`Consultation` (con relaciones a `MedicalOrder` y `Prescription`).

## Decisiones pendientes
- Plantillas estructuradas de hallazgos por especialidad (hoy es texto libre) — depende de validación clínica por especialidad.
