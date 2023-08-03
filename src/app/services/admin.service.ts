import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/services';

declare var $;

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(
        private http: HttpClient,
        public appConfig: AppConfig) {

    }

    addRow(row: number, tableName: string) {

    }

    editRow(row: any, tableName: string) {

    }

    deleteRow(row: number, tableName: string) {

    }

    sendMailToAdmin(contactInfo: any) {
        var url = this.appConfig.getApiPath("Notice", "AddContactUs");
        return this.http.post(url, contactInfo);
    }

}
