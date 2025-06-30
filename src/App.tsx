import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/auth/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import AuthCallback from './components/auth/AuthCallback';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemStatement from './components/ProblemStatement';
import SolutionOverview from './components/SolutionOverview';
import FeatureShowcase from './components/FeatureShowcase';
import PerformanceScore from './components/PerformanceScore';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/dashboard/Dashboard';
import DailyTasksList from './components/tasks/DailyTasksList';
import TaskCompletion from './components/tasks/TaskCompletion';
import TaskScorecard from './components/tasks/TaskScorecard';
import CompletedTasksList from './components/tasks/CompletedTasksList';
import TaskGenerator from './components/tasks/TaskGenerator';
import InterviewerPage from './components/pages/InterviewerPage';
import AITeamLeadPage from './components/pages/AITeamLeadPage';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LandingPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Auth Routes */}
              <Route 
                path="/auth/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auth/signup" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <SignUp />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auth/forgot-password" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <ForgotPassword />
                  </ProtectedRoute>
                } 
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Routes */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <OnboardingFlow />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Task Routes */}
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <DailyTasksList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/completed-tasks" 
                element={
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <CompletedTasksList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/generate-tasks" 
                element={
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <TaskGenerator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/complete/:taskId" 
                element={
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <TaskCompletion />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/result/:submissionId" 
                element={
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <TaskScorecard />
                  </ProtectedRoute>
                } 
              />
              
              {/* New Feature Routes */}
              <Route 
                path="/interviewer" 
                element={
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <InterviewerPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-team-lead" 
                element={
                  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                    <AITeamLeadPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

// Landing Page Component
const LandingPage: React.FC = () => {
  React.useEffect(() => {
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

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
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
};

// Landing Header Component (for non-authenticated users)
const LandingHeader: React.FC = () => {
  const handleShowLogin = () => window.location.href = '/auth/login';
  const handleShowSignup = () => window.location.href = '/auth/signup';

  return <Header onShowLogin={handleShowLogin} onShowSignup={handleShowSignup} isLoggedIn={false} />;
};

export default App;