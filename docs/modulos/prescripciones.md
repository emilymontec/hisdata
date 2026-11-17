# Módulo: Prescripciones médicas

**Código fuente:** `apps/api/src/modules/prescriptions`

## Objetivo
Registrar y consultar las prescripciones médicas de un paciente.

## Actores
Médico (crea y cancela), Enfermería/Admin (consulta), Farmacia (consume para dispensar — ver módulo Pharmacy).

## Flujos principales
1. Creación de prescripción con uno o más ítems (medicamento del catálogo o texto libre si aún no está catalogado).
2. Consulta por paciente, incluyendo dispensaciones ya realizadas por ítem.
3. Cancelación.

## Dependencias
`Patients`, `MedicalConsultation` (opcional). Es consumido por `Pharmacy`.

## Datos (modelo Prisma)
`Prescription`, `PrescriptionItem`.

## Decisiones pendientes — **explícitamente no implementado, requiere validación clínica previa**
- Validación de interacciones medicamentosas.
- Validación de dosis máximas/mínimas y contraindicaciones.
- Alertas por alergias del paciente (el modelo de alergias aún no existe).
