import { FormEvent, useState } from 'react';
import { PatientPicker } from '../components/PatientPicker';
import {
  ClinicalRecordView,
  addClinicalNote,
  addDiagnosis,
  viewClinicalRecord,
} from '../services/clinicalRecord';
import { Patient } from '../services/patients';
import { useAuth } from '../context/AuthContext';

export function ClinicalRecordPage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [record, setRecord] = useState<ClinicalRecordView | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [diagnosisDescription, setDiagnosisDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isMedico = user?.role === 'MEDICO';

  async function loadRecord(p: Patient) {
    setPatient(p);
    setError(null);
    try {
      const data = await viewClinicalRecord(p.id);
      setRecord(data);
    } catch {
      // Sin historia clínica previa: se crea automáticamente al registrar la primera nota.
      setRecord({ id: '', patientId: p.id, notes: [], diagnoses: [] });
    }
  }

  async function handleAddNote(event: FormEvent) {
    event.preventDefault();
    if (!patient || !noteContent.trim()) return;
    try {
      await addClinicalNote(patient.id, noteContent.trim());
      setNoteContent('');
      await loadRecord(patient);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar la nota.');
    }
  }

  async function handleAddDiagnosis(event: FormEvent) {
    event.preventDefault();
    if (!patient || !diagnosisDescription.trim()) return;
    try {
      await addDiagnosis(patient.id, { description: diagnosisDescription.trim() });
      setDiagnosisDescription('');
      await loadRecord(patient);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el diagnóstico.');
    }
  }

  return (
    <div>
      <h1>Historia clínica</h1>
      <p className="provisional-notice">
        Interfaz provisional — toda lectura de este módulo queda registrada en auditoría, como
        exige el diseño del backend.
      </p>

      <PatientPicker onSelect={loadRecord} selected={patient} />

      {error && <p className="error-text section-gap">{error}</p>}

      {record && (
        <>
          <div className="card section-gap">
            <h2>Notas clínicas</h2>
            {record.notes.length === 0 && <p>Sin notas registradas todavía.</p>}
            {record.notes.map((n) => (
              <p key={n.id} style={{ borderBottom: '1px solid var(--color-line)', paddingBottom: '0.5rem' }}>
                {n.content}
                <br />
                <span className="badge">{new Date(n.createdAt).toLocaleString('es-CO')}</span>
              </p>
            ))}

            {isMedico && (
              <form onSubmit={handleAddNote} className="section-gap">
                <div className="field">
                  <label htmlFor="note">Nueva nota clínica</label>
                  <input
                    id="note"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                </div>
                <button className="btn-secondary" type="submit">Agregar nota</button>
              </form>
            )}
          </div>

          <div className="card section-gap">
            <h2>Diagnósticos</h2>
            {record.diagnoses.length === 0 && <p>Sin diagnósticos registrados todavía.</p>}
            {record.diagnoses.map((d) => (
              <p key={d.id}>
                {d.description}{' '}
                {d.code && <span className="badge">{d.codeSystem ?? 'código'}: {d.code}</span>}
              </p>
            ))}

            {isMedico && (
              <form onSubmit={handleAddDiagnosis} className="section-gap">
                <div className="field">
                  <label htmlFor="diagnosis">Nuevo diagnóstico (descripción)</label>
                  <input
                    id="diagnosis"
                    value={diagnosisDescription}
                    onChange={(e) => setDiagnosisDescription(e.target.value)}
                  />
                </div>
                <button className="btn-secondary" type="submit">Agregar diagnóstico</button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
