import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'll-select-native',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  styles: [`
    :host { display: block; width: 100%; }
    mat-form-field { width: 100%; }

    .ll-native-select {
      color: var(--text-primary) !important;
      background: transparent !important;
      font: inherit;
    }

    .ll-native-select option {
      background: var(--bg-overlay);
      color: var(--text-primary);
    }
  `],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <select matNativeControl class="ll-native-select" [formControl]="control">
        <ng-content></ng-content>
      </select>
    </mat-form-field>
  `
})
export class SelectNativeComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
}
