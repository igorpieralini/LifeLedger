import { Routes } from '@angular/router';

export const financesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'history',
    pathMatch: 'full'
  },
  {
    path: 'history',
    loadComponent: () => import('./transaction-list/transaction-list.component').then(m => m.TransactionListComponent)
  },
  {
    path: 'analysis',
    loadComponent: () => import('./transaction-analysis/transaction-analysis.component').then(m => m.TransactionAnalysisComponent)
  },
  {
    path: 'limits',
    loadComponent: () => import('./finance-limits/finance-limits.component').then(m => m.FinanceLimitsComponent)
  },
  {
    path: 'summary',
    loadComponent: () => import('./finance-summary/finance-summary.component').then(m => m.FinanceSummaryComponent)
  }
];
