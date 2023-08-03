import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,Validators, FormBuilder } from '@angular/forms';

import { LoginModel } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services';
import * as $ from 'jquery'
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginModel: LoginModel;
  public innerWidth: any;
  isShowDownloadLink: boolean = false;
  loginForm: FormGroup;
  otpForm:FormGroup;
  formToggle: string = "SendOTP";
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthenticationService,
    private router: Router,
    private toastr:ToastrService) {

    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= 933)
      this.isShowDownloadLink = false
    else this.isShowDownloadLink = true
  }

  ngOnInit() {
    this.loginModel = new LoginModel();

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.otpForm = this.formBuilder.group({
      email: ['', [Validators.required]]
    });


    setTimeout(() => { localStorage.removeItem("SessionOTP") }, 600);


    $("body").addClass('login');
    $("body").removeClass('backstretch');
  }

  ngOnDestroy() {
    $("body").removeClass('login');
  }

  goToSignUp() {
    this.router.navigate(['./signup']);
  }
  
  goToOtpLogin() {
    this.router.navigate(['./otpLogin']);
  }

  validateForm(loginForm: FormGroup) {
    if (loginForm.controls.password.hasError("required"))
      this.toastr.error("Password is Required.", "Error");
    if (loginForm.controls.email.hasError("required"))
      this.toastr.error("Username is Required.", "Error");
    if (loginForm.controls.email.hasError("email"))
      this.toastr.error("Invalid Email Address.", "Error");
  }

  isShowLoader: boolean = false;
  onSubmit() {
    debugger;
    if (this.loginForm.status == 'VALID') {
      this.loginModel.grant_type = "password";
      this.loginModel.email = this.loginForm.controls.email.value;
      this.loginModel.password = this.loginForm.controls.password.value;
      this.loginAccount(this.loginModel);
    } else {
      this.validateForm(this.loginForm);
    }
  }
  sendOtp() {
    
    this.isShowLoader = true;
    this.accountService.sendOtp(this.loginModel).subscribe((res: any) => {
      
      if (res != "not valid user") {
        localStorage.setItem("SessionOTP", res);
        this.isShowLoader = false;
        this.formToggle = "VerifyOTP";
        this.toastr.warning('OTP Sent to Your Registered Number & Email Successfully!', "Success");
      }
      else if (res == "not valid user") {
        this.isShowLoader = false;
        this.toastr.warning('User is Not Registered. Please Sign Up!', "Warning");
      }
    },
    error => {
      this.isShowLoader = false;
      this.toastr.error("Something went wrong.. please try again", "Error");
      //this.loginerrormsg = true; 
    });
  }
  verifyOtp() {
    this.isShowLoader = true;
    if (localStorage.getItem("SessionOTP") != null) {
      this.loginModel.EncryptedOTP = localStorage.getItem("SessionOTP");
      this.accountService.verifyOtp(this.loginModel).subscribe((res: any) => {
        if (res == "Valid") {
          this.isShowLoader = false;
          this.toastr.success('OTP Verified. Wait For Login!', "Success");
          this.loginModel.password = "OTP";
          this.loginAccount(this.loginModel);
        } else if (res == "Invalid") {
          this.isShowLoader = false;
          this.toastr.warning('OTP is Invalid. Please Insert Correct OTP!', "Warning");
        }
      },
      error => {
        this.isShowLoader = false;
        this.toastr.error("Something went wrong.. please try again", "Error");
        //this.loginerrormsg = true; 
      });
    }
    else {
      this.isShowLoader = false;
      this.toastr.warning('Your Session is Expired!', "Warning");
    }
  }

  onResetOTP() {
    this.sendOtp();
  }

  loginAccount(loginModel: LoginModel) {
    
    var $loginCard = $('#login-container');
    $loginCard.addClass('loader');
    this.isShowLoader = true;

    this.authService.login(loginModel.email.trim(), loginModel.password, location.origin)
        .subscribe((data:any) => {
            if (data) {
              debugger;
              this.authService.onLogIn(data);
            }            
          },
          error => {
            this.isShowLoader = false;
            // var _body = JSON.parse(error._body);
             $loginCard.removeClass('loader');
            // if (_body.error)
            this.toastr.error("The User Name or Password is Incorrect", "Error");
            //this.loginerrormsg = true; 
          }
        );
  }

  onForgotPassword() {
    this.router.navigate(['./forgot-password']);
  }
}