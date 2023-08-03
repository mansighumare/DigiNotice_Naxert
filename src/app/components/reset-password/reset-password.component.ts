import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordModel } from 'src/app/models/account.model';

declare var $;
declare var toastr;
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private renderer: Renderer2,
    private router: Router,
  ) { }


  public forgotPasswordForm: FormGroup = this.formBuilder.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  resetPasswordModel: ResetPasswordModel = new ResetPasswordModel();
  ngOnInit() {
    this.renderer.setStyle(document.body, 'background-color', '#000000');
    $("body").removeClass('backstretch');

    this.activeRoute.params.subscribe(params => {
      if (params.email)
        this.resetPasswordModel.email = params.email;
      if (params.code)
        this.resetPasswordModel.code = decodeURI(params.code);
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid == false) {
      toastr.error("Please enter password and confirm password.", "Error");
    }

    let isValid: boolean = true;
    if (this.forgotPasswordForm.controls["password"].hasError("required") || this.forgotPasswordForm.controls["confirmPassword"].hasError("required")) {
      toastr.error("Password and confirm password required.", "Error");
      isValid = false;
    }
    if (this.forgotPasswordForm.controls["password"].value != this.forgotPasswordForm.controls["confirmPassword"].value) {
      toastr.error("Password and confirm password does not match.", "Error");
      isValid = false;
    }

    if (isValid)
      this.resetPassword();
  }

  isShowLoader: boolean = false;
  isPasswordReset: boolean = false;
  resetPassword() {
    this.isShowLoader = true;
    this.resetPasswordModel.password = this.forgotPasswordForm.value.password;
    this.resetPasswordModel.confirmPassword = this.forgotPasswordForm.value.confirmPassword;
    this.accountService.resetPassword(this.resetPasswordModel)
      .subscribe((resetPasswordModel: ResetPasswordModel) => {
        this.isShowLoader = false;       
          toastr.success("Your password is reset successfully", "Success");
          this.isPasswordReset = true;
          this.goToLogin();
       
      }, error => {
        console.log(error);
        this.isShowLoader = false;
        toastr.error("Failed to Reset password", "Error");
      });
  }
  
goToLogin() {
  this.router.navigate(['./login']);
}
}
