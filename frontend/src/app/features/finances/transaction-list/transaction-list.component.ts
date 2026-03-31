import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FinanceService } from '../../../core/services/finance.service';
import { Category, Transaction } from '../../../core/models/finance.model';
import { CsvImportDialogComponent } from '../csv-import/csv-import-dialog.component';

@Component({
  selector: 'll-transaction-list',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, DatePipe,
    MatIconModule, MatButtonModule, MatMenuModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    CsvImportDialogComponent
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  categories   = signal<Category[]>([]);
  loading      = signal(true);
  loadError    = signal('');
  page         = signal(0);
  total        = signal(0);
  size         = 20;

  importOpen   = signal(false);
  panelOpen    = signal(false);
  panelLoading = signal(false);
  panelError   = signal('');
  editingTx    = signal<Transaction | null>(null);

  pageSummary = computed(() => {
    const txs = this.transactions();
    return {
      income:  txs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
      expense: txs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
    };
  });

  form = this.fb.group({
    type:        ['EXPENSE', Validators.required],
    amount:      [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    date:        [this.todayStr(), Validators.required],
    categoryId:  [null as number | null],
    notes:       ['']
  });

  constructor(private financeService: FinanceService, private fb: FormBuilder) {}

  ngOnInit() {
    this.financeService.getCategories().subscribe(cats => this.categories.set(cats));
    this.load();
  }

  load() {
    this.loading.set(true);
    this.loadError.set('');
    this.financeService.getTransactions(this.page(), this.size).subscribe({
      next: p => {
        this.transactions.set(p.content);
        this.total.set(p.totalElements);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 0) {
          this.loadError.set('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        } else if (err.status !== 401) {
          this.loadError.set(this.parseError(err, 'Erro ao carregar transações'));
        }
      }
    });
  }

  openPanel(tx?: Transaction) {
    this.editingTx.set(tx ?? null);
    this.panelError.set('');
    this.panelLoading.set(false);
    this.form.reset({
      type:        tx?.type        ?? 'EXPENSE',
      amount:      tx?.amount      ?? null,
      description: tx?.description ?? '',
      date:        tx?.date        ?? this.todayStr(),
      categoryId:  tx?.categoryId  ?? null,
      notes:       tx?.notes       ?? ''
    });
    this.panelOpen.set(true);
  }

  closePanel() {
    this.panelOpen.set(false);
    this.editingTx.set(null);
    this.panelError.set('');
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.panelLoading.set(true);
    this.panelError.set('');

    const val = this.form.value;
    const request: any = {
      type:        val.type,
      amount:      val.amount,
      description: val.description,
      date:        val.date,
      categoryId:  val.categoryId || undefined,
      notes:       val.notes      || undefined
    };

    const tx = this.editingTx();
    const op = tx
      ? this.financeService.updateTransaction(tx.id, request)
      : this.financeService.createTransaction(request);

    op.subscribe({
      next: () => { this.closePanel(); this.load(); },
      error: (err) => {
        this.panelError.set(this.parseError(err, 'Erro ao salvar transação'));
        this.panelLoading.set(false);
      }
    });
  }

  private parseError(err: any, fallback: string): string {
    const msg = err?.error?.message;
    if (!msg) return fallback;
    if (typeof msg === 'string') return msg;
    if (typeof msg === 'object') {
      const first = Object.values(msg)[0];
      return typeof first === 'string' ? first : fallback;
    }
    return fallback;
  }

  delete(tx: Transaction) {
    if (!confirm(`Excluir a transação "${tx.description}"?`)) return;
    this.financeService.deleteTransaction(tx.id).subscribe(() => this.load());
  }

  nextPage() { this.page.update(p => p + 1); this.load(); }
  prevPage() { this.page.update(p => Math.max(0, p - 1)); this.load(); }

  get totalPages() { return Math.ceil(this.total() / this.size); }

  openImport() { this.importOpen.set(true); }

  onImportDone(imported: boolean) {
    this.importOpen.set(false);
    if (imported) {
      this.page.set(0);
      this.load();
      this.financeService.getCategories().subscribe(cats => this.categories.set(cats));
    }
  }

  private todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }
}
