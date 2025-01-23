export interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export type AuthProvider = 'google' | 'github' | 'credentials';