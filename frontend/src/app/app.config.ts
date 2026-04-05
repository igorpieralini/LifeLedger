import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';
import { sanitizeInterceptor } from './security/sanitize.interceptor';
import { sanitizeResponseInterceptor } from './security/sanitize-response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      sanitizeInterceptor,         // 1. Sanitiza body de saída
      authInterceptor,             // 2. Injeta JWT token
      sanitizeResponseInterceptor, // 3. Sanitiza body de entrada
    ])),
  ]
};
