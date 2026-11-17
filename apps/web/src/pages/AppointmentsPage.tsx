import { FormEvent, useState } from 'react';
import { PatientPicker } from '../components/PatientPicker';
import {
  Appointment,
  cancelAppointment,
  createAppointment,
  listAppointmentsByPatient,
} from '../services/appointments';
import { Patient } from '../services/patients';
import { useAuth } from '../context/AuthContext';

export function AppointmentsPage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function loadAppointments(p: Patient) {
    setPatient(p);
    const data = await listAppointmentsByPatient(p.id);
    setAppointments(data);
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!patient) return;
    try {
      // Provisional: usa el propio usuario autenticado como profesional de la cita
      // hasta que exista un selector de profesionales en el frontend oficial.
      await createAppointment({
        patientId: patient.id,
        practitionerId: user!.id,
        startsAt,
        endsAt,
        reason: reason || undefined,
      });
      setStartsAt('');
      setEndsAt('');
      setReason('');
      await loadAppointments(patient);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo crear la cita.');
    }
  }

  async function handleCancel(id: string) {
    if (!patient) return;
    await cancelAppointment(id);
    await loadAppointments(patient);
  }

  return (
    <div>
      <h1>Citas y agenda</h1>
      <p className="provisional-notice">
        Interfaz provisional — sin selector de profesional todavía (se usa el usuario con sesión
        activa); se reemplazará en el frontend oficial.
      </p>

      <PatientPicker onSelect={loadAppointments} selected={patient} />

      {patient && (
        <>
          <form className="card section-gap" onSubmit={handleCreate} style={{ maxWidth: 480 }}>
            <h2>Nueva cita</h2>
            {error && <p className="error-text">{error}</p>}
            <div className="field">
              <label htmlFor="startsAt">Inicio</label>
              <input
                id="startsAt"
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="endsAt">Fin</label>
              <input
                id="endsAt"
                type="datetime-local"
                required
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="reason">Motivo</label>
              <input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <button className="btn-primary" type="submit">Programar cita</button>
          </form>

          <table className="simple-table section-gap">
            <thead>
              <tr>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Motivo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.startsAt).toLocaleString('es-CO')}</td>
                  <td>{new Date(a.endsAt).toLocaleString('es-CO')}</td>
                  <td><span className="badge">{a.status}</span></td>
                  <td>{a.reason ?? '—'}</td>
                  <td>
                    {['SCHEDULED', 'CONFIRMED'].includes(a.status) && (
                      <button className="btn-secondary" onClick={() => handleCancel(a.id)}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan={5}>Este paciente no tiene citas registradas.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
