import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-card',
  templateUrl: './atom-card.html',
  styleUrl: './atom-card.scss',
})
export class AtomCard {
  variant = input<'default' | 'outlined'>('default');
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
}
