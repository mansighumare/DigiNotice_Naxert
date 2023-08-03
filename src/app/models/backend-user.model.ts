export class BackEndUser {
    userId: string;
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

export class BackEndUsersInfo {
    userList: Array<BackEndUser> = new Array<BackEndUser>();
    userCount: number = 0;
}