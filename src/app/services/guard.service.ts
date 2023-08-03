import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
//import { JwtHelper } from 'angular2-jwt';

import { Observable, of as observableOf } from 'rxjs';
import { CookieOptionsArgs, ICurrentUser } from '../interfaces/user';
import { AuthenticationService } from '../services/authentication.service';

declare var toastr;
@Injectable({
  providedIn: 'root'
})

export class GuardService implements CanActivate {
  currentUser: ICurrentUser;
  //jwtHelper: JwtHelper = new JwtHelper();
  _cookieOptionsArgs: CookieOptionsArgs;
  
  constructor(private authService: AuthenticationService,private router: Router) {
    this.currentUser = this.initializeUser();
   }

  //Returns true if user is logged in
  isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  // //Check If User Is Logged in and user has role and permissions for route
  // canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  //   var allowedRoles = activatedRouteSnapshot.data["roles"];
  //   var canActivate = false;
  //   if (allowedRoles.indexOf("All") >= 0)
  //     canActivate = true;

  //   if (allowedRoles.indexOf(this.authService.loggedInUser.role) >= 0)
  //     canActivate = true;

  //   if (canActivate == false && this.isLoggedIn() == false) {
  //     toastr.info("Please login", "Info");
  //     this.authService.goToLogin();
  //   }

  //   return observableOf(canActivate);
  // }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // if ( !this.authenticationService.isTokenExpired()) {
    //   // logged in so return true
    //   return true;
    // }
    // if (localStorage.getItem(CONFIGURATION.constants.refreshTemp)) {
    //   let refreshuser = JSON.parse(localStorage.getItem(CONFIGURATION.constants.refreshTemp));

    //   if (tokenNotExpired(null, refreshuser.access_token)) {
    //     let _token = this.jwtHelper.decodeToken(refreshuser.access_token);        
    //     this.currentUser.UserName = _token.unique_name;
    //     this.currentUser.UserID = Number(_token.sub);    
    //     this.currentUser.Roles = _token.role;
    //     this.currentUser.AccessToken = refreshuser.access_token;
    //     this.currentUser.RefreshToken=refreshuser.refresh_token;
    //     this.currentUser.ProfilePicture=refreshuser.profilePicture;

    //     this.currentUser.FirstName=_token.firstName;
    //     this.currentUser.LastName=_token.lastName;
    //     this.currentUser.UserID=_token.sub;
    //     this.currentUser.RoleID=_token.roleid;
    //     this.currentUser.Email=_token.email
    //     this.currentUser.user_guid=_token.userGUID;
    //     this.currentUser.client_guid=_token.clientGUID;
    //     this.currentUser.client_id=_token.clientId;
    //     this.currentUser.role_guid=_token.roleGUID;
    //     this.currentUser.app_guid=_token.appGUID;
    //     this.currentUser.isMultipleApps=_token.MultipleApps;
    //     this.currentUser.is_agency=_token.IsAgency;
    //     this.currentUser.parent_client_id=Number(_token.ParentClientId);
    //     this.currentUser.parent_client_guid=_token.ParentClientGuid;
    //     this.currentUser.is_system_defined=_token.IsSystemDefined;
    //     this.currentUser.client_app_guid=_token.ClientAppGuid;
    //     this.currentUser.is_demo_acc=_token.IsDemoAcc;
    //     this.currentUser.is_display_left_menu=_token.is_display_left_menu;
    //     this.currentUser.is_display_right_menu=_token.is_display_right_menu;
    //     this.currentUser.is_display_top_menu=_token.is_display_top_menu;
    //     this.currentUser.is_tour_completed=_token.is_tour_completed;
    //     this.currentUser.is_pay_now=_token.is_pay_now;

    //     localStorage.setItem(CONFIGURATION.constants.localStorageKey, JSON.stringify(this.currentUser));        
    //     localStorage.removeItem(CONFIGURATION.constants.refreshTemp);

    //     return true;
    //   }
    // }

    //var v= this._cookieService.get(CONFIGURATION.constants.CookieName);
    //   if (this._cookieService.get(CONFIGURATION.constants.CookieName)) {
    //     let user = JSON.parse(this._cookieService.get(CONFIGURATION.constants.CookieName));
  //     if (tokenNotExpired(null, user.AccessToken)) {
    //         //localStorage.setItem(CONFIGURATION.constants.localStorageKey, JSON.stringify(user));
    //         // logged in so return true
    //         return true;
    //     }

    // }

    if (localStorage.getItem('LoggedInUser')) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  initializeUser(): ICurrentUser {
    return {
      name: '',
      userIntId: 0,
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      Phone: '',
      AccessToken: '',
      RefreshToken: '',
      Roles: [],
      role:'',
      RoleID: 0,
      ProfilePicture: '',      
      role_guid: '',
      is_system_defined: false,
      isActive: false,
      isDeleted: false,
      designation:'',
      address:'',
      companyname:'',
      org_id:'',
      branch_id:'',
      branchName:'',
      branchDisplayName:'',
      orgName:'',
      orgDisplayName:'',
      logoURL:''
    };
  }

  //   SetCookie(key: string, value: Object, options?: CookieOptionsArgs): void {
  //     this._cookieService.putObject(key, value, this._cookieOptionsArgs);
  //   }
  // GetCookie() {
  //     return this._cookieService.get(CONFIGURATION.constants.CookieName);
  // }
  // RemoveCookie() {
  //     this._cookieService.remove(CONFIGURATION.constants.CookieName, this._cookieOptionsArgs);
  // }


  initializeCookieOptions(): CookieOptionsArgs {
    return {
      domain: 'localhost',
      path: '',
      secure: true,
      expires: this.expiryDate(),
      httpOnly: true
    };
  }
  expiryDate(): Date {
    var _date = new Date();
    return new Date(_date.setMinutes(_date.getMinutes() + 1440));
  }
}
