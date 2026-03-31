import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { GoalService } from '../../../core/services/goal.service';
import { Goal } from '../../../core/models/goal.model';

@Component({
  selector: 'll-goal-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule,
            MatFormFieldModule, MatInputModule, MatButtonModule,
            MatDatepickerModule, MatNativeDateModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar meta' : 'Nova meta' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">

        <mat-form-field appearance="outline" class="full">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" maxlength="200">
          <mat-error>Título é obrigatório</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ano</mat-label>
          <mat-select formControlName="year">
            <mat-option *ngFor="let y of years" [value]="y">{{ y }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Valor alvo (opcional)</mat-label>
          <input matInput formControlName="targetValue" type="number" min="0">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Prazo (opcional)</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="deadline">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
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
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; padding-top: 0.5rem; }
    .full { grid-column: 1 / -1; }
    mat-form-field { width: 100%; }
    .error-msg { color: var(--danger); font-size: 0.85rem; margin-top: 0.5rem; }
  `]
})
export class GoalFormDialogComponent implements OnInit {
  loading = signal(false);
  error   = signal('');
  isEdit  = false;

  years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i);

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    year:        [new Date().getFullYear(), Validators.required],
    targetValue: [null as number | null],
    deadline:    [null as Date | null]
  });

  constructor(
    private fb: FormBuilder,
    private goalService: GoalService,
    public dialogRef: MatDialogRef<GoalFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { goal?: Goal }
  ) {}

  ngOnInit() {
    if (this.data?.goal) {
      this.isEdit = true;
      const g = this.data.goal;
      this.form.patchValue({
        title: g.title, description: g.description ?? '',
        year: g.year, targetValue: g.targetValue ?? null,
        deadline: g.deadline ? new Date(g.deadline) : null
      });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);

    const val = this.form.value;
    const request: any = {
      title: val.title,
      description: val.description || undefined,
      year: val.year,
      targetValue: val.targetValue || undefined,
      deadline: val.deadline ? (val.deadline as Date).toISOString().split('T')[0] : undefined
    };

    const op = this.isEdit
      ? this.goalService.update(this.data.goal!.id, request)
      : this.goalService.create(request);

    op.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erro ao salvar meta');
        this.loading.set(false);
      }
    });
  }
}
