import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { AuthResponse, AuthState, LoginRequest, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'll_token';
const USER_KEY  = 'll_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  // Angular 17+ signals for reactive auth state
  private _state = signal<AuthState | null>(this.loadState());
  readonly isAuthenticated = computed(() => !!this._state());
  readonly currentUser     = computed(() => this._state());

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.api}/register`, request)
      .pipe(tap(res => this.persistState(res)));
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.api}/login`, request)
      .pipe(tap(res => this.persistState(res)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._state.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private persistState(res: AuthResponse) {
    const state: AuthState = { token: res.token, userId: res.userId, name: res.name, email: res.email };
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(state));
    this._state.set(state);
  }

  private loadState(): AuthState | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
