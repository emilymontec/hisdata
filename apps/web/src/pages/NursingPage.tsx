import { FormEvent, useState } from 'react';
import { NursingNote, createNursingNote, listNotesByAdmission } from '../services/nursing';

export function NursingPage() {
  const [admissionId, setAdmissionId] = useState('');
  const [notes, setNotes] = useState<NursingNote[]>([]);
  const [observation, setObservation] = useState('');
  const [temperature, setTemperature] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleLoad(event: FormEvent) {
    event.preventDefault();
    if (!admissionId.trim()) return;
    setError(null);
    try {
      const data = await listNotesByAdmission(admissionId.trim());
      setNotes(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se encontraron notas para esa admisión.');
    }
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!admissionId.trim() || !observation.trim()) return;
    setError(null);
    try {
      const vitalSigns: Record<string, unknown> = {};
      if (temperature) vitalSigns.temperatura = temperature;
      if (bloodPressure) vitalSigns.presionArterial = bloodPressure;

      await createNursingNote({
        admissionId: admissionId.trim(),
        observation: observation.trim(),
        vitalSigns: Object.keys(vitalSigns).length ? vitalSigns : undefined,
      });
      setObservation('');
      setTemperature('');
      setBloodPressure('');
      const data = await listNotesByAdmission(admissionId.trim());
      setNotes(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar la nota.');
    }
  }

  return (
    <div>
      <h1>Enfermería</h1>
      <p className="provisional-notice">
        Interfaz provisional — el backend solo permite listar notas por ID de admisión (no hay
        todavía un endpoint para listar admisiones por paciente), así que aquí se ingresa
        manualmente. Los signos vitales son un objeto libre (temperatura/presión arterial como
        ejemplo), sin estructura formal todavía.
      </p>

      <form className="toolbar" onSubmit={handleLoad}>
        <div className="field">
          <label htmlFor="admissionId">ID de admisión</label>
          <input id="admissionId" value={admissionId} onChange={(e) => setAdmissionId(e.target.value)} />
        </div>
        <button className="btn-secondary" type="submit">Cargar notas</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {admissionId && (
        <>
          <form className="card section-gap" onSubmit={handleCreate} style={{ maxWidth: 480 }}>
            <h2>Nueva nota de enfermería</h2>
            <div className="field">
              <label htmlFor="observation">Observación</label>
              <input id="observation" required value={observation} onChange={(e) => setObservation(e.target.value)} />
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="temp">Temperatura (°C)</label>
                <input id="temp" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="bp">Presión arterial</label>
                <input id="bp" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} />
              </div>
            </div>
            <button className="btn-primary" type="submit">Registrar nota</button>
          </form>

          <div className="section-gap">
            {notes.map((n) => (
              <div key={n.id} className="card section-gap">
                <p>{n.observation}</p>
                {n.vitalSigns && <p className="badge">{JSON.stringify(n.vitalSigns)}</p>}
                <p className="badge">{new Date(n.createdAt).toLocaleString('es-CO')}</p>
              </div>
            ))}
            {notes.length === 0 && <p>Sin notas registradas para esta admisión.</p>}
          </div>
        </>
      )}
    </div>
  );
}
