import { Component, OnInit, Input } from '@angular/core';
import {
  AddAdBannerWebModel,
  AddAdBannerMobileTopModel,
  AddAdBannerMobileNoticeModel,
  AddAdBannerWebNoticeModel,
} from 'src/app/models/AdBanner';
import { AdBannerService } from 'src/app/services/ad-banner.service';
//import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AppConfig } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-add-new-ad-banner',
  templateUrl: './add-new-ad-banner.component.html',
  styleUrls: ['./add-new-ad-banner.component.scss'],
})
export class AddNewAdBannerComponent implements OnInit {
  selectedImage: string | ArrayBuffer | null = null;
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  @Input() editAdBannerModel: AddAdBannerWebModel = new AddAdBannerWebModel();

  AdBannerModelPopup: AddAdBannerWebModel = new AddAdBannerWebModel();
  AdBannerModel: AddAdBannerWebModel = new AddAdBannerWebModel();
  AdBannerMobTopModel: AddAdBannerMobileTopModel =
    new AddAdBannerMobileTopModel();
  AdBannerMobNtcModel: AddAdBannerMobileNoticeModel =
    new AddAdBannerMobileNoticeModel();

  AdBannerWebNtcModel: AddAdBannerWebNoticeModel =
    new AddAdBannerWebNoticeModel();
  isShowLoader: boolean = false;
  isShowRowOrder: boolean = true;
  MaxRowOrderByType: number;

  public imagePath;
  imgURL: any;
  public message: string;
  public imagePathMobTop;
  imgURLMobTop: any;
  public imagePathMobNtc;
  imgURLMobNtc: any;
  public imagePathWebNtc;
  imgURLWebNtc: any;

  AddEditLogo: string = 'Add';
  @Input() selectedIndex: number;

  ifEdit() {
    // this.AdBannerModelPopup = this.modalService.config['data'] != undefined ? this.modalService.config['data' ] : {}
    if (this.AdBannerModelPopup == undefined) {
      this.isShowRowOrder = false;
    }
    if (this.AdBannerModelPopup.id !== undefined) {
      this.AddEditLogo = 'Update';
      var url: string;
      if (this.AdBannerModelPopup.imageType == 1) {
        this.isShowRowOrder = true;
        // this.getMaxRowOrderByImageType(this.AdBannerModelPopup.imageType);
        this.AdBannerModel = this.AdBannerModelPopup;

        url = this.AdBannerModel.imagePath.substr(
          this.AdBannerModel.imagePath.lastIndexOf('/') + 1,
          this.AdBannerModel.imagePath.length - 1
        );
        this.imgURL = this.appConfig.imageAdBannerPath + url;
        this.tabIndex = 0;
      } else if (this.AdBannerModelPopup.imageType == 2) {
        this.isShowRowOrder = true;
        // this.getMaxRowOrderByImageType(this.AdBannerModelPopup.imageType);
        this.AdBannerMobTopModel = this.AdBannerModelPopup;

        url = this.AdBannerMobTopModel.imagePath.substr(
          this.AdBannerMobTopModel.imagePath.lastIndexOf('/') + 1,
          this.AdBannerMobTopModel.imagePath.length - 1
        );
        this.imgURLMobTop = this.appConfig.imageAdBannerPath + url;
        this.tabIndex = 1;
      } else if (this.AdBannerModelPopup.imageType == 3) {
        this.isShowRowOrder = true;
        //  this.getMaxRowOrderByImageType(this.AdBannerModelPopup.imageType);
        this.AdBannerMobNtcModel = this.AdBannerModelPopup;

        url = this.AdBannerMobNtcModel.imagePath.substr(
          this.AdBannerMobNtcModel.imagePath.lastIndexOf('/') + 1,
          this.AdBannerMobNtcModel.imagePath.length - 1
        );
        this.imgURLMobNtc = this.appConfig.imageAdBannerPath + url;
        this.tabIndex = 2;
      } else if (this.AdBannerModelPopup.imageType == 4) {
        this.isShowRowOrder = true;
        //  this.getMaxRowOrderByImageType(this.AdBannerModelPopup.imageType);
        this.AdBannerWebNtcModel = this.AdBannerModelPopup;

        url = this.AdBannerWebNtcModel.imagePath.substr(
          this.AdBannerWebNtcModel.imagePath.lastIndexOf('/') + 1,
          this.AdBannerWebNtcModel.imagePath.length - 1
        );
        this.imgURLWebNtc =
          this.appConfig.imageAdBannerPath + this.AdBannerMobNtcModel.imagePath;
        this.tabIndex = 3;
      } else {
        this.tabIndex = 0;
      }
    }
  }
  tabIndex: number = 0;
  tabIsActive: number = 10;
  constructor(
    public adBannerService: AdBannerService,
    // private modalService:BsModalService,
    // private bsModalRef:BsModalRef,
    private toastr: ToastrService,
    public appConfig: AppConfig,
    private shared: SharedServiceService
  ) { }

  ngOnInit() {
    this.editAdBannerModel = this.shared.editAdBannerModel;
    this.AdBannerModel = this.shared.editAdBannerModel;
    this.AdBannerModelPopup = this.shared.editAdBannerModel;
    // console.log(this.shared.editAdBannerModel);
    this.ifEdit();
    this.selectedImage = this.shared.editAdBannerModel.imagePath;
  }

  matTabSelect(event) {
    var index = event.index;
    if (index == 0) {
      this.getMaxRowOrderByImageType(1);
    } else if (index == 1) {
      this.getMaxRowOrderByImageType(2);
    } else if (index == 2) {
      this.getMaxRowOrderByImageType(3);
    } else if (index == 3) {
      this.getMaxRowOrderByImageType(4);
    }
  }

  getMaxRowOrderByImageType(imageType: number) {
    this.adBannerService
      .GetAdBannerRowByType(imageType)
      .subscribe((maxRowOrderByType: any) => {
        this.MaxRowOrderByType = maxRowOrderByType;
      });
  }

  previewWeb(filesWeb) {
    if (filesWeb.length === 0) return;

    var mimeType = filesWeb[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    var reader = new FileReader();
    this.imagePath = filesWeb;
    reader.readAsDataURL(filesWeb[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }
  previewMolieTop(files) {
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    var reader = new FileReader();
    this.imagePathMobTop = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURLMobTop = reader.result;
    };
  }

  previewMolieNtc(files) {
    if (files.length === 0) return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    var reader = new FileReader();
    this.imagePathMobNtc = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURLMobNtc = reader.result;
    };
  }

  previewWebNtc(files) {
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    var reader = new FileReader();
    this.imagePathWebNtc = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURLWebNtc = reader.result;
    };
  }
  adBannerAddEdit: AddAdBannerWebModel = new AddAdBannerWebModel();
  public ImagePathAdBanner;

  onAddAdBanner(data: number) {
    var url: string;
    if (data == 1) {
      this.adBannerAddEdit = this.AdBannerModel;
      this.adBannerAddEdit.imageType = 1;
      this.ImagePathAdBanner = this.imagePath;
      if (
        this.adBannerAddEdit.imagePath !== null &&
        this.imagePath == undefined
      ) {
        var url: string;
        url = this.adBannerAddEdit.imagePath.substr(
          this.adBannerAddEdit.imagePath.lastIndexOf('/') + 1,
          this.adBannerAddEdit.imagePath.length - 1
        );
        this.adBannerAddEdit.imagePath = url;
        this.EditAdBanner(this.adBannerAddEdit, this.imagePath);
      } else {
        this.AddAdBanner(this.adBannerAddEdit, this.ImagePathAdBanner);
      }
    } else if (data == 2) {
      this.adBannerAddEdit = this.AdBannerMobTopModel;
      this.adBannerAddEdit.imageType = 2;
      this.ImagePathAdBanner = this.imagePathMobTop;
      if (
        this.adBannerAddEdit.imagePath !== null &&
        this.imagePathMobTop == undefined
      ) {
        url = this.adBannerAddEdit.imagePath.substr(
          this.adBannerAddEdit.imagePath.lastIndexOf('/') + 1,
          this.adBannerAddEdit.imagePath.length - 1
        );
        this.adBannerAddEdit.imagePath = url;
        this.EditAdBanner(this.adBannerAddEdit, this.imagePathMobTop);
      } else {
        this.AddAdBanner(this.adBannerAddEdit, this.ImagePathAdBanner);
      }
    } else if (data == 3) {
      this.adBannerAddEdit = this.AdBannerMobNtcModel;
      this.adBannerAddEdit.imageType = 3;
      this.ImagePathAdBanner = this.imagePathMobNtc;
      if (
        this.adBannerAddEdit.imagePath !== null &&
        this.imagePathMobNtc == undefined
      ) {
        url = this.adBannerAddEdit.imagePath.substr(
          this.adBannerAddEdit.imagePath.lastIndexOf('/') + 1,
          this.adBannerAddEdit.imagePath.length - 1
        );
        this.adBannerAddEdit.imagePath = url;
        this.EditAdBanner(this.adBannerAddEdit, this.imagePathMobNtc);
      } else {
        this.AddAdBanner(this.adBannerAddEdit, this.ImagePathAdBanner);
      }
    } else if (data == 4) {
      this.adBannerAddEdit = this.AdBannerWebNtcModel;
      this.adBannerAddEdit.imageType = 4;
      this.ImagePathAdBanner = this.imagePathWebNtc;
      if (
        this.adBannerAddEdit.imagePath !== null &&
        this.imagePathWebNtc == undefined
      ) {
        url = this.adBannerAddEdit.imagePath.substr(
          this.adBannerAddEdit.imagePath.lastIndexOf('/') + 1,
          this.adBannerAddEdit.imagePath.length - 1
        );
        this.adBannerAddEdit.imagePath = url;
        this.EditAdBanner(this.adBannerAddEdit, this.imagePathWebNtc);
      } else {
        this.AddAdBanner(this.adBannerAddEdit, this.ImagePathAdBanner);
      }
    }
  }
  AddAdBanner(adBanner: AddAdBannerWebModel, imagePath: any) {
    if (adBanner.userName == '') {
      this.toastr.warning('Please Enter User Name!', 'Warning');
    } else if (adBanner.adUrl == '') {
      this.toastr.warning('Please Enter Ad Url!', 'Warning');
    } else if (imagePath == null) {
      this.toastr.warning('Please Insert Image!', 'Warning');
    } else if (imagePath !== undefined) {
      this.adBannerService
        .uploadBannerImage(imagePath[0])
        .subscribe((imageName: string) => {
          adBanner.imagePath = imageName;
          this.adBannerService.addAdBanner(adBanner).subscribe(
            (addedRow: any) => {
              this.adBannerService.AddAdBannerList();
              this.toastr.success('AdBanner Added Successsfully!', 'Success');
              this.isShowLoader = false;
              this.CloseForm();
            },
            (error) => {
              this.isShowLoader = false;
              this.toastr.error('Failed to create AdBanner!', 'Error');
            }
          );
        });
    }
  }
  EditAdBanner(adBanner: AddAdBannerWebModel, imagepath: any) {
    if (adBanner.userName == '') {
      this.toastr.warning('Please Enter User Name!', 'Warning');
    } else if (adBanner.adUrl == '') {
      this.toastr.warning('Please Enter Ad Url!', 'Warning');
    } else if (imagepath == undefined && adBanner.imagePath == '') {
      this.toastr.warning('Please Insert Image!', 'Warning');
      //imagepath ==undefined &&
    } else if (adBanner.imagePath != null) {
      this.adBannerService.addAdBanner(adBanner).subscribe(
        (addedRow: any) => {
          this.adBannerService.AddAdBannerList();
          let message = addedRow[0].column1;
          this.toastr.success(message, 'Success');
          this.isShowLoader = false;
          this.clearForm();
        },
        (error) => {
          this.isShowLoader = false;
          this.toastr.error('Failed to create AdBanner!', 'Error');
        }
      );
    }
  }

  clearForm() {
    this.AdBannerModel.imagePath = '';
    this.AdBannerModel.userName = '';
    this.AdBannerModel.adUrl = '';

    this.AdBannerMobTopModel.imagePath = '';
    this.AdBannerMobTopModel.userName = '';
    this.AdBannerMobTopModel.adUrl = '';

    this.AdBannerMobNtcModel.imagePath = '';
    this.AdBannerMobNtcModel.userName = '';
    this.AdBannerMobNtcModel.adUrl = '';

    this.AdBannerWebNtcModel.imagePath = '';
    this.AdBannerWebNtcModel.userName = '';
    this.AdBannerWebNtcModel.adUrl = '';
    this.imgURL = null;
    this.imagePath = null;
    this.imgURLMobNtc = null;
    this.imagePathMobNtc = null;
    this.imgURLMobTop = null;
    this.imagePathMobTop = null;
    this.adBannerService.getAddAdBannerList();
  }

  CloseForm() {
    // this.bsModalRef.hide();
  }

  onKeyPressValidateNumber($event: any) {
    const charCode = $event.which ? $event.which : $event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      $event.preventDefault();
      return false;
    }
    var val = $event.target.value;
    return true;
  }

  onNoticePeriodInput($event: any, index: number) {
    // let noticePeriod: number = Number(($any)($event.target).value);
    // if (noticePeriod > this.MaxRowOrderByType ){
    //   $event.target.value = this.MaxRowOrderByType;
    //   if(index==1){
    //     this.AdBannerModel.rowOrder= $event.target.value;
    //   }
    //   else if(index==2){
    //     this.AdBannerMobTopModel.rowOrder= $event.target.value;
    //   }
    //   else if(index==3){
    //     this.AdBannerMobNtcModel.rowOrder= $event.target.value;
    //   }
    //   else if(index==4){
    //     this.AdBannerWebNtcModel.rowOrder= $event.target.value;
    //   }
    // }
  }
}
