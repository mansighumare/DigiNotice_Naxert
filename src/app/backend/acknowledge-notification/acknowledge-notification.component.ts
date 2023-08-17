import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddOrgPropertyModel } from 'src/app/models/org-asset-manager';
import { AuthenticationService, AppConfig } from 'src/app/services';
import { AccountService } from 'src/app/services/account.service';
import { NotificationService } from 'src/app/services/notification.service';
declare var $;


@Component({
  selector: 'app-acknowledge-notification',
  templateUrl: './acknowledge-notification.component.html',
  styleUrls: ['./acknowledge-notification.component.scss']
})
export class AcknowledgeNotificationComponent implements OnInit {

  constructor(public accountService: AccountService,
    private router: Router,
    public authService: AuthenticationService,
    private appConfig: AppConfig,
    private notificationServices: NotificationService,
    public toastr: ToastrService) { }

  loggedInUserRole: any;
  loggedInUserId: any;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  loggedInUserBranchId: any;
  isShowLoader: boolean = false;

  ngOnInit() {
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;
      this.getNotification();
    }
    else {
      this.router.navigate(["./login"]);
    }
  }

  notification:any=[];
  getNotification() {
    this.isShowLoader = true;
    this.notificationServices.GetNotification(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(
      (response) => {
        this.notification  = response;
        this.getNotifactionCount();
        this.isShowLoader = false;
      },
      (error) => {
        this.isShowLoader = false;
      }
    );
  }

  NotificationAlerts(){
    this.isShowLoader = true;
    this.notificationServices.NotificationAlerts().subscribe(
      (response) => {
        this.getNotification();
        this.isShowLoader = false;
      },
      (error) => {
        this.isShowLoader = false;
      }
    );
  }

  

  NotificationCount: number;
  getNotifactionCount() {
    
    this.isShowLoader = true;
    this.notificationServices.notificationCount(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(
      (r) => {
        
        this.notificationServices.updateNotifications(r[0].notificationCount);
        this.isShowLoader = false;
      },
      error => {
        this.isShowLoader = false;
      }
    );
  }

  viewProperty: any = [];
  onViewProperty(el) {
    this.isShowLoader = true;
    var asset_id = el;
    this.notificationServices.ViewProperty(asset_id).subscribe(
      (r) => {
        
        this.viewProperty = r[0];
        $("#view-property-popup").modal('show');
        this.isShowLoader = false;
      },
      error => {
        this.isShowLoader = false;
      }
    );
  }

  noticeInfo: any = [];
  onViewNotice(el) {
    
    this.isShowLoader = true;
    var notice_id = el;
    this.notificationServices.ViewNotice(notice_id).subscribe(
      (r) => {
        
        this.noticeInfo = r[0];
        $("#view-notice-popup").modal('show');
        this.isShowLoader = false;
      },
      error => {
        this.isShowLoader = false;
      }
    );
  }


  Acknowledge(id) {
    this.isShowLoader = true;
    this.notificationServices.Acknowledge(id,this.loggedInUserId).subscribe(
      (r) => {
        
        this.toastr.success(r[0].message, "Success");
        this.getNotification();
        this.getNotifactionCount();
        this.isShowLoader = false;
      },
      error => {
        this.isShowLoader = false;
      }
    );

  }

}
