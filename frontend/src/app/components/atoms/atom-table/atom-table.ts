import { Component, input } from '@angular/core';

@Component({
  selector: 'atom-table',
  templateUrl: './atom-table.html',
  styleUrl: './atom-table.scss',
})
export class AtomTable {
  striped = input<boolean>(false);
  hoverable = input<boolean>(true);
  stickyHeader = input<boolean>(false);
}
