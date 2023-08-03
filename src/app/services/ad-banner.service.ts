import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AppConfig } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddAdBannerWebModel } from '../models/AdBanner';

@Injectable({
  providedIn: 'root'
})
export class AdBannerService {

  uploadNoticeImgUrl: string = this.appConfig.getImageUploadUrl("AdBanner");
  constructor(
    private authService: AuthenticationService,
    public appConfig: AppConfig,
    public http: HttpClient) {
     
  //   this.AddAdBannerList();

  }
  adBannerList: Array<AddAdBannerWebModel> = new Array<AddAdBannerWebModel>();
  maxRowOrderByImageType:number;
  addAdBanner(addAdBannerModel: AddAdBannerWebModel) {
  //  addNoticeModel.userName = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
    var url = this.appConfig.getApiPath("AdBanners", "AddAdBanner");
    return this.http.post(url, addAdBannerModel);
  }
  getAddAdBannerList() {  
    var url = this.appConfig.getApiPath("AdBanners", "GetAdBanner");
    return this.http.get(url);
  }
  
  AddAdBannerList() { 
    var url = this.appConfig.getApiPath("AdBanners", "GetAdBanner");
    this.http.get(url).subscribe((adBannerList: any) => {
      adBannerList.forEach((adBanner: any) => {     
        adBanner.imagePath =this.appConfig.imageAdBannerPath+adBanner.imagePath;
        
      });  
      this.adBannerList = adBannerList;
    }, error => {
      this.adBannerList = [];
    });
  }
  GetAdBannerListByImageType(){
    var url = this.appConfig.getApiPath("AdBanners", "GetAdBannerListByImageType",[1]);
    return this.http.get(url);
  }
  GetAdBannerRowByType(imageType:number) { 
     var url = this.appConfig.getApiPath("AdBanners", "GetAdBannerRowByType",[imageType]);
     return this.http.get(url);
    // this.http.get(url).subscribe((MaxRowOrder: any) => {
    
    //   this.maxRowOrderByImageType = MaxRowOrder;
    // }, error => {
    //   this.adBannerList = [];
    // });
  }

  DeleteAdBanner(adBanner:AddAdBannerWebModel) {  
    var url = this.appConfig.getApiPath("AdBanners", "DeleteAdBanner");
      return this.http.post(url,adBanner);
  }
  uploadBannerImage(noticeImage: any) {
    const formData = new FormData();
    formData.append('image', noticeImage);    
     var url = this.uploadNoticeImgUrl;
    return this.http.post(url, formData);
 
  
  }
 
}
