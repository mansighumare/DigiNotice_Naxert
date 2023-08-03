import { Component, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services';
import { SharedModelService } from 'src/app/services';
declare var $: any;

@Component({
  selector: 'backend-navigation',
  templateUrl: 'backend-navigation.component.html',
  styleUrls: ['./backend-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackenNavigationComponent {

  collaps :boolean=true;






  constructor(
    
    private router: Router,
    private authService: AuthenticationService,
    private changeDetector: ChangeDetectorRef,
    private shared:SharedModelService
  ) { }

  loggedInUserRole: string = this.authService.loggedInUser.role;
  sideMenuPersonalList: any = [];
  sideMenuList: any = [];
  loggedInUserOrgId: any;
  orgId: any;

  @HostListener('document:click', ['$event'])
  private updateValue() {
    this.shared.getBoolean().subscribe((newValue) => {
      this.collaps = newValue;
    });
  }
  
  ngOnInit() {
    this.shared.getBoolean().subscribe({
      next:data=>{
        this.collaps=data;
      }
    }
    



    )
    var token = sessionStorage.getItem("token");
    if (token != null) {
      var tokenInfo = JSON.parse(sessionStorage.getItem("token"));
    }
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));

    if (loggedInUserString != null) {

      this.orgId = loggedInUserString.org_id;
    }
    else {
      this.router.navigate(["./login"]);
    }

    this.sideMenuPersonalList = [
      {
        "title": "Dashboard",
        "path": "./backend/organisation-dashboard",
        "route": "organisation-dashboard",
        "icon": "fa fa-th-large",
        "allowedRoles": ["Org Admin", "Manager", "Employee"],
      },
      {
        "title": "Notices",
        "path": "./backend/notices",
        "route": "notices",
        "icon": "fa fa-files-o",
        "allowedRoles": ["Org Admin", "Manager", "Employee"],
      },
      {
        "title": "Dashboard",
        "path": "./backend/dashboard",
        "route": "dashboard",
        "icon": "fa fa-th-large",
        "allowedRoles": ["SuperAdmin", "Admin", "City Admin"],
      },
      {
        "title": "Add Notice",
        "path": "./backend/add-notice",
        "route": "add-notice",
        "icon": "fa fa-plus-circle",
        "allowedRoles": ["SuperAdmin", "Admin", "City Admin", "Operator"],
      },
      {
        "title": "OCR Add Notice",
        "path": "./backend/ocr",
        "route": "ocr",
        "icon": "fa fa-plus-circle",
        "allowedRoles": ["SuperAdmin", "Admin", "City Admin", "Operator"],
      },
      {
        "title": "Notice Master",
        "path": "./backend/notice-master",
        "route": "notice-master",
        "icon": "fa fa-files-o",
        "allowedRoles": ["SuperAdmin", "Admin", "City Admin", "Operator"],
      },
      {
        "title": "Matched Notice",
        "path": "./backend/matched-notice",
        "route": "matched-notice",
        "icon": "fa fa-files-o",
        "rightIcon": "fa fa-warning",
        "allowedRoles": ["Org Admin", "Manager", "Employee"],
      },
      {
        "title": "Notification",
        "path": "./backend/acknowledge-alerts",
        "route": "acknowledge-alerts",
        "icon": "fa fa-bell",
        "rightIcon": "fa fa-warning",
        "allowedRoles": ["Org Admin", "Manager", "Employee"],
      },


      {
        "title": "Bookmark",
        "path": "./backend/bookmark",
        "route": "bookmark",
        "icon": "fa fa-bookmark",
        "allowedRoles": ["Org Admin", "Manager", "Employee", "User"],
      },
      {
        "title": "Asset Manager",
        "path": "./backend/org-asset-manager",
        "route": "org-asset-manager",
        "icon": "fa fas fa-book",
        "allowedRoles": ["Org Admin", "Manager", "Employee"],
      },
      {
        "title": "Assets Delete Requests",
        "path": "./backend/delete-assets",
        "route": "delete-assets",
        "icon": "fa fa-trash",
        "allowedRoles": ["Org Admin", "Manager"],
      },
      {
        "title": "Deleted Assets",
        "path": "./backend/deleted-assets",
        "route": "deleted-assets",
        "icon": "fa fa-trash",
        "allowedRoles": ["Org Admin", "Manager", "Employee"],
      },

     
      // Add more submenu items if needed



      {
        "title": "Performance Report",
        "path": "./backend/performance-report",
        "route": "performance-report",
        "icon": "fa fa-bar-chart",
        "allowedRoles": ["SuperAdmin", "Admin"],
      },
      {
        "title": "Location Master",
        "path": "./backend/location-master",
        "route": "location-master",
        "icon": "fa fa-globe",
        "allowedRoles": ["SuperAdmin"],
      },
      {
        "title": "Backend Users",
        "path": "./backend/backend-users",
        "route": "backend-users",
        "icon": "fa fa-users",
        "allowedRoles": ["SuperAdmin", "Admin", "City Admin"],
      },
      {
        "title": "Users",
        "path": "./backend/dg-users",
        "route": "dg-users",
        "icon": "fa fa-users",
        "allowedRoles": ["SuperAdmin"],
      },
      {
        "title": "Manage Organization",
        "path": "./backend/manage-organisation/",
        "route": "manage-organisation",
        "icon": "fa fa-building-o",
        "allowedRoles": ["SuperAdmin"],
      },
      {
        "title": "Branches",
        "path": `./backend/branches/${this.orgId}/`,
        "route": "branches",
        "icon": "fa fa-code-fork",
        "allowedRoles": ["Org Admin"],
      },
      {
        "title": "Organisation Users",
        "path": "./backend/organisation-users",
        "route": "organisation-users",
        "icon": "fa fa-users",
        "allowedRoles": ["SuperAdmin", "Org Admin", "Manager"],
      },
      {
        "title": "Assets Report",
        "path": "./backend/assets-report",
        "route": "assets-report",
        "icon": "fa fa-file",
        "rightIcon": "fa fa-warning",
        "allowedRoles": ["SuperAdmin","Org Admin"]
      },
      {
        "title": "Acknowledged Report",
        "path": "./backend/acknowledged-report",
        "route": "acknowledged-report",
        "icon": "fa fa-file",
        "rightIcon": "fa fa-warning",
        "allowedRoles": ["Org Admin", "Manager", "Employee"],
      },
      {
        "title": "Ads/Banner Master",
        "path": "./backend/addsbanner-master",
        "route": "addsbanner-master",
        "icon": "fa fa-cog",
        "allowedRoles": ["SuperAdmin"],
      },
      {
        "title": "Master Data Forms",
        "path": "./backend/masterdata-forms",
        "route": "masterdata-forms",
        "icon": "fa fa-file-text-o",
        "allowedRoles": ["SuperAdmin"],
      },
      // {
      //   "title": "Register User",
      //   "path": "./backend/register",
      //   "route": "register",
      //   "icon": "fa fa-user",
      //   "allowedRoles": ["SuperAdmin", "Admin"],
      // },
      {
        "title": "Notification",
        "path": "./backend/notification",
        "route": "notification",
        "icon": "fa fa-bell",
        "allowedRoles": ["SuperAdmin", "Admin", "Operator"],
      },

      {
        "title": "My Profile",
        "path": "./backend/my-profile",
        "route": "my-profile",
        "icon": "fa fa-user-circle",
        "allowedRoles": ["City Admin", "Admin", "Operator", "Org Admin", "Manager", "Employee", "User"],
      },

      {
        "title": "Settings",
        "path": "./backend/settings",
        "route": "settings",
        "icon": "fa fa-cog",
        "allowedRoles": ["City Admin", "Admin", "Operator", "User"],
      },

      {
        "title": "Help/Feedback",
        "path": "./backend/help-feedback",
        "route": "help-feedback",
        "icon": "fa fa-question-circle",
        "allowedRoles": ["City Admin", "Admin", "Operator", "Org Admin", "Manager", "Employee", "User"],
      },
      {
        "title": "Contact Us",
        "path": "./backend/contact-us",
        "route": "contact-us",
        "icon": "fa fa-phone-square",
        "allowedRoles": ["City Admin", "Admin", "Operator", "Org Admin", "Manager", "Employee", "User"],
      }

    ];

    this.getSideMenuByRole();
  }

  getSideMenuByRole() {
    this.sideMenuList = this.sideMenuPersonalList.filter((sideMenu: any) => {
      return sideMenu.allowedRoles.indexOf("All") >= 0 || sideMenu.allowedRoles.indexOf(this.loggedInUserRole) >= 0;
    });
    this.changeDetector.detectChanges();
  }

  ngAfterViewInit() { }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  toggleSubmenu(event: Event, menu: any) {
    event.stopPropagation(); // Prevent event propagation to parent elements
    menu.showSubmenu = !menu.showSubmenu; // Toggle the showSubmenu property
  }


  onRouterLinkClick(path: string) {
    this.router.navigate([path]);
  }
  onSignOut() {
    this.authService.onLogOut();
  }
}