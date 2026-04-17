import { Component } from '@angular/core';
import { SharedPageStub } from '../../../components/shared/shared-page-stub/shared-page-stub';

@Component({
  selector: 'page-import',
  imports: [SharedPageStub],
  template: `
    <shared-page-stub
      icon="upload_file"
      title="Importar"
      description="Envie extratos CSV e PDF para preencher suas transacoes automaticamente."
    />
  `,
})
export class ImportPage {}
