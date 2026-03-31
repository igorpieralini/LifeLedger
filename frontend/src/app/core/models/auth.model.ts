export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  name: string;
  email: string;
}

export interface AuthState {
  token: string;
  userId: number;
  name: string;
  email: string;
}
