import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class BadgeComponent {
  @Input({ required: true }) status = '';
  @Input({ required: true }) label = '';
  @Input() ariaLabel = '';
}
