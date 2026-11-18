import { FormEvent, useState } from 'react';
import { PatientPicker } from '../components/PatientPicker';
import { Certificate, createCertificate, listCertificatesByPatient } from '../services/certificates';
import { Patient } from '../services/patients';
import { useAuth } from '../context/AuthContext';

const TYPES = [
  { value: 'CONSTANCIA_ATENCION', label: 'Constancia de atención' },
  { value: 'REMISION', label: 'Remisión' },
  { value: 'INCAPACIDAD', label: 'Incapacidad' },
  { value: 'OTRO', label: 'Otro' },
];

export function CertificatesPage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [type, setType] = useState('CONSTANCIA_ATENCION');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canIssue = user?.role === 'MEDICO' || user?.role === 'ADMINISTRATIVO';

  async function load(p: Patient) {
    setPatient(p);
    const data = await listCertificatesByPatient(p.id);
    setCertificates(data);
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!patient || !content.trim()) return;
    setError(null);
    try {
      await createCertificate({ patientId: patient.id, type, content: content.trim() });
      setContent('');
      await load(patient);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo emitir el documento.');
    }
  }

  return (
    <div>
      <h1>Certificados y remisiones</h1>
      <p className="provisional-notice">
        Interfaz provisional — el contenido es texto libre; no hay plantillas formales por tipo de
        documento todavía (pendiente de definición legal/administrativa).
      </p>

      <PatientPicker onSelect={load} selected={patient} />

      {patient && (
        <>
          {canIssue && (
            <form className="card section-gap" onSubmit={handleCreate} style={{ maxWidth: 480 }}>
              <h2>Emitir documento</h2>
              {error && <p className="error-text">{error}</p>}
              <div className="field">
                <label htmlFor="type">Tipo</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="content">Contenido</label>
                <input id="content" required value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
              <button className="btn-primary" type="submit">Emitir</button>
            </form>
          )}

          <div className="section-gap">
            {certificates.map((c) => (
              <div key={c.id} className="card section-gap">
                <p><span className="badge">{c.type}</span> {new Date(c.createdAt).toLocaleDateString('es-CO')}</p>
                <p>{c.content}</p>
              </div>
            ))}
            {certificates.length === 0 && <p>Sin documentos registrados.</p>}
          </div>
        </>
      )}
    </div>
  );
}
