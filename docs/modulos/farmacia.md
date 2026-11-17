# Módulo: Farmacia

**Código fuente:** `apps/api/src/modules/pharmacy`

## Objetivo
Gestionar el catálogo de medicamentos, el stock por lote y la dispensación contra prescripciones activas.

## Actores
Administrador (catálogo, ingreso de stock), Enfermería/Administrador (dispensación).

## Flujos principales
1. Alta de medicamento en el catálogo.
2. Ingreso de lote de stock (número de lote, cantidad, fecha de vencimiento opcional).
3. Dispensación: descuenta stock siguiendo FIFO por fecha de vencimiento más próxima entre los lotes disponibles, valida que la prescripción esté `ACTIVE` y que el ítem esté vinculado a un medicamento del catálogo.
4. Consulta del catálogo con su stock agregado.

## Dependencias
`Prescriptions` (toda dispensación se hace contra un ítem de prescripción existente).

## Datos (modelo Prisma)
`Medication`, `PharmacyStock`, `DispensationRecord`.

## Decisiones pendientes
- Seguimiento de vencimientos próximos (alertas) no implementado — el dato existe (`expiresAt`) pero no hay un proceso que lo revise proactivamente.
- No hay validación automática de que la cantidad dispensada corresponda a lo indicado en `dosageInstructions` (texto libre) — depende de definir una estructura de dosis parseable, lo cual es una regla clínica pendiente.
- Rol específico de "farmacéutico" no definido: hoy se reutiliza `ADMIN`/`ENFERMERIA`.
