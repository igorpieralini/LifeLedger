import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-avatar',
  templateUrl: './atom-avatar.html',
  styleUrl: './atom-avatar.scss',
})
export class AtomAvatar {
  src = input<string>('');
  alt = input<string>('');
  initials = input<string>('');
  size = input<'sm' | 'md' | 'lg'>('md');
}
