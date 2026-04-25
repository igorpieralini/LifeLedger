import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Goal, GoalCategory, GoalRequest, CATEGORIES } from '../../../models/goal.model';
import { FormPanelComponent } from '../../shared/form-panel/form-panel';
import { ChipComponent } from '../../atoms/chip/chip';

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [FormsModule, FormPanelComponent, ChipComponent],
  templateUrl: './goal-form.html',
  styleUrl: './goal-form.scss',
})
export class GoalFormComponent {
  @Input() editingGoal: Goal | null = null;
  @Input() saving = false;
  @Input() defaultCategory: GoalCategory = 'FINANCIAL';

  @Output() saved = new EventEmitter<{ request: GoalRequest; subTasks: string[] }>();
  @Output() closed = new EventEmitter<void>();

  readonly categories = CATEGORIES;

  formTitle = '';
  formDescription = '';
  formCategory: GoalCategory = 'FINANCIAL';
  formTargetDate = '';
  formSubTasks: string[] = [''];

  ngOnChanges() {
    if (this.editingGoal) {
      this.formTitle = this.editingGoal.title;
      this.formDescription = this.editingGoal.description ?? '';
      this.formCategory = this.editingGoal.category;
      this.formTargetDate = this.editingGoal.targetDate ?? '';
      this.formSubTasks = this.editingGoal.subTasks.length > 0
        ? [...this.editingGoal.subTasks.map(st => st.title), '']
        : [''];
    } else {
      this.formTitle = '';
      this.formDescription = '';
      this.formCategory = this.defaultCategory;
      this.formTargetDate = '';
      this.formSubTasks = [''];
    }
  }

  get panelTitle() {
    return this.editingGoal ? 'Editar meta' : 'Nova meta';
  }

  save() {
    if (!this.formTitle.trim() || this.saving) return;

    const request: GoalRequest = {
      title: this.formTitle.trim(),
      description: this.formDescription.trim() || undefined,
      category: this.formCategory,
      targetDate: this.formTargetDate || undefined,
    };

    const subTasks = this.formSubTasks.filter(st => st && st.trim()).map(st => st.trim());
    this.saved.emit({ request, subTasks });
  }

  onSubTaskInput(index: number) {
    const currentValue = this.formSubTasks[index];
    const isLastInput = index === this.formSubTasks.length - 1;

    if (isLastInput && currentValue && currentValue.trim()) {
      setTimeout(() => this.formSubTasks.push(''), 0);
    }
  }

  onSubTaskBlur(index: number) {
    const isNotLast = index < this.formSubTasks.length - 1;
    const isEmpty = !this.formSubTasks[index] || !this.formSubTasks[index].trim();

    if (isNotLast && isEmpty) {
      setTimeout(() => {
        this.formSubTasks.splice(index, 1);
        if (this.formSubTasks.length === 0 || this.formSubTasks[this.formSubTasks.length - 1].trim()) {
          this.formSubTasks.push('');
        }
      }, 100);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
