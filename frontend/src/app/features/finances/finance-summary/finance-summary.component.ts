import { Component, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FinanceService } from '../../../core/services/finance.service';
import { FinanceSummary } from '../../../core/models/finance.model';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'll-finance-summary',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, MatIconModule, BaseChartDirective],
  templateUrl: './finance-summary.component.html',
  styleUrl: './finance-summary.component.scss'
})
export class FinanceSummaryComponent implements OnInit {
  summary    = signal<FinanceSummary | null>(null);
  loading    = signal(true);
  pickerOpen = signal(false);

  year  = signal(new Date().getFullYear());
  month = signal(new Date().getMonth() + 1);

  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  months = [
    { v: 1,  short: 'Jan', full: 'Janeiro'   },
    { v: 2,  short: 'Fev', full: 'Fevereiro' },
    { v: 3,  short: 'Mar', full: 'Março'      },
    { v: 4,  short: 'Abr', full: 'Abril'      },
    { v: 5,  short: 'Mai', full: 'Maio'       },
    { v: 6,  short: 'Jun', full: 'Junho'      },
    { v: 7,  short: 'Jul', full: 'Julho'      },
    { v: 8,  short: 'Ago', full: 'Agosto'     },
    { v: 9,  short: 'Set', full: 'Setembro'   },
    { v: 10, short: 'Out', full: 'Outubro'    },
    { v: 11, short: 'Nov', full: 'Novembro'   },
    { v: 12, short: 'Dez', full: 'Dezembro'   },
  ];

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

  togglePicker(e: MouseEvent) { e.stopPropagation(); this.pickerOpen.update(v => !v); }

  selectYear(y: number) { this.year.set(y); this.load(); }

  selectMonth(m: number) { this.month.set(m); this.pickerOpen.set(false); this.load(); }

  @HostListener('document:click')
  closePicker() { this.pickerOpen.set(false); }

  monthLabel(m: number) { return this.months.find(x => x.v === m)?.full ?? ''; }

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
}
