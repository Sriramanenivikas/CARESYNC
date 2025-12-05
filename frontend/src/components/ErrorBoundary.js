import React, { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiChevronLeft } from 'react-icons/fi';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
    
    // In production, you could send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // errorReportingService.log({ error, errorInfo });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-600 mb-6">
              We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg text-left">
                <p className="text-sm font-mono text-red-600 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-slate-500">
                    <summary className="cursor-pointer hover:text-slate-700">
                      Stack trace
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                <FiRefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={this.handleGoBack}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                <FiChevronLeft className="w-4 h-4" />
                Go Back
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                <FiHome className="w-4 h-4" />
                Home
              </button>
            </div>

            {/* Retry Count Warning */}
            {this.state.retryCount >= 3 && (
              <p className="mt-4 text-sm text-amber-600">
                Multiple retry attempts failed. Please refresh the page or contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
