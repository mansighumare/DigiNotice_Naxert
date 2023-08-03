import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { AddNoticeModel } from '../../models';
import { SharedModelService, NoticeService, LookupService, MasterDataService } from 'src/app/services';
import { NoticeDetail, NoticeImage, NoticeAdvocateModel } from 'src/app/models/notice-info';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription, debounceTime, of, startWith, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';



declare var $;

@Component({
  selector: 'app-add-notice',
  templateUrl: './add-notice.component.html',
  styleUrls: ['./add-notice.component.scss']
})
export class AddNoticeComponent implements OnInit {


  @Input() editNoticeModel: AddNoticeModel = null;
  addNoticeModel: AddNoticeModel = new AddNoticeModel();
  @Output() onClose: EventEmitter<string> = new EventEmitter();
  @Output() afterUpdate: EventEmitter<AddNoticeModel> = new EventEmitter();
  @Output() onPropertyUpdated: EventEmitter<string> = new EventEmitter();

  public flag: boolean = false;
  isShowLoader: boolean = false;
  NoticeType: any = [];
  isBanking: boolean;
  key: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  constructor(
    public sharedModel: SharedModelService,
    public noticeService: NoticeService,
    public lookupService: LookupService,
    public router: Router,
    public http: HttpClient,
    private toastr:ToastrService) {


  }
  personList: Array<NoticeAdvocateModel> = new Array<NoticeAdvocateModel>();
  personAdvList: any = [];

  public is_add_other_details: boolean = false;
  subscription: Subscription = new Subscription();
  searchControl: FormControl = new FormControl();
  ngOnInit() {


    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      $(document).ready(() => {
        var uploadUrl = this.noticeService.uploadNoticeImgUrl;
        this._initDropZone();
        this.noticeService.initDateRangePicker();
      });

      this.subscription.add(
        this.searchControl.valueChanges.pipe(
          startWith(''),
          debounceTime(500),
          switchMap(value =>{
            if (this.flag == true) {
              this.flag = false;
            } else if (!!value.length && value.length > 3) {
              this.flag = true;
              return this.http.post(`https://api.diginotice.in/api/Notice/GetAdvocateList`, {
                Fullname: value
              })
            } else {
              return of([]);
            }
          })
        ).subscribe((personList: any) => {
          if (personList.length == 0) {
            this.flag = false;
          }
          this.personList = personList;
          this.isShowLoader = false;
        })
      );
      
      this.getNoticeType();
    }
    else {
      this.router.navigate(["./login"]);
    }
  }


  onNoticeTypeChange(event) {
     this.addNoticeModel.noticeTypeId=event.target.value[0];
      this.addNoticeModel.noticeTitle=event.target.name[1];
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

  persondetail(person) {
    this.searchControl.setValue(person.fullName);
    this.addNoticeModel.advocateAddress = person.address1;
    this.addNoticeModel.advocatePhone = person.mobileNo;
    this.addNoticeModel.advocateName = person.fullName;
    this.addNoticeModel.personId = person.id;
    document.getElementById("pListId").style.zIndex = "0";
  }



  onAreaUnitChange(removeIndex: number) {

    this.addNoticeModel.noticeDetailList.forEach((notice: NoticeDetail, index: number) => {
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

  onDistrictChange(cityId: number) {
    this.addNoticeModel.talukaId = 0;
    this.addNoticeModel.villageId = 0;
    this.lookupService.talukaList = [];
    this.lookupService.villageList = [];

    this.lookupService.getTalukas(cityId);
  }

  onStateChange(stateId: number) {
    this.addNoticeModel.talukaId = 0;
    this.addNoticeModel.villageId = 0;
    this.lookupService.talukaList = [];
    this.lookupService.villageList = [];

    this.lookupService.getCities(stateId);
  }

  onTalukaChange(talukaId: number) {

    this.addNoticeModel.villageId = 0;
    this.lookupService.villageList = [];
    this.lookupService.getVillages(talukaId);
  }

  validateForm() {
    
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";
     if (this.addNoticeModel.ownerFullName.trim() == "")
       validationErrors.push("Owner Name");

    if (this.addNoticeModel.paperId == 0)
      validationErrors.push("Paper");
    if (this.addNoticeModel.noticePeriod == undefined)
      validationErrors.push("Notice Period");
    if (this.addNoticeModel.cityId == 0)
      validationErrors.push("District");
    if (this.addNoticeModel.talukaId == 0)
      validationErrors.push("Taluka");
    if (this.addNoticeModel.villageId == 0)
      validationErrors.push("Village");

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      this.toastr.error(validationMessage, "Validation Error");

      isValid = false;
    }
    return isValid;
  }

  onKeyPressAddNotice($event: any) {
    if ($event.keyCode == 13)
      this.onAddNotice();
  }

  myFiles: any = [];
  getFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  onAddNotice():any{
    if (this.addNoticeModel.advocateName == "" || this.addNoticeModel.advocateName == undefined || this.addNoticeModel.advocateName == null) {
      this.addNoticeModel.advocateName = this.searchControl.value;
    }
    if (!this.validateForm())
      return false;

    if (this.addNoticeModel.noticeDetailList.length == 0) {
      if (!this.onAddNoticeDetail())
        return false;
    }

    if (this.myFiles.length == 0) {
      this.toastr.error('Please select notice image!', "Error");

      return false;
    }

    let noticeDetail = JSON.parse(JSON.stringify(this.addNoticeDetail));
    if (this.addNoticeDetail.ctsNumber != "" || this.addNoticeDetail.gatNumber != "" || this.addNoticeDetail.surveyNumber != "" || this.addNoticeDetail.plotNumber != "") {
      this.addNoticeModel.noticeDetailList.push(noticeDetail);
    }

    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.addNoticeModel.createdBy = loggedInUserString.userId;
    this.addNoticeModel.isOcr=0;
    var $dateField = $('#txtNoticeDate');
    // this.addNoticeModel.publishedDate = $dateField.data('daterangepicker').startDate.format('DD/MM/YYYY');
    // this.addNoticeModel.publishedDate = $dateField.data('daterangepicker').startDate.format('DD/MM/YYYY');
    this.addNoticeModel.PublishedDateString = $dateField.data('daterangepicker').startDate.format('YYYY-MM-DD');
    this.addNoticeModel.noticeDetailList.forEach((notice: NoticeDetail) => {
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
    this.noticeService.uploadNoticeImage(this.myFiles)
      .subscribe((uploadedNoticeImage: Array<NoticeImage>) => {
        this.addNoticeModel.noticeImage = uploadedNoticeImage;
        this.noticeService.addNotice(this.addNoticeModel)
          .subscribe((addedRow: any) => {
            this.toastr.success('Notice Added Successsfully!', "Success");

            this.isShowLoader = false;
            this.clearForm();
          },
            error => {
              this.isShowLoader = false;
              this.toastr.error('Failed to create notice!', "Error");

            });
      },
        error => {
          this.isShowLoader = false;
          this.toastr.error('Failed to upload notice image!', "Error");

        });
  }


  getNoticeType() {
    this.lookupService.getNoticeType().subscribe(
      (r) => {
        this.NoticeType = r;
        this.NoticeType = this.NoticeType.filter(notice => notice.isActive === true);
      }
    );
  }


  clearForm() {
    this.searchControl.setValue("");
    this.addNoticeModel = new AddNoticeModel();
    this.addNoticeDetail = new NoticeDetail();     //.gatNumber ="";
    this.noticeImage = null;
    this.noticeImagelist = [];
    this.myFiles = [];
    $('#img-upload').attr('src', "");
    $('#imgInp').val("");
    $('#txt-selected-filename').val("");
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


      for (var i = 0; i < input.files.length; i++) {
        if (input.files && input.files[i]) {
          _self.noticeImage = input.files[i];

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

  addNoticeDetail:any = new NoticeDetail();
  count: number = 0;
  onAddNoticeDetail() {
    this.count + 100;
    // if (this.addNoticeDetail.ctsNumber.trim() == "" && this.addNoticeDetail.surveyNumber.trim() == "" && this.addNoticeDetail.gatNumber.trim() == "" && this.addNoticeDetail.plotNumber.trim() == "") {
    //   toastr.error("Please enter Survey/Gat/Plot/Cts Number", "Info");

    //   return false;
    // }
    if (Object.values(this.addNoticeDetail).every(val => val.toString().trim() === '')) {
      this.toastr.error("Please enter at least one value", "Error");

      return false;
    }
    let noticeDetail = JSON.parse(JSON.stringify(this.addNoticeDetail));
    this.addNoticeModel.noticeDetailList.push(noticeDetail);
    //this.addNoticeDetail = new NoticeDetail();
    return true;
  }

  onRemoveNoticeDetail(removeIndex: number) {
    this.addNoticeModel.noticeDetailList.splice(removeIndex, 1);
  }

  onInsertKeyword($event: MouseEvent, keyword, propName) {

    if (this.key == 'Enter') {
      this.key = null;
      return true;
    }
    document.execCommand('insertText', false, " " + keyword + " ");
    return false;
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

  onEnterKeyPressOther($event: any) {
    this.is_add_other_details = !this.is_add_other_details
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

  onNoticeStatusChange(addNoticeModel: AddNoticeModel) {
    addNoticeModel.isActive = !addNoticeModel.isActive;
  }

  onEnterKeyPressChangeStatus($event: any, addNoticeModel: AddNoticeModel) {
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
}