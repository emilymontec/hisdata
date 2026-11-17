# Módulo: Historia clínica electrónica

**Código fuente:** `apps/api/src/modules/clinical-record`

## Objetivo
Registrar y consultar la información clínica del paciente con trazabilidad completa de accesos.

## Actores
Médico (escribe notas y diagnósticos), Enfermería/Médico/Admin (lectura), Auditor (revisión de accesos vía módulo de Auditoría).

## Flujos principales
1. Creación automática de la historia clínica en el primer uso (una por paciente).
2. Registro de notas clínicas (texto libre).
3. Registro de diagnósticos (con campos `code`/`codeSystem` preparados para un estándar como CIE-10, sin validar todavía).
4. **Toda lectura de la historia clínica se audita** — no solo las escrituras.

## Dependencias
`Patients`.

## Datos (modelo Prisma)
`ClinicalRecord`, `ClinicalNote`, `Diagnosis`.

## Decisiones pendientes (requieren validación de un responsable sanitario antes de ampliar este módulo)
- Mecanismo de firma clínica de notas (campo `signedAt` existe pero no hay flujo de firma implementado).
- Corrección/enmienda de notas ya firmadas (hoy no hay edición, solo creación de nuevas notas).
- Adopción formal de un estándar de codificación diagnóstica (CIE-10 u otro).
- Estructura de antecedentes (alergias, antecedentes familiares/quirúrgicos) aún no modelada como entidad propia.
