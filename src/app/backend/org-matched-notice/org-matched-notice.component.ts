import { Component, OnInit } from '@angular/core';
import { NoticeInfoModel } from 'src/app/models';
import { AppConfig, NoticeService } from 'src/app/services';
import { Router } from '@angular/router';
import { AssetImage, EditPropertyModel, LandCategoryEnum } from 'src/app/models/asset-manager';
import { EditOrgPropertyModel } from 'src/app/models/org-asset-manager';
declare var $;
declare var toastr

@Component({
  selector: 'app-org-matched-notice',
  templateUrl: './org-matched-notice.component.html',
  styleUrls: ['./org-matched-notice.component.scss']
})
export class OrgMatchedNoticeComponent implements OnInit {

  constructor(private noticeService: NoticeService,
    private router: Router,
    private appConfig: AppConfig) { }
  Plots: LandCategoryEnum = LandCategoryEnum.Plots;
  ConstructedProperty: LandCategoryEnum = LandCategoryEnum.ConstructedProperty;
  AgriculturalLand: LandCategoryEnum = LandCategoryEnum.AgriculturalLand;
  isShowLoader: boolean = false;
  noticeInfoList: Array<NoticeInfoModel> = new Array<NoticeInfoModel>();
  notices: any=[];

  ngOnInit() {
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      this.getRedMatchedNotices();
    }
    else {

      this.router.navigate(["./login"]);
    }

  }

  getRedMatchedNotices() {
   
    this.isShowLoader = true;
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.noticeService.getOrgRedMatchedNotices(loggedInUserString.userId,loggedInUserString.role_guid,loggedInUserString.org_id,loggedInUserString.branch_id)
      .subscribe((noticeInfoList: any) => {
       
        this.notices = noticeInfoList;
        console.log(this.notices.length)
        //this.noticeInfoList = noticeInfoList;
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }



  getYellowMatchedNotices() {
   
    this.isShowLoader = true;
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.noticeService.getOrgYellowMatchedNotices(loggedInUserString.userId,loggedInUserString.role_guid,loggedInUserString.org_id,loggedInUserString.branch_id)
      .subscribe((noticeInfoList: any) => {
       
        this.notices = noticeInfoList;
        //this.noticeInfoList = noticeInfoList;
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }


  NameMatchedNotices() {
   
    this.isShowLoader = true;
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.noticeService.NameMatchedNotices(loggedInUserString.userId,loggedInUserString.role_guid,loggedInUserString.org_id,loggedInUserString.branch_id)
      .subscribe((noticeInfoList: any) => {
       
        this.notices = noticeInfoList;
        //this.noticeInfoList = noticeInfoList;
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }



  viewProperty:any = new EditOrgPropertyModel();
  onViewProperty(editOrgPropertyModel: EditOrgPropertyModel) {
    if (editOrgPropertyModel.assetImages != null) {
      editOrgPropertyModel.assetImages.forEach((propertyImage: AssetImage) => {
        if (propertyImage.isDeleted != true) {
          
          propertyImage.imageUrl = this.appConfig.orgPropertyImgPath + propertyImage.name;
        }
      });
    }
    this.viewProperty = editOrgPropertyModel;
    $("#view-property-popup").modal("show");
  }
  
}
