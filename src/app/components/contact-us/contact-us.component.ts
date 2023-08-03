import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ContactUsModel } from 'src/app/models/contact-us.model';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { SharedModelService } from 'src/app/services';
import { Router } from '@angular/router';

declare var toastr;
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactUsForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService,
    public sharedModel: SharedModelService,
    public router:Router) { }

  ngOnInit() {
  
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      this.contactUsForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
        email: ['', [Validators.required, Validators.email]],
        phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),]),
        contactMeType: ['', Validators.required],
        subject: ['', Validators.required],
        message: ['', Validators.required],
      });
  
      this.formControlValueChanged();
    }
    else{

      this.router.navigate(["./login"]);
    }

  }

  formControlValueChanged() {
    const phone = this.contactUsForm.get('phone');
    const email = this.contactUsForm.get('email');
    this.contactUsForm.get('contactMeType').valueChanges.subscribe(
      (mode: string) => {
        if (mode === 'phone') {
          phone.setValidators([Validators.required]);
          email.clearValidators();
        }
        else if (mode === 'email') {
          phone.clearValidators();
          email.setValidators([Validators.required]);
        }
        phone.updateValueAndValidity();
        email.updateValueAndValidity();
      });
  }
  contactmeby:string;
  onContactClick(e){
   
    this.contactmeby=e;

  }

  validateForm(contactUsForm: FormGroup) {
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please enter ";
    if (this.contactUsForm.controls.name.hasError("required")) {
      validationErrors.push("Name");
      isValid = false;
    }
    if(this.contactmeby=="phone"){
    if (this.contactUsForm.controls.phone.hasError("required")) {
      validationErrors.push("Phone");
      isValid = false;
    }
  }
    if(this.contactmeby=="email"){
    if (this.contactUsForm.controls.email.hasError("required")) {
      validationErrors.push("Email");
      isValid = false;
    }
  }
    if (this.contactUsForm.controls.subject.hasError("required")) {
      validationErrors.push("Subject");
      isValid = false;
    }
    if (this.contactUsForm.controls.message.hasError("required")) {
      validationErrors.push("Message");
      isValid = false;
    }

    if (this.contactUsForm.controls.phone.hasError("minlength") || this.contactUsForm.controls.phone.hasError("maxlength")) {
      toastr.error("Invalid Phone number.", "Error");
      isValid = false;
    }
    if (this.contactUsForm.controls.email.hasError("email")) {
      toastr.error("Invalid email address.", "Error");
      isValid = false;
    }

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }

  onSubmit():any {
    let isValid: boolean = this.validateForm(this.contactUsForm);
    if (isValid == false)
      return false;

    this.contactUsModel = this.contactUsForm.value;
    this.onSendMessage();
  }

  isShowLoader: boolean = false;
  contactUsModel: ContactUsModel = new ContactUsModel();
  onSendMessage() {
    this.isShowLoader = true;
    this.contactUsModel.contactBy = this.getContactById();
    let loggedInUserString:any = localStorage.getItem("LoggedInUser");
    loggedInUserString=JSON.parse(loggedInUserString);
    if(loggedInUserString)
      this.contactUsModel.userId=loggedInUserString.userId;

    this.adminService.sendMailToAdmin(this.contactUsModel)
      .subscribe(isMailSent => {
        this.contactUsForm.reset();
        this.contactUsForm.controls['contactMeType'].setValue("email");
        this.isShowLoader = false;
        toastr.success('Mail sent successfully!', "Success");
      },
        error => {
          this.isShowLoader = false;
          toastr.error('Failed to Send Mail.', "Error");
        });
  }

  getContactById() {
    switch (this.contactUsModel.contactMeType) {
      case "email":
        return 1;
      case "phone":
        return 2;
      default:
        return 1;
    }
  }

}
