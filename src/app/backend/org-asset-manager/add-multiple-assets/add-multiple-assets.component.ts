import { Component, OnInit, ViewChild } from '@angular/core';
import { OrgAssetManagerService } from 'src/app/services/org-asset-manager.service';
import * as XLSX from 'xlsx';
import { OrgAssetManagerComponent } from '../org-asset-manager.component';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
declare var $;
declare var toastr
@Component({
  selector: 'app-add-multiple-assets',
  templateUrl: './add-multiple-assets.component.html',
  styleUrls: ['./add-multiple-assets.component.scss']
})
export class AddMultipleAssetsComponent implements OnInit {
  loggedInUserRole: any;
  @ViewChild(OrgAssetManagerComponent) OrgAssetManagerComponent: OrgAssetManagerComponent;
  isShowLoader: boolean = false;
  loggedInUserId: any;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  loggedInUserBranchId: number;
  file: File | undefined;
  myFiles: any;
  data: any[] | undefined;
  Branch: any = [];
  searchFlag: number = 0;
  searchControl: FormControl = new FormControl();
  constructor(
    public orgAssetManagerService: OrgAssetManagerService,
    private router: Router
  ) { }

  ngOnInit() {

    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;
      this.getBranches();
    }
  }

  closeViewPropertyPopup() {
    $("#add-multiple-property").modal('hide');
  }

  jsonData: any = [];
  onFileChange(e) {

    let workBook = null;
    const reader = new FileReader();
    this.file = e.target.files[0];
    this.myFiles = this.file
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      this.jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
    //  console.table(this.jsonData);

    }
    reader.readAsBinaryString(this.file);
  }


  getBranches() {
    this.orgAssetManagerService.getBranchesList(
      this.loggedInUserId,
      this.loggedInUserRoleGuid,
      this.loggedInUserOrgId
    ).subscribe((r) => {

      this.Branch = r;
    });
  }


  onSelectedBranches(e) {
    this.loggedInUserBranchId = e.target.value;

  }
  dataArray: any;
  onAddProperty():any {
    
    if (!this.validateForm())
      return false;
    else {
      this.isShowLoader = true;
      this.orgAssetManagerService.uploadExcelFile(this.myFiles, this.loggedInUserOrgId, this.loggedInUserBranchId)
        .subscribe((uploadedNoticeImage) => {
          this.dataArray = this.jsonData.data;
          this.dataArray.forEach(object => {
            object.unitTypeId = "4";
            object.originalFileName = uploadedNoticeImage[0].originalFileName;
            object.orgId = this.loggedInUserOrgId;
            object.branchId = this.loggedInUserBranchId;
            object.createdBy = this.loggedInUserId;
          });

          // Remove duplicate entries
          const uniqueDataArray = Array.from(new Set(this.dataArray.map(JSON.stringify)))
            .map((item: string) => JSON.parse(item));


          this.orgAssetManagerService.addMultipleAssets(uniqueDataArray)
            .subscribe((addedRow: any) => {
              toastr.success('Property Added Successfully!', "Success");
              $("#add-multiple-property").modal('hide');
              this.isShowLoader = false;
              this.jsonData = new Array;
              //    this.OrgAssetManagerComponent.getProperties();
              this.refreshPage();
            },
              error => {
                this.isShowLoader = false;
                toastr.error('Failed to Create Property!', "Error");
              });
        },
          error => {
            toastr.error('Failed to Upload Property Image!', "Error");
            this.isShowLoader = false;
          });
    }
  }


  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }



  validateForm() {

    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Select ";

    if (this.loggedInUserRole == "Org Admin") {
      if (this.loggedInUserBranchId == 0)
        validationErrors.push("Branch");
    }
    if (this.myFiles == undefined)
      validationErrors.push("Excel File")

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }
}
