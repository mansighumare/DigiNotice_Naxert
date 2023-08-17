import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NoticeImage } from 'src/app/models/notice-info';
import { EditOrgPropertyModel, AssetImage, AddOrgPropertyModel, PropertyImg } from 'src/app/models/org-asset-manager';
import { AppConfig, AssetManagerService, LookupService, SharedModelService } from 'src/app/services';
import { ExcelService } from 'src/app/services/excel.service';
import { OrgAssetManagerService } from 'src/app/services/org-asset-manager.service';
import { OrganisationService } from 'src/app/services/organisation.service';
declare var $;


@Component({
  selector: 'app-deleted-assets',
  templateUrl: './deleted-assets.component.html',
  styleUrls: ['./deleted-assets.component.scss']
})
export class DeletedAssetsComponent implements OnInit {


  constructor(
    public orgAssetManagerService: OrgAssetManagerService,
    public sharedModelService: SharedModelService,
    private router: Router,
    public sharedModel: SharedModelService,
    public lookupService: LookupService,
    private excelService: ExcelService,
    public toastr: ToastrService) { }

  propertyList: Array<EditOrgPropertyModel> = new Array<EditOrgPropertyModel>();
  isShowLoader: boolean = false;
  addOrgPropertyModel: AddOrgPropertyModel = new AddOrgPropertyModel();
  public is_add_other_details: boolean = false;
  label: string;
  saveLabel: string;
  loggedInUserRole: any;
  loggedInUserId: any;
  isSaving: boolean = false;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  public searchtext = "";
  isShowActiveOnly: boolean = true;
  page =1;
  loggedInUserIdBranchId: number;
  tbldata: any = [];
  filteredList: any = [];
  filteredListTemp: any = [];
  Branch: any = [];
  tbldataLength: number;
  pageSize = 25;
  searchFlag:number=0
  searchControl: FormControl = new FormControl();
  
  ngOnInit() {
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserIdBranchId = loggedInUserString.branch_id;
      this.getProperties();
      this.getBranches();
    }
    else {

      this.router.navigate(["./login"]);
    }

  }

  onOptionsSelectedBranches(e) {

    this.loggedInUserIdBranchId = e.target.value;
    this.page=1;
    this.tbldataLength=0;
    this.getProperties();
  }


  getBranches() {
    this.orgAssetManagerService.getBranchesList(
      this.loggedInUserId,
      this.loggedInUserRoleGuid,
      this.loggedInUserOrgId
    ).subscribe((r) => {

      this.Branch = r;
    });
  }

  getProperties() {
    this.isShowLoader = true;
    this.orgAssetManagerService.getOrgDeletedProperties(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserIdBranchId, this.page)
      .subscribe((propertyList: Array<EditOrgPropertyModel>) => {
        this.searchFlag=1;
        this.tbldata = propertyList;
        
        this.isShowLoader = false;
        if(this.tbldata[0].totalCount !=0){
        this.tbldataLength = this.tbldata[0].totalCount;
        }
       
      },
        error => {
          this.isShowLoader = false;
        });
  }
  Search(){
    this.page=1;
    this.getSearchProperties()
  }
  getSearchProperties() {
    this.isShowLoader = true;
    if (this.searchControl.value== "" || this.searchControl.value== null) {
      this.getProperties();
    }
    else{
    this.orgAssetManagerService.searchOrgDeletedProperties(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserIdBranchId, this.page,this.searchControl.value)
      .subscribe((propertyList: Array<EditOrgPropertyModel>) => {
        this.searchFlag=2;
        this.tbldata = propertyList;
        this.isShowLoader = false;
        if(this.tbldata[0].totalCount !=0){
        //  this.tbldataLength = this.tbldata[0].totalCount;
          this.tbldataLength = this.tbldata[0].totalCount;

          }
        
      },
        error => {
          this.isShowLoader = false;
        });
      }
  }



  onChangePage(pageNumber: any): void {
    this.page = pageNumber.pageIndex;
    if(this.searchFlag==1){
    this.getProperties();
  }
    else{
      this.getSearchProperties();
    }
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




  onResetFields() {
    this.addOrgPropertyModel = new AddOrgPropertyModel();
  }
  Refresh() {
    this.page=1
    this.getProperties();
  }





  showEditPropertyPopup() {
    $("#add-property-modal").modal('show');

  }







  exportAsXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.tbldata.map(o => {
      return {
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
        cadastralSurveyNo: o.catestrialSurveyNo,
        sectorNo: o.sectorNo,
        completionCertificateNo: o.completionCertificateNo,
        nagarPanchyatMilkatNo: o.nagarPanchyatMilkatNo,
        glrNo: o.glrNo,
        complaintNoReportNo: o.complaintNoReportNo,
        status: "Deleted"
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Deleted Assets');
    this.isShowLoader = false;
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

}
