import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuditLogEntry, listAuditLogs } from '../services/audit';

export function AuditPage() {
  const { user } = useAuth();
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const allowed = user?.role === 'AUDITOR' || user?.role === 'ADMIN';

  async function load() {
    setError(null);
    try {
      const data = await listAuditLogs({ entityType: entityType || undefined, entityId: entityId || undefined });
      setLogs(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo cargar la auditoría.');
    }
  }

  useEffect(() => {
    if (allowed) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!allowed) {
    return (
      <div>
        <h1>Auditoría</h1>
        <p>Esta sección está restringida a los roles Auditor y Administrador.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Auditoría y seguridad</h1>
      <p className="provisional-notice">Interfaz provisional — consulta de solo lectura.</p>

      <form
        className="toolbar"
        onSubmit={(e: FormEvent) => { e.preventDefault(); load(); }}
      >
        <div className="field">
          <label htmlFor="entityType">Tipo de entidad</label>
          <input id="entityType" placeholder="Patient, ClinicalRecord…" value={entityType} onChange={(e) => setEntityType(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="entityId">ID de entidad</label>
          <input id="entityId" value={entityId} onChange={(e) => setEntityId(e.target.value)} />
        </div>
        <button className="btn-secondary" type="submit">Filtrar</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <table className="simple-table section-gap">
        <thead>
          <tr><th>Acción</th><th>Entidad</th><th>Actor</th><th>Fecha</th></tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td>{l.action}</td>
              <td>{l.entityType ? `${l.entityType} · ${l.entityId}` : '—'}</td>
              <td>{l.actorUserId ?? '—'}</td>
              <td>{new Date(l.createdAt).toLocaleString('es-CO')}</td>
            </tr>
          ))}
          {logs.length === 0 && <tr><td colSpan={4}>Sin registros.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
