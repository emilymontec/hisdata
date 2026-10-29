# Contribuir a HISDATA

1. Cada módulo vive en `apps/api/src/modules/<dominio>` con su propio controller, service, dto y pruebas.
2. Antes de agregar una regla de negocio clínica o administrativa específica, revisa `docs/gestion/decisiones-pendientes.md` — puede requerir validación previa de un responsable del dominio.
3. Toda migración de base de datos se genera con `npx prisma migrate dev --name <descripcion>` desde `apps/api`.
4. Las decisiones de arquitectura relevantes se documentan como un nuevo ADR en `docs/arquitectura/decisiones/`.
5. Ejecuta `npm run lint` y las pruebas correspondientes antes de proponer un cambio.
