import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableComponent } from '../components/table/table.component';
import { ViewNoticeComponent } from '../components/notice-card/view-notice/view-notice.component';
import { NoticeCardComponent } from '../components/notice-card/notice-card.component';
import { PropertyCardComponent } from '../components/property-card/property-card.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoaderComponent } from '../components/loader/loader.component';
import { AddPropertyComponent } from 'src/app/components/asset-manager/add-property/add-property.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { HelpFeedbackComponent } from '../components/help-feedback/help-feedback.component';
import { ContactUsComponent } from '../components/contact-us/contact-us.component';
import { MyProfileComponent } from '../components/my-profile/my-profile.component';
import { BookmarkComponent } from '../components/bookmark/bookmark.component';
import { MatchedNoticeComponent } from '../components/matched-notice/matched-notice.component';
import { ViewPropertyComponent } from '../components/asset-manager/view-property/view-property.component';

@NgModule({
    declarations: [
        TableComponent,
        ViewNoticeComponent,
        NoticeCardComponent,
        PropertyCardComponent,
        AddPropertyComponent,
        LoaderComponent,
        SettingsComponent,
        HelpFeedbackComponent,
        ContactUsComponent,
        MyProfileComponent,
        BookmarkComponent,
        MatchedNoticeComponent,ViewPropertyComponent
    ],
    imports: [
        CommonModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule
       ],
    exports: [
        SettingsComponent,
        HelpFeedbackComponent,
        ContactUsComponent,
        MyProfileComponent,
        BookmarkComponent,
        TableComponent,
        ViewNoticeComponent,
        NoticeCardComponent,
        PropertyCardComponent,
        AddPropertyComponent,
        LoaderComponent,
        MatchedNoticeComponent,
        ViewPropertyComponent
    ]
})
export class SharedModule {
// static forRoot(config: any): ModuleWithProviders {
//     return {
//         ngModule: SharedModule,
//         providers: [{ useValue: config }]
//     };
// }

// static forChild(): ModuleWithProviders {
//     return {
//         ngModule: SharedModule
//     };
// }
}