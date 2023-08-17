import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoticeInfoModel } from 'src/app/models';
import { SharedModelService, NoticeService, AppConfig, AuthenticationService } from 'src/app/services';
import { NoticeDetail } from 'src/app/models/notice-info';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var $;

@Component({
  selector: 'app-notice-card',
  templateUrl: './notice-card.component.html',
  styleUrls: ['./notice-card.component.scss']
})
export class NoticeCardComponent implements OnInit {

  @Input() noticeInfo: NoticeInfoModel = null;
  @Input() isShowBookmark: boolean = null;
  @Output() onBookmark: EventEmitter<NoticeInfoModel> = new EventEmitter();
  @Output() onDelete: EventEmitter<NoticeInfoModel> = new EventEmitter();
  @Output() onEdit: EventEmitter<NoticeInfoModel> = new EventEmitter();

  info:any=[];
  loggedInUserRole: any;
  loggedInUserRoleGuid: any;
  loggedInUserId: any;
  loggedInUserOrgId: any;

  Area: string = "";
  constructor(
    private router: Router,
    private noticeService: NoticeService,
    public authService: AuthenticationService,
    public appConfig: AppConfig,
    public sharedModel: SharedModelService,
    public toastr: ToastrService) {
      var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {
      

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;


    }
     }

  ngOnInit() {
   
   
    // if (this.noticeInfo.noticeImage != null && this.noticeInfo.noticeImage.length > 0) {
    //   this.noticeInfo.noticeImage.forEach(image => {
    //     if (image.imageTypeId == 1) {
    //       this.noticeInfo.imageUrl = image.name; //this.appConfig.imagePath + 
    //     }
    //   });
    // }
    // else {
    //   this.noticeInfo.imageUrl = "./assets/img/notice-not-found.png";
    // }
    if (this.noticeInfo.noticeDetailList != null && this.noticeInfo.noticeDetailList.length > 0) {
      let firstNoticeDetail: NoticeDetail = this.noticeInfo.noticeDetailList[0];
      this.noticeInfo.surveyNumber = firstNoticeDetail.surveyNumber;
      this.noticeInfo.gatNumber = firstNoticeDetail.gatNumber;
      this.noticeInfo.ctsNumber = firstNoticeDetail.ctsNumber;
      this.noticeInfo.plotNumber = firstNoticeDetail.plotNumber;
      this.noticeInfo.area = firstNoticeDetail.area;

      if (this.noticeInfo.area.includes("squareMeter")) {
        this.noticeInfo.area = this.noticeInfo.area.slice(16, -2) + " Sq. M";
      }
      if (this.noticeInfo.area.includes("squareFeet")) {
        this.noticeInfo.area = this.noticeInfo.area.slice(16, -2) + " Sq. Ft";
      }
      if (this.noticeInfo.area.includes("Var")) {
        this.noticeInfo.area = this.noticeInfo.area.slice(9, -2) + " Var";
      }
      if (this.noticeInfo.area.includes("Foot")) {
        this.noticeInfo.area = this.noticeInfo.area.slice(10, -2) + " Foot";
      }
      if (this.noticeInfo.area.includes("hectorH" && "hectorR")) {
        var hectorH = this.noticeInfo.area.slice(this.noticeInfo.area.indexOf(':') + 2, this.noticeInfo.area.indexOf(',') - 1);
        var indexLastComma = this.noticeInfo.area.lastIndexOf(',');
        if (indexLastComma === this.noticeInfo.area.indexOf(',')) {
          indexLastComma = this.noticeInfo.area.indexOf('}');
        }
        var hectorR = this.noticeInfo.area.slice(this.noticeInfo.area.indexOf('R') + 4, indexLastComma - 1);
        if (this.noticeInfo.area.includes("potKharab")) {
          var indexb = this.noticeInfo.area.indexOf('b');
          var indexLastCommaPot = this.noticeInfo.area.lastIndexOf('}');
          var potKharab = this.noticeInfo.area.slice(this.noticeInfo.area.indexOf('b') + 4, this.noticeInfo.area.lastIndexOf('}') - 1);
          this.noticeInfo.area = hectorH + " H, " + hectorR + " R, " + potKharab + " Pot Kharaba";
        } else {
          this.noticeInfo.area = hectorH + " H, " + hectorR + " R";
        }
      }
      this.noticeInfo.propertyArea = firstNoticeDetail.propertyArea;

    }
    this.sharedModel.validateObjectProperties(this.noticeInfo);
  }

  isShowViewNoticePopup: boolean = false;
  showViewNoticePopup() {
   
   //this.info = { values: [].concat(Object.values(this.noticeInfo)) };
    // this.info=Object.values(this.noticeInfo);

   
    this.isShowViewNoticePopup = true;
    setTimeout(() => { $("#view-notice-popup").modal('show'); }, 100);
  }

  onViewNoticePopupClose() {
    $("#view-notice-popup").modal('hide');
    setTimeout(() => { this.isShowViewNoticePopup = false; }, 100);
  }

  onBookMarkNotice(noticeInfo: NoticeInfoModel) {
    noticeInfo.isBookmakedNotice = !noticeInfo.isBookmakedNotice;
    this.noticeService.bookmarkNotice(noticeInfo)
      .subscribe(res => {
        this.onBookmark.emit(noticeInfo);
      });
  }

  onCardSelect($event) {
    var userRole = this.authService.loggedInUser.role;
    if (userRole != "User" && $event.ctrlKey) {
      this.noticeInfo.isSelected = !this.noticeInfo.isSelected
    }
  }

  onDeleteNotice(noticeInfo: NoticeInfoModel) {
    this.onDelete.emit(noticeInfo);
  }

  onEditNotice(noticeInfo: NoticeInfoModel) {
    this.onEdit.emit(noticeInfo);
  }
}