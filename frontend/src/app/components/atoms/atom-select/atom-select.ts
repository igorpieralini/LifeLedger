import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'atom-select',
  imports: [FormsModule],
  templateUrl: './atom-select.html',
  styleUrl: './atom-select.scss',
})
export class AtomSelect {
  options = input.required<SelectOption[]>();
  placeholder = input<string>('Selecione...');
  label = input<string>('');
  name = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  error = input<string>('');

  value = model<string>('');

  changed = output<string>();
}
