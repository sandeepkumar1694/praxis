import React, { useState } from 'react';
import { Bell, Search, Settings, User, LogOut, Menu, X, Home, Calendar, Users, Bot } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthenticatedHeaderProps {
  onToggleSidebar?: () => void;
}

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({ onToggleSidebar }) => {
  const { user, signOut } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    showSuccess('Signed out successfully');
  };

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Daily Tasks', path: '/tasks' },
    { icon: Calendar, label: 'Weekly Tasks', path: '/weekly-tasks' },
    { icon: Users, label: 'Interviewer', path: '/interviewer' },
    { icon: Bot, label: 'AI Team Lead', path: '/ai-team-lead' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header className="bg-dashboard-card border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors duration-200"
              onClick={onToggleSidebar}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-poppins font-bold text-white">Praxis</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title={item.label}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.label === 'AI Team Lead' && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search tasks, reports, or features..."
                className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-white/60 hover:text-white transition-colors duration-200 hover:bg-white/5 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="hidden lg:block p-2 text-white/60 hover:text-white transition-colors duration-200 hover:bg-white/5 rounded-lg">
              <Settings size={20} />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-3 p-2 text-white/60 hover:text-white transition-colors duration-200 hover:bg-white/5 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden lg:block font-medium text-white">
                  {user?.profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-dashboard-card border border-white/10 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {user?.profile?.full_name || 'User'}
                        </p>
                        <p className="text-sm text-white/60">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200">
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                  {item.label === 'AI Team Lead' && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AuthenticatedHeader;