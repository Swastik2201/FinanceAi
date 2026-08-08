export interface DbUser {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  provider: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: DbUser | null;
  firebaseUser: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}
