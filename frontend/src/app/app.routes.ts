import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./view/main').then(m => m.MainView),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./view/pages/dashboard/dashboard').then(m => m.DashboardPage),
      },
      {
        path: 'transactions',
        loadComponent: () => import('./view/pages/transactions/transactions').then(m => m.TransactionsPage),
      },
      {
        path: 'categories',
        loadComponent: () => import('./view/pages/categories/categories').then(m => m.CategoriesPage),
      },
      {
        path: 'limits',
        loadComponent: () => import('./view/pages/limits/limits').then(m => m.LimitsPage),
      },
      {
        path: 'import',
        loadComponent: () => import('./view/pages/import/import').then(m => m.ImportPage),
      },
      {
        path: 'goals',
        loadComponent: () => import('./view/pages/goals/goals').then(m => m.GoalsPage),
      },
      {
        path: 'studies',
        loadComponent: () => import('./view/pages/studies/studies').then(m => m.StudiesPage),
      },
      {
        path: 'growth',
        loadComponent: () => import('./view/pages/growth/growth').then(m => m.GrowthPage),
      },
    ],
  },
];
