import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: number;
  currency?: string;
  previousAmount?: number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  isExpense?: boolean;
  savingsRate?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  currency = 'INR',
  previousAmount,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-primary/10',
  iconTextColor = 'text-primary',
  isExpense = false,
  savingsRate,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Calculate change percentage safely handling previousAmount = 0
  const calculateChange = () => {
    if (previousAmount === undefined) return null;
    if (previousAmount === 0) {
      if (amount === 0) return { percent: 0, isIncrease: false, isZero: true };
      return { percent: 100, isIncrease: true, isZero: false };
    }

    const diff = amount - previousAmount;
    const percent = Math.abs((diff / previousAmount) * 100);
    return {
      percent: Number(percent.toFixed(1)),
      isIncrease: diff > 0,
      isZero: diff === 0,
    };
  };

  const change = calculateChange();

  // Determine indicator color scheme
  // For expenses: decrease is good (green), increase is bad (red)
  // For income/balance/savings: increase is good (green), decrease is bad (red)
  let isPositive = false;
  if (change) {
    if (isExpense) {
      isPositive = !change.isIncrease; // expense decrease is positive
    } else {
      isPositive = change.isIncrease; // income increase is positive
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgColor} ${iconTextColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {formatCurrency(amount)}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
        {change && !change.isZero ? (
          <div
            className={`inline-flex items-center gap-1 font-bold rounded-md px-2 py-0.5 ${
              isPositive
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
            }`}
          >
            {change.isIncrease ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            <span>{change.percent}%</span>
          </div>
        ) : change?.isZero ? (
          <div className="inline-flex items-center gap-1 font-semibold rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
            <Minus className="h-3.5 w-3.5" />
            <span>0%</span>
          </div>
        ) : savingsRate !== undefined ? (
          <div className="inline-flex items-center gap-1 font-bold rounded-md bg-primary/15 text-primary px-2 py-0.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{savingsRate}% rate</span>
          </div>
        ) : null}

        <span className="text-muted-foreground truncate text-right">
          {subtitle || 'from last period'}
        </span>
      </div>
    </div>
  );
};
