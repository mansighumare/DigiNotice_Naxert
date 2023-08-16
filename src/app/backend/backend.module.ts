import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';
import { AddNoticeComponent } from './add-notice/add-notice.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NoticeMasterComponent } from './notice-master/notice-master.component';
//import { AddsBannerMasterComponent } from './adds-banner-master/adds-banner-master.component';

import { MasterDataFormsComponent } from './master-data-forms/master-data-forms.component';
import { LocationMasterComponent } from './location-master/location-master.component';
import { EditNoticeComponent } from './edit-notice/edit-notice.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { BackendUsersListComponent } from './backend-users-list/backend-users-list.component';
import { GuardService } from 'src/app/services';
import { PerformanceReportComponent } from './performace-report/performace-report.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
//import {MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule, MatCardModule, 
// MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule, 
// MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatOptionModule,
//  MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, 
//  MatSnackBarModule, MatSortModule, MatStepperModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule } from '@angular/material';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule  } from '@angular/material/tabs'

import { AddNewAdBannerComponent } from './adds-banner-master/add-new-ad-banner/add-new-ad-banner.component';
//import { ModalModule, PopoverModule } from 'ngx-bootstrap';
//import { MatTableModule } from '@angular/material/table'
//import { DataTableModule } from 'angular2-datatable';
import { OrganisationUserListComponent } from './organisation-user-list/organisation-user-list.component';
import { AddEditBranchComponent } from './add-edit-branch/add-edit-branch.component';
import { OrganisationDashboardComponent } from './organisation-dashboard/organisation-dashboard.component';
import { ManageOrganisationComponent } from './manage-organisation/manage-organisation.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { HelpFeedbackComponent } from '../components/help-feedback/help-feedback.component';
import { ContactUsComponent } from '../components/contact-us/contact-us.component';
import { MyProfileComponent } from '../components/my-profile/my-profile.component';
import { BookmarkComponent } from '../components/bookmark/bookmark.component';
//import { MatchedNoticeComponent } from '../components/matched-notice/matched-notice.component';
import { OrgAssetManagerComponent } from './org-asset-manager/org-asset-manager.component';
import { ViewOrgAssetComponent } from './org-asset-manager/view-org-asset/view-org-asset.component';
import { OrgAssetFollowupComponent } from './org-asset-manager/org-asset-followup/org-asset-followup.component';
import { DeleteAssetsComponent } from './delete-assets/delete-assets.component';
import { OrgAssetHistoryComponent } from './org-asset-manager/org-asset-history/org-asset-history.component';
import { AddMultipleAssetsComponent } from './org-asset-manager/add-multiple-assets/add-multiple-assets.component';
import { OrgMatchedNoticeComponent } from './org-matched-notice/org-matched-notice.component';
import { DeletedAssetsComponent } from './deleted-assets/deleted-assets.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { OrganisationNoticesComponent } from './organisation-notices/organisation-notices.component';

import { AcknowledgeNotificationComponent } from './acknowledge-notification/acknowledge-notification.component';
import { AcknowledgedReportComponent } from './acknowledged-report/acknowledged-report.component';
import { AssetsReportComponent } from './assets-report/assets-report.component';
import { OcrAddNoticeComponent } from './ocr-add-notice/ocr-add-notice.component';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { MatTableModule } from '@angular/material/table';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../modules/shared.module';

import { AddsBannerMasterComponent } from './adds-banner-master/adds-banner-master.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
const routes: Routes = [
  {
    path: '',
    // component: AdminComponent,
    // pathMatch: 'full',
    children: [
      {
        path: 'organisation-dashboard', component: OrganisationDashboardComponent,
        data: { roles: ["SuperAdmin","Org Admin", "Manager","Employee"] },
        canActivate: [GuardService]
      },
      {
        path: 'acknowledge-alerts', component: AcknowledgeNotificationComponent,
        data: { roles: ["Org Admin", "Manager","Employee"] },
        canActivate: [GuardService]
      },
      {
        path: 'dashboard', component: DashboardComponent,
        data: { roles: ["SuperAdmin", "Admin","City Admin"] },
        canActivate: [GuardService]
      },
      {
        path: 'notices', component: OrganisationNoticesComponent,
        data: { roles: ["Org Admin", "Manager","Employee"] },
        canActivate: [GuardService]
      },
      
   
      {
        path: 'notification', component: NotificationComponent,
        data: { roles: ["SuperAdmin", "Admin","Operator"] },
        canActivate: [GuardService]
      },
      {
        path: 'add-notice', component: AddNoticeComponent,
        data: { roles: ["All"] },
        canActivate: [GuardService]
      },
      {
        path: 'ocr', component: OcrAddNoticeComponent,
        data: { roles: ["SuperAdmin", "Admin","Operator"] },
        canActivate: [GuardService]
      },
      {
        path: 'notice-master', component: NoticeMasterComponent,
        data: { roles: ["All"] },
        canActivate: [GuardService]
      },
      {
        path: 'location-master', component: LocationMasterComponent,
        data: { roles: ["All"] },
        canActivate: [GuardService]
      },
      {
        path: 'performance-report', component: PerformanceReportComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },
      {
        path: 'addsbanner-master', component: AddsBannerMasterComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },
      {
        path: 'masterdata-forms', component: MasterDataFormsComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },
      {
        path: 'register', component: RegisterUserComponent,
        data: { roles: ["Admin", "SuperAdmin"] },
        canActivate: [GuardService]
      },
      {
        path: 'backend-users', component: BackendUsersListComponent,
        data: { roles: ["SuperAdmin", "Admin","City Admin"] },
        canActivate: [GuardService]
      },
      {
        path: 'organisation-users', component: OrganisationUserListComponent,
        data: { roles: ["SuperAdmin", "Org Admin","Manager"] },
        canActivate: [GuardService]
      },
      {
        path: 'assets-report', component: AssetsReportComponent,
        data: { roles: ["Org Admin", "Manager","Employee"] },
        canActivate: [GuardService]
      },
      {
        path: 'acknowledged-report', component: AcknowledgedReportComponent,
        data: { roles: ["Org Admin", "Manager","Employee"] },
        canActivate: [GuardService]
      },
      {
        path: 'dg-users', component: UsersListComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },

      {
        path:  "branches/:orgId", component: AddEditBranchComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },

      {
        path: 'settings', component: SettingsComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },
      {
        path: 'help-feedback', component: HelpFeedbackComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },
      {
        path: 'contact-us', component: ContactUsComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },

      {
        path: 'my-profile', component: MyProfileComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },
      {
        path: 'bookmark', component: BookmarkComponent,
        data: { roles: ["SuperAdmin", "Admin"] },
        canActivate: [GuardService]
      },
      {
        path: 'matched-notice', component: OrgMatchedNoticeComponent,
        data: { roles: ["Org Admin","Manager","Employee"] },
        canActivate: [GuardService]
      },
      {
        path: 'org-asset-manager', component: OrgAssetManagerComponent,
        data: { roles: ["Org Admin","Manager","Employee"] },
        canActivate: [GuardService]
      },

      {
        path: 'manage-organisation', component: ManageOrganisationComponent,
        data: { roles: ["SuperAdmin", "Org Admin"] },
        canActivate: [GuardService]
      }, 
      {
        path: 'delete-assets', component: DeleteAssetsComponent,
        data: { roles: ["Org Admin","Manager"] },
        canActivate: [GuardService]
      }, 
      {
        path: 'deleted-assets', component: DeletedAssetsComponent,
        data: { roles: ["Org Admin","Manager"] },
        canActivate: [GuardService]
      }, 
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' }
    ]
    // canActivate: [ActivateGuardService]
  }
];

@NgModule({
  declarations: [
    AddNoticeComponent,
    DashboardComponent,
    OrgAssetManagerComponent,
    NoticeMasterComponent, 
    AddsBannerMasterComponent,
    MasterDataFormsComponent, 
    LocationMasterComponent,
    EditNoticeComponent,
    RegisterUserComponent,
    PropertyCardComponent,
    UsersListComponent,
    PropertyListComponent,
    BackendUsersListComponent,
    PerformanceReportComponent,
    NotificationComponent,
    DeleteAssetsComponent,
    NotificationListComponent,
    AddNewAdBannerComponent, 
    OrganisationUserListComponent, 
    AddEditBranchComponent, 
    OrganisationDashboardComponent, 
    ManageOrganisationComponent, 
    ViewOrgAssetComponent, 
    OrgAssetFollowupComponent, 
    OrgAssetHistoryComponent, 
    AddMultipleAssetsComponent, 
    OrgMatchedNoticeComponent, 
    DeletedAssetsComponent, 
    ConfirmationDialogComponent, 
    OrganisationNoticesComponent, 
    AcknowledgeNotificationComponent, 
    AcknowledgedReportComponent, 
    AssetsReportComponent, 
    OcrAddNoticeComponent
  ],
  imports: [
    NgbPopoverModule,
    NgbModule,
    MatTabsModule,
    NgChartsModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
    HttpClientModule,
    //MatSlideToggleModule,
    //MatTableModule,
    //DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,    
    //ModalModule.forRoot() ,
    //PopoverModule,
    RouterModule.forChild(routes),
    //PaginationModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,    
    MatInputModule,
    MatListModule,
    MatMenuModule,    
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,   
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,    
    MatSortModule,
    MatStepperModule,
    MatTableModule,    
    MatTreeModule    ,

  ],
  providers: [
    //PaginationConfig
  ],
  exports:[AddNewAdBannerComponent]
  ,entryComponents:[
    AddNewAdBannerComponent,
    ConfirmationDialogComponent]

})

export class BackendModule { }
