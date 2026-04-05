import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-icon',
  templateUrl: './atom-icon.html',
  styleUrl: './atom-icon.scss',
})
export class AtomIcon {
  name = input.required<string>();
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  color = input<string>('');
}
