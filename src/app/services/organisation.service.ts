
// OrganisationService 
// OrganisationModel
//OrganisationUser


import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './config.service';
import { ResponseHelperService } from './response-helper.service';
import {  OrganisationUserModel } from '../models/account.model';
export interface TableData extends Array<any> {}
@Injectable({
  providedIn: 'root'
})
export class OrganisationService  {

  constructor(private _http: HttpClient,public appConfig: AppConfig,private _helper : ResponseHelperService) { }


  getRoles(userGuid:any,roleGuid:any,userRole:any){
    
    var url = this.appConfig.getApiPath("User", "GetOrgRoles")+"?userGuid="+userGuid+"&roleGuid="+roleGuid+"&userRole="+userRole;
    return this._http.get<TableData>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }

 

  getBranchesList(userGuid:any,roleGuid:any, userRole:any , orgId : any , cityId : any){
    
    var url = this.appConfig.getApiPath("User", "GetBranches")+"?userGuid="+userGuid+"&roleGuid="+roleGuid+"&userRole="+userRole+"&orgid="+orgId+"&cityid="+cityId;
    return this._http.get<TableData>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }

  addOrgUser(OrganisationUserModel: OrganisationUserModel){
    var url = this.appConfig.getApiPath("User", "RegisterOrgUser");
    return this._http.post(url,OrganisationUserModel).pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );  
}


getOrganisationUsers(userGuid:any,orgId:any,branchId:any,roleGuid:any,isActive: boolean,page:number) {
  var url = this.appConfig.getApiPath("User", "GetOrganisationUser",)+"?userGuid="+userGuid+"&orgId="+orgId+"&branchId="+branchId+"&roleGuid="+roleGuid+"&isActive="+isActive+"&page="+page;
  return this._http.get(url).pipe(
    retry(3), // retry a failed request up to 3 times
    catchError(this._helper.handleError) // then handle the error
  );
}

searchOrganisationUsers(userGuid:any,orgId:any,branchId:any,roleGuid:any,isActive: boolean,page:number,SearchString:string) {
  var searchOrganisationUsers ={userGuid,orgId,branchId,roleGuid,isActive,page,SearchString}
  var url = this.appConfig.getApiPath("User", "SearchOrganisationUser");
  return this._http.post(url,searchOrganisationUsers).pipe(
    retry(3), // retry a failed request up to 3 times
    catchError(this._helper.handleError) // then handle the error
  );;
}



getUserDetails(userIntId:any,roleIntId:number,id:any,isActive: boolean) {
  
  var url = this.appConfig.getApiPath("User", "GetOrgUserDetails",)+"?userIntId="+userIntId+"&roleIntId="+roleIntId+"&id="+id+"&isActive="+isActive;
  return this._http.get(url);
}


updateUserStatus(userIntId : any ,userId : any ,isActive : any){
  var url = this.appConfig.getApiPath("User", "UpdateOrgUserStatus");
  const data = { userIntId, userId, isActive };
  return this._http.post(url, data).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );  
}

}