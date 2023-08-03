import { Component, OnInit, ViewChild } from '@angular/core';
import { BackEndUser } from 'src/app/models/backend-user.model';
import { BackendUserModel } from 'src/app/models/account.model';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MasterDataService, } from 'src/app/services';
import { BackendUserService } from 'src/app/services/backend-user.service';
import { ExcelService } from 'src/app/services/excel.service';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';

declare var $;
declare var toastr;
@Component({
  selector: 'app-backend-users-list',
  templateUrl: './backend-users-list.component.html',
  styleUrls: ['./backend-users-list.component.scss']
})
export class BackendUsersListComponent implements OnInit {

  // MatPaginator Inputs
  pageSize = 25;
  pageSizeOptions: number[] = [3, 5, 8, 10];

  // MatPaginator Output
  //pageEvent: PageEvent;
  // CREATE A JSON ARRAY.
  constructor(
    private router: Router, private excelService: ExcelService,
    private AddEditBackendUserService: BackendUserService,
    private masterDataService: MasterDataService,

  ) {

  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  activePage: any;
  total: number;
  resultsLength = 0;
  loggedInUserRole: any;
  loggedInUserId: any;
  tbldataLength: number;
  public searchtext = '';
  loggedInUserRoleGuid: any;
  registerUserRole: string = "";
  UserRoles: any[];
  label: string;
  tbldata: any = [];
  filteredList: any[];
  filteredListTemp: any[];
  Savedlabel: string;
  backendUserModel: BackendUserModel = new BackendUserModel();
  City: any[];
  State: any[];
  selectedRoleId: any;
  selectedStateId: any;
  loggedInUserOrgId: any;
  searchControl: FormControl = new FormControl();
  searchFlag: number = 0;


  ngOnInit() {

    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      if (this.loggedInUserRole == "SuperAdmin") {
        this.selectedRoleId = 0;

      }
      else {
        this.selectedRoleId = 1;
      }
      this.getBackendUsers();
      this.getRoles();
      this.getStateList();
    }
    else {
      this.router.navigate(["./login"]);
    }

  }

  AddUsers() {

    this.reset();
    $("#add-mode-modal").modal('show');
    this.Savedlabel = "Save"
    this.label = "Add Backend User";

  }
  onPageChange(event) {
    this.activePage = event.activePage;
  }

  reset() {
    this.backendUserModel = new BackendUserModel
    // this.backendUserModel.roleIntID = undefined;
    // this.backendUserModel.stateId = " ";
    // this.backendUserModel.cityId = " ";
    // this.backendUserModel.firstName = undefined;
    // this.backendUserModel.lastName = undefined;
    // this.backendUserModel.email = undefined;
    // this.backendUserModel.phone = undefined;
    // this.backendUserModel.password = undefined;
    // this.backendUserModel.confirmPassword = undefined;
    this.City = undefined;
  }


  onEditUser(e) {


    $("#add-mode-modal").modal('show');
    var userIntId = e.userIntId;
    var id = e.id;
    var isActive = e.isActive;
    this.label = "Edit Backend User";
    this.Savedlabel = "Update"
    this.getUserDetails(userIntId, id, isActive);

  }
  getUserDetails(userIntId, id, isActive) {

    this.AddEditBackendUserService.getUserDetails(userIntId, id, isActive).subscribe(r => {

      var userdetails: any = [];
      userdetails = r[0];
      let stateId = userdetails.stateId;
      this.getCityList(stateId);
      this.backendUserModel.userIntId = userdetails.userIntId;
      this.backendUserModel.roleIntID = userdetails.roleId;
      this.backendUserModel.stateId = userdetails.stateId;
      this.backendUserModel.cityId = userdetails.cityId;
      this.backendUserModel.firstName = userdetails.firstName;
      this.backendUserModel.lastName = userdetails.lastName;
      this.backendUserModel.email = userdetails.email;
      this.backendUserModel.phone = userdetails.phone;
      this.backendUserModel.password = userdetails.password;
      this.backendUserModel.confirmPassword = userdetails.password;

    });
  }

  Close() {
    $("#add-mode-modal").modal('hide');
  }




  getRoles() {

    this.AddEditBackendUserService.getRoles(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserRole).subscribe(r => {

      this.UserRoles = r;
    });

  }

  getCityList(stateId) {
    var isActive = true
    this.masterDataService.getCityList(stateId, isActive).subscribe(
      (r) => {

        this.City = r;
      }
    );
  }

  onOptionsSelected(e) {

    this.selectedRoleId = e.target.value;
  }

  onOptionsSelectedrole(e) {

    this.selectedRoleId = e.target.value;
    this.getBackendUsers();
  }
  Refresh() {
    this.page=1;
    this.getBackendUsers();
  }


  getStateList() {

    var country_id = 1;
    this.masterDataService.getStateList(country_id).subscribe((r) => {

      this.State = r;
    });
  }
  isShowLoader: boolean = false;

  onOptionsSelectedState(e) {

    var stateId = e.target.value;
    this.getCityList(stateId);
  }
  validateForm() {

    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";


    if (this.backendUserModel.roleIntID == 0)
      validationErrors.push("Role");

    if (this.backendUserModel.stateId == 0)
      validationErrors.push("State");

    if (this.selectedRoleId != 1) {
      if (this.backendUserModel.cityId == 0)
        validationErrors.push("District");
    }
    if (this.backendUserModel.firstName == "")
      validationErrors.push("First Name");


    if (this.backendUserModel.lastName == "")
      validationErrors.push("Last Name");

    if (this.backendUserModel.email == "")
      validationErrors.push("Email");

    if (this.backendUserModel.phone == "")
      validationErrors.push("Phone");

    if (this.backendUserModel.password == "")
      validationErrors.push("Password");

    if (this.backendUserModel.confirmPassword == "")
      validationErrors.push("Confirm Password");

    if (this.backendUserModel.confirmPassword != this.backendUserModel.password)
      validationErrors.push("Password and Confirm Password Not Matched");


    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }


  registerUser():any {
    if (!this.validateForm()) {
      return false;
    }
    else {
      this.backendUserModel.isActive = true;
      this.isShowLoader = true;
      this.AddEditBackendUserService.addUser(this.backendUserModel)
        .subscribe((addedRow: any) => {

          let message = addedRow[0].message;

          toastr.success(message, "Success");
          $("#add-mode-modal").modal('hide');
          this.isShowLoader = false;
          this.getBackendUsers()
        },
          error => {
            this.isShowLoader = false;
            toastr.error('Failed to create User!', "Error");
          });

    }
  }

  backendUsers: Array<BackEndUser> = new Array<BackEndUser>();
  getBackendUsers() {

    this.isShowLoader = true;
    this.AddEditBackendUserService.getBackendUsers(this.loggedInUserId, this.loggedInUserRoleGuid, this.selectedRoleId, this.isShowActiveOnly, this.page)
      .subscribe((backendUsers: Array<BackEndUser>) => {
        this.searchFlag = 1;
        this.tbldata = backendUsers;
        this.isShowLoader = false;
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }

      },
        error => {
          console.log(error);
        });
  }

  Search(){
    this.page=1;
    this.searchBackendUsers();
  }

  
  searchBackendUsers() {

    this.isShowLoader = true;
    if (this.searchControl.value== "" || this.searchControl.value== null) {
      this.getBackendUsers();
    } else {
      this.AddEditBackendUserService.searchBackendUsers(this.loggedInUserId, this.loggedInUserRoleGuid, this.selectedRoleId, this.isShowActiveOnly, this.page, this.searchControl.value)
        .subscribe((backendUsers: Array<BackEndUser>) => {
          this.searchFlag = 2;
          this.tbldata = backendUsers;
          this.isShowLoader = false;
          if (this.tbldata[0].totalCount != 0) {
            this.tbldataLength = this.tbldata[0].totalCount;
          }
        },
          error => {
            console.log(error);
          });
    }
  }



  onchange(event: any) {


    // Do something with the page change event
  }


  onChangePage(pageNumber: any): void {
    this.page = pageNumber.pageIndex;
    if (this.searchFlag == 1) {
      this.getBackendUsers();
    }
    else {
      this.searchBackendUsers();
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
    this.getBackendUsers();
  }
  onActiveInActive(e) {

    var isActive = !e.isActive;
    var userIntId = e.userIntId;
    var userId = e.id;
    this.AddEditBackendUserService.updateUserStatus(userIntId, userId, isActive)
      .subscribe((addedRow: any) => {

        let message = addedRow[0].message;
        toastr.success(message, "Success");
        this.isShowLoader = false;
        this.getBackendUsers();
      },
        error => {
          this.isShowLoader = false;
          toastr.error('Failed to Update User!', "Error");
        });
  }


  onUserDelete(backEndUser: BackEndUser) {
    backEndUser.isActive = !backEndUser.isActive;
  }

  isShowActiveOnly: boolean = true;
  onShowActiveOnly() {
    this.isShowActiveOnly = !this.isShowActiveOnly;

    this.getBackendUsers();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    //this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  page = 1;

  // onChangePage(pageNumber: any): void {
  //   this.page = pageNumber.pageIndex;
  //   this.getBackendUsers();
  // }

  exportAsXLSX(): void {

    this.isShowLoader = true;

    const exportda = this.tbldata.map(o => {
      return {
        FirstName: o.firstName,
        LastName: o.lastName,
        Email: o.email,
        Role: o.role,
        Phone: o.phone,
        TotalNotice: o.totalNotice,
        Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Users');
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

