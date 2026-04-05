import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'lifeledger-theme';

  readonly current = signal<Theme>(this.loadTheme());

  toggle() {
    const next: Theme = this.current() === 'dark' ? 'light' : 'dark';
    this.apply(next);
  }

  apply(theme: Theme) {
    this.current.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    const theme = stored ?? 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    return theme;
  }
}
