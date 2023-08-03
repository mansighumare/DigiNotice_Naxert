import { Component, OnInit } from '@angular/core';
import { NoticeInfoModel, SearchModel, AddNoticeModel } from '../../models';
import { LookupService, NoticeService, SharedModelService, AppConfig, AuthenticationService } from 'src/app/services';
import { NoticeImage, NoticeDetail, NoticeAdvocateModel } from "src/app/models/notice-info";
import { ReportService } from 'src/app/services/report.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
declare var $;

declare var toastr;
@Component({
  selector: 'app-notice-master',
  templateUrl: './notice-master.component.html',
  styleUrls: ['./notice-master.component.scss']
})
export class NoticeMasterComponent implements OnInit {
  startDate:string='';
  endDate:string='';

  constructor(
    public sharedModel: SharedModelService,
    public noticeService: NoticeService,
    private appConfig: AppConfig,
    public reportService: ReportService,
    public lookupService: LookupService,
    public router: Router,
    public authService: AuthenticationService) {
  }
  public is_add_other_details: boolean = false;
  isShowLoader: boolean = false;
  tabName: string = "universal-search";
  NoticeType: any = [];
  personList: Array<NoticeAdvocateModel> = new Array<NoticeAdvocateModel>();
  public flag: boolean = true;
  searchModel: SearchModel = new SearchModel();
  loggedInUserRole: string = this.authService.loggedInUser.role;
  noticeInfoList: Array<NoticeInfoModel> = new Array<NoticeInfoModel>();
  isBanking: any = false;

  ngOnInit() {
    this.startDate= this.getDefaultStartDate();
    this.endDate=this.getDefaultStartDate();
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      // this.getTodaysNotices(this.activeNoticesOnly);
      let dateTime: Date = new Date();
      let week = moment().subtract(6, 'days');
      // $(document).ready(function () {
      //   $('#txtSearchDateRange').daterangepicker(
      //     {
      //       startDate: moment(),
      //       endDate: moment(),
      //       // startDate:moment(),
      //       // endDate:moment(),
      //      // dateLimit: { days: 30 },
      //       showDropdowns: true,
      //       showWeekNumbers: true,
      //       ranges: {
      //         'Today': [moment(), moment()],
      //         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      //         'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      //         'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      //         'This Month': [moment().startOf('month'), moment().endOf('month')],
      //         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
              
      //       },
      //       opens: 'left',
      //       buttonClasses: ['btn btn-default'],
      //       applyClass: 'btn-small btn-primary',
      //       cancelClass: 'btn-small',
      //       separator: ' to ',
      //       locale: {
      //         format: 'DD/MM/YYYY',
      //         applyLabel: 'Submit',
      //         fromLabel: 'From',
      //         toLabel: 'To',
      //         customRangeLabel: 'Custom Range',
      //         daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      //         monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      //         firstDay: 1
      //       }
      //     }
      //   );
      // });

      this.searchModel.pageNumber = 1;
      this.noticeInfoList = [];
      setTimeout(() => { this.getRecentNotices(); }, 100);
      this.initContextMenu();
      this.getNoticeType();
     
    }
    else {
      this.router.navigate(["./login"]);
    }
  }



  onDistrictChange($event) {

    var cityId = $event.target.value;
    if (cityId == 0) {
      this.searchModel.talukaId = 0;
      this.searchModel.villageId = 0;
      this.lookupService.talukaList = [];
      this.lookupService.villageList = [];
    }
    else {
      this.lookupService.getTalukas(cityId);
    }
  }

  onTalukaChange($event) {
    var talukaId = $event.target.value;
    if (talukaId == 0) {
      this.searchModel.villageId = 0;
      this.lookupService.villageList = [];
    }
    else {
      this.lookupService.getVillages(talukaId);
    }
  }
  getNoticeType() {
    //
    this.isShowLoader = true;
    this.lookupService.getNoticeType().subscribe(
      (r) => {

        this.NoticeType = r;
        this.NoticeType = this.NoticeType.filter(notice => notice.isActive === true);
        this.isShowLoader = false;
        this.NoticeType.forEach(element => {
          
          if(element.id==this.editNoticeModel.noticeTypeId)
          {            
            this.isBanking=element.isBanking;
          }
         
        });
      
      }
    );
  }

  // searchClient($event) {
  //   this.flag = true;
  //   this.personList = [];
  //   if ($event.target.value.length >= 4) {
  //     this.isShowLoader = true;
  //     this.noticeService.GetAdvocateList(($any)($event.target).value).subscribe((personList: any) => {
  //       this.personList = personList;
  //       this.isShowLoader = false;       
  //     }, error => {
  //       this.isShowLoader = false;
  //       this.personList = [];
  //     });
  //   }
  //   else {
  //     this.isShowLoader = false;
  //     return false;
  //   }
  //   this.isShowLoader = false;
  // }

  getDefaultStartDate(): string {
    const defaultDate = new Date(); // You can set this to any desired default date
    return defaultDate.toISOString().substr(0, 10); // Convert to YYYY-MM-DD format
  }

  selectAllValue = 'selectAll';
  selectAllLabel = 'All';
  noticeTypeArray: any = [];

  toggleSelectAll() {
    
    if (this.noticeTypeArray.length - 1 === this.NoticeType.length) {
      // all options are selected, so deselect all
      this.noticeTypeArray = ["0"];
      this.selectAllLabel = 'All';
    } else {
      // some or no options are selected, so select all
      this.noticeTypeArray = this.NoticeType.map(noticetype => noticetype.id);
      this.selectAllLabel = 'None';
    }
    this.getSelectedValue1(this.noticeTypeArray);
  }
  getSelectedValue1(e) {
    
    var arr = e;
    this.searchModel.noticeTypeId = arr.join(',');
  }

  persondetail(person) {
    //
    this.searchModel.advocateName = person.fullName;
    this.flag = false;
    document.getElementById("pListId").style.zIndex = "0";
  }
  isGetRecentNotices: boolean = true;
  getRecentNotices() {
    
    //    
    this.isShowLoader = true;
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.noticeService.getRecentNotices(this.searchModel.pageNumber, this.searchModel.isActiveOnly, loggedInUserString.userId, this.searchModel.noticeTypeId)
      .subscribe((noticeInfoList: Array<NoticeInfoModel>) => {
        if (noticeInfoList.length == 0) {
          this.isAllLoaded = true;
        }
        noticeInfoList.forEach(noticeInfo => {
          this.noticeInfoList.push(noticeInfo);
        });
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }

  isAllLoaded: boolean = false;
  onSearchNotice(resetPagination: boolean = false) {
 
    if (this.searchModel.plotNumber != "" && this.searchModel.surveyNumber == "") {
      toastr.error('Please enter either Survey Number or Gat Number!', "Error");
      this.isShowLoader = false;
      return false;
    }
    else {
      this.isGetRecentNotices = false;
      this.isAllLoaded = false;

      if (resetPagination) {
        this.searchModel.pageNumber = 1;
        this.noticeInfoList = [];
      }
      var $dateField = $('#txtSearchDateRange');
     this.searchModel.startDate = new Date(this.startDate);
      this.searchModel.endDate =new Date(this.endDate);
      this.isShowLoader = true;

      this.noticeService.searchNotice(this.searchModel)
        .subscribe((noticeInfoList: Array<NoticeInfoModel>) => {
          
          if (noticeInfoList.length == 0) {
            this.isAllLoaded = true;
          }
          noticeInfoList.forEach(noticeInfo => {
            this.noticeInfoList.push(noticeInfo);
          });
          this.isShowLoader = false;
        },
        () => {
            console.error('An error occurred while retrieving notice information');
            this.isShowLoader = false;
          });
    }
  }

  selectedNoticeIdList: Array<number> = [];
  initContextMenu() {
    $(document).ready(() => {
      $("body").on("contextmenu", "div#master-notice-view", (e) => {
        var selectedNotices = $(e.currentTarget).find("div.notice-card.selected");
        this.selectedNoticeIdList = [];
        e.preventDefault();

        $.each(selectedNotices, (key, ele) => {
          var noticeId = Number(ele.id);
          this.selectedNoticeIdList.push(noticeId);
        });

        $("#context-menu").css({
          display: "block",
          position: "absolute",
          top: e.offsetY,
          left: e.offsetX
        }).addClass("show");
        return false;
      }).on("click", (e) => {
        $("#context-menu").removeClass("show").hide();
      });

      $("body").on("click", "#context-menu a", (e) => {
        $(this).parent().removeClass("show").hide();
      });

    });
  }

  markNoticeActiveInactive(isActive: boolean) {

    let noticeList: any = [];
    var status = isActive ? "Active" : "InActive";
    this.selectedNoticeIdList.forEach(noticeId => {
      var notice = { "noticeId": noticeId, "isActive": isActive };
      noticeList.push(notice);
      let noticeInfo: NoticeInfoModel = this.noticeInfoList.find(n => n.noticeId == noticeId);
      noticeInfo.isActive = isActive;
      noticeInfo.isSelected = false;
    });

    this.noticeService.markNoticeActiveInactive(noticeList)
      .subscribe((noticeInfoList: Array<NoticeInfoModel>) => {

        toastr.success('Successsfully Marked Notices As ' + status + '!', "Success");
      },
        error => {
          this.isShowLoader = false;
          toastr.error('Failed To Mark Notices As ' + status + '!', "Error");
        });
  }

  deleteSelectedNotices() {
    let noticeList: any = [];
    this.selectedNoticeIdList.forEach(noticeId => {
      var notice = { "noticeId": noticeId, "isDeleted": true };
      noticeList.push(notice);
      let noticeInfo: NoticeInfoModel = this.noticeInfoList.find(n => n.noticeId == noticeId);
      noticeInfo.isDeleted = true;
    });
    this.isShowLoader = true;
    this.noticeService.deleteNotices(noticeList)
      .subscribe((noticeInfoList: Array<NoticeInfoModel>) => {
        toastr.success("Successsfully Deleted Selected Notices");
      },
        error => {
          this.isShowLoader = false;
          toastr.error("Failed To Delete Selected Notices");
        });
  }

  onContextMenuAction(contextMenuAction: string) {
    switch (contextMenuAction) {
      case "MarkAsActive":
        this.markNoticeActiveInactive(true);
        break;
      case "MarkAsInActive":
        this.markNoticeActiveInactive(false);
        break;
      case "MarkAll":
        this.markAllNotices(true);
        break;
      case "UnMarkAll":
        this.markAllNotices(false);
        break;
      case "DeleteSelected":
        this.deleteSelectedNotices();
        break;
      default:
        break;
    }
  }

  markAllNotices(isSelect: boolean) {
    if (isSelect)
      $(".notice-card").addClass("selected");
    else
      $(".notice-card").removeClass("selected");
  }

  //Event recevied from child component(notice-card-component)
  onDeleteNotice(noticeInfo: NoticeInfoModel) {
    this.isShowLoader = true;
    this.noticeService.deleteNotice(noticeInfo)
      .subscribe(res => {
        this.isShowLoader = false;
        toastr.success('Notice Deleted Successsfully!', "Success");
        noticeInfo.isDeleted = true;
      },
        error => {
          this.isShowLoader = false;
          toastr.error("Failed To Delete Notice");
        });
  }

  onEditNotice(noticeInfo: AddNoticeModel) {    
    this.editNoticeModel = new AddNoticeModel();
    this.editNoticeModel = noticeInfo;
    this.editNoticeModel.id = noticeInfo.noticeId;
    this.editNoticeModel.noticeTypeId = noticeInfo.noticeTypeId;
    this.editNoticeModel.noticeTitle = noticeInfo.noticeTitle;
    this.editNoticeModel.landCategoryId = noticeInfo.landCategoryId.toString();
    this.editNoticeModel.paperId = noticeInfo.paperId;
    this.editNoticeModel.paperName = noticeInfo.paperName;
    this.editNoticeModel.cityName = noticeInfo.cityName;
    this.editNoticeModel.publishedDate = noticeInfo.publishedDate;
    this.editNoticeModel.landMark = noticeInfo.landMark;
    this.editNoticeModel.unitTypeId = noticeInfo.unitTypeId;
    this.editNoticeModel.ownerFullName = noticeInfo.ownerFullName;
    this.editNoticeModel.advocateId = noticeInfo.advocateId;
    this.editNoticeModel.advocateName = noticeInfo.advocateName;
    this.editNoticeModel.advocatePhone = noticeInfo.advocatePhone;
    this.editNoticeModel.advocateAddress = noticeInfo.advocateAddress;
    this.editNoticeModel.googleMapLink = noticeInfo.googleMapLink;
    this.editNoticeModel.personId = noticeInfo.personId;
    this.editNoticeModel.countryId = noticeInfo.countryId;
    this.editNoticeModel.stateId = noticeInfo.stateId;
    this.editNoticeModel.cityId = noticeInfo.cityId;
    this.editNoticeModel.talukaId = noticeInfo.talukaId;
    this.editNoticeModel.villageId = noticeInfo.villageId;
    this.editNoticeModel.noticeImage = noticeInfo.noticeImage;
    this.editNoticeModel.noticePeriod = noticeInfo.noticePeriod;
    this.editNoticeModel.noticeDetailList = noticeInfo.noticeDetailList;
    this.editNoticeModel.otherDetails = noticeInfo.otherDetails;
    this.editNoticeModel.constructedPropertyArea = noticeInfo.constructedPropertyArea;
    this.editNoticeModel.buildingName = noticeInfo.buildingName;
    this.editNoticeModel.flatNo = noticeInfo.flatNo;
    this.editNoticeModel.floorNo = noticeInfo.floorNo;
    this.editNoticeModel.sectorNo = noticeInfo.sectorNo;
    this.editNoticeModel.projectName = noticeInfo.projectName;

    if (noticeInfo.isPublisher == true) {
      this.editNoticeModel.isPublisher = "true";
    }
    else {
      this.editNoticeModel.isPublisher = "false";
    }
    if (noticeInfo.isPaid == true) {
      this.editNoticeModel.isPaid = "true";
    }
    else {
      this.editNoticeModel.isPaid = "false";
    }
    //this.editNoticeModel.isbanking=
    // this.editNoticeModel.imageUrl = this.appConfig.imagePath + noticeInfo.noticeImage.name;
    this.getNoticeType();
    this.showEditNoticePopup();
  }

  editNoticeModel: AddNoticeModel = new AddNoticeModel();

  isShowEditNoticePopup: boolean = false;

  showEditNoticePopup() {
    this.isShowEditNoticePopup = true;
    setTimeout(() => { $("#edit-notice-popup").modal('show'); });
  }

  closeEditNoticePopup($event: any) {
    let v = this.noticeInfoList;
    $("#edit-notice-popup").modal('hide');
    setTimeout(() => { this.isShowEditNoticePopup = false; });
  }

  activeNoticesOnly: boolean = true;
  interval: any = null;

  onActiveNoticesOnly() {
    this.activeNoticesOnly = !this.activeNoticesOnly;
    this.searchModel.isActiveOnly = this.activeNoticesOnly;
    this.getRecentNotices();
    this.onSearchNotice(true);
  }


  isLoading: boolean = false;
  onInfiniteScroll(e) {
    
    if (!this.isAllLoaded) {
      var scrollHeight = e.target.scrollHeight;
      var scrollTop = e.target.scrollTop;
      var height = e.target.offsetHeight+1;
      if ((height + scrollTop) >= scrollHeight) {
        this.searchModel.pageNumber++;
        if (this.isGetRecentNotices)
          this.getRecentNotices();
        else
          this.onSearchNotice();
      }
    }
  }

  getRecentNoticesBtn() {
    this.isGetRecentNotices = true;
    this.searchModel.pageNumber = 1;
    this.noticeInfoList = [];
    this.getRecentNotices();
  }

  afterUpdate(updatedNotice: AddNoticeModel) {
    var noticeInfo: NoticeInfoModel = this.noticeInfoList.find(x => x.noticeId == updatedNotice.id);
    noticeInfo.noticeTitle = updatedNotice.noticeTitle;
    noticeInfo.landCategoryId = updatedNotice.landCategoryId;
    noticeInfo.paperId = updatedNotice.paperId;
    noticeInfo.paperName = updatedNotice.paperName;
    noticeInfo.cityName = updatedNotice.cityName;
    noticeInfo.landCategory = updatedNotice.landCategoryName;
    noticeInfo.noticePeriod = updatedNotice.noticePeriod;
    noticeInfo.publishedDate = updatedNotice.publishedDate;
    noticeInfo.landMark = updatedNotice.landMark;
    noticeInfo.unitTypeId = updatedNotice.unitTypeId;
    noticeInfo.ownerName = updatedNotice.ownerFullName;
    noticeInfo.advocateId = updatedNotice.advocateId;
    noticeInfo.advocateName = updatedNotice.advocateName;
    noticeInfo.advocatePhone = updatedNotice.advocatePhone;
    noticeInfo.advocateAddress = updatedNotice.advocateAddress;
    noticeInfo.googleMapLink = updatedNotice.googleMapLink;
    noticeInfo.personId = updatedNotice.personId;
    noticeInfo.countryId = updatedNotice.countryId;
    noticeInfo.stateId = updatedNotice.stateId;
    noticeInfo.cityId = updatedNotice.cityId;
    noticeInfo.talukaId = updatedNotice.talukaId;
    noticeInfo.villageId = updatedNotice.villageId;
    noticeInfo.noticeImage = updatedNotice.noticeImage;
    if (noticeInfo.noticeImage != null && noticeInfo.noticeImage.length > 0) {
      
      let firstNoticeImage: NoticeImage = noticeInfo.noticeImage[0];
      noticeInfo.fileName = firstNoticeImage.fileName;
      noticeInfo.originalFileName = firstNoticeImage.fileName;
    }
    noticeInfo.noticeDetailList = updatedNotice.noticeDetailList;
    if (noticeInfo.noticeDetailList != null && noticeInfo.noticeDetailList.length > 0) {
      let firstNoticeDetail: NoticeDetail = noticeInfo.noticeDetailList[0];
      noticeInfo.surveyNumber = firstNoticeDetail.surveyNumber;
      noticeInfo.gatNumber = firstNoticeDetail.gatNumber;
      noticeInfo.ctsNumber = firstNoticeDetail.ctsNumber;
      noticeInfo.plotNumber = firstNoticeDetail.plotNumber;
      noticeInfo.area = firstNoticeDetail.area;
      if (noticeInfo.area.includes("squareMeter")) {
        noticeInfo.area = noticeInfo.area.slice(16, -2) + " Sq. M";
      }
      if (noticeInfo.area.includes("squareFeet")) {
        noticeInfo.area = noticeInfo.area.slice(16, -2) + " Sq. Ft";
      }
      if (noticeInfo.area.includes("Var")) {
        noticeInfo.area = noticeInfo.area.slice(9, -2) + " Var";
      }
      if (noticeInfo.area.includes("Foot")) {
        noticeInfo.area = noticeInfo.area.slice(10, -2) + " Foot";
      }
      if (noticeInfo.area.includes("hectorH" && "hectorR")) {
        var hectorH = noticeInfo.area.slice(noticeInfo.area.indexOf(':') + 2, noticeInfo.area.indexOf(',') - 1);
        var indexLastComma = noticeInfo.area.lastIndexOf(',');
        if (indexLastComma === noticeInfo.area.indexOf(',')) {
          indexLastComma = noticeInfo.area.indexOf('}');
        }
        var hectorR = noticeInfo.area.slice(noticeInfo.area.indexOf('R') + 4, indexLastComma - 1);
        if (noticeInfo.area.includes("potKharab")) {
          var indexb = noticeInfo.area.indexOf('b');
          var indexLastCommaPot = noticeInfo.area.lastIndexOf('}');
          var potKharab = noticeInfo.area.slice(noticeInfo.area.indexOf('b') + 4, noticeInfo.area.lastIndexOf('}') - 1);
          noticeInfo.area = hectorH + " H, " + hectorR + " R, " + potKharab + " Pot Kharaba";
        } else {
          noticeInfo.area = hectorH + " H, " + hectorR + " R";
        }
      }
      noticeInfo.propertyArea = firstNoticeDetail.propertyArea;
    }
    noticeInfo.otherDetails = updatedNotice.otherDetails;
    noticeInfo.constructedPropertyArea = updatedNotice.constructedPropertyArea;
  }

  onDownload() {
    this.reportService.generatePdf(this.noticeInfoList);
  }

  // onTabChange(tabName) {
  //   
  //   this.tabName = tabName;
  //   if (this.tabName == "universal-search") {
  //     this.searchModel = new SearchModel();
  //     this.searchModel.cityId = 0;
  //     this.searchModel.talukaId = 0;
  //     this.searchModel.villageId = 0;
  //   }
  // }


  onTabChange(tabName) {
    
    this.tabName = tabName;
    this.searchModel = new SearchModel();
    this.searchModel.cityId = 0;
    this.searchModel.talukaId = 0;
    this.searchModel.villageId = 0;
    this.searchModel.searchString = "";
    if(tabName=='basic-search' || tabName=='advance-search')
    this.toggleSelectAll();
  }
}
