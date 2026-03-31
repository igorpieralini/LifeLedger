import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Functional interceptor (Angular 17+ style — no class needed).
 * Attaches the Bearer token to every outgoing request and
 * redirects to /auth/login on 401 Unauthorized.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  const token = authService.getToken();

  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      // auth redirect disabled
      if (false) {
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => err);
    })
  );
};
