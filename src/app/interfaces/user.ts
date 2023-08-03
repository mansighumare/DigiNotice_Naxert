export interface ICurrentUser {
    name: string;
    userIntId: number;
    firstName: string;
    lastName: string;
    email: string;
    Phone: string;
    AccessToken: string;
    RefreshToken: string;
    Roles: string[];
    role:string;
    RoleID: number;
    ProfilePicture:any;
    userId:string;   
    role_guid:string;
    is_system_defined:boolean;
    isActive:boolean;
    isDeleted:boolean;
    designation:string;
    address:string;
    companyname:string;
    org_id:string;
    branch_id:string;
    branchName:string;
    branchDisplayName:string;
    orgName:string;
    orgDisplayName:string;
    logoURL:string;
}

export class CurrentUser {
    UserName: string;
    UserID: any;
    UserGuid: any;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    AccessToken: string;
    RefreshToken: string;
    Roles: string[];
    DealerId: number;
    OrgId: number;
    BranchId:string;
}
export class Roles {
    RoleId: number;
    AppRoleId: number;
    RoleName: string;
}

export interface SelectItem {
    label: string;
    value: any;
}

export interface CookieOptionsArgs {
    path?: string;
    domain?: string;
    expires?: string | Date;
    secure?: boolean;
    httpOnly?:boolean;
  }