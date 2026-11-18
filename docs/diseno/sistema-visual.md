# Sistema visual oficial — HISDATA

**Estado:** ✅ Definido. El frontend oficial ya existe (construido fuera de este entorno) y reemplaza al frontend provisional de `apps/web` descrito en el resto de este repositorio.

## Referencia de estilo

Interfaz inspirada en **Jira/Atlassian**: paneles y navegación limpios, jerarquía visual clara, densidad de información alta pero ordenada — apropiado para un sistema de uso intensivo diario como un HIS.

## Paleta de color

| Color | Hex | Uso previsto |
|---|---|---|
| Azul primario | `#3485F4` | Color de marca / acciones primarias |
| Cian secundario | `#08B3D6` | Acento / estados secundarios |
| Blanco | `#FFFFFF` | Fondo base |

## Tipografía

Sans-serif (familia específica aún no indicada — ej. una tipografía del sistema o una como Inter/Atlassian Sans cumpliría el espíritu "tipo Jira").

## Relación con el frontend provisional

El frontend provisional (`apps/web`) usaba una paleta y tipografía propia (teal/serif) **explícitamente temporal**, documentada desde su creación como "se reemplazará por el oficial". Con el frontend oficial ya existente, `apps/web` queda obsoleto como interfaz final — ver `docs/proyecto/roadmap.md`, Fase 5-B.

## Pendiente de definir

- Tipografía exacta (nombre de la fuente).
- Paleta de estados semánticos (éxito, advertencia, error) — Jira usa verde/amarillo/rojo sobre esta misma base; confirmar si HISDATA sigue esa convención.
- Dónde vive el código del frontend oficial y cómo se conecta a esta API (mismo monorepo, repositorio aparte, etc.) — ver pregunta al usuario.
