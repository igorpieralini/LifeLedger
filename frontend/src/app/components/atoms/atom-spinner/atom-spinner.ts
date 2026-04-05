import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-spinner',
  templateUrl: './atom-spinner.html',
  styleUrl: './atom-spinner.scss',
})
export class AtomSpinner {
  size = input<'sm' | 'md' | 'lg'>('md');
}
