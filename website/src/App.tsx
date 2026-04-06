import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';

// Pages Lazy Loaded
const Login            = React.lazy(() => import('./pages/Login'));
const AdminDashboard   = React.lazy(() => import('./pages/Admin/Dashboard'));
const AdminInventory   = React.lazy(() => import('./pages/Admin/Inventory'));
const AdminOrders      = React.lazy(() => import('./pages/Admin/Orders'));
const AdminDealers     = React.lazy(() => import('./pages/Admin/Dealers'));
const AdminWorkers     = React.lazy(() => import('./pages/Admin/Workers'));

const DealerDashboard  = React.lazy(() => import('./pages/Dealer/Dashboard'));
const NewOrder         = React.lazy(() => import('./pages/Dealer/NewOrder'));
const DealerOrders     = React.lazy(() => import('./pages/Dealer/Orders'));

const WorkerTasks      = React.lazy(() => import('./pages/Worker/Tasks'));

/** Full-screen loading fallback */
const PageFallback = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg-base)',
    flexDirection: 'column', gap: 16, color: 'var(--text-muted)',
  }}>
    <div style={{
      width: 36, height: 36,
      border: '3px solid var(--glass-border)',
      borderTopColor: 'var(--accent-1)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <span style={{ fontSize: 13, fontWeight: 500 }}>Yuklanmoqda...</span>
  </div>
);

/** Protected layout with Sidebar */
const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageFallback />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Admin */}
            <Route path="/admin/*" element={
              <ProtectedRoute role="admin">
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="orders"    element={<AdminOrders />} />
                  <Route path="dealers"   element={<AdminDealers />} />
                  <Route path="workers"   element={<AdminWorkers />} />
                  <Route path="*"         element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Dealer */}
            <Route path="/dealer/*" element={
              <ProtectedRoute role="dealer">
                <Routes>
                  <Route path="dashboard" element={<DealerDashboard />} />
                  <Route path="new-order" element={<NewOrder />} />
                  <Route path="orders"    element={<DealerOrders />} />
                  <Route path="*"         element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Worker */}
            <Route path="/worker/*" element={
              <ProtectedRoute role="worker">
                <Routes>
                  <Route path="tasks"     element={<WorkerTasks />} />
                  <Route path="*"         element={<Navigate to="tasks" replace />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
