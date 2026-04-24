import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameRule, GameSchedule, GAME_LIST, GAME_CATEGORIES } from '../../models/game-rule.model';
import { IconBtnComponent } from '../../components/atoms/icon-btn/icon-btn';

@Component({
  selector: 'page-jogos',
  imports: [FormsModule, IconBtnComponent],
  templateUrl: './jogos.html',
  styleUrl: './jogos.scss',
})
export class JogosPage {
  games = signal<GameRule[]>(structuredClone(GAME_LIST));
  readonly catLabels = GAME_CATEGORIES;

  schedule = signal<GameSchedule>({ allowedFrom: '18:00', allowedUntil: '23:00' });
  editingSchedule = signal(false);
  scheduleFrom = '18:00';
  scheduleUntil = '23:00';

  editingGame = signal<GameRule | null>(null);
  formLimit: number | null = null;
  hasLimit = false;

  get blockedCount(): number {
    return this.games().filter(g => g.blocked).length;
  }

  get limitedCount(): number {
    return this.games().filter(g => g.timeLimitMin !== null).length;
  }

  toggleBlock(game: GameRule) {
    this.games.update(list => list.map(g =>
      g.id === game.id ? { ...g, blocked: !g.blocked } : g
    ));
  }

  openEdit(game: GameRule) {
    this.editingGame.set(game);
    this.formLimit = game.timeLimitMin;
    this.hasLimit = game.timeLimitMin !== null;
  }

  closeEdit() {
    this.editingGame.set(null);
  }

  saveEdit() {
    const editing = this.editingGame();
    if (!editing) return;
    const limit = this.hasLimit ? (this.formLimit ?? 60) : null;
    this.games.update(list => list.map(g =>
      g.id === editing.id ? { ...g, timeLimitMin: limit } : g
    ));
    this.closeEdit();
  }

  clearRules(game: GameRule) {
    this.games.update(list => list.map(g =>
      g.id === game.id ? { ...g, blocked: false, timeLimitMin: null } : g
    ));
  }

  openSchedule() {
    const s = this.schedule();
    this.scheduleFrom = s.allowedFrom;
    this.scheduleUntil = s.allowedUntil;
    this.editingSchedule.set(true);
  }

  closeSchedule() {
    this.editingSchedule.set(false);
  }

  saveSchedule() {
    this.schedule.set({ allowedFrom: this.scheduleFrom, allowedUntil: this.scheduleUntil });
    this.editingSchedule.set(false);
  }

  formatLimit(min: number): string {
    if (min < 60) return `${min}min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h${m}min` : `${h}h`;
  }
}
