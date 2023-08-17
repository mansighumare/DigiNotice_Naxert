import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { BackendUserModel, LoginModel } from 'src/app/models/account.model';
import { AuthenticationService } from 'src/app/services';
import { BackendUserService } from 'src/app/services/backend-user.service';
import { ToastrService } from 'ngx-toastr';
declare var $;

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  constructor(
    private router: Router,
    private AddEditBackendUserService: BackendUserService,
    public toastr: ToastrService
  ) { }
  backendUserModel: BackendUserModel = new BackendUserModel();
  loggedInUserRole: any;
  loggedInUserId: any;
  loggedInUserRoleGuid: any;
  registerUserRole: string = "";
  UserRoles: any=[];
  City:any=[];
  selectedRoleId: any
  ngOnInit() {
    
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {
      
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.getRoles();
      this.getCity();
      
    }
    else {

      this.router.navigate(["./login"]);
    }
  }
  getRoles() {
    
    this.AddEditBackendUserService.getRoles(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserRole).subscribe(r => {
      
      this.UserRoles = r;
    });

  }

  getCity() {
    
    var stateId=72;
    this.AddEditBackendUserService.getCity(stateId).subscribe(r => {
      
      this.City = r;
    });

  }



  onOptionsSelected(e) {
    
    this.selectedRoleId = e.target.value;
  }


  
  isShowLoader: boolean = false;

  validateForm() {
    
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";

  
      if (this.backendUserModel.roleIntID == undefined)
        validationErrors.push("Role");
if(this.selectedRoleId!=1){
      if (this.backendUserModel.cityId == undefined)
        validationErrors.push("City");
}
      if (this.backendUserModel.firstName == undefined)
        validationErrors.push("First Name");
   

      if (this.backendUserModel.lastName == undefined)
        validationErrors.push("Last Name");

      if (this.backendUserModel.email == undefined)
        validationErrors.push("Email");

      if (this.backendUserModel.phone == undefined)
        validationErrors.push("Phone");
   
    if (this.backendUserModel.password == undefined)
      validationErrors.push("Password");

    if (this.backendUserModel.confirmPassword == undefined)
      validationErrors.push("Confirm Password");

    if (this.backendUserModel.confirmPassword != this.backendUserModel.password)
      validationErrors.push("Password and Confirm Password Not Matched");

    
    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      this.toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }


  registerUser():any {   

    if (!this.validateForm()) {
      return false;
    }
    else{
    this.isShowLoader = true;
      this.isShowLoader = true;
      this.AddEditBackendUserService.addUser(this.backendUserModel)
        .subscribe((addedRow: any) => {
          
          let message = addedRow[0].message;

          this.toastr.success(message, "Success");
          this.isShowLoader = false;
        

        },
          error => {
            this.isShowLoader = false;
            this.toastr.error('Failed to create User!', "Error");
          });

  }
}

}

