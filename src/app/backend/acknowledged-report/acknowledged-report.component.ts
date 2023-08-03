import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/services/excel.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrgAssetManagerService } from 'src/app/services/org-asset-manager.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-acknowledged',
  templateUrl: './acknowledged-report.component.html',
  styleUrls: ['./acknowledged-report.component.scss']
})
export class AcknowledgedReportComponent implements OnInit {
  isShowLoader: boolean = false;
  loggedInUserRole: any;
  loggedInUserId: any;
  isSaving: boolean = false;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  tbldataLength: number;
  page = 1;
  tbldata: any = [];
  searchFlag: number = 0;
  loggedInUserBranchId: number;
  subscription: Subscription = new Subscription();
  searchControl: FormControl = new FormControl();
  constructor(public orgAssetManagerService: OrgAssetManagerService, private router: Router,
    private notificationServices: NotificationService,
    private excelService: ExcelService,
    public http: HttpClient) { }

  ngOnInit() {
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;
      this.getAcknowledgeReport();
      // this.subscription.add(
      //   this.searchControl.valueChanges.pipe(
      //     startWith(''),
      //     debounceTime(500),
      //     switchMap(value => {
      //       
      //       if (value === '') {
      //         return this.notificationServices.getAcknowledgeReport(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId, this.page);
      //       } else {
      //         return this.notificationServices.SearchGetAcknowledgeReport(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId, this.page, value);
      //       }
      //     })
      //   ).subscribe((tbldata: any) => {
      //     this.tbldata = tbldata;
      //     this.isShowLoader = false;
      //     this.tbldataLength = this.tbldata[0].totalCount;
      //   })
      // );




    }
    else {

      this.router.navigate(["./login"]);
    }

  }
  public searchtext = '';
  filteredList: any = [];
  filteredListTemp: any = [];


  Search(){
    this.page=1;
    this.SearchGetAcknowledgeReport();
  }
  SearchGetAcknowledgeReport() {
    if (this.searchControl.value == "" || this.searchControl.value == null) {
      this.getAcknowledgeReport();
    }
    else {
      this.isShowLoader = true;
      this.notificationServices.SearchGetAcknowledgeReport(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId, this.page, this.searchControl.value)
        .subscribe(propertyList => {
          this.searchFlag = 2;
          this.tbldata = propertyList;
          this.isShowLoader = false;
          if(this.tbldata.length==0){
            this.tbldataLength=0;
          }
          if(this.tbldata[0].totalCount !=0){
            this.tbldataLength = this.tbldata[0].totalCount;
            }

        },
          error => {
            this.isShowLoader = false;
          });
    }
  }

  getAcknowledgeReport() {
    this.isShowLoader = true;
    this.searchFlag = 1;
    this.notificationServices.getAcknowledgeReport(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId, this.page)
      .subscribe(propertyList => {
        
        this.tbldata = propertyList;
        this.searchFlag = 1;
        this.isShowLoader = false;
        if(this.tbldata.length==0){
          this.tbldataLength=0;
        }
        if(this.tbldata[0].totalCount !=0){
          this.tbldataLength = this.tbldata[0].totalCount;
          }

      },
        error => {
          this.isShowLoader = false;
        });
  }




  filter(e) {
    this.filteredList = this.filteredListTemp.filter(function (el) {
      var result = "";
      for (var key in el) {
        result += el[key];
      }
      return result.toLowerCase().indexOf(this.searchtext.toLowerCase()) > -1;
    }.bind(this));
    this.getAcknowledgeReport();
  }
  onChangePage(pageNumber: any): void {
    
    this.page = pageNumber.pageIndex;
    if (this.searchFlag == 1) {
      this.getAcknowledgeReport();
    }
    else {
      this.SearchGetAcknowledgeReport();
    }
  }


  Refresh() {
    this.page=1;
    this.getAcknowledgeReport();
  }

  exportAsXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.tbldata.map(o => {
      return {
        BranchName: o.branchName,
        AssetOwnerName: o.assetOwnerFullName,
        AssetSurveyNo: o.assetSurveyNumber,
        AssetGatNo: o.assetGatNumber,
        NoticeTitle: o.noticeTitle,
        SellerName: o.noticeOwnerFullName,
        NoticeSurveyNo: o.noticeSurveyNumber,
        NoticeGatNo: o.noticeGatNumber,
        AcknowledgedDate: o.acknowledged_date,
        AcknowledgedBy: o.acknowledgedBy,
        MathcedNoticeType: o.type
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Acknowledged_Report');
    this.isShowLoader = false;
  }
}
