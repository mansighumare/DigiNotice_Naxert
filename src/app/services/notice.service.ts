import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AddNoticeModel, NoticeInfoModel, SearchModel } from 'src/app/models';

import { AppConfig } from '../services/config.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationPreferenceDto } from 'src/app/models/user-preferences';
import { NoticeAdvocateModel } from '../models/notice-info';
import { NotificationList } from '../models/notification';

declare var $;
declare var moment;

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  constructor(
    private authService: AuthenticationService,
    public appConfig: AppConfig,
    public http: HttpClient) {

  }
  searchNoticeCount: number;
  uploadNoticeImgUrl: string = this.appConfig.getImageUploadUrl("notice");
  personList: Array<NoticeAdvocateModel> = new Array<NoticeAdvocateModel>();
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

  initDateRangePickerUpdate(startDate: Date) {
    $('#txtNoticeDate').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      startDate: startDate,
      endDate: moment(),
      locale: {
        format: 'DD/MM/YYYY'
      },
    });
  }
  addNotice(addNoticeModel: AddNoticeModel) {
    addNoticeModel.userName = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
    var url = this.appConfig.getApiPath("Notice", "AddNotice");
    return this.http.post(url, addNoticeModel);
  }

  updateNotice(editNoticeModel: AddNoticeModel) {
    editNoticeModel.userName = this.authService.loggedInUser.firstName + " " + this.authService.loggedInUser.lastName;
    var url = this.appConfig.getApiPath("Notice", "AddNotice");
    return this.http.post(url, editNoticeModel);
  }

  uploadNoticeImage(noticeImage: string[]) {

    const formData = new FormData();
    for (var i = 0; i < noticeImage.length; i++) {
      formData.append('image', noticeImage[i]);
    }
    var url = this.uploadNoticeImgUrl;
    return this.http.post(url, formData);

  }

  getBookMarkedNotices(userId: string) {
    var url = this.appConfig.getApiPath("Notice", "GetBookmarkNotice", [userId]);
    return this.http.get(url);
  }

  getTodaysNotices(isActiveOnly: boolean = true, userId: string) {
    var url = this.appConfig.getApiPath("Notice", "GetTodayNotice", [isActiveOnly, 0, userId]);
    return this.http.get(url);
  }

  getRedMatchedNotices(userId: string) {
    var url = this.appConfig.getApiPath("Notice", "GetRedMatchedNotices", [userId]);
    return this.http.get(url);
  }

  getOrgRedMatchedNotices(userId: string,roleId:string,orgId:number,branchId:number) {
    var url = this.appConfig.getApiPath("Notice", "GetOrgRedMatchedNotices", [userId,roleId,orgId,branchId]);
    return this.http.get(url);
  }


  getYellowMatchedNotices(userId: string) {
    var url = this.appConfig.getApiPath("Notice", "GetYellowMatchedNotices", [userId]);
    return this.http.get(url);
  }

  getOrgYellowMatchedNotices(userId: string,roleId:string,orgId:number,branch_id:number) {
    var url = this.appConfig.getApiPath("Notice", "GetOrgYellowMatchedNotices", [userId,roleId,orgId,branch_id]);
    return this.http.get(url);
  }

  NameMatchedNotices(userId: string,roleId:string,orgId:number,branch_id:number) {
    var url = this.appConfig.getApiPath("Notice", "GetNameMatchedNotices", [userId,roleId,orgId,branch_id]);
    return this.http.get(url);
  }

  searchNotice(searchModel: SearchModel) {
    searchModel.userId = this.authService.loggedInUser != null ? this.authService.loggedInUser.userId : null;

    let pageNumber: number = searchModel.pageNumber;
    var url = this.appConfig.getApiPath("Notice", "SearchNotice", [pageNumber, searchModel.isActiveOnly]);
    return this.http.post(url, searchModel);
  }

  GetSearchNoticeCount(searchModel: SearchModel) {
    searchModel.userId = this.authService.loggedInUser != null ? this.authService.loggedInUser.userId : null;
    var url = this.appConfig.getApiPath("Notice", "GetSearchNoticeCount", [searchModel.isActiveOnly]);
    return this.http.post(url, searchModel);

  }

  bookmarkNotice(noticeInfo: NoticeInfoModel) {
    var bookmarkInfo = {
      noticeId: noticeInfo.noticeId,
      userId: this.authService.loggedInUser.userId,
      isBookmakedNotice: noticeInfo.isBookmakedNotice
    };
    var url = this.appConfig.getApiPath("Notice", "AddBookmarkNotice");
    return this.http.post(url, bookmarkInfo);
  }

  deleteNotice(noticeInfo: NoticeInfoModel) {
    var url = this.appConfig.getApiPath("Notice", "DeleteNotice");
    return this.http.post(url, noticeInfo);
  }

  getUserNotificationSetting(userId: string) {
    var url = this.appConfig.getApiPath("Notice", "GetUserNotificationSetting", [userId]);
    return this.http.get(url);
  }

  saveUserNotificationSetting(notificationPreferenceList: Array<NotificationPreferenceDto>) {
    var url = this.appConfig.getApiPath("Notice", "SaveUserNotificationSetting");
    return this.http.post(url, notificationPreferenceList);
  }

  markNoticeActiveInactive(noticeList: string) {

    var url = this.appConfig.getApiPath("Notice", "ActiveDeactiveNotice");
    return this.http.post(url, noticeList);
  }

  deleteNotices(noticeList) {
    var url = this.appConfig.getApiPath("Notice", "DeleteNotices");
    return this.http.post(url, noticeList);
  }

  addUserPreferenceCity(interedCityList: any, userId: string) {
    var param = { cityId: interedCityList, UserId: userId };
    var url = this.appConfig.getApiPath("Notice", "AddUserPreferenceCity");
    return this.http.post(url, param);
  }

  // getRecentNotices(pageNo: number, isActive: boolean) {
  //   var url = this.appConfig.getApiPath("Notice", "GetRecentNotice", [pageNo, isActive]);
  //   return this.http.get(url);
  // }
  getRecentNotices(pageNo: number, isActive: boolean, userId: string, noticeTypeId: string) {
    let recetNotice = { pageNo, isActive, userId, noticeTypeId }
    //  ;
    var url = this.appConfig.getApiPath("Notice", "GetRecentNotice");
    return this.http.post(url, recetNotice);
  }
  getCurrentDateNotice(userId: string) {
   
    var url = this.appConfig.getApiPath("Notice", "GetCurrentDateNotice", [userId]);
    return this.http.get(url);
  }


  SendNotificationForTodaysMatchedNotices() {
    var url = this.appConfig.getApiPath("Notice", "SendNotificationForMatchedNotices");
    return this.http.get(url);
  }

  sendActiveNotification() {
    var url = this.appConfig.getApiPath("Notice", "SendActiveNotifications");
    return this.http.get(url);
  }


  GetAdvocateList(nameString: string) {

    var url = this.appConfig.getApiPath("Notice", "GetAdvocateList", [nameString]);
    return this.http.get(url);
  }

  onActiveInActiveNotification(notification: NotificationList) {
   
    var url = this.appConfig.getApiPath("Lookup", "AddNotification");
    return this.http.post(url, notification);
  }
}
