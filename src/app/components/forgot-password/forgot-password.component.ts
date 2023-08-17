import { Component, OnInit,Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { LoggedInUser, ForgotPasswordModel } from 'src/app/models/account.model';
import { BlankLayoutComponent } from '../common/layouts/blankLayout.component';
import { ToastrService } from 'ngx-toastr';

declare var $;
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public innerWidth: any;
  isShowDownloadLink :boolean =false;
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private renderer: Renderer2,
    public toastr: ToastrService
  ) { 
    this.innerWidth = window.innerWidth;  
    if(this.innerWidth >= 933)
       this.isShowDownloadLink =false
    else this.isShowDownloadLink =true }

  public forgotPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.renderer.setStyle(document.body, 'background-color', '#000000');
    $("body").removeClass('backstretch');
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid)
      this.getResetPasswordLink();
    else
      this.toastr.error("Please enter valid email", "Error");
  }

  isShowLoader: boolean = false;
  disableGetResetLink: boolean = false;
  getResetPasswordLink() {
    
    this.isShowLoader = true;
    let forgotPasswordModel: ForgotPasswordModel = new ForgotPasswordModel();
    forgotPasswordModel.email = this.forgotPasswordForm.value.email;

    this.accountService.forgotPassword(forgotPasswordModel)
      .subscribe((forgotPasswordResponse: ForgotPasswordModel) => {
        this.isShowLoader = false;
        if (forgotPasswordResponse.isSuccess) {
          this.disableGetResetLink = true;
          this.toastr.success("Reset password link has emailed to your email address", "Success");
        }
        else
          this.toastr.error("Failed to Send Reset password link", "Error");
      }, error => {
        this.isShowLoader = false;
        this.toastr.error("Failed to Send Reset password link", "Error");
      });
  }

}
