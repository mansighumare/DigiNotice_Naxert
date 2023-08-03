import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NoticeInfoModel } from 'src/app/models';
import { SharedModelService, AppConfig } from "src/app/services";

declare var $;
@Component({
  selector: 'app-view-notice',
  templateUrl: './view-notice.component.html',
  styleUrls: ['./view-notice.component.scss']
})
export class ViewNoticeComponent implements OnInit {

  @Input() noticeInfo: NoticeInfoModel = null;
  @Output() onClose: EventEmitter<string> = new EventEmitter();

  constructor(private sharedModelService: SharedModelService, public appConfig: AppConfig, public http: HttpClient) { }
  imageList: any = [];
  noticeImage: any = [];
  imageTypeId: number = 1;
  NoticeDetails: any = [];
  filteredData: any = [];

  ngOnInit() {
   
    this.NoticeDetails = Object.entries(this.noticeInfo).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
   this.NoticeDetails = this.NoticeDetails.noticeDetailList.map(obj => ({
    //area: obj.area,
    buildingName: obj.buildingName,
    buildingNo: obj.buildingNo,
    catestrialSurveyNo: obj.catestrialSurveyNo,
    commencementCertificateNo: obj.commencementCertificateNo,
    complaintNoReportNo: obj.complaintNoReportNo,
    completionCertificateNo: obj.completionCertificateNo,
    constructedPropertyArea: obj.constructedPropertyArea,
    corporationRegistrationNo: obj.corporationRegistrationNo,
    //earnestMoney: obj.earnestMoney,
    factoryShedNo: obj.factoryShedNo,
    finalPlotNo: obj.finalPlotNo,
    flatNo: obj.flatNo,
    flatShopNo: obj.flatShopNo,
    floorNo: obj.floorNo,
    fullCtsNumber: obj.fullCtsNumber,
    fullGatNumber: obj.fullGatNumber,
    fullPlotNumber: obj.fullPlotNumber,
    fullSurveyNumber: obj.fullSurveyNumber,
    glrNo: obj.glrNo,
    grampanchayatNo: obj.grampanchayatNo,
    houseNo: obj.houseNo,
   // id: obj.id,
    industrialBuilding: obj.industrialBuilding,
    malmattaNo: obj.malmattaNo,
    nagarPanchyatMilkatNo: obj.nagarPanchyatMilkatNo,
   // noticeId: obj.noticeId,
 //   outstandingAmount: obj.outstandingAmount,
    phaseNo: obj.phaseNo,
    privatePlotNo: obj.privatePlotNo,
    propertyCard: obj.propertyCard,
    propertyCardNo: obj.propertyCardNo,
    propertyNo: obj.propertyNo,
    //reservePrice: obj.reservePrice,
    shareCertificateNo: obj.shareCertificateNo,
    subPlotNo: obj.subPlotNo,
    tenementNo: obj.tenementNo,
    outstandingAmount:obj.outstandingAmount,
    reservePrice:obj.reservePrice,
    earnestMoney:obj.earnestMoney
 //   unitTypeId: obj.unitTypeId,
 
}));


this.filteredData = this.NoticeDetails
  .map(obj => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] != null && obj[key] !== "") {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  })
  .filter(obj => Object.keys(obj).length !== 0);


// this.noticeInfo.noticeImage.forEach(image=>{     
//   this.imageList.push({"Name": image.name, "imageUrl": this.appConfig.imagePath + image.name,"imageTypeId":image.imageTypeId });
// });
this.noticeInfo.noticeDetailList.forEach(noticedetail => {
  noticedetail.area = noticedetail.area.split(',').join(', ');
  noticedetail.area = noticedetail.area.split(':').join(' :');

  if (noticedetail.area.includes("squareMeter")) {
    noticedetail.area = noticedetail.area.slice(17, -2) + " Sq. M";
  }
  if (noticedetail.area.includes("squareFeet")) {
    noticedetail.area = noticedetail.area.slice(16, -2) + " Sq. Ft";
  }
  if (noticedetail.area.includes("Var")) {
    noticedetail.area = noticedetail.area.slice(9, -2) + " Var";
  }
  if (noticedetail.area.includes("Foot")) {
    noticedetail.area = noticedetail.area.slice(10, -2) + " Foot";
  }
  if (noticedetail.area.includes("hectorH" && "hectorR")) {
    var hectorH = noticedetail.area.slice(noticedetail.area.indexOf(':') + 2, noticedetail.area.indexOf(',') - 1);
    var indexLastComma = noticedetail.area.lastIndexOf(',');
    if (indexLastComma === noticedetail.area.indexOf(',')) {
      indexLastComma = noticedetail.area.indexOf('}');
    }
    var hectorR = noticedetail.area.slice(noticedetail.area.indexOf('R') + 5, indexLastComma - 1);
    if (noticedetail.area.includes("potKharab")) {
      var potKharab = noticedetail.area.slice(noticedetail.area.indexOf('b') + 5, noticedetail.area.lastIndexOf('}') - 1);
      noticedetail.area = hectorH + " H, " + hectorR + " R, " + potKharab + " Pot Kharaba";
    } else {
      noticedetail.area = hectorH + " H, " + hectorR + " R";
    }

  }

  noticedetail.surveyNumber = noticedetail.surveyNumber.split('+').join('+ ');
  noticedetail.surveyNumber = noticedetail.surveyNumber.split('/').join('/ ');
})
$('#view-notice-popup').on('hidden.bs.modal', () => {
  this.onClose.emit("Close");
});
  }

// onDownloadFile($event: any, image: any) {
//  
//   $event.preventDefault();

//   let url: string = image.name;
//   let fileName: string = image.id;
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", url, true);
//   xhr.responseType = "blob";
//   xhr.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
//   xhr.setRequestHeader('cache-control', 'max-age=0');
//   xhr.setRequestHeader('expires', '0');
//   xhr.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
//   xhr.setRequestHeader('pragma', 'no-cache');
//   xhr.onload = function () {
//     var urlCreator = window.URL || window["webkitURL"];
//     var imageUrl = urlCreator.createObjectURL(this["response"]);
//     var tag = document.createElement('a');
//     tag.href = imageUrl;
//     tag.download = fileName;
//     document.body.appendChild(tag);
//     tag.click();
//     document.body.removeChild(tag);
//   }
//   xhr.send();
// }


onDownloadFile($event: any, images: any) {
 
  window.location = images.name;

}


viewmore(i: any){
  //$("#"+i+"").css("display","");
  var display = $("#" + i).css("display");
  if (display == "none") {
    $("#" + i).attr("style", "display:");
  }
  else {
    $("#" + i).attr("style", "display:none");
  }
}

}
