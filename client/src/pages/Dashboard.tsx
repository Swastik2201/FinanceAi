import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, UserCheck, Key, Database, ArrowRight, Zap, Wallet, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header Greeting Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-indigo-100 backdrop-blur-md text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Authenticated Session Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-indigo-100 text-sm max-w-xl">
            Your FinanceBudgeting account is fully secured with Firebase Authentication and synced with your database profile.
          </p>
        </div>
      </div>

      {/* Profile & Security Details Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">User Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Synchronized via /api/auth/sync</p>
            </div>
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/60 pt-2">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900 dark:text-slate-200">{user?.name}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-900 dark:text-slate-200">{user?.email}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Auth Provider</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400 capitalize">{user?.provider || 'password'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Default Currency</span>
              <span className="font-medium text-slate-900 dark:text-slate-200">{user?.currency || 'USD'}</span>
            </div>
          </div>
        </div>

        {/* Firebase Token Security Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Firebase Security</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified ID Token Header</p>
            </div>
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/60 pt-2">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Firebase UID</span>
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{user?.firebaseUid}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Token Verification</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Active
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">API Interceptor</span>
              <span className="font-medium text-slate-900 dark:text-slate-200">Bearer Auto-Inject</span>
            </div>
          </div>
        </div>

        {/* Database Record Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Database Record</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">SQLite Prisma Store</p>
            </div>
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/60 pt-2">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">DB User ID</span>
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{user?.id}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Created At</span>
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Just now'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 3 Ready Info Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 text-slate-100 dark:bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-base flex items-center text-white">
            <Zap className="w-4 h-4 text-amber-400 mr-2" /> Ready for Phase 3 Module Integration
          </h3>
          <p className="text-xs text-slate-400">
            Authentication context and API Bearer token injection are ready to secure Expenses, Subscriptions, Bill Split, and Analytics.
          </p>
        </div>
        <Link to="/settings">
          <Button variant="outline" className="text-xs border-slate-700 text-slate-200 hover:bg-slate-800" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Account Settings
          </Button>
        </Link>
      </div>
    </div>
  );
};
