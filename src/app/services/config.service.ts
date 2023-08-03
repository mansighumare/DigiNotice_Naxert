import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery'
declare var appConfig;

@Injectable({
    providedIn: 'root'
})
export class AppConfig {

    constructor(private http: HttpClient
        // , private authService: AuthenticationService
    ) {
        this.appConfig = appConfig;
        this.apiUrl = this.appConfig.apiUrl;
        this.authUrl = this.appConfig.authUrl;
        this.imagePath = this.appConfig.imagePath;
        this.pdfPath = this.appConfig.pdfPath;
        this.propertyImgPath = this.appConfig.propertyImgPath;
        this.orgPropertyImgPath = this.appConfig.orgPropertyImgPath;
        this.imageAdBannerPath = this.appConfig.imageAdBannerPath;
        this.profileImgPath = this.appConfig.profileImgPath;
    }
    apiUrl: string = "";
    authUrl: string = "";
    imagePath: string = "";
    pdfPath: string = "";
    propertyImgPath: string = "";
    orgPropertyImgPath: string = "";
    profileImgPath: string = "";
    imageAdBannerPath: string = "";
    appConfig: any = {
        apiUrl: "",
        authUrl: "",
        imagePath: ""
    };

    getConfigs() {
        return this.appConfig;
    }

    getApiPath(controllerName: string, methodName: string, params: any = []) {
        var queryString = '';
        if (params.length > 0) {
            queryString = params.join('/');
            return `${this.appConfig.apiUrl}${controllerName}/${methodName}/${queryString}`;
        }
        else
            return `${this.appConfig.apiUrl}${controllerName}/${methodName}`;
    }

    getImageUploadUrl(imageType: string) {
        switch (imageType) {
            case 'notice':
                return this.getApiPath("Notice", "UploadImage", [1]);
            case 'property':
                return this.getApiPath("Notice", "UploadImage", [2]);
            case 'OrgProperty':
                return this.getApiPath("Notice", "UploadImage", [3]);
            case 'profile':
                return this.getApiPath("Account", "UploadImage");
            case 'AdBanner':
                return this.getApiPath("AdBanners", "UploadImage");
            default:
                return this.getApiPath("Notice", "UploadImage", [1]);
        }
    }
}