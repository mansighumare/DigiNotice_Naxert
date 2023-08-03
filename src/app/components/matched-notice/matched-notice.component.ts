import { Component, OnInit } from '@angular/core';
import { NoticeInfoModel } from 'src/app/models';
import { AppConfig, NoticeService } from 'src/app/services';
import { Router } from '@angular/router';
import { AssetImage, EditPropertyModel, LandCategoryEnum } from 'src/app/models/asset-manager';
declare var $;
declare var toastr
@Component({
  selector: 'app-matched-notice',
  templateUrl: './matched-notice.component.html',
  styleUrls: ['./matched-notice.component.scss']
})
export class MatchedNoticeComponent implements OnInit {

  constructor(private noticeService: NoticeService,
    private router:Router,
    private appConfig: AppConfig) { }
    Plots: LandCategoryEnum = LandCategoryEnum.Plots;
    ConstructedProperty: LandCategoryEnum = LandCategoryEnum.ConstructedProperty;
    AgriculturalLand: LandCategoryEnum = LandCategoryEnum.AgriculturalLand;
  isShowLoader: boolean = false;
  noticeInfoList: Array<NoticeInfoModel> = new Array<NoticeInfoModel>();
  notices:any[];

  ngOnInit() {
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      this.getRedMatchedNotices();
    }
    else{

      this.router.navigate(["./login"]);
    }
   
  }

  getRedMatchedNotices() {
   
    this.isShowLoader = true;
    let loggedInUserString:any = localStorage.getItem("LoggedInUser");
    loggedInUserString=JSON.parse(loggedInUserString);
    this.noticeService.getRedMatchedNotices(loggedInUserString.userId)
      .subscribe((noticeInfoList: any) => {
       
        this.notices=noticeInfoList;
        //this.noticeInfoList = noticeInfoList;
        this.isShowLoader = false;
      },
      error => {
        this.isShowLoader = false;
      });
  }



  getYellowMatchedNotices() {
   
    this.isShowLoader = true;
    let loggedInUserString:any = localStorage.getItem("LoggedInUser");
    loggedInUserString=JSON.parse(loggedInUserString);
    this.noticeService.getYellowMatchedNotices(loggedInUserString.userId)
      .subscribe((noticeInfoList: any) => {
       
        this.notices=noticeInfoList;
        //this.noticeInfoList = noticeInfoList;
        this.isShowLoader = false;
      },
      error => {
        this.isShowLoader = false;
      });
  }



  viewProperty: EditPropertyModel = new EditPropertyModel();
  onViewProperty(editPropertyModel: EditPropertyModel) {
    if (editPropertyModel.assetImages != null) {
      editPropertyModel.assetImages.forEach((propertyImage: AssetImage) => {
        if (propertyImage.isDeleted != true) {
          propertyImage.imageUrl = this.appConfig.propertyImgPath + propertyImage.name;
        }
      });
    }
    this.viewProperty = editPropertyModel;
    $("#view-property-popup").modal("show");
  }
}
