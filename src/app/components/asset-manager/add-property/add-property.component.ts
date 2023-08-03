import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AddPropertyModel } from '../../../models';
import { SharedModelService, AssetManagerService, LookupService, AppConfig } from 'src/app/services';
import { AssetImage } from 'src/app/models/asset-manager';

declare var toastr;
declare var $;
// declare var _initDropZone;
declare var ui_multi_add_file;
declare var ui_multi_update_file_status;
declare var ui_multi_update_file_progress;

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {
  @Output() onPropertyCreated: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<string> = new EventEmitter();
  @Output() onPropertyUpdated: EventEmitter<string> = new EventEmitter();
  isShowLoader: boolean = false;
  addPropertyModel: AddPropertyModel = new AddPropertyModel();

  constructor(
    public sharedModel: SharedModelService,
    public assetManagerService: AssetManagerService,
    private appConfig: AppConfig,
    public lookupService: LookupService) {
  }

  public is_add_other_details: boolean = false;
  ngOnInit() {

    var uploadUrl = this.assetManagerService.uploadPropertyImgUrl;
    this._initDropZone();

  }

  myFiles: any = [];
  getFileDetails(e) {

    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  propertyImage: any = [];
  _initDropZone() {

    var _self = this;
    $(document).on('change', '.btn-file :file', function () {
      var input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [label]);
    });

    $('.btn-file :file').on('fileselect', function (event, label) {

      var input = $(this).parents('.input-group').find(':text'),
        log = label;

      if (input.length) {
        input.val(log);
      } else {
        if (log) alert(log);
      }
    });
    function readURL(input) {


      for (var i = 0; i < input.files.length; i++) {
        if (input.files && input.files[i]) {
          _self.propertyImage = input.files[i];

          var reader = new FileReader();
          reader.onload = function (e) {
            _self.displayImages(e.target["result"]);

            // $("#previewImg").append("<img class='thumb' src='" + e.target.result + "'>");
            // $('#img-upload').attr('src', e.target["result"]);
          }
          reader.readAsDataURL(input.files[i]);
        }
      }
    }

    $("#imgInp").change(function () {
      readURL(this);
    });
  }

  propertyImagelist: any = [];
  displayImages(files: any) {

    let propetyImage: AssetImage = new AssetImage();
    propetyImage.fileName = files;
    propetyImage.originalFileName = files.originalFileName;
    propetyImage.imageTypeId = 3;
    propetyImage.name = files.name;
    propetyImage.isDeleted = false;
    propetyImage.isAdded = true;
    this.propertyImagelist.push(propetyImage);
  }


  uploadImages: any = [];
  onRemoveImage(propetyImage: AssetImage, removeIndex: number) {

    this.uploadImages = [];
    propetyImage.isDeleted = true;
    var names = this.propertyImagelist[removeIndex];
    const i = this.propertyImagelist.indexOf(names, 0);
    if (i > -1) {
      this.propertyImagelist.splice(i, 1);
    }
    var name = this.myFiles[removeIndex];
    const index = this.myFiles.indexOf(name, 0);
    if (index > -1) {
      this.myFiles.splice(index, 1);
    }
  }


  onStateChange($event) {
    var stateId = $event.target.value;
    this.addPropertyModel.cityId = "";
    this.addPropertyModel.talukaId = "";
    this.addPropertyModel.villageId = "";
    this.lookupService.cityList = [];
    this.lookupService.talukaList = [];
    this.lookupService.villageList = [];

    this.lookupService.getCities(stateId);
  }

  onDistrictChange(cityId: string, reset: boolean = true) {
    if (reset) {
      this.addPropertyModel.talukaId = "";
      this.addPropertyModel.villageId = "";
      this.lookupService.talukaList = [];
      this.lookupService.villageList = [];
    }
    this.lookupService.getTalukas(Number(cityId));
  }

  onTalukaChange(talukaId: string, reset: boolean = true) {
    if (reset) {
      this.addPropertyModel.villageId = "";
      this.lookupService.villageList = [];
    }
    this.lookupService.getVillages(Number(talukaId));
  }

  onResetFields() {
    this.addPropertyModel = new AddPropertyModel();
  }
  onEnterKeyPressOther($event: any) {
    this.is_add_other_details = !this.is_add_other_details
  }

  onInsertKeyword($event, keyword, propName) {
    document.execCommand('insertText', false, " " + keyword + " ");
    return false;
  }
  validateForm() {
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please enter ";
    if (this.addPropertyModel.ownerFullName.trim() == "")
      validationErrors.push("Name");

    if (this.addPropertyModel.cityId == "")
      validationErrors.push("District");
    if (this.addPropertyModel.talukaId == "")
      validationErrors.push("Taluka");
    if (this.addPropertyModel.villageId == "")
      validationErrors.push("Village");

    if (this.addPropertyModel.surveyNumber.trim() == "" && this.addPropertyModel.gatNumber.trim() == "" && this.addPropertyModel.plotNumber.trim() == "" && this.addPropertyModel.ctsnumber.trim() == "")
      validationErrors.push("Survey/Gat/Plot/CTS Number");

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }

  isSaving: boolean = false;
  onAddProperty():any {
    if (!this.validateForm())
      return false;    

    this.isSaving = true;

    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);

    if (loggedInUserString)
      this.addPropertyModel.createdBy = loggedInUserString.userId;

    this.assetManagerService.uploadAssestImage(this.myFiles[0])
      .subscribe((uploadedPropertyImage: Array<AssetImage>) => {

        let assetImage: AssetImage = new AssetImage();
        assetImage.id = 0;
        assetImage.isDeleted = false;
        assetImage.isAdded = true;
        assetImage.imageTypeId = 2;
        assetImage.name = uploadedPropertyImage[0].originalFileName;
        assetImage.originalFileName = uploadedPropertyImage[0].originalFileName;
        //assetImage.imageUrl = this.appConfig.propertyImgPath + assetImage.name;
        this.addPropertyModel.assetImages.push(assetImage);
        this.assetManagerService.addProperty(this.addPropertyModel)
          .subscribe((createdProperty: any) => {
            toastr.success('Property Added Successsfully!', "Success");
            this.isSaving = false;
            this.addPropertyModel = new AddPropertyModel();
            $("#add-property-modal").modal('hide');
            this.onPropertyCreated.emit(createdProperty);
            this.isShowLoader = false;
          },
            error => {
              this.isSaving = false;
              toastr.error('Failed to create property!', "Error");
              this.isShowLoader = false;
            });
      },
        error => {
          toastr.error('Failed to Upload Property Image!', "Error");
        });
  }

  onFileChange(event) {
    // this.addPropertyModel.assetImages = event.target.files;
  }
}