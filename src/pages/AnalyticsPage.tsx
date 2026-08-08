import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Sparkles,
} from 'lucide-react';
import { fetchAnalyticsData, AnalyticsData } from '../services/analyticsService';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetchAnalyticsData();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
      case 'alert':
        return <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-primary shrink-0" />;
    }
  };

  return (
    <DashboardLayout pageTitle="Financial Analytics">
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Financial Analytics & Smart AI Insights
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deep dive into spending category breakdowns, budget utilization, and AI-driven wealth recommendations.
          </p>
        </div>

        {loading || !data ? (
          <div className="space-y-4">
            <div className="h-32 rounded-2xl bg-muted/40 animate-pulse border border-border" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-64 rounded-2xl bg-muted/40 animate-pulse border border-border" />
              <div className="h-64 rounded-2xl bg-muted/40 animate-pulse border border-border" />
            </div>
          </div>
        ) : (
          <>
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="text-xs font-bold uppercase text-muted-foreground block">Total Income</span>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                  <ArrowUpRight className="h-5 w-5" />
                  ₹{data.totalIncome.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="text-xs font-bold uppercase text-muted-foreground block">Total Expenses</span>
                <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1">
                  <ArrowDownRight className="h-5 w-5" />
                  ₹{data.totalExpenses.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="text-xs font-bold uppercase text-muted-foreground block">Net Savings</span>
                <p className="text-2xl font-black text-foreground mt-1.5 flex items-center gap-1">
                  <PiggyBank className="h-5 w-5 text-primary" />
                  ₹{data.netSavings.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="text-xs font-bold uppercase text-muted-foreground block">Savings Margin</span>
                <p className="text-2xl font-black text-primary mt-1.5 flex items-center gap-1">
                  <TrendingUp className="h-5 w-5" />
                  {data.savingsRate}%
                </p>
              </div>
            </div>

            {/* Middle Section: Category Breakdown & Budget Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense Categories Bar Visualization */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <PieChart className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-extrabold text-foreground">Expense Category Distribution</h3>
                </div>

                <div className="space-y-4">
                  {data.categories.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">No expense transactions recorded yet.</p>
                  ) : (
                    data.categories.map((cat, idx) => {
                      const colors = [
                        'bg-primary',
                        'bg-rose-500',
                        'bg-amber-500',
                        'bg-emerald-500',
                        'bg-sky-500',
                        'bg-purple-500',
                      ];
                      const colorClass = colors[idx % colors.length];

                      return (
                        <div key={cat.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-foreground">{cat.name}</span>
                            <span className="text-muted-foreground">
                              ₹{cat.amount.toLocaleString()} ({cat.percentage}%)
                            </span>
                          </div>

                          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                              style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Monthly Budget Utilization Bar */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Monthly Budget Utilization
                    </h3>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      Limit: ₹{data.monthlyBudget.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-6">
                    Track your current spending against your monthly target budget ceiling to prevent overspending.
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-black text-foreground">
                        {data.budgetUtilization}%
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        Spent ₹{data.totalExpenses.toLocaleString()} of ₹{data.monthlyBudget.toLocaleString()}
                      </span>
                    </div>

                    <div className="h-4 w-full rounded-full bg-muted overflow-hidden p-0.5 border border-border">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          data.budgetUtilization > 100
                            ? 'bg-rose-500'
                            : data.budgetUtilization > 80
                            ? 'bg-amber-500'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(data.budgetUtilization, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border bg-accent/40 rounded-xl p-3.5">
                  <p className="text-xs text-accent-foreground font-medium">
                    💡 Tip: You have remaining budget capacity for this month. Consider allocating surplus to high-yield savings.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Insights & Recommendations */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">FinanceAi Smart Recommendations</h3>
                  <p className="text-xs text-muted-foreground">
                    Automated intelligence analyzed your financial ledger.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:bg-muted/60"
                  >
                    {getInsightIcon(insight.type)}
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
