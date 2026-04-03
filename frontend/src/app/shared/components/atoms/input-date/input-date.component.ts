import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'll-input-date',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss'
})
export class InputDateComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() required = false;
  @Input() optional = false;
}
