# Módulo: Laboratorio clínico

**Código fuente:** `apps/api/src/modules/laboratory`

## Objetivo
Dar seguimiento al ciclo de una solicitud de laboratorio: toma de muestra, registro de resultados, validación y publicación.

## Actores
Enfermería/Médico (toma de muestra), Médico (registro y validación de resultados — rol provisional, ver pendientes).

## Flujos principales
1. Registro de toma de muestra (`SAMPLE_COLLECTED`).
2. Registro de resultado por parámetro (`RESULT_REGISTERED`).
3. Validación y publicación conjunta (`PUBLISHED`) — solo posible si el estado previo es `RESULT_REGISTERED`.
4. Consulta de resultados (auditada: toda lectura queda registrada).

## Dependencias
`Orders` (toda solicitud de laboratorio nace de una orden médica de tipo `LABORATORY`).

## Datos (modelo Prisma)
`LabRequest`, `LabResult`.

## Decisiones pendientes
- No existe todavía un rol específico de "técnico/auxiliar de laboratorio": hoy se reutilizan `ENFERMERIA`/`MEDICO`.
- Reglas clínicas de validación de resultados (rangos críticos, alertas) no implementadas — solo se audita quién y cuándo validó.
- Integración con equipos/sistemas de laboratorio reales: pendiente de contrato técnico (ver `docs/gestion/decisiones-pendientes.md`).
