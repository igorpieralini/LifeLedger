import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AtomHeading } from '../../atoms/atom-heading/atom-heading';
import { AtomIcon } from '../../atoms/atom-icon/atom-icon';
import { AtomText } from '../../atoms/atom-text/atom-text';

@Component({
  selector: 'shared-page-stub',
  imports: [AtomHeading, AtomIcon, AtomText],
  templateUrl: './shared-page-stub.html',
  styleUrl: './shared-page-stub.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedPageStub {
  icon = input('info');
  title = input('Em breve');
  description = input('Esta funcionalidade sera disponibilizada em breve.');
}
