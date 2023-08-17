import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { OrganisationUserModel } from "src/app/models/account.model";
import { OrganisationUser } from "src/app/models/organisation.model";
import { MasterDataService } from "src/app/services";
import { OrganisationService } from "src/app/services/organisation.service";
import { OrgReportService } from 'src/app/services/org-report.service';
import { ToastrService } from 'ngx-toastr';


declare var $;
@Component({
  selector: 'app-organisation-dashboard',
  templateUrl: './organisation-dashboard.component.html',
  styleUrls: ['./organisation-dashboard.component.scss']
})
export class OrganisationDashboardComponent implements OnInit {
  tablename: any;
  //table:any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mainChartElements = 31;
  mainChartData1: Array<number> = [];
  mainChartData2: Array<number> = [];
  mainChartData3: Array<number> = [];

  mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Notices'
    }
  ];

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
    maintainAspectRatio: true,
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
        borderWidth: 1,
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
      stack: 'Stack 0',
      backgroundColor: 'rgb(0, 165, 224)',
      borderColor: 'rgb(0, 165, 224)',
      borderWidth: 0,
      pointBackgroundColor: 'rgb(0, 165, 224)',
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

  constructor(public orgReportService: OrgReportService,
    public router: Router,
    private AddEditOrganisationService: OrganisationService,
    private masterDataService: MasterDataService,
    public toastr: ToastrService
  ) { }
  page = 1;
  pageSize = 25;
  tbldataLength: number;
  pageSizeOptions: number[] = [3, 5, 8, 10];
  loggedInUserRole: any;
  loggedInUserId: any;
  loggedInUserRoleGuid: any;
  label: string;
  tbldata: any = [];
  Savedlabel: string;
  loggedInUserOrgId: any;
  loggedInUserBranchId: any;

  organisationUserModel: OrganisationUserModel = new OrganisationUserModel();

  dashboardInfo: DashboardInfo = new DashboardInfo();
  ngOnInit() {

    var loggedInUserString = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (loggedInUserString != null) {

      this.loggedInUserRole = loggedInUserString.role;
      this.loggedInUserRoleGuid = loggedInUserString.role_guid;
      this.loggedInUserId = loggedInUserString.userId;
      this.loggedInUserOrgId = loggedInUserString.org_id;
      this.loggedInUserBranchId = loggedInUserString.branch_id;

      this.getDashboardData();
      this.get_Last30daysAssets();
      this.get_Last12Months_Assets_Report();
      this.get_Last30daysMatchedNoticeReport();
    } else {
      this.router.navigate(["./login"]);
    }
  }

  get_Last30daysAssets() {
    this.orgReportService.get_Last30daysAssets_Report(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(reportdata => {
      if (reportdata) {

        reportdata.forEach(element => {
          this.mainChartData1.push(element.assets);
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
            borderWidth: 1,
            pointBackgroundColor: 'rgb(0, 165, 224)',
          }
        ];
        this.isShowLoader = false;
      }
    });
  }


  get_Last12Months_Assets_Report() {
    this.orgReportService.get_Last12Months_Assets_Report(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(reportdata => {

      if (reportdata) {
        reportdata.forEach(element => {

          this.mainChartDataEMP1.push(element.assets);
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
            borderWidth: 0, 
            pointBackgroundColor: 'rgb(0, 165, 224)' ,  
          }
        ];
        this.isShowLoader = false;
      }
    });
  }



  isShowLoader: boolean = false;
  //  getDashboardData() {
  //   
  //    let loggedInUserString:any = localStorage.getItem("LoggedInUser");
  //    loggedInUserString=JSON.parse(loggedInUserString);
  //    this.isShowLoader = true;
  //    this.AddEditOrganisationService.getOrganisationUsers(this.loggedInUserId,this.loggedInUserOrgId,this.loggedInUserRoleGuid,this.isShowActiveOnly,this.page)
  //      .subscribe((dashboardInfo: DashboardInfo) => {

  //        this.isShowLoader = false;
  //        this.dashboardInfo = dashboardInfo[0];
  //      },
  //        error => {
  //          this.isShowLoader = false;
  //        });
  //  }

  activeAsset(e) {
    if (e == true)
      this.router.navigateByUrl('/backend/org-asset-manager');
    else {
      this.router.navigateByUrl('/backend/deleted-assets');
    }
  }

  getDashboardData() {

    let loggedInUserString: any = localStorage.getItem("LoggedInUser");
    loggedInUserString = JSON.parse(loggedInUserString);
    this.isShowLoader = true;
    this.orgReportService.getOrgDashboardData(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId)
      .subscribe((dashboardInfo: DashboardInfo) => {

        this.isShowLoader = false;
        this.dashboardInfo = dashboardInfo[0];
      },
        error => {
          this.isShowLoader = false;
        });
  }


  //  tbldataLength:number;
  getUsers() {

    this.tablename = 'Users';

    this.AddEditOrganisationService.getOrganisationUsers(this.loggedInUserId, this.loggedInUserOrgId, this.loggedInUserBranchId, this.loggedInUserRoleGuid, this.isShowActiveOnly, this.page)
      .subscribe(users => {

        //this.tablename=users[0].tablename
        this.tbldata = users;
        this.isShowLoader = false;
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
    this.getUsers();
  }

  onBranchChangePage(pageNumber: any): void {
    this.page = pageNumber.pageIndex;
    this.getBranches();
  }
  getBranches() {
    this.tablename = 'Branches';
    this.masterDataService.getBranches(this.loggedInUserId, this.loggedInUserOrgId, this.loggedInUserRoleGuid, this.isShowActiveOnly, this.page)
      .subscribe(users => {
        this.tbldata = users;
        this.isShowLoader = false;
        if (this.tbldata[0].totalCount != 0) {
          this.tbldataLength = this.tbldata[0].totalCount;
        }
      },
        error => {
          this.isShowLoader = false;
        });
  }

  ActiveUsers(e) {


    $("#add-mode-modal").modal('show');
    this.isShowActiveOnly = e;
    this.isShowLoader = true;
    this.getUsers();
  }

  ActiveBranches(e) {
    this.page = 1;
    $("#add-mode-modal").modal('show');
    this.isShowActiveOnly = e;
    this.isShowLoader = true;
    this.getBranches();
  }

  Close() {

    $("#add-mode-modal").modal('hide');
  }




  onActiveInActive(e) {


    var isActive = !e.isActive;
    var userIntId = e.userIntId;
    var userId = e.id;
    this.AddEditOrganisationService.updateUserStatus(
      userIntId,
      userId,
      isActive
    ).subscribe(
      (addedRow: any) => {

        let message = addedRow[0].message;
        this.toastr.success(message, "Success");
        this.isShowLoader = false;

      },
      (error) => {
        this.isShowLoader = false;
        this.toastr.error("Failed to Update User!", "Error");
      }
    );
  }

  onUserDelete(OrganisationUser: OrganisationUser) {
    OrganisationUser.isActive = !OrganisationUser.isActive;
  }

  isShowActiveOnly: boolean = true;
  onShowActiveOnly() {
    this.isShowActiveOnly = !this.isShowActiveOnly;

  }

  viewNotice(e) {
    this.router.navigateByUrl('/backend/matched-notice');
  }

  PartialMatch(e) {
    this.router.navigateByUrl('/backend/matched-notice');
  }

  activeBranch(e) {

  }

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
        display: true
      }],
      yAxes: [{
        stacked: true,
        display: true
      }]
    }
  };

  public barChartLabels: string[];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [], label: 'Precise Match',stack: 'a'},
    { data: [], label: 'Partial Match',stack: 'a'}
  ];

  get_Last30daysMatchedNoticeReport() {
    this.orgReportService.get_Last30daysMatchedNoticesReport(this.loggedInUserId, this.loggedInUserRoleGuid, this.loggedInUserOrgId, this.loggedInUserBranchId).subscribe(reportdata => {
      if (reportdata) {
        this.barChartLabels = reportdata.map(item => item.day);
        reportdata.forEach((item) => {
          this.barChartData[0].data.push(item.preciseCount);
          this.barChartData[1].data.push(item.partialCount);
        });
        this.isShowLoader = false;
      }
    });
  }
}





export class DashboardInfo {
  activeUser: number = 0;
  inactiveUser: number = 0;
  totalUser: number = 0;
  activeMatchedNotice: number = 0;
  inActiveMatchedNotice: number = 0;
  totalMatchedNotice: number = 0;
  totalAssets: number = 0;
  activeAssets: number = 0;
  inActiveAssets: number = 0;
  totalBranches: number = 0;
  activeBranches: number = 0;
  inActiveBranches: number = 0;
  totalBranchCount: number = 0;
  activeBranchCount: number = 0;
  inActiveBranchCount: number = 0;
  totalMatchedNoticesCount: number = 0;
  totalPreciseMatchNotices: number = 0;
  totalPartialMatchedNotices: number = 0;
}

