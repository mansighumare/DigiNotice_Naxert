import { Component, Input, OnInit } from '@angular/core';
import { SharedModelService, AssetManagerService, AppConfig } from '../../services';
import { PropertyImg, EditPropertyModel, AssetImage, AddPropertyModel } from 'src/app/models/asset-manager';
import { Router } from '@angular/router';

declare var $;
declare var toastr

@Component({
  selector: 'app-asset-manager',
  templateUrl: './asset-manager.component.html',
  styleUrls: ['./asset-manager.component.scss']
})
export class AssetManagerComponent implements OnInit {

  constructor(
    private appConfig: AppConfig,
    public assetManagerService: AssetManagerService,
    public sharedModelService: SharedModelService,
    private router: Router) { }
    @Input() editPropertyModel: EditPropertyModel = null;

  propertyList: Array<EditPropertyModel> = new Array<EditPropertyModel>();
  isShowLoader: boolean = false;

  ngOnInit() {
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    if (loggedInUserString != null) {
      this.getProperties();
    }
    else {
      this.router.navigate(["./login"]);
    }
  }

  getProperties() {
    this.isShowLoader = true;
    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.assetManagerService.getProperties(loggedInUserString.userId)
      .subscribe((propertyList: Array<EditPropertyModel>) => {
        this.propertyList = propertyList;
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }

  onPropertyCreated(createdProperty: any) {
    // this.propertyList.push(createdProperty);
    this.getProperties();
  }

  onDeleteProperty(editPropertyModel: EditPropertyModel) {
    var id = editPropertyModel.id;
    //
    this.isShowLoader = true;
    this.assetManagerService.deleteProperty(id)
      .subscribe((property: EditPropertyModel) => {
        this.isShowLoader = false;
        toastr.success('Property Deleted Successsfully!', "Success");
        // this.propertyList.splice(editPropertyModel.propertyIndex, 1);
        this.getProperties();
      },
        error => {
          this.isShowLoader = false;
        });
  }

  viewProperty: EditPropertyModel = new EditPropertyModel();
  onViewProperty(editPropertyModel: EditPropertyModel) {
    if (editPropertyModel.assetImages != null) {
      editPropertyModel.assetImages.forEach((propertyImage: AssetImage) => {
        if (propertyImage.isDeleted != true) {
          propertyImage.imageUrl = this.appConfig.propertyImgPath + propertyImage.name;
        }
      });
    }
    this.viewProperty = editPropertyModel;
    $("#view-property-popup").modal("show");
  }

  editProperty: EditPropertyModel = new EditPropertyModel();
  onEditProperty(editPropertyModel: EditPropertyModel) {
   
    
    this.editProperty = editPropertyModel;
    this.showEditPropertyPopup();
  }

  isShowEditPropertyPopup: boolean = false;
  showEditPropertyPopup() {
    this.isShowEditPropertyPopup = true;
    setTimeout(() => { $("#edit-property-popup").modal('show'); }, 100);
  }

  onEditPopupClose() {
    $("#edit-property-popup").modal('hide');
    setTimeout(() => { this.isShowEditPropertyPopup = false; }, 100);
  }

}