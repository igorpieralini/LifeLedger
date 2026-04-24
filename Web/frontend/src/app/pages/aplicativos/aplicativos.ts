import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRule, APP_LIST, APP_CATEGORIES } from '../../models/app-rule.model';
import { IconBtnComponent } from '../../components/atoms/icon-btn/icon-btn';

@Component({
  selector: 'page-aplicativos',
  imports: [FormsModule, IconBtnComponent],
  templateUrl: './aplicativos.html',
  styleUrl: './aplicativos.scss',
})
export class AplicativosPage {
  apps = signal<AppRule[]>(structuredClone(APP_LIST));
  readonly catLabels = APP_CATEGORIES;

  // Editing
  editingApp = signal<AppRule | null>(null);
  formLimit: number | null = null;
  formFrom: string | null = null;
  formUntil: string | null = null;
  hasLimit = false;
  hasSchedule = false;

  get blockedCount(): number {
    return this.apps().filter(a => a.blocked).length;
  }

  get limitedCount(): number {
    return this.apps().filter(a => a.timeLimitMin !== null).length;
  }

  get scheduledCount(): number {
    return this.apps().filter(a => a.allowedFrom !== null).length;
  }

  toggleBlock(app: AppRule) {
    this.apps.update(list => list.map(a =>
      a.id === app.id ? { ...a, blocked: !a.blocked } : a
    ));
  }

  openEdit(app: AppRule) {
    this.editingApp.set(app);
    this.formLimit = app.timeLimitMin;
    this.formFrom = app.allowedFrom;
    this.formUntil = app.allowedUntil;
    this.hasLimit = app.timeLimitMin !== null;
    this.hasSchedule = app.allowedFrom !== null;
  }

  closeEdit() {
    this.editingApp.set(null);
  }

  saveEdit() {
    const editing = this.editingApp();
    if (!editing) return;

    const limit = this.hasLimit ? (this.formLimit ?? 60) : null;
    const from = this.hasSchedule ? (this.formFrom ?? '08:00') : null;
    const until = this.hasSchedule ? (this.formUntil ?? '22:00') : null;

    this.apps.update(list => list.map(a =>
      a.id === editing.id
        ? { ...a, timeLimitMin: limit, allowedFrom: from, allowedUntil: until }
        : a
    ));
    this.closeEdit();
  }

  clearRules(app: AppRule) {
    this.apps.update(list => list.map(a =>
      a.id === app.id
        ? { ...a, blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null }
        : a
    ));
  }

  formatLimit(min: number): string {
    if (min < 60) return `${min}min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h${m}min` : `${h}h`;
  }
}
