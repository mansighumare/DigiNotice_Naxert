

export class ProfileInfo {
    userId:string;
    email: string = ""; 
    prefix: string="";
    firstName: string="";
    lastName: string="";
    phone: string="";
    //companyName: string;
    // designation: string;
     address: string="";
     occupation:string="";
    profileImage:  ProfileImage = new ProfileImage(); 
    // countryId: string;
    // stateId: string;
    // cityId: string;
    // talukaId: string;
    // villageId: string;
    countryId : number=1;
    stateId : number;
    cityId : number=0;
    // talukaId : number=0;
    // villageId :number=0;
    pinCode :string="";

}

export class ProfileImage {
    fileName: string="";
    originalFileName: string="";
    assetId: number;
    id: number;
    imageTypeId: number;
    name: string;
    isAdded: boolean;
    isDeleted: boolean;
}