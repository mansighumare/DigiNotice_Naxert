import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../services/config.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddOrgPropertyModel, DocumentsModel } from '../models/org-asset-manager';
import { catchError, retry } from 'rxjs/operators';
import { ResponseHelperService } from './response-helper.service';

@Injectable({
  providedIn: 'root'
})
export class OrgAssetManagerService {

  constructor(
    private authService: AuthenticationService,
    public appConfig: AppConfig,
    public http: HttpClient,
    private _helper: ResponseHelperService
  ) { }
  uploadPropertyImgUrl: string = this.appConfig.getImageUploadUrl("OrgProperty");

  getOrgProperties(userId: string, Role_id: string, OrgId: number, BranchId: number, page: number) {

    var url = this.appConfig.getApiPath("OrgProperty", "GetProperty", [userId, Role_id, OrgId, BranchId, page]);
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );;
  }


  getSearchProperties(userId: string, Role_id: string, OrgId: number, BranchId: number, page: number, searchString: any) {
    var searchProperty = { userId, Role_id, OrgId, BranchId, page, searchString }
    var url = this.appConfig.getApiPath("OrgProperty", "GetSearchProperty");
    return this.http.post(url, searchProperty).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  getOrgDeletedProperties(userId: string, Role_id: string, OrgId: number, BranchId: number, page: number) {
    var url = this.appConfig.getApiPath("OrgProperty", "GetDeletedProperty", [userId, Role_id, OrgId, BranchId, page]);
    return this.http.get(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }


  searchOrgDeletedProperties(userId: string, Role_id: string, OrgId: number, BranchId: number, page: number, searchString: any) {
    var searchOrgDeletedProperties = { userId, Role_id, OrgId, BranchId, page, searchString }
    var url = this.appConfig.getApiPath("OrgProperty", "SearchDeletedProperty");
    return this.http.post(url, searchOrgDeletedProperties)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }

  getBranchesList(userId: string, role_id: string, orgId: number) {
    var url = this.appConfig.getApiPath("OrgProperty", "GetBranches", [userId, role_id, orgId]);
    return this.http.get(url);
  }

  getDeleteRequestProperties(userId: string, Role_id: string, OrgId: number, BranchId: number, Page: number) {
    var url = this.appConfig.getApiPath("OrgProperty", "GetDeleteRequestProperties", [userId, Role_id, OrgId, BranchId, Page]);
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  searchDeltedRequestProperties(userId: string, Role_id: string, OrgId: number, BranchId: number, Page: number, searchString: string) {
    var searchDeltedRequestProperties = { userId, Role_id, OrgId, BranchId, Page, searchString }
    var url = this.appConfig.getApiPath("OrgProperty", "SearchDeltedRequestProperties");
    return this.http.post(url, searchDeltedRequestProperties).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  // getProperties(userId: string) {
  //   // var searchModel = { userId: this.authService.loggedInUser.userId };
  //   // var url = this.appConfig.getApiPath("Property", "GetProperty", [this.userId]);
  //   var url = this.appConfig.getApiPath("Property", "GetProperty", [userId]);
  //   return this.http.get(url);
  // }


  getPropertiesHistory(assetId: number, userId: string, roleGuid: string, orgId: number, branchId: number) {
    // const OrgAssetHistory={assetId, userId,roleGuid,orgId,branchId}
    const url = this.appConfig.getApiPath('OrgProperty', 'GetAssetHistroy', [assetId, userId, roleGuid, orgId, branchId]);
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );;
  }



  post_multile_Files(fileToUpload: File[], orgId: number, branchId: number): Observable<any> {
    var url = this.appConfig.getApiPath("OrgProperty", "UploadMultipleFiles", [orgId, branchId, 1]);
    //
    const formData: FormData = new FormData();
    fileToUpload.forEach(element => {
      //
      formData.append('fileToUpload', element);
    });

    return this.http.post(url, formData);
  }

  uploadExcelFile(fileToUpload: any, orgId: number, branchId: number): Observable<any> {

    var url = this.appConfig.getApiPath("OrgProperty", "UploadMultipleFiles", [orgId, branchId, 2]);
    const formData: FormData = new FormData();
    formData.append('fileToUpload', fileToUpload);
    // fileToUpload.forEach(element => {
    //  
    //   formData.append('fileToUpload', element);
    // });    

    return this.http.post(url, formData);
  }

  addOrgProperty(addOrgPropertyModel: AddOrgPropertyModel) {
    var url = this.appConfig.getApiPath("OrgProperty", "AddOrgProperty");
    return this.http.post(url, addOrgPropertyModel).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );;
  }


  addMultipleAssets(PropertyInformationDto: any) {
    var url = this.appConfig.getApiPath("OrgProperty", "AddMultipleOrgProperty");
    const jsonData = { PropertyInformationDto }
    return this.http.post(url, jsonData).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );;
  }

  saveFollupData(addOrgPropertyFollowUpModel: DocumentsModel) {
    var url = this.appConfig.getApiPath("OrgProperty", "OrgPropertyFollowUp");
    return this.http.post(url, addOrgPropertyFollowUpModel).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );;
  }




  uploadAssestImage(propertyImage: string[]) {

    const formData = new FormData();
    for (var i = 0; i < propertyImage.length; i++) {
      formData.append('image', propertyImage[i]);
    }
    var url = this.uploadPropertyImgUrl;
    return this.http.post(url, formData);

  }


  // uploadAssestImage(assetImage: any) {
  //   const formData = new FormData();
  //   formData.append('image', assetImage);
  //   var url = this.uploadPropertyImgUrl;
  //   return this.http.post(url, formData);
  // }

  deleteOrgProperty(Id: any, userId: string) {
    const deleteOrgProperty = { Id, userId }
    var url = this.appConfig.getApiPath("OrgProperty", "DeleteOrgProperty");
    return this.http.post(url, deleteOrgProperty).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );;
  }


  deleteProperty(addOrgPropertyModel: AddOrgPropertyModel) {
    var url = this.appConfig.getApiPath("OrgProperty", "DeleteProperty");
    return this.http.post(url, addOrgPropertyModel).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }
}
