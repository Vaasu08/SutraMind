import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface AppContextValue {
  toasts: Toast[];
  showToast: (type: Toast['type'], title: string, message?: string) => void;
  dismissToast: (id: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  notificationPanelOpen: boolean;
  toggleNotificationPanel: () => void;
}

const AppContext = createContext<AppContextValue>({
  toasts: [],
  showToast: () => {},
  dismissToast: () => {},
  sidebarOpen: true,
  toggleSidebar: () => {},
  notificationPanelOpen: false,
  toggleNotificationPanel: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const showToast = useCallback((type: Toast['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      toasts, showToast, dismissToast,
      sidebarOpen, toggleSidebar: () => setSidebarOpen(p => !p),
      notificationPanelOpen, toggleNotificationPanel: () => setNotificationPanelOpen(p => !p),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
