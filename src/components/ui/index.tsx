// Core UI components for SURTAMIND — Redesigned v2
// SectionHeading, LeafDivider, StatusBadge, MetricCard, ProgressBar,
// WorkflowStepper, Timeline, DataTable, Modal, EmptyState, LoadingState, ErrorState

import React from 'react';
import { Leaf, AlertCircle, RefreshCw, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// ─────────────────────────────────────────
// SECTION HEADING
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
    <div className={`mb-6 ${className}`} style={{ marginBottom: 20 }}>
      {eyebrow && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Leaf size={12} style={{ color: 'var(--sm-gold)', flexShrink: 0 }} />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{
            margin: 0, color: 'var(--sm-forest)',
            fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 400,
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--sm-text-soft)' }}>
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0', opacity: 0.5 }}>
      <div style={{ flex: 1, height: 1, background: 'var(--sm-gold)', maxWidth: 60 }} />
      <Leaf size={14} style={{ color: 'var(--sm-gold)' }} />
      {label && (
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--sm-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {label}
        </span>
      )}
      <Leaf size={14} style={{ color: 'var(--sm-gold)', transform: 'scaleX(-1)' }} />
      <div style={{ flex: 1, height: 1, background: 'var(--sm-gold)', maxWidth: 60 }} />
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
  if (status === 'AE')  return <StatusBadge variant="warning">AE</StatusBadge>;
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
  const valueColors: Record<string, string> = {
    default:  'var(--sm-text)',
    critical: 'var(--sm-critical)',
    warning:  'var(--sm-warning)',
    good:     'var(--sm-good)',
  };
  const bgColors: Record<string, string> = {
    default:  'transparent',
    critical: 'rgba(155,62,42,0.06)',
    warning:  'rgba(181,138,42,0.06)',
    good:     'rgba(61,122,79,0.06)',
  };

  return (
    <div
      className="surta-card"
      style={{
        padding: '18px 20px',
        cursor: onClick ? 'pointer' : undefined,
        background: bgColors[variant] || 'var(--sm-white)',
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>{label}</div>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: '1.875rem', fontWeight: 700,
            fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.03em',
            color: valueColors[variant],
          }}>
            {value}
          </div>
          {subtext && (
            <div style={{ fontSize: '0.75rem', color: 'var(--sm-text-soft)', marginTop: 5 }}>
              {subtext}
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'var(--sm-botanical-x)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: variant === 'critical' ? 'var(--sm-critical)' : variant === 'warning' ? 'var(--sm-warning)' : 'var(--sm-leaf)',
          }}>
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

export function ProgressBar({ value, max = 100, variant = 'default', showLabel = true, height = 5 }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-track" style={{ flex: 1, height }}>
        <div
          className={`progress-fill${variant === 'gold' ? ' progress-fill-gold' : variant === 'critical' ? ' progress-fill-critical' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--sm-leaf)', minWidth: 34, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(pct)}%
        </span>
      )}
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
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
              color: step.status === 'pending' ? 'var(--sm-text-muted)' : 'var(--sm-text)',
            }}>
              {step.label}
            </div>
            {step.sublabel && (
              <div style={{ fontSize: '0.75rem', color: 'var(--sm-text-muted)', marginTop: 2 }}>{step.sublabel}</div>
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
        <div key={i} className="timeline-item" style={{ paddingBottom: i < events.length - 1 ? 22 : 0 }}>
          <div className={`timeline-dot ${event.status}`}>
            {event.status === 'completed' ? <span style={{ fontSize: 11 }}>✓</span>
            : event.status === 'active'    ? <span style={{ fontSize: 11 }}>●</span>
            : <span style={{ fontSize: 11 }}>○</span>}
          </div>
          <div style={{ flex: 1, paddingTop: 3 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--sm-text-muted)', marginBottom: 2 }}>{event.date}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--sm-text)', marginBottom: 2 }}>{event.title}</div>
            {event.description && (
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--sm-text-soft)' }}>{event.description}</div>
            )}
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

export function DataTable<T extends Record<string, unknown>>({ columns, data, onRowClick, emptyMessage = 'No records found.', loading }: DataTableProps<T>) {
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
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid var(--border-color)',
        }}>
          <h3 style={{
            margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.0625rem',
            fontWeight: 400, color: 'var(--sm-forest)',
          }}>
            {title}
          </h3>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ padding: '22px 24px' }}>{children}</div>
        {footer && (
          <div style={{
            padding: '14px 24px', borderTop: '1px solid var(--border-color)',
            display: 'flex', gap: 8, justifyContent: 'flex-end',
            background: 'var(--sm-ivory)',
          }}>
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
export function EmptyState({ message, icon, subtext }: { message: string; icon?: React.ReactNode; subtext?: string }) {
  return (
    <div style={{ padding: '52px 24px', textAlign: 'center', color: 'var(--sm-text-muted)' }}>
      <div style={{ marginBottom: 14 }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25, margin: '0 auto' }}>
          <path
            d="M12 22C12 22 4 16 4 8C4 4.134 7.582 2 12 2C16.418 2 20 4.134 20 8C20 16 12 22 12 22Z"
            stroke="var(--sm-forest)" strokeWidth="1.5" />
          <path d="M12 2V22" stroke="var(--sm-forest)" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M4 8H20" stroke="var(--sm-forest)" strokeWidth="1" />
        </svg>
        {icon && <div style={{ marginTop: 8 }}>{icon}</div>}
      </div>
      <p style={{ margin: '0 0 4px', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--sm-text-soft)' }}>
        {message}
      </p>
      {subtext && (
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--sm-text-muted)' }}>
          {subtext}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// LOADING STATE
// ─────────────────────────────────────────
export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--sm-text-muted)' }}>
      <div className="animate-pulse-slow" style={{ marginBottom: 16, display: 'inline-block' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C12 22 4 16 4 8C4 4.134 7.582 2 12 2C16.418 2 20 4.134 20 8C20 16 12 22 12 22Z"
            stroke="var(--sm-leaf)" strokeWidth="1.5" />
          <path d="M12 2V22" stroke="var(--sm-leaf)" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>
      <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '0.9375rem' }}>{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────
export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div style={{ padding: '52px 24px', textAlign: 'center' }}>
      <AlertCircle size={36} style={{ color: 'var(--sm-critical)', marginBottom: 14, opacity: 0.7 }} />
      <p style={{ margin: '0 0 16px', color: 'var(--sm-text-soft)', fontSize: '0.9375rem' }}>{message}</p>
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
        <thead>
          <tr>{Array(cols).fill(0).map((_, i) => (
            <th key={i}><div className="skeleton" style={{ height: 10, width: '75%' }} /></th>
          ))}</tr>
        </thead>
        <tbody>
          {Array(rows).fill(0).map((_, r) => (
            <tr key={r}>
              {Array(cols).fill(0).map((_, c) => (
                <td key={c}><div className="skeleton" style={{ height: 13, width: `${55 + Math.random() * 35}%` }} /></td>
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
    <div className="surta-card" style={{ padding: 22 }}>
      <div className="skeleton" style={{ height: 12, width: '35%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 34, width: '55%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 10, width: '28%' }} />
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
    success: <CheckCircle size={16} style={{ color: 'var(--sm-good)', flexShrink: 0 }} />,
    error:   <AlertCircle size={16} style={{ color: 'var(--sm-critical)', flexShrink: 0 }} />,
    warning: <AlertTriangle size={16} style={{ color: 'var(--sm-warning)', flexShrink: 0 }} />,
    info:    <Info size={16} style={{ color: 'var(--sm-leaf)', flexShrink: 0 }} />,
  };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {icons[t.type]}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--sm-text)' }}>{t.title}</div>
            {t.message && (
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--sm-text-soft)', marginTop: 2 }}>{t.message}</div>
            )}
          </div>
          <button className="btn-icon" onClick={() => dismissToast(t.id)} style={{ padding: 3 }}><X size={13} /></button>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--sm-text-muted)', fontSize: '0.8125rem' }}>/</span>}
              <span
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: '0.8125rem',
                  color: crumb.onClick ? 'var(--sm-leaf)' : 'var(--sm-text-muted)',
                  cursor: crumb.onClick ? 'pointer' : undefined, fontWeight: 500,
                  transition: 'color var(--transition-fast)',
                }}
                onClick={crumb.onClick}
                onMouseEnter={e => { if (crumb.onClick) (e.currentTarget as HTMLElement).style.color = 'var(--sm-forest)'; }}
                onMouseLeave={e => { if (crumb.onClick) (e.currentTarget as HTMLElement).style.color = 'var(--sm-leaf)'; }}
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
            <h1 style={{
              margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.75rem',
              fontWeight: 400, color: 'var(--sm-forest)', lineHeight: 1.2,
            }}>
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'var(--sm-text-soft)' }}>
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
