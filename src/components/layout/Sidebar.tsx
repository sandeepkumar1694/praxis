import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  CheckCircle, 
  BarChart3, 
  Trophy, 
  Users, 
  Bot,
  FileText,
  Bookmark,
  Clock
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Daily Tasks', path: '/tasks' },
    { icon: CheckCircle, label: 'Completed Tasks', path: '/completed-tasks' },
    { icon: Clock, label: 'Weekly Tasks', path: '/weekly-tasks' },
    { icon: BarChart3, label: 'Performance', path: '/performance' },
    { icon: Trophy, label: 'Achievements', path: '/achievements' },
    { icon: Users, label: 'Interviewer', path: '/interviewer' },
    { icon: Bot, label: 'AI Team Lead', path: '/ai-team-lead', comingSoon: true },
    { icon: FileText, label: 'Task Reports', path: '/task-reports' },
    { icon: Bookmark, label: 'Saved Tasks', path: '/saved-tasks' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-dashboard-card border-r border-white/10 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-poppins font-bold text-white">Praxis</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                disabled={item.comingSoon}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : item.comingSoon
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.comingSoon && (
                  <span className="ml-auto text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
              <h4 className="text-sm font-semibold text-white mb-2">Pro Tip</h4>
              <p className="text-xs text-white/60">
                Complete daily tasks consistently to boost your performance score and unlock new features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;