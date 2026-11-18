# ADR-004 — Almacenamiento de archivos

**Estado:** 🟡 **Propuesto — pendiente de aprobación.** A diferencia de los demás ADR de este proyecto, esta decisión implica costos recurrentes y la creación de una cuenta/credenciales externas, así que no la tomo por mi cuenta — este documento presenta las opciones para que elijas una (ver también `docs/gestion/pendientes-manuales.md`).

## Contexto

Dos módulos ya tienen un campo `documentUrl` preparado en el esquema de datos, pero sin ninguna solución de almacenamiento detrás todavía:

- **Imagenología** (`ImagingReport.documentUrl`): informes/imágenes diagnósticas.
- **Certificados y remisiones** (`Certificate.documentUrl`): documentos generados.

Ambos pueden contener información clínica sensible, así que la solución elegida debe soportar cifrado en reposo y control de acceso — no basta con "cualquier lugar donde se pueda subir un archivo".

## Opciones

| Opción | Ventajas | Desventajas | Costo aproximado |
|---|---|---|---|
| **Almacenamiento compatible con S3** (AWS S3, Backblaze B2, MinIO autoalojado) | Estándar de facto, cifrado en reposo nativo, URLs firmadas con expiración para controlar acceso temporal, buena documentación | Requiere cuenta y credenciales de un proveedor (o mantener MinIO propio) | Variable según proveedor y volumen; MinIO autoalojado solo cuesta la infraestructura donde corre |
| **Almacenamiento local cifrado en el propio servidor** | Sin dependencia de un tercero, sin costo recurrente adicional | No escala bien con múltiples servidores, backups más manuales, riesgo si el servidor se compromete | Ninguno adicional al servidor ya existente |
| **Servicio gestionado específico de salud** (ej. soluciones con certificación HIPAA/ISO para datos médicos) | Cumplimiento normativo ya resuelto por el proveedor | Mayor costo, posible dependencia fuerte de un proveedor específico | Alto, variable |

## Recomendación preliminar (sujeta a tu aprobación)

Para esta etapa del proyecto, **almacenamiento compatible con S3** (empezando con MinIO autoalojado en desarrollo, migrable a un proveedor cloud en producción sin cambiar código) ofrece el mejor balance entre costo, control y estándar de la industria — y es el camino con menos fricción de integración desde NestJS (librerías maduras como `@aws-sdk/client-s3` funcionan contra cualquier proveedor compatible con S3).

## Lo que falta para aceptar este ADR

1. Que confirmes cuál opción prefieres (o indiques una no listada aquí).
2. Si se opta por un proveedor cloud: crear la cuenta y generar las credenciales (acción manual, ver `docs/gestion/pendientes-manuales.md`).
3. Definir la política de retención de estos archivos — probablemente ligada a la misma revisión normativa pendiente sobre retención de historia clínica.

Una vez aprobado, se implementará: un módulo de almacenamiento (`storage` o similar) con una interfaz única usada por `Imaging` y `Certificates`, para no acoplar esos módulos a un proveedor específico.
