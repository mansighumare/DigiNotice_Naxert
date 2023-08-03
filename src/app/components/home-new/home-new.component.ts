import { Component, OnInit } from '@angular/core';
import { NoticeInfoModel } from 'src/app/models';
import { NoticeService } from 'src/app/services';
@Component({
  selector: 'app-home-new',
  templateUrl: './home-new.component.html',
  styleUrls: ['./home-new.component.scss']
})
export class HomeNewComponent implements OnInit {
  loggedInUserRole: any;
  loggedInUserRoleGuid: any;
  loggedInUserId: any;
  loggedInUserOrgId: any;
  constructor(public noticeService: NoticeService) { 
    
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString = null) {
      
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
        }

  }

  ngOnInit() {
    this.getTodaysNotices();
  }
  isShowLoader: boolean = false;
  noticeInfoList: Array<NoticeInfoModel> = new Array<NoticeInfoModel>();
  getTodaysNotices() {
    
    this.isShowLoader = true;
    this.noticeService.getTodaysNotices(true,'0')
      .subscribe((noticeInfoList: Array<NoticeInfoModel>) => {
        
        this.noticeInfoList = noticeInfoList;
        this.isShowLoader = false;
      },
      error => {
        this.isShowLoader = false;
      });
  }

}
