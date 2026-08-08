import { api } from './api';

export interface DashboardSummary {
  period: 'this_month' | 'last_month' | 'last_3_months' | 'this_year';
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

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardSummary;
}

export const fetchDashboardSummary = async (period: string = 'this_month'): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummaryResponse>(`/dashboard/summary?period=${period}`);
  if (!response.data.success) {
    throw new Error('Failed to fetch dashboard summary');
  }
  return response.data.data;
};

export const addSampleTransaction = async (data: {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date?: string;
}) => {
  const response = await api.post('/dashboard/transactions', data);
  return response.data;
};
