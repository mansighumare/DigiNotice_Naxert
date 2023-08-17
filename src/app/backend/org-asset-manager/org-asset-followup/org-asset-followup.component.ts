import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DocumentsModel, EditOrgPropertyModel } from 'src/app/models/org-asset-manager';
import { OrgAssetManagerService } from 'src/app/services/org-asset-manager.service';
declare var $;

@Component({
  selector: 'app-org-asset-followup',
  templateUrl: './org-asset-followup.component.html',
  styleUrls: ['./org-asset-followup.component.scss']
})
export class OrgAssetFollowupComponent implements OnInit {
  @Input() AssetId: any;
  @Input() viewpropertyfollowup: any = [];
  isShowLoader: boolean = false;
  filesarray: any=[];
  comments: string;
  @ViewChild('myInputfile') myInputFileVariable: ElementRef;
  Documents_parameters: DocumentsModel;
  loggedInUserRole: any;
  loggedInUserId: any;
  loggedInUserRoleGuid: any;
  loggedInUserOrgId: any;
  loggedInUserBranchId: number;
  constructor(public orgAssetManagerService: OrgAssetManagerService, private cdRef: ChangeDetectorRef,
    public toastr: ToastrService) { }

  ngOnInit() {
    this.filesarray = new Array();
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;
    }
  }

  closeViewPropertyPopup() {
    $("#view-property-followup").modal('hide');
  }

  onMultipleFileChange(event: any) {
    this.isShowLoader = true;
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
     
      const file: File = event.target.files[0];
      //console.log('size', file.size);
      if (file.size > 5242880) {
        this.toastr.error("File is too big. Max File Size: 5 MB", "Validation error");
        this.isShowLoader = false;
        return;
      }
      let files = [].slice.call(event.target.files);
      let date = new Date();
     
      this.orgAssetManagerService.post_multile_Files(files, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(
        data => {
          if (data) {
            // Clear the input   
            data.forEach(eledata => {
              this.filesarray.push(eledata);
            });

            this.showSuccess();
            this.isShowLoader = false;
          }
          else {
            this.isShowLoader = false;
          }
        },
        error => {
          console.log("Error Occurred while uploading file : " + error);
          this.showUploadError();
          this.isShowLoader = false;
        }
      );
    }
    else {
      this.isShowLoader = false;
    }
   
    this.myInputFileVariable = null;
    this.cdRef.detectChanges();
  }



  showSuccess() {
    this.toastr.success("File Added Successfully.", "Success");
  }

  showUploadError() {
    this.toastr.error("An error occurred while uploading file.", "Validation error");
  }

  Download_doc(item) {
    //
    window.open(item, "_blank");
  }



  SaveDocList() {
   
    this.isShowLoader = true;

    if (!this.filesarray) {
      this.toastr.error("Please upload documents.", "Validation error");
      this.isShowLoader = false;
      return;
    }
    if (!this.comments) {
      this.toastr.error("Please enter comments", "Validation error");
      this.isShowLoader = false;
      return;
    }
    this.Documents_parameters = new DocumentsModel();
    this.Documents_parameters.files_array = this.filesarray;
    this.Documents_parameters.comments = this.comments;
    this.Documents_parameters.assetId = this.AssetId;
    if (this.loggedInUserRoleGuid == "5A684E94-A768-45B7-8A2E-1F3BF22FC8B4") {
      this.Documents_parameters.BranchId = this.viewpropertyfollowup.branchId;
      this.Documents_parameters.createdBy = this.loggedInUserId;
      this.Documents_parameters.OrgId = this.loggedInUserOrgId;
      this.Documents_parameters.Role_id = this.loggedInUserRoleGuid;
    }
    else {
      this.Documents_parameters.createdBy = this.loggedInUserId;
      this.Documents_parameters.OrgId = this.loggedInUserOrgId;
      this.Documents_parameters.BranchId = this.loggedInUserBranchId;
      this.Documents_parameters.Role_id = this.loggedInUserRoleGuid;
    }


    this.orgAssetManagerService.saveFollupData(this.Documents_parameters).subscribe(
      data => {
        this.isShowLoader = false;
        this.toastr.success("Documents saved successfully.", "Success");
        $("#view-property-followup").modal('hide');
        this.filesarray = new Array();
      });
  }
  deletefilefromfilearray(index) {
    this.filesarray.splice(index, 1);
  }

}
