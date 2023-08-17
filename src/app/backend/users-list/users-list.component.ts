import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BackEndUser, BackEndUsersInfo } from 'src/app/models/backend-user.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/services/excel.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  // MatPaginator Inputs
  page = 1;
  pageSize = 25;
  pageSizeOptions: number[] = [3, 5, 8, 10];
  constructor(
    private reportService: ReportService,
    private accountService: AccountService,
    private excelService: ExcelService,
    private authService: AuthenticationService,
    private router: Router,
    public toastr: ToastrService
  ) { }
  loggedInUsersRole: any;
  loggedInUserRoleGuid: any;
  loggedInUserId: any;
  tbldata: any = [];
  public searchtext = '';
  filteredList: any = [];
  tbldataLength: number;
  filteredListTemp: any = [];
  isShowLoader: boolean = false;
  searchFlag:number=0;
  searchControl: FormControl = new FormControl();
  ngOnInit() {
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {
      this.loggedInUsersRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.getUsers();
    }
    else {
      this.router.navigate(["./login"]);
    }

  }


  loggedInUserRole: string = this.authService.loggedInUser.role;

  backEndUsersInfo: BackEndUsersInfo = new BackEndUsersInfo();
  isShowActiveOnly: boolean = true;

  pageInfo: any = {
    page: 1,
    pageSize: 15,
    isActive: this.isShowActiveOnly,
    searchString: ""
  };

  Refresh() {
    this.page=1;
    this.getUsers();
  }

  onChangePage(pageNumber: any): void {
    
    this.page = pageNumber.pageIndex;
    if(this.searchFlag==1){
    this.getUsers();
    }
    else{
     this.searchEndUser();
    }
  }


  endUsers: Array<BackEndUser> = new Array<BackEndUser>();
  getUsers() {
    this.isShowLoader = true;
    this.reportService.getUsers(this.loggedInUserRoleGuid, this.loggedInUserId, this.isShowActiveOnly, this.page)
      .subscribe((endUsers: Array<BackEndUser>) => {
        
        this.tbldata = endUsers;
        this.isShowLoader = false;
        this.searchFlag=1;
        if (this.tbldata== undefined) {
          this.tbldataLength = 0;
        }
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }
       
      },
        error => {
          console.log(error);
          this.isShowLoader = false;
        });
  }
  Search(){
    this.page=1;
    this.searchEndUser();
  }

  searchEndUser() {
    this.isShowLoader = true;
    if (this.searchControl.value== "" || this.searchControl.value == null) {
      this.page=1;
      this.getUsers();
    }
    else{
    this.reportService.searchEndUser(this.loggedInUserRoleGuid, this.loggedInUserId, this.isShowActiveOnly, this.page,this.searchControl.value)
      .subscribe((endUsers: Array<BackEndUser>) => {
        
        this.tbldata = endUsers;
        this.isShowLoader = false;
        this.searchFlag=2;
        if (this.tbldata== undefined) {
          this.tbldataLength = 0;
        }
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }
        
      },
        error => {
          console.log(error);
          this.isShowLoader = false;
        });
      }
  }


  AddUsers() {
    this.router.navigate(["./signup"]);
  }



  filter(e) {
    this.filteredList = this.filteredListTemp.filter(function (el) {
      var result = "";
      for (var key in el) {
        result += el[key];
      }
      return result.toLowerCase().indexOf(this.searchtext.toLowerCase()) > -1;
    }.bind(this));
    this.getUsers();
  }

  isAllLoaded: boolean = false;
  // onInfiniteScroll(e) {
  //   if (!this.isAllLoaded) {
  //     var scrollHeight = e.target.scrollHeight;
  //     var scrollTop = e.target.scrollTop;
  //     var height = e.target.offsetHeight;
  //     if ((height + scrollTop) >= scrollHeight) {
  //       this.pageInfo.page++;
  //       this.getUsers();
  //     }
  //   }
  // }

  // onActiveInActive(backEndUser: BackEndUser) {
  //   backEndUser.isActive = !backEndUser.isActive;
  //   this.isShowLoader = true;
  //   var userInfo = {
  //     "userId": backEndUser.userId,
  //     "isActive": backEndUser.isActive,
  //     "isDeleted": false
  //   };
  //   this.reportService.activeInActiveUser(userInfo)
  //     .subscribe((isUpdated: boolean) => {
  //       this.isShowLoader = false;
  //       if (isUpdated) {
  //         var status = userInfo.isActive ? "Active" : "InActive";
  //         toastr.success('Updated User status to ' + status + '!', "Success");
  //       } else {
  //         toastr.error('Failed to update user status.', "Error");
  //       }
  //     },
  //     error => {
  //       this.isShowLoader = false;
  //       toastr.error('Failed to update user status.', "Error");
  //     });
  // }


  onActiveInActive(e) {
    var isActive = !e.isActive;
    var userIntId = e.userIntId;
    var userId = e.id;
    this.reportService.updateUserStatus(
      userIntId,
      userId,
      isActive
    ).subscribe(
      (addedRow: any) => {
        let message = addedRow[0].message;
        this.toastr.success(message, "Success");
        this.isShowLoader = false;
        this.getUsers();
      },
      (error) => {
        this.isShowLoader = false;
        this.toastr.error("Failed to Update User!", "Error");
      }
    );
  }

  onUserDelete(backEndUser: BackEndUser) {
    backEndUser.isActive = !backEndUser.isActive;
  }



  onShowActiveOnly() {
    this.isShowActiveOnly = !this.isShowActiveOnly;
    this.getUsers();
  }

  exportAsXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.tbldata.map(o => {
      return {
        FirstName: o.firstName,
        LastName: o.lastName,
        Email: o.email,
        Role: o.role,
        Phone: o.phone,
        Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'User Information');
    this.isShowLoader = false;
  }
  returnstring(isActive: any) {
    if (isActive == true) {
      return 'Active';
    }
    else {
      return 'InActive';
    }
  }
}
