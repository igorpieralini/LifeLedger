import { Component, inject, OnInit, signal, computed, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutineService } from '../../services/routine.service';
import {
  RoutineEvent, RoutineEventRequest,
  DAYS_OF_WEEK, EVENT_COLORS,
} from '../../models/routine.model';
import { IconBtnComponent } from '../../components/atoms/icon-btn/icon-btn';

@Component({
  selector: 'page-calendario',
  imports: [FormsModule, IconBtnComponent],
  templateUrl: './calendario.html',
  styleUrl: './calendario.scss',
})
export class CalendarioPage implements OnInit {
  private readonly api = inject(RoutineService);

  readonly days = DAYS_OF_WEEK;
  readonly colors = EVENT_COLORS;
  readonly hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6:00 - 23:00

  events = signal<RoutineEvent[]>([]);

  // Form state
  showForm = signal(false);
  editingEvent = signal<RoutineEvent | null>(null);
  formTitle = '';
  formDay = 1;
  formStart = '08:00';
  formEnd = '09:00';
  formColor = '#6366f1';

  // Drag state
  dragging = signal(false);
  dragDay = -1;
  dragStartHour = -1;
  dragEndHour = -1;

  // Week navigation
  weekOffset = signal(0);

  weekDates = computed(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek + this.weekOffset() * 7);

    return this.days.map((d, i) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      return {
        ...d,
        date: date.getDate(),
        month: date.getMonth(),
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      };
    });
  });

  weekLabel = computed(() => {
    const dates = this.weekDates();
    const first = dates[0];
    const last = dates[6];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    if (first.month === last.month) {
      return `${first.date} - ${last.date} ${months[first.month]}`;
    }
    return `${first.date} ${months[first.month]} - ${last.date} ${months[last.month]}`;
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.list().subscribe(events => this.events.set(events));
  }

  prevWeek() { this.weekOffset.update(v => v - 1); }
  nextWeek() { this.weekOffset.update(v => v + 1); }
  goToday() { this.weekOffset.set(0); }

  getEventsForDay(dayOfWeek: number): RoutineEvent[] {
    return this.events().filter(e => e.dayOfWeek === dayOfWeek);
  }

  getEventStyle(event: RoutineEvent) {
    const [sh, sm] = event.startTime.split(':').map(Number);
    const [eh, em] = event.endTime.split(':').map(Number);
    const startMin = (sh - 6) * 60 + sm;
    const duration = (eh - sh) * 60 + (em - sm);
    return {
      top: `${startMin}px`,
      height: `${Math.max(duration, 20)}px`,
      background: event.color,
    };
  }

  // Drag to create
  onCellMouseDown(dayOfWeek: number, hour: number, e: MouseEvent) {
    if (e.button !== 0) return;
    this.dragging.set(true);
    this.dragDay = dayOfWeek;
    this.dragStartHour = hour;
    this.dragEndHour = hour;
  }

  onCellMouseEnter(dayOfWeek: number, hour: number) {
    if (!this.dragging() || dayOfWeek !== this.dragDay) return;
    this.dragEndHour = hour;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (!this.dragging()) return;
    this.dragging.set(false);

    const startH = Math.min(this.dragStartHour, this.dragEndHour);
    const endH = Math.max(this.dragStartHour, this.dragEndHour) + 1;

    this.editingEvent.set(null);
    this.formTitle = '';
    this.formDay = this.dragDay;
    this.formStart = `${startH.toString().padStart(2, '0')}:00`;
    this.formEnd = `${endH.toString().padStart(2, '0')}:00`;
    this.formColor = '#6366f1';
    this.showForm.set(true);

    this.dragDay = -1;
    this.dragStartHour = -1;
    this.dragEndHour = -1;
  }

  getDragStyle() {
    const startH = Math.min(this.dragStartHour, this.dragEndHour);
    const endH = Math.max(this.dragStartHour, this.dragEndHour) + 1;
    const top = (startH - 6) * 60;
    const height = (endH - startH) * 60;
    return { top: `${top}px`, height: `${height}px` };
  }

  isDragDay(dayOfWeek: number): boolean {
    return this.dragging() && dayOfWeek === this.dragDay;
  }

  onEventClick(event: RoutineEvent, e: Event) {
    e.stopPropagation();
    this.editingEvent.set(event);
    this.formTitle = event.title;
    this.formDay = event.dayOfWeek;
    this.formStart = event.startTime;
    this.formEnd = event.endTime;
    this.formColor = event.color;
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingEvent.set(null);
  }

  onSave() {
    if (!this.formTitle.trim()) return;
    const req: RoutineEventRequest = {
      title: this.formTitle.trim(),
      dayOfWeek: this.formDay,
      startTime: this.formStart,
      endTime: this.formEnd,
      color: this.formColor,
    };
    const editing = this.editingEvent();
    const call = editing
      ? this.api.update(editing.id, req)
      : this.api.create(req);

    call.subscribe({
      next: () => { this.closeForm(); this.load(); },
    });
  }

  onDelete() {
    const editing = this.editingEvent();
    if (!editing) return;
    this.api.delete(editing.id).subscribe({
      next: () => { this.closeForm(); this.load(); },
    });
  }

  getDayName(day: number): string {
    return this.days[day]?.full ?? '';
  }
}
