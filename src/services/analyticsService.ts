import api from './api';

export interface CategoryBreakdown {
  name: string;
  amount: number;
  percentage: number;
}

export interface FinancialInsight {
  type: 'success' | 'warning' | 'alert' | 'info';
  title: string;
  description: string;
}

export interface AnalyticsData {
  currency: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  monthlyBudget: number;
  budgetUtilization: number;
  categories: CategoryBreakdown[];
  insights: FinancialInsight[];
}

export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  const response = await api.get('/analytics');
  return response.data.analytics;
};
