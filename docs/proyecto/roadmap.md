# Roadmap de HISDATA

Última actualización: 2026-11-17. Este documento se actualiza cada vez que avanza una fase. Convenciones:

- ✅ Hecho
- 🟡 Parcial / provisional (funciona, pero no es la versión definitiva)
- ⬜ Pendiente
- 🚫 Excluido a propósito (requiere decisión/validación externa antes de empezar)

---

## Fase 1 — Definición ✅

| Elemento | Estado |
|---|---|
| Visión y objetivos | ✅ |
| Alcance inicial y límites | ✅ (ampliado luego: ver nota) |
| Usuarios y perfiles preliminares | ✅ (`ADMIN`, `MEDICO`, `ENFERMERIA`, `ADMINISTRATIVO`, `PACIENTE`, `AUDITOR`) |
| Lista de módulos y dependencias | ✅ |
| Riesgos y supuestos iniciales | ✅ |

> Nota: el alcance se amplió luego de la decisión inicial de MVP — se pasó de un MVP mínimo a construir **todos los módulos técnicamente viables** (excluyendo solo los que dependen de reglas tarifarias/contractuales externas). Ver `docs/gestion/decisiones-pendientes.md`.

## Fase 2 — Selección tecnológica ✅

| Elemento | Estado |
|---|---|
| Comparación de ≥3 stacks completos | ✅ |
| Recomendación fundamentada | ✅ — NestJS + React/TS + PostgreSQL/Prisma |
| ADR-001 (selección de stack) | ✅ `docs/arquitectura/decisiones/ADR-001-seleccion-stack.md` |

## Fase 3 — Arquitectura ✅

| Elemento | Estado |
|---|---|
| Microservicios vs. monolito modular (comparación) | ✅ |
| ADR-002 (estilo de arquitectura) | ✅ `docs/arquitectura/decisiones/ADR-002-estilo-arquitectura.md` |
| Estructura de repositorio | ✅ |
| Modelo de datos conceptual/físico | ✅ `apps/api/prisma/schema.prisma` (16 módulos modelados) |
| Diccionario de datos formal | ⬜ `docs/arquitectura/diccionario-datos.md` no creado todavía (el schema de Prisma es la fuente de verdad actual, falta su versión documental) |
| ADR-003 (autenticación) | ⬜ Falta formalizar como ADR independiente (la decisión ya está tomada e implementada: JWT + refresh rotativo) |
| ADR-004 (almacenamiento de archivos) | 🚫 No hay solución de almacenamiento de archivos definida (afecta `documentUrl` en imagenología/certificados) |

## Fase 4 — Preparación ✅ (local) / 🟡 (CI)

| Elemento | Estado |
|---|---|
| Estructura real de repositorio | ✅ |
| `package.json` raíz (workspaces) | ✅ |
| Configuración local (`.env.example`, `docker-compose.yml`, `Dockerfile`) | ✅ |
| Instrucciones de instalación (`README.md`) | ✅ |
| CI básico (lint/build/test) | 🟡 `.github/workflows/ci.yml` creado, no validado corriendo en un pipeline real |
| Validación real del proyecto (`npm install`, `prisma validate`, `prisma migrate dev`) | ⬜ **No ejecutado todavía** — el entorno de generación de este código no tiene acceso a red/npm. Es el primer paso que debes correr tú localmente. |

## Fase 5 — Desarrollo incremental (backend) — 🟡 en curso

### Backend: módulos con código funcional completo

| Módulo | Backend | Notas |
|---|---|---|
| 1. Autenticación y usuarios | ✅ | Login, refresh rotativo, logout, recuperación de contraseña, bloqueo por intentos fallidos |
| 2. Pacientes | ✅ | CRUD, búsqueda, detección heurística de duplicados |
| 3. Citas y agenda | ✅ | Crear, cancelar, reprogramar (con historial), completar, validación de solapamiento |
| 4. Historia clínica electrónica | 🟡 | Notas y diagnósticos con auditoría de lectura; **falta** firma clínica y corrección de notas (pendiente de validación sanitaria) |
| 5. Consultas médicas | ✅ | Registro vinculado a cita + historia clínica |
| 6. Enfermería | ✅ | Notas con signos vitales en JSON libre |
| 7. Admisiones, traslados y egresos | ✅ | Incluye gestión básica de camas/pabellones |
| 8. Órdenes médicas | ✅ | Crea automáticamente la solicitud de laboratorio/imagenología según el tipo |
| 9. Laboratorio clínico | 🟡 | Flujo de estados completo; **falta** rol específico de técnico de laboratorio y reglas de validación clínica |
| 10. Imagenología | 🟡 | Flujo de informes completo; **falta** almacenamiento real de archivos |
| 11. Prescripciones médicas | 🟡 | Registro/consulta/cancelación; **interacciones medicamentosas y dosis máximas NO implementadas a propósito** |
| 12. Farmacia | ✅ | Catálogo, stock por lote, dispensación FIFO por vencimiento |
| 13. Inventario y recursos hospitalarios | ✅ | Insumos/equipos, movimientos IN/OUT/ADJUSTMENT |
| 14. Facturación y administración | 🚫 | Excluido — requiere reglas tarifarias/contables aprobadas |
| 15. Certificados y remisiones | 🟡 | Registro de documento con contenido libre; **faltan** plantillas formales por tipo |
| 16. Portal del paciente | 🚫 | Excluido — depende de que los módulos base estén en uso real primero |
| 17. Reportes y analítica | 🚫 | Excluido — depende de tener datos reales circulando |
| 18. Auditoría y seguridad | ✅ | Registro transversal + consulta restringida a `AUDITOR`/`ADMIN` |
| 19. Notificaciones | 🟡 | Canal `IN_APP` funcional; canal `EMAIL` solo registra intención (sin proveedor real conectado) |
| 20. Integraciones e interoperabilidad | 🚫 | Excluido — requiere contratos externos definidos |

### Frontend: pantallas provisionales

| Módulo | Frontend | Notas |
|---|---|---|
| Autenticación | ✅ | Login, refresh automático, logout, rutas protegidas |
| Pacientes | ✅ | Búsqueda + registro |
| Citas y agenda | 🟡 | Crear/listar/cancelar; **sin selector de profesional** (usa el usuario con sesión activa) |
| Historia clínica | 🟡 | Ver notas/diagnósticos + agregar (solo rol `MEDICO`); sin firma clínica (no existe en backend) |
| Consultas médicas | 🟡 | Registro y consulta de historial; sin vínculo a una cita específica desde el formulario |
| Enfermería | ⬜ | Pendiente |
| Admisiones/camas | 🟡 | Ingreso y disponibilidad de camas; **sin pantallas de traslado ni egreso** (endpoints ya existen en el backend) |
| Órdenes médicas | 🟡 | Crear y listar por paciente; sin pantalla de cambio de estado manual |
| Laboratorio | ⬜ | Pendiente |
| Imagenología | ⬜ | Pendiente |
| Prescripciones | 🟡 | Un medicamento por prescripción (texto libre), cancelar; sin selector de catálogo todavía |
| Farmacia | 🟡 | Catálogo e ingreso de stock; **sin pantalla de dispensación** |
| Inventario | ⬜ | Pendiente |
| Certificados | ⬜ | Pendiente |
| Notificaciones | ⬜ | Pendiente |
| Auditoría (vista para `AUDITOR`) | ⬜ | Pendiente |

> Todo el frontend actual es **provisional**: funcional para probar el backend de punta a punta, pero sin el diseño visual definitivo. Se reemplazará por el frontend oficial en una fase posterior (ver Fase 5-B).

## Fase 5-B — Frontend oficial ⬜

| Elemento | Estado |
|---|---|
| Definición de sistema visual definitivo (`docs/diseno/sistema-visual.md`) | ⬜ |
| Componentes de UI reutilizables (`docs/diseno/componentes-ui.md`) | ⬜ |
| Accesibilidad formal (`docs/diseno/accesibilidad.md`) | ⬜ |
| Reemplazo del frontend provisional por el oficial | ⬜ |

## Fase 6 — Verificación ⬜

| Elemento | Estado |
|---|---|
| Pruebas unitarias | 🟡 Solo 1 prueba de ejemplo (`duplicate-detection.util.spec.ts`) |
| Pruebas de integración | ⬜ |
| Pruebas de API (end-to-end contra endpoints reales) | ⬜ |
| Pruebas de interfaz | ⬜ |
| Pruebas de seguridad | ⬜ |
| Pruebas de accesibilidad | ⬜ |
| Pruebas de rendimiento | ⬜ |
| `docs/pruebas/*` | ⬜ Ningún documento de esta carpeta creado todavía |

## Fase 7 — Preparación para producción ⬜

| Elemento | Estado |
|---|---|
| Documentación de despliegue (`docs/despliegue/*`) | ⬜ |
| Monitoreo y alertas | ⬜ |
| Copias de seguridad y restauración probada | ⬜ |
| Continuidad y recuperación ante desastres | ⬜ |
| Manual de soporte | ⬜ |
| Manuales de usuario por perfil (`docs/manuales/*`) | ⬜ |
| Revisión de obligaciones normativas aplicables | ⬜ **Obligatorio antes de producción real** — no se ha hecho ninguna revisión legal/normativa |

---

## Resumen ejecutivo del estado actual

- **Backend:** prácticamente completo en estructura para los 16 módulos no excluidos (✅/🟡), con reglas clínicas específicas deliberadamente sin implementar donde requieren validación profesional.
- **Frontend:** 4 de ~16 pantallas provisionales construidas (Login, Pacientes, Citas, Historia clínica). El resto del flujo operativo (consultas, órdenes, laboratorio, imagenología, prescripciones, farmacia, inventario, admisiones, enfermería, certificados, notificaciones, auditoría) **no tiene interfaz todavía**, aunque el backend ya lo soporta.
- **Nunca ejecutado de verdad:** el proyecto no se ha corrido con `npm install` ni contra una base de datos real — eso es, honestamente, el primer paso crítico antes de seguir sumando funcionalidades.
- **No empezado en absoluto:** pruebas más allá de un ejemplo, documentación de despliegue/operación/manuales, diseño visual oficial, y toda revisión normativa/legal.
- **Excluido por decisión, no por olvido:** facturación, integraciones externas, portal del paciente, reportes avanzados.
