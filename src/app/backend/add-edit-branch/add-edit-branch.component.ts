import { Component, OnInit } from '@angular/core';
import { AddOrganisationModel } from 'src/app/models/column';
import { MasterDataService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService } from 'src/app/services/excel.service';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';

declare var $;
declare var toastr;
@Component({
  selector: 'app-add-edit-branch',
  templateUrl: './add-edit-branch.component.html',
  styleUrls: ['./add-edit-branch.component.scss']
})

export class AddEditBranchComponent implements OnInit {

  constructor(
    private masterDataService: MasterDataService,
    private excelService: ExcelService,
    private router: Router, private route: ActivatedRoute,
    private location: Location,
  ) { }

  // @ViewChild(MatPaginator) paginator: MatPaginator;
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
  BranchList: any = [];
  parentbranch: any;
  BranchId: any;
  searchFlag:number=0;
  searchControl: FormControl = new FormControl();

  ngOnInit() {
    
    this.route.paramMap.subscribe(parameterMap => {
      this.loggedInUserOrgId = parameterMap.get('orgId');
      this.getBranches();
    });
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.getStateList();
    }
    else {
      this.router.navigate(["./login"]);
    }
    if (this.loggedInUserRole == "SuperAdmin") {
      this.getOrgansiationList();
      this.route.paramMap.subscribe(parameterMap => {
        this.loggedInUserOrgId = parameterMap.get('orgId');
        this.addOrganisationModel.OrganisationId = this.loggedInUserOrgId;
        this.getBranches();
      });
    }
  }
  back() {
    this.location.back();
  }

  AddBranch() {
    this.reset();


  }

  reset() {
    //  this.addOrganisationModel = new AddOrganisationModel
    this.BranchId = undefined;

    this.addOrganisationModel.CountryId = 1;
    this.addOrganisationModel.StateId = 0;
    this.addOrganisationModel.TalukaId = 0;
    this.addOrganisationModel.CityId = 0;
    this.addOrganisationModel.VillageId = 0;
    this.addOrganisationModel.ParentBranch = "1";
    this.addOrganisationModel.BranchName = "";
    this.addOrganisationModel.BranchDisplayName = "";
    this.addOrganisationModel.BranchId = 0;
    this.addOrganisationModel.BranchAddress = "";
    this.addOrganisationModel.ParentBranchId = 0;

    if (this.loggedInUserOrgId == 0) {
      let validationErrors: Array<string> = [];
      let isValid: boolean = true;
      let validationMessage = "Please Select";
      if (this.addOrganisationModel.OrganisationId == 0)
        validationErrors.push(" Organization");
      if (validationErrors.length > 0) {
        validationMessage += validationErrors.join(", ");
        toastr.error(validationMessage, "Validation Error");
        isValid = false;
      }
    }
    else {
      $("#add-mode-modal").modal('show');
      this.Savedlabel = "Add"
      this.label = "Add Branch ";
    }

  }

  onEditBranch(e) {

    this.loggedInUserOrgId = e.orgId;
    this.BranchId = e.branchId
    $("#add-mode-modal").modal('show');
    this.getCityList(e.stateId);
    this.getTalukaList(e.cityId);
    this.getVillageList(e.talukaId);
    this.getParentBranchesList();
    this.label = "Edit Branch";
    this.addOrganisationModel.StateId = e.stateId;
    this.addOrganisationModel.CityId = e.cityId;
    this.addOrganisationModel.TalukaId = e.talukaId;
    this.addOrganisationModel.VillageId = e.villageId;
    this.addOrganisationModel.OrganisationId = e.orgId;
    this.addOrganisationModel.CountryId = e.countryId;
    if (e.parentId != 0 && e.parentId != null) {
      this.addOrganisationModel.ParentBranch = "0";
      this.parentbranch = "0";
      this.addOrganisationModel.ParentBranchId = e.parentId;
    }
    else {
      this.addOrganisationModel.ParentBranch = "1";
      this.parentbranch = "1";
    }
    this.addOrganisationModel.BranchName = e.name;
    this.addOrganisationModel.BranchDisplayName = e.displayName;
    this.addOrganisationModel.BranchAddress = e.address;
    this.addOrganisationModel.BranchId = e.branchId;
    this.Savedlabel = "Update"
  }

  Close() {
    $("#add-mode-modal").modal('hide');
  }

  getOrgansiationList() {
    this.masterDataService.getOrgansiation(this.loggedInUserRole, this.loggedInUserId, this.isShowActiveOnly).subscribe((r) => {
      this.OrganisationList = r.filter(org => org.isActive === true);
    });
  }

  getStateList() {
    this.country_id = 1;
    this.masterDataService.getStateList(this.country_id).subscribe((r) => {
      this.stateList = r.filter(state => state.isActive === true);
    });
  }
  isShowLoader: boolean = false;

  onOptionsSelectedState(e) {
    var cityId = e.target.value;
    this.getCityList(cityId);
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

  getVillageList(villageId) {
    var isActive = true
    this.masterDataService.getVillageList(villageId, isActive).subscribe(
      (r) => {
        this.VillageList = r.filter(village => village.isActive === true);;
      }
    );
  }

  getParentBranchesList() {
    this.masterDataService.getParentBranchesList(this.loggedInUserOrgId, this.BranchId)
      .subscribe(branch => {
        this.BranchList = branch;
      });
  }


  changedtype(row: any) {

    this.parentbranch = this.addOrganisationModel.ParentBranch;
    if (this.loggedInUserRoleGuid == "6fa5ce77-1e42-4487-b880-229180e0e9a1") {
      this.loggedInUserOrgId = this.addOrganisationModel.OrganisationId;
    }
    else {
      this.addOrganisationModel.OrganisationId = this.loggedInUserOrgId;
    }
    if (this.BranchId == undefined) {

      this.BranchId = 0;
    }
    if (this.parentbranch == 0) {
      this.getParentBranchesList();
    }
    if (this.parentbranch == 1) {
      this.addOrganisationModel.ParentBranchId = 0;
    }
  }

  onSelectedOrg(e) {
    //this.selectedOrganisationId = e.target.value;
    this.loggedInUserOrgId = e.target.value;
    this.page=1;
    this.tbldataLength=0;
    this.getBranches();
  }

  Refresh() {
    this.page=1;
    this.getBranches();
  }

  validateForm() {
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";
    if (this.addOrganisationModel.OrganisationId == 0)
      validationErrors.push("Organization");
    if (this.addOrganisationModel.StateId == 0)
      validationErrors.push("State");
    if (this.addOrganisationModel.CityId == 0)
      validationErrors.push("District");
    if (this.addOrganisationModel.BranchName == "")
      validationErrors.push("Branch Name ");
    if (this.addOrganisationModel.BranchDisplayName == "")
      validationErrors.push("Branch Display Name");
    if (this.addOrganisationModel.TalukaId == 0)
      validationErrors.push("Taluka ");
    if (this.addOrganisationModel.VillageId == 0)
      validationErrors.push("Village");
    if (this.addOrganisationModel.BranchAddress == "")
      validationErrors.push("Address");
    if (this.addOrganisationModel.ParentBranch == undefined)
      validationErrors.push("Parent Branch");
    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }

  addBranch():any {
    this.addOrganisationModel.OrganisationId = this.loggedInUserOrgId;
    if (!this.validateForm()) {
      return false;
    }
    else {
      this.addOrganisationModel.isActive = true;
      this.isShowLoader = true;
      this.masterDataService.addBranch(this.addOrganisationModel)
        .subscribe((addedRow: any) => {
          let message = addedRow[0].message;
          toastr.success(message, "Success");
          $("#add-mode-modal").modal('hide');
          this.isShowLoader = false;
          this.getBranches()
        },
          error => {
            this.isShowLoader = false;
            toastr.error('Failed to create User!', "Error");
          });
    }
  }
  Branches: Array<AddOrganisationModel> = new Array<AddOrganisationModel>();
  page = 1;
  onChangePage(pageNumber: any): void {
    
    this.page = pageNumber.pageIndex;
    if(this.searchFlag==1){
    this.getBranches();
    }
    else{
      this.SearchBranches();
    }
  }
  getBranches() {
    this.isShowLoader = true;
    this.masterDataService.getBranches(this.loggedInUserId, this.loggedInUserOrgId, this.loggedInUserRoleGuid, this.isShowActiveOnly, this.page).subscribe(
      (Branches: Array<AddOrganisationModel>) => {
        this.searchFlag=1;
        this.tbldata = Branches;
        this.isShowLoader = false;
               if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }
      }
      ,
      (error) => {
        this.isShowLoader = false;
      }
    );
  }

  Search(){
    this.page=1;
    this.SearchBranches();
  }

  SearchBranches() {
    
    this.isShowLoader = true;
    if(this.searchControl.value=='' || this.searchControl.value==null){
      this.getBranches()
    }
    else{
    this.masterDataService.SearchBranches(this.loggedInUserId, this.loggedInUserOrgId, this.loggedInUserRoleGuid, this.isShowActiveOnly, this.page, this.searchControl.value).subscribe(
      (Branches: Array<AddOrganisationModel>) => {
        
        this.searchFlag=2;
        this.tbldata = Branches;
        this.isShowLoader = false;
        if(this.tbldata.length==0){
          this.tbldataLength =0;
        }
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }
      }
      ,
      (error) => {
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
    this.getBranches();
  }



  onActiveInActive(e) {
    var isActive = !e.isActive;
    var branchId = e.branchId;
    this.masterDataService.Branchstatus(
      isActive,
      branchId
    ).subscribe(
      (addedRow: any) => {
        let message = addedRow[0].message;
        toastr.success(message, "Success");
        this.getBranches();
        this.isShowLoader = false;
      },
      (error) => {
        this.isShowLoader = false;
        toastr.error("Failed to Update User!", "Error");
      }
    );
  }
  onBranchDelete(Branches: AddOrganisationModel) {
    Branches.isActive = !Branches.isActive;
  }

  isShowActiveOnly: boolean = true;
  onShowActiveOnly() {
    this.isShowActiveOnly = !this.isShowActiveOnly;
    this.getBranches();
  }



  exportAsXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.tbldata.map(o => {
      return {
        BranchId: o.branchId,
        OrgId: o.orgId,
        OrgName: o.orgName,
        ParentId: o.parentId,
        Name: o.name,
        DisplayName: o.displayName,
        Address: o.address,
        StateId: o.stateId,
        CityId: o.cityId,
        TalukaId: o.talukaId,
        VillageId: o.villageId,
        Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Branches');
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
