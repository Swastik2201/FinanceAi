export interface UserProfile {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  photoURL?: string;
  currency: string;
  createdAt: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  firebaseUid: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
}

export interface DashboardSummaryData {
  period: string;
  currency: string;
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  previousPeriod: {
    income: number;
    expenses: number;
    savings: number;
  };
  hasData: boolean;
}

export interface Subscription {
  id: string;
  firebaseUid: string;
  name: string;
  category: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextRenewalDate: string; // YYYY-MM-DD
  status: 'active' | 'paused';
  iconName?: string;
}

export interface SplitMember {
  id: string;
  name: string;
  amount: number;
  settled: boolean;
}

export interface BillSplit {
  id: string;
  firebaseUid: string;
  title: string;
  category: string;
  totalAmount: number;
  date: string;
  paidBy: string; // Name of person who paid
  members: SplitMember[];
  settled: boolean;
}

export interface UserSettings {
  firebaseUid: string;
  currency: string;
  monthlyBudget: number;
  notificationsEnabled: boolean;
  themePreference: 'light' | 'dark';
  orangeMode: boolean;
}

// In-memory data store with user isolation
class FinanceDataStore {
  private users: Map<string, UserProfile> = new Map();
  private transactions: Transaction[] = [];
  private subscriptions: Subscription[] = [];
  private billSplits: BillSplit[] = [];
  private userSettings: Map<string, UserSettings> = new Map();

  constructor() {
    this.seedInitialDemoData();
  }

  private seedInitialDemoData() {
    const demoUid = 'user_demo_123';
    this.users.set(demoUid, {
      id: 'usr_1',
      firebaseUid: demoUid,
      name: 'Swastik',
      email: 'swastik@example.com',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      currency: 'INR',
      createdAt: new Date().toISOString(),
    });

    this.userSettings.set(demoUid, {
      firebaseUid: demoUid,
      currency: 'INR',
      monthlyBudget: 50000,
      notificationsEnabled: true,
      themePreference: 'light',
      orangeMode: true,
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const formatDate = (year: number, month: number, day: number) => {
      const d = new Date(year, month, day);
      return d.toISOString();
    };

    // Transactions
    this.transactions.push(
      {
        id: 'tx_1',
        firebaseUid: demoUid,
        amount: 60000,
        type: 'income',
        category: 'Salary',
        description: 'Monthly Salary Credit',
        date: formatDate(currentYear, currentMonth, 1),
      },
      {
        id: 'tx_2',
        firebaseUid: demoUid,
        amount: 4500,
        type: 'expense',
        category: 'Groceries',
        description: 'Supermarket shopping',
        date: formatDate(currentYear, currentMonth, 3),
      },
      {
        id: 'tx_3',
        firebaseUid: demoUid,
        amount: 2200,
        type: 'expense',
        category: 'Utilities',
        description: 'Electricity & Wifi',
        date: formatDate(currentYear, currentMonth, 5),
      },
      {
        id: 'tx_4',
        firebaseUid: demoUid,
        amount: 1550,
        type: 'expense',
        category: 'Dining',
        description: 'Weekend dinner',
        date: formatDate(currentYear, currentMonth, 7),
      },
      {
        id: 'tx_5',
        firebaseUid: demoUid,
        amount: 6500,
        type: 'expense',
        category: 'Subscriptions & Software',
        description: 'SaaS tools & Streaming',
        date: formatDate(currentYear, currentMonth, 10),
      }
    );

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    this.transactions.push(
      {
        id: 'tx_6',
        firebaseUid: demoUid,
        amount: 55000,
        type: 'income',
        category: 'Salary',
        description: 'Monthly Salary Credit',
        date: formatDate(prevYear, prevMonth, 1),
      },
      {
        id: 'tx_7',
        firebaseUid: demoUid,
        amount: 9000,
        type: 'expense',
        category: 'Rent',
        description: 'House rent',
        date: formatDate(prevYear, prevMonth, 2),
      },
      {
        id: 'tx_8',
        firebaseUid: demoUid,
        amount: 7000,
        type: 'expense',
        category: 'Shopping',
        description: 'Electronics & apparel',
        date: formatDate(prevYear, prevMonth, 12),
      }
    );

    // Initial Demo Subscriptions
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    const inTwoWeeks = new Date(now);
    inTwoWeeks.setDate(now.getDate() + 14);

    this.subscriptions.push(
      {
        id: 'sub_1',
        firebaseUid: demoUid,
        name: 'Netflix Premium',
        category: 'Entertainment',
        amount: 649,
        billingCycle: 'monthly',
        nextRenewalDate: nextWeek.toISOString().split('T')[0],
        status: 'active',
        iconName: 'Tv',
      },
      {
        id: 'sub_2',
        firebaseUid: demoUid,
        name: 'Spotify Family',
        category: 'Music & Audio',
        amount: 179,
        billingCycle: 'monthly',
        nextRenewalDate: inTwoWeeks.toISOString().split('T')[0],
        status: 'active',
        iconName: 'Music',
      },
      {
        id: 'sub_3',
        firebaseUid: demoUid,
        name: 'AWS Cloud Hosting',
        category: 'Developer Tools',
        amount: 2400,
        billingCycle: 'monthly',
        nextRenewalDate: formatDate(currentYear, currentMonth, 28).split('T')[0],
        status: 'active',
        iconName: 'Server',
      },
      {
        id: 'sub_4',
        firebaseUid: demoUid,
        name: 'Gym Membership',
        category: 'Fitness',
        amount: 15000,
        billingCycle: 'yearly',
        nextRenewalDate: formatDate(currentYear + 1, 0, 15).split('T')[0],
        status: 'active',
        iconName: 'Dumbbell',
      }
    );

    // Initial Demo Bill Splits
    this.transactions;
    this.billSplits.push(
      {
        id: 'bs_1',
        firebaseUid: demoUid,
        title: 'Friday Night Bistro Dinner',
        category: 'Dining',
        totalAmount: 4800,
        date: formatDate(currentYear, currentMonth, 4).split('T')[0],
        paidBy: 'Swastik',
        settled: false,
        members: [
          { id: 'm1', name: 'Swastik', amount: 1200, settled: true },
          { id: 'm2', name: 'Aarav', amount: 1200, settled: true },
          { id: 'm3', name: 'Riya', amount: 1200, settled: false },
          { id: 'm4', name: 'Priya', amount: 1200, settled: false },
        ],
      },
      {
        id: 'bs_2',
        firebaseUid: demoUid,
        title: 'Goa Weekend Villa Booking',
        category: 'Travel',
        totalAmount: 16000,
        date: formatDate(currentYear, currentMonth, 2).split('T')[0],
        paidBy: 'Aarav',
        settled: false,
        members: [
          { id: 'm1', name: 'Swastik', amount: 4000, settled: false },
          { id: 'm2', name: 'Aarav', amount: 4000, settled: true },
          { id: 'm3', name: 'Rohan', amount: 4000, settled: true },
          { id: 'm4', name: 'Karan', amount: 4000, settled: false },
        ],
      }
    );
  }

  // User Profile
  public getOrCreateUser(firebaseUid: string, email: string, name?: string, photoURL?: string): UserProfile {
    let user = this.users.get(firebaseUid);
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        firebaseUid,
        name: name || email.split('@')[0] || 'User',
        email,
        photoURL,
        currency: 'INR',
        createdAt: new Date().toISOString(),
      };
      this.users.set(firebaseUid, user);
    } else {
      if (name && user.name !== name) user.name = name;
      if (photoURL && user.photoURL !== photoURL) user.photoURL = photoURL;
    }
    return user;
  }

  public getUser(firebaseUid: string): UserProfile | null {
    return this.users.get(firebaseUid) || null;
  }

  public updateUser(firebaseUid: string, updates: Partial<UserProfile>): UserProfile | null {
    const user = this.users.get(firebaseUid);
    if (!user) return null;
    const updated = { ...user, ...updates };
    this.users.set(firebaseUid, updated);
    return updated;
  }

  // User Settings
  public getUserSettings(firebaseUid: string): UserSettings {
    let settings = this.userSettings.get(firebaseUid);
    if (!settings) {
      const user = this.getUser(firebaseUid);
      settings = {
        firebaseUid,
        currency: user?.currency || 'INR',
        monthlyBudget: 50000,
        notificationsEnabled: true,
        themePreference: 'light',
        orangeMode: true,
      };
      this.userSettings.set(firebaseUid, settings);
    }
    return settings;
  }

  public updateUserSettings(firebaseUid: string, updates: Partial<UserSettings>): UserSettings {
    const current = this.getUserSettings(firebaseUid);
    const updated = { ...current, ...updates };
    this.userSettings.set(firebaseUid, updated);
    if (updates.currency) {
      const user = this.users.get(firebaseUid);
      if (user) {
        user.currency = updates.currency;
      }
    }
    return updated;
  }

  // Transactions
  public addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTx: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    this.transactions.push(newTx);
    return newTx;
  }

  public getUserTransactions(firebaseUid: string): Transaction[] {
    return this.transactions.filter((tx) => tx.firebaseUid === firebaseUid);
  }

  // Subscriptions
  public getUserSubscriptions(firebaseUid: string): Subscription[] {
    return this.subscriptions.filter((sub) => sub.firebaseUid === firebaseUid);
  }

  public addSubscription(subscription: Omit<Subscription, 'id'>): Subscription {
    const newSub: Subscription = {
      ...subscription,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    this.subscriptions.push(newSub);
    return newSub;
  }

  public toggleSubscriptionStatus(firebaseUid: string, subId: string): Subscription | null {
    const sub = this.subscriptions.find((s) => s.id === subId && s.firebaseUid === firebaseUid);
    if (!sub) return null;
    sub.status = sub.status === 'active' ? 'paused' : 'active';
    return sub;
  }

  public deleteSubscription(firebaseUid: string, subId: string): boolean {
    const idx = this.subscriptions.findIndex((s) => s.id === subId && s.firebaseUid === firebaseUid);
    if (idx !== -1) {
      this.subscriptions.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Bill Splits
  public getUserBillSplits(firebaseUid: string): BillSplit[] {
    return this.billSplits.filter((bs) => bs.firebaseUid === firebaseUid);
  }

  public addBillSplit(billSplit: Omit<BillSplit, 'id'>): BillSplit {
    const newBs: BillSplit = {
      ...billSplit,
      id: `bs_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    this.billSplits.push(newBs);
    return newBs;
  }

  public toggleMemberSettled(firebaseUid: string, billSplitId: string, memberId: string): BillSplit | null {
    const bs = this.billSplits.find((b) => b.id === billSplitId && b.firebaseUid === firebaseUid);
    if (!bs) return null;
    const member = bs.members.find((m) => m.id === memberId);
    if (member) {
      member.settled = !member.settled;
      bs.settled = bs.members.every((m) => m.settled);
    }
    return bs;
  }

  public deleteBillSplit(firebaseUid: string, billSplitId: string): boolean {
    const idx = this.billSplits.findIndex((b) => b.id === billSplitId && b.firebaseUid === firebaseUid);
    if (idx !== -1) {
      this.billSplits.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Date Range Helper
  private getDateRange(period: string): { start: Date; end: Date; prevStart: Date; prevEnd: Date } {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    let start = new Date(now.getFullYear(), now.getMonth(), 1);
    let prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    let prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    switch (period) {
      case 'last_month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59);
        return { start, end: lastMonthEnd, prevStart, prevEnd };

      case 'last_3_months':
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        prevStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        prevEnd = new Date(now.getFullYear(), now.getMonth() - 2, 0, 23, 59, 59);
        break;

      case 'this_year':
        start = new Date(now.getFullYear(), 0, 1);
        prevStart = new Date(now.getFullYear() - 1, 0, 1);
        prevEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;

      case 'this_month':
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
    }

    return { start, end, prevStart, prevEnd };
  }

  // Dashboard Summary
  public getDashboardSummary(firebaseUid: string, period: string = 'this_month'): DashboardSummaryData {
    const user = this.getUser(firebaseUid);
    const settings = this.getUserSettings(firebaseUid);
    const currency = settings.currency || user?.currency || 'INR';

    const userTxs = this.getUserTransactions(firebaseUid);
    const hasData = userTxs.length > 0;

    const { start, end, prevStart, prevEnd } = this.getDateRange(period);

    let income = 0;
    let expenses = 0;
    let prevIncome = 0;
    let prevExpenses = 0;
    let totalIncomeLifetime = 0;
    let totalExpensesLifetime = 0;

    userTxs.forEach((tx) => {
      const txDate = new Date(tx.date);

      if (tx.type === 'income') {
        totalIncomeLifetime += tx.amount;
      } else if (tx.type === 'expense') {
        totalExpensesLifetime += tx.amount;
      }

      if (txDate >= start && txDate <= end) {
        if (tx.type === 'income') {
          income += tx.amount;
        } else if (tx.type === 'expense') {
          expenses += tx.amount;
        }
      }

      if (txDate >= prevStart && txDate <= prevEnd) {
        if (tx.type === 'income') {
          prevIncome += tx.amount;
        } else if (tx.type === 'expense') {
          prevExpenses += tx.amount;
        }
      }
    });

    const savings = income - expenses;
    const savingsRate = income > 0 ? Number(((savings / income) * 100).toFixed(2)) : 0;
    const balance = totalIncomeLifetime - totalExpensesLifetime;
    const prevSavings = prevIncome - prevExpenses;

    return {
      period,
      currency,
      balance,
      income,
      expenses,
      savings,
      savingsRate,
      previousPeriod: {
        income: prevIncome,
        expenses: prevExpenses,
        savings: prevSavings,
      },
      hasData,
    };
  }

  // Analytics Metrics & AI Recommendations
  public getAnalyticsData(firebaseUid: string) {
    const userTxs = this.getUserTransactions(firebaseUid);
    const settings = this.getUserSettings(firebaseUid);
    const currency = settings.currency;

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    let totalExpenses = 0;
    let totalIncome = 0;

    userTxs.forEach((tx) => {
      if (tx.type === 'expense') {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        totalExpenses += tx.amount;
      } else {
        totalIncome += tx.amount;
      }
    });

    const categories = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    })).sort((a, b) => b.amount - a.amount);

    // AI Financial Insights
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
    const budgetUtilization = settings.monthlyBudget > 0 ? Math.round((totalExpenses / settings.monthlyBudget) * 100) : 0;

    const insights = [];
    if (savingsRate >= 20) {
      insights.push({
        type: 'success',
        title: 'Strong Savings Rate',
        description: `You saved ${savingsRate}% of your income. Great discipline maintaining financial health!`,
      });
    } else {
      insights.push({
        type: 'warning',
        title: 'Low Savings Margin',
        description: `Your savings rate is ${savingsRate}%. Try aiming for a 20%+ target by trimming non-essential subscriptions or dining expenses.`,
      });
    }

    if (budgetUtilization > 85) {
      insights.push({
        type: 'alert',
        title: 'Budget Threshold Reached',
        description: `You have consumed ${budgetUtilization}% of your monthly budget limit of ${currency} ${settings.monthlyBudget.toLocaleString()}.`,
      });
    } else {
      insights.push({
        type: 'info',
        title: 'Budget Status Healthy',
        description: `You are within budget limits at ${budgetUtilization}% utilization.`,
      });
    }

    return {
      currency,
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      savingsRate,
      monthlyBudget: settings.monthlyBudget,
      budgetUtilization,
      categories,
      insights,
    };
  }
}

export const dbStore = new FinanceDataStore();
