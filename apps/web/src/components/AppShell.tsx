import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Inicio' },
  { to: '/pacientes', label: 'Pacientes' },
  { to: '/citas', label: 'Citas' },
  { to: '/historia-clinica', label: 'Historia clínica' },
];

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand">HISDATA</div>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', fontSize: '0.85rem', opacity: 0.85 }}>
          <div>{user?.firstName} {user?.lastName}</div>
          <div>{user?.role}</div>
          <button
            className="btn-primary"
            style={{ marginTop: '0.75rem', background: 'transparent', border: '1px solid rgba(246,244,239,0.4)' }}
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
