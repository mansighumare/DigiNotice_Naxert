// export class PropertyInfoModel {
//     propertyName: string;
//     ownerFullName: string;
//     // ownerFname: string;
//     // ownerMname: string;
//     // ownerLname: string;
//     advocateName: string;
//     landMark: string;//landMark - loacality
//     landCategoryId: LandCategoryEnum = LandCategoryEnum.AgriculturalLand;
//     landCategoryName: string;
//     surveyNumber: string;
//     gatNumber: string;
//     ctsnumber: string;
//     otherInformation: string;
//     noticeDate: string;
//     noticePlace: string;
//     paperName: string;
//     assetImages: Array<PropertyImg> = new Array<PropertyImg>();
//     enablePreview: boolean = false;
//     otherDetails: string;
//     note: string;

//     propertyIndex: number;
// }

export class EditOrgPropertyModel {
    id: string;
    constructedPropertyArea:string;
    landCategoryId: string ;
    landCategoryName: string;
    surveyNumber: string;
    fullSurveyNumber: string;
    gatNumber: string;
    fullGatNumber: string;
    plotNumber: string;
    fullPlotNumber: string;
    ctsnumber: string;
    fullCtsnumber: string;
    buildingName: string; 
    landMark: string;
    flatNo: string = "";
    floorNo: string = "";
    area: string;
    unitTypeId: string;
    unitTypeName: string;
    ownerFullName: string;
    isActive: string;
    stateName: string;
    cityName: string;
    talukaName: string;
    villageName: string;
    countryId: number =1;
    stateId: number;
    cityId: number;
    talukaId: number;
    villageId: number;
    createdBy: string;
    createdDate: string;
    isDeleted: string;
    otherDetails: string;
    note: string;
    assetImages: Array<AssetImage> = [];
    googleMapLink:string;
    propertyIndex: number;
    propertyTypeId: string = "1";
    sectorNo:string="";
    projectName:string="";
    finalPlotNo: string = "";
    subPlotNo: string = "";
    privatePlotNo: string = "";
    catestrialSurveyNo: string = "";
    houseNo:string="";
    tenementNo:string="";
    factoryShedNo:string="";
    industrialBuilding:string="";
    grampanchayatNo:string="";
    malmattaNo:string="";
    corporationRegistrationNo:string="";
    propertyCardNo:string="";
    phaseNo:string = "";
    buildingNo:string = "";
    flatShopNo:string = "";
    glrNo:string="";
    nagarPanchyatMilkatNo:string="";
    complaintNoReportNo:string="";
    commencementCertificateNo:string = "";
    completionCertificateNo:string = "";
    shareCertificateNo:string = "";
    propertyNo:string = "";   
    branchName:string="";
    name:string="";
}

export class AssetImage {
    fileName: string;
    id: number;
    noticeId: string;
    assetId: string;
    name: string;
    imageTypeId: number=2;
    originalFileName: string;
    imageUrl: string;
    isAdded: boolean;
    isDeleted: boolean;
}

export class PropertyImg {
    id: number = 0;
    name: string = "";
    imageUrl: string;
}

export class AddOrgPropertyModel {
    id: number;
    orgId:number;
    branchId:number;
    role_id:string;
    landCategoryId: string = "1";// LandCategoryEnum = LandCategoryEnum.AgriculturalLand;
    ownerFullName: string = "";
    countryId: number = 1;
    stateId: number =72;
    cityId: number=0;
    villageId: number=0;
    landMark: string = "";
    surveyNumber: string = "";
    fullSurveyNumber: string = "";
    gatNumber: string = "";
    sectorNo:string="";
    projectName:string="";
    finalPlotNo: string = "";
    propertyArea: string = "";
    subPlotNo: string = "";
    privatePlotNo: string = "";
    catestrialSurveyNo: string = "";
    houseNo:string="";
    tenementNo:string="";
    factoryShedNo:string="";
    industrialBuilding:string="";
    grampanchayatNo:string="";
    malmattaNo:string="";
    corporationRegistrationNo:string="";
    propertyCardNo:string="";
    phaseNo:string = "";
    buildingNo:string = "";
    flatShopNo:string = "";
    commencementCertificateNo:string = "";
    completionCertificateNo:string = "";
    shareCertificateNo:string = "";
    propertyNo:string = "";    
    fullGatNumber: string = "";
    plotNumber: string = "";
    fullPlotNumber: string = "";
    ctsnumber: string = "";
    fullCtsnumber: string = "";
    buildingName: string = "";
    flatNo: string = "";
    floorNo: string = "";
    constructedPropertyArea:string="";
    area: string = "";
    unitTypeId: string = "4";
    createdBy: string ="";
    talukaId: number=0;
    assetImages: Array<AssetImage> = [];
    otherDetails: string;
    propertyIndex: number;
    propertyTypeId: string = "1";
}

export enum LandCategoryEnum {
    Plots = 3,
    ConstructedProperty = 1,
    AgriculturalLand = 2,
}

export class DocumentsModel
{   
    files_array:any;
    comments:string;
    OrgId:number;
    BranchId:number;
    createdBy: string ="";
    Role_id:string;
    assetId:number;
}


export class PropertyInformationDto{
OwnerName: string;
State: string;
 District : string;
Taluka : string;
Village : string;
Locality: string;
Type  : string;
SurveyNumber : string;
UnitTypeId : string="4";
GatNumber : string;
CtsNumber : string;
PlotNumber : string;
ProjectName : string;
BuildingName : string;
FlatNo : string;
FinalPlotNo : string;
SubPlotNo : string;
PrivatePlotNo : string;
CadastralSurveyNo : string;
SectorNo : string;
CompletionCertificateNo : string;
NagarPanchyatMilkatNo : string;
GlrNo : string;
ComplaintNoReportNo : string;
 FloorNo : string;
ConstructedPropertyArea : string;
HouseNo : string;
TenamentNo : string;
FactoryShedNo : string;
IndustrialBuilding : string;
GrampanchayatNo : string;
MalmattaNo : string;
CorporationRegistrationNo : string;
PropertyCardNo : string;
PhaseNo : string;
BuildingNo : string;
FlatShopNo : string;
CommencementCertificateNo : string;
ShareCertificateNo : string;
PropertyNo : string;
OtherInformation : string;
CreatedBy : string;
RoleId : string;
OrgId : number;
BranchId : number;
}