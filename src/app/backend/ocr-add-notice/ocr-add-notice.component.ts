import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OcrAddNoticeModel, OcrNoticeDetail, OcrNoticeImage } from 'src/app/models/ocr-notice-info';
import { SharedModelService, NoticeService, LookupService } from 'src/app/services';
import { OcrServiceService } from 'src/app/services/ocr-service.service';
declare var toastr;
declare var $;

@Component({
  selector: 'app-ocr-add-notice',
  templateUrl: './ocr-add-notice.component.html',
  styleUrls: ['./ocr-add-notice.component.scss']
})
export class OcrAddNoticeComponent implements OnInit {

  constructor(
    public sharedModel: SharedModelService,
    public ocrServiceService: OcrServiceService,
    public lookupService: LookupService,
    public router: Router,
    public http: HttpClient
  ) { }
  addNoticeModel: OcrAddNoticeModel = new OcrAddNoticeModel();
  addNoticeDetail: OcrNoticeDetail = new OcrNoticeDetail();
  public is_add_other_details: boolean = false;
  subscription: Subscription = new Subscription();
  searchControl: FormControl = new FormControl();
  public flag: boolean = false;
  isShowLoader: boolean = false;
  NoticeType: any = [];
  isBanking: boolean;
  key: any;
  loggedInUserRole: string;
  loggedInUserRoleGuid: string;
  loggedInUserId: string;
  ngOnInit() {
    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;

      $(document).ready(() => {
        var uploadUrl = this.ocrServiceService.uploadNoticeImgUrl;
        this._initDropZone();
        this.ocrServiceService.initDateRangePicker();
      });

      this.getNoticeType();
    }
    else {
      this.router.navigate(["./login"]);
    }
  }
  getNoticeType() {
    this.lookupService.getNoticeType().subscribe(
      (r) => {
        this.NoticeType = r;
        this.NoticeType = this.NoticeType.filter(notice => notice.isActive === true);
      }
    );
  }

  noticeImage: any = [];

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
      if (input.files.length > 1) {
        // Display an error message if multiple files are selected
        toastr.error('Please select only one file.', "Error");
        return;
      }

      if (input.files && input.files[0]) {
        _self.noticeImage = input.files[0];

        var reader = new FileReader();
        reader.onload = function (e) {
          _self.displayImages(e.target["result"]);
          // $("#previewImg").append("<img class='thumb' src='" + e.target.result + "'>");
          // $('#img-upload').attr('src', e.target["result"]);
        }
        reader.readAsDataURL(input.files[0]);
      }

      _self.UploadNoticeImage();
    }

    $("#imgInp").change(function () {
      readURL(this);
    });
  }


  noticeImagelist: any = [];
  displayImages(files: any) {
    let noticeImage: OcrNoticeImage = new OcrNoticeImage();
    noticeImage.fileName = files;
    noticeImage.originalFileName = files.originalFileName;
    noticeImage.name = files.name;
    noticeImage.isDeleted = false;
    noticeImage.isAdded = true;
    this.noticeImagelist.push(noticeImage);
  }
  myFiles: any = [];
  getFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }
  validateForm() {

    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";
    // if (this.addNoticeModel.ownerFullName.trim() == "")
    //   validationErrors.push("Owner Name");
    if (this.addNoticeModel.noticeTypeId == 0 || this.addNoticeModel.noticeTypeId == null)
      validationErrors.push("Notice Title");
    if (this.addNoticeModel.paperId == 0 || this.addNoticeModel.paperId == undefined)
      validationErrors.push("Paper");
    if (this.addNoticeModel.noticePeriod == undefined || this.addNoticeModel.noticePeriod == null)
      validationErrors.push("Notice Period");
    if (this.addNoticeModel.cityId == 0)
      validationErrors.push("District");
    if (this.addNoticeModel.talukaId == 0)
      validationErrors.push("Taluka");
    if (this.addNoticeModel.villageId == 0)
      validationErrors.push("Village");

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }
  onAddNotice() {
    // if (this.addNoticeModel.advocateName == "" || this.addNoticeModel.advocateName == undefined || this.addNoticeModel.advocateName == null || this.addNoticeModel.advocateName != this.searchControl.value) {
    //   this.addNoticeModel.advocateName = this.searchControl.value;
    // }
    this.addNoticeModel.advocateName = this.searchControl.value;
    if (!this.validateForm())
      return false;

    if (this.addNoticeModel.noticeDetailList.length == 0) {
      if (!this.onAddNoticeDetail())
        return false;
    }

    let noticeDetail = JSON.parse(JSON.stringify(this.addNoticeDetail));
    if (this.addNoticeDetail.ctsNumber != "" || this.addNoticeDetail.gatNumber != "" || this.addNoticeDetail.surveyNumber != "" || this.addNoticeDetail.plotNumber != "") {
      this.addNoticeModel.noticeDetailList.push(noticeDetail);
    }

    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.addNoticeModel.createdBy = loggedInUserString.userId;
    this.addNoticeModel.isOcr = 1;
    var $dateField = $('#txtNoticeDate');
    this.addNoticeModel.PublishedDateString = $dateField.data('daterangepicker').startDate.format('YYYY-MM-DD');
    this.addNoticeModel.noticeDetailList.forEach((notice: OcrNoticeDetail) => {
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
    this.ocrServiceService.addNotice(this.addNoticeModel)
      .subscribe((addedRow: any) => {
        toastr.success('Notice Added Successsfully!', "Success");
        this.isShowLoader = false;
        this.clearForm();
      },
        error => {
          this.isShowLoader = false;
          toastr.error('Failed to create notice!', "Error");
        });
  }


  Json: any = [];
  data: any = [];
  originalFileName: string;
  UploadNoticeImage() {
    this.isShowLoader = true;
    this.Json = [];
    this.ocrServiceService.uploadNoticeImage(this.myFiles, this.loggedInUserId)
      .subscribe((addedRow: any) => {
        this.isShowLoader = false;
        this.data = addedRow.map(obj => {
          obj.noticeDetailList = JSON.parse(obj.noticeDetailList);
          obj.noticeImage = JSON.parse(obj.noticeImage);
          return obj;
        });

        this.lookupService.getTalukas(this.data[0].cityId);
        this.lookupService.getVillages(this.data[0].talukaId);
        this.searchControl.setValue(this.data[0].advocateName);
        this.addNoticeModel = this.data[0];
        //   this.addNoticeModel.otherDetails=this.data[0].noticeDetailList[0].otherDetails;
      },
        error => {
          this.isShowLoader = false;
          toastr.error('Failed to upload notice image!', "Error");
        });
  }

  onNoticeTypeChange(event) {
    //  this.addNoticeModel.noticeTypeId=e.target.value[0];
    //  this.addNoticeModel.noticeTitle=e.target.name[1];
    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    const selectedNoticeType = this.NoticeType[selectedIndex];
    this.addNoticeModel.noticeTypeId = selectedNoticeType.id;
    this.addNoticeModel.noticeTitle = selectedNoticeType.name;
    this.isBanking = selectedNoticeType.isBanking;
  }

  onSelectNoticeType(e) {
    if (e == true) {
      this.addNoticeModel.isPaid = "true"
    }
    else {
      this.addNoticeModel.isPaid = "false"
    }
  }


  onSelectPublisher(e) {
    if (e == true) {
      this.addNoticeModel.isPublisher = "true"
    }
    else {
      this.addNoticeModel.isPublisher = "false"
    }
  }


  onDistrictChange() {
    this.addNoticeModel.talukaId = 0;
    this.addNoticeModel.villageId = 0;
    this.lookupService.talukaList = [];
    this.lookupService.villageList = [];

    this.lookupService.getTalukas(this.addNoticeModel.cityId);
  }


  persondetail(person) {
    this.searchControl.setValue(person.fullName);
    this.addNoticeModel.advocateAddress = person.address1;
    this.addNoticeModel.advocatePhone = person.mobileNo;
    this.addNoticeModel.advocateName = person.fullName;
    this.addNoticeModel.personId = person.id;
    document.getElementById("pListId").style.zIndex = "0";
  }


  onStateChange() {
    this.addNoticeModel.talukaId = 0;
    this.addNoticeModel.villageId = 0;
    this.lookupService.talukaList = [];
    this.lookupService.villageList = [];

    this.lookupService.getCities(this.addNoticeModel.stateId);
  }

  onTalukaChange() {

    this.addNoticeModel.villageId = 0;
    this.lookupService.villageList = [];
    this.lookupService.getVillages(this.addNoticeModel.talukaId);
  }
  onRemoveNoticeDetail(removeIndex: number) {
    this.addNoticeModel.noticeDetailList.splice(removeIndex, 1);
  }

  onInsertKeyword(keyword, propName) {

    if (this.key == 'Enter') {
      this.key = null;
      return;
    }
    document.execCommand('insertText', false, " " + keyword + " ");
    return false;
    //  $event.keyCode != 13
  }


  onEnterKeyPressRemove($event: any, removeIndex: number) {
    if ($event.keyCode == 13) {
      this.onRemoveNoticeDetail(removeIndex);
    }
  }

  onEnterKeyPressAdd($event: any) {
    if ($event.keyCode == 13) {
      this.onAddNoticeDetail();
    }
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
    this.addNoticeModel.noticeImage == null;
    $("#files").html('<li class="text-muted text-center empty">No files uploaded.</li>');
  }

  onNoticeStatusChange(addNoticeModel: OcrAddNoticeModel) {
    addNoticeModel.isActive = !addNoticeModel.isActive;
  }

  onEnterKeyPressChangeStatus($event: any, addNoticeModel: OcrAddNoticeModel) {
    if ($event.keyCode == 13)
      addNoticeModel.isActive = !addNoticeModel.isActive;
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
    if (noticePeriod > 365)
      $event.target.value = 365;
  }

  uploadImages: any = [];
  onRemoveImage(noticeImage: OcrNoticeImage, removeIndex: number) {
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

  onEnterKeyPressOther($event: any) {
    this.is_add_other_details = !this.is_add_other_details
  }

  onKeyPressAddNotice($event: any) {
    if ($event.keyCode == 13)
      this.onAddNotice();
  }

  count: number = 0;
  onAddNoticeDetail() {
    this.count + 100;
    if (Object.values(this.addNoticeDetail).every(val => val.trim() === '')) {
      toastr.error("Please enter at least one value", "Error");
      return false;
    }
    let noticeDetail = JSON.parse(JSON.stringify(this.addNoticeDetail));
    this.addNoticeModel.noticeDetailList.push(noticeDetail);
    return true;
  }

  clearForm() {
    this.searchControl.setValue("");
    this.addNoticeModel = new OcrAddNoticeModel();
    this.addNoticeDetail = new OcrNoticeDetail(); 
    this.noticeImage = null;
    this.noticeImagelist = [];
    this.myFiles = [];
    $('#img-upload').attr('src', "");
    $('#imgInp').val("");
    $('#txt-selected-filename').val("");
  }

}
