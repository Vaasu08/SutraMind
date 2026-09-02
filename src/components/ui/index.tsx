// Core UI components for SURTAMIND
// SectionHeading, LeafDivider, StatusBadge, MetricCard, ProgressBar,
// WorkflowStepper, Timeline, DataTable, Modal, EmptyState, LoadingState, ErrorState

import React from 'react';
import { Leaf, AlertCircle, RefreshCw, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// ─────────────────────────────────────────
// LEAF DIVIDER + SECTION HEADING
// ─────────────────────────────────────────
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, subtitle, className = '', action }: SectionHeadingProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {eyebrow && (
        <div className="section-heading-eyebrow mb-2">
          <Leaf size={14} style={{ color: 'var(--surta-gold)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--surta-gold)' }}>
            {eyebrow}
          </span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--surta-green-900)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600 }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--status-neutral)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </div>
  );
}

export function LeafDivider({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', opacity: 0.6 }}>
      <div style={{ flex: 1, height: 1, background: 'var(--surta-gold)' }} />
      <Leaf size={16} style={{ color: 'var(--surta-gold)' }} />
      {label && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--surta-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>}
      <Leaf size={16} style={{ color: 'var(--surta-gold)', transform: 'scaleX(-1)' }} />
      <div style={{ flex: 1, height: 1, background: 'var(--surta-gold)' }} />
    </div>
  );
}

// ─────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────
type BadgeVariant = 'critical' | 'warning' | 'good' | 'neutral' | 'vata' | 'pitta' | 'kapha' | 'dark' | 'gold';

export function StatusBadge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

// Trial status → badge variant
export function TrialStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    ACTIVE: 'good', COMPLETED: 'dark', DRAFT: 'neutral', CLOSED: 'neutral',
    ETHICS_SUBMITTED: 'warning', ETHICS_REVIEW: 'warning', APPROVED: 'good',
  };
  return <StatusBadge variant={map[status] || 'neutral'}>{status.replace('_', ' ')}</StatusBadge>;
}

export function ParticipantStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    Enrolled: 'good', Active: 'good', Screening: 'warning',
    Withdrawn: 'critical', Completed: 'dark', 'Lost to Follow-up': 'neutral',
  };
  return <StatusBadge variant={map[status] || 'neutral'}>{status}</StatusBadge>;
}

export function SafetyStatusBadge({ status }: { status: string }) {
  if (status === 'SAE') return <StatusBadge variant="critical">SAE</StatusBadge>;
  if (status === 'AE') return <StatusBadge variant="warning">AE</StatusBadge>;
  return <StatusBadge variant="good">Normal</StatusBadge>;
}

// ─────────────────────────────────────────
// METRIC CARD
// ─────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'critical' | 'warning' | 'good';
  onClick?: () => void;
}

export function MetricCard({ label, value, subtext, icon, variant = 'default', onClick }: MetricCardProps) {
  const variantColors: Record<string, string> = {
    default: 'var(--surta-green-900)',
    critical: 'var(--status-critical)',
    warning: '#996e00',
    good: 'var(--status-good)',
  };

  return (
    <div
      className="surta-card"
      style={{ padding: '20px 24px', cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--status-neutral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            {label}
          </div>
          <div className="metric-hero-number" style={{ color: variantColors[variant] }}>
            {value}
          </div>
          {subtext && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', marginTop: 4 }}>
              {subtext}
            </div>
          )}
        </div>
        {icon && (
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surta-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--surta-green-500)' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'gold' | 'critical';
  showLabel?: boolean;
  height?: number;
}

export function ProgressBar({ value, max = 100, variant = 'default', showLabel = true, height = 6 }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-track" style={{ flex: 1, height }}>
        <div
          className={`progress-fill${variant === 'gold' ? ' progress-fill-gold' : variant === 'critical' ? ' progress-fill-critical' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--surta-green-700)', minWidth: 36, textAlign: 'right' }}>{Math.round(pct)}%</span>}
    </div>
  );
}

// ─────────────────────────────────────────
// WORKFLOW STEPPER
// ─────────────────────────────────────────
interface Step {
  label: string;
  sublabel?: string;
  status: 'completed' | 'active' | 'pending';
}

export function WorkflowStepper({ steps }: { steps: Step[] }) {
  return (
    <div className="workflow-stepper">
      {steps.map((step, i) => (
        <div key={i} className={`step-node ${step.status}`}>
          <div className="step-circle">
            {step.status === 'completed' ? '✓' : i + 1}
          </div>
          <div style={{ marginTop: 8, textAlign: 'center', padding: '0 4px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: step.status === 'pending' ? 'var(--status-neutral)' : 'var(--surta-green-900)' }}>
              {step.label}
            </div>
            {step.sublabel && (
              <div style={{ fontSize: '0.75rem', color: 'var(--status-neutral)', marginTop: 2 }}>{step.sublabel}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// TIMELINE
// ─────────────────────────────────────────
interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  status: 'completed' | 'active' | 'pending';
  icon?: React.ReactNode;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {events.map((event, i) => (
        <div key={i} className="timeline-item" style={{ paddingBottom: i < events.length - 1 ? 24 : 0 }}>
          <div className={`timeline-dot ${event.status}`}>
            {event.status === 'completed' ? <span style={{ fontSize: 12 }}>✓</span> :
             event.status === 'active' ? <span style={{ fontSize: 12 }}>●</span> :
             <span style={{ fontSize: 12 }}>○</span>}
          </div>
          <div style={{ flex: 1, paddingTop: 4 }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)', marginBottom: 2 }}>{event.date}</div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--surta-green-900)', marginBottom: 2 }}>{event.title}</div>
            {event.description && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{event.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// DATA TABLE
// ─────────────────────────────────────────
interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({ columns, data, onRowClick, emptyMessage = 'No data found', loading }: DataTableProps<T>) {
  if (loading) return <TableSkeleton rows={5} cols={columns.length} />;
  if (data.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="surta-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? 'pointer' : undefined }}
            >
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  if (!open) return null;
  const maxWidth = size === 'sm' ? 480 : size === 'lg' ? 800 : 640;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--surta-green-100)' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--surta-green-900)', fontSize: '1.125rem' }}>{title}</h3>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
        {footer && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--surta-green-100)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────
export function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--status-neutral)' }}>
      <div style={{ marginBottom: 12, opacity: 0.4 }}>
        {icon || <Leaf size={40} />}
      </div>
      <p style={{ margin: 0, fontSize: '0.9375rem' }}>{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────
// LOADING STATE
// ─────────────────────────────────────────
export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--status-neutral)' }}>
      <div className="animate-pulse-slow" style={{ marginBottom: 12 }}>
        <Leaf size={36} style={{ color: 'var(--surta-green-500)' }} />
      </div>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────
export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <AlertCircle size={36} style={{ color: 'var(--status-critical)', marginBottom: 12 }} />
      <p style={{ margin: '0 0 16px', color: 'var(--status-neutral)' }}>{message}</p>
      {onRetry && (
        <button className="btn-secondary btn-sm" onClick={onRetry}>
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// SKELETON LOADING
// ─────────────────────────────────────────
function TableSkeleton({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="surta-table">
        <thead><tr>{Array(cols).fill(0).map((_, i) => <th key={i}><div className="skeleton" style={{ height: 12, width: '80%' }} /></th>)}</tr></thead>
        <tbody>
          {Array(rows).fill(0).map((_, r) => (
            <tr key={r}>
              {Array(cols).fill(0).map((_, c) => (
                <td key={c}><div className="skeleton" style={{ height: 14, width: `${60 + Math.random() * 30}%` }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="surta-card" style={{ padding: 24 }}>
      <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 40, width: '60%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '30%' }} />
    </div>
  );
}

// ─────────────────────────────────────────
// TOAST CONTAINER
// ─────────────────────────────────────────
export function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle size={18} style={{ color: 'var(--status-good)' }} />,
    error: <AlertCircle size={18} style={{ color: 'var(--status-critical)' }} />,
    warning: <AlertTriangle size={18} style={{ color: 'var(--status-warning)' }} />,
    info: <Info size={18} style={{ color: 'var(--surta-green-500)' }} />,
  };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {icons[t.type]}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{t.title}</div>
            {t.message && <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: 2 }}>{t.message}</div>}
          </div>
          <button className="btn-icon" onClick={() => dismissToast(t.id)} style={{ padding: 4 }}><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; onClick?: () => void }>;
}

export function PageHeader({ title, subtitle, badge, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--status-neutral)', fontSize: '0.8125rem' }}>/</span>}
              <span
                style={{ fontSize: '0.8125rem', color: crumb.onClick ? 'var(--surta-green-500)' : 'var(--status-neutral)', cursor: crumb.onClick ? 'pointer' : undefined, fontWeight: 500 }}
                onClick={crumb.onClick}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--surta-green-900)', lineHeight: 1.2 }}>
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--status-neutral)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
