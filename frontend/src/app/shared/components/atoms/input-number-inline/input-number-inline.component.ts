import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'll-input-number-inline',
  standalone: true,
  styles: [`
    input {
      width: 110px;
      border: 1px solid var(--border);
      border-radius: var(--radius-xs);
      background: var(--bg-overlay);
      color: var(--text-primary);
      padding: 0.35rem 0.45rem;
      font-size: 0.8rem;
    }
  `],
  template: `
    <input
      type="number"
      [min]="min"
      [step]="step"
      [value]="value"
      (input)="onInput($event)">
  `
})
export class InputNumberInlineComponent {
  @Input() value: number = 0;
  @Input() min: number = 0;
  @Input() step: number = 1;
  @Output() inputChange = new EventEmitter<string>();

  onInput(e: Event) {
    this.inputChange.emit((e.target as HTMLInputElement).value);
  }
}
