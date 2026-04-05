import { Component } from '@angular/core';
import { AtomText } from '../../atoms/atom-text/atom-text';
import { AtomLink } from '../../atoms/atom-link/atom-link';

@Component({
  selector: 'shared-footer',
  imports: [AtomText, AtomLink],
  templateUrl: './shared-footer.html',
  styleUrl: './shared-footer.scss',
})
export class SharedFooter {
  readonly year = new Date().getFullYear();
}
