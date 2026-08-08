import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Wallet, ShieldCheck, CheckCircle, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 relative overflow-hidden bg-glow-indigo">
      {/* Top Header Navbar */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl w-full mx-auto z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Finance<span className="text-indigo-600 dark:text-indigo-400">Budgeting</span>
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md p-8 glass-card">
          <LoginForm />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 z-10">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Firebase 256-bit Token Security
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Lock className="w-3.5 h-3.5 mr-1 text-indigo-500" /> End-to-End Encrypted Auth
          </span>
        </div>
        © {new Date().getFullYear()} FinanceBudgeting Inc. All rights reserved.
      </footer>
    </div>
  );
};
