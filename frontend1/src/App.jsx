import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components
import { ThemeProvider } from './components/theme-provider';

// Pages
import LandingPage from './pages/LandingPage';

// Auth Pages
import LoginGateway from './pages/auth/LoginGateway';
import PatientLogin from './pages/auth/PatientLogin';
import DoctorLogin from './pages/auth/DoctorLogin';
import AdminLogin from './pages/auth/AdminLogin';

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
import ClinicalDashboard from './pages/clinical/ClinicalDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },

  // Auth Routes
  { path: '/login', element: <LoginGateway /> },
  { path: '/login/patient', element: <PatientLogin /> },
  { path: '/login/clinical', element: <DoctorLogin /> },
  { path: '/login/admin', element: <AdminLogin /> },

  // Patient Portal
  {
    path: '/portal',
    element: <DashboardLayout portalType="patient" />,
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

  // Clinical Dashboard (Doctors/Nurses)
  {
    path: '/clinical',
    element: <DashboardLayout portalType="clinical" />,
    children: [
      { index: true, element: <ClinicalDashboard /> },
      { path: 'patients', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Patient Directory (Coming Soon)</div> },
      { path: 'appointments', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Clinical Calendar (Coming Soon)</div> },
      { path: 'chat', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Clinical Agent Consultation (Coming Soon)</div> },
      { path: '*', element: <div className="p-10 text-center text-muted-foreground italic font-bold uppercase tracking-widest">Clinical Module Under Development</div> }
    ],
  },

  // Admin Panel
  {
    path: '/admin',
    element: <DashboardLayout portalType="admin" />,
    children: [
      { index: true, element: <AdminDashboard /> },
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
      <a href="/" className="px-6 py-3 bg-secondary border border-border rounded-full hover:bg-secondary/80 transition-all text-[10px] font-bold uppercase tracking-widest shadow-xl">Back to Gateway</a>
    </div>,
  }
]);

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="clinic-ai-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
