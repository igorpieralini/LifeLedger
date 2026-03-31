import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FinanceService } from '../../../core/services/finance.service';
import { CsvImportResult } from '../../../core/models/finance.model';

type Step     = 'pick' | 'loading' | 'result' | 'error';
type FileType = 'csv' | 'pdf' | null;

@Component({
  selector: 'll-csv-import-dialog',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatIconModule, MatButtonModule],
  templateUrl: './csv-import-dialog.component.html',
  styleUrl: './csv-import-dialog.component.scss'
})
export class CsvImportDialogComponent {
  @Output() done = new EventEmitter<boolean>();

  step      = signal<Step>('pick');
  dragOver  = signal(false);
  fileName  = signal('');
  fileType  = signal<FileType>(null);
  result    = signal<CsvImportResult | null>(null);
  errorMsg  = signal('');

  constructor(private financeService: FinanceService) {}

  onDragOver(e: DragEvent) { e.preventDefault(); this.dragOver.set(true); }
  onDragLeave()            { this.dragOver.set(false); }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.upload(file);
  }

  onFileSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.upload(file);
    (e.target as HTMLInputElement).value = '';
  }

  private upload(file: File) {
    const name = file.name.toLowerCase();
    const isPdf = name.endsWith('.pdf');
    const isCsv = name.endsWith('.csv');

    if (!isPdf && !isCsv) {
      this.errorMsg.set('Apenas arquivos .csv e .pdf são suportados');
      this.step.set('error');
      return;
    }

    this.fileName.set(file.name);
    this.fileType.set(isPdf ? 'pdf' : 'csv');
    this.step.set('loading');

    const request$ = isPdf
      ? this.financeService.importPdf(file)
      : this.financeService.importCsv(file);

    request$.subscribe({
      next:  (res) => { this.result.set(res); this.step.set('result'); },
      error: (err) => {
        this.errorMsg.set(err.error?.message ?? 'Erro ao processar o arquivo');
        this.step.set('error');
      }
    });
  }

  confirm() { this.done.emit(true); }
  reset()   { this.step.set('pick'); this.fileName.set(''); this.fileType.set(null); this.result.set(null); }
  close()   { this.done.emit(false); }

  categoryEntries() {
    const r = this.result();
    if (!r) return [];
    return Object.entries(r.byCategory).sort((a, b) => b[1] - a[1]);
  }
}
