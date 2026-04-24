import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <span>&copy; {{ year }} Sprezzari</span>
    </footer>
  `,
  styles: `
    .footer {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 32px;
      border-top: 1px solid var(--border);
      background: var(--bg-secondary);
      font-size: 12px;
      color: var(--text-secondary);
      flex-shrink: 0;
    }
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
