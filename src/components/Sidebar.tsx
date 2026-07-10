import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import {
  LayoutDashboard,
  Compass,
  Users,
  Bot,
  Upload,
  Settings,
  Calendar,
  Map,
  Plane,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const { t } = useTranslation();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const sections = [
    {
      key: 'overview',
      label: t('dashboard'),
      items: [{ path: '/', label: t('dashboard'), icon: LayoutDashboard }]
    },
    {
      key: 'verticals',
      label: t('smartNavigation'),
      items: [
        { path: '/navigation', label: t('smartNavigation'), icon: Compass },
        { path: '/crowd', label: t('crowdIntelligence'), icon: Users },
        { path: '/concierge', label: t('aiConcierge'), icon: Bot }
      ]
    },
    {
      key: 'guide',
      label: t('travelGuide'),
      items: [
        { path: '/schedule', label: t('matchSchedule'), icon: Calendar },
        { path: '/facilities', label: t('facilitiesMap'), icon: Map },
        { path: '/travel', label: t('travelGuide'), icon: Plane }
      ]
    },
    {
      key: 'tools',
      label: t('settings'),
      items: [
        { path: '/upload', label: t('dataUpload'), icon: Upload },
        { path: '/settings', label: t('settings'), icon: Settings }
      ]
    }
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon" aria-hidden="true">⚽</div>
          <div className="sidebar-brand-text">
            <h1>Stadium AI</h1>
            <p>FIFA 2026</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map(section => (
            <div key={section.key}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNav(item.path)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className={`status-dot ${state.isSimulationRunning ? 'live' : 'offline'}`} />
            <span>{state.isSimulationRunning ? 'Live Simulation Active' : 'Simulation Paused'}</span>
          </div>
          <div className="sidebar-status" style={{ marginTop: '6px' }}>
            <span>{state.selectedStadium.name}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
