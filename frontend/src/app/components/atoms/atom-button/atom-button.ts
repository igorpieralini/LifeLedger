import { Component, input, output } from '@angular/core';

@Component({
  selector: 'atom-button',
  templateUrl: './atom-button.html',
  styleUrl: './atom-button.scss',
})
export class AtomButton {
  label = input<string>('');
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  clicked = output<MouseEvent>();
}
