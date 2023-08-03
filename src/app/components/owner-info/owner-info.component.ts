import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from 'src/app/services';
import { Router } from '@angular/router';
import { OwnerInfo } from 'src/app/models/account.model';
import { BackendUserService } from 'src/app/services/backend-user.service';
import { ExcelService } from 'src/app/services/excel.service';
import { HttpClient } from '@angular/common/http';
import { ResponseHelperService } from 'src/app/services/response-helper.service';
import { ReportService } from 'src/app/services/report.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
declare var moment;
declare var $;
@Component({
  selector: 'app-home-new',
  templateUrl: './owner-info.component.html',
  styleUrls: ['./owner-info.component.scss']
})
export class OwnerInfoComponent implements OnInit {

  constructor(
    private router: Router, private excelService: ExcelService,
    private AddEditBackendUserService: BackendUserService,
    private reportService: ReportService,
    private http: HttpClient,
    private appConfig: AppConfig,
    private _helper: ResponseHelperService

  ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  activePage: any;
  total: number;
  resultsLength = 0;
  loggedInUserRole: any;
  loggedInUserId: any;
  public searchtext = '';
  loggedInUserRoleGuid: any;
  registerUserRole: string = "";
  UserRoles: any[];
  label: string;
  tbldata: any = [];
  ownerInfo: OwnerInfo = new OwnerInfo();
  ngOnInit() {
   
    $(document).ready(function () {
      $('#txtSearchDateRange').daterangepicker(
        {
          startDate: moment(),
          endDate: moment(),
          dateLimit: { days: 180 },
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
          format: 'DD/MM/YYYY',
          separator: ' to ',
          locale: {
            applyLabel: 'Submit',
            fromLabel: 'From',
            format: 'DD/MM/YYYY',
            toLabel: 'To',
            customRangeLabel: 'Custom Range',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
            
          }
        }
      );
    });
    
    this.onViewReport();
  }

  isShowLoader: boolean = false;
  // userInfo: Array<UserInfo> = new Array<UserInfo>();

  onViewReport() {
   
    this.isShowLoader = true;
    if(this.ownerInfo.startDate==undefined){
      this.ownerInfo.startDate = moment();
      this.ownerInfo.endDate = moment();
    }
    else{
      var $dateField = $('#txtSearchDateRange');
      this.ownerInfo.startDate = $dateField.data('daterangepicker').startDate._d;
      this.ownerInfo.endDate = $dateField.data('daterangepicker').endDate._d;
    }

    this.reportService.getUserInfo(this.ownerInfo)
      .subscribe((userNoticeCountList) => {
        this.tbldata = userNoticeCountList;
        this.isShowLoader = false;
      }, error => {
        console.log(error);
        this.isShowLoader = false;
      });;
  }


  exportAsXLSX(): void {

    this.isShowLoader = true;

    const exportda = this.tbldata.map(o => {
      return {
        OwnerFullName: o.ownerFullName,
        City: o.city,
        CreatedDate: o.createdDate,

      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Get Owner Names');
    this.isShowLoader = false;
  }

}