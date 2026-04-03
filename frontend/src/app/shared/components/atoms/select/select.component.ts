import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'll-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  styles: [`:host { display: block; width: 100%; } mat-form-field { width: 100%; }`],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <mat-select [formControl]="control">
        <ng-content></ng-content>
      </mat-select>
    </mat-form-field>
  `
})
export class SelectComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
}
