import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EditOrgPropertyModel, AssetImage, AddOrgPropertyModel } from 'src/app/models/org-asset-manager';
import { AppConfig, LookupService, SharedModelService } from 'src/app/services';
import { ExcelService } from 'src/app/services/excel.service';
import { OrgAssetManagerService } from 'src/app/services/org-asset-manager.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
declare var $;


@Component({
  selector: 'app-org-asset-manager',
  templateUrl: './org-asset-manager.component.html',
  styleUrls: ['./org-asset-manager.component.scss']
})

export class OrgAssetManagerComponent implements OnInit {

  constructor(private appConfig: AppConfig,
    public orgAssetManagerService: OrgAssetManagerService,
    public sharedModelService: SharedModelService,
    private router: Router,
    public sharedModel: SharedModelService,
    public lookupService: LookupService,
    private excelService: ExcelService,
    private AddEditOrganisationService: OrganisationService,
    public dialog: MatDialog,
    private notificationServices: NotificationService,
    public toastr: ToastrService) { }

  propertyList: Array<EditOrgPropertyModel> = new Array<EditOrgPropertyModel>();
  isShowLoader: boolean = false;
  addOrgPropertyModel:any = new AddOrgPropertyModel();
  public is_add_other_details: boolean = false;
  label: string;
  saveLabel: string;
  loggedInUserRole: any;
  loggedInUserId: any;
  isSaving: boolean = false;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  public searchtext = "";
  searchFlag: number = 0;
  isShowActiveOnly: boolean = true;
  page = 1;
  loggedInUserBranchId: number;
  tbldata: any = [];
  filteredList: any = [];
  filteredListTemp: any = [];
  Branch: any = [];
  tbldataLength: number;
  pageSize = 25;
  result: string = '';
  searchControl: FormControl = new FormControl();
  ngOnInit() {

    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;
      this.getProperties();
      this._initDropZone();
      this.getBranches();
    }
    else {
      this.router.navigate(["./login"]);
    }

  }

  onOptionsSelectedBranches(e) {

    this.loggedInUserBranchId = e.target.value;
    this.getProperties();
    this.page = 1;
    this.tbldataLength = 0;
  }

  onSelectedBranches(e) {
    this.loggedInUserBranchId = e.target.value;
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
    this.orgAssetManagerService.getOrgProperties(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId, this.page)
      .subscribe((propertyList: Array<EditOrgPropertyModel>) => {
        this.isShowLoader = false;
        this.searchFlag = 1;
        this.tbldata = propertyList;
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }
  Search() {
    this.page = 1;
    this.getSearchProperties()
  }


  getSearchProperties() {
    if (this.searchControl.value == "" || this.searchControl.value == null) {
      this.getProperties();
    }
    else {

      this.isShowLoader = true;
      this.orgAssetManagerService.getSearchProperties(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId, this.page, this.searchControl.value)
        .subscribe((propertyList: Array<EditOrgPropertyModel>) => {
          //      this.propertyList = propertyList;
          this.isShowLoader = false;
          this.searchFlag = 2;
          this.tbldata = propertyList;
          if (this.tbldata[0].totalCount != 0) {
            this.tbldataLength = this.tbldata[0].totalCount;
          }
          this.isShowLoader = false;
        },
          error => {
            this.isShowLoader = false;
          });
    }
  }


  onChangePage(pageNumber: any): void {

    this.page = pageNumber.pageIndex;
    if (this.searchFlag == 1) {
      this.getProperties();
    }
    else {
      this.getSearchProperties();
    }
  }

  onEnterKeyPressOther($event: any) {
    this.is_add_other_details = !this.is_add_other_details
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


  onStateChange($event) {
    var stateId = $event.target.value;
    this.addOrgPropertyModel.cityId = 0;
    this.addOrgPropertyModel.talukaId = 0;
    this.addOrgPropertyModel.villageId = 0;
    this.lookupService.cityList = [];
    this.lookupService.talukaList = [];
    this.lookupService.villageList = [];

    this.lookupService.getCities(stateId);
  }

  onDistrictChange(cityId: string, reset: boolean = true) {
    if (reset) {
      this.addOrgPropertyModel.talukaId = 0;
      this.addOrgPropertyModel.villageId = 0;
      this.lookupService.talukaList = [];
      this.lookupService.villageList = [];
    }
    this.lookupService.getTalukas(Number(cityId));
  }

  onTalukaChange(talukaId: string, reset: boolean = true) {
    if (reset) {
      this.addOrgPropertyModel.villageId = 0;
      this.lookupService.villageList = [];
    }
    this.lookupService.getVillages(Number(talukaId));
  }

  onResetFields() {
    this.addOrgPropertyModel = new AddOrgPropertyModel();
  }
  Refresh() {
    this.getProperties();
  }

  onInsertKeyword($event, keyword, propName) {
    document.execCommand('insertText', false, " " + keyword + " ");
    return false;
  }
  validateForm() {
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";
    if (this.addOrgPropertyModel.ownerFullName.trim() == "")
      validationErrors.push("Name");

    if (this.addOrgPropertyModel.cityId == 0)
      validationErrors.push("District");
    if (this.addOrgPropertyModel.talukaId == 0)
      validationErrors.push("Taluka");
    if (this.addOrgPropertyModel.villageId == 0)
      validationErrors.push("Village");
    if (this.loggedInUserRole == "Org Admin") {
      if (this.addOrgPropertyModel.branchId == undefined)
        validationErrors.push("Branch");
    }
    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      this.toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }

  myFiles: any = [];
  getFileDetails(e) {

    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  onAddProperty(): any {
    this.isShowLoader == true;
    if (!this.validateForm())
      return false;

    this.orgAssetManagerService.addOrgProperty(this.addOrgPropertyModel)
      .subscribe((addedRow: any) => {

        var message = addedRow.message;
        this.toastr.success(message, "Success");
        $("#add-property-modal").modal('hide');
        this.isShowLoader = false;
        this.clearForm();
        this.getProperties();
        this.getNotifactionCount();

      },
        error => {
          this.isShowLoader = false;
          this.toastr.error('Failed to Create Property!', "Error");
        });
  }

  onUploadImages() {

    this.orgAssetManagerService.uploadAssestImage(this.myFiles)
      .subscribe((uploadedNoticeImage: Array<AssetImage>) => {

        if (this.addOrgPropertyModel.assetImages) {
          this.addOrgPropertyModel.assetImages = this.addOrgPropertyModel.assetImages.concat(uploadedNoticeImage);
        } else {
          this.addOrgPropertyModel.assetImages = uploadedNoticeImage;
        }
      },
        error => {
          this.toastr.error('Failed to Upload Property Image!', "Error");
        });
  }

  propertyImage: any = [];
  _initDropZone() {
    var _self = this;
    $(document).on('change', '.btn-file :file', function () {
      var input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [label]);
    });

    $('.btn-file :file').on('fileselect', function (event, label) {

      var input = $(this).parents('.input-group').find(':text'),
        log = label;

      if (input.length) {
        input.val(log);
      } else {
        if (log) alert(log);
      }
    });
    function readURL(input) {
      for (var i = 0; i < input.files.length; i++) {
        if (input.files && input.files[i]) {
          _self.propertyImage = input.files[i];

          var reader = new FileReader();
          reader.onload = function (e) {
            _self.displayImages(e.target["result"]);

            // $("#previewImg").append("<img class='thumb' src='" + e.target.result + "'>");
            // $('#img-upload').attr('src', e.target["result"]);
          }
          reader.readAsDataURL(input.files[i]);
        }
      }
      _self.onUploadImages();
    }


    $("#imgInp").change(function () {
      readURL(this);
    });
  }

  clearForm() {
    this.addOrgPropertyModel = new AddOrgPropertyModel;
    this.propertyImage = null;
    this.propertyImagelist = [];
    this.myFiles = [];
    $('#img-upload').attr('src', "");
    $('#imgInp').val("");
    $('#txt-selected-filename').val("");
  }

  propertyImagelist: any = [];
  displayImages(files: any) {

    let propetyImage: AssetImage = new AssetImage();
    propetyImage.fileName = files;
    propetyImage.originalFileName = files.originalFileName;
    propetyImage.imageTypeId = 3;
    propetyImage.name = files.name;
    propetyImage.isDeleted = false;
    propetyImage.isAdded = true;
    this.propertyImagelist.push(propetyImage);
  }

  uploadImages: any = [];

  onRemoveImage(propertyImage: AssetImage, removeIndex: number) {
    // Mark the propertyImage as deleted
    propertyImage.isDeleted = true;

    // Remove the corresponding entry from the propertyImagelist array
    const name = this.propertyImagelist[removeIndex];
    const i = this.propertyImagelist.indexOf(name);
    if (i > -1) {
      this.propertyImagelist.splice(i, 1);
    }

    // Remove the corresponding file from the myFiles array
    const file = this.myFiles[removeIndex];
    const index = this.myFiles.indexOf(file);
    if (index > -1) {
      this.myFiles.splice(index, 1);
    }

    // Remove the corresponding image from the uploadImages array
    this.uploadImages.splice(removeIndex, 1);
    this.addOrgPropertyModel.assetImages = this.myFiles;
  }



  AddProperty() {
    this.isSaving = false;
    this.addOrgPropertyModel = new AddOrgPropertyModel;
    this.propertyImage = null;

    this.propertyImagelist = [];
    this.myFiles = [];
    this.isSaving = false;
    this.addOrgPropertyModel.createdBy = this.loggedInUserId;
    this.addOrgPropertyModel.orgId = this.loggedInUserOrgId;
    this.addOrgPropertyModel.branchId = this.loggedInUserBranchId;
    this.addOrgPropertyModel.role_id = this.loggedInUserRoleGuid;
    this.heading = "Add New Asset"
    this.label = "Add New Property";
    this.saveLabel = "Add Property";
    $("#add-property-modal").modal('show');
  }

  AddMultipleAssets() {
    $("#add-multiple-property").modal('show');
  }

  showEditPropertyPopup() {
    $("#add-property-modal").modal('show');
  }

  AssetId: any;

  viewpropertyfollowup: any = [];
  onViewPropertyFollowUp(addOrgPropertyModel: AddOrgPropertyModel) {

    this.AssetId = addOrgPropertyModel.id;
    this.viewpropertyfollowup = addOrgPropertyModel;

    $("#view-property-followup").modal('show');

  }

  NotificationAlerts() {

    this.isShowLoader = true;
    this.notificationServices.NotificationAlerts().subscribe(
      (response) => {

        this.isShowLoader = false;
        this.getNotifactionCount();
      },
      (error) => {
        this.isShowLoader = false;
      }
    );
  }


  getNotifactionCount() {

    this.isShowLoader = true;
    this.notificationServices.notificationCount(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(
      (r) => {

        if (r.length == 0) {
          this.isShowLoader = false;
        } else {
          this.notificationServices.updateNotifications(r[0].notificationCount);
          this.isShowLoader = false;
        }
      },
      error => {
        this.isShowLoader = false;
      }
    );
  }

  onPropertyHistory(addOrgPropertyModel: AddOrgPropertyModel) {
    this.comments = new Array();
    $("#view-asset-history").modal('show');
    this.getAssetComments(addOrgPropertyModel.id)
  }

  comments: any = [];
  getAssetComments(AssetId) {

    this.isShowLoader = true;
    this.orgAssetManagerService.getPropertiesHistory(AssetId, this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(r => {

      this.comments = new Array();
      this.comments = r;
      this.isShowLoader = false;

      for (let i = 0; i < this.comments.length; i++) {
        this.comments[i].documents = JSON.parse(this.comments[i].documents);
      }
    },
      error => {
        this.isShowLoader = false;
      });
  }


  onShowActiveOnly() {

  }
  heading: string;
  onEditProperty(addOrgPropertyModel: AddOrgPropertyModel) {

    this.addOrgPropertyModel = new AddOrgPropertyModel
    this.addOrgPropertyModel = addOrgPropertyModel;
    if (this.loggedInUserRoleGuid == "5A684E94-A768-45B7-8A2E-1F3BF22FC8B4") {
      this.isSaving = false;
      this.addOrgPropertyModel.createdBy = this.loggedInUserId;
      this.addOrgPropertyModel.orgId = this.loggedInUserOrgId;
      this.addOrgPropertyModel.branchId = addOrgPropertyModel.branchId;
      this.addOrgPropertyModel.role_id = this.loggedInUserRoleGuid;
    }
    else {
      this.isSaving = false;
      this.addOrgPropertyModel.createdBy = this.loggedInUserId;
      this.addOrgPropertyModel.orgId = this.loggedInUserOrgId;
      this.addOrgPropertyModel.branchId = this.loggedInUserBranchId;
      this.addOrgPropertyModel.role_id = this.loggedInUserRoleGuid;
    }
    this.lookupService.getVillages(addOrgPropertyModel.talukaId)
    this.heading = "Update Asset"
    this.label = "Edit Property";
    this.saveLabel = "Update Property";

    this.addOrgPropertyModel.landCategoryId = addOrgPropertyModel.landCategoryId.toString();

    if (this.addOrgPropertyModel.assetImages != null) {
      this.propertyImagelist = [];
      this.myFiles = []
      this.addOrgPropertyModel.assetImages.forEach((properyImage: AssetImage) => {
        properyImage.fileName = properyImage.name;
        this.myFiles.push(properyImage)
        this.propertyImagelist.push(properyImage);
      });
    }
    $("#add-property-modal").modal('show');
  }

  onDeleteProperty(addOrgPropertyModel: AddOrgPropertyModel): void {

    const message = `Are you sure you want to delete?`;

    const dialogData = new ConfirmDialogModel("Confirm Action", message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      this.result = dialogResult;
      this.DeleteProperty(addOrgPropertyModel);
    });
  }



  DeleteProperty(addOrgPropertyModel) {

    if (this.result) {
      this.isSaving = true;
      if (this.loggedInUserRoleGuid == "5A684E94-A768-45B7-8A2E-1F3BF22FC8B4") {
        addOrgPropertyModel.createdBy = this.loggedInUserId;
        addOrgPropertyModel.orgId = this.loggedInUserOrgId;
        addOrgPropertyModel.branchId = addOrgPropertyModel.branchId;
        addOrgPropertyModel.role_id = this.loggedInUserRoleGuid;
      }
      else {
        addOrgPropertyModel.createdBy = this.loggedInUserId;
        addOrgPropertyModel.orgId = this.loggedInUserOrgId;
        addOrgPropertyModel.branchId = this.loggedInUserBranchId;
        addOrgPropertyModel.role_id = this.loggedInUserRoleGuid;
      }
      this.orgAssetManagerService.deleteProperty(addOrgPropertyModel)
        .subscribe((r) => {

          this.isShowLoader = false;
          var message = r;
          this.toastr.success(message, "Success");
          // this.propertyList.splice(editPropertyModel.propertyIndex, 1);
          this.getProperties();
        },
          error => {
            this.isShowLoader = false;
          });
    }
  }


  exportAsXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.tbldata.map(o => {
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
        createdDate: o.createdDate,
        Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Assets');
    this.isShowLoader = false;
  }

  returnstring(isActive: any) {
    if (isActive == true) {
      return 'Active';
    }
    else {
      return 'InActive';
    }
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

export class ConfirmDialogModel {
  constructor(public title: string, public message: string) {
  }
}