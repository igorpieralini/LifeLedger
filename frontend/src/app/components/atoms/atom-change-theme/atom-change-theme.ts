import { Component, inject } from '@angular/core';
import { AtomIcon } from '../atom-icon/atom-icon';
import { ThemeService } from '../../../theme/theme.service';

@Component({
  selector: 'atom-change-theme',
  imports: [AtomIcon],
  templateUrl: './atom-change-theme.html',
  styleUrl: './atom-change-theme.scss',
})
export class AtomChangeTheme {
  protected readonly themeService = inject(ThemeService);

  get isDark() {
    return this.themeService.current() === 'dark';
  }

  toggle() {
    this.themeService.toggle();
  }
}
