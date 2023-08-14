import { Component, ElementRef, HostListener, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { AdBannerService } from 'src/app/services/ad-banner.service';
import { AppConfig, SharedModelService } from 'src/app/services';
import { AddAdBannerWebModel, BannerImageModel } from 'src/app/models/AdBanner';
import { Subscription, interval } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import {
  animate,
  state,
  style,
  transition,
  trigger,
  keyframes
} from '@angular/animations';


declare var jQuery: any;

@Component({
  selector: 'basic',
  templateUrl: 'basicLayout.template.html',
  styleUrls: ['basicLayout.component.css'],
  animations: [
    trigger('move', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => left', [
        style({ transform: 'translateX(100%)' }),
        animate(20000)
      ]),
      transition('left => void', [
        animate(200, style({ transform: 'translateX(0)' }))
      ]),
      transition('void => right', [
        style({ transform: 'translateX(-100%)' }),
        animate(20000)
      ]),
      transition('right => void', [
        animate(20000, style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})

export class BasicLayoutComponent implements OnInit {
  // imagesUrl:any[];
  //  imagesUrl = Array<{}>();
  @ViewChild('myDivElement1', { static: true }) myDivElementRef1!: ElementRef;
  @ViewChild('myDivElement', { static: true }) myDivElementRef!: ElementRef;

  imagesUrl: Array<AddAdBannerWebModel> = new Array<AddAdBannerWebModel>();
  bannerImageModelList: Array<BannerImageModel> = new Array<BannerImageModel>();
  bannerImageModel: BannerImageModel = new BannerImageModel();
  images: [any];
  autoRotate = true;
  autoRotateAfter = 2000;
  autoRotateRight = true;

  // public safeUrls = [];
  public safeUrls = Array<{}>();
  public AdUrls = [];
  public imageUrls = Array<{}>();
  public state = 'void';
  public disableSliderButtons = false;
  subscription: Subscription;
  collaps: boolean;

  constructor(public adBannerService: AdBannerService,
    public appConfig: AppConfig,
    private sanitizer: DomSanitizer,
    private shared:SharedModelService) {
  }




  @HostListener('document:click', ['$event'])
  private updateValue() {
    this.shared.getBoolean().subscribe((newValue) => {
      this.collaps = newValue;
      const myDiv = this.myDivElementRef.nativeElement as HTMLDivElement;
      
      if(!this.collaps){
      myDiv.style.width = '110%';
      myDiv.style.marginLeft = '-200px'
      }else{
        myDiv.style.width = '';
        myDiv.style.marginLeft = '00px'
      }
    });
  }

  ngOnInit() {
   
    this.adBannerService.GetAdBannerListByImageType().subscribe((adBannerModel: Array<AddAdBannerWebModel>) => {

      adBannerModel.forEach(adBanner => {
       
        var imgPath = adBanner.imagePath;
       // adBanner.imagePath = "";
       // adBanner.imagePath = this.appConfig.imageAdBannerPath + imgPath;
     
        this.imagesUrl.push(adBanner);

      });

      this.imagesUrl.forEach(element => {
       
        const safeUrl = this.sanitizer.sanitize(SecurityContext.URL, element.imagePath);
        const AdUrl = this.sanitizer.sanitize(SecurityContext.NONE, element.adUrl);
        this.bannerImageModel.adUrl = AdUrl;
        this.bannerImageModel.imagePath = safeUrl;
        var model = { "adUrl": AdUrl, "imagePath": safeUrl };
        //  this.safeUrls.push(safeUrl);
        this.bannerImageModelList.push(model);
        // this.AdUrls.push(AdUrl);
      });

      this.imageUrls = this.bannerImageModelList;

      if (this.autoRotate) {
        const source = interval(this.autoRotateAfter);
        this.subscription = source.subscribe(() =>
          (this.autoRotateRight) ? this.moveLeft() : this.moveRight());
      }
    });
  }

  imageRotate(arr, reverse) {
    if (reverse) {
      arr.unshift(arr.pop());
    } else {
      arr.push(arr.shift());
    }
    return arr;
  }

  moveLeft() {
    if (this.disableSliderButtons) {
      return;
    }
    this.state = 'right';
    this.imageRotate(this.imageUrls, true);
  }

  moveRight() {
    if (this.disableSliderButtons) {
      return;
    }
    this.state = 'left';
    this.imageRotate(this.imageUrls, false);
  }

  onFinish($event) {
    this.state = 'void';
    this.disableSliderButtons = false;
  }

  onStart($event) {
    this.disableSliderButtons = true;
  }

  openImageUrl(adUrl: string) {
    window.open(adUrl, "_blank");
  }
}
