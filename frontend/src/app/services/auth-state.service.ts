import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService, AuthResponse, LoginRequest, RegisterRequest } from './auth-api.service';

const TOKEN_KEY = 'lifeledger-token';
const USER_KEY = 'lifeledger-user';

export interface UserInfo {
  userId: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly _user = signal<UserInfo | null>(this.loadUser());
  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  constructor(
    private authApi: AuthApiService,
    private router: Router,
  ) {}

  login(data: LoginRequest): void {
    this.authApi.login(data).subscribe({
      next: (res) => this.handleAuth(res),
      error: (err) => { throw err; },
    });
  }

  register(data: RegisterRequest): void {
    this.authApi.register(data).subscribe({
      next: (res) => this.handleAuth(res),
      error: (err) => { throw err; },
    });
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuth(res: AuthResponse): void {
    const user: UserInfo = { userId: res.userId, name: res.name, email: res.email };
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._token.set(res.token);
    this._user.set(user);
    this.router.navigate(['/dashboard']);
  }

  private loadUser(): UserInfo | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
}
