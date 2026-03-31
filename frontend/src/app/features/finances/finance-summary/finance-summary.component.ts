import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FinanceService } from '../../../core/services/finance.service';
import { FinanceSummary } from '../../../core/models/finance.model';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'll-finance-summary',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, CurrencyPipe,
            MatIconModule, MatButtonModule, MatSelectModule,
            MatFormFieldModule, BaseChartDirective],
  templateUrl: './finance-summary.component.html',
  styleUrl: './finance-summary.component.scss'
})
export class FinanceSummaryComponent implements OnInit {
  summary = signal<FinanceSummary | null>(null);
  loading = signal(true);

  year  = signal(new Date().getFullYear());
  month = signal(new Date().getMonth() + 1);

  years  = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  months = [
    { v: 1, l: 'Janeiro' }, { v: 2, l: 'Fevereiro' }, { v: 3, l: 'Março' },
    { v: 4, l: 'Abril' },   { v: 5, l: 'Maio' },       { v: 6, l: 'Junho' },
    { v: 7, l: 'Julho' },   { v: 8, l: 'Agosto' },     { v: 9, l: 'Setembro' },
    { v: 10, l: 'Outubro'}, { v: 11, l: 'Novembro' },  { v: 12, l: 'Dezembro' }
  ];

  // Chart.js doughnut data
  chartData = signal<ChartData<'doughnut'>>({ datasets: [], labels: [] });

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right', labels: { color: '#8b949e', font: { size: 12 } } },
      tooltip: { callbacks: {
        label: ctx => ` R$ ${(ctx.raw as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      }}
    }
  };

  constructor(private financeService: FinanceService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.financeService.getSummary(this.year(), this.month()).subscribe({
      next: s => {
        this.summary.set(s);
        this.updateChart(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onYearChange(y: number)  { this.year.set(y);  this.load(); }
  onMonthChange(m: number) { this.month.set(m); this.load(); }

  private updateChart(s: FinanceSummary) {
    this.chartData.set({
      labels:   s.expensesByCategory.map(c => c.categoryName),
      datasets: [{
        data:            s.expensesByCategory.map(c => c.total),
        backgroundColor: s.expensesByCategory.map(c => c.categoryColor ?? '#58a6ff'),
        borderColor:     'transparent',
        borderWidth:     2
      }]
    });
  }

  monthLabel(m: number) { return this.months.find(x => x.v === m)?.l ?? ''; }
}
