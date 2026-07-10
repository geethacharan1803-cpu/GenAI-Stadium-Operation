import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Navigation from './pages/Navigation';
import CrowdIntelligence from './pages/CrowdIntelligence';
import AIConcierge from './pages/AIConcierge';
import DataUpload from './pages/DataUpload';
import Settings from './pages/Settings';
import MatchSchedule from './pages/MatchSchedule';
import FacilitiesMap from './pages/FacilitiesMap';
import TravelGuide from './pages/TravelGuide';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="page-content" role="main">
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
        </main>
      </div>
    </div>
  );
}
