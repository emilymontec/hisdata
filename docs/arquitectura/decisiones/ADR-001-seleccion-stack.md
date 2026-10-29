# ADR-001 — Selección del stack tecnológico

**Estado:** Aceptado
**Fecha:** 2026-10-27
**Decisores:** Equipo HISDATA

## Contexto

HISDATA necesita un stack capaz de soportar un sistema de información hospitalario modular, seguro y mantenible, construido inicialmente por un equipo pequeño, con posibilidad de crecer hacia microservicios en el futuro.

Se compararon tres combinaciones completas (frontend + backend + base de datos):

| Criterio | NestJS + React/TS + PostgreSQL | Spring Boot + React/TS + PostgreSQL | Django + React/TS + PostgreSQL |
|---|---|---|---|
| Tipado end-to-end | Alto (TypeScript en frontend y backend) | Alto (Java) | Medio (Python dinámico + type hints) |
| Modularidad nativa | Alta (módulos NestJS = límites de dominio) | Alta (Spring Modulith / módulos) | Media (apps Django) |
| Seguridad / autenticación | Buena, requiere configuración (Passport, Guards) | Excelente (Spring Security, probado en salud) | Buena (Django batteries-included) |
| Velocidad de desarrollo inicial | Alta | Media | Muy alta |
| Costes de infraestructura | Bajos-medios | Medios-altos (JVM) | Bajos-medios |
| Preparación para microservicios futuros | Nativa, ligera | Muy sólida pero más pesada | Posible, menos natural |
| Documentación/ecosistema | Muy buena | Excelente (enterprise) | Muy buena |

## Decisión

Se adopta: **NestJS (Node.js + TypeScript) + React con TypeScript + PostgreSQL**, con **Prisma** como ORM y gestor de migraciones.

- **Backend:** NestJS, arquitectura modular por dominio (`modules/<dominio>`), validación con `class-validator`/`class-transformer`, documentación OpenAPI autogenerada con `@nestjs/swagger`.
- **Frontend:** React 18 + TypeScript + Vite, React Router, TanStack Query para estado de servidor.
- **Base de datos:** PostgreSQL 16, modelado y migraciones versionadas con Prisma.
- **Autenticación:** JWT de acceso de corta duración + refresh tokens rotativos almacenados hasheados; contraseñas con `bcrypt`.
- **Autorización:** RBAC (roles y permisos) validado siempre en el servidor mediante Guards.
- **Documentación de API:** OpenAPI 3 generado desde decoradores NestJS, publicado en `docs/api/openapi.yaml`.
- **Contenedores:** Docker + docker-compose para desarrollo local; preparado para orquestación posterior.

## Alternativa considerada

Django + DRF + React/TS queda como alternativa viable si se prioriza velocidad de entrega sobre tipado end-to-end. No se descarta para módulos futuros aislados si el contexto lo justifica.

## Consecuencias

- Un único lenguaje (TypeScript) en todo el stack de aplicación, lo que reduce el costo cognitivo de mantener contratos compartidos (`packages/shared-contracts`).
- Prisma impone migraciones versionadas por diseño, cumpliendo la regla transversal de seguridad/calidad del proyecto.
- Si en el futuro un módulo requiere extracción a microservicio (ver ADR-002), NestJS facilita esa transición sin cambiar de lenguaje ni de framework.
