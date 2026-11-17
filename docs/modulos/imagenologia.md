# Módulo: Imagenología

**Código fuente:** `apps/api/src/modules/imaging`

## Objetivo
Dar seguimiento a solicitudes de imágenes diagnósticas y sus informes.

## Actores
Médico (marca en proceso, redacta el informe), Enfermería/Admin (consulta).

## Flujos principales
1. Marcar solicitud en proceso (`IN_PROGRESS`).
2. Crear informe (`REPORTED`), con hallazgos y, opcionalmente, URL del documento/imagen.
3. Consulta de la solicitud con su informe (auditada).

## Dependencias
`Orders` (toda solicitud nace de una orden médica de tipo `IMAGING`).

## Datos (modelo Prisma)
`ImagingRequest`, `ImagingReport`.

## Decisiones pendientes
- `documentUrl` está preparado pero no hay almacenamiento de archivos implementado todavía (ver ADR-004, pendiente de crear).
- Integración con sistemas PACS/DICOM reales: pendiente de contrato técnico.
