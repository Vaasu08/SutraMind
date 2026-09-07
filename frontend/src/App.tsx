import { FormEvent, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, useEffect, useState } from "react";
import {
  AlertCircle, ArrowLeft, Bell, CalendarDays, Check, ChevronRight, ClipboardCheck,
  ClipboardList, Globe2, Leaf, LayoutDashboard, LoaderCircle, LogOut, Menu,
  MessageCircleQuestion, Plus, Save, Search, ShieldCheck, Sprout, UserCog, Users, X
} from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ApiError, api, CRF, CurrentUser, Dashboard, DataQuery, Ethics, MasterTerm, Medicine, Participant, Role, Study, Visit } from "./api";
import "./saas.css";
import { SaasHeader } from "./components/saas/SaasHeader";
import { HomePage } from "./components/saas/HomePage";
import { SaasDashboardPage } from "./components/saas/SaasDashboardPage";
import { ProblemStatementPage } from "./components/saas/ProblemStatementPage";
import { ProgressPage } from "./components/saas/ProgressPage";
import { SaasFooter } from "./components/saas/SaasFooter";

type Language = "en" | "hi";
type Page = "dashboard" | "studies" | "participants" | "participant" | "visits" | "queries" | "ethics" | "admin";
type ViewMode = "saas" | "app";
type SaasPage = "home" | "dashboard" | "problem" | "progress";
type TranslationMap = Record<keyof typeof text.en, string>;

const text = {
  en: {
    dashboard: "Dashboard", studies: "Studies", participants: "Participants", visits: "Visits & CRF", queries: "Queries", ethics: "Ethics", admin: "Master Data", signOut: "Sign out",
    signIn: "Sign in", email: "Email address", password: "Password", welcome: "Evidence-led Ayurveda research, in one calm clinical workspace.",
    activeStudies: "Active studies", recruitment: "Recruitment", completedVisits: "Completed visits", openQueries: "Open queries", ethicsStatus: "Ethics status", adherence: "Treatment adherence",
    newStudy: "New study", enrollParticipant: "Enroll participant", scheduleVisit: "Schedule visit", saveDraft: "Save draft", completeCrf: "Complete CRF", language: "हिंदी",
    noData: "No data is available yet.", loading: "Loading your clinical workspace…", refresh: "Refresh", search: "Search participants, studies, visits…",
    prakriti: "Prakriti", vyadhi: "Vyadhi", agni: "Agni", bala: "Bala", satva: "Satva", anupana: "Anupana", submit: "Submit", cancel: "Cancel", next: "Next", previous: "Previous"
  },
  hi: {
    dashboard: "डैशबोर्ड", studies: "अध्ययन", participants: "प्रतिभागी", visits: "विज़िट और सीआरएफ", queries: "क्वेरी", ethics: "नैतिकता", admin: "मास्टर डेटा", signOut: "साइन आउट",
    signIn: "लॉग इन करें", email: "ईमेल पता", password: "पासवर्ड", welcome: "साक्ष्य-आधारित आयुर्वेद अनुसंधान के लिए एक सुव्यवस्थित क्लिनिकल कार्यक्षेत्र।",
    activeStudies: "सक्रिय अध्ययन", recruitment: "भर्ती", completedVisits: "पूर्ण विज़िट", openQueries: "खुली क्वेरी", ethicsStatus: "नैतिक स्थिति", adherence: "उपचार अनुपालन",
    newStudy: "नया अध्ययन", enrollParticipant: "प्रतिभागी जोड़ें", scheduleVisit: "विज़िट तय करें", saveDraft: "ड्राफ्ट सहेजें", completeCrf: "सीआरएफ पूरा करें", language: "EN",
    noData: "अभी कोई डेटा उपलब्ध नहीं है।", loading: "क्लिनिकल कार्यक्षेत्र लोड हो रहा है…", refresh: "रीफ़्रेश", search: "प्रतिभागी, अध्ययन, विज़िट खोजें…",
    prakriti: "प्रकृति", vyadhi: "व्याधि", agni: "अग्नि", bala: "बल", satva: "सत्व", anupana: "अनुपान", submit: "जमा करें", cancel: "रद्द", next: "आगे", previous: "पीछे"
  }
} as const;

const roleLabel: Record<Role, string> = { ADMIN: "Administrator", PI: "Principal Investigator", COORDINATOR: "Study Coordinator", MONITOR: "Monitor", ETHICS: "Ethics Committee", PV: "Pharmacovigilance" };
const pieColors = ["#0a8b79", "#397fb5", "#d79d35", "#7db252", "#dd8354", "#8eabb0", "#7453a5"];

function today() { return new Date().toISOString().slice(0, 10); }
function formatDate(value?: string | null) { return value ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "—"; }
function initials(name: string) { return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }

function useTermLabel(terms: MasterTerm[], language: Language) {
  return (code?: string | null) => {
    if (!code) return "—";
    const term = terms.find((item) => item.code === code);
    return term ? `${term.label_en}${language === "hi" ? ` (${term.label_hi})` : ""}` : code;
  };
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("sutramind_token") ?? "");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("sutramind_language") as Language) ?? "en");
  const [viewMode, setViewMode] = useState<ViewMode>("saas");
  const [saasPage, setSaasPage] = useState<SaasPage>("home");
  const [page, setPage] = useState<Page>("dashboard");
  const [studies, setStudies] = useState<Study[]>([]);
  const [terms, setTerms] = useState<MasterTerm[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [queries, setQueries] = useState<DataQuery[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [selectedStudyId, setSelectedStudyId] = useState("");
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const t = text[language];
  const term = useTermLabel(terms, language);

  const toggleLanguage = () => setLanguage((current) => {
    const next = current === "en" ? "hi" : "en";
    localStorage.setItem("sutramind_language", next);
    return next;
  });

  const signOut = () => {
    localStorage.removeItem("sutramind_token");
    setToken(""); setUser(null); setStudies([]); setParticipants([]); setQueries([]); setDashboard(null); setPage("dashboard");
    setViewMode("saas");
  };

  const refresh = async (overrideStudyId?: string) => {
    if (!token || !user) return;
    setIsLoading(true); setError("");
    const studyFilter = overrideStudyId ?? selectedStudyId;
    try {
      const [studyData, dashboardData] = await Promise.all([api.studies(token), canDashboard(user.role) ? api.dashboard(token, studyFilter || undefined) : Promise.resolve(null)]);
      setStudies(studyData);
      if (!studyFilter && studyData.length && !selectedStudyId) setSelectedStudyId(studyData[0].id);
      setDashboard(dashboardData);
      const dataTasks: Promise<void>[] = [];
      if (canTerms(user.role)) dataTasks.push(api.terms(token).then(setTerms), api.medicines(token).then(setMedicines));
      if (canParticipants(user.role)) dataTasks.push(api.participants(token, studyFilter || undefined).then(setParticipants));
      if (canQueries(user.role)) dataTasks.push(api.queries(token, studyFilter || undefined).then(setQueries));
      await Promise.all(dataTasks);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) signOut();
      else setError(cause instanceof Error ? cause.message : "Unable to load the workspace.");
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (!token) return;
    api.me(token).then((me) => { setUser(me); setPage(me.role === "ETHICS" ? "ethics" : "dashboard"); }).catch(signOut);
  }, [token]);

  useEffect(() => { if (user) void refresh(); /* selected study controls all contextual data */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedStudyId]);

  const handleLogin = (newToken: string) => {
    localStorage.setItem("sutramind_token", newToken);
    setToken(newToken);
    setViewMode("app");
  };
  const navigateParticipant = (participantId: string) => { setSelectedParticipantId(participantId); setPage("participant"); };

  // SaaS Website Mode
  if (viewMode === "saas") {
    return (
      <div className="saas-wrapper">
        <SaasHeader
          activePage={saasPage}
          onNavigate={setSaasPage}
          onLaunchApp={() => setViewMode("app")}
          lang={language}
          onToggleLang={toggleLanguage}
          isAuthenticated={Boolean(token && user)}
        />
        {saasPage === "home" && <HomePage onNavigate={setSaasPage} onLaunchApp={() => setViewMode("app")} lang={language} />}
        {saasPage === "dashboard" && <SaasDashboardPage onLaunchApp={() => setViewMode("app")} lang={language} />}
        {saasPage === "problem" && <ProblemStatementPage onLaunchApp={() => setViewMode("app")} lang={language} />}
        {saasPage === "progress" && <ProgressPage onLaunchApp={() => setViewMode("app")} lang={language} />}
        <SaasFooter onNavigate={setSaasPage} onLaunchApp={() => setViewMode("app")} lang={language} />
      </div>
    );
  }

  // Clinical Application Mode
  if (!token || !user) {
    return (
      <>
        <div className="saas-app-return-bar">
          <span>🌿 SutraMind CTMS Platform • Clinical Research Sign-In</span>
          <button className="saas-app-return-btn" onClick={() => setViewMode("saas")}>
            ← Return to Public SaaS Website
          </button>
        </div>
        <Login language={language} toggleLanguage={toggleLanguage} onLogin={handleLogin} onReturnToSaas={() => setViewMode("saas")} />
      </>
    );
  }

  if (isLoading && !dashboard && !studies.length) return <LoadingScreen language={language} />;

  const selectedStudy = studies.find((study) => study.id === selectedStudyId) ?? studies[0];
  const nav = navItems(user.role, t);
  return (
    <>
      <div className="saas-app-return-bar">
        <span>🌿 SutraMind Clinical Research Workspace • {roleLabel[user.role]} ({user.name})</span>
        <button className="saas-app-return-btn" onClick={() => setViewMode("saas")}>
          ← Return to Public SaaS Website
        </button>
      </div>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand-wrap"><img src="/brand/sutramind-logo.png" alt="SutraMind — Smart CTMS for Ayurveda" /></div>
          <div className="sidebar-label">Clinical research workspace</div>
          <nav>
            {nav.map((item) => <button key={item.page} onClick={() => setPage(item.page)} className={`nav-item ${page === item.page || (item.page === "participants" && page === "participant") ? "active" : ""}`}><item.icon size={18} /><span>{item.label}</span></button>)}
            <button
              onClick={() => setViewMode("saas")}
              className="nav-item"
              style={{ marginTop: "16px", borderTop: "1px solid rgba(15, 89, 83, 0.15)", paddingTop: "12px", color: "var(--saas-gold-dark)" }}
            >
              <Globe2 size={18} />
              <span>SaaS Website</span>
            </button>
          </nav>
          <div className="sidebar-quote"><Leaf size={16} /><p>Tradition, structured for evidence.</p></div>
        </aside>
        <main className="main-workspace">
          <header className="top-header">
            <button className="icon-button mobile-menu" aria-label="Open menu"><Menu size={21} /></button>
            <div className="search-box"><Search size={17} /><span>{t.search}</span></div>
            <div className="header-actions"><button className="language-switch" onClick={toggleLanguage}><Globe2 size={16} /> {t.language}</button><button className="icon-button" aria-label="Notifications"><Bell size={18} /></button><div className="avatar">{initials(user.name)}</div><div className="profile-summary"><strong>{user.name}</strong><span>{roleLabel[user.role]}</span></div><button className="icon-button" onClick={signOut} aria-label={t.signOut}><LogOut size={18} /></button></div>
          </header>
          <section className="content">
            {error && <div className="alert error"><AlertCircle size={18} /><span>{error}</span><button onClick={() => void refresh()}>{t.refresh}</button></div>}
            {page === "dashboard" && <DashboardPage dashboard={dashboard} studies={studies} selectedStudyId={selectedStudy?.id ?? ""} setSelectedStudyId={setSelectedStudyId} language={language} term={term} t={t} isLoading={isLoading} onNavigate={(next) => setPage(next)} />}
            {page === "studies" && <StudiesPage token={token} user={user} studies={studies} terms={terms} medicines={medicines} language={language} term={term} onCreated={() => void refresh()} />}
            {page === "participants" && <ParticipantsPage token={token} user={user} studies={studies} participants={participants} terms={terms} language={language} term={term} selectedStudyId={selectedStudy?.id ?? ""} setSelectedStudyId={setSelectedStudyId} onRefresh={() => void refresh()} onOpen={navigateParticipant} />}
            {page === "participant" && <ParticipantProfilePage token={token} user={user} participantId={selectedParticipantId || participants[0]?.id} terms={terms} medicines={medicines} language={language} term={term} onBack={() => setPage("participants")} onVisit={() => setPage("visits")} onRefresh={() => void refresh()} />}
            {page === "visits" && <VisitsCrfPage token={token} user={user} participantId={selectedParticipantId || participants[0]?.id} terms={terms} medicines={medicines} language={language} term={term} onOpenParticipant={() => setPage("participant")} onRefresh={() => void refresh()} />}
            {page === "queries" && <QueriesPage token={token} user={user} queries={queries} language={language} onRefresh={() => void refresh()} />}
            {page === "ethics" && <EthicsPage token={token} user={user} study={selectedStudy} language={language} onRefresh={() => void refresh()} />}
            {page === "admin" && <AdminPage token={token} terms={terms} language={language} onRefresh={() => void refresh()} />}
          </section>
        </main>
      </div>
    </>
  );
}

function canDashboard(role: Role) { return ["ADMIN", "PI", "COORDINATOR", "MONITOR", "PV"].includes(role); }
function canTerms(role: Role) { return ["ADMIN", "PI", "COORDINATOR", "MONITOR"].includes(role); }
function canParticipants(role: Role) { return ["ADMIN", "PI", "COORDINATOR", "MONITOR"].includes(role); }
function canQueries(role: Role) { return ["ADMIN", "PI", "COORDINATOR", "MONITOR"].includes(role); }

function navItems(role: Role, t: TranslationMap): { page: Page; label: string; icon: typeof LayoutDashboard }[] {
  const items: { page: Page; label: string; icon: typeof LayoutDashboard }[] = [{ page: "studies", label: t.studies, icon: ClipboardList }];
  if (canDashboard(role)) items.unshift({ page: "dashboard", label: t.dashboard, icon: LayoutDashboard });
  if (canParticipants(role)) items.push({ page: "participants", label: t.participants, icon: Users }, { page: "visits", label: t.visits, icon: ClipboardCheck });
  if (canQueries(role)) items.push({ page: "queries", label: t.queries, icon: MessageCircleQuestion });
  if (["ADMIN", "PI", "ETHICS", "PV"].includes(role)) items.push({ page: "ethics", label: t.ethics, icon: ShieldCheck });
  if (role === "ADMIN") items.push({ page: "admin", label: t.admin, icon: UserCog });
  return items;
}

function LoadingScreen({ language }: { language: Language }) { return <div className="loading-screen"><img src="/brand/sutramind-logo.png" alt="SutraMind" /><LoaderCircle className="spin" /><p>{text[language].loading}</p></div>; }

function Login({ language, toggleLanguage, onLogin, onReturnToSaas }: { language: Language; toggleLanguage: () => void; onLogin: (token: string) => void; onReturnToSaas?: () => void }) {
  const t = text[language];
  const [email, setEmail] = useState("pi@sutramind.local");
  const [password, setPassword] = useState("Demo@123");
  const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setPending(true); setError("");
    try { const response = await api.login(email, password); onLogin(response.access_token); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to sign in"); }
    finally { setPending(false); }
  };

  const demoAccounts = [
    { role: "PI", email: "pi@sutramind.local", label: "Principal Investigator" },
    { role: "Coordinator", email: "coordinator@sutramind.local", label: "Study Coordinator" },
    { role: "Monitor", email: "monitor@sutramind.local", label: "Monitor (CRA)" },
    { role: "Ethics", email: "ethics@sutramind.local", label: "Ethics Committee" },
    { role: "Admin", email: "admin@sutramind.local", label: "Administrator" },
    { role: "PV", email: "pv@sutramind.local", label: "Pharmacovigilance" },
  ];

  return <div className="login-page">
    <section className="login-identity"><div className="botanical-orb orb-one" /><div className="botanical-orb orb-two" /><img src="/brand/sutramind-logo.png" alt="SutraMind — Smart CTMS for Ayurveda" /><div className="identity-copy"><Sprout size={22} /><h1>Smart CTMS for Ayurveda</h1><p>{t.welcome}</p></div><blockquote>“सर्वे भवन्तु सुखिनः”<span>Let research bring wellness to all.</span></blockquote></section>
    <section className="login-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "440px", marginBottom: "12px" }}>
        {onReturnToSaas && (
          <button type="button" onClick={onReturnToSaas} style={{ background: "none", border: "none", color: "var(--primary-color)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
            ← Back to SaaS Website
          </button>
        )}
        <button className="language-switch login-language" onClick={toggleLanguage}><Globe2 size={16} /> {t.language}</button>
      </div>
      <div className="login-card">
        <div className="leaf-seal"><Leaf /></div>
        <h2>{t.signIn}</h2>
        <p>Select any clinical demo role below for instant pre-fill:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
          {demoAccounts.map((acc) => (
            <button
              key={acc.role}
              type="button"
              onClick={() => { setEmail(acc.email); setPassword("Demo@123"); }}
              style={{
                background: email === acc.email ? "var(--primary-color)" : "rgba(15, 89, 83, 0.08)",
                color: email === acc.email ? "#ffffff" : "var(--primary-color)",
                border: "1px solid rgba(15, 89, 83, 0.2)",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {acc.role}
            </button>
          ))}
        </div>
        <form onSubmit={submit}>
          <Field label={t.email}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Field label={t.password}><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button full" disabled={pending}>{pending ? "Signing in…" : <><ShieldCheck size={17} /> {t.signIn}</>}</button>
        </form>
        <div className="demo-hint" style={{ marginTop: "12px" }}><strong>Password:</strong> `Demo@123` across all roles</div>
      </div>
    </section>
  </div>;
}

function DashboardPage({ dashboard, studies, selectedStudyId, setSelectedStudyId, language, term, t, isLoading, onNavigate }: { dashboard: Dashboard | null; studies: Study[]; selectedStudyId: string; setSelectedStudyId: (value: string) => void; language: Language; term: (code?: string | null) => string; t: TranslationMap; isLoading: boolean; onNavigate: (page: Page) => void }) {
  const prakriti = Object.entries(dashboard?.prakriti_distribution ?? {}).map(([name, value]) => ({ name: term(name), value }));
  const vyadhi = Object.entries(dashboard?.vyadhi_distribution ?? {}).map(([name, value]) => ({ name: term(name), value }));
  return <>
    <PageHeading icon={<LayoutDashboard />} title={t.dashboard} description={language === "hi" ? "आयुर्वेदिक क्लिनिकल अनुसंधान का वर्तमान सारांश" : "A calm overview of your Ayurveda clinical research."} action={<select className="study-filter" value={selectedStudyId} onChange={(e) => setSelectedStudyId(e.target.value)}><option value="">All accessible studies</option>{studies.map((study) => <option value={study.id} key={study.id}>{study.study_code}</option>)}</select>} />
    <div className="stats-grid"><StatCard icon={<ClipboardList />} label={t.activeStudies} value={dashboard?.active_studies ?? 0} accent="teal" /><StatCard icon={<Users />} label={t.recruitment} value={`${dashboard?.total_participants ?? 0} / ${dashboard?.recruitment_target ?? 0}`} accent="blue" /><StatCard icon={<CalendarDays />} label={t.completedVisits} value={dashboard?.completed_visits ?? 0} caption={`${dashboard?.visit_completion_rate ?? 0}% on time`} accent="orange" /><StatCard icon={<MessageCircleQuestion />} label={t.openQueries} value={dashboard?.open_queries ?? 0} caption="Require review" accent="red" /><StatCard icon={<ShieldCheck />} label={t.ethicsStatus} value={dashboard?.ethics_status ?? "—"} caption={`${dashboard?.ethics_approved ?? 0} approved`} accent="green" /></div>
    <div className="dashboard-grid">
      <ClinicalCard className="recruitment-card" title="Recruitment progress" subtitle="Participants enrolled against study target"><div className="metric-line"><strong>{dashboard?.total_participants ?? 0} / {dashboard?.recruitment_target ?? 0}</strong><span>{dashboard?.recruitment_target ? Math.round(((dashboard.total_participants / dashboard.recruitment_target) * 100)) : 0}%</span></div><div className="progress"><span style={{ width: `${dashboard?.recruitment_target ? Math.min((dashboard.total_participants / dashboard.recruitment_target) * 100, 100) : 0}%` }} /></div><button className="text-link" onClick={() => onNavigate("participants")}>View participants <ChevronRight size={15} /></button></ClinicalCard>
      <ChartCard title="Prakriti distribution" subtitle="Ayurvedic constitutional types" empty={!prakriti.length}><ResponsiveContainer width="100%" height={210}><PieChart><Pie data={prakriti} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={2}>{prakriti.map((entry, index) => <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><ChartLegend items={prakriti} /></ChartCard>
      <ChartCard title="Vyadhi distribution" subtitle="Primary Ayurveda indications" empty={!vyadhi.length}><ResponsiveContainer width="100%" height={230}><BarChart data={vyadhi} layout="vertical" margin={{ left: 14 }}><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="value" fill="#0a8b79" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></ChartCard>
      <ClinicalCard title={t.adherence} subtitle="Completed CRFs reporting medicine compliance"><div className="adherence-display"><div className="adherence-ring" style={{ background: `conic-gradient(#0a8b79 ${(dashboard?.medicine_adherence ?? 0) * 3.6}deg, #e3eee8 0deg)` }}><div><strong>{dashboard?.medicine_adherence ?? 0}%</strong><span>Compliant</span></div></div><div><p>Compliance is calculated only from completed CRFs.</p><button className="text-link" onClick={() => onNavigate("visits")}>Open CRFs <ChevronRight size={15} /></button></div></div></ClinicalCard>
      <ClinicalCard className="insight-card" title="Ayurveda insight" subtitle="Evidence from structured observations"><div className="insight-leaf"><Leaf size={38} /></div><p>{prakriti.length ? `${prakriti[0].name} is currently the most represented Prakriti in this view.` : t.noData}</p><div className="quote-mini">“Knowledge rooted in tradition, structured for research.”</div></ClinicalCard>
    </div>
    {isLoading && <div className="inline-loading"><LoaderCircle className="spin" size={16} /> Updating dashboard…</div>}
  </>;
}

function ChartCard({ title, subtitle, empty, children }: { title: string; subtitle: string; empty: boolean; children: ReactNode }) { return <ClinicalCard title={title} subtitle={subtitle} className="chart-card">{empty ? <EmptyState compact /> : children}</ClinicalCard>; }
function ChartLegend({ items }: { items: { name: string; value: number }[] }) { return <div className="chart-legend">{items.map((item, index) => <span key={item.name}><i style={{ background: pieColors[index % pieColors.length] }} />{item.name} <b>{item.value}</b></span>)}</div>; }
function StatCard({ icon, label, value, caption, accent }: { icon: ReactNode; label: string; value: string | number; caption?: string; accent: string }) { return <div className="stat-card"><span className={`stat-icon ${accent}`}>{icon}</span><div><span>{label}</span><strong>{value}</strong>{caption && <small>{caption}</small>}</div></div>; }

function PageHeading({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) { return <div className="page-heading"><div className="page-title"><span className="page-icon">{icon}</span><div><h1>{title}</h1><p>{description}</p></div></div>{action && <div className="page-action">{action}</div>}</div>; }
function ClinicalCard({ title, subtitle, children, className = "" }: { title?: string; subtitle?: string; children: ReactNode; className?: string }) { return <section className={`clinical-card ${className}`}>{title && <header className="card-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></header>}{children}</section>; }
function EmptyState({ compact = false }: { compact?: boolean }) { return <div className={`empty-state ${compact ? "compact" : ""}`}><Sprout size={compact ? 24 : 36} /><p>No records to display yet.</p></div>; }
function StatusBadge({ value }: { value?: string | null }) { const normalized = (value ?? "unknown").toLowerCase().replaceAll("_", "-"); return <span className={`status-badge ${normalized}`}>{value?.replaceAll("_", " ") ?? "—"}</span>; }
function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) { return <div className="modal-layer" role="dialog" aria-modal="true"><div className="modal"><header><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></header><div className="modal-body">{children}</div></div></div>; }
function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) { return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }
function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} />; }
function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) { return <select {...props}>{children}</select>; }

function StudiesPage({ token, user, studies, terms, medicines, language, term, onCreated }: { token: string; user: CurrentUser; studies: Study[]; terms: MasterTerm[]; medicines: Medicine[]; language: Language; term: (code?: string | null) => string; onCreated: () => void }) {
  const [showCreate, setShowCreate] = useState(false);
  const canCreate = user.role === "PI" || user.role === "ADMIN";
  return <>
    <PageHeading icon={<ClipboardList />} title={text[language].studies} description={language === "hi" ? "आयुर्वेदिक क्लिनिकल अध्ययन और प्रोटोकॉल व्यवस्थित करें।" : "Design, configure, and follow Ayurveda clinical studies with scientific rigour."} action={canCreate ? <button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={17} /> {text[language].newStudy}</button> : undefined} />
    <ClinicalCard title={`Studies (${studies.length})`} subtitle="Protocol, Ayurveda metadata, site context, and recruitment target in one record.">
      {studies.length ? <div className="table-scroll"><table><thead><tr><th>Study code</th><th>Title</th><th>Ayurvedic Vyadhi</th><th>Status</th><th>Dates</th><th>Participants</th></tr></thead><tbody>{studies.map((study) => <tr key={study.id}><td><strong>{study.study_code}</strong></td><td><span className="table-title">{study.title}</span><small>{study.institution}</small></td><td>{study.protocol ? term(study.protocol.vyadhi_code) : "—"}</td><td><StatusBadge value={study.status} /></td><td>{formatDate(study.start_date)}<small>to {formatDate(study.end_date)}</small></td><td>{study.participant_count} / {study.sample_size}</td></tr>)}</tbody></table></div> : <EmptyState />}
    </ClinicalCard>
    {showCreate && <StudyWizard token={token} user={user} terms={terms} medicines={medicines} language={language} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); onCreated(); }} />}
  </>;
}

function StudyWizard({ token, user, terms, medicines, onClose, onCreated }: { token: string; user: CurrentUser; terms: MasterTerm[]; medicines: Medicine[]; language?: Language; onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState(1); const [pending, setPending] = useState(false); const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", short_title: "", study_code: "", institution: "", trial_phase: "Phase II", sample_size: "120", start_date: today(), end_date: "", ctri_number: "", modern_diagnosis: "", vyadhi_code: "V001", intervention_name: "", medicine_id: medicines[0]?.id ?? "", dosage_form_code: "DF01", anupana_code: "AN01", treatment_duration_days: "90", summary: "", iec_number: "", ethics_status: "PENDING", approval_date: "", expiry_date: "", remarks: "", site_code: "SITE-01", site_name: "", site_address: "" });
  const edit = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const options = (category: string) => terms.filter((item) => item.category === category && item.active);
  const next = () => {
    if (step === 1 && (!form.title || !form.study_code || !form.institution || !form.end_date)) return setError("Complete the required basic study fields.");
    if (step === 3 && (!form.modern_diagnosis || !form.intervention_name)) return setError("Complete all Ayurveda protocol fields.");
    if (step === 4 && !form.iec_number) return setError("IEC number is required for the Phase 1 ethics record.");
    if (step === 5 && (!form.site_code || !form.site_name)) return setError("At least one study site is required.");
    setError(""); setStep((current) => Math.min(current + 1, 6));
  };
  const submit = async () => {
    setPending(true); setError("");
    try {
      await api.createStudy(token, {
        study_code: form.study_code, title: form.title, short_title: form.short_title || null, pi_id: user.role === "PI" ? user.id : undefined,
        institution: form.institution, trial_phase: form.trial_phase, sample_size: Number(form.sample_size), start_date: form.start_date, end_date: form.end_date, ctri_number: form.ctri_number || null,
        protocol: { version: "1.0", modern_diagnosis: form.modern_diagnosis, vyadhi_code: form.vyadhi_code, intervention_name: form.intervention_name, medicine_id: form.medicine_id || null, dosage_form_code: form.dosage_form_code, anupana_code: form.anupana_code, treatment_duration_days: Number(form.treatment_duration_days), summary: form.summary || null },
        ethics: { iec_number: form.iec_number, status: form.ethics_status, approval_date: form.approval_date || null, expiry_date: form.expiry_date || null, remarks: form.remarks || null },
        sites: [{ site_code: form.site_code.toUpperCase(), name: form.site_name, address: form.site_address || null }], memberships: []
      }); onCreated();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to create study."); } finally { setPending(false); }
  };
  const steps = ["Basic information", "Protocol details", "Ayurveda specifics", "Ethics & regulatory", "Sites & team", "Review & submit"];
  return <Modal title="Create new Ayurveda study" onClose={onClose}><div className="wizard"><aside>{steps.map((label, index) => <button key={label} onClick={() => index + 1 < step && setStep(index + 1)} className={step === index + 1 ? "current" : step > index + 1 ? "complete" : ""}><span>{index + 1}</span>{label}</button>)}</aside><section className="wizard-content">
    <div className="wizard-step-label">Step {step} of 6</div>
    {step === 1 && <div className="form-grid two"><Field label="Study title *"><Input value={form.title} onChange={(e) => edit("title", e.target.value)} /></Field><Field label="Short title"><Input value={form.short_title} onChange={(e) => edit("short_title", e.target.value)} /></Field><Field label="Study code *" hint="Uppercase letters, numerals, and hyphens only"><Input value={form.study_code} onChange={(e) => edit("study_code", e.target.value.toUpperCase())} /></Field><Field label="Institution *"><Input value={form.institution} onChange={(e) => edit("institution", e.target.value)} /></Field><Field label="Trial phase"><Select value={form.trial_phase} onChange={(e) => edit("trial_phase", e.target.value)}><option>Phase I</option><option>Phase II</option><option>Phase III</option><option>Phase IV</option><option>Observational</option></Select></Field><Field label="Target sample size *"><Input type="number" min="1" value={form.sample_size} onChange={(e) => edit("sample_size", e.target.value)} /></Field><Field label="Start date *"><Input type="date" value={form.start_date} onChange={(e) => edit("start_date", e.target.value)} /></Field><Field label="End date *"><Input type="date" value={form.end_date} onChange={(e) => edit("end_date", e.target.value)} /></Field><Field label="CTRI number (optional)"><Input value={form.ctri_number} onChange={(e) => edit("ctri_number", e.target.value)} /></Field></div>}
    {step === 2 && <div className="form-grid"><Field label="Protocol version"><Input value="1.0" disabled /></Field><Field label="Protocol overview"><textarea value={form.summary} onChange={(e) => edit("summary", e.target.value)} placeholder="Brief objective, background, and clinical approach for this Phase 1 prototype." rows={7} /></Field></div>}
    {step === 3 && <div className="form-grid two"><Field label="Ayurvedic Vyadhi *"><Select value={form.vyadhi_code} onChange={(e) => { edit("vyadhi_code", e.target.value); const selected = options("VYADHI").find((item) => item.code === e.target.value); if (selected?.modern_mapping_en) edit("modern_diagnosis", selected.modern_mapping_en); }}>{options("VYADHI").map((item) => <option key={item.code} value={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field><Field label="Modern diagnosis *"><Input value={form.modern_diagnosis} onChange={(e) => edit("modern_diagnosis", e.target.value)} /></Field><Field label="Intervention / formulation *"><Input value={form.intervention_name} onChange={(e) => edit("intervention_name", e.target.value)} /></Field><Field label="Medicine master"><Select value={form.medicine_id} onChange={(e) => edit("medicine_id", e.target.value)}><option value="">Select formulation</option>{medicines.map((medicine) => <option key={medicine.id} value={medicine.id}>{medicine.ayurveda_name}</option>)}</Select></Field><Field label="Dosage form *"><Select value={form.dosage_form_code} onChange={(e) => edit("dosage_form_code", e.target.value)}>{options("DOSAGE_FORM").map((item) => <option key={item.code} value={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field><Field label="Anupana *"><Select value={form.anupana_code} onChange={(e) => edit("anupana_code", e.target.value)}>{options("ANUPANA").map((item) => <option key={item.code} value={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field><Field label="Treatment duration (days) *"><Input type="number" min="1" value={form.treatment_duration_days} onChange={(e) => edit("treatment_duration_days", e.target.value)} /></Field></div>}
    {step === 4 && <div className="form-grid two"><Field label="IEC number *"><Input value={form.iec_number} onChange={(e) => edit("iec_number", e.target.value)} /></Field><Field label="Ethics status"><Select value={form.ethics_status} onChange={(e) => edit("ethics_status", e.target.value)}><option value="PENDING">Pending</option><option value="SUBMITTED">Submitted</option><option value="APPROVED">Approved</option></Select></Field><Field label="Approval date"><Input type="date" value={form.approval_date} onChange={(e) => edit("approval_date", e.target.value)} /></Field><Field label="Expiry date"><Input type="date" value={form.expiry_date} onChange={(e) => edit("expiry_date", e.target.value)} /></Field><Field label="Ethics remarks"><textarea rows={4} value={form.remarks} onChange={(e) => edit("remarks", e.target.value)} /></Field></div>}
    {step === 5 && <div className="form-grid two"><Field label="Site code *"><Input value={form.site_code} onChange={(e) => edit("site_code", e.target.value.toUpperCase())} /></Field><Field label="Site name *"><Input value={form.site_name} onChange={(e) => edit("site_name", e.target.value)} placeholder="AIIA, New Delhi" /></Field><Field label="Site address"><textarea rows={3} value={form.site_address} onChange={(e) => edit("site_address", e.target.value)} /></Field><div className="info-note"><Users size={18} /><p>Team membership is assigned by Admin in the deployment workflow. The PI is automatically linked to this study.</p></div></div>}
    {step === 6 && <div className="review-summary"><h3>{form.title || "Untitled study"}</h3><p><strong>{form.study_code}</strong> · {form.trial_phase} · Target {form.sample_size}</p><div><span>Vyadhi</span><strong>{options("VYADHI").find((item) => item.code === form.vyadhi_code)?.label_en}</strong><span>Intervention</span><strong>{form.intervention_name}</strong><span>Ethics</span><strong>{form.iec_number} — {form.ethics_status}</strong><span>Site</span><strong>{form.site_name}</strong></div></div>}
    {error && <div className="form-error">{error}</div>}<footer className="wizard-footer"><button className="secondary-button" onClick={() => step === 1 ? onClose() : setStep((current) => current - 1)}>{step === 1 ? "Cancel" : "Previous"}</button>{step < 6 ? <button className="primary-button" onClick={next}>Next <ChevronRight size={16} /></button> : <button className="primary-button" disabled={pending} onClick={submit}><Save size={16} /> {pending ? "Creating…" : "Create study"}</button>}</footer>
  </section></div></Modal>;
}

function ParticipantsPage({ token, user, studies, participants, terms, language, term, selectedStudyId, setSelectedStudyId, onRefresh, onOpen }: { token: string; user: CurrentUser; studies: Study[]; participants: Participant[]; terms: MasterTerm[]; language: Language; term: (code?: string | null) => string; selectedStudyId: string; setSelectedStudyId: (value: string) => void; onRefresh: () => void; onOpen: (id: string) => void }) {
  const [showEnroll, setShowEnroll] = useState(false); const [filter, setFilter] = useState("");
  const visible = participants.filter((participant) => [participant.participant_code, participant.modern_diagnosis, participant.name, term(participant.vyadhi_code)].join(" ").toLowerCase().includes(filter.toLowerCase()));
  return <>
    <PageHeading icon={<Users />} title={text[language].participants} description={language === "hi" ? "संरचित आयुर्वेदिक आकलन के साथ प्रतिभागियों को दर्ज करें और ट्रैक करें।" : "Enroll, track, and understand participants with structured Ayurveda assessment."} action={user.role === "COORDINATOR" ? <button className="primary-button" onClick={() => setShowEnroll(true)}><Plus size={17} /> {text[language].enrollParticipant}</button> : undefined} />
    <ClinicalCard><div className="toolbar"><div className="tabs"><button className="selected">All ({participants.length})</button><button>Enrolled ({participants.filter((item) => item.status === "ENROLLED").length})</button><button>Submitted ({participants.filter((item) => item.status === "SUBMITTED").length})</button></div><div className="toolbar-controls"><input className="table-search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by code, diagnosis, Vyadhi…" /><select value={selectedStudyId} onChange={(e) => setSelectedStudyId(e.target.value)}><option value="">All studies</option>{studies.map((study) => <option key={study.id} value={study.id}>{study.study_code}</option>)}</select></div></div>{visible.length ? <div className="table-scroll"><table><thead><tr><th>Participant ID</th><th>Age</th><th>Gender</th><th>Modern diagnosis</th><th>Ayurvedic Vyadhi</th><th>Enrollment</th><th>Status</th><th /></tr></thead><tbody>{visible.map((participant) => <tr key={participant.id}><td><strong>{participant.participant_code}</strong><small>{participant.site_name}</small></td><td>{participant.age}</td><td>{participant.gender[0]}</td><td>{participant.modern_diagnosis}</td><td>{term(participant.vyadhi_code)}</td><td>{formatDate(participant.enrollment_date)}</td><td><StatusBadge value={participant.status} /></td><td><button className="row-action" onClick={() => onOpen(participant.id)}>Open <ChevronRight size={15} /></button></td></tr>)}</tbody></table></div> : <EmptyState />}</ClinicalCard>
    {showEnroll && <EnrollmentForm token={token} user={user} studies={studies} selectedStudyId={selectedStudyId} terms={terms} language={language} onClose={() => setShowEnroll(false)} onCreated={() => { setShowEnroll(false); onRefresh(); }} />}
  </>;
}

function EnrollmentForm({ token, studies, selectedStudyId, terms, language, onClose, onCreated }: { token: string; user?: CurrentUser; studies: Study[]; selectedStudyId: string; terms: MasterTerm[]; language: Language; onClose: () => void; onCreated: () => void }) {
  const initialStudy = selectedStudyId || studies[0]?.id || ""; const [studyId, setStudyId] = useState(initialStudy); const [study, setStudy] = useState<Study | null>(null); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  const [form, setForm] = useState({ participant_code: "", name: "", age: "", gender: "FEMALE", modern_diagnosis: "", vyadhi_code: "V001", disease_duration_months: "", randomization_id: "", enrollment_date: today(), site_id: "", prakriti_code: "P6", agni_code: "A2", bala_code: "B2", satva_code: "S2", vikriti_notes: "" });
  useEffect(() => { if (studyId) api.study(token, studyId).then((item) => { setStudy(item); setForm((current) => ({ ...current, site_id: item.sites?.[0]?.id ?? "", modern_diagnosis: item.protocol?.modern_diagnosis ?? current.modern_diagnosis, vyadhi_code: item.protocol?.vyadhi_code ?? current.vyadhi_code })); }).catch((cause) => setError(cause.message)); }, [studyId, token]);
  const options = (category: string) => terms.filter((item) => item.category === category && item.active);
  const edit = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => { event.preventDefault(); setPending(true); setError(""); try { await api.createParticipant(token, { ...form, study_id: studyId, age: Number(form.age), disease_duration_months: form.disease_duration_months ? Number(form.disease_duration_months) : null, baseline: { prakriti_code: form.prakriti_code, agni_code: form.agni_code, bala_code: form.bala_code, satva_code: form.satva_code, vikriti_notes: form.vikriti_notes || null } }); onCreated(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to enroll participant."); } finally { setPending(false); } };
  return <Modal title="Enroll participant" onClose={onClose}><form onSubmit={submit} className="sectioned-form"><div className="form-section"><h3><span>1</span> Demographics</h3><div className="form-grid two"><Field label="Participant ID *"><Input value={form.participant_code} onChange={(e) => edit("participant_code", e.target.value.toUpperCase())} required /></Field><Field label="Name *"><Input value={form.name} onChange={(e) => edit("name", e.target.value)} required /></Field><Field label="Age *"><Input type="number" min="0" max="120" value={form.age} onChange={(e) => edit("age", e.target.value)} required /></Field><Field label="Gender *"><Select value={form.gender} onChange={(e) => edit("gender", e.target.value)}><option value="FEMALE">Female</option><option value="MALE">Male</option><option value="OTHER">Other</option><option value="PREFER_NOT_TO_SAY">Prefer not to say</option></Select></Field></div></div><div className="form-section"><h3><span>2</span> Clinical and trial context</h3><div className="form-grid two"><Field label="Study *"><Select value={studyId} onChange={(e) => setStudyId(e.target.value)}>{studies.map((item) => <option key={item.id} value={item.id}>{item.study_code}</option>)}</Select></Field><Field label="Site *"><Select value={form.site_id} onChange={(e) => edit("site_id", e.target.value)}>{study?.sites?.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</Select></Field><Field label="Modern diagnosis *"><Input value={form.modern_diagnosis} onChange={(e) => edit("modern_diagnosis", e.target.value)} required /></Field><Field label="Ayurvedic Vyadhi *"><Select value={form.vyadhi_code} onChange={(e) => edit("vyadhi_code", e.target.value)}>{options("VYADHI").map((item) => <option key={item.code} value={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field><Field label="Disease duration (months)"><Input type="number" min="0" value={form.disease_duration_months} onChange={(e) => edit("disease_duration_months", e.target.value)} /></Field><Field label="Randomisation ID"><Input value={form.randomization_id} onChange={(e) => edit("randomization_id", e.target.value)} /></Field><Field label="Enrollment date *"><Input type="date" value={form.enrollment_date} onChange={(e) => edit("enrollment_date", e.target.value)} required /></Field></div></div><div className="form-section ayurveda-section"><h3><span>3</span> Ayurveda baseline</h3><p>These are structured observations, not free-text labels.</p><div className="form-grid two"><Field label={`${text[language].prakriti} *`}><Select value={form.prakriti_code} onChange={(e) => edit("prakriti_code", e.target.value)}>{options("PRAKRITI").map((item) => <option key={item.code} value={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field><Field label={`${text[language].agni} *`}><Select value={form.agni_code} onChange={(e) => edit("agni_code", e.target.value)}>{options("AGNI").map((item) => <option key={item.code} value={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field><Field label={`${text[language].bala} *`}><Select value={form.bala_code} onChange={(e) => edit("bala_code", e.target.value)}>{options("BALA").map((item) => <option key={item.code} value={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field><Field label={`${text[language].satva} *`}><Select value={form.satva_code} onChange={(e) => edit("satva_code", e.target.value)}>{options("SATVA").map((item) => <option key={item.code} value={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field><Field label="Vikriti notes"><textarea rows={3} value={form.vikriti_notes} onChange={(e) => edit("vikriti_notes", e.target.value)} /></Field></div></div>{error && <div className="form-error">{error}</div>}<footer className="form-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={pending}>{pending ? "Enrolling…" : <><Users size={16} /> {text[language].enrollParticipant}</>}</button></footer></form></Modal>;
}

function ParticipantProfilePage({ token, user, participantId, medicines, language, term, onBack, onVisit, onRefresh }: { token: string; user: CurrentUser; participantId?: string; terms?: MasterTerm[]; medicines: Medicine[]; language: Language; term: (code?: string | null) => string; onBack: () => void; onVisit: () => void; onRefresh: () => void }) {
  const [participant, setParticipant] = useState<Participant | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [showSchedule, setShowSchedule] = useState(false);
  useEffect(() => { if (!participantId) { setLoading(false); return; } setLoading(true); api.participant(token, participantId).then(setParticipant).catch((cause) => setError(cause.message)).finally(() => setLoading(false)); }, [participantId, token]);
  if (loading) return <LoadingScreen language={language} />;
  if (!participant) return <><PageHeading icon={<Users />} title="Participant profile" description="Select a participant from the registry." /><EmptyState /></>;
  const baseline = participant.baseline;
  const currentTreatment = medicines[0]?.ayurveda_name ?? "Protocol formulation";
  return <>
    <PageHeading icon={<Users />} title="Participant profile" description="Baseline Ayurveda profile, clinical context, and visit timeline." action={<button className="secondary-button" onClick={onBack}><ArrowLeft size={16} /> Back to participants</button>} />
    {error && <div className="form-error">{error}</div>}
    <div className="profile-top"><ClinicalCard className="participant-identity"><div className="profile-avatar">{initials(participant.participant_code)}</div><div><h2>{participant.participant_code} <StatusBadge value={participant.status} /></h2><p>{participant.age} years · {participant.gender} · {participant.site_name}</p><span>{participant.study_id}</span></div>{user.role === "PI" && participant.status === "SUBMITTED" && <button className="primary-button slim" onClick={async () => { await api.updateParticipant(token, participant.id, { status: "ENROLLED" }); setParticipant(await api.participant(token, participant.id)); onRefresh(); }}>Approve enrollment</button>}</ClinicalCard><ClinicalCard className="visit-timeline-card" title="Visit timeline" subtitle="The visit record owns dates; the CRF owns observations."><div className="timeline">{participant.visits?.map((visit) => <button key={visit.id} onClick={onVisit} className={`timeline-node ${visit.status.toLowerCase()}`}><span>{visit.status === "COMPLETED" ? <Check size={14} /> : visit.visit_number}</span><strong>{visit.visit_number === 0 ? "Baseline" : `Visit ${visit.visit_number}`}</strong><small>{formatDate(visit.visit_date ?? visit.scheduled_date)}</small></button>)}</div>{user.role === "COORDINATOR" && <button className="primary-button slim" onClick={() => setShowSchedule(true)}><CalendarDays size={16} /> Schedule visit</button>}</ClinicalCard></div>
    <div className="profile-grid"><ClinicalCard title="Participant overview" subtitle="Restricted study-staff view"><div className="overview-grid"><InfoBlock label="Modern diagnosis" value={participant.modern_diagnosis} /><InfoBlock label="Disease duration" value={participant.disease_duration_months ? `${participant.disease_duration_months} months` : "—"} /><InfoBlock label="Enrollment date" value={formatDate(participant.enrollment_date)} /><InfoBlock label="Randomisation ID" value={participant.randomization_id ?? "—"} /></div></ClinicalCard><ClinicalCard title="Ayurveda baseline" subtitle="Recorded once at enrollment; not overwritten by visit observations." className="ayurveda-card"><div className="overview-grid"><InfoBlock label={text[language].prakriti} value={term(baseline?.prakriti_code)} /><InfoBlock label={text[language].agni} value={term(baseline?.agni_code)} /><InfoBlock label={text[language].bala} value={term(baseline?.bala_code)} /><InfoBlock label={text[language].satva} value={term(baseline?.satva_code)} /></div><div className="note-display"><strong>Vikriti notes</strong><p>{baseline?.vikriti_notes || "No baseline note recorded."}</p></div></ClinicalCard><ClinicalCard title="Current treatment" subtitle="Protocol-aligned Phase 1 view"><div className="overview-grid"><InfoBlock label="Formulation" value={currentTreatment} /><InfoBlock label="Dosage form" value={medicines[0]?.dosage_form_code ?? "—"} /><InfoBlock label="Treatment status" value={participant.status} /><InfoBlock label="Open queries" value={String(participant.open_query_count ?? 0)} /></div></ClinicalCard></div>
    {showSchedule && <ScheduleVisit token={token} participant={participant} user={user} onClose={() => setShowSchedule(false)} onCreated={async () => { setShowSchedule(false); setParticipant(await api.participant(token, participant.id)); onRefresh(); }} />}
  </>;
}

function InfoBlock({ label, value }: { label: string; value: string }) { return <div className="info-block"><span>{label}</span><strong>{value}</strong></div>; }

function ScheduleVisit({ token, participant, user, onClose, onCreated }: { token: string; participant: Participant; user: CurrentUser; onClose: () => void; onCreated: () => void }) {
  const nextNumber = Math.max(-1, ...(participant.visits?.map((visit) => visit.visit_number) ?? [])) + 1; const [visitNumber, setVisitNumber] = useState(nextNumber); const [scheduledDate, setScheduledDate] = useState(today()); const [error, setError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); try { await api.createVisit(token, { participant_id: participant.id, visit_number: visitNumber, scheduled_date: scheduledDate, investigator_id: user.id }); onCreated(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to schedule visit."); } };
  return <Modal title="Schedule participant visit" onClose={onClose}><form onSubmit={submit} className="form-grid"><Field label="Participant"><Input value={participant.participant_code} disabled /></Field><Field label="Visit number"><Input type="number" min="0" value={visitNumber} onChange={(event) => setVisitNumber(Number(event.target.value))} /></Field><Field label="Scheduled date"><Input type="date" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} /></Field>{error && <div className="form-error">{error}</div>}<footer className="form-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button">Schedule visit</button></footer></form></Modal>;
}

function VisitsCrfPage({ token, user, participantId, terms, medicines, language, term, onOpenParticipant, onRefresh }: { token: string; user: CurrentUser; participantId?: string; terms: MasterTerm[]; medicines: Medicine[]; language: Language; term: (code?: string | null) => string; onOpenParticipant: () => void; onRefresh: () => void }) {
  const [participant, setParticipant] = useState<Participant | null>(null); const [selectedVisitId, setSelectedVisitId] = useState(""); const [error, setError] = useState("");
  const reload = async () => { if (!participantId) return; try { const result = await api.participant(token, participantId); setParticipant(result); const visit = result.visits?.find((item) => item.status !== "COMPLETED") ?? result.visits?.[result.visits.length - 1]; setSelectedVisitId((current) => current || visit?.id || ""); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load participant visits."); } };
  useEffect(() => { void reload(); // participant changes define the entire CRF context
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId, token]);
  if (!participant) return <><PageHeading icon={<ClipboardCheck />} title={text[language].visits} description="Choose a participant profile first." action={<button className="secondary-button" onClick={onOpenParticipant}><ArrowLeft size={16} /> Participant</button>} /><EmptyState /></>;
  const selectedVisit = participant.visits?.find((visit) => visit.id === selectedVisitId) ?? participant.visits?.[0];
  return <><PageHeading icon={<ClipboardCheck />} title="Visits, CRF & Queries" description={`Structured observations for ${participant.participant_code} — ${participant.modern_diagnosis}.`} action={<button className="secondary-button" onClick={onOpenParticipant}><ArrowLeft size={16} /> Participant profile</button>} />
    {error && <div className="form-error">{error}</div>}<ClinicalCard className="visit-progress"><div className="timeline large">{participant.visits?.map((visit) => <button key={visit.id} onClick={() => setSelectedVisitId(visit.id)} className={`timeline-node ${selectedVisit?.id === visit.id ? "selected" : ""} ${visit.status.toLowerCase()}`}><span>{visit.status === "COMPLETED" ? <Check size={14} /> : visit.visit_number}</span><strong>{visit.visit_number === 0 ? "Baseline" : `Visit ${visit.visit_number}`}</strong><small>{formatDate(visit.visit_date ?? visit.scheduled_date)}</small></button>)}</div></ClinicalCard>
    {selectedVisit ? <CrfEditor token={token} user={user} participant={participant} visit={selectedVisit} terms={terms} medicines={medicines} language={language} term={term} onChanged={async () => { await reload(); onRefresh(); }} /> : <EmptyState />}
  </>;
}

function CrfEditor({ token, user, participant, visit, terms, medicines, language, term, onChanged }: { token: string; user: CurrentUser; participant: Participant; visit: Visit; terms: MasterTerm[]; medicines: Medicine[]; language: Language; term: (code?: string | null) => string; onChanged: () => void }) {
  const [crf, setCrf] = useState<CRF | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [showQuery, setShowQuery] = useState(false); const writable = user.role === "COORDINATOR" && visit.status !== "COMPLETED";
  const [form, setForm] = useState({ visit_date: visit.visit_date ?? today(), investigator_id: user.id, systolic_bp: "", diastolic_bp: "", pulse_bpm: "", weight_kg: "", temperature_c: "", agni_code: "A1", bala_code: "B2", symptoms: "", medicine_id: medicines[0]?.id ?? "", dose: "", frequency: "BD", compliance: "YES", remarks: "" });
  useEffect(() => { setLoading(true); setCrf(null); api.crf(token, visit.id).then((item) => { setCrf(item); setForm({ visit_date: visit.visit_date ?? today(), investigator_id: user.id, systolic_bp: String(item.systolic_bp ?? ""), diastolic_bp: String(item.diastolic_bp ?? ""), pulse_bpm: String(item.pulse_bpm ?? ""), weight_kg: String(item.weight_kg ?? ""), temperature_c: String(item.temperature_c ?? ""), agni_code: item.agni_code ?? "A1", bala_code: item.bala_code ?? "B2", symptoms: item.symptoms ?? "", medicine_id: item.medicine_id ?? medicines[0]?.id ?? "", dose: item.dose ?? "", frequency: item.frequency ?? "BD", compliance: item.compliance ?? "YES", remarks: item.remarks ?? "" }); }).catch((cause: ApiError) => { if (cause.status !== 404) setError(cause.message); }).finally(() => setLoading(false)); }, [token, visit.id, visit.visit_date, user.id, medicines]);
  const edit = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value })); const options = (category: string) => terms.filter((item) => item.category === category && item.active);
  const save = async (completionStatus: "DRAFT" | "COMPLETED") => { setError(""); try { const payload = { visit_id: visit.id, visit_date: form.visit_date, investigator_id: form.investigator_id, systolic_bp: form.systolic_bp ? Number(form.systolic_bp) : null, diastolic_bp: form.diastolic_bp ? Number(form.diastolic_bp) : null, pulse_bpm: form.pulse_bpm ? Number(form.pulse_bpm) : null, weight_kg: form.weight_kg ? Number(form.weight_kg) : null, temperature_c: form.temperature_c ? Number(form.temperature_c) : null, agni_code: form.agni_code || null, bala_code: form.bala_code || null, symptoms: form.symptoms || null, medicine_id: form.medicine_id || null, dose: form.dose || null, frequency: form.frequency || null, compliance: form.compliance as "YES" | "NO" | "PARTIAL", remarks: form.remarks || null, completion_status: completionStatus }; if (crf) setCrf(await api.updateCrf(token, crf.id, payload)); else setCrf(await api.createCrf(token, payload)); await onChanged(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save CRF."); } };
  if (loading) return <div className="inline-loading"><LoaderCircle className="spin" /> Loading CRF…</div>;  return (
    <>
      <div className="crf-layout">
        <aside className="crf-stepper">
          <h3>CRF — {visit.visit_number === 0 ? "Baseline" : `Visit ${visit.visit_number}`}</h3>
          <StatusBadge value={crf?.completion_status ?? "DRAFT"} />
          <ol>
            <li className="active">1 <span>Visit information</span></li>
            <li>2 <span>Vitals & general</span></li>
            <li>3 <span>Ayurvedic assessment</span></li>
            <li>4 <span>Treatment & compliance</span></li>
            <li>5 <span>Investigator notes</span></li>
          </ol>
          <div className="crf-quote">“Healing is a journey of balance.”</div>
        </aside>
        <section className="crf-form">
          <header className="crf-header">
            <div>
              <h2>Digital Case Report Form</h2>
              <p>{participant.participant_code} · {participant.site_name}</p>
            </div>
            <div className="crf-actions">
              {user.role === "MONITOR" && crf && (
                <button className="secondary-button" onClick={() => setShowQuery(true)}>
                  <MessageCircleQuestion size={16} /> Raise query
                </button>
              )}
              {writable && (
                <>
                  <button className="secondary-button" onClick={() => void save("DRAFT")}>
                    {text[language].saveDraft}
                  </button>
                  <button className="primary-button" onClick={() => void save("COMPLETED")}>
                    <Check size={16} /> {text[language].completeCrf}
                  </button>
                </>
              )}
            </div>
          </header>
          <div className="crf-sections">
            <section>
              <h3>1. Visit information</h3>
              <div className="form-grid four">
                <Field label="Visit"><Input value={visit.visit_number === 0 ? "Baseline" : `Visit ${visit.visit_number}`} disabled /></Field>
                <Field label="Visit date *"><Input type="date" disabled={!writable} value={form.visit_date} onChange={(e) => edit("visit_date", e.target.value)} /></Field>
                <Field label="Site"><Input value={participant.site_name ?? ""} disabled /></Field>
                <Field label="Investigator"><Input value={user.name} disabled /></Field>
              </div>
            </section>
            <section>
              <h3>2. Vitals & general assessment</h3>
              <div className="form-grid four">
                <Field label="Systolic BP (mmHg) *"><Input disabled={!writable} type="number" value={form.systolic_bp} onChange={(e) => edit("systolic_bp", e.target.value)} /></Field>
                <Field label="Diastolic BP (mmHg) *"><Input disabled={!writable} type="number" value={form.diastolic_bp} onChange={(e) => edit("diastolic_bp", e.target.value)} /></Field>
                <Field label="Pulse (bpm) *"><Input disabled={!writable} type="number" value={form.pulse_bpm} onChange={(e) => edit("pulse_bpm", e.target.value)} /></Field>
                <Field label="Weight (kg) *"><Input disabled={!writable} type="number" step="0.1" value={form.weight_kg} onChange={(e) => edit("weight_kg", e.target.value)} /></Field>
                <Field label="Temperature (°C)"><Input disabled={!writable} type="number" step="0.1" value={form.temperature_c} onChange={(e) => edit("temperature_c", e.target.value)} /></Field>
              </div>
            </section>
            <section className="ayurveda-section">
              <h3>3. Ayurvedic assessment</h3>
              <div className="form-grid two">
                <Field label={`${text[language].agni} *`}><Select disabled={!writable} value={form.agni_code} onChange={(e) => edit("agni_code", e.target.value)}>{options("AGNI").map((item) => <option value={item.code} key={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field>
                <Field label={`${text[language].bala} *`}><Select disabled={!writable} value={form.bala_code} onChange={(e) => edit("bala_code", e.target.value)}>{options("BALA").map((item) => <option value={item.code} key={item.code}>{item.label_en} / {item.label_hi}</option>)}</Select></Field>
                <Field label="Current symptoms *"><textarea disabled={!writable} rows={3} value={form.symptoms} onChange={(e) => edit("symptoms", e.target.value)} placeholder="Record current symptoms in clinically meaningful language." /></Field>
              </div>
              <div className="baseline-reference"><Leaf size={16} /> Baseline reference: {text[language].prakriti} {term(participant.baseline?.prakriti_code)} · {text[language].agni} {term(participant.baseline?.agni_code)}</div>
            </section>
            <section>
              <h3>4. Treatment & compliance</h3>
              <div className="form-grid four">
                <Field label="Formulation *"><Select disabled={!writable} value={form.medicine_id} onChange={(e) => edit("medicine_id", e.target.value)}>{medicines.map((item) => <option key={item.id} value={item.id}>{item.ayurveda_name}</option>)}</Select></Field>
                <Field label="Dose *"><Input disabled={!writable} value={form.dose} onChange={(e) => edit("dose", e.target.value)} placeholder="e.g. 500 mg" /></Field>
                <Field label="Frequency *"><Select disabled={!writable} value={form.frequency} onChange={(e) => edit("frequency", e.target.value)}><option>OD</option><option>BD</option><option>TDS</option></Select></Field>
                <Field label="Compliance *"><Select disabled={!writable} value={form.compliance} onChange={(e) => edit("compliance", e.target.value)}><option value="YES">Yes</option><option value="PARTIAL">Partial</option><option value="NO">No</option></Select></Field>
              </div>
            </section>
            <section>
              <h3>5. Investigator notes</h3>
              <Field label="Remarks"><textarea disabled={!writable} rows={3} value={form.remarks} onChange={(e) => edit("remarks", e.target.value)} /></Field>
            </section>
          </div>
          {error && <div className="form-error">{error}</div>}
        </section>
      </div>
      {showQuery && crf && <RaiseQuery token={token} studyId={participant.study_id} crfId={crf.id} onClose={() => setShowQuery(false)} />}
    </>
  );
}

function RaiseQuery({ token, studyId, crfId, onClose }: { token: string; studyId: string; crfId: string; onClose: () => void }) {
  const [fieldName, setFieldName] = useState("weight_kg");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.createQuery(token, { study_id: studyId, target_type: "CRF", target_id: crfId, field_name: fieldName || null, message });
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to raise query.");
    }
  };
  return (
    <Modal title="Raise data query" onClose={onClose}>
      <form onSubmit={submit} className="form-grid">
        <Field label="CRF field"><Input value={fieldName} onChange={(e) => setFieldName(e.target.value)} /></Field>
        <Field label="Query message *">
          <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Ask for a specific clarification against this source field." />
        </Field>
        {error && <div className="form-error">{error}</div>}
        <footer className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button"><MessageCircleQuestion size={16} /> Raise query</button>
        </footer>
      </form>
    </Modal>
  );
}

function QueriesPage({ token, user, queries, language, onRefresh }: { token: string; user: CurrentUser; queries: DataQuery[]; language: Language; onRefresh: () => void }) {
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [answeringQuery, setAnsweringQuery] = useState<DataQuery | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const visible = queries.filter((q) => {
    const matchesFilter = filter === "ALL" || q.status === filter;
    const matchesSearch = [q.id, q.message, q.field_name ?? "", q.participant_code ?? "", q.raised_by_name].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleClose = async (queryId: string) => {
    setPendingId(queryId);
    setError("");
    try {
      await api.updateQuery(token, queryId, { action: "CLOSE" });
      onRefresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to close query.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      <PageHeading
        icon={<MessageCircleQuestion />}
        title={text[language].queries}
        description={language === "hi" ? "क्लिनिकल डेटा विसंगतियों को ट्रैक करें और हल करें।" : "Monitor, answer, and close field-specific clinical trial queries."}
      />
      {error && <div className="form-error">{error}</div>}
      <ClinicalCard>
        <div className="toolbar">
          <div className="tabs">
            <button className={filter === "ALL" ? "selected" : ""} onClick={() => setFilter("ALL")}>All ({queries.length})</button>
            <button className={filter === "OPEN" ? "selected" : ""} onClick={() => setFilter("OPEN")}>Open ({queries.filter((q) => q.status === "OPEN").length})</button>
            <button className={filter === "ANSWERED" ? "selected" : ""} onClick={() => setFilter("ANSWERED")}>Answered ({queries.filter((q) => q.status === "ANSWERED").length})</button>
            <button className={filter === "CLOSED" ? "selected" : ""} onClick={() => setFilter("CLOSED")}>Closed ({queries.filter((q) => q.status === "CLOSED").length})</button>
          </div>
          <div className="toolbar-controls">
            <input
              className="table-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search queries by field, code, text…"
            />
          </div>
        </div>
        {visible.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Query ID</th>
                  <th>Target / Field</th>
                  <th>Participant</th>
                  <th>Message / Answer</th>
                  <th>Raised By</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((query) => (
                  <tr key={query.id}>
                    <td><code>{query.id.slice(0, 8)}</code></td>
                    <td><strong>{query.target_type}</strong><small>{query.field_name ?? "General"}</small></td>
                    <td>{query.participant_code ?? "—"}</td>
                    <td style={{ maxWidth: 320 }}>
                      <p style={{ margin: 0 }}>{query.message}</p>
                      {query.answer && (
                        <small style={{ display: "block", marginTop: 4, color: "var(--sm-brand-800)" }}>
                          <strong>Answer:</strong> {query.answer} ({query.answered_by_name ?? "Coordinator"})
                        </small>
                      )}
                    </td>
                    <td>{query.raised_by_name}<small>{formatDate(query.raised_at)}</small></td>
                    <td><StatusBadge value={query.status} /></td>
                    <td>
                      {query.status === "OPEN" && (user.role === "COORDINATOR" || user.role === "ADMIN" || user.role === "PI") && (
                        <button className="primary-button slim" onClick={() => setAnsweringQuery(query)}>Answer</button>
                      )}
                      {query.status === "ANSWERED" && (user.role === "PI" || user.role === "ADMIN") && (
                        <button className="primary-button slim" disabled={pendingId === query.id} onClick={() => void handleClose(query.id)}>
                          {pendingId === query.id ? "Closing…" : "Close"}
                        </button>
                      )}
                      {query.status === "CLOSED" && <span style={{ fontSize: 12, color: "var(--sm-text-muted)" }}>Resolved</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState />
        )}
      </ClinicalCard>
      {answeringQuery && (
        <AnswerQueryModal
          token={token}
          query={answeringQuery}
          onClose={() => setAnsweringQuery(null)}
          onSuccess={() => { setAnsweringQuery(null); onRefresh(); }}
        />
      )}
    </>
  );
}

function AnswerQueryModal({ token, query, onClose, onSuccess }: { token: string; query: DataQuery; onClose: () => void; onSuccess: () => void }) {
  const [answer, setAnswer] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim()) return setError("Please enter an answer to resolve this query.");
    setPending(true);
    setError("");
    try {
      await api.updateQuery(token, query.id, { action: "ANSWER", answer });
      onSuccess();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to answer query.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal title="Answer clinical query" onClose={onClose}>
      <form onSubmit={submit} className="form-grid">
        <Field label="Field"><Input value={query.field_name ?? query.target_type} disabled /></Field>
        <Field label="Query message"><textarea value={query.message} disabled rows={3} /></Field>
        <Field label="Resolution answer *">
          <textarea
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            placeholder="Explain the resolution or correction made against source records."
          />
        </Field>
        {error && <div className="form-error">{error}</div>}
        <footer className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" disabled={pending}>{pending ? "Submitting…" : "Submit answer"}</button>
        </footer>
      </form>
    </Modal>
  );
}

function EthicsPage({ token, user, study, language, onRefresh }: { token: string; user: CurrentUser; study?: Study; language: Language; onRefresh: () => void }) {
  const [showEdit, setShowEdit] = useState(false);
  const canEdit = user.role === "ETHICS" || user.role === "ADMIN" || user.role === "PI";
  const ethics = study?.ethics;

  return (
    <>
      <PageHeading
        icon={<ShieldCheck />}
        title={text[language].ethics}
        description={language === "hi" ? "अध्ययन के लिए संस्थागत आचार समिति (IEC) समीक्षा एवं अनुमोदन।" : "Institutional Ethics Committee (IEC) governance, review status, and regulatory decisions."}
        action={canEdit && study ? <button className="primary-button" onClick={() => setShowEdit(true)}><ShieldCheck size={16} /> Update ethics decision</button> : undefined}
      />
      {!study ? (
        <EmptyState />
      ) : (
        <div className="profile-grid">
          <ClinicalCard title="Ethics Review Decision" subtitle={`Study ${study.study_code} — IEC Approval Record`}>
            <div className="overview-grid">
              <InfoBlock label="IEC Number" value={ethics?.iec_number || "Pending"} />
              <InfoBlock label="Decision Status" value={ethics?.status || "PENDING"} />
              <InfoBlock label="Approval Date" value={formatDate(ethics?.approval_date)} />
              <InfoBlock label="Expiry Date" value={formatDate(ethics?.expiry_date)} />
            </div>
            <div className="note-display" style={{ marginTop: 16 }}>
              <strong>Committee Remarks</strong>
              <p>{ethics?.remarks || "No remarks on record."}</p>
            </div>
          </ClinicalCard>

          <ClinicalCard title="Clinical Governance & Privacy" subtitle="GCP / ICMR Ethical Guidelines">
            <div style={{ padding: "8px 0", color: "var(--sm-text-muted)", fontSize: 14, lineHeight: 1.6 }}>
              <p>Under clinical trial regulatory frameworks (ICMR & GCP), Institutional Ethics Committee members review trial protocol, informed consent procedures, and investigator credentials.</p>
              <p style={{ marginTop: 12 }}><strong>Privacy Safeguard:</strong> Direct personal identifying data of individual participants is excluded from the Ethics view to maintain blinded ethical oversight.</p>
            </div>
          </ClinicalCard>
        </div>
      )}
      {showEdit && study && ethics && (
        <EthicsModal
          token={token}
          studyId={study.id}
          initial={ethics}
          onClose={() => setShowEdit(false)}
          onSuccess={() => { setShowEdit(false); onRefresh(); }}
        />
      )}
    </>
  );
}

function EthicsModal({ token, studyId, initial, onClose, onSuccess }: { token: string; studyId: string; initial: Ethics; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    iec_number: initial.iec_number,
    status: initial.status,
    approval_date: initial.approval_date ?? "",
    expiry_date: initial.expiry_date ?? "",
    remarks: initial.remarks ?? ""
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const edit = (key: keyof typeof form, val: string) => setForm((c) => ({ ...c, [key]: val }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await api.updateEthics(token, studyId, {
        iec_number: form.iec_number,
        status: form.status,
        approval_date: form.approval_date || null,
        expiry_date: form.expiry_date || null,
        remarks: form.remarks || null
      });
      onSuccess();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update ethics.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal title="Update ethics decision" onClose={onClose}>
      <form onSubmit={submit} className="form-grid two">
        <Field label="IEC Number *"><Input value={form.iec_number} onChange={(e) => edit("iec_number", e.target.value)} required /></Field>
        <Field label="Decision Status *">
          <Select value={form.status} onChange={(e) => edit("status", e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
          </Select>
        </Field>
        <Field label="Approval date"><Input type="date" value={form.approval_date} onChange={(e) => edit("approval_date", e.target.value)} /></Field>
        <Field label="Expiry date"><Input type="date" value={form.expiry_date} onChange={(e) => edit("expiry_date", e.target.value)} /></Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Ethics Remarks"><textarea rows={3} value={form.remarks} onChange={(e) => edit("remarks", e.target.value)} /></Field>
        </div>
        {error && <div className="form-error" style={{ gridColumn: "1 / -1" }}>{error}</div>}
        <footer className="form-actions" style={{ gridColumn: "1 / -1" }}>
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" disabled={pending}>{pending ? "Saving…" : "Save ethics decision"}</button>
        </footer>
      </form>
    </Modal>
  );
}

function AdminPage({ token, terms, language, onRefresh }: { token: string; terms: MasterTerm[]; language: Language; onRefresh: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showAddTerm, setShowAddTerm] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [pendingTermId, setPendingTermId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const categories = ["ALL", "VYADHI", "PRAKRITI", "AGNI", "BALA", "SATVA", "DOSAGE_FORM", "ANUPANA"];

  const visibleTerms = terms.filter((item) => {
    const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch = [item.code, item.label_en, item.label_hi, item.modern_mapping_en ?? ""].join(" ").toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleTermActive = async (termItem: MasterTerm) => {
    setPendingTermId(termItem.id);
    setError("");
    try {
      await api.updateTerm(token, termItem.id, { active: !termItem.active });
      onRefresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to toggle term.");
    } finally {
      setPendingTermId(null);
    }
  };

  return (
    <>
      <PageHeading
        icon={<UserCog />}
        title={text[language].admin}
        description="Ayurveda controlled vocabulary, master dictionary, and user management."
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <button className="secondary-button" onClick={() => setShowAddUser(true)}><Users size={16} /> New user</button>
            <button className="primary-button" onClick={() => setShowAddTerm(true)}><Plus size={16} /> Add master term</button>
          </div>
        }
      />
      {error && <div className="form-error">{error}</div>}
      <ClinicalCard title={`Master Terms (${terms.length})`} subtitle="Controlled clinical concepts mapped to modern standards.">
        <div className="toolbar">
          <div className="tabs" style={{ flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={selectedCategory === cat ? "selected" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} {cat !== "ALL" && `(${terms.filter((t) => t.category === cat).length})`}
              </button>
            ))}
          </div>
          <div className="toolbar-controls">
            <input
              className="table-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, English or Hindi term…"
            />
          </div>
        </div>
        {visibleTerms.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Code</th>
                  <th>English label</th>
                  <th>Hindi label</th>
                  <th>Biomedical mapping</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleTerms.map((termItem) => (
                  <tr key={termItem.id}>
                    <td><code>{termItem.category}</code></td>
                    <td><strong>{termItem.code}</strong></td>
                    <td>{termItem.label_en}</td>
                    <td>{termItem.label_hi}</td>
                    <td>{termItem.modern_mapping_en || "—"}</td>
                    <td>
                      <span className={`status-badge ${termItem.active ? "approved" : "closed"}`}>
                        {termItem.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="secondary-button"
                        style={{ padding: "4px 10px", fontSize: 12 }}
                        disabled={pendingTermId === termItem.id}
                        onClick={() => void toggleTermActive(termItem)}
                      >
                        {termItem.active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState />
        )}
      </ClinicalCard>
      {showAddTerm && (
        <AddTermModal
          token={token}
          onClose={() => setShowAddTerm(false)}
          onSuccess={() => { setShowAddTerm(false); onRefresh(); }}
        />
      )}
      {showAddUser && (
        <CreateUserModal
          token={token}
          onClose={() => setShowAddUser(false)}
          onSuccess={() => { setShowAddUser(false); onRefresh(); }}
        />
      )}
    </>
  );
}

function AddTermModal({ token, onClose, onSuccess }: { token: string; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ category: "VYADHI", code: "", label_en: "", label_hi: "", modern_mapping_en: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const edit = (key: keyof typeof form, val: string) => setForm((c) => ({ ...c, [key]: val }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await api.createTerm(token, {
        category: form.category.toUpperCase(),
        code: form.code.toUpperCase(),
        label_en: form.label_en,
        label_hi: form.label_hi,
        modern_mapping_en: form.modern_mapping_en || null
      });
      onSuccess();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to add term.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal title="Add master dictionary term" onClose={onClose}>
      <form onSubmit={submit} className="form-grid two">
        <Field label="Category *">
          <Select value={form.category} onChange={(e) => edit("category", e.target.value)}>
            <option value="VYADHI">VYADHI</option>
            <option value="PRAKRITI">PRAKRITI</option>
            <option value="AGNI">AGNI</option>
            <option value="BALA">BALA</option>
            <option value="SATVA">SATVA</option>
            <option value="DOSAGE_FORM">DOSAGE_FORM</option>
            <option value="ANUPANA">ANUPANA</option>
          </Select>
        </Field>
        <Field label="Code *"><Input value={form.code} onChange={(e) => edit("code", e.target.value.toUpperCase())} required placeholder="e.g. V002" /></Field>
        <Field label="English label *"><Input value={form.label_en} onChange={(e) => edit("label_en", e.target.value)} required placeholder="e.g. Sandhigata Vata" /></Field>
        <Field label="Hindi label *"><Input value={form.label_hi} onChange={(e) => edit("label_hi", e.target.value)} required placeholder="e.g. सन्धिगत वात" /></Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Modern biomedical mapping (optional)"><Input value={form.modern_mapping_en} onChange={(e) => edit("modern_mapping_en", e.target.value)} placeholder="e.g. Osteoarthritis" /></Field>
        </div>
        {error && <div className="form-error" style={{ gridColumn: "1 / -1" }}>{error}</div>}
        <footer className="form-actions" style={{ gridColumn: "1 / -1" }}>
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" disabled={pending}>{pending ? "Creating…" : "Save term"}</button>
        </footer>
      </form>
    </Modal>
  );
}

function CreateUserModal({ token, onClose, onSuccess }: { token: string; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "Demo@123", role: "COORDINATOR" as Role });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const edit = (key: keyof typeof form, val: string) => setForm((c) => ({ ...c, [key]: val }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await api.createUser(token, form);
      onSuccess();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create user.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal title="Create system user" onClose={onClose}>
      <form onSubmit={submit} className="form-grid two">
        <Field label="Full name *"><Input value={form.name} onChange={(e) => edit("name", e.target.value)} required /></Field>
        <Field label="Email *"><Input type="email" value={form.email} onChange={(e) => edit("email", e.target.value)} required /></Field>
        <Field label="Password *"><Input type="password" value={form.password} onChange={(e) => edit("password", e.target.value)} required /></Field>
        <Field label="System Role *">
          <Select value={form.role} onChange={(e) => edit("role", e.target.value as Role)}>
            <option value="COORDINATOR">Study Coordinator</option>
            <option value="PI">Principal Investigator</option>
            <option value="MONITOR">Monitor</option>
            <option value="ETHICS">Ethics Committee</option>
            <option value="PV">Pharmacovigilance</option>
            <option value="ADMIN">Administrator</option>
          </Select>
        </Field>
        {error && <div className="form-error" style={{ gridColumn: "1 / -1" }}>{error}</div>}
        <footer className="form-actions" style={{ gridColumn: "1 / -1" }}>
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" disabled={pending}>{pending ? "Creating…" : "Create user"}</button>
        </footer>
      </form>
    </Modal>
  );
}

