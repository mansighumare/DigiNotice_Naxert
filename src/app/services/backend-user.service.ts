import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './config.service';
import { ResponseHelperService } from './response-helper.service';
import { BackendUserModel } from '../models/account.model';
export interface TableData extends Array<any> {}
@Injectable({
  providedIn: 'root'
})
export class BackendUserService {

  constructor(private _http: HttpClient,public appConfig: AppConfig,private _helper : ResponseHelperService) { }


  getRoles(userGuid:any,roleGuid:any,userRole:any){
    
    var url = this.appConfig.getApiPath("User", "GetRoles")+"?userGuid="+userGuid+"&roleGuid="+roleGuid+"&userRole="+userRole;
    return this._http.get<TableData>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }


  getCity(stateId: number){
    
    var url = this.appConfig.getApiPath("Lookup", "GetCity", [stateId]);
    return this._http.get<TableData>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );
  }



  addUser(backendUserModel:BackendUserModel){
    var url = this.appConfig.getApiPath("User", "Register");
    return this._http.post(url, backendUserModel).pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this._helper.handleError) // then handle the error
      );  
}

updateUserStatus(userIntId,userId,isActive){
  var url = this.appConfig.getApiPath("User", "UpdateUserStatus");
  const data = { userIntId, userId, isActive };
  return this._http.post(url, data).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );  
}

getBackendUsers(userGuid:any,roleGuid:any,roleIntId:any,isActive: boolean,page:number) {
  
  var url = this.appConfig.getApiPath("User", "GetBackendUser",)+"?userGuid="+userGuid+"&roleGuid="+roleGuid+"&roleIntId="+roleIntId+"&isActive="+isActive+"&page="+page;
  return this._http.get(url);
}
searchBackendUsers(userId:any,roleGuid:any,roleIntId:any,isActive: boolean,page:number,searchString:string) {
  var backenduser ={ userId,roleGuid,roleIntId,isActive,page,searchString}
  var url = this.appConfig.getApiPath("User", "SearchBackendUser");
  return this._http.post(url,backenduser).pipe(
    retry(3), // retry a failed request up to 3 times
    catchError(this._helper.handleError) // then handle the error
  );  ;
}

getUserDetails(userIntId:any,id:any,isActive: boolean) {
  
  var url = this.appConfig.getApiPath("User", "GetBackendUserDetails",)+"?userIntId="+userIntId+"&id="+id+"&isActive="+isActive;
  return this._http.get(url);
}


}
