import { Injectable, signal } from '@angular/core';

export interface AlertItem {
  id: number;
  message: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  icon?: string;
  duration?: number;
}

const DEFAULT_ICONS: Record<string, string> = {
  success: 'check_circle',
  danger: 'error',
  warning: 'warning',
  info: 'info',
};

@Injectable({ providedIn: 'root' })
export class AlertService {
  private nextId = 0;
  readonly alerts = signal<AlertItem[]>([]);

  show(message: string, variant: AlertItem['variant'] = 'info', duration = 4000) {
    const item: AlertItem = {
      id: this.nextId++,
      message,
      variant,
      icon: DEFAULT_ICONS[variant],
      duration,
    };
    this.alerts.update(list => [...list, item]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(item.id), duration);
    }
  }

  success(message: string, duration?: number) { this.show(message, 'success', duration); }
  danger(message: string, duration?: number) { this.show(message, 'danger', duration); }
  warning(message: string, duration?: number) { this.show(message, 'warning', duration); }
  info(message: string, duration?: number) { this.show(message, 'info', duration); }

  dismiss(id: number) {
    this.alerts.update(list => list.filter(a => a.id !== id));
  }
}
