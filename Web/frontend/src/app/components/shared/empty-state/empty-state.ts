import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyStateComponent {
  @Input() icon = 'flag';
  @Input() message = 'Nenhum item encontrado';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
