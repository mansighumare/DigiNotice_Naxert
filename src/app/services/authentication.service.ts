import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoggedInUser } from 'src/app/models/account.model';
import { AppConfig } from 'src/app/services/config.service';
//import { JwtHelper } from 'angular2-jwt';
import { ICurrentUser } from '../interfaces/user';
import { catchError, map } from 'rxjs/operators';
//import { ResponseHelperService } from './response-helper.service';

declare var $;
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  currentUser: ICurrentUser;
  //jwtHelper: JwtHelper = new JwtHelper();

  private apiUrl: string;
  private authUrl: string;
  private refreshtokenbody: string = "refresh_token=%%refreshtoken%%&grant_type=refresh_token&client_id=007153c2625149bc8ecb3e85e03f0055";
  private authenticationTokenBody: string = "username=%%username%%&password=%%password%%&grant_type=password&client_id=007153c2625149bc8ecb3e85e03f0055";
  constructor(
    private router: Router,
    private appConfig: AppConfig,
    private http: HttpClient,
    //private _helper: ResponseHelperService
    ) {

    this.apiUrl = this.appConfig.apiUrl;
    this.authUrl = this.appConfig.authUrl;

    this.setUser();
    this.IdentityUser = this.initializeUser();
  }

  get IdentityUser(): ICurrentUser {
    return this.currentUser;
  }
  set IdentityUser(user) {
    this.currentUser = user;
  }

  public setUser() {
    this.isLoggedIn = false;
    this.loggedInUser = new LoggedInUser();
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      this.loggedInUser = JSON.parse(loggedInUserString);
      this.isLoggedIn = true;
      this.setNames();
    }
  }

  setLoggedInUser(loggedInUser: LoggedInUser) {
    localStorage.setItem("LoggedInUser", JSON.stringify(loggedInUser));
    this.loggedInUser = loggedInUser;
    this.isLoggedIn = true;
    this.navigateByUserRole();

    this.setNames();
  }

  public isLoggedIn: boolean = false;
  isAuthenticated() {
    var token = this.getToken();
    return token != null;
  }

  onLogIn(token: string) {
    this.isLoggedIn = true;
  }

  onLogOut() {
    this.isLoggedIn = false;
    this.clearAuthToken();
    this.router.navigate(['/login']);  
  }

  setLoggedInUserInLocalStorage() {
    localStorage.setItem("LoggedInUser", JSON.stringify(this.loggedInUser));
    this.setNames();
  }

  fullName: string = "";
  initials: string = "";
  setNames() {
    if (this.loggedInUser != null && this.loggedInUser.firstName != null && this.loggedInUser.lastName != null) {
      this.fullName = this.loggedInUser.firstName + " " + this.loggedInUser.lastName;
      this.initials = this.loggedInUser.firstName[0] + this.loggedInUser.lastName[0];
    }
  }

  logoutUser() {  
    this.clearAuthToken();
    this.IdentityUser = this.initializeUser();
    //this.authService.signOut();    
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegisterAccount() {
    //this.router.navigate(['/register']);
  }

  setAuthToken(body: any) {    
    localStorage.setItem('token', JSON.stringify(body));
    //let _token = this.jwtHelper.decodeToken(body.access_token.trim());
    let _token=atob(body.access_token.trim().split('.')[1]);
    _token=JSON.parse(_token);
    this.currentUser.name = _token["unique_name"];
    this.currentUser.userIntId = Number(_token.sub);
    this.currentUser.role = _token["role"];
    this.currentUser.AccessToken = body.access_token;
    this.currentUser.RefreshToken = body.refresh_token;
    this.currentUser.ProfilePicture = body.profilePicture;
    this.currentUser.firstName = _token["firstName"];
    this.currentUser.lastName = _token["lastName"];
    //this.currentUser.userIntId = _token["sub"];
    this.currentUser.RoleID = _token["roleid"];
    this.currentUser.email = _token["email"];
    this.currentUser.userId = body.userGuid;
    this.currentUser.role_guid = _token["roleGUID"];
    this.currentUser.org_id = _token["orgId"];
    this.currentUser.branch_id = _token["branchId"];
    this.currentUser.Phone = _token["phone"];
    this.currentUser.is_system_defined = _token["IsSystemDefined"];
    this.currentUser.branchName = _token["branchName"];
    this.currentUser.branchDisplayName = _token["branchDisplayName"];
    this.currentUser.orgName = _token["orgName"];
    this.currentUser.orgDisplayName = _token["orgDisplayName"];
    this.currentUser.logoURL = _token["logoURL"];



    localStorage.setItem("LoggedInUser", JSON.stringify(this.currentUser));

    this.loggedInUser = this.currentUser;
    this.isLoggedIn = true;
    this.navigateByUserRole();
    this.setNames();
  }

  loggedInUser: LoggedInUser;
  getLoggedInUser() {
    var url = this.appConfig.getApiPath("Account", "GetUser");
    return this.http.get(url);
  }

  clearAuthToken() {
    localStorage.clear();
    localStorage.removeItem("LoggedInUser");
    localStorage.removeItem("token");
  }

  getToken() {
    var tokenString = localStorage.getItem('LoggedInUser');
    if (tokenString != null) {
      var token = JSON.parse(tokenString);
      return token.AccessToken;
    }
    return '';
  }

  navigateByUserRole() {

    switch (this.loggedInUser.role) {
      case "SuperAdmin":
        this.router.navigateByUrl('/backend/dashboard');
        break;
      case "Admin":
        this.router.navigateByUrl('/backend/dashboard');
        break;
      case "City Admin":
        this.router.navigateByUrl('/backend/dashboard');
        break;
      case "Operator":
        this.router.navigateByUrl('/backend/add-notice');
        break;
      case "Org Admin":
        this.router.navigateByUrl('/backend/organisation-dashboard');
        break;
      case "Manager":
        this.router.navigateByUrl('/backend/organisation-dashboard');
        break;
      case "Employee":
        this.router.navigateByUrl('/backend/organisation-dashboard');
        break;
      case "User":
        this.router.navigate(['/dashboard']);
        break;
      default:
        // this.router.navigate(['/dashboard']);
        break;
    }
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
      role: '',
      RoleID: 0,
      ProfilePicture: '',
      role_guid: '',
      is_system_defined: false,
      isActive: false,
      isDeleted: false,
      designation: '',
      address: '',
      companyname: '',
      org_id: '',
      branch_id: '',
      branchName:'',
      branchDisplayName:'',
      orgName:'',
      orgDisplayName:'',
      logoURL:''
    };
  }

  login = (username: string, password: string, location: string) => {
    let headers = new HttpHeaders();
    let tokenURL = this.authUrl + 'TOKEN';
    let requestBody = this.authenticationTokenBody.replace('%%username%%', username).replace('%%password%%', password);
    //headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //headers.append('Accept', 'application/json');
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Accept', 'application/json');

    return this.http.post(tokenURL, requestBody,{ headers: headers }).pipe(
      map((response: Response) => {
        debugger;
        // login successful if there's a jwt token in the response
        let body = response;//.json();
        if (body) {
          //localStorage.setItem("token", body.access_token.trim());
          this.setAuthToken(body);
          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      }),catchError(null));
  }

  refreshToken(): any {
    let currentUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    let token = currentUser.RefreshToken;
    let headers = new HttpHeaders();
    let tokenURL = this.authUrl + 'TOKEN';
    let requestBody = this.refreshtokenbody.replace('%%refreshtoken%%', token);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');

    return this.http.post(tokenURL, requestBody, { headers: headers }).pipe(
      map((response: Response) => {
        // login successful if there's a jwt token in the response
        let body = response.json();
        if (body) {
          //localStorage.setItem(CONFIGURATION.constants.refreshTemp, JSON.stringify(body));
          this.setRefreshTokenCurrentUserInfo(body);
          return this.currentUser;
        } else {
          // return false to indicate failed login
          return false;
        }
      })
      , catchError(null));
  }

  setRefreshTokenCurrentUserInfo = (body) => {
    
    //
    //let _token = this.jwtHelper.decodeToken(body.access_token);
    let _token=atob(body.access_token.trim().split('.')[1]);

    if (localStorage.getItem('LoggedInUser')) {
      let oldtokeninfo = JSON.parse(localStorage.getItem('LoggedInUser'));

      this.currentUser.name = oldtokeninfo.unique_name;
      this.currentUser.userIntId = Number(oldtokeninfo.sub);
      this.currentUser.role = oldtokeninfo.role;
      this.currentUser.AccessToken = body.access_token;
      this.currentUser.RefreshToken = body.refresh_token;
      this.currentUser.ProfilePicture = body.profilePicture;
      this.currentUser.firstName = oldtokeninfo.firstName;
      this.currentUser.lastName = oldtokeninfo.lastName;
      this.currentUser.userIntId = oldtokeninfo.sub;
      this.currentUser.RoleID = oldtokeninfo.roleid;
      this.currentUser.email = oldtokeninfo.email
      this.currentUser.userId = body.userGuid;
      this.currentUser.role_guid = oldtokeninfo.roleGUID;
      this.currentUser.org_id = oldtokeninfo.orgId;
      this.currentUser.branch_id = oldtokeninfo.branchId;
      this.currentUser.Phone = oldtokeninfo.phone;
      this.currentUser.is_system_defined = oldtokeninfo.IsSystemDefined;
      this.currentUser.branchName=oldtokeninfo.branchName;
      this.currentUser.branchDisplayName=oldtokeninfo.branchDisplayName;
      this.currentUser.orgName=oldtokeninfo.orgName;
      this.currentUser.orgDisplayName=oldtokeninfo.orgDisplayName;
      this.currentUser.logoURL = oldtokeninfo.logoURL;

    }
    else {
      this.currentUser.name = _token["unique_name"];
      this.currentUser.userIntId = Number(_token.sub);
      this.currentUser.role = _token["role"];
      this.currentUser.AccessToken = body.access_token;
      this.currentUser.RefreshToken = body.refresh_token;
      this.currentUser.ProfilePicture = body.profilePicture;
      this.currentUser.firstName = _token["firstName"];
      this.currentUser.lastName = _token["lastName"];
      //this.currentUser.userIntId = _token.sub;
      this.currentUser.RoleID = _token["roleid"];
      this.currentUser.email = _token["email"]
      this.currentUser.userId = body.userGuid;
      this.currentUser.role_guid = _token["roleGUID"];
      this.currentUser.org_id = _token["orgId"];
      this.currentUser.branch_id = _token["branchId"];
      this.currentUser.Phone = _token["phone"];
      this.currentUser.is_system_defined = _token["IsSystemDefined"];
      this.currentUser.branchName=_token["branchName"];
      this.currentUser.branchDisplayName=_token["branchDisplayName"];
      this.currentUser.orgName=_token["orgName"];
      this.currentUser.orgDisplayName=_token["orgDisplayName"];
      this.currentUser.logoURL = _token["logoURL"];
    }
    localStorage.setItem('LoggedInUser', JSON.stringify(this.currentUser));
  }

}