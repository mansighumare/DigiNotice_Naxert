export class PerformanceReportModel {
    userId: string = "";
    firstName: string;
    lastName: string;
    userName: string;
    roleName: string;
    totalNotice: number = 0;
}

export class UserNoticeCount {
    userId: string = "";
    totalNotice: number = 0;
}

export class UserLookupDto {
    userIntId: any = "";
    parentUserId: string = "NA";
    firstName: string = "NA";
    lastName: string = "NA";
    phone: string = "NA";
    username: string = "NA";
    email: string = "NA";
    role: string = "NA";
    totalNotice: number;
    isActive: boolean;
    isDeleted: boolean;
    userName:string;
}

export class SearchReportModel {
    userId: Number =0;
    paperId: Number =0;
    cityId: Number = 0;
    startDate: Date;// = "";
    endDate: Date;// = "";
    landCategoryId: Number =0;
}