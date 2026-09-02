import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FlaskConical, Users, Brain, Shield,
  ClipboardCheck, BarChart3, Upload, BookOpen, LogOut,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/domain';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
  group: string;
}

const NAV_GROUPS = [
  { key: 'workspace',    label: 'Workspace' },
  { key: 'intelligence', label: 'Clinical Intelligence' },
  { key: 'insights',     label: 'Insights' },
  { key: 'records',      label: 'Records' },
];

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    path: '/dashboard',    icon: <LayoutDashboard size={16} />, roles: ['PI','Coordinator','Ethics','Safety'], group: 'workspace' },
  { label: 'Trials',       path: '/trials',       icon: <FlaskConical size={16} />,    roles: ['PI','Coordinator','Ethics','Safety'], group: 'workspace' },
  { label: 'Participants', path: '/participants', icon: <Users size={16} />,           roles: ['PI','Coordinator','Safety'],          group: 'workspace' },
  { label: 'Intelligence', path: '/intelligence', icon: <Brain size={16} />,           roles: ['PI'],                                 group: 'intelligence' },
  { label: 'Safety',       path: '/safety',       icon: <Shield size={16} />,          roles: ['PI','Safety','Coordinator'],          group: 'intelligence' },
  { label: 'Compliance',   path: '/compliance',   icon: <ClipboardCheck size={16} />, roles: ['PI','Safety'],                        group: 'intelligence' },
  { label: 'Analytics',    path: '/analytics',    icon: <BarChart3 size={16} />,       roles: ['PI'],                                 group: 'insights' },
  { label: 'Export / FHIR',path: '/export',       icon: <Upload size={16} />,          roles: ['PI'],                                 group: 'records' },
  { label: 'Audit Trail',  path: '/audit',        icon: <BookOpen size={16} />,        roles: ['PI','Safety'],                        group: 'records' },
];

// Subtle botanical SVG watermark for the sidebar
function SidebarBotanical() {
  return (
    <svg
      viewBox="0 0 160 400"
      style={{
        position: 'absolute',
        bottom: 40,
        right: -20,
        width: 160,
        height: 400,
        opacity: 0.045,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      fill="none"
      stroke="white"
      strokeWidth="1"
    >
      {/* Main stem */}
      <path d="M80 390 Q76 300 82 200 Q85 130 80 60" />
      {/* Left fronds */}
      <path d="M81 320 Q55 295 35 265 Q20 245 15 215" />
      <path d="M81 270 Q50 245 28 210 Q12 188 8 158" />
      <path d="M81 220 Q54 197 36 165 Q22 143 20 112" />
      <path d="M81 170 Q58 148 44 120 Q34 100 33 72" />
      {/* Right fronds */}
      <path d="M81 305 Q108 280 128 250 Q143 229 148 198" />
      <path d="M81 255 Q112 230 134 196 Q148 173 152 142" />
      <path d="M81 205 Q114 182 136 150 Q150 127 152 97" />
      <path d="M81 155 Q115 133 135 104 Q148 82 148 54" />
      {/* Leaf tips */}
      <circle cx="15" cy="215" r="2" />
      <circle cx="8"  cy="158" r="2" />
      <circle cx="20" cy="112" r="2" />
      <circle cx="148" cy="198" r="2" />
      <circle cx="152" cy="142" r="2" />
      <circle cx="152" cy="97"  r="2" />
    </svg>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter(item =>
    user ? item.roles.includes(user.role) : false
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="sm-sidebar"
      style={{
        width: collapsed ? 60 : 252,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <SidebarBotanical />

      {/* ── Logo area ── */}
      <div style={{
        padding: collapsed ? '18px 0' : '18px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: 66,
        position: 'relative',
        zIndex: 1,
      }}>
        {!collapsed ? (
          /* Full logo: S monogram + wordmark rendered in SVG for dark bg */
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* S-leaf mark */}
            <div style={{
              width: 34, height: 34,
              borderRadius: 8,
              background: 'rgba(93,140,99,0.22)',
              border: '1px solid rgba(93,140,99,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                <path d="M14 4C12.5 2.5 10 2 7.5 3C5 4 3.5 6.5 4 9C4.5 11.5 7 12.5 9.5 13C12 13.5 14.5 14.5 15 17C15.5 19.5 13.5 21.5 11 21.8C8.5 22.1 6 21 4.5 19.5" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round"/>
                <ellipse cx="10" cy="19" rx="4" ry="2.5" fill="#4CAF72" opacity="0.75"/>
                <path d="M8 17C8 17 6 20 10 21C10 21 12 20.5 11 18" fill="#5D8C63" opacity="0.9"/>
              </svg>
            </div>
            {/* Wordmark */}
            <div>
              <div style={{
                fontFamily: 'var(--font-sans)', fontWeight: 700,
                fontSize: '0.9375rem', letterSpacing: '0.04em',
                lineHeight: 1,
                color: 'rgba(255,255,255,0.92)',
              }}>
                SURTA<span style={{ color: '#7DC49F' }}>MIND</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)', fontWeight: 500,
                fontSize: '0.5625rem', letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.32)',
                textTransform: 'uppercase', marginTop: 3,
              }}>
                Smart CTMS for Ayurveda
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed monogram */
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'rgba(93,140,99,0.22)',
            border: '1px solid rgba(93,140,99,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
              <path d="M14 4C12.5 2.5 10 2 7.5 3C5 4 3.5 6.5 4 9C4.5 11.5 7 12.5 9.5 13C12 13.5 14.5 14.5 15 17C15.5 19.5 13.5 21.5 11 21.8C8.5 22.1 6 21 4.5 19.5" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round"/>
              <ellipse cx="10" cy="19" rx="4" ry="2.5" fill="#4CAF72" opacity="0.75"/>
            </svg>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 8, position: 'relative', zIndex: 1 }}>
        {NAV_GROUPS.map(group => {
          const groupItems = visibleItems.filter(i => i.group === group.key);
          if (groupItems.length === 0) return null;
          return (
            <div key={group.key}>
              {!collapsed && (
                <div className="sm-sidebar-group-label">{group.label}</div>
              )}
              {collapsed && (
                <div style={{ height: 12 }} />
              )}
              {groupItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sm-nav-item${isActive ? ' active' : ''}`}
                  title={collapsed ? item.label : undefined}
                  style={{
                    justifyContent: collapsed ? 'center' : undefined,
                    padding: collapsed ? '9px 0' : '9px 18px',
                  }}
                >
                  <span className="sm-nav-icon" style={{ flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span style={{ lineHeight: 1.3 }}>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* ── User + Logout ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: collapsed ? '12px 0' : '14px 16px',
        position: 'relative',
        zIndex: 1,
      }}>
        {!collapsed && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(181,138,42,0.2)',
              border: '1.5px solid rgba(181,138,42,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '0.75rem',
              color: '#D4A84B',
              flexShrink: 0,
              letterSpacing: '0.02em',
            }}>
              {user.initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.6875rem', letterSpacing: '0.04em' }}>
                {user.role === 'PI' ? 'Principal Investigator' : user.role === 'Coordinator' ? 'Research Coordinator' : user.role === 'Ethics' ? 'Ethics Committee' : 'Safety Officer'}
              </div>
            </div>
          </div>
        )}
        <button
          className="sm-nav-item"
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : undefined}
          style={{
            width: '100%',
            justifyContent: collapsed ? 'center' : undefined,
            padding: collapsed ? '9px 0' : '8px 4px',
            color: 'rgba(255,255,255,0.38)',
            fontSize: '0.8125rem',
          }}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: 22,
          right: -11,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'var(--sm-forest-mid)',
          border: '1.5px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.6)',
          zIndex: 20,
          transition: 'background 0.15s, color 0.15s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--sm-leaf)';
          (e.currentTarget as HTMLButtonElement).style.color = 'white';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--sm-forest-mid)';
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
        }}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </aside>
  );
}
