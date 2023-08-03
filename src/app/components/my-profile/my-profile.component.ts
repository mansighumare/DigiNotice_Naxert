import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfileInfo } from 'src/app/models';
import { ChangePasswordModel } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService, SharedModelService, AppConfig, MasterDataService } from 'src/app/services';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileImage } from 'src/app/models/profile-info';

declare var toastr;
declare var $;
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  f: FormGroup;
  restPasswordForm: FormGroup;
  profileImageUrl: any;
  Country: any = [];
  size = 1024 * 1024;
  isShowDownloadLink = false;
  constructor(public accountService: AccountService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public sharedModel: SharedModelService,
    private masterDataService: MasterDataService,
    public router: Router,
    public appConfig: AppConfig,
  ) { }
  isActive: boolean = true
  isShowLoader: boolean = false;
  profileInfo: ProfileInfo = new ProfileInfo();
  editProfileEnabled: boolean = false;
  isProfileEdited: boolean = false;
  country_id: number;
  State: any[];
  City: any[];
  Taluka: any[];
  Village: any[];
  loggedInUserRole:string;
  loggedInUserOrgId:any;
  loggedInUserRoleGuid:string;
  loggedInUserBranchId:any;
  loggedInUserBranchName:string;
  loggedInUserOrgName:string;


  prefixOptions = [
    { label: 'Mr.', name: 'Mr.' },
    { label: 'Mrs.', name: 'Mrs.' },
    { label: 'Ms.', name: 'Ms.' },
    { label: 'Adv.', name: 'Adv.' },
    { label: 'Other', name: 'Other' },
  ];

  loggedInUserId: string;
  ngOnInit() {
   

    $(document).ready(() => {
      this._initDropZone();
    });


    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));

    if (loggedInUserString != null) {
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;
      this.loggedInUserBranchName = loggedInUserString.branchName;
      this.loggedInUserOrgName = loggedInUserString.orgName;


      this.getUserProfile();
      this.getStateList();
    }
    else {
      this.router.navigate(["./login"]);
    }
  }
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
      }
    });
    function readURL(input) {

      for (var i = 0; i < input.files.length; i++) {
        if (input.files && input.files[i]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            _self.displayImages(e.target["result"]);
          }
          reader.readAsDataURL(input.files[i]);
        }
      }
    }

    $("#imgInp").change(function () {
      readURL(this);
    });
  }
  image: ProfileImage = new ProfileImage();
  displayImages(files: any) {
    this.image.fileName = files;
    this.image.originalFileName = files.originalFileName;
    this.image.name = files.name;
    this.image.isDeleted = false;
    this.image.isAdded = true;
  }
  profileImage: string;
  getFileDetails(e) {
   
    for (var i = 0; i < e.target.files.length; i++) {
      this.profileImage = e.target.files[i];
    }
    this.uploadProfileImage(this.profileImage);
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (restPasswordForm: FormGroup) => {
      const control = restPasswordForm.controls.newPassword;
      const matchingControl = restPasswordForm.controls.confirmPassword;

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }






  // isUserProfileValid(profileInfo: ProfileInfo) {
  //   let isValid: boolean = true;
  //   if (profileInfo.firstName.trim() == "") {
  //     toastr.error("First Name is required.", "Error");
  //     isValid = false;
  //   }

  //   if (profileInfo.phone.length < 10 || profileInfo.phone.length > 10) {
  //     toastr.error("Please enter valid phone number.", "Error");
  //     isValid = false;
  //   }

  //   if (profileInfo.lastName.trim() == "") {
  //     toastr.error("Last Name is required.", "Error");
  //     isValid = false;
  //   }
  //   if (profileInfo.phone.trim() == "") {
  //     toastr.error("Phone Number is required.", "Error");
  //     isValid = false;
  //   }
  //   return isValid;
  // }


  validateForm() {
    

    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";

    if (this.profileInfo.prefix == "" || this.profileInfo.prefix ==undefined)
      validationErrors.push("prefix");

    if (this.profileInfo.firstName == "")
      validationErrors.push("First Name");

    if (this.profileInfo.lastName == "")
      validationErrors.push("Last Name");

    if (this.profileInfo.email == "")
      validationErrors.push("Email");

    if (this.profileInfo.phone == "")
      validationErrors.push("Phone");

    if (this.profileInfo.stateId == undefined)
      validationErrors.push("State");

    if (this.profileInfo.cityId == undefined)
      validationErrors.push("City");

    if (this.profileInfo.pinCode == "")
      validationErrors.push("Zip Code");

    if (this.profileInfo.address == "")
      validationErrors.push("Address");

    if (this.profileInfo.occupation == "")
      validationErrors.push("Occupation");



    if (validationErrors.length > 0) {

      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }
  onUpdateProfile():any {
    if (!this.validateForm())
      return false;

    this.isShowLoader = true;
    this.profileInfo.userId = this.loggedInUserId;
    this.accountService.updateUserProfile(this.profileInfo)
      .subscribe((isUpdated: boolean) => {
        if (isUpdated) {
          this.authService.loggedInUser.firstName = this.profileInfo.firstName;
          this.authService.loggedInUser.lastName = this.profileInfo.lastName;
          this.authService.setLoggedInUserInLocalStorage();
          this.changeDetectorRef.detectChanges();
          toastr.success("Profile Updated Successfully.", "Success");
        }
        else
          toastr.error("Faied To Update Profile.", "Error");
        this.isShowLoader = false;
        this.isProfileEdited = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }

  uploadProfileImage(profileImage: any) {
   
    if (profileImage.size > 2000000) {//5mb //50kb
      toastr.error("Maximum Upload Size 1 MB", "Error");
    } else {
     
      this.isShowLoader = true;
      this.profileInfo.userId = this.loggedInUserId;
      this.accountService.uploadProfileImage(profileImage, this.profileInfo.userId)
        .subscribe((uploadedImage: ProfileImage) => {
         
          this.profileInfo.profileImage = uploadedImage;
          this.accountService.profileImageUrl = this.appConfig.profileImgPath + this.profileInfo.profileImage[0].originalFileName;
          this.isShowLoader = false;
          this.isProfileEdited = false;
        },
          error => {
            this.isShowLoader = false;
          });
    }
  }

  getUserProfile() {
   
    this.isShowLoader = true;
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);

    let userId: string = "0";
    if (loggedInUserString)
      userId = loggedInUserString.userId;

    this.accountService.getUserProfile(userId)
      .subscribe((profileInfo: any) => {
       
        this.getCityList(profileInfo.stateId);
        // this.profileInfo = profileInfo;
        this.profileInfo.prefix = profileInfo.prefix;
        this.profileInfo.firstName = profileInfo.firstName;
        this.profileInfo.lastName = profileInfo.lastName;
        this.profileInfo.email = profileInfo.email;
        this.profileInfo.phone = profileInfo.phone;
        this.profileInfo.stateId = profileInfo.stateId;
        this.profileInfo.cityId = profileInfo.cityId;
        this.profileInfo.pinCode = profileInfo.pinCode;
        this.profileInfo.occupation = profileInfo.occupation;
        this.profileInfo.address = profileInfo.address;
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }

  onEditProfileCancel() {
    this.editProfileEnabled = false;
  }

  onEditProfile() {
    this.editProfileEnabled = true;
  }

  isChangePasswordFormValid() {

    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";


    if (this.changePasswordModel.oldPassword == undefined)
      validationErrors.push("old Password");

    if (this.changePasswordModel.newPassword == undefined)
      validationErrors.push("New Password");

    if (this.changePasswordModel.confirmPassword == undefined)
      validationErrors.push("Confirm Password");

    if (this.changePasswordModel.newPassword != this.changePasswordModel.confirmPassword)
      validationErrors.push("New Password and confirm password does not match.");


    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }

  changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
  onChangePasswordSubmit():any {
    let isValid: boolean = this.isChangePasswordFormValid();
    if (isValid == false)
      return false;
      
    this.isShowLoader = true;
    // this.changePasswordModel = this.restPasswordForm.value;
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.changePasswordModel.userId = loggedInUserString.userId;
    this.accountService.changePassword(this.changePasswordModel)
      .subscribe((response: any) => {
        this.isShowLoader = false;
        if (response.isSuccess)
          toastr.success("Password Changed Successfully!", "Success");
        else
          toastr.warning(response.errorMessage, "Warning");
      }, error => {
        this.isShowLoader = false;
      });

  }


  getStateList() {

    this.country_id = 1;
    this.masterDataService.getStateList(this.country_id).subscribe((r) => {

      this.State = r.filter(state => state.isActive === true);
    });
  }

  onOptionsSelectedState(e) {

    var stateId = e.target.value;
    this.getCityList(stateId);
  }

  getCityList(stateId) {

    this.masterDataService.getCityList(stateId, this.isActive).subscribe(
      (r) => {

        this.City = r.filter(city => city.isActive === true);;
      }
    );
  }

  // onOptionsSelectedCity(e) {

  //   var talukaId = e.target.value;
  //   this.getTalukaList(talukaId);
  // }

  // getTalukaList(talukaId) {

  //   this.masterDataService.getTalukaList(talukaId).subscribe(
  //     (r) => {

  //       this.Taluka = r.filter(taluka => taluka.isActive === true);;
  //     }
  //   );
  // }

  // onOptionsSelectedTaluka(e) {

  //   var villageId = e.target.value;
  //   this.getVillageList(villageId);
  // }

  // getVillageList(villageId) {

  //   var isActive = true;
  //   this.masterDataService.getVillageList(villageId, isActive).subscribe(
  //     (r) => {

  //       this.Village = r.filter(village => village.isActive === true);;
  //     }
  //   );
  // }


}