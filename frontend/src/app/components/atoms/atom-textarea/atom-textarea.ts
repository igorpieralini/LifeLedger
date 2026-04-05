import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'atom-textarea',
  imports: [FormsModule],
  templateUrl: './atom-textarea.html',
  styleUrl: './atom-textarea.scss',
})
export class AtomTextarea {
  placeholder = input<string>('');
  label = input<string>('');
  name = input<string>('');
  rows = input<number>(4);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  error = input<string>('');
  maxlength = input<number | null>(null);

  value = model<string>('');

  blurred = output<FocusEvent>();
}
