import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OverlayComponent } from '../overlay/overlay';
import { IconBtnComponent } from '../../atoms/icon-btn/icon-btn';

@Component({
  selector: 'app-form-panel',
  standalone: true,
  imports: [OverlayComponent, IconBtnComponent],
  templateUrl: './form-panel.html',
  styleUrl: './form-panel.scss',
})
export class FormPanelComponent {
  @Input({ required: true }) title = '';
  @Output() closed = new EventEmitter<void>();
}
