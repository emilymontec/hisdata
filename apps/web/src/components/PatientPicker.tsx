import { useState } from 'react';
import { Patient, searchPatients } from '../services/patients';

interface Props {
  onSelect: (patient: Patient) => void;
  selected?: Patient | null;
}

/**
 * Componente provisional: busca por documento/nombre y permite elegir un paciente.
 * Se reemplazará por un selector más completo en el frontend oficial.
 */
export function PatientPicker({ onSelect, selected }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchPatients(query.trim());
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="toolbar">
        <div className="field">
          <label htmlFor="patient-search">Buscar paciente (documento o nombre)</label>
          <input
            id="patient-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button type="button" className="btn-secondary" onClick={handleSearch} disabled={loading}>
          {loading ? 'Buscando…' : 'Buscar'}
        </button>
      </div>

      {selected && (
        <p>
          Seleccionado: <strong>{selected.firstName} {selected.lastName}</strong>{' '}
          <span className="badge">{selected.documentType} {selected.documentNumber}</span>
        </p>
      )}

      {results.length > 0 && (
        <table className="simple-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((p) => (
              <tr key={p.id} className="clickable" onClick={() => { onSelect(p); setResults([]); }}>
                <td>{p.documentType} {p.documentNumber}</td>
                <td>{p.firstName} {p.lastName}</td>
                <td>Elegir</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
