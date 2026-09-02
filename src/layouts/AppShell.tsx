import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { ToastContainer } from '../components/ui';
import { NotificationPanel } from '../components/layout/NotificationPanel';
import { useApp } from '../context/AppContext';

export function AppShell() {
  const { isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { notificationPanelOpen } = useApp();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--sm-ivory)' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar />
        <main
          className="app-main"
          style={{ padding: '28px 32px', maxWidth: '100%' }}
        >
          <Outlet />
        </main>
      </div>
      {notificationPanelOpen && <NotificationPanel />}
      <ToastContainer />
    </div>
  );
}
