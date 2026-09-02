import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  trialService, participantService, safetyService, ayurvedaService
} from '../../services';

const ROLE_ACCENT: Record<string, string> = {
  PI:          'rgba(181,138,42,0.15)',
  Coordinator: 'rgba(93,140,99,0.15)',
  Ethics:      'rgba(140,163,196,0.15)',
  Safety:      'rgba(155,62,42,0.12)',
};
const ROLE_TEXT: Record<string, string> = {
  PI:          '#9A7523',
  Coordinator: '#3D7A4F',
  Ethics:      '#4A6688',
  Safety:      '#9B3E2A',
};

const TYPE_LABEL: Record<string, string> = {
  Trial: 'Trial', Participant: 'Participant',
  'Adverse Event': 'AE', Formulation: 'Formula',
};

type SearchResult = { type: string; id: string; label: string; sublabel?: string; path: string; };

export function TopBar() {
  const { user } = useAuth();
  const { toggleNotificationPanel } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const run = async () => {
      const results: SearchResult[] = [];
      const trials = await trialService.getAll();
      trials.filter(t => t.trialId.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)).forEach(t => {
        results.push({ type: 'Trial', id: t.id, label: t.trialId, sublabel: t.shortTitle, path: `/trials/${t.id}` });
      });
      const participants = await participantService.getByTrial('trial-001');
      participants.filter(p => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)).slice(0, 4).forEach(p => {
        results.push({ type: 'Participant', id: p.id, label: p.id, sublabel: p.name, path: `/trials/trial-001/participants/${p.id}` });
      });
      const aes = await safetyService.getByTrial('trial-001');
      aes.filter(ae => ae.eventName.toLowerCase().includes(q) || ae.id.toLowerCase().includes(q)).slice(0, 3).forEach(ae => {
        results.push({ type: 'Adverse Event', id: ae.id, label: ae.id, sublabel: ae.eventName, path: '/trials/trial-001/safety' });
      });
      const forms = await ayurvedaService.searchFormulations(q);
      forms.slice(0, 2).forEach(f => {
        results.push({ type: 'Formulation', id: f.id, label: f.name, sublabel: f.afiCode, path: '/trials/trial-001/ayurveda' });
      });
      setSearchResults(results.slice(0, 8));
    };
    run();
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="sm-topbar">
      {/* Search */}
      <div ref={searchRef} className="sm-search-wrap">
        <Search
          size={14}
          style={{
            position: 'absolute', left: 11, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--sm-text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          className="sm-search-input"
          placeholder="Search trials, participants, AEs…"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
        />
        {searchOpen && searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'var(--sm-white)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden', zIndex: 100,
          }}>
            {searchResults.map((result, i) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                style={{
                  padding: '9px 14px',
                  cursor: 'pointer',
                  display: 'flex', gap: 10, alignItems: 'center',
                  borderBottom: i < searchResults.length - 1 ? '1px solid var(--border-color)' : 'none',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--sm-ivory)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <span style={{
                  fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em',
                  background: 'var(--sm-botanical)', color: 'var(--sm-forest-mid)',
                  padding: '2px 7px', borderRadius: 'var(--radius-xs)',
                  textTransform: 'uppercase', flexShrink: 0,
                }}>
                  {TYPE_LABEL[result.type] || result.type}
                </span>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--sm-text)', lineHeight: 1.3 }}>
                    {result.label}
                  </div>
                  {result.sublabel && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--sm-text-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {result.sublabel}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
        {/* Bell */}
        <button
          className="btn-icon"
          onClick={toggleNotificationPanel}
          title="Notifications"
          style={{ position: 'relative', color: 'var(--sm-text-soft)' }}
        >
          <Bell size={18} strokeWidth={1.75} />
          <span style={{
            position: 'absolute', top: 5, right: 5,
            width: 6, height: 6,
            borderRadius: '50%', background: 'var(--sm-critical)',
            border: '1.5px solid var(--sm-white)',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
        </button>

        {/* Thin separator */}
        <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />

        {/* User area */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            cursor: 'pointer',
            padding: '5px 8px',
            borderRadius: 'var(--radius-md)',
            transition: 'background var(--transition-fast)',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sm-ivory)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: ROLE_ACCENT[user.role] || 'var(--sm-botanical)',
              border: `1.5px solid ${ROLE_TEXT[user.role]}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.6875rem',
              color: ROLE_TEXT[user.role] || 'var(--sm-forest)',
              flexShrink: 0,
              letterSpacing: '0.03em',
            }}>
              {user.initials}
            </div>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontWeight: 500, fontSize: '0.8125rem', color: 'var(--sm-text)', lineHeight: 1.3 }}>
                {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--sm-text-muted)', marginTop: 1 }}>
                {user.role === 'PI' ? 'Principal Investigator' : user.role}
              </div>
            </div>
            <ChevronDown size={12} style={{ color: 'var(--sm-text-muted)' }} />
          </div>
        )}
      </div>
    </header>
  );
}
