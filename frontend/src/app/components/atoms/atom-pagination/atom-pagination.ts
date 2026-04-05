import { Component, input, output } from '@angular/core';
import { AtomButton } from '../atom-button/atom-button';
import { AtomIcon } from '../atom-icon/atom-icon';

@Component({
  selector: 'atom-pagination',
  imports: [AtomButton, AtomIcon],
  templateUrl: './atom-pagination.html',
  styleUrl: './atom-pagination.scss',
})
export class AtomPagination {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  visiblePages = input.required<number[]>();

  pageChanged = output<number>();

  goToPage(page: number) {
    this.pageChanged.emit(page);
  }

  prevPage() {
    this.pageChanged.emit(this.currentPage() - 1);
  }

  nextPage() {
    this.pageChanged.emit(this.currentPage() + 1);
  }
}
