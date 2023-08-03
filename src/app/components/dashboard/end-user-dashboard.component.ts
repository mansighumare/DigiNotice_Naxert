import { Component, OnInit } from '@angular/core';
import { NoticeInfoModel, SearchModel } from '../../models';
import { LookupService, NoticeService, AuthenticationService } from 'src/app/services';
import { ReportService } from 'src/app/services/report.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { NoticeAdvocateModel } from 'src/app/models/notice-info';
import * as moment from 'moment';
import * as $ from 'jquery';
declare var toastr;

@Component({
  selector: 'app-dashboard',
  templateUrl: './end-user-dashboard.component.html',
  styleUrls: ['./end-user-dashboard.component.scss']
})
export class EndUserDashboardComponent implements OnInit {
  personList: Array<NoticeAdvocateModel> = new Array<NoticeAdvocateModel>();
  public flag: boolean = true;
  isDashboard: boolean = false;
  tabName: string = "universal-search";
  NoticeType: any = [];
  is_add_other_details: any;
  city: any;

  constructor(
    public authService: AuthenticationService,
    public noticeService: NoticeService,
    public reportService: ReportService,
    public lookupService: LookupService,
    private router: Router,
    private accoutService: AccountService) {
    this.isDashboard = location.hash.indexOf('dashboard') >= 0;
  }
  loggedInUserRole: string = this.authService.loggedInUser.role;
  searchModel: SearchModel = new SearchModel();
  noticeInfoList: Array<NoticeInfoModel> = new Array<NoticeInfoModel>();
  ngOnInit() {

    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    if (loggedInUserString != null) {
      this.accoutService.getUserProfileImage(loggedInUserString.userId);
      this.getInterestedCities();
      this.initPlugins();
      this.getNoticeType();

      $("body").removeClass('backstretch');

      this.searchModel.pageNumber = 1;
      this.noticeInfoList = [];
      setTimeout(() => { this.getRecentNotices(); }, 100);

      if (!this.isDashboard)
        $("#dashboard-search-form").slideToggle(1000);


    }
    else {

      this.router.navigate(["./login"]);
    }
  }

  isGetRecentNotices: boolean = true;
  getRecentNotices() {
    this.isShowLoader = true;
    // var list=  localStorage.getItem("interestedCityList");
    ///   var array = JSON.parse("[" + list + "]");
    //  this.searchModel.cityList=array;
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    let userId: string = "0";
    if (loggedInUserString)
      userId = loggedInUserString.userId;

    this.noticeService.getCurrentDateNotice(userId).subscribe((getCurrentDateNoticeCount: number) => {
      this.noticeBanner.numberOfNotices = "Today's Notices : " + getCurrentDateNoticeCount;
    });
    this.noticeService.getRecentNotices(this.searchModel.pageNumber, this.searchModel.isActiveOnly, userId, this.searchModel.noticeTypeId)
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

  isLoading: boolean = false;
  onInfiniteScroll(e) {

    if (!this.isAllLoaded) {
      var scrollHeight = e.target.scrollHeight;
      var scrollTop = e.target.scrollTop;
      var height = e.target.offsetHeight + 1;
      if ((height + scrollTop) >= scrollHeight) {
        this.searchModel.pageNumber++;
        if (this.isGetRecentNotices)
          this.getRecentNotices();
        else
          this.onSearchNotice();
      }
    }
  }

  getInterestedCities() {

    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);

    this.lookupService.getInterestedCities(loggedInUserString.userId)
      .subscribe((interestedCities: any) => {

        this.lookupService.cityList.forEach(city => {
          city.isSelected = false;

          if (interestedCities.findIndex(x => x.id == city.id) >= 0)
            city.isSelected = true;
        });
        var cityArray = interestedCities.map(x => x.name);
        this.noticeBanner.interestedCities = cityArray.length == 0 ? "All" : cityArray.join(", ");


        //Load city ids by preference
        let citiIds = interestedCities.map(x => x.id);
        if (citiIds.length > 0)
          this.searchModel.cityId = citiIds[0];
        let cityId: number = Number(this.searchModel.cityId);
        this.lookupService.getTalukas(cityId);
        //Load city ids by preference
      },
        error => { });
  }

  initPlugins() {
    $(document).ready(() => {
      setTimeout(() => {
        this.initDateRangePicker();
        this.initMultiSelectDropdown();
      }, 100);
    });
  }

  initMultiSelectDropdown() {
    $(".dropdown dt a").on('click', function () {
      $(".dropdown dd ul").slideToggle('fast');
    });

    $(".dropdown dd ul li a").on('click', function () {
      $(".dropdown dd ul").hide();
    });

    function getSelectedValue(id) {
      return $("#" + id).find("dt a span.value").html();
    }

    $(document).bind('click', function (e) {
      var $clicked = $(e.target);
      if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
    });

    $('.mutliSelect input[type="checkbox"]').on('click', function () {
      var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val();
      title = $(this).val() + ",";

      if ($(this).is(':checked')) {
        var html = '<span title="' + title + '">' + title + '</span>';
        $('.multiSel').append(html);
        $(".hida").hide();
      } else {
        $('span[title="' + title + '"]').remove();
        var ret = $(".hida");
        $('.dropdown dt a').append(ret);
      }
    });
  }

  initDateRangePicker() {
    $('#txtSearchDateRange').daterangepicker(
      {
        startDate: moment(),
        endDate: moment(),
        //  dateLimit: { days: 3650 },
        showDropdowns: true,
        showWeekNumbers: true,
        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',

        separator: ' to ',
        locale: {
          format: 'DD/MM/YYYY',
          applyLabel: 'Submit',
          fromLabel: 'From',
          toLabel: 'To',
          customRangeLabel: 'Custom Range',
          daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
          monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          firstDay: 1
        }
      }
    );
  }


  onStateChange($event) {
    var stateId = $event.target.value;
    this.searchModel.cityId = 0;
    this.searchModel.talukaId = 0;
    this.searchModel.villageId = 0;
    this.lookupService.cityList = [];
    this.lookupService.talukaList = [];
    this.lookupService.villageList = [];
    this.lookupService.getCities(stateId);
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

  onTabChange(tabName) {

    this.tabName = tabName;
    this.searchModel = new SearchModel();
    this.searchModel.cityId = 0;
    this.searchModel.talukaId = 0;
    this.searchModel.villageId = 0;
    this.searchModel.searchString = "";
  }


  getNoticeType() {

    this.lookupService.getNoticeType().subscribe(
      (r) => {

        this.NoticeType = r;
        this.NoticeType = this.NoticeType.filter(notice => notice.isActive === true);
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

  persondetail(person) {

    this.searchModel.advocateName = person.fullName;
    this.flag = false;
    document.getElementById("pListId").style.zIndex = "0";
  }




  isShowLoader: boolean = false;
  isAllLoaded: boolean = false;
  onSearchNotice(resetPagination: boolean = false) {

    this.isGetRecentNotices = false;
    this.isAllLoaded = false;
    if (resetPagination) {
      this.noticeInfoList = [];
      this.searchModel.pageNumber = 1;
    }
    var $dateField = $('#txtSearchDateRange');
    this.searchModel.startDate = $dateField.data('daterangepicker').startDate._d;
    this.searchModel.endDate = $dateField.data('daterangepicker').endDate._d;
    this.isShowLoader = true;

    this.noticeService.GetSearchNoticeCount(this.searchModel).subscribe((GetSearchNoticeCount: number) => {


      this.noticeBanner.numberOfNotices = "Number Of Notices :" + GetSearchNoticeCount;
    });
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
        error => {
          this.isShowLoader = false;
        });
  }

  noticeBanner: any = {
    todayDate: new Date(),
    numberOfNotices: "",
    interestedCities: "All",
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

  onInterestedCityChage(city) {
    city.isSelected = !city.isSelected;
    this.noticeBanner.interestedCities = this.lookupService.cityList.filter(x => x.isSelected == true).map(x => x.name).join(',');
    if (this.noticeBanner.interestedCities == "")
      this.noticeBanner.interestedCities = "All";

    this.isShowLoader = true;
    let interedCityList: any = this.lookupService.cityList.filter(x => x.isSelected == true).map(x => x.id).join(',');
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);

    this.noticeService.addUserPreferenceCity(interedCityList, loggedInUserString.userId)
      .subscribe((response: any) => {
        this.isShowLoader = false;
        this.noticeInfoList = [];
        this.getRecentNotices();
        toastr.success('Successsfully Saved Interested Cities', "Success");
      },
        error => {
          this.isShowLoader = false;
          toastr.error('Failed To Save Interested Cities', "Error");
        });
  }
  getRecentNoticesBtn() {
    this.isGetRecentNotices = true;
    this.searchModel.pageNumber = 1;
    this.noticeInfoList = [];
    this.getRecentNotices();
  }
  // isShowSearchForm: boolean = false;
  onToggleSearchForm() {
    $("#dashboard-search-form").slideToggle(1000);
  }

  onDownload() {
    this.reportService.generatePdf(this.noticeInfoList);
  }
}