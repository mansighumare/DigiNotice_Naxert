import { Component } from '@angular/core';
// import { detectBody } from '../../../app.helpers';

declare var jQuery: any;

@Component({
  selector: 'backend',
  templateUrl: 'backendLayout.component.html',

  host: {
    '(window:resize)': 'onResize()'
  }
})
export class BackendLayoutComponent {

  public ngOnInit(): any {
    // detectBody();
  }

  public onResize() {
    // detectBody();
  }

}
