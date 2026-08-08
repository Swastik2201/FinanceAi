import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, CreditCard, Users, PieChart } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { title: 'Add Expense', icon: Plus, path: '/expenses', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
    { title: 'Add Income', icon: ArrowUpRight, path: '/expenses', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { title: 'Subscriptions', icon: CreditCard, path: '/subscriptions', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { title: 'Split Bill', icon: Users, path: '/bill-split', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { title: 'Analytics', icon: PieChart, path: '/analytics', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center transition-all duration-200 hover:border-primary/40 hover:bg-muted/50 hover:scale-[1.02]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-foreground truncate w-full">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
