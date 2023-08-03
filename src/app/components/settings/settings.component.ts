import { Component, OnInit } from '@angular/core';
import { NotificationPreferenceEnum, NotificationPreferenceDto } from 'src/app/models/user-preferences';
import { NoticeService, AuthenticationService, LookupService } from 'src/app/services';
import { City } from 'src/app/models';
import { Router } from '@angular/router';

declare var $;
declare var toastr;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private noticeService: NoticeService,
    private lookupService: LookupService,
    private router:Router

  ) { }

  userId: string = this.authService.loggedInUser.userId;
  userPreference: any = {
    email: {
      notificationTypeId: NotificationPreferenceEnum.Email,
      isChecked: false,
      userId: this.userId,
    },
    sms: {
      notificationTypeId: NotificationPreferenceEnum.Sms,
      isChecked: false,
      userId: this.userId,
    },
    inApp: {
      notificationTypeId: NotificationPreferenceEnum.InApp,
      isChecked: false,
      userId: this.userId,
    },
  }

  ngOnInit() {
   
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      this.initCollapsePanel();
      this.getUserNotificationPreferences();
      this.getUserCityPreferenceList();
    }
    else{

      this.router.navigate(["./login"]);
    }
  }

  initCollapsePanel() {
    $(document).ready(() => {
      $('.panel-collapse').on('show.bs.collapse', function () {
        $(this).siblings('.panel-heading').addClass('active');
      });

      $('.panel-collapse').on('hide.bs.collapse', function () {
        $(this).siblings('.panel-heading').removeClass('active');
      });
    });
  }

  // NotificationPreferenceDto
  getUserNotificationPreferences() {
    let loggedInUserString:any = localStorage.getItem("LoggedInUser");
    loggedInUserString=JSON.parse(loggedInUserString);
    this.noticeService.getUserNotificationSetting(loggedInUserString.userId)
      .subscribe((notificationPreferences: Array<NotificationPreferenceDto>) => {
        this.notificationPreferenceList = notificationPreferences;
        this.notificationPreferenceList.forEach(preference => {
          switch (preference.notificationTypeId) {
            case 1:
              this.userPreference.email.isChecked = true;
              break;
            case 2:
              this.userPreference.sms.isChecked = true;
              break;
            case 3:
              this.userPreference.inApp.isChecked = true;
              break;
            default:
              break;
          }
        });
      });
  }

  isShowLoader: boolean = false;
  notificationPreferenceList: Array<NotificationPreferenceDto> = new Array<NotificationPreferenceDto>();
  onSaveUserPreferences() {
    this.isShowLoader = true;
    this.notificationPreferenceList = new Array<NotificationPreferenceDto>();
    for (var prop in this.userPreference) {
      if (this.userPreference[prop].isChecked)
        this.notificationPreferenceList.push(this.userPreference[prop]);
    }
    this.noticeService.saveUserNotificationSetting(this.notificationPreferenceList)
      .subscribe((resp: Array<NotificationPreferenceDto>) => {
        this.isShowLoader = false;
        toastr.success('Your Preferences Saved Successfully!', "Success");
      },
      error => {
        this.isShowLoader = false;
        toastr.error('Failed To Save!', "Error");
      });
  }


  cityList: Array<City> = new Array<City>();
  isInterestedCitiesLoaded: boolean = false;
  getUserCityPreferenceList() {
    var maharastraStateId = 72;
    let loggedInUserString:any = localStorage.getItem("LoggedInUser");
    loggedInUserString=JSON.parse(loggedInUserString);

    this.lookupService.getUserCityPreferenceList(maharastraStateId,loggedInUserString.userId)
      .subscribe(([cities, preferedCities]) => {
        let cityList: any = cities;
        let interestedCities: any = preferedCities;

        interestedCities.forEach(interestedCity => {
          var city = cityList.find(c => c.id == interestedCity.id);
          if (city != null)
            city.isSelected = true;
        });
        this.cityList = cityList;

        this.isInterestedCitiesLoaded = true;
      }, error => {
        this.cityList = [];
      });
  }

  onSaveInterestedCities() {
    this.isShowLoader = true;
    let interedCityList: any = this.cityList.filter(x => x.isSelected== true).map(x => x.id).join(',');
    let loggedInUserString:any = localStorage.getItem("LoggedInUser");
    loggedInUserString=JSON.parse(loggedInUserString);

    this.noticeService.addUserPreferenceCity(interedCityList,loggedInUserString.userId)
      .subscribe((response: any) => {
        this.isShowLoader = false;
        toastr.success('Successsfully Saved Interested Cities', "Success");
      },
      error => {
        this.isShowLoader = false;
        toastr.error('Failed To Save Interested Cities', "Error");
      });
  }

}
