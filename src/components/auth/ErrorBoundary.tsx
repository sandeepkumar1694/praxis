import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            
            <h2 className="text-2xl font-poppins font-bold text-text-primary mb-2">
              Something went wrong
            </h2>
            
            <p className="text-text-secondary mb-6">
              We encountered an unexpected error. This has been logged and our team has been notified.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full h-11 bg-primary text-white rounded-md font-inter font-medium hover:brightness-95 transition-all duration-200"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full h-11 border border-secondary text-text-secondary rounded-md font-inter font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-600 cursor-pointer mb-2">
                  Error Details (Dev Mode)
                </summary>
                <pre className="text-xs text-red-600 bg-red-50 p-3 rounded border overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;