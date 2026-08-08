import api from './api';

export interface Subscription {
  id: string;
  firebaseUid: string;
  name: string;
  category: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextRenewalDate: string;
  status: 'active' | 'paused';
  iconName?: string;
}

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const response = await api.get('/subscriptions');
  return response.data.subscriptions;
};

export const addSubscription = async (data: Omit<Subscription, 'id' | 'firebaseUid' | 'status'>): Promise<Subscription> => {
  const response = await api.post('/subscriptions', data);
  return response.data.subscription;
};

export const toggleSubscriptionStatus = async (id: string): Promise<Subscription> => {
  const response = await api.patch(`/subscriptions/${id}/toggle`);
  return response.data.subscription;
};

export const deleteSubscription = async (id: string): Promise<void> => {
  await api.delete(`/subscriptions/${id}`);
};
