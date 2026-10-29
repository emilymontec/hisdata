import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Bienvenido/a, {user?.firstName}</h1>
      <p>Este es el panel inicial de HISDATA. Los módulos de pacientes, citas e historia clínica se conectan a la API ya implementada.</p>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2>Próximos módulos de interfaz</h2>
        <p>
          Las pantallas de pacientes, citas, historia clínica y los demás módulos del backend se
          construyen de forma incremental sobre esta base (AppShell + AuthContext + cliente API).
        </p>
      </div>
    </div>
  );
}
