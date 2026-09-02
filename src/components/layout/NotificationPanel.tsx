import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, AlertTriangle, Clock, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { intelligenceService } from '../../services';
import type { Alert } from '../../types/domain';

const PRIORITY_ICONS: Record<string, React.ReactNode> = {
  Critical: <AlertCircle size={16} style={{ color: 'var(--status-critical)' }} />,
  High: <AlertTriangle size={16} style={{ color: 'var(--status-warning)' }} />,
  Medium: <Clock size={16} style={{ color: '#6B7280' }} />,
  Low: <FileText size={16} style={{ color: 'var(--surta-green-500)' }} />,
};

export function NotificationPanel() {
  const { toggleNotificationPanel } = useApp();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    intelligenceService.getAlerts('trial-001').then(setAlerts);
  }, []);

  const handleAlertClick = (alert: Alert) => {
    navigate(alert.navigateTo);
    toggleNotificationPanel();
  };

  return (
    <>
      <div
        onClick={toggleNotificationPanel}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }}
      />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
        background: 'white', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        zIndex: 50, display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.25s ease',
      }}>
        <div style={{ padding: '20px 20px', borderBottom: '1px solid var(--surta-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.125rem', color: 'var(--surta-green-900)' }}>Notifications</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>AYU-001 — Active alerts</p>
          </div>
          <button className="btn-icon" onClick={toggleNotificationPanel}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {alerts.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--status-neutral)', fontSize: '0.875rem' }}>
              No active alerts
            </div>
          ) : (
            alerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                style={{
                  padding: '14px 16px', borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                  background: 'var(--surta-ivory)', border: '1px solid var(--surta-green-100)',
                  borderLeft: `4px solid ${alert.priority === 'Critical' ? 'var(--status-critical)' : alert.priority === 'High' ? 'var(--status-warning)' : alert.priority === 'Medium' ? 'var(--status-neutral)' : 'var(--surta-green-500)'}`,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surta-green-100)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--surta-ivory)')}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  {PRIORITY_ICONS[alert.priority]}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--surta-green-900)', marginBottom: 3 }}>{alert.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.4 }}>{alert.description.slice(0, 100)}{alert.description.length > 100 ? '...' : ''}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
