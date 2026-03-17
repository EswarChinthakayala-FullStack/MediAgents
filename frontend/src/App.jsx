import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components
import { ThemeProvider } from './components/theme-provider';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

// Pages
import LandingPage from './pages/LandingPage';

// Auth Pages
import LoginGateway from './pages/auth/LoginGateway';
import PatientLogin from './pages/auth/PatientLogin';
import DoctorLogin from './pages/auth/DoctorLogin';
import AdminLogin from './pages/auth/AdminLogin';
import PatientRegister from './pages/auth/PatientRegister';
import StaffRegister from './pages/auth/StaffRegister';
import SignupGateway from './pages/auth/SignupGateway';

// Portal (Patient) Pages
import PortalDashboard from './pages/portal/PortalDashboard';
import Symptoms from './pages/portal/Symptoms';
import BookAppointment from './pages/portal/BookAppointment';
import Appointments from './pages/portal/Appointments';
import ChatAssistant from './pages/portal/ChatAssistant';
import HealthRecords from './pages/portal/HealthRecords';
import Medications from './pages/portal/Medications';
import Notifications from './pages/portal/Notifications';
import Profile from './pages/portal/Profile';

// Clinical Pages
// Clinical Pages
import ClinicalDashboard from './pages/clinical/ClinicalDashboard';
import PatientQueue from './pages/clinical/PatientQueue';
import PatientRecordView from './pages/clinical/PatientRecordView';
import DecisionSupport from './pages/clinical/DecisionSupport';
import VitalsMonitor from './pages/clinical/VitalsMonitor';
import RiskScore from './pages/clinical/RiskScore';
import ClinicalNotes from './pages/clinical/ClinicalNotes';
import AlertsFeed from './pages/clinical/AlertsFeed';
import ClinicalAnalytics from './pages/clinical/ClinicalAnalytics';

// Admin Pages
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PopulationAnalytics from './pages/admin/PopulationAnalytics';
import UserManagement from './pages/admin/UserManagement';
import Scheduling from './pages/admin/Scheduling';
import AuditLog from './pages/admin/AuditLog';
import ComplianceDashboard from './pages/admin/ComplianceDashboard';
import AlertConfiguration from './pages/admin/AlertConfiguration';
import AgentMonitor from './pages/admin/AgentMonitor';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/AdminSettings';

const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <GuestRoute>
            <LandingPage />
          </GuestRoute>
        ),
      },
    ],
  },

  // Auth Routes
  { path: '/login', element: <GuestRoute><LoginGateway /></GuestRoute> },
  { path: '/login/patient', element: <GuestRoute><PatientLogin /></GuestRoute> },
  { path: '/portal/login', element: <GuestRoute><PatientLogin /></GuestRoute> },
  { path: '/login/clinical', element: <GuestRoute><DoctorLogin /></GuestRoute> },
  { path: '/clinical/login', element: <GuestRoute><DoctorLogin /></GuestRoute> },
  { path: '/login/admin', element: <GuestRoute><AdminLogin /></GuestRoute> },
  { path: '/admin/login', element: <GuestRoute><AdminLogin /></GuestRoute> },
  { path: '/register/patient', element: <GuestRoute><PatientRegister /></GuestRoute> },
  { path: '/register/clinical', element: <GuestRoute><StaffRegister /></GuestRoute> },
  { path: '/signup', element: <GuestRoute><SignupGateway /></GuestRoute> },

  // Patient Portal (Protected)
  {
    path: '/portal',
    element: (
      <ProtectedRoute requiredRole="patient">
        <DashboardLayout portalType="patient" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <PortalDashboard /> },
      { path: 'home', element: <PortalDashboard /> },
      { path: 'symptoms', element: <Symptoms /> },
      { path: 'book', element: <BookAppointment /> },
      { path: 'appointments', element: <Appointments /> },
      { path: 'chat', element: <ChatAssistant /> },
      { path: 'records', element: <HealthRecords /> },
      { path: 'medications', element: <Medications /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Portal Module Under Development</div> }
    ],
  },

  // Clinical Dashboard (Doctors/Nurses) - Protected
  {
    path: '/clinical',
    element: (
      <ProtectedRoute requiredRole={['doctor', 'nurse', 'dentist']}>
        <DashboardLayout portalType="clinical" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ClinicalDashboard /> },
      { path: 'home', element: <ClinicalDashboard /> },
      { path: 'queue', element: <PatientQueue /> },
      { path: 'patient/:id', element: <PatientRecordView /> },
      { path: 'decision/:id', element: <DecisionSupport /> },
      { path: 'vitals/:id', element: <VitalsMonitor /> },
      { path: 'risk/:id', element: <RiskScore /> },
      { path: 'notes/:id', element: <ClinicalNotes /> },
      { path: 'alerts', element: <AlertsFeed /> },
      { path: 'analytics', element: <ClinicalAnalytics /> },
      { path: 'patients', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Patient Directory (Coming Soon)</div> },
      { path: 'appointments', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Clinical Calendar (Coming Soon)</div> },
      { path: 'chat', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Clinical Agent Consultation (Coming Soon)</div> },
      { path: '*', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Clinical Module Under Development</div> }
    ],
  },

  // Admin Panel - Protected
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <DashboardLayout portalType="admin" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'home', element: <AdminDashboard /> },
      { path: 'analytics', element: <PopulationAnalytics /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'scheduling', element: <Scheduling /> },
      { path: 'audit', element: <AuditLog /> },
      { path: 'compliance', element: <ComplianceDashboard /> },
      { path: 'alerts/config', element: <AlertConfiguration /> },
      { path: 'agents', element: <AgentMonitor /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <AdminSettings /> },
      { path: '*', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Administrative Module Under Development</div> }
    ],
  },

  // Legacy Dashboard Redirect
  { path: '/dashboard', element: <Navigate to="/clinical" replace /> },

  // Fallback
  {
    path: '*',
    element: <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground gap-4">
      <h1 className="text-4xl font-bold italic tracking-tighter uppercase">404</h1>
      <p className="text-muted-foreground italic font-bold uppercase tracking-widest text-xs">Clinical Corridor Not Found</p>
      <a href="/" className="px-6 py-3 bg-secondary border border-border rounded hover:bg-secondary/80 transition-all text-[10px] font-bold uppercase tracking-widest shadow-xl">Back to Gateway</a>
    </div>,
  }
]);

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="clinic-ai-theme">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
