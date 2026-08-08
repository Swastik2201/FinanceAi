import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Settings as SettingsIcon, User, Moon, Sun, ShieldCheck, LogOut, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage account preferences and security options</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Details */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Account Overview</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personal details synchronized with database</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Full Name</label>
              <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{user?.name}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Email Address</label>
              <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{user?.email}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Auth Method</label>
              <div className="mt-1 font-semibold text-indigo-600 dark:text-indigo-400 capitalize">{user?.provider || 'password'}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Default Currency</label>
              <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{user?.currency || 'USD'}</div>
            </div>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Appearance Theme</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Toggle light or dark fintech design</p>
              </div>
            </div>
            <Button variant="outline" onClick={toggleTheme} className="text-xs">
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
          </div>
        </div>

        {/* Security & Active Session */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Security & Session</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage your active authentication session</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Sign out of session</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Clears current auth token and redirects to login</p>
            </div>
            <Button variant="danger" onClick={() => logout()} leftIcon={<LogOut className="w-4 h-4" />}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
