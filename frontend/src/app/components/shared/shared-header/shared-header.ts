import { Component, input, output } from '@angular/core';
import { AtomIcon } from '../../atoms/atom-icon/atom-icon';
import { AtomAvatar } from '../../atoms/atom-avatar/atom-avatar';
import { AtomText } from '../../atoms/atom-text/atom-text';
import { AtomButton } from '../../atoms/atom-button/atom-button';
import { AtomChangeTheme } from '../../atoms/atom-change-theme/atom-change-theme';

@Component({
  selector: 'shared-header',
  imports: [AtomIcon, AtomAvatar, AtomText, AtomButton, AtomChangeTheme],
  templateUrl: './shared-header.html',
  styleUrl: './shared-header.scss',
})
export class SharedHeader {
  userName = input<string>('');
  userEmail = input<string>('');
  userAvatar = input<string>('');
  sidebarCollapsed = input<boolean>(false);

  toggleSidebar = output<void>();
  logout = output<void>();
}
