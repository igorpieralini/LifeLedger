import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { stripDangerousPatterns, hasDangerousContent } from './sanitizer';

/**
 * Diretiva que sanitiza inputs em tempo real.
 * Aplique em qualquer <input> ou <textarea>.
 *
 * Uso: <input sanitizeInput />
 *      <input sanitizeInput [maxInputLength]="100" />
 */
@Directive({
  selector: '[sanitizeInput]',
})
export class SanitizeInputDirective {
  private readonly el = inject(ElementRef);

  maxInputLength = input<number>(1000);

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    const original = input.value;

    if (!original) return;

    // Truncar se exceder limite
    let sanitized = original.length > this.maxInputLength()
      ? original.substring(0, this.maxInputLength())
      : original;

    // Remover padrões perigosos
    if (hasDangerousContent(sanitized)) {
      sanitized = stripDangerousPatterns(sanitized);
    }

    if (sanitized !== original) {
      input.value = sanitized;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';

    if (hasDangerousContent(pasted)) {
      event.preventDefault();
      const input = this.el.nativeElement as HTMLInputElement | HTMLTextAreaElement;
      const cleaned = stripDangerousPatterns(pasted);
      document.execCommand('insertText', false, cleaned);
    }
  }
}
