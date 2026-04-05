import { Pipe, PipeTransform } from '@angular/core';
import { sanitizeString } from './sanitizer';

/**
 * Pipe para sanitizar dados ao renderizar no template.
 *
 * Uso: {{ user.name | sanitize }}
 */
@Pipe({
  name: 'sanitize',
  pure: true,
})
export class SanitizePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return sanitizeString(value);
  }
}
