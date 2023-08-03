export declare type SortType = 'asc' | 'desc';
export enum SortEnum {
    ASC = 'asc',
    DESC = 'desc'
}

export class TableColumn {
    name: string;
    displayName: string;
    hidden: boolean = false;
    type: string = 'string';
    sortType: SortType = 'asc';
    noedit:boolean = false;
}



export class NoticeType {
    id:number;
    name: string;
    displayName: string;
    isBanking:any="1";
    isActive:boolean=true;
    sortOrder:number;
}

export class AddOrganisationModel{
    OrganisationName:string="";
    OrganisationDisplayName:string="";
    OrganisationId:any=0;
    CountryId:number=1;
    isItParentBranch2:any;
    isItParentBranch1:any;
    StateId:number=0;
    TalukaId:number=0;
    CityId:number=0;
    VillageId:number=0;
    OrganisationAddress:string="";
    isActive:boolean = false;
    OrgId:any=0;
    ParentBranch:any="1";
    BranchName:string;
    BranchDisplayName:string;
    BranchId:any;
    BranchAddress:string="";
    ParentBranchId:number=0;
    fileName:any;
    originalFileName:any;
    imageTypeId:number;

}

export class TableConfig {
    columns: Array<TableColumn>;
    editPopupTitle: string = "Edit Row";
    addPopupTitle: string = "Add Row";
    pagination: boolean = true;
    sortable: boolean = true;
    localSorting: boolean = false;
    pageInfo: PageInfo = { pageSize: 10, currentPage: 1, totalItems: 0 };
    pager: any;
    sortInfo: SortInfo;
    useDefaultPopup: boolean = true;//Set to false when wish to use custom popups
    addRowButtonText: string = "Add Row";
    serviceName: string;
    serviceUrl: ServiceUrl;
}

export class ServiceUrl {
    get: string;
    add: string;
    update: string;
    delete: string;
}

export class SortInfo {
    columns: Array<TableColumn>;
    sortedColumn: TableColumn;
}

export class PageInfo {
    pageSize: number = 10;
    currentPage: number = 1;
    totalItems: number = 0;
};


