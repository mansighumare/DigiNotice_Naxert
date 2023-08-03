import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TableConfig } from 'src/app/models';
import { AppConfig } from './config.service';

export function getDefaultConfig(addPopupTitle: string, editPopupTitle: string) {
    return {
        editPopupTitle: editPopupTitle,
        addPopupTitle: addPopupTitle,
        pagination: true,
        sortable: true,
        localSorting: false,
        pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
    }
}

@Injectable({ providedIn: 'root' })
export class MappingService {

    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }

    validations: any = {
        "addRowForm": "<b>Invalid Form: </b> Please fill all the fields",
        "updateRowForm": "<b>Invalid Form: </b> Please fill all the fields",
        "saveMessage": "Saved Successfully",
        "deleteMessage": "Deleted Successfully",
        "updateMessage": "Updated Successfully",
    }

    columnConfigs: any = {
        "Land Categories": {
            columns: [
                { name: "id", displayName: "Id", hidden: true, type: 'number' },
                { name: "name", displayName: "Name", type: 'text' },
                { name: "displayName", displayName: "Display Name", type: 'text' },
                { name: "sortOrder", displayName: "Sort Order", hidden: true, type: 'number' },
            ],
            editPopupTitle: "Edit Land Category",
            addPopupTitle: "Add Land Category",
            pagination: true,
            sortable: true,
            localSorting: false,
            pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
            useDefaultPopup: true,
            addRowButtonText: "Add Land Category",
            serviceName: "getLandCategories",
            serviceUrl: {
                get: "/Master/GetLandCategory",
                add: "/Master/UpdateLandCategory",
                update: "/Master/UpdateLandCategory",
                delete: "/Master/DeleteLandCategory",
            },
        },
        "News Papers": {
            columns: [
                { name: "id", displayName: "Id", hidden: true, type: 'number' },
                { name: "name", displayName: "Name", type: 'text' },
                { name: "edition", displayName: "Edition", hidden: true, type: 'text' },
            ],
            editPopupTitle: "Edit Paper",
            addPopupTitle: "Add Paper",
            pagination: true,
            sortable: true,
            localSorting: false,
            pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
            useDefaultPopup: true,
            addRowButtonText: "Add Paper",
            serviceName: "getNewsPapers",
            serviceUrl: {
                get: "/Master/GetPaper",
                add: "/Master/UpdatePaper",
                update: "/Master/UpdatePaper",
                delete: "/Master/DeletePaper",
            },
        },
        // "Keywords": {
        //     columns: [
        //         { name: "id", displayName: "Id", hidden: true, type: 'number' },
        //         { name: "name", displayName: "Name", type: 'text' },
        //         { name: "description", displayName: "Description", type: 'text' },
        //     ],
        //     editPopupTitle: "Edit Keyword",
        //     addPopupTitle: "Add Keyword",
        //     pagination: true,
        //     sortable: true,
        //     localSorting: false,
        //     pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
        //     useDefaultPopup: true,
        //     addRowButtonText: "Add Keyword",
        //     serviceName: "getKeyword",
        //     serviceUrl: {
        //         get: "/Lookup/GetKeyword",
        //         add: "/Lookup/AddKeyword",
        //         update: "/Lookup/UpdateKeyword",
        //         delete: "/Lookup/DeleteKeyword",
        //     },
        // },
        // "Notice Types": {
        //     columns: [
        //         { name: "id", displayName: "Id", hidden: true, type: 'number' },
        //         { name: "name", displayName: "Name", type: 'text' },
        //         { name: "description", displayName: "Description", type: 'text' },
        //     ],
        //     editPopupTitle: "Edit NoticeType",
        //     addPopupTitle: "Add NoticeType",
        //     pagination: true,
        //     sortable: true,
        //     localSorting: false,
        //     pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
        //     useDefaultPopup: true,
        //     addRowButtonText: "Add NoticeType",
        //     serviceName: "getNoticeType",
        //     serviceUrl: {
        //         get: "/Lookup/GetNoticeType",
        //         add: "/Lookup/AddNoticeType",
        //         update: "/Lookup/UpdateNoticeType",
        //         delete: "/Lookup/DeleteNoticeType",
        //     },
        // },
        // "Person Types": {
        //     columns: [
        //         { name: "id", displayName: "Id", hidden: true, type: 'number' },
        //         { name: "name", displayName: "Name", type: 'text' },
        //         { name: "description", displayName: "Description", type: 'text' },
        //     ],
        //     editPopupTitle: "Edit PersonType",
        //     addPopupTitle: "Add PersonType",
        //     pagination: true,
        //     sortable: true,
        //     localSorting: false,
        //     pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
        //     useDefaultPopup: true,
        //     addRowButtonText: "Add PersonType",
        //     serviceName: "getPersonType",
        //     serviceUrl: {
        //         get: "/Lookup/GetPersonType",
        //         add: "/Lookup/AddPersonType",
        //         update: "/Lookup/UpdatePersonType",
        //         delete: "/Lookup/DeletePersonType",
        //     },
        // },
        "Unit Types": {
            columns: [
                { name: "id", displayName: "Id", hidden: true, type: 'number' },
                { name: "displayName", displayName: "Display Name", type: 'text' },
                { name: "description", displayName: "Description", type: 'text' },
                { name: "unitName", displayName: "Unit Name", type: 'text' },
            ],
            editPopupTitle: "Edit UnitType",
            addPopupTitle: "Add UnitType",
            pagination: true,
            sortable: true,
            localSorting: false,
            pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
            useDefaultPopup: true,
            addRowButtonText: "Add UnitType",
            serviceName: "getUnitType",
            serviceUrl: {
                get: "/Master/GetUnitType",
                add: "/Master/UpdateUnitType",
                update: "/Master/UpdateUnitType",
                delete: "/Master/DeleteUnitType",
            },
        },
        // "Organisations": {
        //     columns: [
        //         { name: "id", displayName: "Id", hidden: true, type: 'number' },
        //         { name: "name", displayName: "Name", type: 'text' },
        //         { name: "displayName", displayName: "Display Name", type: 'text' },
        //         { name: "address", displayName: "Address", type: 'text' },
        //     ],
        //     editPopupTitle: "Edit Organisations",
        //     addPopupTitle: "Add Organisations",
        //     pagination: true,
        //     sortable: true,
        //     localSorting: false,
        //     pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
        //     useDefaultPopup: true,
        //     addRowButtonText: "Add Organisations",
        //     serviceName: "getUnitType",
        //     serviceUrl: {
        //         get: "/Master/GetOragnisations",
        //         add: "/Master/AddOragnisations",
        //         update: "/Master/UpdateOragnisations",
        //         delete: "/Master/DeleteOragnisations",
        //     },
        // },
        // "Branch": {
        //     columns: [
        //         { name: "BranchId", displayName: "BranchId", hidden: true, type: 'number' },
        //         { name: "name", displayName: "Name", type: 'text' },
        //         { name: "displayName", displayName: "Display Name", type: 'text' },
        //         { name: "address", displayName: "Address", type: 'text' },
        //     ],
        //     editPopupTitle: "Add Branch",
        //     addPopupTitle: "Add Branch",
        //     pagination: true,
        //     sortable: true,
        //     localSorting: false,
        //     pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
        //     useDefaultPopup: true,
        //     addRowButtonText: "Add Branch",
        //     serviceName: "getUnitType",
        //     serviceUrl: {
        //         get: "/Master/GetBranches",
        //         add: "/Master/AddBranch",
        //         update: "/Master/AddBranch",
        //         delete: "/Master/AddBranch",
        //     },
        // },
        "Notice Type": {
            columns: [
                { name: "name", displayName: "Name", type: 'text' },
                { name: "id", displayName: "id", hidden: true, type: 'number' },
                { name: "displayName", displayName: "Display Name", type: 'text' },
            
            ],
            editPopupTitle: "Notice Type",
            addPopupTitle: "Notice Type",
            pagination: true,
            sortable: true,
            localSorting: false,
            pageInfo: { pageSize: 10, currentPage: 1, totalItems: 0 },
            useDefaultPopup: true,
            addRowButtonText: "Notice Type",
            serviceName: "getUnitType",
            serviceUrl: {
                get: "/Master/GetNoticeType",
                add: "/Master/AddNoticeType",
                update: "/Master/AddNoticeType",
                delete: "/Master/AddNoticeType",
            },
        }

        
    };




    getMappings(tableName: string): TableConfig {
        return this.columnConfigs[tableName];
    }
    countryList: any = [];

}
