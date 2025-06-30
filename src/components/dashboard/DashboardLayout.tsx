import React from 'react';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dashboard-bg">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;