import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { SharedModelService } from './services/sharedmodel.service';

import * as $ from 'jquery'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DigiNotice';
  constructor(
    private router: Router,
    private authService: AuthenticationService, public sharedService: SharedModelService) {
    router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.sharedService.isBackEnd = false;
          if (event.url && event.url.indexOf('backend') >= 0) {
            this.sharedService.isBackEnd = true;
          }
        }
      });
  }


  isAuthenticated: boolean = false;
  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();

    $("body").on("keypress", 'input[type="phone"]', (event:any) => {
      if (isNaN(event.key)) {
        event.preventDefault();
        return false;
      }
      else 
      {
        return true;
      }
    });
  }

  onLogOut() {
    this.authService.onLogOut();
    this.isAuthenticated = false;
  }
}