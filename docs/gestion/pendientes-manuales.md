# Pendientes manuales de HISDATA

Este documento lista **todo lo que no puedo completar yo mismo** en este entorno (sin acceso a red, sin un servidor real, sin capacidad de tomar decisiones que requieren a una persona responsable) y que necesitas hacer tú — o alguien del equipo/institución — para que HISDATA avance. Está organizado por fase del roadmap. Márcalo a medida que lo completes.

---

## Fase 4 — Preparación (bloqueante: nada más avanza de verdad sin esto)

- [ ] `npm install` en la raíz del repositorio (instala `apps/api` y `apps/web` vía workspaces).
- [ ] Copiar `.env.example` a `.env` y generar un `JWT_ACCESS_SECRET` real (ej. `openssl rand -hex 64`). **Nunca** uses el valor de ejemplo en un entorno real.
- [ ] Levantar PostgreSQL local: `npm run db:up`.
- [ ] `npx prisma generate` y `npx prisma validate` dentro de `apps/api` — **este repositorio nunca se ha validado contra un Prisma real**, es el primer punto de falla posible.
- [ ] `npx prisma migrate dev --name init` para generar la primera migración real.
- [ ] `npm run db:seed` y confirmar que el usuario `admin@hisdata.local` se crea correctamente.
- [ ] Levantar `npm run dev:api` y `npm run dev:web`, y hacer login real desde el navegador.
- [ ] Subir el repositorio a GitHub (o el proveedor que uses) y confirmar que `.github/workflows/ci.yml` corre y pasa. Yo lo escribí, pero nunca se ha ejecutado en un pipeline real.

## Fase 5 — Datos base de la institución

- [ ] Cargar los pabellones (`Ward`) y camas (`Bed`) reales de la institución — hoy no hay ninguno, el módulo de Admisiones no tiene de dónde asignar camas hasta que existan.
- [ ] Decidir y cargar el catálogo inicial de medicamentos (`Medication`) de Farmacia — hoy el catálogo nace vacío.
- [ ] Definir con el área correspondiente si los roles actuales (`ADMIN`, `MEDICO`, `ENFERMERIA`, `ADMINISTRATIVO`, `PACIENTE`, `AUDITOR`) son suficientes, o si Laboratorio/Farmacia necesitan roles propios (ej. "técnico de laboratorio", "farmacéutico").

## Fase 5 — Validaciones que requieren un responsable de dominio (no un desarrollador)

Estas **no son tareas técnicas**: implementarlas sin esa validación sería imponer una regla clínica/administrativa no autorizada.

- [ ] **Historia clínica:** definir con un responsable sanitario el mecanismo de firma clínica y de corrección/enmienda de notas ya firmadas.
- [ ] **Diagnósticos:** decidir si se adopta CIE-10 u otro estándar, y quién tiene autoridad para registrar/corregir diagnósticos.
- [ ] **Laboratorio:** definir quién tiene autoridad clínica real para validar/publicar resultados (hoy el código reutiliza el rol `MEDICO` como aproximación).
- [ ] **Prescripciones:** decidir si se requiere motor de validación de interacciones medicamentosas/dosis máximas, y con qué fuente de datos farmacológicos — **deliberadamente no implementado** hasta tener esa decisión.
- [ ] **Certificados:** definir plantillas formales y requisitos legales por tipo de documento (incapacidad, remisión, etc.) con el área legal/administrativa.
- [ ] **Facturación:** definir reglas tarifarias, contables y tributarias con el área financiera — módulo completo todavía sin empezar por esto.
- [ ] **Integraciones:** identificar los sistemas externos reales a integrar y obtener sus contratos técnicos (HL7/FHIR u otro) — módulo completo todavía sin empezar por esto.

## Fase 3/7 — Infraestructura que requiere decisiones y cuentas externas

- [ ] **Almacenamiento de archivos** (resultados de imagenología, documentos de certificados): elegir proveedor (ej. S3, un bucket compatible, almacenamiento local cifrado) y crear la cuenta/credenciales correspondientes. Yo no puedo elegir esto por ti porque implica costos y políticas de retención propias de la institución.
- [ ] **Proveedor de correo** para notificaciones por `EMAIL`: crear cuenta en un proveedor (ej. SES, SendGrid, Postmark) y configurar las credenciales — hoy el canal `EMAIL` solo registra la intención, no envía nada.
- [ ] **Hosting de producción:** decidir dónde se despliega (VPS propio, un proveedor cloud, etc.) y crear la infraestructura — no hay ningún despliegue real todavía.
- [ ] **Dominio y certificado SSL** si se expone públicamente.
- [ ] **Backups reales:** configurar backups automáticos de PostgreSQL en el proveedor elegido y **probar una restauración real** — un backup nunca probado no es un backup confiable.

## Fase 6 — Verificación que requiere ejecución real o herramientas externas

- [ ] Pruebas de penetración / auditoría de seguridad externa — no puedo simular ataques reales desde este entorno.
- [ ] Pruebas de rendimiento bajo carga real (ej. con k6, Artillery) contra un servidor real.
- [ ] Pruebas de accesibilidad con herramientas asistivas reales (lectores de pantalla) una vez exista el frontend oficial — el provisional no se evaluó para esto a propósito.

## Fase 7 — Cumplimiento normativo (obligatorio antes de producción real)

- [ ] Revisión por un abogado o responsable de cumplimiento de las obligaciones normativas aplicables a tu país/región para el manejo de datos de salud (ej. habeas data, historia clínica electrónica, retención legal de registros médicos).
- [ ] **No declarar cumplimiento de ninguna norma específica** (HIPAA, ISO 27001, normativa local de historia clínica, etc.) hasta que esa revisión exista con evidencia — yo no puedo certificar esto por ti.

---

### Cómo usar este documento
Cada vez que completes uno de estos puntos, dímelo y actualizo `docs/proyecto/roadmap.md` para reflejarlo. Los puntos de esta lista nunca se marcarán como hechos por mí solo — necesitan tu confirmación de que realmente se hicieron (correr un comando, tomar una decisión con alguien, crear una cuenta externa).
