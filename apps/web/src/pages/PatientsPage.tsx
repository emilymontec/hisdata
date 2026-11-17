import { FormEvent, useState } from 'react';
import { Patient, createPatient, searchPatients } from '../services/patients';

const EMPTY_FORM = {
  documentType: 'CC',
  documentNumber: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  sex: '',
  phone: '',
  email: '',
  address: '',
};

export function PatientsPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [searching, setSearching] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSearch() {
    setSearching(true);
    try {
      const data = await searchPatients(query);
      setResults(data);
    } finally {
      setSearching(false);
    }
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const created = await createPatient(form);
      setSuccess(`Paciente ${created.firstName} ${created.lastName} registrado correctamente.`);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setResults((prev) => [created, ...prev]);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el paciente.');
    }
  }

  return (
    <div>
      <h1>Pacientes</h1>
      <p className="provisional-notice">
        Interfaz provisional — cubre registro y búsqueda básica mientras se diseña el frontend oficial.
      </p>

      <div className="toolbar">
        <div className="field">
          <label htmlFor="q">Buscar por documento o nombre</label>
          <input
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button type="button" className="btn-secondary" onClick={handleSearch} disabled={searching}>
          {searching ? 'Buscando…' : 'Buscar'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancelar' : 'Nuevo paciente'}
        </button>
      </div>

      {success && <p style={{ color: 'var(--color-primary)' }}>{success}</p>}

      {showForm && (
        <form className="card section-gap" onSubmit={handleCreate} style={{ maxWidth: 560 }}>
          <h2>Registrar paciente</h2>
          {error && <p className="error-text">{error}</p>}

          <div className="form-grid">
            <div className="field">
              <label htmlFor="documentType">Tipo de documento</label>
              <select
                id="documentType"
                value={form.documentType}
                onChange={(e) => setForm({ ...form, documentType: e.target.value })}
              >
                <option value="CC">Cédula de ciudadanía</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="REGISTRO_CIVIL">Registro civil</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="documentNumber">Número de documento</label>
              <input
                id="documentNumber"
                required
                value={form.documentNumber}
                onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="firstName">Nombres</label>
              <input
                id="firstName"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="lastName">Apellidos</label>
              <input
                id="lastName"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="dateOfBirth">Fecha de nacimiento</label>
              <input
                id="dateOfBirth"
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="sex">Sexo</label>
              <input
                id="sex"
                required
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <button className="btn-primary" type="submit">Guardar paciente</button>
        </form>
      )}

      {results.length > 0 && (
        <table className="simple-table section-gap">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Fecha de nacimiento</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {results.map((p) => (
              <tr key={p.id}>
                <td>{p.documentType} {p.documentNumber}</td>
                <td>
                  {p.firstName} {p.lastName}{' '}
                  {p.duplicateOfId && <span className="badge">posible duplicado</span>}
                </td>
                <td>{p.dateOfBirth?.slice(0, 10)}</td>
                <td>{p.phone ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
