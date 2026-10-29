# ADR-002 — Estilo de arquitectura: monolito modular

**Estado:** Aceptado
**Fecha:** 2026-10-27
**Decisores:** Equipo HISDATA

## Contexto

Se evaluó construir HISDATA como microservicios independientes desde el día 1 frente a un monolito modular con límites de dominio estrictos.

| Criterio | Microservicios desde el inicio | Monolito modular |
|---|---|---|
| Equipo actual | Requiere equipo mayor para sostener múltiples despliegues | Mantenible por equipo pequeño |
| Costes operativos | Altos (orquestación, N bases de datos, observabilidad distribuida) | Bajos-medios |
| Consistencia de datos | Transacciones distribuidas, eventual consistency | Transacciones ACID simples |
| Seguridad | Mayor superficie de ataque | Superficie controlada |
| Velocidad de entrega | Lenta | Rápida |
| Evolución futura | Ya distribuido, caro de corregir límites mal definidos | Extracción posterior barata si los límites internos son estrictos |

## Decisión

HISDATA se construye como **monolito modular**: una única aplicación NestJS (`apps/api`) con **un módulo por dominio funcional** (`src/modules/<dominio>`), cada uno con:

- Su propio conjunto de entidades/modelos en el esquema de Prisma, con prefijo de dominio.
- Su propio controller, service, DTOs y reglas de validación.
- **Prohibición explícita** de que un módulo acceda directamente al repositorio/modelo de otro módulo: toda comunicación entre dominios pasa por el service público del módulo correspondiente (inyectado vía el sistema de módulos de NestJS).
- Pruebas propias (unitarias y de integración) dentro de su carpeta.

### Señales que justificarán extraer un módulo a microservicio independiente (no "porque toca")

1. Carga de tráfico sostenida y claramente diferenciada frente al resto del sistema.
2. Un equipo dedicado exclusivamente a ese dominio.
3. Necesidad real de despliegue o escalado independiente (ej. picos en `laboratory` o `imaging`).
4. Requisito de aislamiento de seguridad reforzado (ej. `pharmacy`, `billing`).
5. Necesidad de un modelo de datos o motor de persistencia distinto al resto (ej. almacenamiento de imágenes DICOM).

Mientras ninguna de estas señales se cumpla, el módulo permanece dentro del monolito.

## Consecuencias

- Despliegue único y simple en esta etapa, con un solo pipeline de CI/CD.
- Consistencia transaccional garantizada por PostgreSQL dentro del monolito.
- La carpeta `services/` de la propuesta original de repositorio se reinterpreta como `apps/api/src/modules/` mientras no exista extracción real; el nombre de cada módulo ya anticipa el nombre que tendría el futuro servicio independiente.
- Antes de cualquier extracción futura se documentará un nuevo ADR específico.
