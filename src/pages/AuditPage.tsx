import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, LoadingState } from '../components/ui';
import { auditService } from '../services';
import type { AuditLog } from '../types/domain';

const ROLE_COLORS: Record<string, string> = {
  PI: 'var(--surta-gold)', Coordinator: 'var(--surta-green-500)',
  Ethics: '#8CA3C4', Safety: 'var(--status-critical)',
};

export function AuditPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditService.getAll().then(l => { setLogs(l); setLoading(false); });
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Audit Trail"
        subtitle={`${logs.length} immutable audit records · All system mutations tracked`}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, background: 'var(--surta-green-100)', padding: '10px 14px', borderRadius: 8, fontSize: '0.8125rem', color: 'var(--surta-green-700)', fontWeight: 600 }}>
        🔒 Audit records are immutable — they cannot be modified or deleted from the UI
      </div>

      <div className="surta-card" style={{ overflow: 'hidden' }}>
        {logs.map((log, i) => (
          <div key={log.id} style={{ display: 'flex', gap: 16, padding: '14px 20px', borderBottom: i < logs.length - 1 ? '1px solid var(--surta-green-100)' : 'none', alignItems: 'flex-start' }}>
            {/* Avatar */}
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: ROLE_COLORS[log.userRole] ? `${ROLE_COLORS[log.userRole]}22` : 'var(--surta-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${ROLE_COLORS[log.userRole] || 'var(--surta-green-500)'}` }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ROLE_COLORS[log.userRole] || 'var(--surta-green-700)' }}>
                {log.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--surta-green-900)' }}>{log.userName}</span>
                <span style={{ fontSize: '0.75rem', padding: '1px 8px', borderRadius: 12, background: ROLE_COLORS[log.userRole] ? `${ROLE_COLORS[log.userRole]}20` : 'var(--surta-green-100)', color: ROLE_COLORS[log.userRole] || 'var(--surta-green-700)', fontWeight: 600 }}>{log.userRole}</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--surta-green-700)' }}>{log.action}</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>→</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--surta-green-500)', fontWeight: 600 }}>{log.entityType} {log.entityId}</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>{log.details}</div>
            </div>

            {/* Timestamp */}
            <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', flexShrink: 0, textAlign: 'right' }}>
              <div>{new Date(log.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <div style={{ fontWeight: 600 }}>{new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
