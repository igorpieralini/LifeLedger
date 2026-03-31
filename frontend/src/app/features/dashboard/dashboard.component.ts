import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { Dashboard } from '../../core/models/dashboard.model';

@Component({
  selector: 'll-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule,
            CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  data  = signal<Dashboard | null>(null);
  user  = this.auth.currentUser;

  firstName = computed(() => this.user()?.name?.split(' ')[0] ?? '');

  today = computed(() => {
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  });

  monthLabel = computed(() => {
    return new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  });

  constructor(private dashboardService: DashboardService, private auth: AuthService) {}

  ngOnInit() {
    this.dashboardService.getDashboard().subscribe(d => this.data.set(d));
  }

  statusLabel(s: string) {
    return ({ IN_PROGRESS: 'Em andamento', COMPLETED: 'Concluída', DELAYED: 'Atrasada', CANCELLED: 'Cancelada' } as any)[s] ?? s;
  }

  statusBadge(s: string) {
    return 'badge-' + (({ IN_PROGRESS: 'indigo', COMPLETED: 'emerald', DELAYED: 'rose', CANCELLED: 'muted' } as any)[s] ?? 'muted');
  }
}
