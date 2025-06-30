import React from 'react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {children}
      </div>
    </AuthenticatedLayout>
  );
};

export default DashboardLayout;