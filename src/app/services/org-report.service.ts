import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from './config.service';
import { ResponseHelperService } from './response-helper.service';
import { catchError, retry } from 'rxjs/operators';
import { ViewAssetReportModel, searchAssetReportModel } from '../models/search-asset-report.model';

@Injectable({
  providedIn: 'root'
})
export class OrgReportService {
  searchAssetReportModel: searchAssetReportModel = new searchAssetReportModel();
  ViewAssetReportModel: ViewAssetReportModel = new ViewAssetReportModel();

  constructor(  private http: HttpClient,
    private appConfig: AppConfig,
    private _helper: ResponseHelperService) { }

  get_Last30daysAssets_Report(userId:string,roleGuid:string,orgId:number,branchId:number)
  {
      var getLast30DaysAssets={userId,roleGuid,orgId,branchId}
      var url = this.appConfig.getApiPath("OrgReport", "GetLast30DaysAssets")
      return this.http.post(url,getLast30DaysAssets).pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this._helper.handleError) // then handle the error
      );
  }


  get_Last12Months_Assets_Report(userId:string,roleGuid:string,orgId:number,branchId:number)
  {
      var get_Last12Months_Assets_Report={userId,roleGuid,orgId,branchId}
      var url = this.appConfig.getApiPath("OrgReport", "GetLast12MonthsAssets")
      return this.http.post(url,get_Last12Months_Assets_Report).pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this._helper.handleError) // then handle the error
      );
  }


  get_Assets_Report(searchAssetReportModel: searchAssetReportModel)
  {
      var url = this.appConfig.getApiPath("OrgReport", "GetAssetsReport")
      return this.http.post(url,searchAssetReportModel).pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this._helper.handleError) // then handle the error
      );
  }


  ViewAssets(ViewAssetReportModel: ViewAssetReportModel)
  {
      var url = this.appConfig.getApiPath("OrgReport", "ViewAssets")
      return this.http.post(url,ViewAssetReportModel).pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this._helper.handleError) // then handle the error
      );
  }

  SearchAssets(ViewAssetReportModel: ViewAssetReportModel)
  {
      var url = this.appConfig.getApiPath("OrgReport", "SearchAssets")
      return this.http.post(url,ViewAssetReportModel).pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this._helper.handleError) // then handle the error
      );
  }

  getOrgnizations(userId:string,roleGuid:string)
  {
      var getOrgnizations={userId,roleGuid}
      var url = this.appConfig.getApiPath("OrgReport", "GetOrgnizations")
      return this.http.post(url,getOrgnizations).pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this._helper.handleError) // then handle the error
      );
  }


  getBranches(userId:string,roleGuid:string,orgId:number,branchId:number)
  {
    var getBranches={userId,roleGuid,orgId,branchId}
      var url = this.appConfig.getApiPath("OrgReport", "GetBranches")
      return this.http.post(url,getBranches).pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this._helper.handleError) // then handle the error
      );
  }



  getOrgDashboardData(userId: string, role_guid: string, org_id: number, branch_id: number) {
    var url = this.appConfig.getApiPath("Report", "GetOrgDashboardData", [userId, role_guid, org_id, branch_id]);
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
  );
}

}
