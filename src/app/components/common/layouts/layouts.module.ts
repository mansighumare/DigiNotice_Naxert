import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

// import { BsDropdownModule } from 'ngx-bootstrap';

import { BasicLayoutComponent } from "./basicLayout.component";
import { BlankLayoutComponent } from "./blankLayout.component";
import { BackendLayoutComponent } from "./backendLayout.component";
// import { TopNavigationLayoutComponent } from "./topNavigationlayout.component";

import { NavigationComponent } from "./../navigation/navigation.component";
import { BackenNavigationComponent } from "src/app/components/common/navigation/backend-navigation.component";

import { FooterComponent } from "./../footer/footer.component";
import { TopNavbarComponent } from "./../topnavbar/topnavbar.component";
import { TopNavigationNavbarComponent } from "./../topnavbar/topnavigationnavbar.component";

import { SliderModule } from './slider/slider.module';

@NgModule({
  declarations: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    BackendLayoutComponent,
    NavigationComponent,
    BackenNavigationComponent,
    // TopNavigationLayoutComponent,
    TopNavbarComponent,
    TopNavigationNavbarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    SliderModule
    // BsDropdownModule.forRoot()
  ],
  exports: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    BackendLayoutComponent,
    NavigationComponent,
    BackenNavigationComponent,
    // TopNavigationLayoutComponent,
    TopNavbarComponent,
    TopNavigationNavbarComponent
  ],
})

export class LayoutsModule { }
