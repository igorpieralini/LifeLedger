import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { sanitizeResponseValue } from './sanitizer';

/**
 * Interceptor que sanitiza o body de TODAS as responses do backend.
 * Apenas remove padrões perigosos — sem HTML escaping (Angular já faz auto-escaping).
 */
export const sanitizeResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body) {
        const sanitizedBody = sanitizeResponseValue(event.body);
        return event.clone({ body: sanitizedBody });
      }
      return event;
    })
  );
};
