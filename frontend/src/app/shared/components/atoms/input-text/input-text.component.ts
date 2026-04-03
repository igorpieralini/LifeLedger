import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'll-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  styles: [`:host { display: block; width: 100%; } mat-form-field { width: 100%; }`],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <input matInput [formControl]="control" [placeholder]="placeholder"
             [attr.maxlength]="maxLength > 0 ? maxLength : null">
      <mat-hint align="end" *ngIf="maxLength > 0">
        {{ control.value?.length ?? 0 }}/{{ maxLength }}
      </mat-hint>
      <mat-error *ngIf="errorMessage">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class InputTextComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() maxLength = 0;
  @Input() errorMessage = '';
}
