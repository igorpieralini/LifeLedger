import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'll-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  pageTitle = signal('');

  private readonly titleMap: Record<string, string> = {
    '/dashboard':         'Dashboard',
    '/goals':             'Metas',
    '/finances/history':  'Histórico de Transações',
    '/finances/analysis': 'Análises',
    '/finances/limits':   'Limites por Categoria',
    '/finances/summary':  'Relatório Financeiro',
  };

  private router     = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.resolveTitle(this.router.url);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((e: any) => this.resolveTitle(e.urlAfterRedirects));
  }

  private resolveTitle(url: string) {
    const path = url.split('?')[0];
    const match = Object.entries(this.titleMap).find(([key]) => path.startsWith(key));
    this.pageTitle.set(match?.[1] ?? '');
  }
}
