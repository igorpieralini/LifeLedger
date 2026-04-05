import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-badge',
  templateUrl: './atom-badge.html',
  styleUrl: './atom-badge.scss',
})
export class AtomBadge {
  value = input<string | number>('');
  variant = input<'primary' | 'danger' | 'success' | 'warning' | 'outline'>('primary');
  size = input<'sm' | 'md'>('sm');
  color = input<string | null>(null);
}
