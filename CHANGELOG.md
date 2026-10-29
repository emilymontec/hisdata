# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [0.1.0] - 2026-10-28

### Añadido
- ADR-001: selección de stack (NestJS + React/TypeScript + PostgreSQL/Prisma).
- ADR-002: estilo de arquitectura (monolito modular) con criterios explícitos para una futura extracción a microservicios.
- Esquema de base de datos completo (Prisma) para todos los módulos técnicamente viables, excluyendo deliberadamente facturación e integraciones (ver `docs/gestion/decisiones-pendientes.md`).
- Backend NestJS con los siguientes módulos funcionales: autenticación, usuarios, pacientes, citas, historia clínica, consultas médicas, enfermería, admisiones/traslados/egresos, órdenes médicas, laboratorio, imagenología, prescripciones, farmacia, inventario, certificados/remisiones, notificaciones, auditoría.
- Infraestructura transversal: guard de autenticación JWT con soporte `@Public()`, guard de autorización por rol (`RolesGuard`), filtro global de excepciones sin fuga de información sensible, servicio de auditoría reutilizable.
- Seed inicial de roles y usuario administrador de arranque (credenciales de desarrollo, con cambio de contraseña forzado en el primer ingreso).
- Scaffold de frontend (React + TypeScript + Vite): autenticación con refresh automático, layout principal, página de inicio de sesión, rutas protegidas, sistema de diseño propio.
- `docker-compose.yml` y `Dockerfile` para desarrollo local.

### Explícitamente fuera de esta versión
- Facturación y administración (pendiente de reglas tarifarias/contables aprobadas).
- Integraciones e interoperabilidad externa (pendiente de contratos reales).
- Portal del paciente y reportes/analítica avanzada (dependen de que los módulos base estén en uso real).

### Pendiente técnico conocido
- Validar `schema.prisma` con `npx prisma validate` y generar la primera migración (`prisma migrate dev`) en un entorno con acceso a red/npm, no disponible en el entorno de generación de este código.
- Pruebas automatizadas (unitarias/integración) aún no incluidas.
- Pipeline de CI (`.github/workflows/`) aún no incluido.
