import { FormEvent, useEffect, useState } from 'react';
import { PatientPicker } from '../components/PatientPicker';
import { Ward, bedAvailability, createAdmission } from '../services/admissions';
import { Patient } from '../services/patients';

export function AdmissionsPage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedBedId, setSelectedBedId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadWards() {
    const data = await bedAvailability();
    setWards(data);
  }

  useEffect(() => {
    loadWards();
  }, []);

  async function handleAdmit(event: FormEvent) {
    event.preventDefault();
    if (!patient) return;
    setError(null);
    setSuccess(null);
    try {
      await createAdmission({ patientId: patient.id, bedId: selectedBedId || undefined });
      setSuccess('Admisión registrada correctamente.');
      setSelectedBedId('');
      await loadWards();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar la admisión.');
    }
  }

  return (
    <div>
      <h1>Admisiones, traslados y egresos</h1>
      <p className="provisional-notice">
        Interfaz provisional — no incluye todavía pantallas de traslado ni egreso (disponibles en el
        backend: ver `PATCH /admissions/:id/traslado` y `/egreso`).
      </p>

      <PatientPicker onSelect={setPatient} selected={patient} />

      {patient && (
        <form className="card section-gap" onSubmit={handleAdmit} style={{ maxWidth: 480 }}>
          <h2>Registrar ingreso</h2>
          {error && <p className="error-text">{error}</p>}
          {success && <p style={{ color: 'var(--color-primary)' }}>{success}</p>}
          <div className="field">
            <label htmlFor="bed">Cama (opcional)</label>
            <select id="bed" value={selectedBedId} onChange={(e) => setSelectedBedId(e.target.value)}>
              <option value="">Sin asignar</option>
              {wards.map((w) => (
                <optgroup key={w.id} label={w.name}>
                  {w.beds.filter((b) => !b.isOccupied).map((b) => (
                    <option key={b.id} value={b.id}>{b.code}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <button className="btn-primary" type="submit">Registrar ingreso</button>
        </form>
      )}

      <div className="section-gap">
        <h2>Disponibilidad de camas</h2>
        {wards.length === 0 && <p>No hay pabellones/camas registrados todavía (cargar datos base en la institución).</p>}
        {wards.map((w) => (
          <div key={w.id} className="card section-gap">
            <h3>{w.name}</h3>
            <p>
              {w.beds.map((b) => (
                <span key={b.id} className="badge" style={{ marginRight: '0.4rem' }}>
                  {b.code}: {b.isOccupied ? 'ocupada' : 'libre'}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
