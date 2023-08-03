export class searchAssetReportModel {
    orgId: number = 0;
    selectedOrgId:number=0;
    branchId: number = 0;
    userId: number;
    roleGuid: number;
    page: number = 1;
    startDate: Date;
    endDate: Date;
    isActive:boolean=true;
  }


  export class ViewAssetReportModel {
    OrgId: number = 0;
    selectedOrgId:number=0;
    BranchId: number = 0;
    userId: number;
    roleGuid: number;
    page: number = 1;
    startDate: Date;
    endDate: Date;
    searchString:string="";
    isActive:boolean=true;
  }
