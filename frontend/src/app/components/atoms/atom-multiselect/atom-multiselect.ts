import { Component, input, output, model, signal, computed, ElementRef, HostListener } from '@angular/core';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'atom-multiselect',
  templateUrl: './atom-multiselect.html',
  styleUrl: './atom-multiselect.scss',
})
export class AtomMultiselect {
  options = input.required<MultiSelectOption[]>();
  placeholder = input<string>('Selecione...');
  label = input<string>('');
  name = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  error = input<string>('');

  selected = model<string[]>([]);

  changed = output<string[]>();

  open = signal(false);

  displayText = computed(() => {
    const sel = this.selected();
    if (!sel.length) return '';
    const opts = this.options();
    const labels = sel.map(v => opts.find(o => o.value === v)?.label ?? v);
    return labels.join(', ');
  });

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }

  toggleDropdown() {
    if (this.disabled()) return;
    this.open.update(v => !v);
  }

  toggleOption(value: string) {
    const current = [...this.selected()];
    const idx = current.indexOf(value);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(value);
    }
    this.selected.set(current);
    this.changed.emit(current);
  }

  isSelected(value: string): boolean {
    return this.selected().includes(value);
  }
}
