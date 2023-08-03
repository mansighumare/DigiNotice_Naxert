import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AppConfig } from './config.service';
import { OcrAddNoticeModel } from '../models/ocr-notice-info';
declare var $;
declare var moment;
@Injectable({
  providedIn: 'root'
})
export class OcrServiceService {
  uploadNoticeImgUrl: string = this.appConfig.getImageUploadUrl("notice");

  constructor( private authService: AuthenticationService,
    public appConfig: AppConfig,
    public http: HttpClient) { }


    addNotice(addNoticeModel: OcrAddNoticeModel) {
      addNoticeModel.userName = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
      var url = this.appConfig.getApiPath("Notice", "AddNotice");
      return this.http.post(url, addNoticeModel);
    }

    // getNoticeDataFromOcrApi(originalFileName) {
    //  const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'; // or https://crossorigin.me/
    //   const apiUrl = "http://20.207.99.254:8000/pass-image?image_link=" + encodeURIComponent(originalFileName);
    // const url = corsProxyUrl + apiUrl;
    //   return this.http.get(url);
    // }

    saveJson(json:any,originalFileName:string,userGuid:string) {
      var SaveJson ={json,originalFileName,userGuid}
          var url = this.appConfig.getApiPath("OcrNotice", "saveJson");
      return this.http.post(url, SaveJson);
    }
    
    

    initDateRangePicker() {
      $('#txtNoticeDate').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        startDate: moment(),
        endDate: moment(),
        locale: {
          format: 'DD/MM/YYYY'
        },
      });
    }


    uploadNoticeImage(noticeImage: string[],userId:string) {

      const formData = new FormData();
      for (var i = 0; i < noticeImage.length; i++) {
        formData.append('image', noticeImage[i]);
      }
      var url = this.appConfig.getApiPath("OcrNotice", "UploadImage",[1,userId]);
      return this.http.post(url, formData);
  
    }
}
