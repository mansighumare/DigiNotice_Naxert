import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { AppConfig } from 'src/app/services/config.service';
import { LoginModel, ChangePasswordModel, LoggedInUser, ForgotPasswordModel, ResetPasswordModel } from 'src/app/models/account.model';
import { ProfileInfo } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';

declare var $;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public apiUrl: string;
  public authUrl: string;
  public profileImageUrl: string = "assets/images/bg/profileImageIcon.png";

  constructor(
    private authService: AuthenticationService,
    private appConfig: AppConfig,
    private http: HttpClient,
    public toastr: ToastrService) {
    this.apiUrl = this.appConfig.apiUrl;
    this.authUrl = this.appConfig.authUrl;
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    if (loggedInUserString)
      this.getUserProfileImage(loggedInUserString.userId);
    else
      this.getUserProfileImage('0');
  }

  getUserProfile(userId: string) {
    var url = this.appConfig.getApiPath("Account", "GetUserProfile", [userId]);
    return this.http.get(url);
  }

  isShowLoader: boolean = false;
  getUserProfileImage(userId: string) {
   
   
    this.profileImageUrl= "assets/images/bg/profileImageIcon.png";
    this.isShowLoader = true;
    var url = this.appConfig.getApiPath("Account", "GetProfileImage", [userId]);
    this.http.get(url).subscribe((profileImageName: string) => {
     
      if (profileImageName != undefined) {
    
        this.profileImageUrl =profileImageName;
        this.isShowLoader = false;
      }

    });
  }

  updateUserProfile(profileInfo: ProfileInfo) {
    var url = this.appConfig.getApiPath("Account", "UpdateProfile");
    return this.http.post(url, profileInfo);
  }

  activeInActiveUser(userInfo: any) {
    var url = this.appConfig.getApiPath("Account", "UpdateUser");
    return this.http.put(url, userInfo);
  }

  uploadNoticeImgUrl: string = this.appConfig.getImageUploadUrl("profile");
  uploadProfileImage(profileImage: string, userId: string) {
   

    const formData = new FormData();
    formData.append('image', profileImage);

    var url = this.uploadNoticeImgUrl + '/' + userId;
    return this.http.post(url, formData);

  }

  loginAccount(loginModel: LoginModel) {
    var url = this.authUrl + 'TOKEN';
    $.ajax({
      type: "POST",
      url: url,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: $.param({ grant_type: 'password', username: loginModel.email, password: loginModel.password}),
    }).done((token) => {
      this.authService.onLogIn(token);
      this.authService.getLoggedInUser()
        .subscribe((loggedInUser: LoggedInUser) => {
          this.authService.setLoggedInUser(loggedInUser);
        },
          error => {
            console.error(error);
          });
    }).fail((jqXHR, textStatus, errorThrown) => {
      this.toastr.error(textStatus, "Error");
    });
  }

  changePassword(changePasswordModel: ChangePasswordModel) {
    var url = this.apiUrl + 'Account/ChangePassword';
    return this.http.post(url, changePasswordModel);
  }

  forgotPassword(forgotPasswordModel: ForgotPasswordModel) {

    var url = this.apiUrl + 'Account/ForgotPassword';
    return this.http.post(url, forgotPasswordModel);
  }

  resetPassword(resetPasswordModel: ResetPasswordModel) {
    var url = this.apiUrl + 'Account/ResetPassword';
    return this.http.post(url, resetPasswordModel);
  }

  sendOtp(loginModel: LoginModel) {
    var url = this.apiUrl + 'Account/SendOtp';
    return this.http.post(url, loginModel);
  }

  verifyOtp(loginModel: LoginModel) {
    var url = this.apiUrl + 'Account/VerifyOtp';
    return this.http.post(url, loginModel);
  }
}
