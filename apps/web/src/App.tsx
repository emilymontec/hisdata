import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { AuditPage } from './pages/AuditPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { ClinicalRecordPage } from './pages/ClinicalRecordPage';
import { ConsultationsPage } from './pages/ConsultationsPage';
import { HomePage } from './pages/HomePage';
import { ImagingPage } from './pages/ImagingPage';
import { InventoryPage } from './pages/InventoryPage';
import { LaboratoryPage } from './pages/LaboratoryPage';
import { LoginPage } from './pages/LoginPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NursingPage } from './pages/NursingPage';
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
          <Route path="enfermeria" element={<NursingPage />} />
          <Route path="laboratorio" element={<LaboratoryPage />} />
          <Route path="imagenologia" element={<ImagingPage />} />
          <Route path="inventario" element={<InventoryPage />} />
          <Route path="certificados" element={<CertificatesPage />} />
          <Route path="notificaciones" element={<NotificationsPage />} />
          <Route path="auditoria" element={<AuditPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
