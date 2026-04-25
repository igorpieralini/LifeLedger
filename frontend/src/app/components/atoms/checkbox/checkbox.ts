import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class CheckboxComponent {
  @Input() checked = false;
  @Output() toggle = new EventEmitter<void>();
}
