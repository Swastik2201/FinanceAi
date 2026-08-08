import api from './api';

export interface UserSettings {
  firebaseUid: string;
  currency: string;
  monthlyBudget: number;
  notificationsEnabled: boolean;
  themePreference: 'light' | 'dark';
  orangeMode: boolean;
}

export const fetchUserSettings = async (): Promise<UserSettings> => {
  const response = await api.get('/settings');
  return response.data.settings;
};

export const updateUserSettings = async (updates: Partial<UserSettings>): Promise<UserSettings> => {
  const response = await api.put('/settings', updates);
  return response.data.settings;
};
