import { FormEvent, useState } from 'react';
import { PatientPicker } from '../components/PatientPicker';
import {
  Prescription,
  cancelPrescription,
  createPrescription,
  listPrescriptionsByPatient,
} from '../services/prescriptions';
import { Patient } from '../services/patients';
import { useAuth } from '../context/AuthContext';

export function PrescriptionsPage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [drug, setDrug] = useState('');
  const [dosage, setDosage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isMedico = user?.role === 'MEDICO';

  async function load(p: Patient) {
    setPatient(p);
    const data = await listPrescriptionsByPatient(p.id);
    setPrescriptions(data);
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!patient) return;
    setError(null);
    try {
      await createPrescription({
        patientId: patient.id,
        items: [{ freeTextDrug: drug, dosageInstructions: dosage }],
      });
      setDrug('');
      setDosage('');
      await load(patient);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar la prescripción.');
    }
  }

  async function handleCancel(id: string) {
    if (!patient) return;
    await cancelPrescription(id);
    await load(patient);
  }

  return (
    <div>
      <h1>Prescripciones</h1>
      <p className="provisional-notice">
        Interfaz provisional — un medicamento por prescripción (texto libre, sin catálogo todavía);
        no valida interacciones ni dosis máximas (regla clínica pendiente de validación profesional).
      </p>

      <PatientPicker onSelect={load} selected={patient} />

      {patient && (
        <>
          {isMedico && (
            <form className="card section-gap" onSubmit={handleCreate} style={{ maxWidth: 480 }}>
              <h2>Nueva prescripción</h2>
              {error && <p className="error-text">{error}</p>}
              <div className="field">
                <label htmlFor="drug">Medicamento</label>
                <input id="drug" required value={drug} onChange={(e) => setDrug(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="dosage">Instrucciones de dosis</label>
                <input id="dosage" required value={dosage} onChange={(e) => setDosage(e.target.value)} />
              </div>
              <button className="btn-primary" type="submit">Registrar prescripción</button>
            </form>
          )}

          <div className="section-gap">
            {prescriptions.map((p) => (
              <div key={p.id} className="card section-gap">
                <p><span className="badge">{p.status}</span> {new Date(p.createdAt).toLocaleDateString('es-CO')}</p>
                <ul>
                  {p.items.map((item) => (
                    <li key={item.id}>
                      {item.medication?.name ?? item.freeTextDrug} — {item.dosageInstructions}
                    </li>
                  ))}
                </ul>
                {isMedico && p.status === 'ACTIVE' && (
                  <button className="btn-secondary" onClick={() => handleCancel(p.id)}>Cancelar</button>
                )}
              </div>
            ))}
            {prescriptions.length === 0 && <p>Sin prescripciones registradas.</p>}
          </div>
        </>
      )}
    </div>
  );
}
