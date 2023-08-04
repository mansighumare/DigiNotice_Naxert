import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetImage, EditOrgPropertyModel } from 'src/app/models/org-asset-manager';
import { ViewAssetReportModel, searchAssetReportModel } from 'src/app/models/search-asset-report.model';
import { OrgReportService } from 'src/app/services/org-report.service';
import * as XLSX from 'xlsx';
declare var moment;
declare var $;
@Component({
  selector: 'app-assets-report',
  templateUrl: './assets-report.component.html',
  styleUrls: ['./assets-report.component.scss']
})
export class AssetsReportComponent implements OnInit {
  isShowLoader: boolean = false;
  tbldata: any = [];
  tbldataLength: number=0;
  assets: any = [];
  loggedInUserRole: any;
  loggedInUserId: any;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  loggedInUserBranchId: any;
  page = 1;
  searchFlag:number=0;
  searchControl: FormControl = new FormControl();
  assetpage = 1;
  searchAssetReportModel: searchAssetReportModel = new searchAssetReportModel();
  ViewAssetReportModel: ViewAssetReportModel = new ViewAssetReportModel();
startDate:string='';
endDate: string='';

  constructor(private router: Router, private orgReportService: OrgReportService) { }

  ngOnInit() {
    this.startDate=this.getDefaultStartDate();
    this.endDate=this.getDefaultStartDate();

    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;
      $(document).ready(function () {
        $('#txtSearchDateRange').daterangepicker(
          {
            startDate: moment(),
            endDate: moment(),
            // dateLimit: { days: 90 },
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
      if (this.loggedInUserRoleGuid == "6fa5ce77-1e42-4487-b880-229180e0e9a1") {
        this.getOrgnizations();
        this.get_Assets_Report();
      } else {
        this.searchAssetReportModel.orgId = this.loggedInUserOrgId;
        this.searchAssetReportModel.selectedOrgId=this.loggedInUserOrgId;
        this.getBranches();
        this.get_Assets_Report();
      }
    }
    else {
      this.router.navigate(["./login"]);
    }
  }

  
  getDefaultStartDate(): string {
    const defaultDate = new Date(); // You can set this to any desired default date
    return defaultDate.toISOString().substr(0, 10); // Convert to YYYY-MM-DD format
  }

  onSelectOrganization() {
    this.searchAssetReportModel.selectedOrgId;
    this.searchAssetReportModel.orgId=this.searchAssetReportModel.selectedOrgId;
    this.getBranches();
  }
  Refresh() {
    
    this.page = 1;
    this.searchAssetReportModel.branchId=0;
    this.searchAssetReportModel.page=1;
    this.get_Assets_Report();
  }

  RefreshAssetPage() {
    
    this.assetpage = 1;
    this.ViewAssetReportModel.page=1;
    this.ViewAssets();
  }
  reset(){
    this.searchAssetReportModel.page=1;
    this.page=1;
  }
  get_Assets_Report() {
    this.isShowLoader = true;
    var $dateField = $('#txtSearchDateRange');
    this.searchAssetReportModel.startDate = new Date(this.startDate);
    this.searchAssetReportModel.endDate = new Date(this.endDate);
    this.searchAssetReportModel.userId = this.loggedInUserId;
    this.searchAssetReportModel.roleGuid = this.loggedInUserRoleGuid;
    this.orgReportService.get_Assets_Report(this.searchAssetReportModel)
      .subscribe((response) => {
        
        if (response) {
          this.tbldata = response;
          this.isShowLoader = false;
          if (response[0].totalCount != 0) {
            this.tbldataLength = response[0].totalCount;
          }
        }
        else {
          this.isShowLoader = false
        }
      },
        error => {
          this.isShowLoader = false;
        });
  }

  onViewAssets(asset,isActive) {
    
    if(this.loggedInUserRoleGuid=="5A684E94-A768-45B7-8A2E-1F3BF22FC8B4"){
      this.ViewAssetReportModel.selectedOrgId=this.loggedInUserOrgId;
    }
    $("#view-asset-popup").modal('show');
    this.ViewAssetReportModel.page=1;
    this.ViewAssetReportModel.BranchId = asset.branchId;
    this.ViewAssetReportModel.OrgId = asset.orgId;
    this.ViewAssetReportModel.isActive=isActive;
    var $dateField = $('#txtSearchDateRange');
    this.ViewAssetReportModel.startDate = $dateField.data('daterangepicker').startDate._d;
    this.ViewAssetReportModel.endDate = $dateField.data('daterangepicker').endDate._d;
    this.ViewAssets();
  }

  Organizations: any = [];
  getOrgnizations() {
    this.isShowLoader = true;
    this.orgReportService.getOrgnizations(this.loggedInUserId, this.loggedInUserRoleGuid)
      .subscribe(
        (response) => {
          
          this.Organizations = response;
          this.isShowLoader = false;
        },
        error => {
          this.isShowLoader = false;
        }
      );
  }

  Branches: any = []
  getBranches() {
    this.orgReportService.getBranches(this.loggedInUserId, this.loggedInUserRoleGuid, this.searchAssetReportModel.selectedOrgId, this.loggedInUserBranchId)
      .subscribe(
        (response) => {
          
          this.Branches = response;
        },
        error => {
        }
      );
  }


  assetlength: number=0;
  ViewAssets() {
    this.isShowLoader = true;
    this.ViewAssetReportModel.userId = this.loggedInUserId;
    this.ViewAssetReportModel.roleGuid = this.loggedInUserRoleGuid;
    this.orgReportService.ViewAssets(this.ViewAssetReportModel)
      .subscribe(
        (response) => {
          
          this.assets = response;
          this.searchFlag=1
          this.isShowLoader = false;
          if (this.assets[0].totalCount != 0) {
            this.assetlength = this.assets[0].totalCount
          }

        },
        error => {
          this.isShowLoader = false;
        }
      );
  }

  Search(){
    this.page=1;
    this.SearchAssets();
  }

  SearchAssets() {
    
    if(this.searchControl.value=='' || this.searchControl.value==null){
      this.assetpage=1;
      this.ViewAssetReportModel.page=1;
      this.ViewAssets()
    }
    else{
      this.isShowLoader = true;
      this.ViewAssetReportModel.searchString=this.searchControl.value;
    this.orgReportService.SearchAssets(this.ViewAssetReportModel)
      .subscribe(
        (response) => {
          
          this.searchFlag=2;
          this.assets = response;
          this.isShowLoader = false;
          if (this.assets[0].totalCount != 0) {
            this.assetlength = this.assets[0].totalCount
          }

        },
        error => {
          this.isShowLoader = false;
        }
      );
    }
  }

  onViewNoticePopupClose(e) {
    $("#view-notice-popup").modal('hide');
  }

  viewProperty: EditOrgPropertyModel = new EditOrgPropertyModel();
  onViewProperty(editOrgPropertyModel: EditOrgPropertyModel) {
    
    if (editOrgPropertyModel.assetImages != null) {
      editOrgPropertyModel.assetImages.forEach((propertyImage: AssetImage) => {
        if (propertyImage.isDeleted != true) {
          propertyImage.imageUrl = propertyImage.name;
        }
      });
    }
    this.viewProperty = editOrgPropertyModel;
    $("#view-property-popup").modal("show");
  }

  onChangePageAsset(pageNumber: any) {
    
    this.ViewAssetReportModel.page = pageNumber.pageIndex;
    if(this.searchFlag==1){
    this.ViewAssets();
    }
    else{
      this.SearchAssets();
    }
  }
  onChangePage(pageNumber: any) {
    
    this.searchAssetReportModel.page = pageNumber.pageIndex;
    this.get_Assets_Report();
  }

  exportAsExcel(): void {
    // Define the data to be exported
    const data = this.assets.map(({ id, landCategoryId, unitTypeId, countryId, stateId, cityId, talukaId, villageId, isPendingDeletion, branchId, orgId, totalCount, ...rest }) => rest); // Exclude the "id" property from each object
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Notice Data');

    // Save the workbook as an Excel file
    const fileName = 'Asset Data.xlsx';
    XLSX.writeFile(workbook, fileName);
  }

//export Asset Report
  exportExcel(): void {
    // Define the data to be exported
    const data = this.tbldata.map(({ totalCount, orgId, branchId, ...rest }) => rest);
     // Exclude the "id" property from each object
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Notice Data');

    // Save the workbook as an Excel file
    const fileName = 'Asset Report.xlsx';
    XLSX.writeFile(workbook, fileName);
  }



}


