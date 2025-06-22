import React, { createContext, useContext, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { NotificationContextType, NotificationType } from '../types/auth';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const showNotification = (message: string, type: NotificationType = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message, {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#10B981',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#EF4444',
          },
        });
        break;
      case 'warning':
        toast(message, {
          duration: 4000,
          icon: '⚠️',
          style: {
            background: '#F59E0B',
            color: '#FFFFFF',
            fontWeight: '500',
          },
        });
        break;
      default:
        toast(message, {
          duration: 4000,
          icon: 'ℹ️',
          style: {
            background: '#3B82F6',
            color: '#FFFFFF',
            fontWeight: '500',
          },
        });
        break;
    }
  };

  const showSuccess = (message: string) => showNotification(message, 'success');
  const showError = (message: string) => showNotification(message, 'error');
  const showInfo = (message: string) => showNotification(message, 'info');
  const showWarning = (message: string) => showNotification(message, 'warning');

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#0D1117',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            padding: '12px 16px',
          },
        }}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};