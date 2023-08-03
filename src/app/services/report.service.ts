import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, AuthenticationService } from 'src/app/services';
import { SearchReportModel } from '../models/performance-report.model';
import { NoticeInfoModel } from '../models';
import { catchError, retry } from 'rxjs/operators';
import { ResponseHelperService } from './response-helper.service';
import { OwnerInfo } from '../models/account.model';

declare var $;
declare var toastr;
@Injectable({ providedIn: 'root' })
export class ReportService {

    constructor(
        private http: HttpClient,
        private appConfig: AppConfig,
        private _helper: ResponseHelperService
        // private authService: AuthenticationService,
    ) {
    }

    isShowDownloadLoader: boolean = false;

    getDashboardData(userId: string, role_guid: string) {
        var url = this.appConfig.getApiPath("Report", "GetDashboardData", [userId, role_guid]);
        return this.http.get(url);
    }


    


    // Get Existing Organisation List for Add Branch
    getOrgansiationList(isActive: boolean, page: number) {
        var url = this.appConfig.getApiPath("Report", "GetOragnisations") + "?isActive=" + isActive + "&page=" + page;
        return this.http.get(url).pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this._helper.handleError) // then handle the error
        );
    }

    //To Show Actie/InActive Users For Dashboard
    getUserslist(isActive: boolean, page: number) {
        var url = this.appConfig.getApiPath("Report", "GetUsersList") + "?isActive=" + isActive + "&page=" + page;
        return this.http.get(url).pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this._helper.handleError) // then handle the error
        );
    }

    //To Show Actie/InActive Papers For Dashboard
    getPaper(isActive: boolean, page: number) {
        var url = this.appConfig.getApiPath("Report", "GetPaper") + "?isActive=" + isActive + "&page=" + page;
        return this.http.get(url).pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this._helper.handleError) // then handle the error
        );
    }


    get_Last30daysNotices_Report(userRole:string,roleGuid:string,userId:string,orgId:number,branchId:number)
    {
        var getLast30DaysNotices={userRole,roleGuid,userId,orgId,branchId}
        var url = this.appConfig.getApiPath("Report", "GetLast30DaysNotices")
        return this.http.post(url,getLast30DaysNotices).pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this._helper.handleError) // then handle the error
        );
    }


    get_Last12Months_Notices_Report(userRole:string,roleGuid:string,userId:string,orgId:number,branchId:number)
    {
        var getLast30DaysNotices={userRole,roleGuid,userId,orgId,branchId}
        var url = this.appConfig.getApiPath("Report", "GetLast12MonthsNotices")
        return this.http.post(url,getLast30DaysNotices).pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this._helper.handleError) // then handle the error
        );
    }

    //To Show Actie/InActive Papers For Dashboard
    getLandCategory(isActive: boolean, page: number) {
        var url = this.appConfig.getApiPath("Report", "GetLandCategory") + "?isActive=" + isActive + "&page=" + page;
        return this.http.get(url).pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this._helper.handleError) // then handle the error
        );
    }


    // getTotalNotice(isActive:boolean) {
    //     var url = this.appConfig.getApiPath("Report", "GetTotalNotice")+"?isActive="+isActive;
    //     return this.http.get(url).pipe(
    //         retry(3), // retry a failed request up to 3 times
    //         catchError(this._helper.handleError) // then handle the error
    //       );  
    // }

    // getBackendUsers(loggedInUserId:any,loggedInUserRoleGuid:any,isActive: boolean) {
    //     var url = this.appConfig.getApiPath("Report", "GetBackendUsers", [isActive]);
    //     return this.http.get(url);
    // }
    getUsers(RoleGuid: any, UserId: any, isActive: boolean, page: number) {

        var InfoParam = { RoleGuid, UserId, isActive, page }
        var url = this.appConfig.getApiPath("User", "GetEndUsers");
        return this.http.post(url, InfoParam).pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this._helper.handleError) // then handle the error;
        );
    }

    searchEndUser(RoleGuid: any, UserId: any, isActive: boolean, page: number,searchString:any) {

        var InfoParam = { RoleGuid, UserId, isActive, page,searchString}
        var url = this.appConfig.getApiPath("User", "SearchEndUser");
        return this.http.post(url, InfoParam).pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this._helper.handleError) // then handle the error;
        );
    }

    updateUserStatus(userIntId: any, userId: any, isActive: any) {

        var url = this.appConfig.getApiPath("User", "UpdateEndUserStatus");
        const data = { userIntId, userId, isActive };
        return this.http.post(url, data).pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this._helper.handleError) // then handle the error
        );
    }

    getAllProperty(page: number, pageSize: number = 10) {
        var url = this.appConfig.getApiPath("Report", "GetAllProperty", [page, pageSize]);
        return this.http.get(url);
    }

    getUsersLookup(userId: string, roleName: string) {
        var url = this.appConfig.getApiPath("Report", "GetLookupUser", [userId, roleName]);
        return this.http.get(url);
    }

    getCities(cityId: number = 20) {
        var url = this.appConfig.getApiPath("Lookup", "GetCity", [cityId]);
        return this.http.get(url);
    }

    getPerformanceReport(searchReportModel: SearchReportModel) {
        var url = this.appConfig.getApiPath("Report", "GetNoticeReport", [true]);
        return this.http.post(url, searchReportModel);
    }

    getNotices(userId: string, pageNo: number, startDate: Date, endDate: Date) {
        let getNotice = { userId, pageNo, startDate, endDate }
        //  ;
        var url = this.appConfig.getApiPath("Report", "GetNotice");
        return this.http.post(url, getNotice);
    }

    getUserInfo(OwnerInfo: OwnerInfo) {
        var url = this.appConfig.getApiPath("Noticedata", "GetNoticeCount");
        return this.http.post(url, OwnerInfo);
    }

    generatePdf(noticeInfoList: Array<NoticeInfoModel>) {

        this.isShowDownloadLoader = true;
        var url = this.appConfig.getApiPath("Report", "GeneratePdf");
        this.http.post(url, noticeInfoList)
            .subscribe((pdfFileName: string) => {
                var url = this.appConfig.pdfPath + pdfFileName;
                this.downloadFile(url, pdfFileName);
                this.isShowDownloadLoader = false;
                toastr.success('Notice Report exported successfully.', "Success");
            }, error => {
                this.isShowDownloadLoader = false;
                toastr.error('Failed To Download Notice Report.', "Error");
            });
    }

    downloadFile(fileURL: string, fileName: string) {
        fileName = fileName.replace('.pdf', '');
        // for non-IE
        if (!window['ActiveXObject']) {
            var save = document.createElement('a');
            save.href = fileURL;
            save.target = '_blank';
            save.download = fileName || 'unknown';

            var evt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            });
            save.dispatchEvent(evt);
            (window.URL || window['webkitURL']).revokeObjectURL(save.href);
        }
        // for IE < 11
        else if (!!window['ActiveXObject'] && document.execCommand) {
            var _window = window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL)
            _window.close();
        }
    }
}
