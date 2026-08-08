import React from 'react';
import { Users, ShieldCheck } from 'lucide-react';

export const BillSplit: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Bill Split</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Share group expenses and calculate settlements</p>
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-900/60">
          <ShieldCheck className="w-4 h-4" />
          <span>Protected Route</span>
        </div>
      </div>

      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bill Split Module Protected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          This route is authenticated and ready for Phase 3 Bill Split implementation.
        </p>
      </div>
    </div>
  );
};
