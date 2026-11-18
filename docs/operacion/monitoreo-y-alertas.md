# Monitoreo y alertas — HISDATA

## Estado actual

No hay ningún monitoreo activo todavía — no existe un entorno de producción ni de QA desplegado (ver `docs/gestion/pendientes-manuales.md`). Este documento define **qué se debe monitorear y por qué**, para implementarse cuando exista infraestructura real.

## Qué monitorear y por qué

| Señal | Por qué importa en HISDATA específicamente | Dónde se origina en el código |
|---|---|---|
| Tasa de errores 5xx de la API | Un HIS caído afecta atención real de pacientes | `AllExceptionsFilter` ya centraliza y registra todo error no manejado — es el punto natural para conectar una herramienta de monitoreo (ej. Sentry) |
| Intentos de login fallidos / cuentas bloqueadas | Posible ataque de fuerza bruta o credenciales filtradas | `AuditService` ya registra `LOGIN_FAILED` y `LOGIN_BLOCKED` — una alerta puede construirse consultando `AuditLog` por volumen de estos eventos |
| Lecturas de historia clínica fuera de horario o en volumen inusual | Posible acceso indebido a datos clínicos sensibles | `CLINICAL_RECORD_READ` ya se audita en cada lectura |
| Latencia de endpoints críticos (login, creación de citas, consulta de pacientes) | Experiencia de uso en momentos de alta demanda (ej. apertura de agenda) | No instrumentado todavía — requiere un APM (ej. OpenTelemetry) |
| Uso de conexiones de base de datos / saturación de PostgreSQL | Punto único de fallo del monolito modular | Requiere monitoreo de infraestructura, no de aplicación |
| Fallos en el job de backup (cuando exista) | Un backup que falla silenciosamente no es un backup | Depende del proveedor de hosting elegido |

## Qué NO monitorear automáticamente (a propósito)

- Contenido de notas clínicas o diagnósticos — el monitoreo mira **metadatos de acceso** (quién, cuándo, a qué registro), nunca el contenido clínico en sí, para no convertir la herramienta de monitoreo en otro punto de fuga de datos sensibles.

## Próximos pasos técnicos (cuando exista un entorno real)

1. Conectar `AllExceptionsFilter` a una herramienta de error tracking (ej. Sentry) — cambio pequeño y aislado.
2. Definir un job periódico (ej. cron) que consulte `AuditLog` para las alertas de seguridad de la tabla anterior y las envíe por el módulo de Notificaciones (canal interno) o un canal externo a definir.
3. Instrumentar latencia con OpenTelemetry si el volumen de uso lo justifica — no antes, para no sobre-invertir en observabilidad de un sistema con tráfico aún no real.
