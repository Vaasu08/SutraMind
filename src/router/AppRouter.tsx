import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TrialListPage } from '../pages/trials/TrialListPage';
import { TrialDetailPage } from '../pages/trials/TrialDetailPage';
import { TrialCreatePage } from '../pages/trials/TrialCreatePage';
import { ParticipantListPage } from '../pages/participants/ParticipantListPage';
import { ParticipantProfilePage } from '../pages/participants/ParticipantProfilePage';
import { VisitListPage } from '../pages/visits/VisitListPage';
import { AyurvedaPage } from '../pages/ayurveda/AyurvedaPage';
import { SafetyPage } from '../pages/safety/SafetyPage';
import { EthicsPage } from '../pages/ethics/EthicsPage';
import { CompliancePage } from '../pages/compliance/CompliancePage';
import { IntelligencePage } from '../pages/intelligence/IntelligencePage';
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage';
import { ExportPage } from '../pages/export/ExportPage';
import { AuditPage } from '../pages/AuditPage';

// Shared participants & safety route outside trial context
function GlobalParticipants() {
  return <ParticipantListPage />;
}

function GlobalSafety() {
  return <SafetyPage />;
}

function GlobalCompliance() {
  return <CompliancePage />;
}

function GlobalIntelligence() {
  return <IntelligencePage />;
}

function GlobalAnalytics() {
  return <AnalyticsPage />;
}

function GlobalExport() {
  return <ExportPage />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AppShell />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Trials */}
              <Route path="trials" element={<TrialListPage />} />
              <Route path="trials/new" element={<TrialCreatePage />} />
              <Route path="trials/:trialId" element={<TrialDetailPage />} />
              <Route path="trials/:trialId/ethics" element={<EthicsPage />} />
              <Route path="trials/:trialId/participants" element={<ParticipantListPage />} />
              <Route path="trials/:trialId/participants/:participantId" element={<ParticipantProfilePage />} />
              <Route path="trials/:trialId/visits" element={<VisitListPage />} />
              <Route path="trials/:trialId/ayurveda" element={<AyurvedaPage />} />
              <Route path="trials/:trialId/safety" element={<SafetyPage />} />
              <Route path="trials/:trialId/compliance" element={<CompliancePage />} />
              <Route path="trials/:trialId/intelligence" element={<IntelligencePage />} />
              <Route path="trials/:trialId/analytics" element={<AnalyticsPage />} />
              <Route path="trials/:trialId/export" element={<ExportPage />} />

              {/* Global routes (sidebar nav) */}
              <Route path="participants" element={<GlobalParticipants />} />
              <Route path="intelligence" element={<GlobalIntelligence />} />
              <Route path="safety" element={<GlobalSafety />} />
              <Route path="compliance" element={<GlobalCompliance />} />
              <Route path="analytics" element={<GlobalAnalytics />} />
              <Route path="export" element={<GlobalExport />} />
              <Route path="audit" element={<AuditPage />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
