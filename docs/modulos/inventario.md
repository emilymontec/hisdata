# Módulo: Inventario y recursos hospitalarios

**Código fuente:** `apps/api/src/modules/inventory`

## Objetivo
Gestionar insumos y equipos no farmacéuticos y sus movimientos de existencias.

## Actores
Administrador/Administrativo (gestión completa), Enfermería (consulta).

## Flujos principales
1. Alta de ítem de inventario (insumo o equipo), con categoría libre.
2. Registro de movimiento: `IN` (entrada, suma), `OUT` (salida, resta) o `ADJUSTMENT` (fija la cantidad exacta) — valida que nunca quede en negativo.
3. Consulta del listado de ítems con su cantidad actual.

## Dependencias
Ninguna funcional directa; es independiente de los módulos clínicos.

## Datos (modelo Prisma)
`InventoryItem`, `InventoryMovement`.

## Decisiones pendientes
- Mantenimiento y seguimiento de equipos (ej. calibraciones, mantenimientos programados) mencionado en el alcance original pero no modelado todavía — se agregará si se confirma que es parte del alcance.
- Categorías de inventario son texto libre; se podría formalizar un catálogo si la institución lo requiere.
