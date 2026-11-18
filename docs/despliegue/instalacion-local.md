# Instalación local — HISDATA

Esta guía asume Node.js 20+ y Docker instalados. Ninguno de estos pasos se ha ejecutado todavía en el entorno donde se generó este código (sin acceso a red); es responsabilidad de quien instala confirmarlos — ver también `docs/gestion/pendientes-manuales.md`.

## 1. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y reemplaza `JWT_ACCESS_SECRET` por un valor aleatorio largo:

```bash
openssl rand -hex 64
```

Nunca uses el valor de ejemplo del repositorio en un entorno que no sea tu máquina local de desarrollo.

## 2. Instalar dependencias

```bash
npm install
```

Esto instala ambos workspaces (`apps/api` y `apps/web`) desde el `package.json` raíz.

## 3. Base de datos

```bash
npm run db:up                 # levanta PostgreSQL en Docker (infrastructure/containers/docker-compose.yml)
cd apps/api
npx prisma generate           # genera el cliente Prisma
npx prisma validate           # valida el esquema — primer punto de falla posible, revisar con cuidado
npx prisma migrate dev --name init   # crea la primera migración real
cd ../..
npm run db:seed               # roles base + usuario administrador de arranque
```

## 4. Levantar la aplicación

En dos terminales separadas:

```bash
npm run dev:api   # http://localhost:3000/api/v1
npm run dev:web   # http://localhost:5173
```

Documentación interactiva de la API (solo en `NODE_ENV` distinto de `production`): `http://localhost:3000/api/docs`.

## 5. Primer ingreso

Usuario de arranque: `admin@hisdata.local` / `CambiarEsta123!`. El sistema exige cambiar esta contraseña en el primer ingreso (`mustChangePassword`). Este usuario es **solo para desarrollo** — nunca debe existir con esta contraseña en un entorno accesible por terceros.

## 6. Datos base adicionales

Antes de usar los módulos de Admisiones y Farmacia de forma realista, necesitas cargar manualmente:
- Pabellones y camas (`Ward`/`Bed`) — no hay ningún dato semilla de esto.
- Catálogo inicial de medicamentos (`Medication`) — hoy nace vacío.

Ver `docs/gestion/pendientes-manuales.md` para el detalle completo de qué más requiere una decisión o acción humana antes de producción.

## Problemas comunes esperables (no verificados aún)

- Si `prisma validate` falla por una relación mal nombrada: revisar `apps/api/prisma/schema.prisma`, cada relación con `@relation("Nombre")` debe aparecer exactamente dos veces (ya se verificó manualmente con `grep`, pero no con la herramienta oficial de Prisma).
- Si el frontend no puede llamar a la API por CORS: confirmar que `CORS_ORIGIN` en `.env` incluye `http://localhost:5173`.
