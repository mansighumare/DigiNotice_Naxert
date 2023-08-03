import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';
import { LoginComponent, SignupComponent } from './components/public-components';
import { BlankLayoutComponent } from './components/common/layouts/blankLayout.component';
import { BasicLayoutComponent } from './components/common/layouts/basicLayout.component';
import { BookmarkComponent, ContactUsComponent, EndUserDashboardComponent, HelpFeedbackComponent, MatchedNoticeComponent, MyProfileComponent, SettingsComponent, UserPreferenceComponent } from './components/private-components';
import { GuardService } from './services';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeNewComponent } from './components/home-new/home-new.component';
import { AssetManagerComponent } from './components/asset-manager/asset-manager.component';
import { BackendLayoutComponent } from './components/common/layouts/backendLayout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'backend',
    component: BackendLayoutComponent,
    loadChildren: () => import('./backend/backend.module').then(m => m.BackendModule),
    data: { preload: false, roles: ["All"] },
    canActivate: [GuardService]
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, data: { roles: ["All"] } },
      { path: 'signin', component: LoginComponent, data: { roles: ["All"] } },
      { path: 'signup', component: SignupComponent, data: { roles: ["All"] } },
      { path: 'register', component: SignupComponent, data: { roles: ["All"] } },
      { path: 'reset-password/:email/:code', component: ResetPasswordComponent, data: { roles: ["All"] } },
      { path: 'forgot-password', component: ForgotPasswordComponent, data: { roles: ["All"] } },
      { path: 'home-new', component: HomeNewComponent, data: { roles: ["All"] } },
      // { path: 'owner-info', component: OwnerInfoComponent, data: { roles: ["All"] } },
    ]
  },
  {
    path: '', component: BasicLayoutComponent,
    children: [
      { path: 'dashboard', component: EndUserDashboardComponent, data: { roles: ["User"] }, canActivate: [GuardService] },
      { path: 'my-profile', component: MyProfileComponent, data: { roles: ["User"] }, canActivate: [GuardService] },
      { path: 'bookmark', component: BookmarkComponent, data: { roles: ["User"] }, canActivate: [GuardService] },
      { path: 'matched-notice', component: MatchedNoticeComponent, data: { roles: ["User"] }, canActivate: [GuardService] },
      { path: 'asset-manager', component: AssetManagerComponent, data: { roles: ["User"] }, canActivate: [GuardService] },
      { path: 'interested-cities', component: UserPreferenceComponent, data: { roles: ["User"] }, canActivate: [GuardService] },
      { path: 'settings', component: SettingsComponent, data: { roles: ["User"] }, canActivate: [GuardService] },
      { path: 'help-feedback', component: HelpFeedbackComponent, data: { roles: ["User"] }, canActivate: [GuardService] },
      { path: 'contact-us', component: ContactUsComponent, data: { roles: ["User"] }, canActivate: [GuardService] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: NoPreloading })],
  exports: [RouterModule]
})
export class AppRoutingModule { }