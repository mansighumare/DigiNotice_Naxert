import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatPaginator } from '@angular/material/paginator';
import { OrganisationUserModel } from "src/app/models/account.model";

import { OrganisationUser } from "src/app/models/organisation.model";

import {
  MasterDataService,
} from "src/app/services";
import { OrganisationService } from "src/app/services/organisation.service";
import { ExcelService } from "src/app/services/excel.service";
import { FormControl } from "@angular/forms";

declare var $;
declare var CityId
declare var toastr;
@Component({
  selector: "app-organisation-user-list",
  templateUrl: "./organisation-user-list.component.html",
  styleUrls: ["./organisation-user-list.component.scss"],
})
export class OrganisationUserListComponent implements OnInit {
  page = 1;
  pageSize = 25;
  tbldataLength: number;
  pageSizeOptions: number[] = [3, 5, 8, 10];
  constructor(
    private router: Router,
    private excelService: ExcelService,
    private AddEditOrganisationService: OrganisationService,
    private masterDataService: MasterDataService,


  ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  Branch: any = [];
  selectedOrganisationId: any;
  loggedInUserRole: any;
  loggedInUserId: any;
  public searchtext = "";
  loggedInUserRoleGuid: any;
  registerUserRole: string = "";
  loggedInUserBranchId: any;
  UserRoles: any = [];
  OrganisationList: any = [];
  label: string;
  tbldata: any = [];
  filteredList: any = [];
  filteredListTemp: any = [];
  Savedlabel: string;
  organisationUserModel: OrganisationUserModel = new OrganisationUserModel();
  State: any = [];
  City: any = [];
  UserCity: any = [];
  selectedRoleId: any;
  UserStateId: any;
  loggedInUserOrgId: any;
  searchFlage: number = 0;
  searchControl: FormControl = new FormControl();


  ngOnInit() {

    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;


      this.getOrganisationUsers();
      this.getOrgansiationList();
      this.getRoles();
      this.getStateList();

    } else {
      this.router.navigate(["./login"]);
    }
  }

  AddUsers() {

    this.reset();
    $("#add-mode-modal").modal("show");
    this.Savedlabel = "Add";
    this.label = "Add Organization User";
  }

  reset() {
    this.organisationUserModel = new OrganisationUserModel
    this.organisationUserModel.orgIntID = "";
    this.organisationUserModel.stateId = "";
    this.organisationUserModel.roleIntID = "";
    this.organisationUserModel.cityId = "";
    this.organisationUserModel.branchIntID = "";
    this.organisationUserModel.firstName = undefined;
    this.organisationUserModel.lastName = undefined;
    this.organisationUserModel.email = undefined;
    this.organisationUserModel.UserStateId = "";
    this.organisationUserModel.UserCityId = "";
    this.organisationUserModel.phone = undefined;
    this.organisationUserModel.password = undefined;
    this.organisationUserModel.confirmPassword = undefined;
  }

  onEditUser(e) {


    $("#add-mode-modal").modal("show");
    var userIntId = e.userIntId;
    var id = e.id;
    var isActive = e.isActive;
    var roleIntId = e.roleIntId;
    this.label = "Edit Organisation User";
    this.Savedlabel = "Update";
    this.getUserDetails(userIntId, roleIntId, id, isActive);
  }


  getUserDetails(userIntId, roleIntId, id, isActive) {

    this.AddEditOrganisationService.getUserDetails(
      userIntId,
      roleIntId,
      id,
      isActive
    ).subscribe((r) => {

      var userdetails: any = [];
      userdetails = r[0];
      this.loggedInUserOrgId = userdetails.orgId;
      this.selectedOrganisationId = userdetails.orgId;
      this.getBranches(userdetails.branchCityId);
      this.getCityList(userdetails.stateId);
      this.getUserCityList(userdetails.stateId)
      this.selectedRoleId = userdetails.roleIntId;
      this.loggedInUserOrgId = userdetails.orgId;
      this.organisationUserModel.userIntId = userdetails.userIntId;
      this.organisationUserModel.roleIntID = userdetails.roleIntId;
      this.organisationUserModel.orgIntID = userdetails.orgId;
      this.organisationUserModel.stateId = userdetails.branchStateId;
      this.organisationUserModel.cityId = userdetails.branchCityId;
      this.organisationUserModel.UserStateId = userdetails.stateId;
      this.organisationUserModel.firstName = userdetails.firstName;
      this.organisationUserModel.lastName = userdetails.lastName;
      this.organisationUserModel.email = userdetails.email;
      this.organisationUserModel.branchIntID = userdetails.branchId;
      this.organisationUserModel.UserCityId = userdetails.cityId;
      this.organisationUserModel.phone = userdetails.phone;
      this.organisationUserModel.password = userdetails.password;
      this.organisationUserModel.confirmPassword = userdetails.password;
    }
    );
  }

  Close() {
    $("#add-mode-modal").modal("hide");
  }

  getRoles() {
    this.AddEditOrganisationService.getRoles(
      this.loggedInUserId,
      this.loggedInUserRoleGuid,
      this.loggedInUserRole
    ).subscribe((r) => {
      this.UserRoles = r;
    });
  }

  getStateList() {
    var country_id = 1;
    this.masterDataService.getStateList(country_id).subscribe((r) => {
      this.State = r;
    });
  }

  getCityList(cityId) {
    var isActive = true
    this.masterDataService.getCityList(cityId, isActive).subscribe(
      (r) => {
        this.City = r;
      }
    );
  }

  getUserCityList(cityId) {
    var isActive = true
    this.masterDataService.getCityList(cityId, isActive).subscribe(
      (r) => {
        this.UserCity = r;
      }
    );
  }

  getOrgansiationList() {
    this.masterDataService.getOrgansiation(this.loggedInUserRole, this.loggedInUserId, this.isShowActiveOnly).subscribe((r) => {
      this.OrganisationList = r.filter(org => org.isActive === true);
    });
  }

  getBranches(UserCityId) {
    if (this.loggedInUserRole == "SuperAdmin" && this.loggedInUserOrgId == 0) {
      this.loggedInUserOrgId = this.selectedOrganisationId;
    }
    this.AddEditOrganisationService.getBranchesList(
      this.loggedInUserId,
      this.loggedInUserRoleGuid,
      this.loggedInUserRole,
      this.loggedInUserOrgId,
      UserCityId
    ).subscribe((r) => {

      this.Branch = r;
    });
  }

  onOptionsSelected(e) {

    this.selectedOrganisationId = e.target.value;
  }

  onOptionsSelectedRole(e) {
    
    this.selectedRoleId = e.target.value;
    if (this.selectedRoleId == 7) {
      this.organisationUserModel.branchId = 0;
      this.organisationUserModel.branchIntID = 0;
    }

  }

  onOptionsSelectedCity(e) {
    var CityId = e.target.value;
    this.getBranches(CityId);
  }

  onOptionsUserSelectedState(e) {

    var cityId = e.target.value;
    this.getUserCityList(cityId);
  }

  onOptionsSelectedState(e) {

    var cityId = e.target.value;
    this.getCityList(cityId);
  }



  onSelectedOrg(e) {

    //this.selectedOrganisationId = e.target.value;
    this.page = 1;
    this.tbldataLength = 0;
    this.loggedInUserOrgId = e.target.value;
    this.getOrganisationUsers();
  }

  Refresh() {
    this.page = 1;
    this.getOrganisationUsers();
  }




  isShowLoader: boolean = false;

  validateForm() {

    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";


    if (this.loggedInUserRole == 'SuperAdmin') {
      if (this.organisationUserModel.orgIntID == "")
        validationErrors.push("Organisation");
    }

    if (this.selectedRoleId != 7) {
      if (this.organisationUserModel.stateId == "")
        validationErrors.push("Branch State");

      if (this.organisationUserModel.cityId == "")
        validationErrors.push("Branch District");

      if (this.organisationUserModel.branchIntID == "")
        validationErrors.push("Branch");
    }
    if (this.organisationUserModel.roleIntID == "")
      validationErrors.push("Role");

    if (this.organisationUserModel.firstName == undefined)
      validationErrors.push("First Name");

    if (this.organisationUserModel.lastName == undefined)
      validationErrors.push("Last Name");

    if (this.organisationUserModel.email == undefined)
      validationErrors.push("Email");


    if (this.organisationUserModel.UserStateId == "")
      validationErrors.push("User State");

    if (this.organisationUserModel.UserCityId == "")
      validationErrors.push("User District");

    if (this.organisationUserModel.phone == undefined)
      validationErrors.push("Phone");

    if (this.organisationUserModel.password == undefined)
      validationErrors.push("Password");

    if (this.organisationUserModel.confirmPassword == undefined)
      validationErrors.push("Confirm Password");

    if (
      this.organisationUserModel.confirmPassword !=
      this.organisationUserModel.password
    )
      validationErrors.push("Password and Confirm Password Not Matched");


    if (validationErrors.length > 0) {

      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }



  registerUser():any {

    if (this.loggedInUserRole == "SuperAdmin") {
      this.organisationUserModel.orgIntID = this.selectedOrganisationId;
    }
    else {
      this.organisationUserModel.orgIntID = this.loggedInUserOrgId;
    }

    if (!this.validateForm()) {
      return false;
    } else {
      this.isShowLoader = true;
      this.isShowLoader = true;
      this.AddEditOrganisationService.addOrgUser(
        this.organisationUserModel
      ).subscribe(
        (addedRow: any) => {

          let message = addedRow[0].message;
          if (message == "User already exists in system") {
            toastr.error(message, "Error");
          }
          else {
            toastr.success(message, "Success");
            $("#add-mode-modal").modal("hide");
         
            this.getOrganisationUsers();
          }
          this.isShowLoader = false;
       
        },
        (error) => {
          this.isShowLoader = false;
          toastr.error("Failed to create Organisation!", "Error");
        }
      );
    }
  }


  onChangePage(pageNumber: any): void {

    this.page = pageNumber.pageIndex;
    if (this.searchFlage == 1) {
      this.getOrganisationUsers();
    }
    else {
      this.searchOrganisationUsers();
    }
  }
  getOrganisationUsers() {

    this.isShowLoader = true;
    this.AddEditOrganisationService.getOrganisationUsers(this.loggedInUserId, this.loggedInUserOrgId, this.loggedInUserBranchId, this.loggedInUserRoleGuid, this.isShowActiveOnly, this.page
    ).subscribe(
      (OrganisationUser: Array<OrganisationUser>) => {
        this.tbldata = OrganisationUser;
        this.isShowLoader = false;
        this.searchFlage = 1;
        if (this.tbldata.length == 0) {
          this.tbldataLength = 0;
        }
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }


  searchOrganisationUsers() {
    this.isShowLoader = true;
    if (this.searchControl.value== "" || this.searchControl.value== null) {
      this.getOrganisationUsers();
    }
    else {
      this.AddEditOrganisationService.searchOrganisationUsers(this.loggedInUserId, this.loggedInUserOrgId, this.loggedInUserBranchId, this.loggedInUserRoleGuid, this.isShowActiveOnly, this.page, this.searchControl.value
      ).subscribe(
        (OrganisationUser: Array<OrganisationUser>) => {
          this.searchFlage = 2;
          this.tbldata = OrganisationUser;
          this.isShowLoader = false;
          if (this.tbldata.length == 0) {
            this.tbldataLength = 0;
          }
          if (this.tbldata[0].totalCount != 0) {
            this.tbldataLength = this.tbldata[0].totalCount;
          }
          this.isShowLoader = false;
        },
        (error) => {
          this.isShowLoader = false;
        }
      );
    }
  }

  Search(){
    this.page=1;
    this.searchOrganisationUsers();
  }
  filter(e) {
    this.filteredList = this.filteredListTemp.filter(
      function (el) {
        var result = "";
        for (var key in el) {
          result += el[key];
        }
        return result.toLowerCase().indexOf(this.searchtext.toLowerCase()) > -1;
      }.bind(this)
    );
    this.getOrganisationUsers();
  }

  onActiveInActive(e) {

    var isActive = !e.isActive;
    var userIntId = e.userIntId;
    var userId = e.id;
    this.AddEditOrganisationService.updateUserStatus(
      userIntId,
      userId,
      isActive
    ).subscribe(
      (addedRow: any) => {

        let message = addedRow[0].message;
        toastr.success(message, "Success");
        this.isShowLoader = false;
        this.getOrganisationUsers();
      },
      (error) => {
        this.isShowLoader = false;
        toastr.error("Failed to Update User!", "Error");
      }
    );
  }

  onUserDelete(OrganisationUser: OrganisationUser) {
    OrganisationUser.isActive = !OrganisationUser.isActive;
  }

  isShowActiveOnly: boolean = true;
  onShowActiveOnly() {
    this.tbldata = new Array;
    this.isShowActiveOnly = !this.isShowActiveOnly;
    this.getOrganisationUsers();
  }

  exportAsXLSX(): void {

    this.isShowLoader = true;

    const exportda = this.tbldata.map(o => {
      return {
        FirstName: o.firstName,
        LastName: o.lastName,
        Email: o.email,
        Phone: o.phone,
        Role: o.role,
        OrganisationName: o.organisationName,
        BranchName: o.branchName,
        Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Organisation User Information');
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
