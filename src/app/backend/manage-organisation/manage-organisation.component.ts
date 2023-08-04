import { Component, OnInit } from '@angular/core';
import { AddOrganisationModel } from 'src/app/models/column';
import { MasterDataService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService } from 'src/app/services/excel.service';
import { FormControl } from '@angular/forms';
import { OrgAssetManagerService } from 'src/app/services/org-asset-manager.service';
import { AssetImage } from 'src/app/models/asset-manager';
import { ToastrService } from 'ngx-toastr';


declare var $;

@Component({
  selector: 'app-manage-organisation',
  templateUrl: './manage-organisation.component.html',
  styleUrls: ['./manage-organisation.component.scss']
})
export class ManageOrganisationComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private masterDataService: MasterDataService,
    private excelService: ExcelService,
    private router: Router, private route: ActivatedRoute,
    public orgAssetManagerService: OrgAssetManagerService,
  ) { }
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // MatPaginator Inputs
  pageSize = 25;
  pageSizeOptions: number[] = [3, 5, 8, 10];
  tbldataLength: number;
  loggedInUserRole: any;
  loggedInUserId: any;
  country_id: number;
  country_name: string = "India";
  public searchtext = '';
  loggedInUserOrgId: any;
  loggedInUserRoleGuid: any;
  label: string;
  tbldata: any = [];
  filteredList: any = [];
  filteredListTemp: any = [];
  Savedlabel: string;
  addOrganisationModel: AddOrganisationModel = new AddOrganisationModel();
  OrganisationList: any = [];
  CityList: any = [];
  stateList: any = [];
  TalukaList: any = [];
  VillageList: any = [];
  searchControl: FormControl = new FormControl();
  searchFlag: number = 0;
  myFiles: any = [];
  organizationLogoImageList: any = [];



  ngOnInit() {
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.getOrgDetails();
      this.getStateList();
      this._initDropZone();
      // this.getOrgDetails();
    }
    else {
      this.router.navigate(["./login"]);
    }
  }

  getFileDetails(e) {

    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  onUploadImages() {
    this.masterDataService.uploadOrganizationLogo(this.myFiles)
      .subscribe((orgLogoImage: any) => {
        
        if (orgLogoImage) {
          this.addOrganisationModel.fileName = orgLogoImage[0].fileName;
          this.addOrganisationModel.originalFileName = orgLogoImage[0].originalFileName
        }
      },
        error => {
          this.toastr.error('Failed to Upload Organization Logo!', "Error");
        });

  }



  organizationLogoImage: any = [];
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
      if (input.files.length > 1) {
        alert("Only one file is allowed.");
        return;
      }

      if (input.files && input.files[0]) {
        const file = input.files[0];
        _self.organizationLogoImage = file;

        var reader = new FileReader();
        reader.onload = function (e: any) {
          const img = new Image();
          img.onload = function () {
            const width = img.width;
            const height = img.height;
            const expectedWidth = 146;
            const expectedHeight = 35;

            if (width !== expectedWidth || height !== expectedHeight) {
              alert(`Image dimensions should be ${expectedWidth}x${expectedHeight}px.`);
              $('#txt-selected-filename').val("");
              return;
            }

            _self.displayImages(e.target.result);
            _self.onUploadImages();
             // Call onUploadImages if the condition is satisfied
            
          };

          img.src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    }
    $("#imgInp").change(function () {
      readURL(this);
    });
  }





  clearForm() {
    this.organizationLogoImage = null;
    this.organizationLogoImageList = [];
    this.myFiles = [];
    $('#img-upload').attr('src', "");
    $('#imgInp').val("");
    $('#txt-selected-filename').val("");
  }


  displayImages(files: any) {
    
    //let propetyImage: AssetImage = new AssetImage();
    var fileName;
    var originalFileName;
    var isDeleted;
    var imageTypeId;
    var image = { fileName, originalFileName, isDeleted, imageTypeId }
    image.fileName = files;
    image.imageTypeId = 3;
    image.isDeleted = false;
    // propetyImage.name = files.name;
    //propetyImage.isDeleted = false;
    // propetyImage.isAdded = true;
    this.organizationLogoImageList.push(image);
  }

  uploadImages: any = [];

  onRemoveImage(logoImage: any, removeIndex: number) {


    // Mark the organizationLogoImageList as deleted
    logoImage.isDeleted = true;

    // Remove the corresponding entry from the organizationLogoImageList array
    const name = this.organizationLogoImageList[removeIndex];
    const i = this.organizationLogoImageList.indexOf(name);
    if (i > -1) {
      this.organizationLogoImageList.splice(i, 1);
    }

    // Remove the corresponding file from the myFiles array
    const file = this.myFiles[removeIndex];
    const index = this.myFiles.indexOf(file);
    if (index > -1) {
      this.myFiles.splice(index, 1);
    }

    // Remove the corresponding image from the uploadImages array
    this.uploadImages.splice(removeIndex, 1);
    this.addOrganisationModel.fileName = undefined;
    this.addOrganisationModel.originalFileName = undefined;
  }



  AddOrganisation() {
    this.reset();
    $("#add-mode-modal").modal('show');
    this.Savedlabel = "Add"
    this.label = "Add Organization ";
    this.organizationLogoImageList=[];
    $('#txt-selected-filename').val("");

  }

  reset() {
    this.addOrganisationModel = new AddOrganisationModel
  }

  onEditOrganisation(e) {
    
    this.organizationLogoImageList = new Array
    this.loggedInUserOrgId = e.orgId;
    $("#add-mode-modal").modal('show');
    this.getCityList(e.stateId);
    this.getTalukaList(e.cityId);
    this.getVillageList(e.talukaId);
    $('#txt-selected-filename').val("");
    this.label = "Edit Organization";
    this.addOrganisationModel.StateId = e.stateId;
    this.addOrganisationModel.CityId = e.cityId;
    this.addOrganisationModel.TalukaId = e.talukaId;
    this.addOrganisationModel.VillageId = e.villageId;
    this.addOrganisationModel.OrgId = e.orgId;
    this.addOrganisationModel.CountryId = e.countryId;
    this.addOrganisationModel.OrganisationName = e.name;
    this.addOrganisationModel.OrganisationDisplayName = e.displayName;
    this.addOrganisationModel.OrganisationAddress = e.address;
    this.addOrganisationModel.originalFileName = e.logoURL;
    this.Savedlabel = "Update";
    var fileName;
    var originalFileName;
    var isDeleted;
    var imageTypeId;
    var image = { fileName, originalFileName, isDeleted, imageTypeId }


    if (this.addOrganisationModel.originalFileName == "" || this.addOrganisationModel.originalFileName == null) {
      image.isDeleted = true;
      this.organizationLogoImageList.push(image);
    }
    else {
      image.fileName = this.addOrganisationModel.originalFileName;
      image.imageTypeId = 3;
      image.isDeleted = false;
      this.organizationLogoImageList.push(image);
      this.myFiles.length==1;
    }

  }

  Close() {
    $("#add-mode-modal").modal('hide');
  }

  // getOrgansiationList() {
  //   
  //   this.masterDataService.getOrgansiationList(this.loggedInUserRole,this.loggedInUserId,this.isShowActiveOnly).subscribe((r) => {
  //     
  //     this.OrganisationList = r.filter(org => org.isActive === true);
  //   });
  // }

  getStateList() {

    this.country_id = 1;
    this.masterDataService.getStateList(this.country_id).subscribe((r) => {

      this.stateList = r;
      //  this.stateList = r.filter(state => state.isActive === true);
    });
  }
  isShowLoader: boolean = false;

  onOptionsSelectedState(e) {
    var cityId = e.target.value;
    this.getCityList(cityId);
  }
  page = 1;

  onChangePage(pageNumber: any): void {
    this.page = pageNumber.pageIndex;
    if (this.searchFlag == 1) {
      this.getOrgDetails();
    }
    else {
      this.SearchOrganization();
    }
  }
  getCityList(cityId) {

    var isActive = true
    this.masterDataService.getCityList(cityId, isActive).subscribe(
      (r) => {

        this.CityList = r.filter(city => city.isActive === true);;
      }
    );
  }

  onOptionsSelectedCity(e) {
    var talukaId = e.target.value;
    this.getTalukaList(talukaId);
  }

  getTalukaList(talukaId) {
    this.masterDataService.getTalukaList(talukaId).subscribe(
      (r) => {
        this.TalukaList = r.filter(taluka => taluka.isActive === true);;
      }
    );
  }

  onOptionsSelectedTaluka(e) {
    var villageId = e.target.value;
    this.getVillageList(villageId);
  }

  addBranch(orgId: number) {
    // this.router.navigate([`./backend/organisation-branches/${orgId}`], { relativeTo: this.route });
    this.router.navigate(["./backend/branches" + "/" + orgId]);
  }


  getVillageList(villageId) {
    var isActive = true
    this.masterDataService.getVillageList(villageId, isActive).subscribe(
      (r) => {
        this.VillageList = r.filter(village => village.isActive === true);;
      }
    );
  }

  onSelectedOrg(e) {
    //this.selectedOrganisationId = e.target.value;
    this.loggedInUserOrgId = e.target.value;
    this.getOrgDetails();
  }

  Refresh() {
    this.page = 1
    this.getOrgDetails();
  }

  validateForm() {

    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";

    if (this.addOrganisationModel.OrganisationName == "")
      validationErrors.push("Organisation Name ");

    if (this.addOrganisationModel.OrganisationDisplayName == "")
      validationErrors.push("Organisation Display Name");

    if (this.addOrganisationModel.StateId == 0)
      validationErrors.push("State");

    if (this.addOrganisationModel.CityId == 0)
      validationErrors.push("District");

    if (this.addOrganisationModel.TalukaId == 0)
      validationErrors.push("Taluka ");

    if (this.addOrganisationModel.VillageId == 0)
      validationErrors.push("Village");

    if (this.addOrganisationModel.OrganisationAddress == "")
      validationErrors.push("Address ");

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      this.toastr.error(validationMessage, "Validation Error");

      isValid = false;
    }
    return isValid;
  }


  addOrg():any {

    if (!this.validateForm()) {
      return false;
    }
    else {
      this.addOrganisationModel.isActive = true;
      this.isShowLoader = true;
      this.masterDataService.addOrg(this.addOrganisationModel)
        .subscribe((addedRow: any) => {

          let message = addedRow[0].message;
          this.toastr.success(message, "Success");
          $("#add-mode-modal").modal('hide');
          this.isShowLoader = false;
          this.reset();
          this.getOrgDetails()
        },
          error => {
            this.isShowLoader = false;
            this.toastr.error('Failed to create User!', "Error");
          });
    }
  }

  Organisation: Array<AddOrganisationModel> = new Array<AddOrganisationModel>();
  getOrgDetails() {
    
    this.isShowLoader = true;
    this.masterDataService.getOrgansiationList(this.loggedInUserRole, this.loggedInUserId, this.isShowActiveOnly, this.page).subscribe(
      (Organisation: Array<AddOrganisationModel>) => {
        this.tbldata = Organisation;
        this.searchFlag = 1;
        this.isShowLoader = false;
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }
      }
      ,
      (error) => {
        console.log(error);
        this.isShowLoader = false;
      }
    );
  }

  Search(){
    this.page=1;
    this.SearchOrganization();
  }
  SearchOrganization() {
    this.isShowLoader = true;
    if (this.searchControl.value== "" || this.searchControl.value== null) {
      this.getOrgDetails();
    }
    else {
      this.masterDataService.SearchOrganization(this.loggedInUserRole, this.loggedInUserId, this.isShowActiveOnly, this.page, this.searchControl.value).subscribe(
        (Organisation: Array<AddOrganisationModel>) => {
          this.tbldata = Organisation;
          this.searchFlag = 2;
          this.isShowLoader = false;
          if (this.tbldata[0].totalCount != 0) {
            this.tbldataLength = this.tbldata[0].totalCount;
          }
        }
        ,
        (error) => {
          console.log(error);
          this.isShowLoader = false;
        }
      );
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
    this.getOrgDetails();
  }



  onActiveInActive(e) {
    var isActive = !e.isActive;
    var OrgId = e.orgId;

    this.masterDataService.Organisationstatus(
      isActive,
      OrgId
    ).subscribe(
      (addedRow: any) => {

        let message = addedRow[0].message;
        this.toastr.success(message, "Success");
        this.getOrgDetails();
        this.isShowLoader = false;

      },
      (error) => {
        this.isShowLoader = false;
        this.toastr.error("Failed to Update User!", "Error");
      }
    );
  }
  onOrganisationDelete(Organisation: AddOrganisationModel) {
    Organisation.isActive = !Organisation.isActive;
  }

  isShowActiveOnly: boolean = true;
  onShowActiveOnly() {

    this.isShowActiveOnly = !this.isShowActiveOnly;
    this.getOrgDetails();
  }

  exportAsXLSX(): void {

    this.isShowLoader = true;

    const exportda = this.tbldata.map(o => {
      return {
        name: o.name,
        DisplayName: o.displayName,
        Address: o.address,
        State: o.stateName,
        District: o.districtName,
        Taluka: o.talukaName,
        Village: o.villageName,
        Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Organisation Information');
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


}

