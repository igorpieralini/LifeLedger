import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-text',
  templateUrl: './atom-text.html',
  styleUrl: './atom-text.scss',
})
export class AtomText {
  variant = input<'body' | 'caption' | 'small' | 'bold'>('body');
  color = input<'default' | 'muted' | 'danger' | 'success'>('default');
  tag = input<'p' | 'span'>('p');
}
