# Guía para agentes de IA en HISDATA

Si vas a modificar este repositorio con ayuda de un asistente de IA, respeta estas reglas:

1. **No implementes reglas clínicas, tarifarias o de facturación sin aprobación explícita documentada.** Ver `docs/gestion/decisiones-pendientes.md` antes de tocar diagnósticos, prescripciones, laboratorio, facturación o certificados.
2. **Todo endpoint protegido debe usar `@Roles(...)` y validar en el servidor.** Nunca confíes en que el frontend oculte una opción como control de seguridad.
3. **Toda operación sensible se audita** con `AuditService.record(...)`: creación/edición de pacientes, historia clínica, prescripciones, dispensación, admisiones, etc.
4. **Ningún módulo accede directamente a las tablas de otro módulo.** Si `orders` necesita datos de `patients`, se inyecta `PatientsService`, no se consulta `prisma.patient` desde `orders`.
5. **Las contraseñas, tokens y secretos nunca se registran en logs** ni se devuelven en respuestas (ver `UsersService.sanitize`).
6. **Toda migración de esquema pasa por Prisma** (`prisma migrate dev`), nunca se edita el esquema de la base de datos manualmente.
7. **Antes de extraer un módulo a microservicio**, revisa las señales listadas en `docs/arquitectura/decisiones/ADR-002-estilo-arquitectura.md` y documenta un nuevo ADR.
8. **Usa datos sintéticos** en pruebas y seeds; nunca datos reales de pacientes.
