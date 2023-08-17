import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AddNoticeModel } from '../../models';
import { SharedModelService, NoticeService, LookupService, AppConfig } from 'src/app/services';
import { NoticeAdvocateModel, NoticeDetail, NoticeImage } from 'src/app/models/notice-info';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { Subscription, debounceTime, of, startWith, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// declare var _initDropZone;
declare var ui_multi_add_file;
declare var ui_multi_update_file_status;
declare var ui_multi_update_file_progress;
@Component({
  selector: 'app-edit-notice',
  templateUrl: './edit-notice.component.html',
  styleUrls: ['./edit-notice.component.scss']
})
export class EditNoticeComponent implements OnInit {
  public flag: boolean = false;
  @Input() editNoticeModel: AddNoticeModel = null;
  @Output() onClose: EventEmitter<string> = new EventEmitter();
  @Output() afterUpdate: EventEmitter<AddNoticeModel> = new EventEmitter();
  @Output() onPropertyUpdated: EventEmitter<string> = new EventEmitter();
  @Input() NoticeType: any = [];
  @Input() isBanking: any = false;
  personList: Array<NoticeAdvocateModel> = new Array<NoticeAdvocateModel>();

  constructor(
    public sharedModel: SharedModelService,
    public noticeService: NoticeService,
    private appConfig: AppConfig,
    public lookupService: LookupService,
    public router: Router,
    public http: HttpClient,
    public toastr: ToastrService) { }

  $imagePreviewEle: any = null;
  //isBanking:boolean;
  public is_add_other_details: boolean = false;
  subscription: Subscription = new Subscription();
  searchControl: FormControl = new FormControl();
  ngOnInit() {
    this.noticeImagelist = [];
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    //  this.editNoticeModel.landCategoryId = this.editNoticeModel.landCategoryId + "";
    if (loggedInUserString != null) {
      $(document).ready(() => {
        this.$imagePreviewEle = $('#img-upload');
        var uploadUrl = this.noticeService.uploadNoticeImgUrl;
        this._initDropZone();
        let newDate = new Date(this.editNoticeModel.publishedDate);
        this.noticeService.initDateRangePickerUpdate(newDate);
        this.$imagePreviewEle.attr('src', this.editNoticeModel.imageUrl);
      });
      //this.getNoticeType();

      this.editNoticeModel.noticeImage.forEach(image => {
        image.fileName = image.name;//this.appConfig.imagePath +
        image.isDeleted = false;
        this.editNoticeModel.imageUrl = image.name;//this.appConfig.imagePath + 
        this.noticeImagelist.push(image);
        this.myFiles.push(image);
      });
      this.searchControl.setValue(this.editNoticeModel.advocateName)

      this.subscription.add(
        this.searchControl.valueChanges.pipe(
          startWith(''),
          debounceTime(500),
          switchMap(value => {
            if (!!value.length && value.length > 4) {
              this.flag = true;
              return this.http.get(`https://api.diginotice.in/api/Notice/GetAdvocateList/${value}`)
            } else {
              return of([]);
            }
          })
        ).subscribe((personList: any) => {
          this.personList = personList;
          this.isShowLoader = false;
        })
      );




      this.onDistrictChange(this.editNoticeModel.cityId.toString(), false);
      this.onTalukaChange(this.editNoticeModel.talukaId.toString(), false);

      $('#edit-notice-popup').on('hidden.bs.modal', () => {
        this.addNoticeDetail = new NoticeDetail();
        this.editNoticeModel.noticeDetailList = [];
        this.onClose.emit("Close");
      });

    }
    else {
      this.router.navigate(["./login"]);
    }
  }


  persondetail(person) {
    this.searchControl.setValue(person.fullName);
    this.editNoticeModel.advocateAddress = person.address1;
    this.editNoticeModel.advocatePhone = person.mobileNo;
    this.editNoticeModel.advocateName = person.fullName;
    this.editNoticeModel.personId = person.id;
    this.flag = false;
    document.getElementById("pListId").style.zIndex = "0";
  }


  onNoticeTypeChange(event) {
    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    const selectedNoticeType = this.NoticeType[selectedIndex];
    this.editNoticeModel.noticeTypeId = selectedNoticeType.id;
    this.editNoticeModel.noticeTitle = selectedNoticeType.name;
    this.isBanking = selectedNoticeType.isBanking;

  }

  getNoticeType() {

    this.lookupService.getNoticeType().subscribe(
      (r) => {

        this.NoticeType = r;
        this.NoticeType = this.NoticeType.filter(notice => notice.isActive === true);
      }
    );
  }
  onSelectNoticeType(e) {
    if (e == true) {
      this.editNoticeModel.isPaid = "true"
    }
    else {
      this.editNoticeModel.isPaid = "false"
    }
  }


  onSelectPublisher(e) {
    if (e == true) {
      this.editNoticeModel.isPublisher = "true"
    }
    else {
      this.editNoticeModel.isPublisher = "false"
    }
  }
  onDistrictChange(cityId: string, reset: boolean = true) {
    if (reset) {
      this.editNoticeModel.talukaId = undefined;
      this.editNoticeModel.villageId = undefined;
      this.lookupService.talukaList = [];
      this.lookupService.villageList = [];
    }
    this.lookupService.getTalukas(Number(cityId));
  }

  onTalukaChange(talukaId: string, reset: boolean = true) {
    if (reset) {
      this.editNoticeModel.villageId = undefined;
      this.lookupService.villageList = [];
    }
    this.lookupService.getVillages(Number(talukaId));
  }

  myFiles: any = [];
  getFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  noticeImagelist: any = [];
  displayImages(files: any) {
    let noticeImage: NoticeImage = new NoticeImage();
    noticeImage.fileName = files;
    noticeImage.originalFileName = files.originalFileName;
    noticeImage.name = files.name;
    noticeImage.isDeleted = false;
    noticeImage.isAdded = true;
    this.noticeImagelist.push(noticeImage);
  }

  uploadImages: any = [];
  onRemoveImage(noticeImage: NoticeImage, removeIndex: number) {
    this.uploadImages = [];
    noticeImage.isDeleted = true;
    var names = this.noticeImagelist[removeIndex];
    const i = this.noticeImagelist.indexOf(names, 0);
    if (i > -1) {
      this.noticeImagelist.splice(i, 1);
    }
    var name = this.myFiles[removeIndex];
    const index = this.myFiles.indexOf(name, 0);
    if (index > -1) {
      this.myFiles.splice(index, 1);
    }
  }

  isShowLoader: boolean = false;
  count:number;
  onAddNotice():any {
    if (this.editNoticeModel.noticeImage == null) {
      this.toastr.info('Please select notice image!', "Info");
      return false;
    }
    if (this.editNoticeModel.noticeDetailList.length == 0) {
      this.count+100;
      this.onAddNoticeDetail();
    }
    this.editNoticeModel.noticeDetailList.forEach((notice: NoticeDetail) => {
      if (notice.unitTypeId == "") {
        notice.area = "Not Mentioned";
      }
      else {
        var areaJson = {
          hectorH: notice.hectorH,
          hectorR: notice.hectorR,
          squareFeet: notice.squareFeet,
          squareMeter: notice.squareMeter,
          potKharab: notice.potKharab,
          var: notice.var,
          foot: notice.foot,
          acre: notice.acre,
        }
        notice.area = JSON.stringify(areaJson);
      }
    });

    this.isShowLoader = true;

    this.noticeService.addNotice(this.editNoticeModel)
      .subscribe((addedRow: any) => {
        this.toastr.success('Notice Added Successsfully!', "Success");
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
          this.toastr.error('Failed to create notice!', "Error");
        });
  }

  noticeImage: any = null;
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
        // if (log) alert(log);
      }
    });
    function readURL(input) {
      for (var i = 0; i < input.files.length; i++) {
        if (input.files && input.files[i]) {
          _self.noticeImage = input.files[i];

          var reader = new FileReader();
          reader.onload = function (e) {
            _self.displayImages(e.target["result"]);
          }
          reader.readAsDataURL(input.files[i]);
        }
        // if (input.files && input.files[0]) {
        //   _self.noticeImage = input.files[0];
        // //  _self.uploadNoticeImage();
        //   var reader = new FileReader();
        //   reader.onload = function (e) {

        //     $('#img-upload').attr('src', e.target["result"]);
        //   }
        //   reader.readAsDataURL(input.files[0]);
      }
    }

    $("#imgInp").change(function () {
      readURL(this);
    });
  }
  //  originalFileName=null;
  //   uploadNoticeImage() {

  //     this.noticeService.uploadNoticeImage(this.myFiles)
  //       .subscribe((uploadedImage: Array<NoticeImage>) => {
  //        

  //         this.originalFileName = uploadedImage.originalFileName;
  //       },
  //       error => {
  //         toastr.error('Failed to upload notice image!', "Error");
  //       });
  //   }

  addNoticeDetail:any = new NoticeDetail();
  onAddNoticeDetail() {
    if (this.addNoticeDetail.surveyNumber.trim() == "" && this.addNoticeDetail.gatNumber.trim() == "" && this.addNoticeDetail.plotNumber.trim() == "") {
      this.toastr.error("Please enter Survey/Gat/Plot Number", "Info");
      return false;
    }

    let noticeDetail = JSON.parse(JSON.stringify(this.addNoticeDetail));
    this.editNoticeModel.noticeDetailList.push(noticeDetail);
    this.addNoticeDetail = new NoticeDetail();
    return true;
  }

  onRemoveNoticeDetail(removeIndex: number) {
    this.editNoticeModel.noticeDetailList.splice(removeIndex, 1);
  }

  onInsertKeyword($event, keyword, propName) {
    document.execCommand('insertText', false, " " + keyword + " ");
    return false;
  }

  insertAtCursor(myField, myValue) {
    //IE support
    // if (document.getSelection()) {
    //   myField.focus();
    //   var sel = document.getSelection().createRange();
    //   sel.text = myValue;
    // }
    //MOZILLA and others
    // else
    if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos)
        + myValue
        + myField.value.substring(endPos, myField.value.length);
    } else {
      myField.value += myValue;
    }
  }

  onClearUploads() {
    this.editNoticeModel.noticeImage == null;
    $("#files").html('<li class="text-muted text-center empty">No files uploaded.</li>');
  }

  validateForm() {
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please enter ";
    if (this.editNoticeModel.ownerFullName.trim() == "")
      validationErrors.push("Owner Name");

    if (this.editNoticeModel.cityId == undefined)
      validationErrors.push("District");
    if (this.editNoticeModel.talukaId == undefined)
      validationErrors.push("Taluka");
    if (this.editNoticeModel.villageId == undefined)
      validationErrors.push("Village");

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      this.toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }

  onUpdateNotice():any {
    if (!this.validateForm())
      return false;

    if (this.editNoticeModel.noticeDetailList.length == 0) {
      if (!this.onAddNoticeDetail())
        return false;
    }

    if (this.editNoticeModel.noticeImage == null) {
      this.toastr.error('Please select notice image!', "Error");
      return false;
    }
    var $dateField = $('#txtNoticeDate');
    this.editNoticeModel.publishedDate = $dateField.data('daterangepicker').startDate.format('YYYY-MM-DD');
    this.editNoticeModel.noticeDetailList.forEach((notice: NoticeDetail) => {
      if (notice.unitTypeId == "") {
        notice.area = "Not Mentioned";
      } else {
        var areaJson = {
          hectorH: notice.hectorH,
          hectorR: notice.hectorR,
          squareFeet: notice.squareFeet,
          squareMeter: notice.squareMeter,
          potKharab: notice.potKharab,
          var: notice.var,
          foot: notice.foot,
          acre: notice.acre,
        }
        notice.area = JSON.stringify(areaJson);
      }
    });
    this.lookupService.newsPapers.forEach((newsPaper: any) => {
      if (this.editNoticeModel.paperId == newsPaper.id) {
        this.editNoticeModel.paperName = newsPaper.name;
      }
    });
    this.lookupService.cityList.forEach((city: any) => {
      if (this.editNoticeModel.cityId == city.id) {
        this.editNoticeModel.cityName = city.name;
      }
    });

    this.lookupService.landCategoryList.forEach((landCategory: any) => {
      if (this.editNoticeModel.landCategoryId == landCategory.id) {
        this.editNoticeModel.landCategoryName = landCategory.name;
      }
    });
    this.isShowLoader = true;
    this.editNoticeModel.countryId = 1;
    //  if(this.originalFileName!=null){
    //  this.editNoticeModel.noticeImage.name=this.originalFileName;
    //}
    this.editNoticeModel.noticeImage = [];
    this.editNoticeModel.advocateName = this.searchControl.value;
    this.noticeService.uploadNoticeImage(this.myFiles)
      .subscribe((uploadedImages: Array<NoticeImage>) => {

        this.myFiles.forEach(myfile => {

          if (myfile.hasOwnProperty("fileName")) {
            myfile.originalFileName = myfile.name;
            this.editNoticeModel.noticeImage.push(myfile);
          }
        });
        uploadedImages.forEach(uploadedImage => {
          uploadedImage.id = 0;
          this.editNoticeModel.noticeImage.push(uploadedImage);
        });

        this.noticeService.updateNotice(this.editNoticeModel)
          .subscribe((updatedNotice: AddNoticeModel) => {
            this.toastr.success('Notice Updated Successsfully!', "Success");
            this.isShowLoader = false;
            // this.editNoticeModel = new AddNoticeModel();
            $("#edit-notice-popup").modal('hide');

            this.afterUpdate.emit(this.editNoticeModel);
          },
            error => {
              this.isShowLoader = false;
              this.toastr.error('Failed to Update Notice!', "Error");
            });
      },
        error => {
          this.toastr.error('Failed to upload notice image!', "Error");
        });
  }

  onNoticeStatusChange(editNoticeModel: AddNoticeModel) {
    editNoticeModel.isActive = !editNoticeModel.isActive;
  }

  onKeyPressValidateNumber($event: any) {
    const charCode = ($event.which) ? $event.which : $event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      $event.preventDefault();
      return false;
    }
    return true;
  }


  onNoticePeriodInput($event: any) {
    let noticePeriod: number = Number($event.target.value);
    if (noticePeriod > 30)
      $event.target.value = 30;
  }

  onAreaUnitChange(removeIndex: number) {

    this.editNoticeModel.noticeDetailList.forEach((notice: NoticeDetail, index: number) => {
      if (index == removeIndex) {
        notice.area = "";
        notice.hectorH = undefined;
        notice.hectorR = undefined;
        notice.squareFeet = undefined;
        notice.squareMeter = undefined;
        notice.potKharab = undefined;
        notice.var = undefined;
        notice.foot = undefined;
        notice.acre = undefined;
      }
    });
  }

  onEnterKeyPressAdd($event: any) {

    if ($event.keyCode == 13) {
      this.onAddNoticeDetail();
    }
  }

}