import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import BookingHistory from './pages/BookingHistory';
import BillingPage from './pages/BillingPage';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SlotManagement from './pages/SlotManagement';
import RevenuePage from './pages/RevenuePage';

// ─── Root redirect ───────────────────────────────────────────
const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const map = { admin: '/admin', staff: '/staff', user: '/dashboard' };
  return <Navigate to={map[user.role] || '/login'} replace />;
};

// ─── Layout wrapper (Navbar + Sidebar + content) ─────────────
const Layout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      {user && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <div className="content-area flex flex-col min-h-screen" style={{ marginLeft: 0 }}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

// ─── App ─────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RootRedirect />} />

        {/* User routes */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'staff']} />}>
          {/* User-specific */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/history" element={<BookingHistory />} />
            <Route path="/billing" element={<BillingPage />} />
          </Route>

          {/* Staff routes */}
          <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/bookings" element={<StaffDashboard />} />
            <Route path="/staff/checkin" element={<StaffDashboard />} />
            <Route path="/staff/slots" element={<StaffDashboard />} />
            <Route path="/staff/logs" element={<StaffDashboard />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/staff" element={<AdminDashboard />} />
            <Route path="/admin/slots" element={<SlotManagement />} />
            <Route path="/admin/pricing" element={<SlotManagement />} />
            <Route path="/admin/revenue" element={<RevenuePage />} />
            <Route path="/admin/analytics" element={<RevenuePage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
