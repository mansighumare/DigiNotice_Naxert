import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City, Country, Keyword, LandCategory, NewsPaper, State, Taluka, UnitType, Village } from '../models';
import { NotificationModel } from '../models/notification';
import { AuthenticationService } from './authentication.service';
import { AppConfig } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LocationMasterService {
  constructor(
    private authService: AuthenticationService,
    public appConfig: AppConfig, public http: HttpClient) {

    this.getLookups();
  }

  stateList: Array<State> = new Array<State>();
  landCategoryList: Array<LandCategory> = new Array<LandCategory>();
  newsPapers: Array<NewsPaper> = new Array<NewsPaper>();
  // districtList: Array<District> = new Array<District>();
  cityList: Array<City> = new Array<City>();
  talukaList: Array<Taluka> = new Array<Taluka>();
  villageList: Array<Village> = new Array<Village>();
  unitTypeList: Array<UnitType> = new Array<UnitType>();
  keywordList: Array<Keyword> = new Array<Keyword>();

  getLookups() {
    this.getUnitTypes();
    this.getLandCategories();
    this.getNewsPapers();
    this.getStates();
    this.getCities(72);//this.getDistricts(20);
   // this.getTalukas(2);
    // this.getVillages(1);
  }

  getCountries() {
    let countries: Array<Country> = new Array<Country>();
    let country = new Country();

    country.id = 1;
    country.name = "India";
    countries.push(country);
    return countries;
  }

  getStates() {
    
    var url = this.appConfig.getApiPath("Lookup", "GetState");
    this.http.get(url).subscribe((stateList: any) => {
      
      this.stateList = stateList;

      // this.stateList = stateList.filter(stateList => stateList.isActive === true)

    }, error => {
      this.stateList = [];
    });
  }



  maharastraStateId: number = 72;
  interestedCityList: Array<City> = new Array<City>();
  getCities(stateId: number) {
    
    this.isShowLocationLoader = true;
    // var url = this.appConfig.getApiPath("Lookup", "GetCity")+"?state_id="+72;
    var url = this.appConfig.getApiPath("Lookup", "GetCity", [stateId]);
   return  this.http.get(url).subscribe((cities: any) => {
      this.cityList = cities;
      //   this.cityList = cities.filter(cities => cities.isActive === true)
      if (stateId == this.maharastraStateId)
        this.interestedCityList = cities;
      this.isShowLocationLoader = false;
    }, error => {
      this.cityList = [];
      this.isShowLocationLoader = false;
    });
  }

  isShowLocationLoader: boolean = false;
  getTalukas(cityId: number, isActiveOnly: boolean) {
    
    this.isShowLocationLoader = true;
    var url = this.appConfig.getApiPath("Lookup", "GetTalukas", [cityId, isActiveOnly]);
    this.http.get(url).subscribe((talukas: any) => {
      this.talukaList = talukas;
       this.talukaList = talukas.filter(talukas => talukas.isActive === true)
      this.isShowLocationLoader = false;
    }, error => {
      this.talukaList = [];
      this.isShowLocationLoader = false;
    });
  }

  getVillages(talukaId: number) {
   
    this.isShowLocationLoader = true;
    var url = this.appConfig.getApiPath("Lookup", "GetVillage", [talukaId]);
    this.http.get(url).subscribe((villages: any) => {
      this.villageList = villages;
      this.isShowLocationLoader = false;
    }, error => {
      this.villageList = [];
      this.isShowLocationLoader = false;
    });
  }

  getUnitTypes() {
   
    var url = this.appConfig.getApiPath("Lookup", "GetUnitType");
    this.http.get(url).subscribe((unitTypes: any) => {
      this.unitTypeList = unitTypes;
    }, error => {
      this.unitTypeList = [];
    });
  }

  getLandCategories() {
    
    var url = this.appConfig.getApiPath("Lookup", "GetLandCategory");
    this.http.get(url).subscribe((landCategoryList: any) => {
      this.landCategoryList = landCategoryList;
    }, error => {
      this.landCategoryList = [];
    });
  }

  getNewsPapers() {
    
    var url = this.appConfig.getApiPath("Lookup", "GetPaper");
    this.http.get(url).subscribe((newsPapers: any) => {
      this.newsPapers = newsPapers;
      
      // this.newsPapers = newsPapers.filter(newsPapers => newsPapers.isActive === true)
    }, error => {
      this.newsPapers = [];
    });
  }


  getNoticeType() {
    var url = this.appConfig.getApiPath("Master", "GetNoticeType");
    return this.http.get(url);
  }
  getGetKeywords() {
    var url = this.appConfig.getApiPath("Lookup", "GetKeyword");
    this.http.get(url).subscribe((keywords: any) => {
      this.keywordList = keywords;
    }, error => {
      this.keywordList = [];
    });
  }

  getInterestedCities(userId: string) {
    var getUserPreferenceCityApiUrl = this.appConfig.getApiPath("Notice", "GetUserPreferenceCity", [userId]);
    return this.http.get(getUserPreferenceCityApiUrl)
  }


  AddNotification(notification: NotificationModel) {
    var ApiUrl = this.appConfig.getApiPath("Lookup", "AddNotification");
    return this.http.post(ApiUrl, notification);
  }

  getNotification() {
    var getNotificationApiUrl = this.appConfig.getApiPath("Lookup", "GetNotification");
    return this.http.get(getNotificationApiUrl);
  }
}
