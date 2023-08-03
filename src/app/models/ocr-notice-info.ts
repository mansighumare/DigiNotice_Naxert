import { City } from './model';
export class OcrNoticeAdvocateModel{
          Id : number;
          Fullname :string;
          Address1 :string;
          Address2 :string;
          MobileNo :string;
          PhoneNo :string;
          Email :string;
          PersonTypeId :string;

}
export class OcrNoticeInfoModel {
    ctsNumber:string;
    noticeId: number;
    sectorNo:string="";
    projectName:string="";
    ownerFullName: string = "";
    isPublisher:boolean;
    noticeTitle: string;
    propertyName: string;
    landCategory: string;
    noticeBySeller: string;
    advocateId: number = 0;
    advocateName: string;
    advocatePhone: string;
    advocateAddress: string;
    noticePeriod:number;
    ownerName: string;
    landMark: string;
    type: string;
    surveyNumber: string;
    gatNumber: string;
    plotNumber: string;
    otherDetails: string;
    area:string;
    propertyArea: string;
    constructedPropertyArea: string;
    countryName: string
    stateName: string
    cityName: string;
    talukaName: string;
    villageName: string;
    createdDate: string;
    publishedDate:string;
    noticePlace: string;
    paperName: string;
    fileName: string;
    originalFileName: string;
    noticeImage:  Array<OcrNoticeImage> = new Array<OcrNoticeImage>(); 
    imageUrl: string;
    enablePreview: boolean = false;
    isBookmakedNotice: boolean = false;
    isSelected: boolean = false;
    noticeDetailList: Array<OcrNoticeDetail> = new Array<OcrNoticeDetail>();
    isActive: boolean;
    isDeleted: boolean = false;
    personId: number;
    landCategoryId: number;
    paperId: number; 
    unitTypeId: number;
    countryId: number;
    stateId: number;
    cityId: number;
    talukaId: number;
    villageId: number;
    buildingName: string;
    flatNo: string="";
    floorNo: string="";
    googleMapLink:string;
    userName: string = "";
    totalCount:number;
}
export class OcrNoticeImageDto {
    id: number;
    name: string;
    imageTypeId: number;
}
// export class SearchModel {
//     landCategoryId: number=0;
//     searchString:string="";
//     searchByName:string="";
//     ownerFullName:string="";
//     noticeTypeId: string ="0";
//     paperId: string = "";
//     sectorNo: string = "";
//     projectName: string = "";
//     advocateName: string= "";
//     stateId: number =72;
//     cityId: number =2;// districtId: string = "";
//     talukaId: number = 0;
//     villageId: number = 0;
//     // fromDate: string = "";
//     // toDate: string = "";
//     surveyNumber: string = "";
//     gatNumber: string = "";
//     plotNumber: string = "";
//     ctsNumber: string = "";
// 	propertyArea: string = "";
// 	buildingName: string = "";
// 	flatNo: string = "";
// 	floorNo: string = "";
// 	constructedPropertyArea: string = "";
// 	finalPlotNo: string = "";
// 	subPlotNo: string = "";
// 	privatePlotNo: string = "";
// 	catestrialSurveyNo: string = "";
// 	houseNo: string = "";
// 	tenementNo: string = "";
// 	factoryShedNo: string = "";
// 	industrialBuilding: string = "";
// 	grampanchayatNo: string = "";
//     nagarPanchyatMilkatNo: string = "";
//     glrNo: string = "";
//     complaintNoReportNo:string = "";
// 	malmattaNo: string = "";
// 	corporationRegistrationNo: string = "";
// 	propertyCardNo: string = "";
// 	phaseNo: string = "";
// 	buildingNo: string = "";
// 	flatShopNo: string = "";
// 	commencementCertificateNo: string = "";
// 	completionCertificateNo: string = "";
// 	shareCertificateNo: string = "";
// 	propertyNo: string = "";
//     cityList: Array<City> = new Array<City>();
//     startDate: Date;
//     endDate: Date;
//     interestedCity:any=[];
//     pageNumber: number = 1;
//     isActiveOnly: boolean = true;
//     userId: string = null;
// }

export class OcrAddNoticeModel {
    id: number = 0;
    noticeId: number;
    borrowerName:string='';
    isOcr:number=1;
    isPublisher:any="false";
    isPaid:any="false";
    noticeTypeId: number = 1;
    landCategoryId: any = "1";
    paperId: number =0;
    sectorNo:string = "";;
    projectName:string = "";
    // phaseNo:any;
    propertyCardNo:any;
    publishedDate: string;
    PublishedDateString: string;
    landMark: string;
    unitTypeId: number;
    ownerFullName: string = "";
    paperName: string;
    cityName: string;    
    landCategoryName:string;
    advocateId: number = 0;
    advocateName: string;
    advocatePhone: string;
    advocateAddress: string;
    personId: number = 0;
    countryId: number = 1;
    stateId: number = 72;
    cityId: number=0;
    talukaId: number=0;
    villageId: number=0;
    createdBy: string="";
    noticeImage:  Array<OcrNoticeImage> = new Array<OcrNoticeImage>(); 
    noticeDetailList: Array<OcrNoticeDetail> = new Array<OcrNoticeDetail>();
    otherDetails: string;
    constructedPropertyArea: string;
    brokerName: string;
    noticeTitle: string = "TITLE VERIFICATION";
    isActive: boolean = true;
    noticePeriod: number ;
    buildingName: string;
    flatNo: string;
    floorNo: string;
    imageUrl: string = "";
    userName: string = "";
    googleMapLink:string="";  
    
}

export class OcrNoticeDetail {
    id: 0;
    noticeId: 0;
    surveyNumber: string = "";   
    propertyCardNo:any;
    fullSurveyNumber: string = "";
    gatNumber: string = "";
    fullGatNumber: string = "";
    finalPlotNo: string = "";
    subPlotNo: string = "";
    privatePlotNo: string = "";
    catestrialSurveyNo: string = "";
    plotNumber: string = "";
    fullPlotNumber: string = "";
    flatNo:string="";
    constructedPropertyArea:string="";
    ctsNumber: string = "";
    buildingName: string;
    fullCtsNumber: string = "";
    area: string = "";
    unitTypeId: string = "";
    propertyArea:string="";    
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
    propertyCard:string="";
    phaseNo:string = "";
    buildingNo:string = "";
    flatShopNo:string = "";
    floorNo:string = "";
    commencementCertificateNo:string = "";
    completionCertificateNo:string = "";
    shareCertificateNo:string = "";
    propertyNo:string = "";
    outstandingAmount:number;
    reservePrice:number;
    earnestMoney:number;
    isBanking:boolean;
    hectorR: number;
    hectorH: number;
    potKharab: number;
    squareMeter: number;
    squareFeet: number;
    var: number;
    foot: number;
    acre: number;
  length: any;
}

export class OcrNoticeImage {
    fileName: string;
    originalFileName: string;
    assetId: number;
    id: number;
    imageTypeId: number;
    name: string;
    isAdded: boolean;
    isDeleted: boolean;
}
