import { api } from './api';

export interface UserProfileResponse {
  success: boolean;
  user: {
    id: string;
    firebaseUid: string;
    name: string;
    email: string;
    photoURL?: string | null;
    currency: string;
  };
}

export const fetchUserProfile = async (): Promise<UserProfileResponse['user']> => {
  const response = await api.get<UserProfileResponse>('/users/me');
  if (!response.data.success) {
    throw new Error('Failed to fetch user profile');
  }
  return response.data.user;
};
