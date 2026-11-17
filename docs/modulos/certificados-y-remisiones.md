# Módulo: Certificados y remisiones

**Código fuente:** `apps/api/src/modules/certificates`

## Objetivo
Registrar la emisión de documentos autorizados (constancias de atención, remisiones, incapacidades, otros) asociados a un paciente.

## Actores
Médico/Administrativo (emiten), Administrador (consulta general).

## Flujos principales
1. Emisión de documento con tipo, contenido (texto libre) y URL opcional del documento generado.
2. Consulta de documentos por paciente (auditada).

## Dependencias
`Patients`.

## Datos (modelo Prisma)
`Certificate` (tipos: `CONSTANCIA_ATENCION`, `REMISION`, `INCAPACIDAD`, `OTRO`).

## Decisiones pendientes
- Plantillas formales por tipo de documento (estructura, campos obligatorios, validez legal) no definidas — el contenido hoy es texto libre aprobado por quien lo emite.
- Generación de PDF/documento final y su almacenamiento: depende de la solución de almacenamiento de archivos (pendiente, ver ADR-004).
- Requisitos legales específicos por tipo de certificado (ej. incapacidades) deben validarse con el área correspondiente antes de habilitar su emisión formal.
