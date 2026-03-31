import { Routes } from '@angular/router';

export const financesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./transaction-list/transaction-list.component').then(m => m.TransactionListComponent)
  },
  {
    path: 'summary',
    loadComponent: () => import('./finance-summary/finance-summary.component').then(m => m.FinanceSummaryComponent)
  }
];
