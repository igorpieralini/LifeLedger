import { Component, inject } from '@angular/core';
import { AtomIcon } from '../atom-icon/atom-icon';
import { AlertService } from './alert.service';

@Component({
  selector: 'atom-alert',
  imports: [AtomIcon],
  templateUrl: './atom-alert.html',
  styleUrl: './atom-alert.scss',
})
export class AtomAlert {
  readonly alertService = inject(AlertService);
}
