import React, { useEffect } from 'react';
import { useState } from 'react';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemStatement from './components/ProblemStatement';
import SolutionOverview from './components/SolutionOverview';
import FeatureShowcase from './components/FeatureShowcase';
import PerformanceScore from './components/PerformanceScore';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'login' | 'signup'>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleShowLogin = () => setCurrentView('login');
  const handleShowSignup = () => setCurrentView('signup');
  const handleShowMain = () => setCurrentView('main');
  const handleToggleAuth = () => {
    setCurrentView(currentView === 'login' ? 'signup' : 'login');
  };
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('main');
  };

  // Render authentication views
  if (currentView === 'login') {
    return <Login onToggleAuth={handleToggleAuth} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'signup') {
    return <SignUp onToggleAuth={handleToggleAuth} />;
  }

  // Render main site
  return (
    <div className="min-h-screen bg-white">
      <Header onShowLogin={handleShowLogin} onShowSignup={handleShowSignup} isLoggedIn={isLoggedIn} />
      <main>
        <Hero />
        <ProblemStatement />
        <SolutionOverview />
        <FeatureShowcase />
        <PerformanceScore />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default App;