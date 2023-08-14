import { Component, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, SharedModelService, AppConfig } from 'src/app/services';
import { AccountService } from 'src/app/services/account.service';

declare var $;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html',
  styleUrls: ['./navigation.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  collaps :boolean=true;

  @HostListener('document:click', ['$event'])
  private updateValue() {
    this.shared.getBoolean().subscribe((newValue) => {
      this.collaps = newValue;
    });
  }
  constructor(
    public accountService: AccountService,
    private router: Router,
    public authService: AuthenticationService,
    public sharedModelService: SharedModelService,
    private changeDetectorRef: ChangeDetectorRef,
    public appConfig: AppConfig,
    private shared:SharedModelService
  ) { }

  sideMenuPersonalList: any = [];
  sideMenuProfessionalList: any = []; 
  ngOnInit() { 
    this.sideMenuPersonalList = [
      {
        "title": "Dashboard",
        "path": "./dashboard",
        "route": "dashboard",
        "icon": "fa fa-th-large",
      },
      // {
      //   "title": "Notices",
      //   "path": "./notices",
      //   "route": "notices",
      //   "icon": "fa fa-th-large",
      // },
      {
        "title": "Asset Mananger",
        "path": "./asset-manager",
        "route": "asset-manager",
        "icon": "fa fas fa-book",
      },
      {
        "title": "Bookmark",
        "path": "./bookmark",
        "route": "bookmark",
        "icon": "fa fa-bookmark",
      },
      {
        "title": "Matched Notice",
        "path": "./matched-notice",
        "route": "matched-notice",
        "icon": "fa fa-files-o",
        "rightIcon": "fa fa-warning"
      },
      {
        "title": "My Profile",
        "path": "./my-profile",
        "route": "my-profile",
        "icon": "fa fa-user-circle",
      },
    ];

    this.sideMenuProfessionalList = [
      {
        "title": "Settings",
        "path": "./settings",
        "route": "settings",
        "icon": "fa fa-cog",
      },
      {
        "title": "Help/Feedback",
        "path": "./help-feedback",
        "route": "help-feedback",
        "icon": "fa fa-question-circle",
      },
      {
        "title": "Contact Us",
        "path": "./contact-us",
        "route": "contact-us",
        "icon": "fa fa-phone-square",
      },
    ];

    let loggedInUserString:any = localStorage.getItem("LoggedInUser");
    loggedInUserString=JSON.parse(loggedInUserString);

    // this.sharedModelService.getMatchedNoticeCount(loggedInUserString.userId)
    //   .subscribe((matchedNoticeCount: number) => {
    //     this.sharedModelService.matchedNoticeCount = matchedNoticeCount;
    //     this.changeDetectorRef.detectChanges();
    //   },
    //     error => { });
  }

  ngAfterViewInit() {
    // $('#side-menu').metisMenu();

    // if ($("body").hasClass('fixed-sidebar')) {
    //   $('.sidebar-collapse').slimscroll({
    //     height: '100%'
    //   })
    // }
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  onRouterLinkClick(path: string) {
    this.router.navigate([path]);
  }

  onSignOut() {
    this.authService.onLogOut();
  }

}
