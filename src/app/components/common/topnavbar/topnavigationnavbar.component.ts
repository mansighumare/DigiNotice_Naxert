import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services';
// import { smoothlyMenu } from '../../../app.helpers';
declare var jQuery: any;

@Component({
  selector: 'topnavigationnavbar',
  templateUrl: 'topnavigationnavbar.template.html'
})
export class TopNavigationNavbarComponent {

  public innerWidth: any;
  isShowDownloadLink :boolean =false;
  constructor(public authService: AuthenticationService) {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth >= 933)
       this.isShowDownloadLink =false
    else this.isShowDownloadLink =true
  }

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    // smoothlyMenu();
  }

  onLogoutUser() {
    this.authService.onLogOut();
  }

}
