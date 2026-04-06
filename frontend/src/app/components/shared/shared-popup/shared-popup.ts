import { Component, input, output } from '@angular/core';
import { AtomIcon } from '../../atoms/atom-icon/atom-icon';

@Component({
  selector: 'shared-popup',
  imports: [AtomIcon],
  templateUrl: './shared-popup.html',
  styleUrl: './shared-popup.scss',
})
export class SharedPopup {
  open = input<boolean>(false);
  title = input<string>('');
  size = input<'sm' | 'md' | 'lg'>('md');
  closable = input<boolean>(true);

  closed = output<void>();

  onBackdropClick() {
    if (this.closable()) this.closed.emit();
  }

  onClose() {
    this.closed.emit();
  }
}
