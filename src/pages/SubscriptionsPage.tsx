import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
  CreditCard,
  Plus,
  Tv,
  Music,
  Server,
  Dumbbell,
  Calendar,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  fetchSubscriptions,
  addSubscription,
  toggleSubscriptionStatus,
  deleteSubscription,
  Subscription,
} from '../services/subscriptionService';

export const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [nextRenewalDate, setNextRenewalDate] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      console.error('Failed to fetch subscriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    try {
      await addSubscription({
        name,
        category,
        amount: parseFloat(amount),
        billingCycle,
        nextRenewalDate: nextRenewalDate || new Date().toISOString().split('T')[0],
      });
      setSuccessMsg('Subscription added successfully!');
      setShowAddModal(false);
      setName('');
      setAmount('');
      loadData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to add subscription', err);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleSubscriptionStatus(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscription(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSubs = subscriptions.filter((sub) => {
    if (filter === 'active') return sub.status === 'active';
    if (filter === 'paused') return sub.status === 'paused';
    return true;
  });

  const totalMonthlySpend = subscriptions
    .filter((sub) => sub.status === 'active')
    .reduce((sum, sub) => {
      const monthlyAmount = sub.billingCycle === 'yearly' ? sub.amount / 12 : sub.amount;
      return sum + monthlyAmount;
    }, 0);

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'entertainment':
        return Tv;
      case 'music & audio':
      case 'music':
        return Music;
      case 'developer tools':
      case 'cloud':
        return Server;
      case 'fitness':
        return Dumbbell;
      default:
        return CreditCard;
    }
  };

  return (
    <DashboardLayout pageTitle="Subscriptions Tracker">
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              Subscriptions & Recurring Bills
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keep track of recurring streaming services, SaaS licenses, and membership renewals.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Subscription
          </button>
        </div>

        {successMsg && (
          <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {successMsg}
          </div>
        )}

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted-foreground">Monthly Recurring Burn</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <RefreshCw className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground mt-2">
              ₹{totalMonthlySpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Calculated across active subscriptions</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted-foreground">Active Memberships</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground mt-2">{activeCount}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{subscriptions.length - activeCount} paused</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted-foreground">Upcoming Renewal</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-foreground mt-2 truncate">
              {subscriptions[0]?.name || 'No renewals'}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {subscriptions[0]?.nextRenewalDate ? `Due on ${subscriptions[0].nextRenewalDate}` : 'All up to date'}
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1">
            {(['all', 'active', 'paused'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                  filter === mode
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground font-medium">
            Showing {filteredSubs.length} subscriptions
          </span>
        </div>

        {/* Subscriptions Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-36 rounded-2xl bg-muted/40 animate-pulse border border-border" />
            ))}
          </div>
        ) : filteredSubs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground">No Subscriptions Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Add your recurring bills to stay on top of payment deadlines and monthly burn rates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubs.map((sub) => {
              const IconComponent = getCategoryIcon(sub.category);
              const isPaused = sub.status === 'paused';

              return (
                <div
                  key={sub.id}
                  className={`group relative rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
                    isPaused ? 'border-border opacity-70' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-foreground">{sub.name}</h3>
                        <span className="inline-block text-[11px] font-medium text-muted-foreground">
                          {sub.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        isPaused
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {sub.billingCycle}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <p className="text-xl font-black text-foreground">
                        ₹{sub.amount.toLocaleString()}
                        <span className="text-xs font-normal text-muted-foreground">
                          /{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        Next: {sub.nextRenewalDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(sub.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title={isPaused ? 'Activate Subscription' : 'Pause Subscription'}
                      >
                        {isPaused ? (
                          <PlayCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <PauseCircle className="h-4 w-4 text-amber-500" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete Subscription"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Subscription Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-lg font-extrabold text-foreground mb-4">Add New Subscription</h3>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Netflix, Disney+, GitHub"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Entertainment">Entertainment</option>
                      <option value="Music & Audio">Music & Audio</option>
                      <option value="Developer Tools">Developer Tools</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Software & SaaS">Software & SaaS</option>
                      <option value="Utilities">Utilities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={billingCycle}
                      onChange={(e) => setBillingCycle(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 649"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      Next Renewal
                    </label>
                    <input
                      type="date"
                      value={nextRenewalDate}
                      onChange={(e) => setNextRenewalDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    Save Subscription
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
