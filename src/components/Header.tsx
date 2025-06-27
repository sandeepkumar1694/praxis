import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


interface HeaderProps {
  onShowLogin?: () => void;
  onShowSignup?: () => void;
  isLoggedIn?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onShowLogin, 
  onShowSignup, 
  isLoggedIn: propIsLoggedIn 
}) => {
  const { user, signOut, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use auth context user state or prop fallback
  const isLoggedIn = user ? true : (propIsLoggedIn || false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = ['Platform', 'Solutions', 'Pricing', 'Resources', 'About'];

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLogin = () => {
    if (onShowLogin) {
      onShowLogin();
    } else {
      window.location.href = '/auth/login';
    }
  };

  const handleSignup = () => {
    if (onShowSignup) {
      onShowSignup();
    } else {
      window.location.href = '/auth/signup';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glassmorphism' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-poppins font-bold text-text-primary">Praxis</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-text-secondary hover:text-primary transition-colors duration-200 font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <a 
                  href="/tasks"
                  className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary transition-colors duration-200"
                >
                  <User size={18} />
                  <span>Tasks</span>
                </a>
                <button 
                  onClick={handleSignOut}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleLogin}
                  className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary transition-colors duration-200"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
                <button 
                  onClick={handleSignup}
                  className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 glassmorphism rounded-lg">
            <div className="flex flex-col space-y-4 px-4">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-text-secondary hover:text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {isLoggedIn ? (
                  <>
                    <a 
                      href="/tasks"
                      className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary transition-colors duration-200"
                    >
                      <User size={18} />
                      <span>Tasks</span>
                    </a>
                    <button 
                      onClick={handleSignOut}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleLogin}
                      className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary transition-colors duration-200"
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </button>
                    <button 
                      onClick={handleSignup}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                    >
                      <UserPlus size={18} />
                      <span>Sign Up</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;