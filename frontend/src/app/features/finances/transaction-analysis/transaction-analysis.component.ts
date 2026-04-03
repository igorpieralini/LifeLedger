import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { FinanceService } from '../../../core/services/finance.service';
import { Transaction } from '../../../core/models/finance.model';
import { EMPTY, expand, map, reduce } from 'rxjs';

@Component({
  selector: 'll-transaction-analysis',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, MatIconModule, BaseChartDirective],
  templateUrl: './transaction-analysis.component.html',
  styleUrl: './transaction-analysis.component.scss'
})
export class TransactionAnalysisComponent implements OnInit {
  loading = signal(true);
  transactions = signal<Transaction[]>([]);

  chartData = signal<ChartData<'doughnut'>>({ datasets: [], labels: [] });

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right', labels: { color: '#8b949e', font: { size: 12 } } },
      tooltip: {
        callbacks: {
          label: ctx => ` R$ ${(ctx.raw as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        }
      }
    }
  };

  summary = computed(() => {
    const txs = this.transactions();
    const totalIncome = txs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const totalExpense = txs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    return {
      totalTransactions: txs.length,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  });

  categories = computed(() => {
    const expenses = this.transactions().filter(t => t.type === 'EXPENSE');
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const grouped = new Map<string, { total: number; color?: string }>();

    for (const tx of expenses) {
      const categoryName = tx.categoryName || 'Sem categoria';
      const current = grouped.get(categoryName) || { total: 0, color: tx.categoryColor };
      current.total += tx.amount;
      if (!current.color && tx.categoryColor) current.color = tx.categoryColor;
      grouped.set(categoryName, current);
    }

    return Array.from(grouped.entries())
      .map(([categoryName, data]) => ({
        categoryName,
        total: data.total,
        categoryColor: data.color,
        percentage: totalExpense > 0 ? (data.total / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);
  });

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.financeService.getTransactions(0, 200).pipe(
      expand(page => {
        const next = page.number + 1;
        return next < page.totalPages ? this.financeService.getTransactions(next, 200) : EMPTY;
      }),
      map(page => page.content),
      reduce((all, content) => all.concat(content), [] as Transaction[])
    ).subscribe({
      next: txs => {
        this.transactions.set(txs);
        this.updateChart();
        this.loading.set(false);
      },
      error: () => {
        this.transactions.set([]);
        this.chartData.set({ datasets: [], labels: [] });
        this.loading.set(false);
      }
    });
  }

  private updateChart() {
    const categories = this.categories();
    const palette = ['#94a3b8', '#6366f1', '#14b8a6', '#818cf8', '#f59e0b', '#f43f5e', '#22c55e'];
    this.chartData.set({
      labels: categories.map(c => c.categoryName),
      datasets: [{
        data: categories.map(c => c.total),
        backgroundColor: categories.map((c, i) => c.categoryColor ?? palette[i % palette.length]),
        borderColor: 'transparent',
        borderWidth: 2
      }]
    });
  }
}
