import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ClinicalRecordPage } from './pages/ClinicalRecordPage';
import { ConsultationsPage } from './pages/ConsultationsPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { OrdersPage } from './pages/OrdersPage';
import { PatientsPage } from './pages/PatientsPage';
import { PharmacyPage } from './pages/PharmacyPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="pacientes" element={<PatientsPage />} />
          <Route path="citas" element={<AppointmentsPage />} />
          <Route path="historia-clinica" element={<ClinicalRecordPage />} />
          <Route path="consultas" element={<ConsultationsPage />} />
          <Route path="ordenes" element={<OrdersPage />} />
          <Route path="prescripciones" element={<PrescriptionsPage />} />
          <Route path="admisiones" element={<AdmissionsPage />} />
          <Route path="farmacia" element={<PharmacyPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
