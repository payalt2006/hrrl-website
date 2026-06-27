import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Sidebar, TopNav, MobileNav } from './components/Layout';
import { Toast } from './components/common';
import SplashScreen from './components/SplashScreen';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RaiseRequestPage from './pages/RaiseRequestPage';
import MyRequestsPage from './pages/MyRequestsPage';
import ApprovalsPage from './pages/ApprovalsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AuditPage from './pages/AuditPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

// Private route wrapper with role-based access
function PrivateRoute({ requiredRoles = [] }) {
  const { user, hasRole } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <AccessDeniedPage />;
  }
  return <Outlet />;
}

// Authenticated layout with sidebar + topnav
function AuthLayout() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNav 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          setMobileOpen={setMobileOpen} 
        />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return <Toast toasts={toasts} removeToast={removeToast} />;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(
    sessionStorage.getItem('hrrl-splash-shown') === 'true'
  );

  return (
    <ThemeProvider>
      {!splashDone ? (
        <SplashScreen onComplete={() => setSplashDone(true)} />
      ) : (
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
              <ToastContainer />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<AuthLayout />}>
                  {/* All authenticated roles */}
                  <Route element={<PrivateRoute requiredRoles={['employee', 'manager', 'sap_admin', 'auditor']} />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/raise-request" element={<RaiseRequestPage />} />
                    <Route path="/my-requests" element={<MyRequestsPage />} />
                    <Route path="/ai-assistant" element={<AIAssistantPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                  </Route>

                  {/* Manager + SAP Admin */}
                  <Route element={<PrivateRoute requiredRoles={['manager', 'sap_admin']} />}>
                    <Route path="/approvals" element={<ApprovalsPage />} />
                  </Route>

                  {/* SAP Admin + Auditor */}
                  <Route element={<PrivateRoute requiredRoles={['sap_admin', 'auditor']} />}>
                    <Route path="/audit" element={<AuditPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                  </Route>

                  {/* SAP Admin only */}
                  <Route element={<PrivateRoute requiredRoles={['sap_admin']} />}>
                    <Route path="/admin" element={<AdminPage />} />
                  </Route>
                </Route>

                {/* Redirect root to login or dashboard */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
}
