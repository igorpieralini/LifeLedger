import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { GoalService } from '../../../core/services/goal.service';
import { SubGoal, GoalPeriod } from '../../../core/models/goal.model';

@Component({
  selector: 'll-sub-goal-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule,
            MatFormFieldModule, MatInputModule, MatButtonModule,
            MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar sub-meta' : 'Nova sub-meta' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title">
          <mat-error>Título é obrigatório</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Período</mat-label>
          <mat-select formControlName="period">
            <mat-option value="MONTHLY">Mensal</mat-option>
            <mat-option value="WEEKLY">Semanal</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Data de referência</mat-label>
          <input matInput [matDatepicker]="dp" formControlName="referenceDate">
          <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
          <mat-datepicker #dp></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Valor alvo (opcional)</mat-label>
          <input matInput type="number" formControlName="targetValue" min="0">
        </mat-form-field>
      </form>
      <div class="error-msg" *ngIf="error()">{{ error() }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="loading()">
        {{ isEdit ? 'Salvar' : 'Criar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; padding-top: 0.5rem; min-width: 440px; }
    .full { grid-column: 1 / -1; }
    mat-form-field { width: 100%; }
    .error-msg { color: var(--danger); font-size: 0.85rem; margin-top: 0.5rem; }
  `]
})
export class SubGoalFormDialogComponent implements OnInit {
  loading = signal(false);
  error   = signal('');
  isEdit  = false;

  form = this.fb.group({
    title:         ['', Validators.required],
    description:   [''],
    period:        ['MONTHLY' as GoalPeriod, Validators.required],
    referenceDate: [new Date(), Validators.required],
    targetValue:   [null as number | null]
  });

  constructor(
    private fb: FormBuilder,
    private goalService: GoalService,
    public dialogRef: MatDialogRef<SubGoalFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { goalId: number; subGoal?: SubGoal }
  ) {}

  ngOnInit() {
    if (this.data?.subGoal) {
      this.isEdit = true;
      const s = this.data.subGoal;
      this.form.patchValue({
        title: s.title, description: s.description ?? '',
        period: s.period, referenceDate: new Date(s.referenceDate),
        targetValue: s.targetValue ?? null
      });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);

    const val = this.form.value;
    const request: any = {
      goalId:        this.data.goalId,
      title:         val.title,
      description:   val.description || undefined,
      period:        val.period,
      referenceDate: (val.referenceDate as Date).toISOString().split('T')[0],
      targetValue:   val.targetValue || undefined
    };

    const op = this.isEdit
      ? this.goalService.updateSubGoal(this.data.subGoal!.id, request)
      : this.goalService.createSubGoal(request);

    op.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
        this.error.set(err.error?.message ?? 'Erro ao salvar sub-meta');
        this.loading.set(false);
      }
    });
  }
}
