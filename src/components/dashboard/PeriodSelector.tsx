import React from 'react';
import { Filter } from 'lucide-react';

export type PeriodOption = 'this_month' | 'last_month' | 'last_3_months' | 'this_year';

interface PeriodSelectorProps {
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  disabled?: boolean;
}

export const periodLabels: Record<PeriodOption, string> = {
  this_month: 'This Month',
  last_month: 'Last Month',
  last_3_months: 'Last 3 Months',
  this_year: 'This Year',
};

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <select
        value={selectedPeriod}
        onChange={(e) => onPeriodChange(e.target.value as PeriodOption)}
        disabled={disabled}
        className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground shadow-sm hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer disabled:opacity-50"
        aria-label="Filter financial period"
      >
        <option value="this_month">This Month</option>
        <option value="last_month">Last Month</option>
        <option value="last_3_months">Last 3 Months</option>
        <option value="this_year">This Year</option>
      </select>
    </div>
  );
};
