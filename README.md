# HISDATA

Sistema de información hospitalario integral — monolito modular construido con NestJS + TypeScript + PostgreSQL (backend) y React + TypeScript (frontend).

Ver las decisiones de arquitectura en `docs/arquitectura/decisiones/` y lo que está deliberadamente fuera de alcance en `docs/gestion/decisiones-pendientes.md`.

## Requisitos

- Node.js 20+
- Docker (para PostgreSQL local)

## Puesta en marcha local

```bash
# 1. Variables de entorno
cp .env.example .env
# Editar .env si es necesario (JWT_ACCESS_SECRET, etc.)

# 2. Instalar dependencias (workspaces: apps/api y apps/web)
npm install

# 3. Levantar PostgreSQL
npm run db:up

# 4. Generar cliente Prisma y aplicar migraciones
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
cd ../..

# 5. Cargar datos base (roles + usuario administrador de arranque)
npm run db:seed

# 6. Levantar backend y frontend (en dos terminales)
npm run dev:api
npm run dev:web
```

- API: http://localhost:3000/api/v1
- Documentación OpenAPI (solo en desarrollo): http://localhost:3000/api/docs
- Frontend: http://localhost:5173

**Usuario de arranque (solo desarrollo):** `admin@hisdata.local` / `CambiarEsta123!` — el sistema obliga a cambiar la contraseña en el primer ingreso.

## Estructura del repositorio

```
HISDATA/
├── apps/
│   ├── api/     # Backend NestJS (monolito modular, ver ADR-002)
│   └── web/     # Frontend React + TypeScript
├── infrastructure/
│   └── containers/   # docker-compose de desarrollo
├── docs/        # Documentación del proyecto (ver docs/proyecto, docs/arquitectura, docs/gestion)
```

## Módulos implementados en esta versión

Auth/usuarios, pacientes, citas, historia clínica (estructura básica), consultas médicas, enfermería, admisiones/traslados/egresos, órdenes médicas, laboratorio, imagenología, prescripciones, farmacia, inventario, certificados/remisiones, notificaciones (canal interno), auditoría.

**Deliberadamente fuera de esta versión:** facturación, integraciones externas, portal del paciente, reportes avanzados. Ver `docs/gestion/decisiones-pendientes.md` para el detalle de por qué y qué se necesita para habilitarlos.

## Seguridad aplicada

- Contraseñas con bcrypt (nunca texto plano); refresh/reset tokens almacenados solo como hash.
- JWT de acceso de corta duración + refresh tokens rotativos.
- Autorización por rol validada siempre en el servidor (`RolesGuard`), nunca solo en el frontend.
- Auditoría obligatoria de operaciones sensibles, incluida toda lectura de historia clínica.
- Filtro global de excepciones: nunca se exponen stack traces ni detalles internos al cliente.
- Migraciones de base de datos versionadas con Prisma.
