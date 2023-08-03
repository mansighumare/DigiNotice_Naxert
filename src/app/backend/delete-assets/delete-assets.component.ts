import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { OrgAssetManagerService } from 'src/app/services/org-asset-manager.service';
import { Router } from '@angular/router';
import { AssetImage, EditOrgPropertyModel } from 'src/app/models/org-asset-manager';
import { ConfirmDialogModel, ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ExcelService } from 'src/app/services/excel.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
declare var $;
declare var toastr;

@Component({
  selector: 'app-delete-assets',
  templateUrl: './delete-assets.component.html',
  styleUrls: ['./delete-assets.component.scss']
})
export class DeleteAssetsComponent implements OnInit {
  propertyList: any = [];
  isShowLoader: boolean = false;
  loggedInUserRole: any;
  loggedInUserId: any;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  loggedInUserIdBranchId: any;
  filteredList: any = [];
  filteredListTemp: any = [];
  displayedColumns = ['select', 'ownerFullName', 'landMark', 'landCategoryId', 'gatNumber', 'plotNumber', 'createdby', 'branchname','deleteRequestDate','deleteRequestBy', 'view'];
  data: any;
  dataSource: any = [];
  tbldataLength: number;
  pageSize = 25;
  page = 1;
  result: string = '';
  searchControl: FormControl = new FormControl();
  searchFlag: number = 0;
  selection = new SelectionModel<Element>(true, []);
  constructor(public orgAssetManagerService: OrgAssetManagerService,
    private router: Router, public dialog: MatDialog,
    private excelService: ExcelService,) {
  }
  ngOnInit() {

    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserIdBranchId = loggedInUserString.branch_id;
      this.getProperties();
    }
    else {

      this.router.navigate(["./login"]);
    }

  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeSelectedRows(): void {
    const message = `Are you sure you want to delete?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      this.removeSRows();
    });
  }
  removeSRows() {
    if (this.result) {
      var selectedIds = this.selection.selected.map(item => item.id);
      console.log(selectedIds);
      this.orgAssetManagerService.deleteOrgProperty(selectedIds,this.loggedInUserId)
        .subscribe((r) => {
          this.isShowLoader = false;
          toastr.success('Property Deleted Successsfully!', "Success");
          // this.propertyList.splice(editPropertyModel.propertyIndex, 1);
          this.getProperties();
        },
          error => {
            this.isShowLoader = false;
          });
    }
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
  public searchtext = "";
  hasRecords: any
  getProperties() {
    this.dataSource = [];
    this.propertyList = [];
    this.isShowLoader = true;
    this.orgAssetManagerService.getDeleteRequestProperties(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserIdBranchId, this.page)
      .subscribe((propertyList) => {
        this.isShowLoader = false;
        this.searchFlag = 1
        
        this.propertyList = propertyList;
        this.isShowLoader = false;
        this.data = Object.assign(this.propertyList);
        if (this.propertyList[0].totalCount != 0) {
          this.tbldataLength = this.propertyList[0].totalCount;
        }
        return this.dataSource = new MatTableDataSource<Element>(this.data);
      },
        error => {
          this.isShowLoader = false;
        });
  }

  Search(){
    this.page=1;
    this.searchDeltedRequestProperties();
  }
  searchDeltedRequestProperties() {
    this.dataSource = [];
    this.propertyList = [];
    this.isShowLoader = true;
    if (this.searchControl.value== "" || this.searchControl.value== null) {
      this.getProperties();
    }
    else {
      this.orgAssetManagerService.searchDeltedRequestProperties(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserIdBranchId, this.page, this.searchControl.value)
        .subscribe((propertyList) => {
          this.propertyList = propertyList;
          this.isShowLoader = false;
          this.searchFlag = 2;
          this.data = Object.assign(this.propertyList);
          if (this.propertyList[0].totalCount != 0) {
            this.tbldataLength = this.propertyList[0].totalCount;
          }
          return this.dataSource = new MatTableDataSource<Element>(this.data);
        },
          error => {
            this.isShowLoader = false;
          });
    }
  }

  Refresh() {
    this.page = 1
    this.getProperties()
  }

  exportAsXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.propertyList.map(o => {
      return {
        Id: o.id,
        OwnerName: o.ownerFullName,
        State: o.stateName,
        District: o.cityName,
        Taluka: o.talukaName,
        Village: o.villageName,
        Locality: o.landMark,
        Type: o.landCategoryName,
        surveyNumber: o.surveyNumber,
        GatNo: o.gatNumber,
        CTSNo: o.ctsnumber,
        PlotNumber: o.plotNumber,
        ProjectName: o.projectName,
        BuildingName: o.buildingName,
        FlatNo: o.flatNo,
        FloorNo: o.floorNo,
        ConstructedPropertyArea: o.constructedPropertyArea,
        HouseNo: o.houseNo,
        TenamentNo: o.tenementNo,
        FactoryShedNo: o.factoryShedNo,
        IndustrialBuilding: o.industrialBuilding,
        GrampanchayatNo: o.grampanchayatNo,
        MalmattaNo: o.malmattaNo,
        CorporationRegistrationNo: o.corporationRegistrationNo,
        PropertyCardNo: o.propertyCardNo,
        PhaseNo: o.phaseNo,
        BuildingNo: o.buildingNo,
        FlatShopNo: o.flatShopNo,
        CommencementCertificateNo: o.commencementCertificateNo,
        ShareCertificateNo: o.shareCertificateNo,
        PropertyNo: o.propertyNo,
        finalPlotNo: o.finalPlotNo,
        subPlotNo: o.subPlotNo,
        privatePlotNo: o.privatePlotNo,
        cadastralSurveyNo: o.cadastralSurveyNo,
        sectorNo: o.sectorNo,
        completionCertificateNo: o.completionCertificateNo,
        nagarPanchyatMilkatNo: o.nagarPanchyatMilkatNo,
        glrNo: o.glrNo,
        complaintNoReportNo: o.complaintNoReportNo,
        otherInformation: o.otherInformation,
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Delete Request Assets');
    this.isShowLoader = false;
  }
  filter(e) {
    this.filteredList = this.filteredListTemp.filter(function (el) {
      var result = "";
      for (var key in el) {
        result += el[key];
      }
      return result.toLowerCase().indexOf(this.searchtext.toLowerCase()) > -1;
    }.bind(this));
    this.getProperties();
  }


  onChangePage(pageNumber: any): void {
    
    this.page = pageNumber.pageIndex;
    if (this.searchFlag == 1) {
      this.getProperties();
    }
    else {
      this.searchDeltedRequestProperties();
    }
  }
}

// export interface Element {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }


