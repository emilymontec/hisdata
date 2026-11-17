import { FormEvent, useState } from 'react';
import { PatientPicker } from '../components/PatientPicker';
import {
  Consultation,
  createConsultation,
  listConsultationsByPatient,
} from '../services/consultations';
import { Patient } from '../services/patients';
import { useAuth } from '../context/AuthContext';

export function ConsultationsPage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [reason, setReason] = useState('');
  const [findings, setFindings] = useState('');
  const [plan, setPlan] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isMedico = user?.role === 'MEDICO';

  async function load(p: Patient) {
    setPatient(p);
    const data = await listConsultationsByPatient(p.id);
    setConsultations(data);
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!patient) return;
    setError(null);
    try {
      await createConsultation({ patientId: patient.id, reason, findings, plan });
      setReason('');
      setFindings('');
      setPlan('');
      await load(patient);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar la consulta.');
    }
  }

  return (
    <div>
      <h1>Consultas médicas</h1>
      <p className="provisional-notice">Interfaz provisional — sin vínculo a una cita específica todavía.</p>

      <PatientPicker onSelect={load} selected={patient} />

      {patient && (
        <>
          {isMedico && (
            <form className="card section-gap" onSubmit={handleCreate} style={{ maxWidth: 520 }}>
              <h2>Nueva consulta</h2>
              {error && <p className="error-text">{error}</p>}
              <div className="field">
                <label htmlFor="reason">Motivo de consulta</label>
                <input id="reason" required value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="findings">Hallazgos</label>
                <input id="findings" value={findings} onChange={(e) => setFindings(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="plan">Plan</label>
                <input id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} />
              </div>
              <button className="btn-primary" type="submit">Registrar consulta</button>
            </form>
          )}

          <div className="section-gap">
            <h2>Historial de consultas</h2>
            {consultations.length === 0 && <p>Sin consultas registradas.</p>}
            {consultations.map((c) => (
              <div key={c.id} className="card section-gap">
                <p><strong>{c.reason}</strong> — <span className="badge">{new Date(c.createdAt).toLocaleString('es-CO')}</span></p>
                {c.findings && <p>Hallazgos: {c.findings}</p>}
                {c.plan && <p>Plan: {c.plan}</p>}
                {c.orders.length > 0 && <p>Órdenes asociadas: {c.orders.length}</p>}
                {c.prescriptions.length > 0 && <p>Prescripciones asociadas: {c.prescriptions.length}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
