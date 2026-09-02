import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FlaskConical, Users, Brain, Shield,
  ClipboardCheck, BarChart3, Upload, BookOpen, LogOut,
  ChevronLeft, ChevronRight, Leaf
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/domain';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} />, roles: ['PI', 'Coordinator', 'Ethics', 'Safety'] },
  { label: 'Trials', path: '/trials', icon: <FlaskConical size={18} />, roles: ['PI', 'Coordinator', 'Ethics', 'Safety'] },
  { label: 'Participants', path: '/participants', icon: <Users size={18} />, roles: ['PI', 'Coordinator', 'Safety'] },
  { label: 'Intelligence', path: '/intelligence', icon: <Brain size={18} />, roles: ['PI'] },
  { label: 'Safety', path: '/safety', icon: <Shield size={18} />, roles: ['PI', 'Safety', 'Coordinator'] },
  { label: 'Compliance', path: '/compliance', icon: <ClipboardCheck size={18} />, roles: ['PI', 'Safety'] },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} />, roles: ['PI'] },
  { label: 'Export / FHIR', path: '/export', icon: <Upload size={18} />, roles: ['PI'] },
  { label: 'Audit Trail', path: '/audit', icon: <BookOpen size={18} />, roles: ['PI', 'Safety'] },
];

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
      className="surta-sidebar"
      style={{
        width: collapsed ? 64 : 240,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden', flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 8, minHeight: 72,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surta-green-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={18} color="white" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
                SURTA<span style={{ color: 'var(--surta-green-500)' }}>MIND</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                Smart CTMS
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surta-green-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={18} color="white" />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `surta-sidebar-item${isActive ? ' active' : ''}`}
            title={collapsed ? item.label : undefined}
            style={{ justifyContent: collapsed ? 'center' : undefined, padding: collapsed ? '10px 0' : '10px 20px' }}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: collapsed ? '12px 0' : '12px 16px' }}>
        {!collapsed && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--surta-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', color: '#1a1a1a', flexShrink: 0 }}>
              {user.initials}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.3 }}>{user.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{user.role}</div>
            </div>
          </div>
        )}
        <button
          className="surta-sidebar-item"
          onClick={handleLogout}
          style={{ width: '100%', justifyContent: collapsed ? 'center' : undefined, padding: collapsed ? '10px 0' : '8px 4px' }}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute', top: 24, right: -12,
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--surta-green-700)', border: '2px solid var(--surta-green-900)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', zIndex: 10,
          transition: 'background 0.15s',
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
