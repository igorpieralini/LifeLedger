import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'll-input-file',
  standalone: true,
  template: `<input #fileInput type="file" [attr.accept]="accept" hidden (change)="onChange($event)">`
})
export class InputFileComponent {
  @Input() accept = '';
  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild('fileInput') private fileInputRef!: ElementRef<HTMLInputElement>;

  triggerClick() {
    this.fileInputRef.nativeElement.click();
  }

  onChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.fileSelected.emit(file);
    (e.target as HTMLInputElement).value = '';
  }
}
