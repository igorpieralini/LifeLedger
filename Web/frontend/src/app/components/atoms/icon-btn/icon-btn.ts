import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-btn',
  standalone: true,
  templateUrl: './icon-btn.html',
  styleUrl: './icon-btn.scss',
})
export class IconBtnComponent {
  @Input({ required: true }) icon = '';
  @Input() variant: 'default' | 'danger' = 'default';
  @Input() size: 'md' | 'sm' = 'md';
  @Input() ariaLabel = '';
}
