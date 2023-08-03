import { Component, OnInit } from '@angular/core';
import { NoticeInfoModel } from 'src/app/models';
import { NoticeService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {

  constructor(private noticeService: NoticeService,
    private router:Router) { }

  isShowLoader: boolean = false;
  noticeInfoList: Array<NoticeInfoModel> = new Array<NoticeInfoModel>();

  ngOnInit() {
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      this.getBookMarkedNotices();
    }
    else{
      this.router.navigate(["./login"]);
    }
   
  }

  getBookMarkedNotices() {
    this.isShowLoader = true;
    let loggedInUserString:any = localStorage.getItem("LoggedInUser");
    loggedInUserString=JSON.parse(loggedInUserString);
    let userId:string="0";
    if(loggedInUserString)
      userId=loggedInUserString.userId;
    this.noticeService.getBookMarkedNotices(userId)
      .subscribe((noticeInfoList: Array<NoticeInfoModel>) => {
        this.noticeInfoList = noticeInfoList;
        this.isShowLoader = false;
      },
      error => {
        this.isShowLoader = false;
      });
  }

  onBookmarkToggle(noticeInfo: NoticeInfoModel) {
  }
}
