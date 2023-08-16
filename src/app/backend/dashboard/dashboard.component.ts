import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { AccountService } from 'src/app/services/account.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { MasterDataService } from 'src/app/services';
import { ExcelService } from 'src/app/services/excel.service';
// import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
declare var $;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  page = 1;
  pageSize = 25;
  tbldataLength: number;
  pageSizeOptions: number[] = [3, 5, 8, 10];
  tablename: any;
  tbldata: any = [];
  //table:any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mainChartElements = 31;
  mainChartData1: Array<number> = [];
  mainChartData2: Array<number> = [];
  mainChartData3: Array<number> = [];

  mainChartData: Array<any> = [];

  mainChartLabels: Array<any> = [];

  mainChartOptions: any = {
    tooltips: {
      enabled: true,
      //custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    responsiveAnimationDuration: 0,
    maintainAspectRatio: true ,
    // scales: {
    //   x: [{
    //     gridLines: {
    //       drawOnChartArea: false,
    //     },
    //     ticks: {
    //       callback: function (value: any) {
    //         return value.substring(6, 10).replace("-", "/");
    //       }
    //     }
    //   }],
    //   y: [{
    //     ticks: {
    //       beginAtZero: true,
    //       maxTicksLimit: 5,
    //     }
    //   }]
    // },
    scales: {
      x: {
        display: true, // Display x-axis
        grid: {
          display: false // Hide x-axis grid lines
        }
      },
      y: {
        display: true, // Display y-axis
        ticks: {
          maxTicksLimit: 5 // Set maximum number of y-axis tick marks
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2,
        hoverBackgroundColor: 'rgb(0, 165, 224)', 
        hoverBorderColor: 'rgb(0, 165, 224)' 
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
        hoverBackgroundColor: 'rgb(0, 165, 224)', 
        hoverBorderColor: 'rgb(0, 165, 224)' 
      }
    },
    legend: {
      display: false
    }
  };

  mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: '#d3d3d3',
      borderColor: '#d3d3d3',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: '#d3d3d3',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: '#d3d3d3',
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];

  mainChartLegend = false;
  mainChartType = 'line';

  //  
  public mainChartOptionsEMPAnalaysis: any = {
    tooltips: {
      enabled: true,
      //custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    responsiveAnimationDuration: 0,
    maintainAspectRatio: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
        type: 'linear'
      }
    },
    legend: {
      display: false,
      position: 'bottom'
    }
    ,
    datasets: {
      bar: {
        hoverBackgroundColor: 'rgb(0, 165, 224)' ,// Set hover background color to blue
        hoverBorderColor: 'transparent'
      }
    }
  };

  public mainChartDataEMP1: Array<number> = [];
  public mainChartDataEMP2: Array<number> = [];
  public mainChartDataEMP3: Array<number> = [];

  public mainChartDataEMPAnalaysis: Array<any> = [
    {
      data: this.mainChartDataEMP1,
      // label: 'High',
      stack: 'Stack 0'
    },
    // {
    //   data: this.mainChartDataEMP2,
    // //  label: 'Medium',
    //   stack: 'Stack 0'
    // },
    // {
    //   data: this.mainChartDataEMP3,
    //  // label: 'Low',
    //   stack: 'Stack 0'
    // },
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabelsEMPAnalaysis: Array<any> = [];

  public mainChartColoursEMPAnalaysis: Array<any> = [
    { // brandInfo
      backgroundColor: '#d3d3d3',
      borderColor: '#d3d3d3',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: '#d3d3d3',
      borderColor: '#d3d3d3',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: '#d3d3d3',
      borderColor: '#d3d3d3',
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];



  public mainChartDataDeptClosed1: Array<number> = [];

  public mainChartDataDeptClosed: Array<any> = [
    {
      data: this.mainChartDataDeptClosed1,
      label: 'Tasks',
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        "#4b77a9",
        "#5f255f",
        "#d21243",
        "#B27200"
      ],
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabelsDeptClosed: Array<any> = [];

  /* tslint:enable:max-line-length */
  public mainChartOptionsDeptClosed: any = {
    tooltips: {
      enabled: true,
      //custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    responsiveAnimationDuration: 0,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: "easeOutQuart",
      onComplete: function () {
        var ctx = this.chart.ctx;
        //ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        this.data.datasets.forEach(function (dataset) {

          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
              total = dataset._meta[Object.keys(dataset._meta)[0]].total,
              mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
              start_angle = model.startAngle,
              end_angle = model.endAngle,
              mid_angle = start_angle + (end_angle - start_angle) / 2;

            var x = mid_radius * Math.cos(mid_angle);
            var y = mid_radius * Math.sin(mid_angle);

            ctx.fillStyle = '#fff';
            if (i == 3) { // Darker text color for lighter background
              ctx.fillStyle = '#444';
            }

            var val = dataset.data[i];
            var percent = String(Math.round(val / total * 100)) + "%";

            if (val != 0) {
              ctx.fillText(dataset.data[i], model.x + x, model.y + y);
              // Display percent in another line, line break doesn't work for fillText
              ctx.fillText(percent, model.x + x, model.y + y + 15);
            }
          }
        });
      }
    },
    legend: {
      display: true
    }
  };


  constructor(public reportService: ReportService,
    public router: Router,
    private masterDataService: MasterDataService,
    private excelService: ExcelService,
    private AddEditOrganisationService: OrganisationService,
    private accoutService: AccountService) { }
  isShowActiveOnly: boolean = true;
  loggedInUserRole: any;
  loggedInUserRoleGuid: any;
  loggedInUserBranchId: any;
  loggedInUserId: any;
  loggedInUserOrgId: any;
  isActive: boolean;
  OrganisationList: any = [];
  dashboardInfo: DashboardInfo = new DashboardInfo();

  ngOnInit() {

    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      loggedInUserString = JSON.parse(loggedInUserString);
      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;
      this.accoutService.getUserProfileImage(loggedInUserString.userId);
      this.getDashboardData();
      this.get_Last30daysNotices();
      this.get_Last12Months_Notices_Report();
    }
    else {

      this.router.navigate(["./login"]);
    }

    console.log()
  }

  isShowLoader: boolean = false;
  getDashboardData() {

    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.isShowLoader = true;
    this.reportService.getDashboardData(loggedInUserString.userId, loggedInUserString.role_guid)
      .subscribe((dashboardInfo: DashboardInfo) => {

        this.isShowLoader = false;
        this.dashboardInfo = dashboardInfo[0];
      },
        error => {
          this.isShowLoader = false;
        });
  }

  getOrgList() {
    // $("#add-mode-modal").modal('show');
    this.tablename = 'Organisation';
    this.isShowLoader = true;
    this.reportService.getOrgansiationList(this.isActive, this.page)
      .subscribe(organisation => {
        debugger;
        this.tbldata = organisation;
        this.isShowLoader = false;
        this.tablename = organisation[0].tablename;
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }

      },
        error => {
          this.isShowLoader = false;
        });
  }

  onChangePage(pageNumber: any): void {

    this.page = pageNumber.pageIndex;
    switch (this.tablename) {
      case "User":
        this.getUsers();
        break;
      case "Organisation":
        this.getOrgList();
        break;
      case "Paper":
        this.getPaper();
        break;
      case "LandCategory":
        this.getLandCategory();
        break;
      case "Organisation User":
        this.getOrganisationUsers();
        break;
    }
  }

  ActiveOrganistion(e) {

    $("#add-mode-modal").modal('show');
    this.isActive = e;
    this.page = 1;
    this.isShowLoader = true;
    this.getOrgList();

  }
  getUsers() {
    this.tablename = 'User';
    this.isShowLoader = true;
    this.reportService.getUserslist(this.isActive, this.page)
      .subscribe(users => {
        this.tablename = users[0].tablename
        this.tbldata = users;
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }

  getPaper() {

    this.tablename = 'Paper';
    this.reportService.getPaper(this.isActive, this.page)
      .subscribe(paper => {
        if (paper == null) {
          this.isShowLoader = false;
        }
        this.tablename = 'Paper';
        this.tbldata = paper;
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }
        this.isShowLoader = false;
      },
        error => {
          this.isShowLoader = false;
        });
  }

  getLandCategory() {
    this.tablename = 'LandCategory';

    this.reportService.getLandCategory(this.isActive, this.page)
      .subscribe(land => {
        this.tbldata = land;
        this.isShowLoader = false;
        this.tablename = land[0].tablename
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }

      },
        error => {
          this.isShowLoader = false;
        });
  }

  // getNotice(isActive) {
  //   this.tablename='';
  //   
  //   this.reportService.getTotalNotice(isActive)
  //     .subscribe(users => {
  //       
  //       this.tablename=users[0].tablename
  //       this.tbldata = users;

  //      this.isShowLoader = false;
  //     },
  //     error => {
  //       this.isShowLoader = false;
  //     });
  // }
 
  public lineChartOptions: any = {
    responsive: true,
    plugins: {
      title: {
        display: false // Hide the top label
      }
    }
  };
  public lineChartLegend = true;
  public lineChartData: any[] = [
    { data: [this.mainChartData], label: 'Notices' },

  ];





  ActiveUsers(e) {

    $("#add-mode-modal").modal('show');
    this.isActive = e;
    this.page = 1;
    this.isShowLoader = true;
    this.getUsers();

  }

  ActiveOrgUsers(e) {

    $("#add-mode-modal").modal('show');

    this.page = 1;
    this.isShowLoader = true;
    this.getOrgansiationList();
    this.isShowActiveOnly = e;
    this.getOrganisationUsers();

  }
  onSelectedOrg(e) {

    //this.selectedOrganisationId = e.target.value;
    this.loggedInUserOrgId = e.target.value;
    this.getOrganisationUsers();
  }
  getOrgansiationList() {
    this.isShowActiveOnly = true;
    this.masterDataService.getOrgansiation(this.loggedInUserRole, this.loggedInUserId, this.isShowActiveOnly).subscribe((r) => {

      this.OrganisationList = r.filter(org => org.isActive === true);
    });
  }

  getOrganisationUsers() {
    this.tablename = "Organisation User";

    this.isShowLoader = true;
    this.AddEditOrganisationService.getOrganisationUsers(this.loggedInUserId, this.loggedInUserOrgId, this.loggedInUserBranchId, this.loggedInUserRoleGuid, this.isShowActiveOnly, this.page
    ).subscribe(
      (r) => {

        this.tbldata = r;
        this.isShowLoader = false;
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }


      },
      (error) => {
        console.log(error);
        this.isShowLoader = false;
      }
    );
  }


  ActiveCategory(e) {


    $("#add-mode-modal").modal('show');
    this.isActive = e;
    this.page = 1;
    this.isShowLoader = true;
    this.getLandCategory()

  }

  ActivePaper(e) {

    $("#add-mode-modal").modal('show');
    this.page = 1;
    this.isActive = e;
    this.isShowLoader = true;
    this.getPaper();

  }

  ActivetotalNotice(e) {

    $("#add-mode-modal").modal('show');
    let isActive = e;
    //  this.isShowLoader = true;
    // this.getNotice(isActive)
  }
  Close() {
    $("#add-mode-modal").modal('hide');
  }
  viewNotice() {
    this.router.navigateByUrl('/backend/notice-master');
  }
  viewAdsBanner() {
    this.router.navigateByUrl('/backend/addsbanner-master');
  }

  exportAsXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.tbldata.map(o => {
      return {
        FirstName: o.firstName,
        LastName: o.lastName,
        Email: o.email,
        Phone: o.phone,
        Role: o.role,
        OrganisationName: o.organisationName,
        BranchName: o.branchName,
        Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Organisation Users');
    this.isShowLoader = false;
  }

  exportOrgXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.tbldata.map(o => {
      return {
        name: o.name,
        DisplayName: o.displayName,
        State: o.stateName,
        City: o.cityName,
        Taluka: o.talukaName,
        Village: o.villageName,
        Address: o.address,
        Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'Organizations');
    this.isShowLoader = false;
  }


  exportpaperlandXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.tbldata.map(o => {
      return {
        Name: o.name,
        DisplayName: o.displayName,
        Status: this.returnstring(o.isActive)
      };
    });
    if (this.tablename == "Paper") {
      this.excelService.exportAsExcelFile(exportda, 'News Papers');
    } else {
      this.excelService.exportAsExcelFile(exportda, 'Land Category');
    }
    this.isShowLoader = false;
  }

  exportUserXLSX(): void {
    this.isShowLoader = true;
    const exportda = this.tbldata.map(o => {
      return {
        FirstName: o.firstName,
        LastName: o.lastName,
        Email: o.email,
        Phone: o.phone,
        State: o.stateName,
        City: o.cityName,
        PinCode: o.pincode,
        Role: o.role,
        Status: this.returnstring(o.isActive)
      };
    });
    this.excelService.exportAsExcelFile(exportda, 'User Information');
    this.isShowLoader = false;
  }

  returnstring(isActive: any) {

    if (isActive == true) {
      return 'Active';
    }
    else {
      return 'InActive';
    }
  }


  get_Last30daysNotices() {
    this.reportService.get_Last30daysNotices_Report(this.loggedInUserRole, this.loggedInUserRoleGuid, this.loggedInUserId, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(reportdata => {
      if (reportdata) {

        reportdata.forEach(element => {
          this.mainChartData1.push(element.notices);
          const date = new Date(element.day);
          const month = date.getMonth() + 1; 
          const day = date.getDate();
          const formattedDate = `${month}/${day}`;
          this.mainChartLabels.push(formattedDate);
        });
        this.mainChartData = [
          {
            data: this.mainChartData1,
            label: 'Notices',
            fill: true,
            lineTension: 0.5,
            backgroundColor: 'rgba(0, 165, 224, 0.1)',
            borderColor: 'rgb(0, 165, 224)',
            borderWidth: 2, 
            pointBackgroundColor: 'rgb(0, 165, 224)' ,
           
          }
        ];
        this.isShowLoader = false;
      }
    });
  }


  get_Last12Months_Notices_Report() {
    this.reportService.get_Last12Months_Notices_Report(this.loggedInUserRole, this.loggedInUserRoleGuid, this.loggedInUserId, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(reportdata => {

      if (reportdata) {
        reportdata.forEach(element => {

          this.mainChartDataEMP1.push(element.notices);
          // this.mainChartDataEMP2.push(element.medium);
          // this.mainChartDataEMP3.push(element.low);
          this.mainChartLabelsEMPAnalaysis.push(element.monthYear);
        });
        this.mainChartDataEMPAnalaysis = [
          {
            data: this.mainChartDataEMP1,
            // label: 'High',
            stack: 'Stack 0',
            backgroundColor: 'rgb(0, 165, 224)',
            borderColor: 'rgb(0, 165, 224)',
            borderWidth: 2, 
            pointBackgroundColor: 'rgb(0, 165, 224)' ,
          }
        ];
        this.isShowLoader = false;
      }
    });
  }

}
export class DashboardInfo {
  activeUser: number = 0;
  inactiveUser: number = 0;
  totalUser: number = 0;
  activeNotice: number = 0;
  inActiveNotice: number = 0;
  totalNotice: number = 0;
  activePaper: number = 0;
  inActivePaper: number = 0;
  totalPaper: number = 0;
  activeProperty: number = 0;
  inActiveProperty: number = 0;
  totalProperty: number = 0;
  activeCategory: number = 0;
  inActiveCategory: number = 0;
  totalCategory: number = 0;
  activeAdBanner: number = 0;
  totalOrgUser: number = 0;
  activeOrgUser: number = 0;
  inactiveOrgUser: number = 0;
  inActiveAdBanner: number = 0;
  totalAdBanner: number = 0;
  totalOrganisations: number = 0;
  activeOrganisations: number = 0;
  inActiveOrganisations: number = 0;
}