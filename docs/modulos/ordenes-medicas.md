# Módulo: Órdenes médicas y procedimientos

**Código fuente:** `apps/api/src/modules/orders`

## Objetivo
Registrar y dar seguimiento a solicitudes de exámenes y procedimientos.

## Actores
Médico (crea y actualiza estado), Enfermería/Admin (consulta y avanza estados operativos).

## Flujos principales
1. Creación de orden (tipo `LABORATORY`, `IMAGING` o `PROCEDURE`). Si es de laboratorio o imagenología, crea automáticamente la solicitud correspondiente en esos módulos.
2. Consulta de órdenes por paciente, incluyendo resultados/informes asociados.
3. Actualización de estado (`IN_PROGRESS`, `COMPLETED`, `CANCELLED`).

## Dependencias
`Patients`, `MedicalConsultation` (opcional). Es el punto de entrada de `Laboratory` e `Imaging`.

## Datos (modelo Prisma)
`MedicalOrder` (con relaciones 1:1 opcionales a `LabRequest` e `ImagingRequest`).

## Decisiones pendientes
- Tipo `PROCEDURE` no tiene todavía un submódulo de seguimiento propio (a diferencia de laboratorio/imagenología) — se definirá según necesidad real.
