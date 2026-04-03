import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FinanceService } from '../../../core/services/finance.service';
import { Category, CategoryLimitStatus, Transaction } from '../../../core/models/finance.model';
import { CsvImportDialogComponent } from '../csv-import/csv-import-dialog.component';
import { TransactionFormDialogComponent } from '../transaction-form/transaction-form-dialog.component';

@Component({
  selector: 'll-transaction-list',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, DatePipe,
    MatIconModule, MatButtonModule, MatMenuModule
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
  exceededLimits = signal<CategoryLimitStatus[]>([]);

  pageSummary = computed(() => {
    const txs = this.transactions();
    return {
      income:  txs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
      expense: txs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
    };
  });

  constructor(private financeService: FinanceService, private dialog: MatDialog) {}

  ngOnInit() {
    this.financeService.getCategories().subscribe(cats => this.categories.set(cats));
    this.load();
    this.loadExceededLimits();
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
    const ref = this.dialog.open(TransactionFormDialogComponent, {
      width: '520px',
      disableClose: false,
      panelClass: 'modal-dialog',
      data: tx ? { tx } : {}
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.load();
        this.loadExceededLimits();
      }
    });
  }

  delete(tx: Transaction) {
    if (!confirm(`Excluir a transação "${tx.description}"?`)) return;
    this.financeService.deleteTransaction(tx.id).subscribe(() => {
      this.load();
      this.loadExceededLimits();
    });
  }

  nextPage() { this.page.update(p => p + 1); this.load(); }
  prevPage() { this.page.update(p => Math.max(0, p - 1)); this.load(); }

  get totalPages() { return Math.ceil(this.total() / this.size); }

  openImport() {
    const ref = this.dialog.open(CsvImportDialogComponent, {
      width: '520px',
      disableClose: false,
      panelClass: 'modal-dialog'
    });
    ref.afterClosed().subscribe((imported: boolean) => {
      if (imported) {
        this.page.set(0);
        this.load();
        this.loadExceededLimits();
        this.financeService.getCategories().subscribe(cats => this.categories.set(cats));
      }
    });
  }

  private loadExceededLimits() {
    const now = new Date();
    this.financeService.getLimits(now.getFullYear(), now.getMonth() + 1).subscribe({
      next: data => this.exceededLimits.set(data.categories.filter(c => c.exceeded)),
      error: () => this.exceededLimits.set([])
    });
  }

  private parseError(err: unknown, fallback: string): string {
    if (!err || typeof err !== 'object') return fallback;

    const e = err as { error?: unknown; message?: unknown };

    if (typeof e.error === 'string' && e.error.trim()) {
      return e.error;
    }

    if (e.error && typeof e.error === 'object') {
      const apiError = e.error as { message?: unknown; error?: unknown };
      if (typeof apiError.message === 'string' && apiError.message.trim()) {
        return apiError.message;
      }
      if (typeof apiError.error === 'string' && apiError.error.trim()) {
        return apiError.error;
      }
    }

    if (typeof e.message === 'string' && e.message.trim()) {
      return e.message;
    }

    return fallback;
  }
}
