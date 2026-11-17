import { FormEvent, useEffect, useState } from 'react';
import { Medication, addStock, createMedication, listCatalog } from '../services/pharmacy';

export function PharmacyPage() {
  const [catalog, setCatalog] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [presentation, setPresentation] = useState('');
  const [stockFor, setStockFor] = useState<string | null>(null);
  const [batchNumber, setBatchNumber] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const data = await listCatalog();
    setCatalog(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreateMedication(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createMedication({ name, presentation });
      setName('');
      setPresentation('');
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el medicamento.');
    }
  }

  async function handleAddStock(event: FormEvent) {
    event.preventDefault();
    if (!stockFor) return;
    setError(null);
    try {
      await addStock(stockFor, { batchNumber, quantity });
      setBatchNumber('');
      setQuantity(0);
      setStockFor(null);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el ingreso de stock.');
    }
  }

  return (
    <div>
      <h1>Farmacia</h1>
      <p className="provisional-notice">
        Interfaz provisional — cubre catálogo e ingreso de stock. La dispensación (descuento FIFO por
        vencimiento, ya implementada en el backend) aún no tiene pantalla propia.
      </p>

      <form className="card" onSubmit={handleCreateMedication} style={{ maxWidth: 480 }}>
        <h2>Nuevo medicamento</h2>
        {error && <p className="error-text">{error}</p>}
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="presentation">Presentación</label>
          <input id="presentation" required value={presentation} onChange={(e) => setPresentation(e.target.value)} />
        </div>
        <button className="btn-primary" type="submit">Agregar al catálogo</button>
      </form>

      <table className="simple-table section-gap">
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Presentación</th>
            <th>Stock total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {catalog.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.presentation}</td>
              <td>{m.stock.reduce((sum, s) => sum + s.quantity, 0)}</td>
              <td>
                <button className="btn-secondary" onClick={() => setStockFor(m.id)}>Ingresar lote</button>
              </td>
            </tr>
          ))}
          {catalog.length === 0 && <tr><td colSpan={4}>Catálogo vacío.</td></tr>}
        </tbody>
      </table>

      {stockFor && (
        <form className="card section-gap" onSubmit={handleAddStock} style={{ maxWidth: 420 }}>
          <h2>Ingresar lote de stock</h2>
          <div className="field">
            <label htmlFor="batch">Número de lote</label>
            <input id="batch" required value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="qty">Cantidad</label>
            <input
              id="qty"
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <button className="btn-primary" type="submit">Guardar</button>
        </form>
      )}
    </div>
  );
}
