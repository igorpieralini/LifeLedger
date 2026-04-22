import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'll-theme';

  theme = signal<'light' | 'dark'>(this.load());

  toggle() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  }

  private load(): 'light' | 'dark' {
    const saved = localStorage.getItem(this.STORAGE_KEY) as 'light' | 'dark' | null;
    const theme = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.apply(theme);
    return theme;
  }

  private apply(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
