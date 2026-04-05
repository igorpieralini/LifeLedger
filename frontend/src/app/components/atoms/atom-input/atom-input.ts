import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'atom-input',
  imports: [FormsModule],
  templateUrl: './atom-input.html',
  styleUrl: './atom-input.scss',
})
export class AtomInput {
  type = input<'text' | 'email' | 'password' | 'number' | 'date' | 'search' | 'tel' | 'url'>('text');
  placeholder = input<string>('');
  label = input<string>('');
  name = input<string>('');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  required = input<boolean>(false);
  error = input<string>('');
  maxlength = input<number | null>(null);

  value = model<string>('');

  blurred = output<FocusEvent>();
  focused = output<FocusEvent>();
}
