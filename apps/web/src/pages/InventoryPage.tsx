import { FormEvent, useEffect, useState } from 'react';
import { InventoryItem, createInventoryItem, listInventoryItems, registerMovement } from '../services/inventory';

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [movementFor, setMovementFor] = useState<string | null>(null);
  const [type, setType] = useState<'IN' | 'OUT' | 'ADJUSTMENT'>('IN');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const data = await listInventoryItems();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createInventoryItem({ name, category });
      setName('');
      setCategory('');
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el ítem.');
    }
  }

  async function handleMovement(event: FormEvent) {
    event.preventDefault();
    if (!movementFor) return;
    setError(null);
    try {
      await registerMovement(movementFor, { type, quantity });
      setQuantity(0);
      setMovementFor(null);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el movimiento.');
    }
  }

  return (
    <div>
      <h1>Inventario y recursos hospitalarios</h1>
      <p className="provisional-notice">Interfaz provisional.</p>

      <form className="card" onSubmit={handleCreate} style={{ maxWidth: 420 }}>
        <h2>Nuevo ítem</h2>
        {error && <p className="error-text">{error}</p>}
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="category">Categoría</label>
          <input id="category" required value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <button className="btn-primary" type="submit">Agregar</button>
      </form>

      <table className="simple-table section-gap">
        <thead>
          <tr><th>Nombre</th><th>Categoría</th><th>Cantidad</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.category}</td>
              <td>{i.quantity}</td>
              <td><button className="btn-secondary" onClick={() => setMovementFor(i.id)}>Movimiento</button></td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={4}>Sin ítems registrados.</td></tr>}
        </tbody>
      </table>

      {movementFor && (
        <form className="card section-gap" onSubmit={handleMovement} style={{ maxWidth: 380 }}>
          <h2>Registrar movimiento</h2>
          <div className="field">
            <label htmlFor="type">Tipo</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="IN">Entrada</option>
              <option value="OUT">Salida</option>
              <option value="ADJUSTMENT">Ajuste (fija cantidad exacta)</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="qty">Cantidad</label>
            <input id="qty" type="number" min={1} required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <button className="btn-primary" type="submit">Guardar</button>
        </form>
      )}
    </div>
  );
}
