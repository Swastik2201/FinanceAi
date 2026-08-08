import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
  Settings,
  Sun,
  Moon,
  Flame,
  CheckCircle2,
  DollarSign,
  User,
  Bell,
  Wallet,
  Save,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchUserSettings, updateUserSettings, UserSettings } from '../services/settingsService';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, isOrangeMode, setOrangeMode } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [currency, setCurrency] = useState('INR');
  const [monthlyBudget, setMonthlyBudget] = useState('50000');
  const [name, setName] = useState('Swastik');
  const [email, setEmail] = useState('swastik@example.com');
  const [notifications, setNotifications] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await fetchUserSettings();
        setSettings(res);
        setCurrency(res.currency);
        setMonthlyBudget(String(res.monthlyBudget));
        setNotifications(res.notificationsEnabled);
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserSettings({
        currency,
        monthlyBudget: parseFloat(monthlyBudget),
        notificationsEnabled: notifications,
        orangeMode: isOrangeMode,
      });
      setSuccessMsg('Settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  return (
    <DashboardLayout pageTitle="Settings">
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Account & Preference Settings
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your visual themes, default currency, budget limits, and profile information.
          </p>
        </div>

        {successMsg && (
          <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Visual Theme Customizer (Featuring Orange Mode) */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-primary" />
              App Theme & Appearance
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Select your favorite interface style, dark mode contrast, or Vibrant Orange Accent Mode.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Light Mode Card */}
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  setOrangeMode(false);
                }}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  theme === 'light' && !isOrangeMode
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-card text-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800 border">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold">Light Mode</p>
                    <p className="text-[10px] text-muted-foreground">Classic clean design</p>
                  </div>
                </div>
                {theme === 'light' && !isOrangeMode && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </button>

              {/* Dark Mode Card */}
              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  setOrangeMode(false);
                }}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  theme === 'dark' && !isOrangeMode
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-card text-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-slate-100 border border-slate-700">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold">Dark Mode</p>
                    <p className="text-[10px] text-muted-foreground">Sleek obsidian theme</p>
                  </div>
                </div>
                {theme === 'dark' && !isOrangeMode && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </button>

              {/* Orange Mode Card (Vibrant Orange Branch Special) */}
              <button
                type="button"
                onClick={() => setOrangeMode(true)}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  isOrangeMode
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm'
                    : 'border-border bg-card text-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/30">
                    <Flame className="h-5 w-5 fill-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black">Orange Mode</p>
                    <p className="text-[10px] text-muted-foreground">Vibrant warm orange</p>
                  </div>
                </div>
                {isOrangeMode && <CheckCircle2 className="h-4 w-4 text-orange-500" />}
              </button>
            </div>
          </div>

          {/* Section 2: Preferences & Currency */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Financial Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Default Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="INR">Indian Rupee (₹ INR)</option>
                  <option value="USD">US Dollar ($ USD)</option>
                  <option value="EUR">Euro (€ EUR)</option>
                  <option value="GBP">British Pound (£ GBP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Monthly Target Budget Ceiling
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm text-muted-foreground font-bold">
                    {currency === 'INR' ? '₹' : '$'}
                  </span>
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card pl-8 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Profile Information */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              User Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
            >
              <Save className="h-4 w-4" />
              Save Preference Settings
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
