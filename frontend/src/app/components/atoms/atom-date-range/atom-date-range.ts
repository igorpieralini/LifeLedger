import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'atom-date-range',
  imports: [FormsModule],
  templateUrl: './atom-date-range.html',
  styleUrl: './atom-date-range.scss',
})
export class AtomDateRange {
  label = input<string>('');
  labelFrom = input<string>('De');
  labelTo = input<string>('Até');
  disabled = input<boolean>(false);

  dateFrom = model<string>('');
  dateTo = model<string>('');

  changed = output<{ from: string; to: string }>();

  onChanged() {
    this.changed.emit({ from: this.dateFrom(), to: this.dateTo() });
  }
}
