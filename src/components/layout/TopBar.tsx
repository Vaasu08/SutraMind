import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  trialService, participantService, safetyService, ayurvedaService
} from '../../services';

const ROLE_COLORS: Record<string, string> = {
  PI: 'var(--surta-gold)',
  Coordinator: 'var(--surta-green-500)',
  Ethics: '#8CA3C4',
  Safety: 'var(--status-critical)',
};

type SearchResult = { type: string; id: string; label: string; sublabel?: string; path: string; };

export function TopBar() {
  const { user } = useAuth();
  const { toggleNotificationPanel, notificationPanelOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Global search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const run = async () => {
      const results: SearchResult[] = [];
      // Search trials
      const trials = await trialService.getAll();
      trials.filter(t => t.trialId.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)).forEach(t => {
        results.push({ type: 'Trial', id: t.id, label: t.trialId, sublabel: t.shortTitle, path: `/trials/${t.id}` });
      });
      // Search participants
      const participants = await participantService.getByTrial('trial-001');
      participants.filter(p => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)).slice(0, 4).forEach(p => {
        results.push({ type: 'Participant', id: p.id, label: p.id, sublabel: p.name, path: `/trials/trial-001/participants/${p.id}` });
      });
      // Search AEs
      const aes = await safetyService.getByTrial('trial-001');
      aes.filter(ae => ae.eventName.toLowerCase().includes(q) || ae.id.toLowerCase().includes(q)).slice(0, 3).forEach(ae => {
        results.push({ type: 'Adverse Event', id: ae.id, label: ae.id, sublabel: ae.eventName, path: '/trials/trial-001/safety' });
      });
      // Search formulations
      const forms = await ayurvedaService.searchFormulations(q);
      forms.slice(0, 2).forEach(f => {
        results.push({ type: 'Formulation', id: f.id, label: f.name, sublabel: f.afiCode, path: '/trials/trial-001/ayurveda' });
      });
      setSearchResults(results.slice(0, 8));
    };
    run();
  }, [searchQuery]);

  // Click outside to close search
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
    <header style={{
      height: 60, background: 'white',
      borderBottom: '1px solid var(--surta-green-100)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
      position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* Search */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--status-neutral)' }} />
          <input
            className="form-input"
            placeholder="Search trials, participants, AEs, formulations..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            style={{ paddingLeft: 36, paddingRight: 12, fontSize: '0.875rem', height: 38 }}
          />
        </div>
        {searchOpen && searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'white', border: '1px solid var(--surta-green-100)',
            borderRadius: 10, boxShadow: 'var(--shadow-card-hover)',
            marginTop: 4, overflow: 'hidden', zIndex: 100,
          }}>
            {searchResults.map(result => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surta-green-100)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <span style={{ fontSize: '0.75rem', background: 'var(--surta-green-100)', color: 'var(--surta-green-700)', padding: '2px 8px', borderRadius: 4, fontWeight: 600, flexShrink: 0 }}>
                  {result.type}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--surta-green-900)' }}>{result.label}</div>
                  {result.sublabel && <div style={{ fontSize: '0.8125rem', color: 'var(--status-neutral)' }}>{result.sublabel}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
        {/* Notification bell */}
        <button
          className="btn-icon"
          onClick={toggleNotificationPanel}
          style={{ position: 'relative' }}
          title="Notifications"
        >
          <Bell size={20} />
          <span style={{
            position: 'absolute', top: 4, right: 4, width: 8, height: 8,
            borderRadius: '50%', background: 'var(--status-critical)',
            border: '2px solid white',
          }} />
        </button>

        {/* User pill */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            background: 'var(--surta-ivory)',
            borderRadius: 8,
            border: '1px solid var(--surta-green-100)',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: ROLE_COLORS[user.role] || 'var(--surta-green-500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.75rem', color: user.role === 'PI' ? '#1a1a1a' : 'white',
            }}>
              {user.initials}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--surta-green-900)', lineHeight: 1.2 }}>{user.name.split(' ')[0]}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--status-neutral)', lineHeight: 1 }}>{user.role === 'PI' ? 'Principal Investigator' : user.role === 'Coordinator' ? 'Research Coordinator' : user.role === 'Ethics' ? 'Ethics Member' : 'Safety Officer'}</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--status-neutral)' }} />
          </div>
        )}
      </div>
    </header>
  );
}
