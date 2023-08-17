import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MappingService, SharedModelService, MasterDataService } from '../../services';
import { TableColumn, TableConfig, SortEnum } from '../../models';
import { AddOrganisationModel, NoticeType } from 'src/app/models/column';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataFormsComponent } from 'src/app/backend/master-data-forms/master-data-forms.component';
import { ToastrService } from 'ngx-toastr';

declare var $;

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor(
    private ms: MappingService,
    private sm: SharedModelService,
    private masterDataService: MasterDataService,
    private router: Router,
    private route: ActivatedRoute,
    private compOne: MasterDataFormsComponent,
    public toastr: ToastrService
  ) { }

  someSubscription: any;
  addOrganisationModel: AddOrganisationModel = new AddOrganisationModel();
  noticeType: NoticeType = new NoticeType();

  TableRows: any;
  parentbranch: any;
  BranchId: any;
  isDataLoaded: boolean = false;
  countryList: any = [];
  BranchList: any = [];
  stateList: any = [];
  CityList: any = [];
  OrganisationList: any = [];
  VillageList: any = [];
  country_id: any;
  OrgId = "null"
  state_id: any;
  isShowLoader: boolean = false;
  city_id: any;
  TalukaList: any;
  taluka_id: any;
  OrgDetails: AddOrganisationModel
  SelectedCountryID: any;
  @Input() tableRows: Array<any> = null;
  @Input() tableConfig: TableConfig = null;

  @Output() onAdd: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onSort: EventEmitter<any> = new EventEmitter();
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  @Output() onPopupAction: EventEmitter<string> = new EventEmitter();

  //This event will be raised when you wish to use custom popup for add and edit
  @Output() onPopupEvent: EventEmitter<any> = new EventEmitter();

  addRowModel: any = {};

  // tableColumns: Array<TableColumn> = null;
  ngOnInit() {
    // console.table(this.tableConfig);
    // this.tableConfig.columns = this.tableConfig.columns;
    this.tableConfig.columns.forEach(column => {
      this.addRowModel[column.name] = null;
    });

    if (this.tableConfig.addPopupTitle == "Add Organisations") {
      this.getCountry();
    }
    if (this.tableConfig.addPopupTitle == "Add Branch") {
      this.getCountry();
      // this.getOrgList();
    }
  }

  changedCountry(e) {
    this.country_id = this.addOrganisationModel.CountryId;
    this.getState(this.country_id);
  }

  changedState(e) {
    this.state_id = this.addOrganisationModel.StateId;
    this.getCity(this.state_id);
  }

  changedCity(e) {
    this.city_id = this.addOrganisationModel.CityId;
    this.getTaluka(this.city_id);
  }

  changedTaluka(e) {
    this.taluka_id = this.addOrganisationModel.TalukaId;
    this.getVillage(this.taluka_id);
  }

  getCountry() {
    this.masterDataService.getCountyList()
      .subscribe(country => {
        this.countryList = country;
        this.addOrganisationModel.CountryId = 1;
        this.getState(this.addOrganisationModel.CountryId);
      });
  }

  getParentBranchesList(OrgId, BranchId) {
    this.masterDataService.getParentBranchesList(OrgId, BranchId)
      .subscribe(branch => {
        this.BranchList = branch;
      });
  }


  getState(countryId) {
    this.masterDataService.getStateList(countryId)
      .subscribe(state => {
        this.stateList = state;
      });
  }


  getCity(stateId) {
    var isActive = true;
    this.masterDataService.getCityList(stateId, isActive)
      .subscribe(city => {
        this.CityList = city;
      });
  }

  getTaluka(cityId) {
    this.masterDataService.getTalukaList(cityId)
      .subscribe(taluka => {
        this.TalukaList = taluka;
      });
  }

  getVillage(talukaId) {
    var isActive = true;
    this.masterDataService.getVillageList(talukaId, isActive)
      .subscribe(Village => {
        this.VillageList = Village;
      });
  }

  getOrg(OrgId) {

    this.masterDataService.getOrgDetails(OrgId)
      .subscribe(org => {
        this.addOrganisationModel.OrganisationName = org[0].name;
        this.addOrganisationModel.OrganisationDisplayName = org[0].displayName;
        this.addOrganisationModel.CountryId = org[0].countryId;
        this.addOrganisationModel.StateId = org[0].stateId;
        this.addOrganisationModel.CityId = org[0].cityId;
        this.addOrganisationModel.TalukaId = org[0].talukaId;
        this.addOrganisationModel.VillageId = org[0].villageId;
        this.addOrganisationModel.OrganisationAddress = org[0].address;
      });
  }

  reset() {
    if (this.tableConfig.addPopupTitle == "Add Organisations") {

      this.addOrganisationModel.OrganisationName = null;
      this.addOrganisationModel.OrganisationDisplayName = null;

      this.addOrganisationModel.OrganisationAddress = null;
      // this.addOrganisationModel.StateId =null;
      // this.stateList=this.addOrganisationModel.StateId;
    }
    if (this.tableConfig.addPopupTitle == "Add Branch") {

      this.addOrganisationModel.OrganisationId = null;
      this.addOrganisationModel.BranchName = null;
      this.addOrganisationModel.BranchDisplayName = null;
      this.addOrganisationModel.BranchAddress = null;
      this.addOrganisationModel.ParentBranchId = null;
    }

    this.addOrganisationModel.CityId = null;
    this.CityList = this.addOrganisationModel.CityId;

    this.addOrganisationModel.TalukaId = null;
    this.TalukaList = this.addOrganisationModel.TalukaId;

    this.addOrganisationModel.VillageId = null;
    this.VillageList = this.addOrganisationModel.VillageId;
  }

  validatenoticeForm() {
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";

    if (this.noticeType.name == "")
      validationErrors.push("Name");

    if (this.noticeType.displayName == "")
      validationErrors.push("Display Name");

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      this.toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }

  addNoticetype():any {
    if (!this.validatenoticeForm()) {
      return false;
    }
    else {
      this.isShowLoader = true;
      this.masterDataService.addNoticeType(this.noticeType)
        .subscribe((addedRow: any) => {
          let message = addedRow[0].message;

          this.toastr.success(message, "Success");
          this.isShowLoader = false;
          this.isDataLoaded = true;
          this.masterDataService.getNoticeType();
          if (this.noticeType.id == undefined) {
            this.onPopupAction.emit('onHideModal');
            $('#add-mode-modal').modal('hide');
          } else {
            this.onPopupAction.emit('onHideModal');
            $('#edit-mode-modal').modal('hide');
          }
        },
          error => {
            this.isShowLoader = false;
            this.toastr.error('Failed to create NoticeType!', "Error");
          });
    }
  }

  addBranch():any {
    if (this.BranchId == undefined) {
      this.addOrganisationModel.BranchId = 0;
    } else {
      this.addOrganisationModel.BranchId = this.BranchId;
    }

    if (!this.validateForm()) {
      return false;
    }
    else {
      this.addOrganisationModel.isActive = true;
      this.isShowLoader = true;
      this.masterDataService.addBranch(this.addOrganisationModel)
        .subscribe((addedRow: any) => {

          let message = addedRow[0].message;

          this.toastr.success(message, "Success");
          this.isShowLoader = false;
          this.isDataLoaded = true;
          this.compOne.onTableChange("Branch");

        },
          error => {
            this.isShowLoader = false;
            this.toastr.error('Failed to create Branch!', "Error");
          });

      if (this.BranchId == undefined) {
        this.onPopupAction.emit('onHideModal');
        $('#add-mode-modal').modal('hide');
      } else {
        this.onPopupAction.emit('onHideModal');
        $('#edit-mode-modal').modal('hide');
      }
    }
  }

  addOrganisation():any {
    this.isShowLoader = true;
    if (this.OrgId == "null") {
      this.addOrganisationModel.OrgId = 0;
    } else {
      this.addOrganisationModel.OrgId = this.OrgId;
    }

    if (!this.validateForm()) {
      return false;
    }
    else {
      this.addOrganisationModel.isActive = true;
      this.isShowLoader = true;
      this.masterDataService.addOrg(this.addOrganisationModel)
        .subscribe((addedRow: any) => {

          let message = addedRow[0].message;

          this.toastr.success(message, "Success");
          this.isShowLoader = false;
          this.isDataLoaded = true;
          this.compOne.onTableChange("Organisations");

        },
          error => {
            this.isShowLoader = false;
            this.toastr.error('Failed to create Organisation!', "Error");
          });
      if (this.OrgId == "null") {
        this.onPopupAction.emit('onHideModal');
        $('#add-mode-modal').modal('hide');
      } else {
        this.onPopupAction.emit('onHideModal');
        $('#edit-mode-modal').modal('hide');
      }
    }
  }

  validateForm() {
    let validationErrors: Array<string> = [];
    let isValid: boolean = true;
    let validationMessage = "Please Enter ";

    if (this.tableConfig.addPopupTitle == "Add Organisations") {
      if (this.addOrganisationModel.OrganisationName == undefined)
        validationErrors.push("Organisation Name");

      if (this.addOrganisationModel.OrganisationDisplayName == undefined)
        validationErrors.push("Organisation Dispplay Name");

      if (this.addOrganisationModel.OrganisationAddress == undefined)
        validationErrors.push("Address");
    }

    if (this.tableConfig.addPopupTitle == "Add Branch") {
      if (this.addOrganisationModel.BranchName == undefined)
        validationErrors.push("Branch Name");

      if (this.addOrganisationModel.BranchDisplayName == undefined)
        validationErrors.push("Branch Display Name");

      if (this.addOrganisationModel.BranchAddress == undefined)
        validationErrors.push("Address");
      if (this.parentbranch == 2) {

        if (this.addOrganisationModel.ParentBranchId == undefined)
          validationErrors.push("Branch");
      }
    }

    if (this.addOrganisationModel.CountryId == undefined)
      validationErrors.push("Country");

    if (this.addOrganisationModel.StateId == undefined)
      validationErrors.push("State");

    if (this.addOrganisationModel.CityId == undefined)
      validationErrors.push("City");

    if (this.addOrganisationModel.TalukaId == undefined)
      validationErrors.push("Taluka");

    if (this.addOrganisationModel.VillageId == undefined)
      validationErrors.push("Village");

    if (validationErrors.length > 0) {
      validationMessage += validationErrors.join(", ");
      this.toastr.error(validationMessage, "Validation Error");
      isValid = false;
    }
    return isValid;
  }


  isValidForm(formModel: any) {
    var columns = this.tableConfig.columns.filter(x => x.hidden != true);
    for (var index = 0; index < columns.length; index++) {
      var column = columns[index];
      if (formModel[column.name] == null || (column.type == "string" && formModel[column.name].trim() == ""))
        return false;
    }
    return true;
  }

  // Start : Output Events
  onRowAdd():any {
    if (!this.isValidForm(this.addRowModel)) {
      this.sm.showMessage({ message: this.ms.validations["addRowForm"], type: "error" });
      return false;
    }

    this.onAdd.emit(this.addRowModel);
    this.closePopupById('#add-mode-modal');
  }

  onRowEdit(row: any) {
    $("#edit-mode-modal").modal('show');
    this.OrgId = row.orgId;
    this.BranchId = row.branchId
    if (this.tableConfig.addPopupTitle == 'Notice Type') {
      this.noticeType.id = row.id;
      this.noticeType.name = row.name;
      this.noticeType.displayName = row.displayName;
      this.noticeType.sortOrder = row.sortOrder;

      if (row.isBanking == true) {
        this.noticeType.isBanking = "1";
      }
      else {
        this.noticeType.isBanking = "0";
      }
    }


    if (this.tableConfig.addPopupTitle == 'Add UnitType' || this.tableConfig.addPopupTitle == 'Add Paper' || this.tableConfig.addPopupTitle == 'Add Land Category') {
      if (this.tableConfig.useDefaultPopup) {
        $("#edit-mode-modal").modal('show');
        this.currentRow = JSON.parse(JSON.stringify(row));
      } else {
        this.onPopupEvent.emit({ type: "EDIT", editedRow: row });
      }
    }
  }

  Branchstatus(isActive, branchId) {
    this.masterDataService.Branchstatus(isActive, branchId)
      .subscribe(message => {
        this.toastr.success("Branch Updated Successfully", "Success");
        this.compOne.onTableChange("Branch");
      });
  }

  Organisationstatus(isActive, orgId) {
    this.masterDataService.Organisationstatus(isActive, orgId)
      .subscribe(message => {
        this.toastr.success("Organisation Updated Successfully", "Success");
        this.compOne.onTableChange("Organisations");
      });
  }


  currentRow: any = null;

  onTypeChange(row: any) {
    this.noticeType = row
    this.noticeType.isBanking = !row.isBanking;
    this.addNoticetype();
  }

  onRowDelete(row: any) {
    row.isActive = !row.isActive;
    if (this.tableConfig.addPopupTitle == "Add Branch") {
      this.Branchstatus(row.isActive, row.branchId);
    }
    if (this.tableConfig.addPopupTitle == "Add Organisations") {
      this.Organisationstatus(row.isActive, row.orgId);
    }
    if (this.tableConfig.addPopupTitle == "Add Land Category" || this.tableConfig.addPopupTitle == "Add UnitType" || this.tableConfig.addPopupTitle == "Add Paper" || this.tableConfig.addPopupTitle == "Notice Type") {
      this.masterDataService.updateLookupEntry(row, this.tableConfig.serviceUrl.update)
        .subscribe((m: any) => {

          let message = m;
          this.isShowLoader = false;

          var currentRow = this.tableRows.find(x => x.id == row.id);
          if (currentRow != null)
            currentRow = row;

          this.toastr.success("Row Updated Successfully", "Success");
        },
          error => {
            this.isShowLoader = false;
            this.toastr.error('Failed To Updated Row!', "Error");
            console.log(error);
          });
    }
  }

  onRowUpdate():any {
    if (!this.isValidForm(this.currentRow)) {
      this.sm.showMessage({ message: this.ms.validations["updateRowForm"], type: "error" });
      return false;
    }

    let updatedAt = this.tableRows.findIndex(x => x.id == this.currentRow.id);
    if (updatedAt >= 0) {
      this.tableRows[updatedAt] = this.currentRow;
      this.onUpdate.emit(this.currentRow);
    }
    this.closePopupById('#edit-mode-modal');
  }

  ASC: SortEnum = SortEnum.ASC;
  DESC: SortEnum = SortEnum.DESC;
  onColumnSort(column: TableColumn) {
    column.sortType = column.sortType == SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC;
    var sortInfo = { columns: this.tableConfig.columns, sortedColumn: column };
    // this.onSort.emit(sortInfo);
    this.tableRows.sort(function (a, b) {
      return column.sortType === SortEnum.ASC ? a[column.name].localeCompare(b[column.name]) : -(a[column.name].localeCompare(b[column.name]));
    });
  }
  
  changedtype(e) {  
    this.noticeType.isBanking=e;
  }

  // End : Output Events
  showAddRowPopup() {
    this.reset();
    if (this.tableConfig.addPopupTitle == "Add Organisations") {
      this.onPopupAction.emit('onShowModal');
      $("#add-mode-modal").modal('show');

    } else {
      if (this.tableConfig.useDefaultPopup) {
        this.addRowModel = {};
        this.onPopupAction.emit('onShowModal');
        $("#add-mode-modal").modal('show');

      } else {
        this.onPopupEvent.emit({ type: "ADD" });
      }
    }
  }

  closePopupById(popupId: string) {
    this.onPopupAction.emit('onHideModal');
    $(popupId).modal('hide');
  }

  goToPage(pageNumber: number, isDisabled: boolean) {
    if (isDisabled == false) {
      this.onPageChange.emit(pageNumber);
    }
  }
}