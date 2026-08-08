import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({
  message = 'Unable to load your financial overview. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h4 className="text-lg font-bold text-foreground">
        Connection Error
      </h4>

      <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2 text-xs font-bold text-foreground shadow-sm hover:bg-muted transition-all"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    </div>
  );
};
