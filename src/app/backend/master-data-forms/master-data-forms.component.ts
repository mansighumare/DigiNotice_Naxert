import { Component, OnInit , ViewChild} from '@angular/core';
import { TableColumn, LandCategory, TableConfig, PageInfo } from '../../models';
import { MappingService, MasterDataService } from '../../services';
import { PagerService } from 'src/app/services/pager.service';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

declare var jQuery;
declare var $;

// toastr.success('Notice Added Successsfully!', "Success");
// toastr.error('Failed to create notice!', "Error");
@Component({
  selector: 'app-master-data-forms',
  templateUrl: './master-data-forms.component.html',
  styleUrls: ['./master-data-forms.component.scss']
})
export class MasterDataFormsComponent implements OnInit {

  constructor(
    private ms: MappingService,
    private masterDataService: MasterDataService,
    private pagerService: PagerService,
    private router:Router,
    public toastr: ToastrService
  ) { }

  // tableColumns: Array<TableColumn> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableRows: Array<LandCategory> = null;
  tableConfig: TableConfig = new TableConfig();

  tableNames: any = [];
  selectedTableName: string = "Land Categories";
  isShowLoader: boolean = false;

  ngOnInit() {
    
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      this.tableNames = Object.keys(this.ms.columnConfigs);
      this.tableConfig = this.ms.getMappings(this.selectedTableName);
      this.getRows();
    }
    else{

      this.router.navigate(["./login"]);
    }
 
  }

  onTableChange(tableName) {
    
    this.isDataLoaded = false;
    this.selectedTableName = tableName;
    this.tableConfig = this.ms.getMappings(this.selectedTableName);
    this.getRows();
  }

  isDataLoaded: boolean = false;
  getRows() {
    
    this.masterDataService.getLookupTable(this.tableConfig.serviceUrl.get)
      .subscribe((tableRows: any) => {

        this.tableRows = tableRows;
        this.tableConfig.pageInfo.totalItems = tableRows.length;
        this.tableConfig.pager = this.pagerService.getPager(this.tableConfig.pageInfo);
        this.isDataLoaded = true;
      });
  }

  onRowUpdated(row: any) {
    this.isShowLoader = true;
    this.masterDataService.updateLookupEntry(row, this.tableConfig.serviceUrl.update)
      .subscribe((updatedRow: any) => {
        this.isShowLoader = false;

        var currentRow = this.tableRows.find(x => x.id == row.id);
        if (currentRow != null)
          currentRow = row;

        this.toastr.success('Row Updated Successsfully!', "Success");
      },
      error => {
        this.isShowLoader = false;
        this.toastr.error('Failed To Updated Row!', "Error");
        console.log(error);
      });
  }

  onRowDeleted(row: any) {
    
    this.isShowLoader = true;
    row.isActive = !row.isActive;
    this.masterDataService.updateLookupEntry(row, this.tableConfig.serviceUrl.update)
      .subscribe((updatedRow: any) => {
        this.isShowLoader = false;

        var currentRow = this.tableRows.find(x => x.id == row.id);
        if (currentRow != null)
          currentRow = row;

        this.toastr.success('Row Updated Successsfully!', "Success");
      },
      error => {
        this.isShowLoader = false;
        this.toastr.error('Failed To Updated Row!', "Error");
        console.log(error);
      });
  }

  onRowAdded(row: any) {
    this.isDataLoaded = false;
    row.isActive = true;
    this.masterDataService.addLookupEntry(row, this.tableConfig.serviceUrl.add)
      .subscribe((addedRow:any):any => {
        this.isDataLoaded = true;
        if (addedRow.isExist) {
          this.toastr.error('Entry already exists!', "Error");
          return false;
        }
        this.getRows();
      },
      error => {
        this.isDataLoaded = true;
        console.log(error);
      });
  }

  onColumnSort(sortInfo: any) {
    this.tableConfig.sortInfo = sortInfo;
    this.getRows();
  }

  onPageChange(pageNumber: number) {
    this.tableConfig.pageInfo.currentPage = pageNumber;
    // this.getRows();
  }

}