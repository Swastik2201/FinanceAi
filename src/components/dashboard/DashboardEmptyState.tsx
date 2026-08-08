import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, Receipt } from 'lucide-react';

interface DashboardEmptyStateProps {
  onSeedSampleData?: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({ onSeedSampleData }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-8 sm:p-12 text-center my-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 ring-8 ring-primary/5">
        <Receipt className="h-8 w-8" />
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-2">
        Your financial dashboard is ready <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
      </h3>

      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        You haven't added any transactions yet. Start tracking your income and expenses to see your financial overview here.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => navigate('/expenses')}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="h-4 w-4" />
          Add Your First Expense
        </button>

        {onSeedSampleData && (
          <button
            onClick={onSeedSampleData}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Load Sample Data
          </button>
        )}
      </div>
    </div>
  );
};
