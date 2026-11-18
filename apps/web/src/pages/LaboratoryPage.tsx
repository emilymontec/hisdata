import { FormEvent, useState } from 'react';
import {
  LabRequest,
  getLabRequest,
  registerResult,
  registerSampleCollected,
  validateAndPublish,
} from '../services/laboratory';
import { useAuth } from '../context/AuthContext';

export function LaboratoryPage() {
  const { user } = useAuth();
  const [requestId, setRequestId] = useState('');
  const [request, setRequest] = useState<LabRequest | null>(null);
  const [parameter, setParameter] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isMedico = user?.role === 'MEDICO';

  async function load(id: string) {
    setError(null);
    try {
      const data = await getLabRequest(id);
      setRequest(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Solicitud no encontrada.');
      setRequest(null);
    }
  }

  async function handleLoad(event: FormEvent) {
    event.preventDefault();
    if (requestId.trim()) await load(requestId.trim());
  }

  async function handleSample() {
    if (!request) return;
    await registerSampleCollected(request.id);
    await load(request.id);
  }

  async function handleResult(event: FormEvent) {
    event.preventDefault();
    if (!request || !parameter.trim() || !value.trim()) return;
    try {
      await registerResult(request.id, { parameter, value, unit: unit || undefined });
      setParameter('');
      setValue('');
      setUnit('');
      await load(request.id);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el resultado.');
    }
  }

  async function handleValidate() {
    if (!request) return;
    try {
      await validateAndPublish(request.id);
      await load(request.id);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo validar/publicar.');
    }
  }

  return (
    <div>
      <h1>Laboratorio clínico</h1>
      <p className="provisional-notice">
        Interfaz provisional — se gestiona por ID de solicitud (copiado desde Órdenes médicas).
      </p>

      <form className="toolbar" onSubmit={handleLoad}>
        <div className="field">
          <label htmlFor="requestId">ID de solicitud de laboratorio</label>
          <input id="requestId" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
        </div>
        <button className="btn-secondary" type="submit">Cargar</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {request && (
        <div className="card section-gap">
          <p>Estado actual: <span className="badge">{request.status}</span></p>

          {request.status === 'PENDING' && (
            <button className="btn-secondary" onClick={handleSample}>Registrar toma de muestra</button>
          )}

          {isMedico && ['SAMPLE_COLLECTED', 'RESULT_REGISTERED'].includes(request.status) && (
            <form onSubmit={handleResult} className="section-gap" style={{ maxWidth: 420 }}>
              <h2>Registrar resultado</h2>
              <div className="field">
                <label htmlFor="parameter">Parámetro</label>
                <input id="parameter" required value={parameter} onChange={(e) => setParameter(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="value">Valor</label>
                <input id="value" required value={value} onChange={(e) => setValue(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="unit">Unidad</label>
                <input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
              </div>
              <button className="btn-primary" type="submit">Agregar resultado</button>
            </form>
          )}

          {isMedico && request.status === 'RESULT_REGISTERED' && (
            <button className="btn-primary section-gap" onClick={handleValidate}>
              Validar y publicar
            </button>
          )}

          <div className="section-gap">
            <h2>Resultados</h2>
            {request.results.length === 0 && <p>Sin resultados registrados.</p>}
            <table className="simple-table">
              <thead>
                <tr><th>Parámetro</th><th>Valor</th><th>Unidad</th><th>Validado</th></tr>
              </thead>
              <tbody>
                {request.results.map((r) => (
                  <tr key={r.id}>
                    <td>{r.parameter}</td>
                    <td>{r.value}</td>
                    <td>{r.unit ?? '—'}</td>
                    <td>{r.validatedAt ? 'Sí' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
