import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  protected readonly theme = inject(ThemeService);
}
