import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AtomInput } from '../../components/atoms/atom-input/atom-input';
import { AtomButton } from '../../components/atoms/atom-button/atom-button';
import { AtomHeading } from '../../components/atoms/atom-heading/atom-heading';
import { AtomText } from '../../components/atoms/atom-text/atom-text';
import { AtomIcon } from '../../components/atoms/atom-icon/atom-icon';
import { AtomChangeTheme } from '../../components/atoms/atom-change-theme/atom-change-theme';
import { AuthApiService } from '../../services/auth-api.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'page-login',
  imports: [AtomInput, AtomButton, AtomHeading, AtomText, AtomIcon, AtomChangeTheme],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  private readonly authApi = inject(AuthApiService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  isRegister = signal(false);
  loading = signal(false);
  errorMsg = signal('');

  name = signal('');
  email = signal('');
  password = signal('');

  toggleMode() {
    this.isRegister.update(v => !v);
    this.errorMsg.set('');
  }

  submit() {
    this.errorMsg.set('');
    this.loading.set(true);

    if (this.isRegister()) {
      this.authApi.register({ name: this.name(), email: this.email(), password: this.password() }).subscribe({
        next: (res) => {
          localStorage.setItem('lifeledger-token', res.token);
          localStorage.setItem('lifeledger-user', JSON.stringify({ userId: res.userId, name: res.name, email: res.email }));
          window.location.href = '/';
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(err.error?.message || 'Erro ao criar conta. Tente novamente.');
        },
      });
    } else {
      this.authApi.login({ email: this.email(), password: this.password() }).subscribe({
        next: (res) => {
          localStorage.setItem('lifeledger-token', res.token);
          localStorage.setItem('lifeledger-user', JSON.stringify({ userId: res.userId, name: res.name, email: res.email }));
          window.location.href = '/';
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(err.error?.message || 'Email ou senha inválidos.');
        },
      });
    }
  }
}
