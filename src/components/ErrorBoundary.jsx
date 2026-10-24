import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-warm-200 shadow-soft p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="font-display font-extrabold text-xl text-neutral-900">
                Something went wrong
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                An unexpected error occurred while loading this page. Please refresh or return to the storefront.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Return to Store</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
