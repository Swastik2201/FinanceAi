import React, { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { PeriodSelector, PeriodOption, periodLabels } from '../components/dashboard/PeriodSelector';
import { StatCard } from '../components/dashboard/StatCard';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { DashboardErrorState } from '../components/dashboard/DashboardErrorState';
import { QuickActions } from '../components/dashboard/QuickActions';

import { fetchUserProfile, UserProfileResponse } from '../services/userService';
import { fetchDashboardSummary, DashboardSummary, addSampleTransaction } from '../services/dashboardService';
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfileResponse['user'] | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [period, setPeriod] = useState<PeriodOption>('this_month');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load User Profile
  const loadProfile = useCallback(async () => {
    try {
      const data = await fetchUserProfile();
      setUserProfile(data);
    } catch (err) {
      console.warn('Failed to load user profile, falling back to default info', err);
    }
  }, []);

  // Load Dashboard Summary for selected period
  const loadDashboardData = useCallback(async (selectedPeriod: PeriodOption) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardSummary(selectedPeriod);
      setSummary(data);
    } catch (err: any) {
      console.error('Error loading dashboard summary:', err);
      setError(err.response?.data?.error || 'Unable to connect to financial servers. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    loadDashboardData(period);
  }, [period, loadDashboardData]);

  const handlePeriodChange = (newPeriod: PeriodOption) => {
    setPeriod(newPeriod);
  };

  const handleSeedSampleData = async () => {
    try {
      setLoading(true);
      await addSampleTransaction({
        amount: 45000,
        type: 'income',
        category: 'Salary',
        description: 'Monthly salary',
      });
      await addSampleTransaction({
        amount: 12000,
        type: 'expense',
        category: 'Rent',
        description: 'Apartment rent',
      });
      await loadDashboardData(period);
    } catch (err) {
      setError('Failed to seed sample data');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userProfile={userProfile} pageTitle="Dashboard">
      <div className="space-y-6 pb-12">
        {/* Welcome Banner */}
        <WelcomeSection
          userName={userProfile?.name || 'Swastik'}
          selectedPeriod={periodLabels[period]}
        />

        {/* Section Header & Period Selector */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              Financial Overview
            </h2>
            <p className="text-xs text-muted-foreground">
              Summary metrics for <span className="font-semibold text-foreground">{periodLabels[period]}</span>
            </p>
          </div>

          <PeriodSelector
            selectedPeriod={period}
            onPeriodChange={handlePeriodChange}
            disabled={loading}
          />
        </div>

        {/* Main Content States */}
        {loading ? (
          <DashboardSkeleton />
        ) : error ? (
          <DashboardErrorState
            message={error}
            onRetry={() => loadDashboardData(period)}
          />
        ) : !summary?.hasData && summary?.balance === 0 && summary?.income === 0 && summary?.expenses === 0 ? (
          <DashboardEmptyState onSeedSampleData={handleSeedSampleData} />
        ) : summary ? (
          <div className="space-y-6">
            {/* Quick Statistics Cards (4 Columns) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 — Total Balance */}
              <StatCard
                title="Total Balance"
                amount={summary.balance}
                currency={summary.currency}
                subtitle={`in ${periodLabels[period]}`}
                icon={Wallet}
                iconBgColor="bg-primary/10"
                iconTextColor="text-primary"
              />

              {/* Card 2 — Income */}
              <StatCard
                title="Income"
                amount={summary.income}
                currency={summary.currency}
                previousAmount={summary.previousPeriod.income}
                subtitle="from last period"
                icon={ArrowUpRight}
                iconBgColor="bg-emerald-500/10"
                iconTextColor="text-emerald-500"
              />

              {/* Card 3 — Expenses */}
              <StatCard
                title="Expenses"
                amount={summary.expenses}
                currency={summary.currency}
                previousAmount={summary.previousPeriod.expenses}
                subtitle="from last period"
                icon={ArrowDownRight}
                iconBgColor="bg-rose-500/10"
                iconTextColor="text-rose-500"
                isExpense={true}
              />

              {/* Card 4 — Savings */}
              <StatCard
                title="Savings"
                amount={summary.savings}
                currency={summary.currency}
                savingsRate={summary.savingsRate}
                subtitle="savings rate"
                icon={PiggyBank}
                iconBgColor="bg-amber-500/10"
                iconTextColor="text-amber-500"
              />
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};
