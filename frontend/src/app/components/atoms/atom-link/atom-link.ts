import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'atom-link',
  imports: [RouterLink],
  templateUrl: './atom-link.html',
  styleUrl: './atom-link.scss',
})
export class AtomLink {
  href = input<string>('');
  routerLink = input<string | string[]>('');
  target = input<'_self' | '_blank'>('_self');
  variant = input<'default' | 'muted' | 'danger'>('default');
}
