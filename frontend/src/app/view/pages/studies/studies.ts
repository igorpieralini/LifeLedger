import { Component } from '@angular/core';
import { SharedPageStub } from '../../../components/shared/shared-page-stub/shared-page-stub';

@Component({
  selector: 'page-studies',
  imports: [SharedPageStub],
  template: `
    <shared-page-stub
      icon="school"
      title="Estudos"
      description="Organize seus planos de estudo, cursos e aprendizados."
    />
  `,
})
export class StudiesPage {}
