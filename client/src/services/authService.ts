import api from './api';
import { DbUser } from '../types/auth';

export interface SyncUserParams {
  name?: string;
  email?: string;
  photoURL?: string | null;
  provider?: string;
}

export const syncUserProfile = async (params: SyncUserParams = {}): Promise<DbUser> => {
  const response = await api.post<{ success: boolean; user: DbUser }>('/auth/sync', params);
  return response.data.user;
};

export const getCurrentUserProfile = async (): Promise<DbUser> => {
  const response = await api.get<{ success: boolean; user: DbUser }>('/auth/me');
  return response.data.user;
};
