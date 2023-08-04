import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { AuthenticationService, LookupService, NoticeService } from 'src/app/services';
import { UserLookupDto, SearchReportModel, PerformanceReportModel, UserNoticeCount } from 'src/app/models/performance-report.model';
import { City, NoticeInfoModel, SearchModel } from 'src/app/models';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';

declare var $;
@Component({
  selector: 'app-performace-report',
  templateUrl: './performace-report.component.html',
  styleUrls: ['./performace-report.component.scss']
})
export class PerformanceReportComponent implements OnInit {

  startDate:string='';
  endDate: string= '';
  


  loggedInUserRole: any;
  loggedInUserRoleGuid: any;
  loggedInUserId: any;
  loggedInUserOrgId: any;
  tbldata: any = [];
  filteredList: any=[];
  filteredListTemp: any=[];
  pageNo:number=1;
  page=1;
  constructor(
    private reportService: ReportService,
    public noticeService: NoticeService,
    private authService: AuthenticationService,
    public lookupService: LookupService,
    public router:Router,
    private excelService: ExcelService,
  ) { }

  ngOnInit() {
this.startDate=this.getDefaultStartDate();
this.endDate=this.getDefaultStartDate();

    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      loggedInUserString = JSON.parse(loggedInUserString);
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.getUsersLookup();
      this.getCities();
      // $(document).ready(function () {
      //   $('#txtSearchDateRange').daterangepicker(
      //     {
      //       startDate: moment(),
      //       endDate: moment(),
      //      // dateLimit: { days: 90 },
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
      //       format: 'DD/MM/YYYY',
      //       separator: ' to ',
      //       locale: {
      //         applyLabel: 'Submit',
      //         fromLabel: 'From',
      //         format: 'DD/MM/YYYY',
      //         toLabel: 'To',
      //         customRangeLabel: 'Custom Range',
      //         daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      //         monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      //         firstDay: 1
      //       }
      //     }
      //   );
      // });
      this.onViewReport();
    }
    else {

      this.router.navigate(["./login"]);
    }
  }
 
  getDefaultStartDate(): string {
    const defaultDate = new Date(); // You can set this to any desired default date
    return defaultDate.toISOString().substr(0, 10); // Convert to YYYY-MM-DD format
  }

  searchReportModel: SearchReportModel = new SearchReportModel();
  //performanceReportList: Array<PerformanceReportModel> = new Array<PerformanceReportModel>();
  performanceReportList:any=[];
  isShowLoader: boolean = true;
  cityList: Array<City> = new Array<City>();
  lookupUsers: Array<UserLookupDto> = new Array<UserLookupDto>();
  getUsersLookup() {
   
    this.isShowLoader = true;
    let userRole: string = this.authService.loggedInUser.role;
    let userId: string = this.authService.loggedInUser.userId;
    this.reportService.getUsersLookup(userId, userRole)
      .subscribe((lookupUsers: Array<UserLookupDto>) => {
        this.lookupUsers = lookupUsers;
        this.isShowLoader = false;
      }, error => {
        console.log(error);
        this.isShowLoader = false;
      });
  }

  getCities() {
    this.reportService.getCities()
      .subscribe((cityList: Array<City>) => {
        this.cityList = cityList;
        this.isShowLoader = false;
      }, error => {
        console.log(error);
        this.isShowLoader = false;
      });
  }

  onViewReport() {
   
    this.isShowLoader = true;
    var $dateField = $('#txtSearchDateRange');
    this.searchReportModel.startDate = new Date(this.startDate);
    this.searchReportModel.endDate = new Date(this.endDate);
    this.reportService.getPerformanceReport(this.searchReportModel)
      .subscribe((userNoticeCountList) => {
       
       this.performanceReportList = userNoticeCountList;
        this.isShowLoader = false;
      }, error => {
        console.log(error);
        this.isShowLoader = false;
      });;
  }
  filter(e) {
    this.filteredList = this.filteredListTemp.filter(function (el) {
      var result = "";
      for (var key in el) {
        result += el[key];
      }
      return result.toLowerCase().indexOf(this.searchtext.toLowerCase()) > -1;
    }.bind(this));
    this.getRecentNotices();
  }
  userId:string;
  viewNotice(e){
    this.pageNo=1;
       this.userId=e;
    $("#add-mode-modal").modal('show');
    this.getRecentNotices();
  }
  searchModel: SearchModel = new SearchModel();
  isAllLoaded: boolean = false;
  tbldataLength:number;
  public searchtext = '';
  noticeInfoList: Array<NoticeInfoModel> = new Array<NoticeInfoModel>();
  getRecentNotices() {

    this.isShowLoader = true;
      this.reportService.getNotices(this.userId,this.pageNo, this.searchReportModel.startDate, this.searchReportModel.endDate)
      .subscribe((noticeInfoList: Array<NoticeInfoModel>) => {
        
        this.tbldata = noticeInfoList;
        this.isShowLoader = false;
        if (this.searchtext !== "" && this.searchtext != null) {
          if (this.filteredList.length == 0) {
            this.tbldata = this.filteredList;
          } else {
            return this.tbldata = this.filteredList;

          }

        } else {
          if (noticeInfoList.length > 0) {
            this.filteredListTemp = noticeInfoList;
            this.tbldata = noticeInfoList;
            if(this.tbldata[0].totalCount!=0){
            this.tbldataLength=this.tbldata[0].totalCount;
            }

          }
        }
               
      },
        error => {
          this.isShowLoader = false;
        });
  }

  onChangePage(pageNumber: any): void {
   debugger;
    this.pageNo = pageNumber.pageIndex;
    this.getRecentNotices();
  }
  onViewNoticePopupClose(e) {
    $("#view-notice-popup").modal('hide');
  }
  noticeInfo:any=[];
  onViewProperty(notice:NoticeInfoModel) {

    setTimeout(() => { $("#view-notice-popup").modal('show'); }, 100);
    this.noticeInfo=notice;
  }

  exportAsExcel(): void {
    // Define the data to be exported
    const data = this.tbldata;
  
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
  
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Notice Data');
  
    // Save the workbook as an Excel file
    const fileName = 'Notice Data.xlsx';
    XLSX.writeFile(workbook, fileName);
  }
  

  exportAsXLSX(): void {
    
    this.isShowLoader = true;

    const exportda = this.performanceReportList.map(o => {
      return {
        FirstName: o.firstName,
        LastName: o.lastName,
        Role:"Operator",
        UserName: o.userName,
        TotalNotice: o.totalNotice,
       Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Performance Report');
    this.isShowLoader = false;
  }
  returnstring(isActive:any){
    
    if(isActive==true)
    {
        return 'Active';
    }
    else 
    {
      return 'InActive';
    }
  }


}
