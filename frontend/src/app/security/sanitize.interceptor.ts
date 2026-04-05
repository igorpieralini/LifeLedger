import { HttpInterceptorFn } from '@angular/common/http';
import { sanitizeValue } from './sanitizer';

/**
 * Interceptor que sanitiza o body de TODAS as requests (POST, PUT, PATCH)
 * antes de enviar ao backend. Remove XSS, SQL injection, etc.
 *
 * FormData (uploads) passa sem alteração — arquivos não são strings.
 */
export const sanitizeInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.body && !(req.body instanceof FormData)) {
    const sanitizedBody = sanitizeValue(req.body);
    req = req.clone({ body: sanitizedBody });
  }

  return next(req);
};
