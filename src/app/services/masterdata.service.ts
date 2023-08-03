import { Injectable, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { AddOrganisationModel, NoticeType } from "src/app/models/column";
import { map, retry, catchError } from "rxjs/operators";

import { AuthenticationService } from "./authentication.service";
import { AppConfig } from "./config.service";

import { LandCategory, Country, State, SortEnum } from "../models";
import { PageInfo, TableConfig } from "src/app/models/column";
import { HttpHeaders } from "@angular/common/http";
import { ResponseHelperService } from "./response-helper.service";

declare var $;

@Injectable({ providedIn: "root" })
export class MasterDataService {
  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    private _helper: ResponseHelperService
  ) // , private authService: AuthenticationService
  { }

  addOrganisationModel: AddOrganisationModel = new AddOrganisationModel();

  getCountry(tableConfig: any) {
    let tableRows: Array<Country> = new Array<Country>();
    for (var index = 0; index < 1000; index++) {
      var id = index + 1;
      tableRows.push({ id: id, name: "Country " + id, code: "IN" });
    }
    return this.applySortingAndPagination(tableConfig, tableRows);
    // var url = this.appConfig.getApiPath("notice", "country", [countryId]);
    // return this.http.get(url);
  }

  getCountries() {
    var url = this.appConfig.getApiPath("notice", "getCountries");
    return this.http.get(url);
  }

  //for Master Data forms Screen
  getCountyList() {
    var url = this.appConfig.getApiPath("Master", "GetCountry");
    return this.http.get(url);
  }

  // Get Existing Organisation List for Add Branch
  getOrgansiationList(userRole: any, userId: any, isActive: boolean, page: number) {

    var url = this.appConfig.getApiPath("Master", "GetOragnisations") + "?userRole=" + userRole + "&userId=" + userId + "&isActive=" + isActive + "&page=" + page;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }



  SearchOrganization(userRole: any, userId: any, isActive: boolean, page: number, searchString: any) {
    var searchOrganization = { userRole, userId, isActive, page, searchString }
    var url = this.appConfig.getApiPath("Master", "SearchOragnisations")
    return this.http.post(url, searchOrganization).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }



  // Get Existing Organisation List for Add Branch
  getOrgansiation(userRole: any, userId: any, isActive: boolean) {

    var url = this.appConfig.getApiPath("Master", "GetOragnisationList") + "?userRole=" + userRole + "&userId=" + userId + "&isActive=" + isActive;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }
  // Get Existing Branches to Branch as child branch
  getParentBranchesList(OrgId: any, BranchId: any) {
    var url =
      this.appConfig.getApiPath("Master", "GetParentBranches") +
      "?OrgId=" +
      OrgId +
      "&branchId=" +
      BranchId;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  // Get State List for Add Branch/add Organisation
  getStateList(country_id: any) {
    var url =
      this.appConfig.getApiPath("Master", "GetState") +
      "?country_id=" +
      country_id;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  uploadOrganizationLogo(OrganisationLogo: string[]){
    const formData = new FormData();
    for (var i = 0; i < OrganisationLogo.length; i++) {
      formData.append('image', OrganisationLogo[i]);
    }
    var url = this.appConfig.getApiPath("Master", "UploadOrganizationLogo");
   // var url = this.uploadPropertyImgUrl;
    return this.http.post(url, formData);
  }

  // Get State List for Add Branch/add Organisation
  getCityList(state_id: any, isActive: boolean) {
    var url =
      this.appConfig.getApiPath("Master", "GetCityList") + "?state_id=" + state_id + "&isActive=" + isActive;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  //Change Branch Status Active/InActive
  Branchstatus(isActive: boolean, branchId: any) {
    var url =
      this.appConfig.getApiPath("Master", "ChangeBranchStatus") +
      "?isActive=" +
      isActive +
      "&branchId=" +
      branchId;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  //Change Organisation Status Active/InActive
  Organisationstatus(isActive: boolean, orgId: any) {
    var url =
      this.appConfig.getApiPath("Master", "ChangeOrgStatus") +
      "?isActive=" +
      isActive +
      "&orgId=" +
      orgId;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  // Get Taluka List for Add Branch/add Organisation
  getTalukaList(city_id: any) {
    var url =
      this.appConfig.getApiPath("Master", "GetTaluka") + "?city_id=" + city_id;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  // Get Taluka List for Add Branch/add Organisation
  getVillageList(taluka_id: any, isActiveOnly: boolean) {

    var url =
      this.appConfig.getApiPath("Master", "GetVillages") +
      "?taluka_id=" +
      taluka_id +
      "&isActiveOnly=" +
      isActiveOnly;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  // Get Org Details for Edit Organisation
  getOrgDetails(OrgId: any) {
    var url =
      this.appConfig.getApiPath("Master", "getOrgDetails") + "?OrgId=" + OrgId;
    return this.http.get(url).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  // Add Organisation
  addOrg(addOrganisationModel: AddOrganisationModel) {
    var url = this.appConfig.getApiPath("Master", "AddOrganisation");
    return this.http.post(url, addOrganisationModel).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }

  // Add Branch
  addBranch(addOrganisationModel: AddOrganisationModel) {
    var url = this.appConfig.getApiPath("Master", "AddBranch");
    return this.http.post(url, addOrganisationModel).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }


  // Add Notice Type
  addNoticeType(noticeType: NoticeType) {
    var url = this.appConfig.getApiPath("Master", "AddNoticeType");
    return this.http.post(url, noticeType).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }


  getBranches(userGuid: any, orgId: any, roleGuid: any, isActive: boolean, page: number) {

    var url = this.appConfig.getApiPath("Master", "GetBranches",) + "?userGuid=" + userGuid + "&orgId=" + orgId + "&roleGuid=" + roleGuid + "&isActive=" + isActive + "&page=" + page;
    return this.http.get(url);
  }


  SearchBranches(userGuid: any, orgId: any, roleGuid: any, isActive: boolean, page: number, SearchString: string) {
    var SearchBranches = { userGuid, orgId, roleGuid, isActive, page, SearchString }
    var url = this.appConfig.getApiPath("Master", "SearchBranches");
    return this.http.post(url, SearchBranches).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this._helper.handleError) // then handle the error
    );
  }



  getStates(tableConfig: any) {
    let tableRows: Array<State> = new Array<State>();
    for (var index = 0; index < 1000; index++) {
      var id = index + 1;
      tableRows.push({
        id: id,
        name: "State " + id,
        stateCode: "MH",
        countryId: 1,
        countryName: "India",
      });
    }
    return this.applySortingAndPagination(tableConfig, tableRows);
    // var url = this.appConfig.getApiPath("notice", "states", [countryId]);
    // return this.http.get(url);
  }

  getState(stateId: number) {
    var url = this.appConfig.getApiPath("notice", "state", [stateId]);
    return this.http.get(url);
  }

  getCities(stateId: number) {
    var url = this.appConfig.getApiPath("notice", "cities", [stateId]);
    return this.http.get(url);
  }

  getCity(cityId: number) {
    var url = this.appConfig.getApiPath("notice", "city", [cityId]);
    return this.http.get(url);
  }

  getKeywords() {
    var url = this.appConfig.getApiPath("notice", "keywords");
    return this.http.get(url);
  }

  applySortingAndPagination(tableConfig, tableRows) {
    if (tableConfig.sortInfo) {
      var sortedColumn = tableConfig.sortInfo.sortedColumn;
      var columnName =
        sortedColumn.sortType == SortEnum.ASC
          ? sortedColumn.name
          : "-" + sortedColumn.name;
      tableRows = tableRows.sort(this.dynamicSort(columnName));
    }
    var tableInfo = {
      tableRows: this.paginate(
        tableRows,
        tableConfig.pageInfo.pageSize,
        tableConfig.pageInfo.currentPage
      ),
      totalRecords: tableRows.length,
    };
    return of(tableInfo);
  }

  // getLandCategories(tableConfig: TableConfig) {
  //     // let tableRows: Array<LandCategory> = new Array<LandCategory>();
  //     // for (var index = 0; index < 1000; index++) {
  //     //     var id = index + 1;
  //     //     tableRows.push({ id: id, name: "LandCategory " + id, displayName: "LandCategory " + id, sortOrder: index });
  //     // }
  //     // return this.applySortingAndPagination(tableConfig, tableRows);
  //     var url = this.appConfig.getApiPath("notice", "GetLandCategory");
  //     return this.http.get(url);
  // }

  paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    var a = array.slice(page_number * page_size, (page_number + 1) * page_size);
    return a;
  }

  // https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  //Start : Real API
  getNewsPapers(tableConfig: TableConfig) {
    var url = this.appConfig.getApiPath("notice", "GetPaper");
    return this.http.get(url);
  }
  GetOrganisations(tableConfig: TableConfig) {
    var url = this.appConfig.getApiPath("notice", "GetOrganisations");
    return this.http.get(url);
  }
  getImageType() {
    var url = this.appConfig.getApiPath("notice", "GetImageType");
    return this.http.get(url);
  }
  getKeyword() {
    var url = this.appConfig.getApiPath("notice", "GetKeyword");
    return this.http.get(url);
  }

  // getNoticeType() {
  //   var url = this.appConfig.getApiPath("notice", "GetKeyword");
  //   return this.http.get(url);
  // }



  getLandCategories(tableConfig: TableConfig) {
    var url = this.appConfig.getApiPath("notice", "GetLandCategory");
    return this.http.get(url);
  }
  getNoticeType() {
    var url = this.appConfig.getApiPath("Master", "GetNoticeType");
    return this.http.get(url);
  }
  getPersonType(tableConfig: TableConfig) {
    var url = this.appConfig.getApiPath("notice", "GetPersonType");
    return this.http.get(url);
  }
  getUnitType(tableConfig: TableConfig) {

    var url = this.appConfig.getApiPath("notice", "GetUnitType");
    return this.http.get(url);
  }
  //End : Real API

  //Start : Generic API call for add,update and delete lookup
  getLookupTable(serviceUrl: string) {
    var url = this.appConfig.apiUrl + serviceUrl;
    return this.http.get(url);
  }
  addLookupEntry(addedRow: any, serviceUrl: string) {
    var url = this.appConfig.apiUrl + serviceUrl;
    return this.http.post(url, addedRow);
  }
  updateLookupEntry(updateRow: any, serviceUrl: string) {

    var url = this.appConfig.apiUrl + serviceUrl;
    return this.http.post(url, updateRow);
  }
  deleteLookupEntry(deleteRow: any, serviceUrl: string) {
    var url = this.appConfig.apiUrl + serviceUrl;
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: deleteRow,
    };
    return this.http.delete(url, options);
  }
  //End : Generic API call for add,update and delete lookup

  addVillage(villageDto: any) {
    var url = this.appConfig.getApiPath("Master", "UpdateVillage");
    return this.http.post(url, villageDto);
  }
  updateVillage(villageDto: any) {
    var url = this.appConfig.getApiPath("Master", "UpdateVillage");
    return this.http.post(url, villageDto);
  }
  // getVillages(talukaId: number) {
  //     var url = this.appConfig.getApiPath("Lookup", "GetVillage", [talukaId]);
  //     return this.http.get(url)
  // }

  addTaluka(talukaDto: any) {
    var url = this.appConfig.getApiPath("Master", "UpdateTaluka");
    return this.http.post(url, talukaDto);
  }

  addDistrict(distictDto: any) {
    var url = this.appConfig.getApiPath("Master", "UpdateDistrict");
    return this.http.post(url, distictDto);
  }
  updateDistrict(distictDto: any) {
    var url = this.appConfig.getApiPath("Master", "UpdateDistrict");
    return this.http.post(url, distictDto);
  }
  updateTaluka(talukaDto: any) {

    var url = this.appConfig.getApiPath("Master", "UpdateTaluka");
    return this.http.post(url, talukaDto);
  }
  getTalukas(cityId: number) {
    var url = this.appConfig.getApiPath("Lookup", "GetTalukas", [cityId]);
    return this.http.get(url);
  }

}
