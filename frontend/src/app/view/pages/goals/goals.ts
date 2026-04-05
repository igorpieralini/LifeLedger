import { Component } from '@angular/core';
import { AtomHeading } from '../../../components/atoms/atom-heading/atom-heading';
import { AtomIcon } from '../../../components/atoms/atom-icon/atom-icon';

@Component({
  selector: 'page-goals',
  imports: [AtomHeading, AtomIcon],
  template: `
    <div class="page-stub">
      <atom-icon name="flag" size="xl" color="var(--color-muted)" />
      <atom-heading [level]="3">Metas</atom-heading>
    </div>
  `,
  styles: `:host { display:flex; flex:1; } .page-stub { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.75rem; flex:1; }`,
})
export class GoalsPage {}
