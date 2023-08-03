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

export class EditPropertyModel {
    id: string;
    constructedPropertyArea:string;
    landCategoryId:string;
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
    countryId: string = "1";
    stateId: string;
    cityId: string;
    talukaId: string;
    villageId: string;
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
    nagarPanchyatMilkatNo:string=""
    glrNo:string=""
    complaintNoReportNo:string=""
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
}

export class AssetImage {
    id: number;
    noticeId: string;
    assetId: string;
    name: string;
    imageTypeId: number=2;
    originalFileName: string;
    fileName:string;
    imageUrl: string;
    isAdded: boolean=true;
    isDeleted: boolean=false;
}

export class PropertyImg {
    id: number = 0;
    name: string = "";
    imageUrl: string;
}

export class AddPropertyModel {
    id: number;
    landCategoryId: string = "1";// LandCategoryEnum = LandCategoryEnum.AgriculturalLand;
    ownerFullName: string = "";
    countryId: number = 1;
    stateId: string = "72";
    cityId: string = "";
    villageId: string = "";
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
    nagarPanchyatMilkatNo:string="";
    complaintNoReportNo:string="";
    glrNo :string="";
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
    talukaId: string = "";
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