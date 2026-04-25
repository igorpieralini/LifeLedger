import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
})
export class ChipComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) icon = '';
  @Input() color = '';
  @Input() active = false;
}
