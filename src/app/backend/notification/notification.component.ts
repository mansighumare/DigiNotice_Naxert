import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { NotificationModel, NotificationList } from "src/app/models/notification";
import { LookupService, NoticeService } from 'src/app/services';
declare var $;


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})


export class NotificationComponent implements OnInit {
  isShowLoader: boolean = false;
  notificationModel: NotificationModel = new NotificationModel();
  notificationList: Array<NotificationList> = new Array<NotificationList>();
  isShowNotificationLogPopup: boolean = false;
  constructor(public lookupService: LookupService, public noticeService: NoticeService,
    public toastr: ToastrService

    ) {
  }


  ngOnInit() {

  }

  onAddNotification() {

    if (this.notificationModel.notificationtext == "") {
      this.toastr.error('Add Notification is required!', "Error");
    } else if (this.notificationModel.notificationtext.length > 255) {
      this.toastr.error('Text Length should not exceed 255 charactors!', "Error");
    }
    else {
      var l = this.notificationModel;
      this.lookupService.AddNotification(this.notificationModel).subscribe((response: any) => {
        this.toastr.success('Notification Added Successsfully!', "Success");
        this.isShowLoader = false;
        this.clearForm();
      },
        error => {
          this.isShowLoader = false;
          this.toastr.error('Failed to create Notification!', "Error");
        });
    }
  }

  getNotification() {

    this.isShowNotificationLogPopup = true;
    setTimeout(() => { $("#log-Notification-popup").modal('show'); });
    this.lookupService.getNotification().subscribe((response: Array<NotificationList>) => {

      this.notificationList = response;
      this.isShowLoader = false;
    },
      error => {
        this.isShowLoader = false;
        this.toastr.error('Failed to Get Notifications!', "Error");
      });

  }
  SendNotificationForTodaysMatchedNotices() {
    this.noticeService.SendNotificationForTodaysMatchedNotices().subscribe((res: any[]) => {

      this.toastr.success('Notification sent Successsfully!', "Success");
    },
    error => {
      this.isShowLoader = false;
      this.toastr.error('Failed to sent Notification', "Error");
    });
  }

  sendActiveNotification() {
    this.isShowLoader = true;
    this.noticeService.sendActiveNotification().subscribe((res: any[]) => {
      this.isShowLoader = false;
      this.toastr.success('Notification sent Successsfully!', "Success");
    },
    error => {
      this.isShowLoader = false;
      this.toastr.error('Failed to sent Notification ', "Error");
    });
  }

  clearForm() {
    this.notificationModel = new NotificationModel();
  }
  onActiveInActiveNotification(notification: NotificationList) {
    notification.isActive = !notification.isActive;


    this.noticeService.onActiveInActiveNotification(notification).subscribe((isUpdated: boolean) => {
      this.isShowLoader = false;
      if (isUpdated) {
        var status = notification.isActive ? "Active" : "InActive";
        this.toastr.success('Updated Notification status to ' + status + '!', "Success");
      } else {
        this.toastr.error('Failed to update Notification status.', "Error");
      }
    },
      error => {
        this.isShowLoader = false;
        this.toastr.error('Failed to update Notification status.', "Error");
      });

  }
}


