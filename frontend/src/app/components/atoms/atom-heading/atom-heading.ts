import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-heading',
  templateUrl: './atom-heading.html',
  styleUrl: './atom-heading.scss',
})
export class AtomHeading {
  level = input<1 | 2 | 3 | 4 | 5 | 6>(2);
  color = input<'default' | 'muted' | 'primary'>('default');
}
