import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdBannerService } from 'src/app/services/ad-banner.service';
import { AddAdBannerWebModel } from 'src/app/models/AdBanner';
import { AppConfig } from 'src/app/services';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import{ BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AddNewAdBannerComponent } from './add-new-ad-banner/add-new-ad-banner.component';
import { ToastrService } from 'ngx-toastr';
import { SharedServiceService } from 'src/app/services/shared-service.service';


declare var $;
@Component({
  selector: 'app-adds-banner-master',
  templateUrl: './adds-banner-master.component.html',
  styleUrls: ['./adds-banner-master.component.scss']
})
export class AddsBannerMasterComponent implements OnInit {
  @ViewChild(AddNewAdBannerComponent, { static: false }) addNewAdBannerComponent: AddNewAdBannerComponent;

  AddEditLogo:string="Add";
  isShowNotificationLogPopup: boolean = false;
  constructor(private router: Router,
    public adBannerService: AdBannerService,
    public appConfig: AppConfig,
    private toastr: ToastrService,
    private shared:SharedServiceService
    //,private modalService:BsModalService
    ) { }
    showPopup:boolean=false;
   // bsModalRef: BsModalRef;
    isShowLoader: boolean = false;
    adBannerList: Array<AddAdBannerWebModel> = new Array<AddAdBannerWebModel>();
    adBanner: AddAdBannerWebModel = new AddAdBannerWebModel();
    editAdBannerModel:AddAdBannerWebModel = new AddAdBannerWebModel();
  ngOnInit() {  
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      this.getAddAdBannerList();  
  this.isShowLoader=true;

  setTimeout(() => {  this.isShowLoader = false; }, 100);
    }
    else {

      this.router.navigate(["./login"]);
    }
  }
  //getAddAdBannerList
  
  getAddAdBannerList() {
    this.isShowLoader = true;    
    this.adBannerService.getAddAdBannerList().subscribe((adBannerList: Array<AddAdBannerWebModel>) => {
      
        this.adBannerList=adBannerList;
        this.isShowLoader = false;
      },
      error => {
        this.isShowLoader = false;
      });
  }
  
  OnEditAdBanner(data:AddAdBannerWebModel){
 
      this.shared.editAdBannerModel=data;
      this.AddEditLogo="Update";

    this.showPopup = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    

const initialState = {
 data: data,
 animated: true,
 keyboard: true,
 ignoreBackdropClick: true,
};


// $("#add-banner-modal").modal("show");
// this.bsModalRef = this.modalService.show(AddNewAdBannerComponent, initialState);
// this.bsModalRef.content.closeBtnName = 'Close';

// this.modalService.onHide.subscribe((reason: string) => {
//  })
}

onAddAdBanner() {
  
  this.showPopup = true;
  this.AddEditLogo="Add";


  this.shared.editAdBannerModel=new AddAdBannerWebModel();
}

onClosePopup() {
  this.showPopup = false;
}
OnAddAdBanner(){ 
  
  const initialState = {  
   animated: true,
   keyboard: true,
   ignoreBackdropClick: true,
  };
  this.showPopup=!this.showPopup;
  
  // this.bsModalRef = this.modalService.show(AddNewAdBannerComponent, initialState);
  // this.bsModalRef.content.closeBtnName = 'Close';
  
  // this.modalService.onHide.subscribe((reason: string) => {
  //  console.log("modal close: " + reason);
  // })
 
} 
  onDeleteAdBanner(adBanner:AddAdBannerWebModel){

    this.adBannerService.DeleteAdBanner(adBanner).subscribe((res:any)=>{

      if(res){
        this.getAddAdBannerList();
      this.adBannerService.AddAdBannerList();
        this.toastr.success('AdBanner Deleted Successfully!', "Success");  
      }

    });
  }
}
