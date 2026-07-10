import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Dashboard and Settings are fast, keep static
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

// Lazy load heavy components
const Navigation = lazy(() => import('./pages/Navigation'));
const CrowdIntelligence = lazy(() => import('./pages/CrowdIntelligence'));
const AIConcierge = lazy(() => import('./pages/AIConcierge'));
const DataUpload = lazy(() => import('./pages/DataUpload'));
const MatchSchedule = lazy(() => import('./pages/MatchSchedule'));
const FacilitiesMap = lazy(() => import('./pages/FacilitiesMap'));
const TravelGuide = lazy(() => import('./pages/TravelGuide'));

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="page-content" role="main">
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div className="spinner spinner-lg" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/navigation" element={<Navigation />} />
              <Route path="/crowd" element={<CrowdIntelligence />} />
              <Route path="/concierge" element={<AIConcierge />} />
              <Route path="/upload" element={<DataUpload />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/schedule" element={<MatchSchedule />} />
              <Route path="/facilities" element={<FacilitiesMap />} />
              <Route path="/travel" element={<TravelGuide />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
