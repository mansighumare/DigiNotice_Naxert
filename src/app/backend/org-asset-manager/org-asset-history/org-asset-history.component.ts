import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrgAssetManagerService } from 'src/app/services/org-asset-manager.service';
declare var $;

@Component({
  selector: 'app-org-asset-history',
  templateUrl: './org-asset-history.component.html',
  styleUrls: ['./org-asset-history.component.scss']
})
export class OrgAssetHistoryComponent implements OnInit {
  @Input() comments: any=[];
  @Input() documentsArray: any=[];



  isShowLoader: boolean = false;
  loggedInUserRole: any;
  loggedInUserId: any;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  loggedInUserIdBranchId: number;

  

  constructor(
    private router: Router,
    public orgAssetManagerService: OrgAssetManagerService,
    public toastr: ToastrService
  ) {
  }

  ngOnInit() {
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserIdBranchId = loggedInUserString.branch_id;
        }
    else {

      this.router.navigate(["./login"]);
    }

  }
  // getAssetComments() {
  //  
  //   this.isShowLoader = true;
  //   this.orgAssetManagerService.getPropertiesHistory(this.AssetId, this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserIdBranchId).subscribe(r => {
  //    
  //     this.comments = new Array();
  //     this.comments = r;
  //     this.isShowLoader = false;
  //   });
  // }


  closeViewPropertyPopup() {
    $("#view-asset-history").modal('hide');
  }

  Download_doc(item) {
    //
    window.open(item, "_blank");
  }
}
