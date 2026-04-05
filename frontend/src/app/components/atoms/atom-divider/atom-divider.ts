import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-divider',
  templateUrl: './atom-divider.html',
  styleUrl: './atom-divider.scss',
})
export class AtomDivider {
  direction = input<'horizontal' | 'vertical'>('horizontal');
  spacing = input<'sm' | 'md' | 'lg'>('md');
}
