import { FormEvent, useState } from 'react';
import { PatientPicker } from '../components/PatientPicker';
import { CreateOrderInput, MedicalOrder, createOrder, listOrdersByPatient } from '../services/orders';
import { Patient } from '../services/patients';
import { useAuth } from '../context/AuthContext';

export function OrdersPage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [orders, setOrders] = useState<MedicalOrder[]>([]);
  const [type, setType] = useState<CreateOrderInput['type']>('LABORATORY');
  const [description, setDescription] = useState('');
  const [imagingModality, setImagingModality] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isMedico = user?.role === 'MEDICO';

  async function load(p: Patient) {
    setPatient(p);
    const data = await listOrdersByPatient(p.id);
    setOrders(data);
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!patient) return;
    setError(null);
    try {
      await createOrder({
        patientId: patient.id,
        type,
        description,
        imagingModality: type === 'IMAGING' ? imagingModality : undefined,
      });
      setDescription('');
      setImagingModality('');
      await load(patient);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar la orden.');
    }
  }

  return (
    <div>
      <h1>Órdenes médicas</h1>
      <p className="provisional-notice">Interfaz provisional.</p>

      <PatientPicker onSelect={load} selected={patient} />

      {patient && (
        <>
          {isMedico && (
            <form className="card section-gap" onSubmit={handleCreate} style={{ maxWidth: 480 }}>
              <h2>Nueva orden</h2>
              {error && <p className="error-text">{error}</p>}
              <div className="field">
                <label htmlFor="type">Tipo</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value as CreateOrderInput['type'])}>
                  <option value="LABORATORY">Laboratorio</option>
                  <option value="IMAGING">Imagenología</option>
                  <option value="PROCEDURE">Procedimiento</option>
                </select>
              </div>
              {type === 'IMAGING' && (
                <div className="field">
                  <label htmlFor="modality">Modalidad</label>
                  <input
                    id="modality"
                    placeholder="RX, TAC, RM, ECO…"
                    required
                    value={imagingModality}
                    onChange={(e) => setImagingModality(e.target.value)}
                  />
                </div>
              )}
              <div className="field">
                <label htmlFor="description">Descripción</label>
                <input id="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <button className="btn-primary" type="submit">Registrar orden</button>
            </form>
          )}

          <table className="simple-table section-gap">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Solicitud generada</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.type}</td>
                  <td>{o.description}</td>
                  <td><span className="badge">{o.status}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString('es-CO')}</td>
                  <td>
                    {o.labRequest && <span className="badge">Lab: {o.labRequest.id}</span>}
                    {o.imagingRequest && <span className="badge">Imagen: {o.imagingRequest.id}</span>}
                    {!o.labRequest && !o.imagingRequest && '—'}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={5}>Sin órdenes registradas.</td></tr>}
            </tbody>
          </table>
          <p className="provisional-notice section-gap">
            Copia el ID de "Solicitud generada" para gestionarla en los módulos de Laboratorio o Imagenología.
          </p>
        </>
      )}
    </div>
  );
}
