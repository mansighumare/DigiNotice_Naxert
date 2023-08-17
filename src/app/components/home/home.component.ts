import { Component, OnInit } from '@angular/core';
import { NoticeInfoModel } from 'src/app/models';
import { NoticeService } from 'src/app/services';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ContactUsModel } from 'src/app/models/contact-us.model';
import { ToastrService } from 'ngx-toastr';
// import "src/app/assets/js/init.js";

declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public innerWidth: any;
  isShowDownloadLink: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public noticeService: NoticeService,
    private adminService: AdminService,
    public toastr: ToastrService
  ) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= 933)
      this.isShowDownloadLink = false
    else this.isShowDownloadLink = true
  }

  ngOnInit() {
    this.getTodaysNotices();
    this.initHomePageJquery();
  }

  ngOnDestroy() {
    $(".backstretch").remove();
  }

  isShowLoader: boolean = false;
  noticeInfoList: Array<NoticeInfoModel> = new Array<NoticeInfoModel>();
  getTodaysNotices() {
    this.isShowLoader = true;
    this.noticeService.getTodaysNotices(true, '0')
      .subscribe((noticeInfoList: Array<NoticeInfoModel>) => {
        this.noticeInfoList = noticeInfoList;
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }

  initHomePageJquery() {
    $(document).ready(function () {
      $('#main-slider .carousel-content').flexVerticalCenter({ cssAttribute: 'padding-top' });

      $('body').backstretch([
        "assets/images/bg/body-bg.jpg"
      ], { duration: 5000, fade: 500, centeredY: true });

      $("#mapwrapper").gMap({
        controls: false,
        scrollwheel: false,
        markers: [{
          latitude: 40.7566,
          longitude: -73.9863,
          icon: {
            image: "assets/images/marker.png",
            iconsize: [44, 44],
            iconanchor: [12, 46],
            infowindowanchor: [12, 0]
          }
        }],
        icon: {
          image: "assets/images/marker.png",
          iconsize: [26, 46],
          iconanchor: [12, 46],
          infowindowanchor: [12, 0]
        },
        latitude: 40.7566,
        longitude: -73.9863,
        zoom: 14
      });

      $('#search-wrapper, #search-wrapper input').hide();

      $('span.search-trigger').click(function () {
        $('#search-wrapper').slideToggle(0, function () {
          var check = $(this).is(":hidden");
          if (check == true) {
            $('#search-wrapper input').fadeOut(600);
          } else {
            $("#search-wrapper input").focus();
            $('#search-wrapper input').slideDown(200);
          }
        });
      });

      // $('#preloader').fadeOut('slow', function () { $(this).remove(); });

      //Set the carousel options
      $('#quote-carousel').carousel({
        pause: true,
        interval: 4000,
      });

      $('#scroller').carousel({
        pause: true,
        interval: 4000,
      });

      $('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
      });


      $('.fade-up, .fade-down, .bounce-in, .flip-in').addClass('no-display');
      $('.bounce-in').one('inview', function () {
        $(this).addClass('animated bounceIn appear');
      });
      $('.flip-in').one('inview', function () {
        $(this).addClass('animated flipInY appear');
      });
      $('.counter').counterUp({
        delay: 10,
        time: 1000
      });
      $('.fade-up').one('inview', function () {
        $(this).addClass('animated fadeInUp appear');
      });
      $('.fade-down').one('inview', function () {
        $(this).addClass('animated fadeInDown appear');
      });


      var windowsHeight = $(window).height();
      var scroll_pos = $(this).scrollTop();
      if (scroll_pos > windowsHeight) {
        $('.navbar-fixed-top').removeClass('opaqued');
      } else {
        $('.navbar-fixed-top').addClass('opaqued');
      }
      if (($(document).height() - $(window).height()) - $(window).scrollTop() < 1000) {
        $('#footer-wrapper').css('z-index', '4');
      } else {
        $('#footer-wrapper').css('z-index', '1');
      }

      scroll_pos = 0;
      $(document).scroll(function () {
        var windowsHeight = $(window).height();
        scroll_pos = $(this).scrollTop();
        if (scroll_pos > windowsHeight) {
          $('.navbar-fixed-top').removeClass('opaqued');
        } else {
          $('.navbar-fixed-top').addClass('opaqued');
        }
      });

      if (($(document).height() - $(window).height()) - $(window).scrollTop() < 1000) {
        $('#footer-wrapper').css('z-index', '4');
      } else {
        $('#footer-wrapper').css('z-index', '1');
      }

      var portfolio_selectors = $('.portfolio-filter li a');
      if (portfolio_selectors != 'undefined') {
        var portfolio = $('.portfolio-items');
        portfolio.isotope({
          itemSelector: 'li',
          layoutMode: 'fitRows'
        });
        portfolio_selectors.on('click', function () {
          portfolio_selectors.removeClass('active');
          $(this).addClass('active');
          var selector = $(this).attr('data-filter');
          portfolio.isotope({ filter: selector });
          return false;
        });
      }

    });
  }

  goToLogin() {
    this.router.navigate(['./login']);
  }

  isShowSearchMore: boolean = false;
  onSearchMore() {
    this.isShowSearchMore = true;
    setTimeout(function () {
      $("#search-more-modal").modal("show");
    }, 100);
    // this.router.navigate(['./search-notices']);
  }

  //Contact Us Form Integration
  public contactUsForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contactMeType: ['email'],
    subject: ['Anonymous User Query'],
    message: ['', Validators.required],
  });

  validateForm(contactUsForm: FormGroup) {
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please enter ";
    if (this.contactUsForm.controls.name.hasError("required")) {
      validationErrors.push("Name");
      isValid = false;
    }
    if (this.contactUsForm.controls.email.hasError("required")) {
      validationErrors.push("Email");
      isValid = false;
    }
    if (this.contactUsForm.controls.message.hasError("required")) {
      validationErrors.push("Message");
      isValid = false;
    }
    if (this.contactUsForm.controls.email.hasError("email")) {
      this.toastr.error("Invalid email address.", "Error");
      isValid = false;
    }

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      this.toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }

  contactUsModel: ContactUsModel = new ContactUsModel();
  onSubmit() {
    let isValid: boolean = this.validateForm(this.contactUsForm);
    if (isValid == false)
      return false;

    this.contactUsModel = this.contactUsForm.value;
    this.onSendMessage();
  }

  onSendMessage() {
    this.isShowLoader = true;
    this.contactUsModel.contactBy = 2;//for Email 2
    this.adminService.sendMailToAdmin(this.contactUsModel)
      .subscribe(isMailSent => {
        this.contactUsForm.reset();
        this.contactUsForm.controls['contactMeType'].setValue("email");
        this.isShowLoader = false;
        this.toastr.success('Mail sent successfully!', "Success");
      },
        error => {
          this.isShowLoader = false;
          this.toastr.error('Failed to Send Mail.', "Error");
        });
  }

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
