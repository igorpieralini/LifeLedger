import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn',
  standalone: true,
  templateUrl: './btn.html',
  styleUrl: './btn.scss',
})
export class BtnComponent {
  @Input() variant: 'primary' | 'ghost' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() size: 'md' | 'sm' = 'md';
}
