import { Component } from '@angular/core';

import { UploadComponent } from '../app/components/upload/upload.component';


@Component({
  selector: 'my-app',
  templateUrl: './app/app.html',
  directives: [UploadComponent]
})
export class AppComponent {

  constructor() {

  }

}

