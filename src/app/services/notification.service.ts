import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './config.service';
import { ResponseHelperService } from './response-helper.service';
import { BehaviorSubject } from 'rxjs';
export interface TableData extends Array<any> { }

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private _http: HttpClient, public appConfig: AppConfig, private _helper: ResponseHelperService) { }

  public updateNotifications(value: number): void {
    
    this.notificationsSubject.next(value);
}
  notificationCount(userGuid:string,roleGuid:string,orgId:number,branchId:number){
    var user={userGuid,roleGuid,orgId,branchId}
    var url = this.appConfig.getApiPath("OrgNotification", "getNotificationCounts");
    return this._http.post(url,user)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }


  ViewProperty(asset_id:number){
    
    var url = this.appConfig.getApiPath("OrgNotification", "GetPropertyDetails",[asset_id]);
    return this._http.get(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }

  ViewNotice(noticeId:number){
    
      var url = this.appConfig.getApiPath("OrgNotification", "GetNoticeDetail",[noticeId]);
    return this._http.get(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }


  Acknowledge(id:number,userGuid:string){
    
    var ack={id,userGuid}
    var url = this.appConfig.getApiPath("OrgNotification", "Acknowledge");
    return this._http.post(url,ack)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }


  getAcknowledgeReport(userGuid:string,roleGuid:string,orgId:number,branchId:number,page:number){
    var user={userGuid,roleGuid,orgId,branchId,page}
    var url = this.appConfig.getApiPath("OrgNotification", "GetAcknowledgeReport");
    return this._http.post(url,user)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }


  SearchGetAcknowledgeReport(userGuid:string,roleGuid:string,orgId:number,page:number,branchId:number,searchString:any){
    var user={userGuid,roleGuid,orgId,branchId,page,searchString}
    var url = this.appConfig.getApiPath("OrgNotification", "SearchAcknowledgeReport");
    return this._http.post(url,user)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }



  GetNotification(userGuid:string,roleGuid:string,orgId:number,branchId:number){
    var user={userGuid,roleGuid,orgId,branchId}
    var url = this.appConfig.getApiPath("OrgNotification", "getNotifications");
    return this._http.post(url,user)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }

  NotificationAlerts(){
    var url = this.appConfig.getApiPath("OrgNotification", "AddOrgAssetsAlertsMatchedNotices");
    return this._http.get(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }



}
