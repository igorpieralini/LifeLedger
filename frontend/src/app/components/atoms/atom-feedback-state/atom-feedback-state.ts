import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AtomHeading } from '../atom-heading/atom-heading';
import { AtomIcon } from '../atom-icon/atom-icon';
import { AtomSpinner } from '../atom-spinner/atom-spinner';
import { AtomText } from '../atom-text/atom-text';

@Component({
  selector: 'atom-feedback-state',
  imports: [AtomHeading, AtomIcon, AtomSpinner, AtomText],
  templateUrl: './atom-feedback-state.html',
  styleUrl: './atom-feedback-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomFeedbackState {
  mode = input<'loading' | 'empty'>('empty');
  icon = input('info');
  title = input('');
  description = input('');
}
