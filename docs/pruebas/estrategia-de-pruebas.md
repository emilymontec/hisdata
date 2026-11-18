# Estrategia de pruebas — HISDATA

## Estado actual (honesto)

Hoy existe **una sola prueba automatizada** en todo el repositorio: `apps/api/src/modules/patients/__tests__/duplicate-detection.util.spec.ts`, que valida la función pura de detección de duplicados. Todo lo demás en este documento es la estrategia a seguir, no algo ya cubierto.

## Niveles de prueba y su alcance en HISDATA

| Nivel | Qué cubre | Herramienta | Estado |
|---|---|---|---|
| Unitaria | Funciones puras y lógica de servicio sin tocar base de datos real (ej. `isLikelySamePerson`, cálculo de solapamiento de citas, FIFO de farmacia) | Jest + `ts-jest` (ya configurado en `apps/api/jest.config.js`) | 🟡 1 de ~15 casos prioritarios cubierto |
| Integración | Un módulo completo contra una base de datos de prueba real (ej. levantar Postgres en Docker, correr migraciones, probar `PatientsService.create` de punta a punta) | Jest + Prisma contra una base de datos `hisdata_test` separada | ⬜ No iniciado |
| API (end-to-end) | Flujo HTTP completo con autenticación real: login → crear paciente → crear cita → etc. | `supertest` (ya en `devDependencies`) contra la app NestJS completa | ⬜ No iniciado |
| Interfaz | Que las pantallas provisionales/oficiales funcionen desde el navegador | Por definir (ej. Playwright) una vez exista el frontend oficial — no tiene sentido invertir en esto sobre el frontend provisional | ⬜ No iniciado a propósito |
| Seguridad | Autorización por rol, inyección, fuerza bruta, exposición de datos | Revisión manual + herramienta externa (ver `docs/gestion/pendientes-manuales.md`) | ⬜ No iniciado |
| Rendimiento | Tiempos de respuesta bajo carga | k6 o Artillery contra un entorno real (no este entorno de desarrollo) | ⬜ No iniciado |
| Accesibilidad | Navegación por teclado, lectores de pantalla, contraste | axe-core / revisión manual, una vez exista el frontend oficial | ⬜ No iniciado a propósito |

## Prioridad de pruebas unitarias pendientes (la lógica de negocio más riesgosa primero)

1. `AppointmentsService` — validación de solapamiento de horario (`assertNoOverlap`).
2. `AuthService` — bloqueo por intentos fallidos, rotación de refresh token.
3. `PharmacyService.dispense` — descuento FIFO por vencimiento y validación de stock insuficiente.
4. `PatientsService.create` — detección de duplicado exacto por documento.
5. `AdmissionsService` — que una cama ocupada no pueda asignarse dos veces.

Para los módulos 1 y 3-5, al depender de Prisma, conviene usar un mock del `PrismaService` (inyectado por NestJS) en vez de una base de datos real — eso los mantiene en el nivel "unitaria" y rápidos de correr.

## Qué NO se prueba automáticamente a propósito (todavía)

- Reglas clínicas que no existen en el código (interacciones medicamentosas, validación diagnóstica) — no hay nada que probar hasta que se implementen con validación profesional.
- El frontend provisional — se descarta intencionalmente para no invertir esfuerzo de prueba en algo que se reemplazará.

## Cómo correr lo que ya existe

```bash
cd apps/api
npm test              # corre todas las pruebas .spec.ts
npm run test:cov      # con reporte de cobertura
```
