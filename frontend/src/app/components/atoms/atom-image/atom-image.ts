import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-image',
  templateUrl: './atom-image.html',
  styleUrl: './atom-image.scss',
})
export class AtomImage {
  src = input.required<string>();
  alt = input<string>('');
  width = input<string>('');
  height = input<string>('');
  rounded = input<'none' | 'sm' | 'full'>('none');
  objectFit = input<'cover' | 'contain' | 'fill'>('cover');
}
