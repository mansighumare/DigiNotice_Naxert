import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditPropertyModel, AssetImage } from 'src/app/models/asset-manager';
import { LookupService, AppConfig, AssetManagerService } from 'src/app/services';

declare var toastr;
declare var $;
// declare var _initDropZone;
declare var ui_multi_add_file;
declare var ui_multi_update_file_status;
declare var ui_multi_update_file_progress;

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss']
})
export class EditPropertyComponent implements OnInit {

  @Input() editPropertyModel: EditPropertyModel = null;
  @Output() onClose: EventEmitter<string> = new EventEmitter();
  @Output() onPropertyUpdated: EventEmitter<string> = new EventEmitter();

  constructor(
    public appConfig: AppConfig,
    public assetManagerService: AssetManagerService,
    public lookupService: LookupService) {

  }
  public is_add_other_details:boolean=false;
  ngOnInit() {

    $(document).ready(() => {
      setTimeout(() => {
        this._initDropZone();
      }, 100);
    });

   this.editPropertyModel.landCategoryId = this.editPropertyModel.landCategoryId + "";
    this.editPropertyModel.cityId = this.editPropertyModel.cityId + "";
    this.editPropertyModel.talukaId = this.editPropertyModel.talukaId + "";
    this.editPropertyModel.villageId = this.editPropertyModel.villageId + "";

    if(this.editPropertyModel.assetImages)
    {
      this.editPropertyModel.assetImages.forEach((properyImage: AssetImage) => {
        properyImage.originalFileName = properyImage.name;
      });
    }

    this.onDistrictChange(this.editPropertyModel.cityId, false);
    this.onTalukaChange(this.editPropertyModel.talukaId, false);

    $('#edit-property-popup').on('hidden.bs.modal', () => {
      this.onClose.emit("Close");
    });
  }

  _initDropZone() {
   
    this.addAssetImageSlot();
  }

  onStateChange(e){

  }




  addAssetImageSlot() {
   
    var $imgContainer = $("#edit-property-popup").find("#asset-image-container");
    var $box = $imgContainer.find('.box').last();
    this.initImageUpload($box);
  }

  initImageUpload($box) {
   
    var _self = this;
    let uploadField = $box.find('.image-upload');
    uploadField.on('change', function (e):any {
      let file = e.currentTarget.files[0];

      if (_self.editPropertyModel.assetImages.length >= 4) {
        toastr.info('You can add maximum 4 property images.', "Error");
        return false;
      }

      //Add asset image
      _self.uploadAssetImage(file);

      let $thumb = $box.find('.js--image-preview'),
        reader = new FileReader();
      reader.onload = function () {
        // $thumb.css("backgroundImage", 'url(' + reader.result + ')');
        // $thumb.addClass('js--no-default');
        if ($("#asset-image-container").children().length >= 4)
          _self.addAssetImageSlot();
      }
      reader.readAsDataURL(file);
    });
  }

  uploadAssetImage(imageFile: any) {
   
    this.assetManagerService.uploadAssestImage(imageFile)
      .subscribe((uploadResponse: any) => {
        let assetImage: AssetImage = new AssetImage();
        assetImage.id = 0;
        assetImage.isDeleted = false;
        assetImage.isAdded = true;
        assetImage.imageTypeId = 2;
        assetImage.name = uploadResponse[0].originalFileName;
        assetImage.originalFileName = uploadResponse[0].originalFileName;
        this.editPropertyModel.assetImages.push(assetImage);
      },
      error => {
        toastr.error('Failed to upload assest image!', "Error");
      });
  }

  
  onInsertKeyword($event, keyword, propName) {
    document.execCommand('insertText', false, " " + keyword + " ");
    return false;
  }
  
onPropertyTypeChange(e){
 
  this.editPropertyModel.landCategoryId=e;
}


  onRemoveImage(assetImage: AssetImage, removeIndex: number) {
    assetImage.isDeleted = true;
   
    var images = this.editPropertyModel.assetImages;
    this.editPropertyModel.assetImages=[];
    images.forEach((propertyImage: AssetImage) => {
      if(propertyImage.isDeleted != true){
        this.editPropertyModel.assetImages.push(propertyImage);
      }
    });
  }

  onDistrictChange(cityId: string, reset: boolean = true) {
    if (reset) {
      this.editPropertyModel.talukaId = "";
      this.editPropertyModel.villageId = "";
      this.lookupService.talukaList = [];
      this.lookupService.villageList = [];
    }
    this.lookupService.getTalukas(Number(cityId));
  }

  onTalukaChange(talukaId: string, reset: boolean = true) {
    if (reset) {
      this.editPropertyModel.villageId = "";
      this.lookupService.villageList = [];
    }
    this.lookupService.getVillages(Number(talukaId));
  }

  isSaving: boolean = false;
  onResetFields() {
  }

  validateForm() {
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please enter ";
    if (this.editPropertyModel.ownerFullName.trim() == "")
      validationErrors.push("Name");

    if (this.editPropertyModel.cityId == "")
      validationErrors.push("District");
    if (this.editPropertyModel.talukaId == "")
      validationErrors.push("Taluka");
    if (this.editPropertyModel.villageId == "")
      validationErrors.push("Village");

    if (this.editPropertyModel.surveyNumber.trim() == "" && this.editPropertyModel.fullGatNumber.trim() == "" && this.editPropertyModel.plotNumber.trim() == "")
      validationErrors.push("Survey/Gat/Plot Number");

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }

  onUpdateProperty():any {  
   
    if (!this.validateForm())
      return false;

    this.isSaving = true; 
    this.assetManagerService.updateProperty(this.editPropertyModel)
      .subscribe((updatedProperty: any) => {
        toastr.success('Property Updated Successsfully!', "Success");
        this.isSaving = false;
        this.editPropertyModel = new EditPropertyModel();
        $("#edit-property-popup").modal('hide');
      },
      error => {
        this.isSaving = false;
        toastr.error('Failed to update property!', "Error");
      });
  }
}