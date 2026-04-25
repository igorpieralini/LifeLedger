import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Goal, GoalStatus, CategoryInfo, STATUS_LABELS, SubTask } from '../../../models/goal.model';
import { IconBtnComponent } from '../../atoms/icon-btn/icon-btn';
import { BadgeComponent } from '../../atoms/badge/badge';
import { ProgressBarComponent } from '../../atoms/progress-bar/progress-bar';
import { CheckboxComponent } from '../../atoms/checkbox/checkbox';

@Component({
  selector: 'app-goal-card',
  standalone: true,
  imports: [DatePipe, FormsModule, IconBtnComponent, BadgeComponent, ProgressBarComponent, CheckboxComponent],
  templateUrl: './goal-card.html',
  styleUrl: './goal-card.scss',
})
export class GoalCardComponent {
  @Input({ required: true }) goal!: Goal;
  @Input({ required: true }) categoryInfo!: CategoryInfo;
  @Input() expanded = false;
  @Input() addingSubTask = false;
  
  @Output() edit = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Output() cycleStatus = new EventEmitter<void>();
  @Output() toggleExpand = new EventEmitter<void>();
  @Output() toggleSubTask = new EventEmitter<number>();
  @Output() removeSubTask = new EventEmitter<number>();
  @Output() startAdding = new EventEmitter<void>();
  @Output() cancelAdding = new EventEmitter<void>();
  @Output() addSubTask = new EventEmitter<string>();
  
  readonly statusLabels = STATUS_LABELS;
  newSubTaskTitle = '';

  get completedCount(): number {
    return this.goal.subTasks?.filter(st => st.completed).length ?? 0;
  }

  onStatusClick(e: Event) { e.stopPropagation(); this.cycleStatus.emit(); }
  onEditClick(e: Event) { e.stopPropagation(); this.edit.emit(); }
  onRemoveClick(e: Event) { e.stopPropagation(); this.remove.emit(); }

  onAdd() {
    if (!this.newSubTaskTitle.trim()) return;
    this.addSubTask.emit(this.newSubTaskTitle.trim());
    this.newSubTaskTitle = '';
  }
}
