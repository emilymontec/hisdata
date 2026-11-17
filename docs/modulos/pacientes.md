# Módulo: Gestión de pacientes

**Código fuente:** `apps/api/src/modules/patients`

## Objetivo
Mantener un registro único, buscable y confiable de cada paciente.

## Actores
Administrador, Administrativo (gestión completa), Médico/Enfermería (lectura y creación).

## Flujos principales
1. Registro de paciente, validando que no exista ya el mismo tipo+número de documento.
2. Heurística de posibles duplicados por nombre + fecha de nacimiento (no bloquea el registro, solo lo marca para revisión administrativa).
3. Búsqueda por documento, nombre o apellido.
4. Actualización de datos de contacto (el documento de identidad no se edita por este endpoint).
5. Revisión y descarte manual de la marca de posible duplicado.

## Dependencias
Ninguna funcional directa; es consumido por casi todos los demás módulos clínicos/administrativos.

## Datos (modelo Prisma)
`Patient` (con índice único por tipo+número de documento, y campo `duplicateOfId` para la marca heurística).

## Decisiones pendientes
- La heurística de duplicados es administrativa (nombre normalizado + fecha de nacimiento exacta), no clínica ni biométrica. Si se requiere algo más robusto (ej. coincidencia difusa, verificación contra una base de identificación nacional), debe evaluarse aparte.
- Validación de identidad (ej. contra una base oficial) no implementada: depende de un proveedor/convenio externo.
