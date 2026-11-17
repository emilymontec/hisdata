# Módulo: Admisiones, traslados y egresos

**Código fuente:** `apps/api/src/modules/admissions`

## Objetivo
Gestionar el ciclo de una hospitalización: ingreso, traslado entre camas y egreso.

## Actores
Administrativo/Médico (ingresa, traslada, egresa), Enfermería (consulta disponibilidad de camas).

## Flujos principales
1. Ingreso de paciente, con asignación opcional de cama (valida que no esté ocupada).
2. Traslado entre camas (libera la cama de origen, ocupa la de destino, registra el traslado).
3. Egreso (libera la cama, marca la admisión como `DISCHARGED`).
4. Consulta de disponibilidad de camas por pabellón (`Ward`).

## Dependencias
`Patients`. Es consumido por `Nursing` (las notas de enfermería pueden ligarse a una admisión).

## Datos (modelo Prisma)
`Ward`, `Bed`, `Admission`, `Transfer`.

## Decisiones pendientes
- No hay todavía datos semilla de pabellones/camas reales — se deben cargar según la institución.
- Reglas de priorización/asignación automática de cama no implementadas (hoy la asignación es manual).
