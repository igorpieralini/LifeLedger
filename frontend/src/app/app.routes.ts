import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Protected routes — wrapped in the shell layout
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'goals',
        loadChildren: () => import('./features/goals/goals.routes').then(m => m.goalsRoutes)
      },
      {
        path: 'finances',
        loadChildren: () => import('./features/finances/finances.routes').then(m => m.financesRoutes)
      }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
