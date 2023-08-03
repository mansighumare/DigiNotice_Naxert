export class SignUpModel {   
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    companyName: string;
    designation: string;
    address: string = "";
    role: string = "User";
    message: string = "";
    isSuccess: boolean = false;
    errorMessage: string = "";
    stackTrace: string = "";
    parentUserId: string = null;
    cityId:any;
}


export class BackendUserModel {   
    email: string="";
    password: string="";
    confirmPassword: string="";
    firstName: string="";
    lastName: string="";
    phone: string;
    cityId:number=0;
    roleId:string;
    roleIntID:any=0;
    userIntId:number=0;
    isActive:boolean;
    stateId : number=0;
}

export class OrganisationUserModel {   
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    cityId:any;
    roleId:string;
    roleIntID:any;
    OrgId: string ;
    orgIntID:any=0;
    branchId:any;
    branchIntID:any;
    userIntId:number;
    isActive:boolean;
    stateId : any;
    UserStateId : any;
    UserCityId : any;
    
}

export class LoginModel {
    email: string;
    password: string;
    otp: string;
    EncryptedOTP: string;
    grant_type: string = 'token';
}



export class LoggedInUser {
    userId: string;
    name: string;
    email: string;

    firstName: string;
    lastName: string;
    role: string;
}

export class UserRole {
    roleId: number;
    roleName: string;
}


export class ChangePasswordModel {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    userId:string;
}

export class ForgotPasswordModel {
    email: string = "";
    errorMessage: string = "";
    isSuccess: boolean = false;
}

export class ResetPasswordModel {
    email: string = "";
    password: string = "";
    confirmPassword: string = "";
    code: string = "";
    status: boolean = false;
    message: string = "";
}


export class OwnerInfo{
    startDate:Date;
    endDate:Date;
  }