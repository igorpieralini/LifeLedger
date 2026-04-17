import { Component, input, model, output, signal, computed, ElementRef, HostListener } from '@angular/core';

const MONTH_NAMES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

@Component({
  selector: 'atom-date-range',
  templateUrl: './atom-date-range.html',
  styleUrl: './atom-date-range.scss',
})
export class AtomDateRange {
  label = input<string>('');
  labelFrom = input<string>('De');
  labelTo = input<string>('Até');
  disabled = input<boolean>(false);

  dateFrom = model<string>('');
  dateTo = model<string>('');

  changed = output<{ from: string; to: string }>();

  /** Which field opened the calendar: 'from' | 'to' | null */
  activeField = signal<'from' | 'to' | null>(null);

  viewYear = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth()); // 0-based

  readonly weekdays = WEEKDAYS;

  monthLabel = computed(() => `${MONTH_NAMES[this.viewMonth()]} de ${this.viewYear()}`);

  calendarDays = computed(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    const cells: { day: number; month: number; year: number; outside: boolean }[] = [];

    // Previous month fill
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevDays - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      cells.push({ day: d, month: m, year: y, outside: true });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, month, year, outside: false });
    }
    // Next month fill
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      for (let d = 1; d <= remaining; d++) {
        cells.push({ day: d, month: nm, year: ny, outside: true });
      }
    }
    return cells;
  });

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.activeField.set(null);
    }
  }

  openCalendar(field: 'from' | 'to') {
    if (this.disabled()) return;
    if (this.activeField() === field) {
      this.activeField.set(null);
      return;
    }
    // Set view to existing date or today
    const existing = field === 'from' ? this.dateFrom() : this.dateTo();
    if (existing) {
      const [y, m] = existing.split('-').map(Number);
      this.viewYear.set(y);
      this.viewMonth.set(m - 1);
    } else {
      const now = new Date();
      this.viewYear.set(now.getFullYear());
      this.viewMonth.set(now.getMonth());
    }
    this.activeField.set(field);
  }

  prevMonth() {
    if (this.viewMonth() === 0) {
      this.viewMonth.set(11);
      this.viewYear.update(y => y - 1);
    } else {
      this.viewMonth.update(m => m - 1);
    }
  }

  nextMonth() {
    if (this.viewMonth() === 11) {
      this.viewMonth.set(0);
      this.viewYear.update(y => y + 1);
    } else {
      this.viewMonth.update(m => m + 1);
    }
  }

  selectDay(cell: { day: number; month: number; year: number }) {
    const iso = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
    if (this.activeField() === 'from') {
      this.dateFrom.set(iso);
    } else {
      this.dateTo.set(iso);
    }
    this.activeField.set(null);
    this.changed.emit({ from: this.dateFrom(), to: this.dateTo() });
  }

  clearCalendar() {
    if (this.activeField() === 'from') {
      this.dateFrom.set('');
    } else {
      this.dateTo.set('');
    }
    this.activeField.set(null);
    this.changed.emit({ from: this.dateFrom(), to: this.dateTo() });
  }

  selectToday() {
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (this.activeField() === 'from') {
      this.dateFrom.set(iso);
    } else {
      this.dateTo.set(iso);
    }
    this.activeField.set(null);
    this.changed.emit({ from: this.dateFrom(), to: this.dateTo() });
  }

  isSelected(cell: { day: number; month: number; year: number }): boolean {
    const iso = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
    const field = this.activeField();
    return field === 'from' ? iso === this.dateFrom() : iso === this.dateTo();
  }

  isToday(cell: { day: number; month: number; year: number }): boolean {
    const now = new Date();
    return cell.day === now.getDate() && cell.month === now.getMonth() && cell.year === now.getFullYear();
  }

  formatDisplay(value: string): string {
    if (!value) return '';
    const [y, m, d] = value.split('-');
    return `${d}/${m}/${y}`;
  }
}
