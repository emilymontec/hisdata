# Copias de seguridad y restauración — HISDATA

## Estado actual

**No hay backups configurados todavía** — no existe un entorno de producción. Este documento define la política a seguir en cuanto exista; implementarla y, sobre todo, **probarla**, es un pendiente manual (ver `docs/gestion/pendientes-manuales.md`): un backup nunca restaurado no es un backup confiable.

## Qué se respalda

- **Base de datos PostgreSQL completa** (toda la información clínica, administrativa y de auditoría vive ahí): es el respaldo crítico y obligatorio.
- **Archivos adjuntos** (resultados de imagenología, documentos de certificados): dependen de la solución de almacenamiento de archivos, todavía no elegida (`docs/gestion/pendientes-manuales.md`). Mientras esa decisión no exista, no hay archivos reales que respaldar — el campo `documentUrl` en el esquema está vacío en la práctica.
- **Código fuente:** respaldado por el propio control de versiones (Git) — no requiere un proceso de backup adicional, sí una política de ramas protegidas en el proveedor que se use.

## Qué NO cubre este documento

- Backups de la máquina/infraestructura del desarrollador — fuera del alcance del proyecto.
- Backups de credenciales de proveedores externos (ej. correo) — deben gestionarse con el gestor de secretos que se elija para producción.

## Política propuesta (a implementar cuando exista el entorno de producción)

| Elemento | Frecuencia propuesta | Retención propuesta |
|---|---|---|
| Backup completo de PostgreSQL | Diario | 30 días |
| Backup incremental / WAL (si el proveedor lo soporta) | Continuo | 7 días |
| Prueba de restauración | **Mensual, obligatoria** | — |

Estos números son un punto de partida razonable, no una norma fija: deben ajustarse según el volumen real de atenciones y cualquier obligación normativa de retención de historia clínica que aplique en tu jurisdicción (ver la revisión legal pendiente en `docs/gestion/pendientes-manuales.md` — algunas normativas de salud exigen retención de varios años, lo cual puede ser más largo que estos 30 días para cierto tipo de datos).

## Procedimiento de restauración (a seguir y documentar con evidencia real la primera vez que se ejecute)

1. Aprovisionar una instancia de PostgreSQL limpia (nunca restaurar sobre la base de datos de producción directamente).
2. Restaurar el backup completo más reciente.
3. Aplicar los backups incrementales/WAL posteriores si existen.
4. Ejecutar `npx prisma migrate deploy` para confirmar que el esquema restaurado es compatible con la versión de código que se va a desplegar.
5. Verificar con una consulta de prueba (ej. contar usuarios y pacientes) que los datos restaurados tienen sentido.
6. Documentar la fecha, duración y resultado de la prueba — si una restauración mensual nunca se registra, no hay evidencia de que el proceso funcione.

## Responsabilidad

Sin una institución y un proveedor de hosting definidos todavía, no hay un responsable asignado de ejecutar y verificar backups. Esto debe asignarse explícitamente antes de producción — no puede quedar implícito.
