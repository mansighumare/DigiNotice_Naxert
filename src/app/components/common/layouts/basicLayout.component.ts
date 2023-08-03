import { Component, OnInit, SecurityContext } from '@angular/core';
import { AdBannerService } from 'src/app/services/ad-banner.service';
import { AppConfig } from 'src/app/services';
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

  constructor(public adBannerService: AdBannerService,
    public appConfig: AppConfig,
    private sanitizer: DomSanitizer) {
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
