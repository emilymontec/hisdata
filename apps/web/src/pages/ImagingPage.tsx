import { FormEvent, useState } from 'react';
import {
  ImagingRequestDetail,
  createReport,
  getImagingRequest,
  markInProgress,
} from '../services/imaging';
import { useAuth } from '../context/AuthContext';

export function ImagingPage() {
  const { user } = useAuth();
  const [requestId, setRequestId] = useState('');
  const [request, setRequest] = useState<ImagingRequestDetail | null>(null);
  const [findings, setFindings] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isMedico = user?.role === 'MEDICO';

  async function load(id: string) {
    setError(null);
    try {
      const data = await getImagingRequest(id);
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

  async function handleInProgress() {
    if (!request) return;
    await markInProgress(request.id);
    await load(request.id);
  }

  async function handleReport(event: FormEvent) {
    event.preventDefault();
    if (!request || !findings.trim()) return;
    try {
      await createReport(request.id, { findings });
      setFindings('');
      await load(request.id);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el informe.');
    }
  }

  return (
    <div>
      <h1>Imagenología</h1>
      <p className="provisional-notice">
        Interfaz provisional — se gestiona por ID de solicitud (copiado desde Órdenes médicas). Sin
        carga de archivos todavía (almacenamiento pendiente de decisión, ver ADR-004).
      </p>

      <form className="toolbar" onSubmit={handleLoad}>
        <div className="field">
          <label htmlFor="requestId">ID de solicitud de imagenología</label>
          <input id="requestId" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
        </div>
        <button className="btn-secondary" type="submit">Cargar</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {request && (
        <div className="card section-gap">
          <p>Modalidad: <span className="badge">{request.modality}</span> — Estado: <span className="badge">{request.status}</span></p>

          {isMedico && request.status === 'PENDING' && (
            <button className="btn-secondary" onClick={handleInProgress}>Marcar en proceso</button>
          )}

          {isMedico && request.status === 'IN_PROGRESS' && !request.report && (
            <form onSubmit={handleReport} className="section-gap" style={{ maxWidth: 480 }}>
              <h2>Registrar informe</h2>
              <div className="field">
                <label htmlFor="findings">Hallazgos</label>
                <input id="findings" required value={findings} onChange={(e) => setFindings(e.target.value)} />
              </div>
              <button className="btn-primary" type="submit">Guardar informe</button>
            </form>
          )}

          {request.report && (
            <div className="section-gap">
              <h2>Informe</h2>
              <p>{request.report.findings}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
