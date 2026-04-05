import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-label',
  templateUrl: './atom-label.html',
  styleUrl: './atom-label.scss',
})
export class AtomLabel {
  for = input<string>('');
  required = input<boolean>(false);
}
