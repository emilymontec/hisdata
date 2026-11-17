# Módulo: Enfermería

**Código fuente:** `apps/api/src/modules/nursing`

## Objetivo
Registrar observaciones y actuaciones de enfermería asociadas a una admisión.

## Actores
Enfermería (crea), Médico/Admin (consulta).

## Flujos principales
1. Registro de nota de enfermería, con signos vitales en estructura libre (JSON) y observación en texto.
2. Consulta de notas por admisión.

## Dependencias
`Admissions` (opcional — una nota puede no estar ligada a una admisión activa, ej. atención ambulatoria).

## Datos (modelo Prisma)
`NursingNote`.

## Decisiones pendientes
- Conjunto formal de signos vitales a capturar (hoy es un objeto JSON sin estructura fija) — requiere definición con el equipo de enfermería.
- Catálogo de actuaciones de enfermería autorizadas (hoy es texto libre, sin catálogo cerrado).
