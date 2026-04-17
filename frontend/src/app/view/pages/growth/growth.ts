import { Component } from '@angular/core';
import { SharedPageStub } from '../../../components/shared/shared-page-stub/shared-page-stub';

@Component({
  selector: 'page-growth',
  imports: [SharedPageStub],
  template: `
    <shared-page-stub
      icon="trending_up"
      title="Crescimento"
      description="Acompanhe hábitos, metas pessoais e sua evolução contínua."
    />
  `,
})
export class GrowthPage {}
