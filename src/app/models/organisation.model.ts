export class OrganisationUser {
    userId: string;
    organisationId: string;
    branch : string;
    firstName: string;
    lastName: string;
    phone: string;
    username: string;
    email: string;
    role: string;
    totalNotice: number;
    isActive: boolean;
    isDeleted: boolean;
}


export class OrganisationInfo {
    userList: Array<OrganisationUser> = new Array<OrganisationUser>();
    userCount: number = 0;
}