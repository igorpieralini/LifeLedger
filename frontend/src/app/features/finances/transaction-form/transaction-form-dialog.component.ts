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
import { FinanceService } from '../../../core/services/finance.service';
import { Category, Transaction } from '../../../core/models/finance.model';
import { SelectNativeComponent } from '../../../shared/components/atoms';

@Component({
  selector: 'll-transaction-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule,
            MatFormFieldModule, MatInputModule, MatButtonModule,
            MatSelectModule, MatDatepickerModule, MatNativeDateModule,
            SelectNativeComponent],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar transação' : 'Nova transação' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="type">
            <mat-option value="INCOME">Receita</mat-option>
            <mat-option value="EXPENSE">Despesa</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Valor (R$)</mat-label>
          <input matInput type="number" formControlName="amount" min="0.01" step="0.01">
          <mat-error>Valor deve ser maior que zero</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Descrição</mat-label>
          <input matInput formControlName="description" maxlength="255">
          <mat-error>Descrição é obrigatória</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Data</mat-label>
          <input matInput [matDatepicker]="dp" formControlName="date">
          <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
          <mat-datepicker #dp></mat-datepicker>
        </mat-form-field>

        <ll-select-native [control]="form.controls.categoryId" label="Categoria">
          <option [ngValue]="null">Sem categoria</option>
          <option *ngFor="let c of categories()" [ngValue]="c.id">
            {{ c.name }}
          </option>
        </ll-select-native>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Observações</mat-label>
          <textarea matInput formControlName="notes" rows="2"></textarea>
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
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 1rem;
      padding-top: 0.5rem;
    }
    @media (max-width: 540px) {
      .form-grid { grid-template-columns: 1fr; }
    }
    .full { grid-column: 1 / -1; }
    mat-form-field { width: 100%; }
    .error-msg { color: var(--danger); font-size: 0.85rem; margin-top: 0.5rem; }
  `]
})
export class TransactionFormDialogComponent implements OnInit {
  loading    = signal(false);
  error      = signal('');
  isEdit     = false;
  categories = signal<Category[]>([]);

  form = this.fb.group({
    type:        ['EXPENSE', Validators.required],
    amount:      [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    date:        [new Date(), Validators.required],
    categoryId:  [null as number | null],
    notes:       ['']
  });

  constructor(
    private fb: FormBuilder,
    private financeService: FinanceService,
    public dialogRef: MatDialogRef<TransactionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tx?: Transaction }
  ) {}

  ngOnInit() {
    this.financeService.getCategories().subscribe(cats => this.categories.set(cats));

    if (this.data?.tx) {
      this.isEdit = true;
      const t = this.data.tx;
      this.form.patchValue({
        type: t.type, amount: t.amount, description: t.description,
        date: new Date(t.date), categoryId: t.categoryId ?? null, notes: t.notes ?? ''
      });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);

    const val = this.form.value;
    const request: any = {
      type:        val.type,
      amount:      val.amount,
      description: val.description,
      date:        (val.date as Date).toISOString().split('T')[0],
      categoryId:  val.categoryId != null ? Number(val.categoryId) : undefined,
      notes:       val.notes || undefined
    };

    const op = this.isEdit
      ? this.financeService.updateTransaction(this.data.tx!.id, request)
      : this.financeService.createTransaction(request);

    op.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erro ao salvar transação');
        this.loading.set(false);
      }
    });
  }
}
