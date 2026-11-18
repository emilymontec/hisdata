import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'General',
    items: [
      { to: '/', label: 'Inicio' },
      { to: '/pacientes', label: 'Pacientes' },
      { to: '/citas', label: 'Citas' },
    ],
  },
  {
    label: 'Atención clínica',
    items: [
      { to: '/historia-clinica', label: 'Historia clínica' },
      { to: '/consultas', label: 'Consultas' },
      { to: '/enfermeria', label: 'Enfermería' },
      { to: '/admisiones', label: 'Admisiones' },
    ],
  },
  {
    label: 'Apoyo diagnóstico y terapéutico',
    items: [
      { to: '/ordenes', label: 'Órdenes médicas' },
      { to: '/laboratorio', label: 'Laboratorio' },
      { to: '/imagenologia', label: 'Imagenología' },
      { to: '/prescripciones', label: 'Prescripciones' },
      { to: '/farmacia', label: 'Farmacia' },
    ],
  },
  {
    label: 'Administración',
    items: [
      { to: '/inventario', label: 'Inventario' },
      { to: '/certificados', label: 'Certificados' },
      { to: '/notificaciones', label: 'Notificaciones' },
      { to: '/auditoria', label: 'Auditoría' },
    ],
  },
];

function initials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-brand">
          <span className="brand-mark">H</span>
          <span>HISDATA</span>
        </div>
        <div className="app-topbar-user">
          <span className="app-topbar-role">{user?.role}</span>
          <span className="avatar">{initials(user?.firstName, user?.lastName)}</span>
          <button className="btn-ghost" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <nav>
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="nav-group">
                <div className="nav-group-label">{group.label}</div>
                {group.items.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
