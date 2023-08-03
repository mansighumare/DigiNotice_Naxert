import { Component, OnInit } from '@angular/core';
import {  MasterDataService, MappingService } from 'src/app/services';
import { Taluka, Village } from 'src/app/models';
import { Router } from '@angular/router';
import { LocationMasterService } from 'src/app/services/location-master.service';

declare var $;
declare var toastr;
@Component({
  selector: 'app-location-master',
  templateUrl: './location-master.component.html',
  styleUrls: ['./location-master.component.scss']
})
export class LocationMasterComponent implements OnInit {

  constructor(
    private ms: MappingService,
    private masterDataService: MasterDataService,
    private router: Router,
    public locationMasterService:LocationMasterService
  ) { }

  isShowLoader: boolean = false;
  isDataLoaded: boolean = false;
  talukaId: any;
  cityId: any;
  stateId: any;
  // activeTabName: string = 'Active';

  villageList: Array<VillageInfo> = new Array<VillageInfo>();
  districtList: Array<DistrictInfo> = new Array<DistrictInfo>();

  ngOnInit() {
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      let village: VillageInfo = new VillageInfo();
      village.countryName = "India";
      village.stateName = "Maharashtra";
      village.cityName = "Pune";
      village.talukaName = "Baner";
      village.villageName = "Baner";
      this.villageList.push(village);

      this.cityId = Number(this.addLocationDto.districtId);
      this.stateId = Number(this.addLocationDto.stateId);
      this.getDistrictList();
      this.locationMasterService.getTalukas(this.cityId, this.isActiveOnly);

    }
    else {

      this.router.navigate(["./login"]);
    }

  }

  // onTabClick(tabName: string) {
  //   this.activeTabName = tabName;
  // }
  locationTableName: string = "District";
  addLocationDto: AddLocationDto = new AddLocationDto();
  onAddLocation() {
    switch (this.locationTableName) {
      case 'District':
        this.addNewDistrict();
        break;
      case 'Taluka':
        this.addNewTaluka();
        break;
      case 'Village':
        this.addNewVillage();
        break;

      default:
        break;
    }
    $("#add-location-modal").modal('hide');
  }

  editedTaluka: any = {};
  editDistrict: any = {};
  onEditTaluka(taluka: any) {
   
    this.editedTaluka = taluka;
    this.editedTaluka.talukaName = taluka.name;
    $("#edit-location-modal").modal('show');
  }


  onEditDistrict(district: any) {
   
    this.editDistrict = district;
    this.editDistrict.districtName = district.name;
    $("#edit-location-modal").modal('show');
  }

  editedVillage: any = {};
  onEditVillage(village: any) {
   
    this.editedVillage = village;
    this.editedVillage.villageName = village.name;
    $("#edit-location-modal").modal('show');
  }

  onUpdateLocation() {
   
    switch (this.locationTableName) {
      case 'District':
        this.updateDistrict();
        break;
      case 'Village':
        this.updateVillage();
        break;
      case 'Taluka':
        this.updateTaluka();
        break;
      default:
        break;
    }
    $("#edit-location-modal").modal('hide');
  }

  updateTaluka() {
   
    this.isDataLoaded = false;
    this.editedTaluka.name = this.editedTaluka.talukaName;
    this.masterDataService.updateTaluka(this.editedTaluka)
      .subscribe((updatedRow: any) => {
        this.editedTaluka.name = updatedRow.name;
        toastr.success('Taluka Updated Successsfully!', "Success");
        this.isDataLoaded = true;
        this.locationMasterService.getTalukas(this.cityId, this.isActiveOnly);
      },
        error => {
          toastr.error('Failed to Update Taluka!', "Error");
          this.isDataLoaded = true;
        });
  }



  updateDistrict() {
   
    this.isDataLoaded = false;
    this.editDistrict.name = this.editDistrict.districtName;
    this.masterDataService.updateDistrict(this.editDistrict)
      .subscribe((updatedRow: any) => {
        this.editDistrict.name = updatedRow.name;
        toastr.success('District Updated Successsfully!', "Success");
        this.isDataLoaded = true;
        this.getDistrictList();
      },
        error => {
          toastr.error('Failed to Update District!', "Error");
          this.isDataLoaded = true;
        });
  }


  updateVillage() {
   
    this.isDataLoaded = false;
    this.editedVillage.name = this.editedVillage.villageName;
    this.masterDataService.updateVillage(this.editedVillage)
      .subscribe((updatedRow: any) => {
        this.isDataLoaded = true;
        this.editedVillage.name = updatedRow.name;
        toastr.success('Village Updated Successsfully!', "Success");
        this.getVillageList();
      },
        error => {
          this.isDataLoaded = true;
          toastr.error('Failed to Update Village!', "Error");
        });
  }

  addNewTaluka() {
   
    var talukaDto = { "id": 0, "name": this.addLocationDto.talukaName, "cityId": this.addLocationDto.districtId };
    this.masterDataService.addTaluka(talukaDto)
      .subscribe((addedRow: any) => {
       
        if (addedRow.isExist) {
          toastr.info('Taluka Name Already Exists!', "Info");
        } else {
          toastr.success('Taluka Added Successsfully!', "Success");
         
          this.masterDataService.getTalukas(this.cityId)
            .subscribe((talukaList: Array<Taluka>) => {
              this.isDataLoaded = true;
              this.locationMasterService.talukaList = talukaList;
            }, error => {
              this.locationMasterService.talukaList = [];
            });
        }
      }, error => {
        this.isDataLoaded = true;
        toastr.error('Failed to Add Taluka!', "Error");
      });
  }

  addNewDistrict() {
   
    var distictDto = { "id": 0, "name": this.addLocationDto.districtName, "stateId": this.addLocationDto.stateId };
    this.masterDataService.addDistrict(distictDto)
      .subscribe((addedRow: any) => {
        if (addedRow.isExist) {
          toastr.info('District Name Already Exists!', "Info");
        } else {
          toastr.success('District Added Successsfully!', "Success");

          //  this.stateId= Number(this.addLocationDto.districtId);

        }
        this.getDistrictList();
      }, error => {
        this.isDataLoaded = true;
        toastr.error('Failed to Add District!', "Error");
      });
  }

  addNewVillage() {
   

    var villageDto = { "id": 0, "name": this.addLocationDto.villageName, "talukaId": this.addLocationDto.talukaId };
    this.masterDataService.addVillage(villageDto)
      .subscribe((addedRow: any) => {
        if (addedRow.isExist) {
          toastr.info('Village Name Already Exists!', "Info");
        } else {
          toastr.success('Village Added Successsfully!', "Success");
          this.getVillageList()
        }
      }, error => {
        this.isDataLoaded = true;
        toastr.error('Failed to Add Village!', "Error");
      });
  }

  onStateChange($event) {
   
    this.stateId = $event.target.value;
    this.addLocationDto.districtId = "";
    this.addLocationDto.talukaId = "";
    this.addLocationDto.villageId = "";
    this.locationMasterService.cityList = [];
    this.locationMasterService.talukaList = [];
    this.locationMasterService.villageList = [];
    this.getDistrictList();
    this.locationTableName = "District";
  }

  onDistrictChange($event) {
   
    this.cityId = $event.target.value;
    this.addLocationDto.talukaId = "";
    this.addLocationDto.villageId = "";
    this.locationMasterService.talukaList = [];
    this.locationMasterService.villageList = [];
    this.locationMasterService.getTalukas(this.cityId,this.isActiveOnly);

    this.locationTableName = "Taluka";
  }

  onTalukaChange($event) {
   
    this.talukaId = $event.target.value;
    this.addLocationDto.villageId = "";
    this.locationMasterService.villageList = [];
    this.getVillageList()
    this.locationTableName = "Village";
  }

  talukaInterval: any = null;
  villageInterval: any = null;
  onActiveInActive(row, tableName) {
   

    row.isActive = !row.isActive;
    switch (tableName) {
      case 'District':
        this.editDistrict = row;
        this.masterDataService.updateDistrict(this.editDistrict)
          .subscribe((updatedRow: any) => {
            var status = updatedRow.isActive ? "Active" : "InActive";
            toastr.success('Updated District status to ' + status + '!', "Success");
            this.getDistrictList();
          },
            error => {
              toastr.error("Failed to update status");
            });
        break;
      case 'Village':
        this.editedVillage = row;
        this.masterDataService.updateVillage(this.editedVillage)
          .subscribe((updatedRow: any) => {
            var status = updatedRow.isActive ? "Active" : "InActive";
            toastr.success('Updated Village status to ' + status + '!', "Success");
            this.getVillageList();

          },
            error => {
              toastr.error("Failed to update status");
            });
        break;
      case 'Taluka':

        this.editedTaluka = row;
        this.masterDataService.updateTaluka(this.editedTaluka)
          .subscribe((updatedRow: any) => {
            var status = updatedRow.isActive ? "Active" : "InActive";
            toastr.success('Updated Taluka status to ' + status + '!', "Success");
            this.locationMasterService.getTalukas(this.cityId,this.isActiveOnly);
          },
            error => {
              toastr.error("Failed to update status");
            });
        break;
    }
  }


  getDistrictList() {
   

    this.masterDataService.getCityList(this.stateId, this.isActiveOnly).subscribe(
      (r) => {

        this.districtList = r;
      }
    );
  }

  getVillageList() {
   

    this.masterDataService.getVillageList(this.talukaId, this.isActiveOnly).subscribe(
      (r) => {

        this.villageList = r;
      }
    );
  }


  isActiveOnly: boolean = true;
  onActiveCheckboxToggle() {
   

    this.isActiveOnly = !this.isActiveOnly;
    switch (this.locationTableName) {
      case 'District':
        this.stateId = Number(this.addLocationDto.stateId);
        this.getDistrictList();
        break;
      case 'Taluka':
        this.cityId = Number(this.addLocationDto.districtId);
        this.locationMasterService.getTalukas(this.cityId, this.isActiveOnly);
        break;
      case 'Village':
        this.talukaId = Number(this.addLocationDto.talukaId);
        this.getVillageList();
        break;
      default:
        break;
    }
  }

}

export class VillageInfo {
  id: number;
  countryId: number;
  countryName: string;
  stateId: number;
  stateName: string;
  cityId: number;
  cityName: string;
  talukaId: number;
  talukaName: string;
  villageId: number;
  villageName: string;
}
export class DistrictInfo {
  id: number;
  name:string;
  countryId: number;
  countryName: string;
  stateId: number;
  stateName: string;
  cityId: number;
  cityName: string;
}

export class AddLocationDto {
  id: number;
  countryId: string = "1";
  countryName: string;
  stateId: string = "72";
  stateName: string;
  districtId: string = "2";
  districtName: string = "";
  cityName: string;
  talukaId: string = "";
  talukaName: string;
  villageId: string = "";
  villageName: string;
  isActive: boolean = true;
}