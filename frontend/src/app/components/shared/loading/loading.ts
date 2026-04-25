import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading">
      <span class="material-symbols-rounded spin">progress_activity</span>
    </div>
  `,
  styles: `
    .loading {
      display: flex;
      justify-content: center;
      padding: 80px 0;
      color: var(--text-secondary);
      .material-symbols-rounded { font-size: 40px; }
    }
  `,
})
export class LoadingComponent {}
