import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService, AppConfig } from 'src/app/services';
import { AccountService } from 'src/app/services/account.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedModelService } from 'src/app/services';
declare var jQuery: any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html',
  styleUrls: ['topnavbar.component.scss']
})
export class TopNavbarComponent {


collaps:boolean=true;


  isShowDownloadLink = false;
  loggedInUserRole: any;
  loggedInUserId: any;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  loggedInUserBranchId: any;
  loggedInUserlogoURL:string;
  loggedInUserBranchName:string;
  
  constructor(
    private shared:SharedModelService,
    public accountService: AccountService,
    private router: Router,
    public authService: AuthenticationService,
    private appConfig: AppConfig,
    public notificationServices: NotificationService,
 
  ) { }


  contactNumber: string = "";
  ngOnInit() {
    this.shared.getBoolean().subscribe(
      {next:data=>{
      this.collaps=data}
        
      }
    )
    this.contactNumber = this.appConfig.appConfig.contactNumber;
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;
      this.loggedInUserlogoURL = loggedInUserString.logoURL;
      this.loggedInUserBranchName = loggedInUserString.branchName;

      if(this.loggedInUserRoleGuid=="5A684E94-A768-45B7-8A2E-1F3BF22FC8B4" || this.loggedInUserRoleGuid=="52068551-9841-4EBA-BB87-96D0DCBF1595" || this.loggedInUserRoleGuid=="64B4686D-6086-4AD8-AE9C-D4FB4F409588"){
      this.getNotifactionCount();
      }
    }
    else {
      this.router.navigate(["./login"]);
    }

  }

  
  NotificationCount: number;
  getNotifactionCount() {
    this.notificationServices.updateNotifications(0);
   
    this.notificationServices.notificationCount(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(
      (r) => {
        
        this.notificationServices.updateNotifications(r[0].notificationCount);
      }
    );
  }

goAcknowledge(){
//  this.router.navigate(["/acknowledge"]);
  this.router.navigate(["./backend/acknowledge-alerts"]);
}


togglemenu(){

  // jQuery(".sidebar").toggleClass('mini-navbar');
  // console.log("click")



  this.shared.setBoolean(!this.collaps);

}

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    
    // smoothlyMenu();
  }

  onRouterLinkClick(path: string) {
    
    
    if (this.loggedInUserRoleGuid == "f38a74b1-97ad-4c7e-88a5-a752a6240e5b") {
      this.router.navigate(['./my-profile']);

    }
    else {
      this.router.navigate(['./backend/my-profile']);
    }
  }

  onLogoutUser() {
    this.authService.onLogOut();
  }




}
