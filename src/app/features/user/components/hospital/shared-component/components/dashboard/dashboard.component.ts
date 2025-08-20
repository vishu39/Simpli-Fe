import { AfterViewInit, Component, NgZone, OnInit } from "@angular/core";
import * as moment from "moment";
import * as echarts from "echarts";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexFill,
  ApexResponsive,
} from "ng-apexcharts";
import { Router } from "@angular/router";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
};
@Component({
  selector: "shared-app-hospital-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  public cardChart1: any;
  public cardChart1Data: any;
  public cardChart1Label: any;

  public cardChart2: any;
  public cardChart2Data: any;
  public cardChart2Label: any;

  public cardChart3: any;
  public cardChart3Data: any;
  public cardChart3Label: any;

  public cardChart4: any;
  public cardChart4Data: any;
  public cardChart4Label: any;

  public areaChartOptions: Partial<ChartOptions>;
  public barChartOptions: Partial<ChartOptions>;

  isSelect: boolean = true;
  widgetData: any[];
  currentDate: Date = new Date();
  staticComments: any[];
  filterValue: any;
  queryCountParams: any = {
    condition: "last7",
    startDate: "",
    endDate: "",
  };
  vilCountParams: any = {
    condition: "last7",
    startDate: "",
    endDate: "",
  };
  confirmationCountParams: any = {
    condition: "last7",
    startDate: "",
    endDate: "",
  };
  queryByCountryParams: any = {
    condition: "last7",
    startDate: "",
    endDate: "",
  };
  queryByCountryData: any;
  queryByDepartmentParams: any = {
    condition: "last7",
    startDate: "",
    endDate: "",
  };
  queryByDepartmentData: any;
  queryByPartnerParams: any = {
    condition: "last7",
    startDate: "",
    endDate: "",
  };
  selectedDateRangeWidget = [
    {
      startDate: "",
      endDate: "",
    },
    {
      startDate: "",
      endDate: "",
    },
    {
      startDate: "",
      endDate: "",
    },
  ];
  selectedDateRangePieChart = [
    {
      startDate: "",
      endDate: "",
    },
    {
      startDate: "",
      endDate: "",
    },
    {
      startDate: "",
      endDate: "",
    },
  ];
  constructor(
    private router: Router,
    private zone: NgZone,
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.smallChart1();
    this.smallChart2();
    this.smallChart3();
    this.smallChart4();
    this.setWidgetData();
    this.getQueryCount();
    this.getVilCount();
    this.getConfirmationCount();
    this.getAvgOpinionTime();
    this.getLast6MonthQueryCount();
    this.getLast6MonthVilCount();
    this.getLast6MonthPatientConfirmationCount();
    this.getJourneyFromOpinion();
    this.getJourneyFromVil();
    this.getQueryByCountry();
    this.getQueryByDepartment();
    this.getQueryByPartner();
  }
  // applyDateRange(eventType: string) {
  //   if (eventType === "queryCount") {
  //     if (
  //       this.selectedDateRangeWidget[0].startDate &&
  //       this.selectedDateRangeWidget[0].endDate
  //     ) {
  //       this.queryCountParams.condition = "dateRange";
  //       (this.queryCountParams.startDate =
  //         this.selectedDateRangeWidget[0].startDate),
  //         (this.queryCountParams.endDate = new Date(
  //           this.selectedDateRangeWidget[0].endDate
  //         ));
  //       this.queryCountParams.endDate.setHours(23, 59, 59);
  //       this.getQueryCount();
  //     } else {
  //       this.sharedService.showNotification(
  //         "snackBar-danger",
  //         "Please select the end date"
  //       );
  //     }
  //   } else if (eventType === "vilCount") {
  //     if (
  //       this.selectedDateRangeWidget[1].startDate &&
  //       this.selectedDateRangeWidget[1].endDate
  //     ) {
  //       this.vilCountParams.condition = "dateRange";
  //       (this.vilCountParams.startDate =
  //         this.selectedDateRangeWidget[1].startDate),
  //         (this.vilCountParams.endDate = new Date(
  //           this.selectedDateRangeWidget[1].endDate
  //         ));
  //       this.vilCountParams.endDate.setHours(23, 59, 59);
  //       this.getVilCount();
  //     } else {
  //       this.sharedService.showNotification(
  //         "snackBar-danger",
  //         "Please select the end date"
  //       );
  //     }
  //   } else if (eventType === "confirmationCount") {
  //     if (
  //       this.selectedDateRangeWidget[2].startDate &&
  //       this.selectedDateRangeWidget[2].endDate
  //     ) {
  //       this.confirmationCountParams.condition = "dateRange";
  //       (this.confirmationCountParams.startDate =
  //         this.selectedDateRangeWidget[2].startDate),
  //         (this.confirmationCountParams.endDate = new Date(
  //           this.selectedDateRangeWidget[2].endDate
  //         ));
  //       this.confirmationCountParams.endDate.setHours(23, 59, 59);
  //       this.getConfirmationCount();
  //     } else {
  //       this.sharedService.showNotification(
  //         "snackBar-danger",
  //         "Please select the end date"
  //       );
  //     }
  //   } else if (eventType === "queryByCountry") {
  //     if (
  //       this.selectedDateRangePieChart[0].startDate &&
  //       this.selectedDateRangePieChart[0].endDate
  //     ) {
  //       this.queryByCountryParams.condition = "dateRange";
  //       (this.queryByCountryParams.startDate =
  //         this.selectedDateRangePieChart[0].startDate),
  //         (this.queryByCountryParams.endDate = new Date(
  //           this.selectedDateRangePieChart[0].endDate
  //         ));
  //       this.queryByCountryParams.endDate.setHours(23, 59, 59);
  //       this.getQueryByCountry();
  //     } else {
  //       this.sharedService.showNotification(
  //         "snackBar-danger",
  //         "Please select the end date"
  //       );
  //     }
  //   } else if (eventType === "queryByDepartment") {
  //     if (
  //       this.selectedDateRangePieChart[1].startDate &&
  //       this.selectedDateRangePieChart[1].endDate
  //     ) {
  //       this.queryByDepartmentParams.condition = "dateRange";
  //       (this.queryByDepartmentParams.startDate =
  //         this.selectedDateRangePieChart[1].startDate),
  //         (this.queryByDepartmentParams.endDate = new Date(
  //           this.selectedDateRangePieChart[1].endDate
  //         ));
  //       this.queryByDepartmentParams.endDate.setHours(23, 59, 59);
  //       this.getQueryByDepartment();
  //     } else {
  //       this.sharedService.showNotification(
  //         "snackBar-danger",
  //         "Please select the end date"
  //       );
  //     }
  //   } else if (eventType === "queryByPartner") {
  //     if (
  //       this.selectedDateRangePieChart[2].startDate &&
  //       this.selectedDateRangePieChart[2].endDate
  //     ) {
  //       this.queryByPartnerParams.condition = "dateRange";
  //       (this.queryByPartnerParams.startDate =
  //         this.selectedDateRangePieChart[2].startDate),
  //         (this.queryByPartnerParams.endDate = new Date(
  //           this.selectedDateRangePieChart[2].endDate
  //         ));
  //       this.queryByPartnerParams.endDate.setHours(23, 59, 59);
  //       this.getQueryByPartner();
  //     } else {
  //       this.sharedService.showNotification(
  //         "snackBar-danger",
  //         "Please select the end date"
  //       );
  //     }
  //   }
  // }

  selectedDateRange = {
    startDate: "",
    endDate: "",
  };

  applyDateRange(eventType: string) {
    if (this.selectedDateRange.startDate && this.selectedDateRange.endDate) {
      let modifiedStartDate = this.selectedDateRange.startDate;
      let modifiedEndDate = this.selectedDateRange.endDate;

      this.queryCountParams.condition = "dateRange";
      (this.queryCountParams.startDate = modifiedStartDate),
        (this.queryCountParams.endDate = new Date(modifiedEndDate));
      this.queryCountParams.endDate.setHours(23, 59, 59);
      this.getQueryCount();

      this.vilCountParams.condition = "dateRange";
      (this.vilCountParams.startDate = modifiedStartDate),
        (this.vilCountParams.endDate = new Date(modifiedEndDate));
      this.vilCountParams.endDate.setHours(23, 59, 59);
      this.getVilCount();

      this.confirmationCountParams.condition = "dateRange";
      (this.confirmationCountParams.startDate = modifiedStartDate),
        (this.confirmationCountParams.endDate = new Date(modifiedEndDate));
      this.confirmationCountParams.endDate.setHours(23, 59, 59);
      this.getConfirmationCount();

      this.queryByCountryParams.condition = "dateRange";
      (this.queryByCountryParams.startDate = modifiedStartDate),
        (this.queryByCountryParams.endDate = new Date(modifiedEndDate));
      this.queryByCountryParams.endDate.setHours(23, 59, 59);
      this.getQueryByCountry();

      this.queryByDepartmentParams.condition = "dateRange";
      (this.queryByDepartmentParams.startDate = modifiedStartDate),
        (this.queryByDepartmentParams.endDate = new Date(modifiedEndDate));
      this.queryByDepartmentParams.endDate.setHours(23, 59, 59);
      this.getQueryByDepartment();

      this.queryByPartnerParams.condition = "dateRange";
      (this.queryByPartnerParams.startDate = modifiedStartDate),
        (this.queryByPartnerParams.endDate = new Date(modifiedEndDate));
      this.queryByPartnerParams.endDate.setHours(23, 59, 59);
      this.getQueryByPartner();
    } else {
      this.sharedService.showNotification(
        "snackBar-danger",
        "Please select the end date"
      );
    }
  }

  makeInitials(fullName) {
    const nameArray = fullName.split(" ");
    let initials = "";
    nameArray.forEach((name) => {
      initials += name.charAt(0).toUpperCase();
    });
    return initials;
  }

  private smallChart1() {
    this.cardChart1 = {
      responsive: true,
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
      title: {
        display: false,
      },
    };
    this.cardChart1Data = [
      {
        label: "New Patients",
        data: [50, 61, 80, 50, 72, 52, 60, 41, 30, 45, 70, 40, 93, 63, 50, 62],
        borderWidth: 4,
        pointStyle: "circle",
        pointRadius: 4,
        borderColor: "rgba(218, 1, 45, 1)",
        pointBackgroundColor: "rgba(218, 1, 45, .2)",
        backgroundColor: "rgba(218, 1, 45, .2)",
        pointBorderColor: "transparent",
      },
    ];
    this.cardChart1Label = [
      "16-07-2018",
      "17-07-2018",
      "18-07-2018",
      "19-07-2018",
      "20-07-2018",
      "21-07-2018",
      "22-07-2018",
      "23-07-2018",
      "24-07-2018",
      "25-07-2018",
      "26-07-2018",
      "27-07-2018",
      "28-07-2018",
      "29-07-2018",
      "30-07-2018",
      "31-07-2018",
    ];
  }
  private smallChart2() {
    this.cardChart2 = {
      responsive: true,
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
      title: {
        display: false,
      },
    };
    this.cardChart2Data = [
      {
        label: "New Patients",
        data: [50, 61, 80, 50, 40, 93, 63, 50, 62, 72, 52, 60, 41, 30, 45, 70],
        borderWidth: 4,
        pointStyle: "circle",
        pointRadius: 4,
        borderColor: "rgba(255, 191, 0, 1)",
        pointBackgroundColor: "rgba(255, 191, 0, .2)",
        backgroundColor: "rgba(255, 191, 0, .2)",
        pointBorderColor: "transparent",
      },
    ];
    this.cardChart2Label = [
      "16-07-2018",
      "17-07-2018",
      "18-07-2018",
      "19-07-2018",
      "20-07-2018",
      "21-07-2018",
      "22-07-2018",
      "23-07-2018",
      "24-07-2018",
      "25-07-2018",
      "26-07-2018",
      "27-07-2018",
      "28-07-2018",
      "29-07-2018",
      "30-07-2018",
      "31-07-2018",
    ];
  }

  private smallChart3() {
    this.cardChart3 = {
      responsive: true,
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
      title: {
        display: false,
      },
    };
    this.cardChart3Data = [
      {
        label: "New Patients",
        data: [52, 60, 41, 30, 45, 70, 50, 61, 80, 50, 72, 40, 93, 63, 50, 62],
        borderWidth: 4,
        pointStyle: "circle",
        pointRadius: 4,
        borderColor: "rgba(67, 153, 70, 1)",
        pointBackgroundColor: "rgba(67, 153, 70, .2)",
        backgroundColor: "rgba(67, 153, 70, .2)",
        pointBorderColor: "transparent",
      },
    ];
    this.cardChart3Label = [
      "16-07-2018",
      "17-07-2018",
      "18-07-2018",
      "19-07-2018",
      "20-07-2018",
      "21-07-2018",
      "22-07-2018",
      "23-07-2018",
      "24-07-2018",
      "25-07-2018",
      "26-07-2018",
      "27-07-2018",
      "28-07-2018",
      "29-07-2018",
      "30-07-2018",
      "31-07-2018",
    ];
  }
  private smallChart4() {
    this.cardChart4 = {
      responsive: true,
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
      title: {
        display: false,
      },
    };
    this.cardChart4Data = [
      {
        label: "New Patients",
        data: [30, 45, 70, 40, 93, 63, 50, 62, 50, 61, 80, 50, 72, 52, 60, 41],
        borderWidth: 4,
        pointStyle: "circle",
        pointRadius: 4,
        borderColor: "rgba(21, 96, 189, 1)",
        pointBackgroundColor: "rgba(21, 96, 189, .2)",
        backgroundColor: "rgba(21, 96, 189, .2)",
        pointBorderColor: "transparent",
      },
    ];
    this.cardChart4Label = [
      "16-07-2018",
      "17-07-2018",
      "18-07-2018",
      "19-07-2018",
      "20-07-2018",
      "21-07-2018",
      "22-07-2018",
      "23-07-2018",
      "24-07-2018",
      "25-07-2018",
      "26-07-2018",
      "27-07-2018",
      "28-07-2018",
      "29-07-2018",
      "30-07-2018",
      "31-07-2018",
    ];
  }

  getLastSixMonthNames(): string[] {
    const result: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = moment().subtract(i, "months");
      let monthName = d.format("MMM");
      result.push(monthName);
    }
    return result;
  }
  emitSelectEvent(event: any, eventType) {
    this.filterValue = "";
    if (event.target.value === "RANGE") {
      this.filterValue = event.target.value;
      this.widgetData.map((wd: any) => {
        if (wd?.event === "avgOpinionTime") {
          wd.selectedFilter = "noFilterApplicable";
        } else {
          wd.selectedFilter = this.filterValue;
        }
      });
      this.widgetData.map((wd: any) => {
        if (wd?.event !== "avgOpinionTime") {
          wd.range = true;
        }
      });
      this.pieChartArray.map(
        (pca: any) => (pca.selectedFilter = this.filterValue)
      );
      this.pieChartArray.map((pca: any) => (pca.range = true));
      return this.filterValue;
    } else {
      // if (eventType == "queryCount") {
      let val = event.target.value;
      this.widgetData.map((wd: any) => {
        if (wd?.event !== "avgOpinionTime") {
          wd.selectedFilter = val;
        }
      });
      this.pieChartArray.map((pca: any) => (pca.selectedFilter = val));
      this.queryCountParams.startDate = "";
      this.queryCountParams.endDate = "";
      this.queryCountParams.condition = val;
      this.getQueryCount();
      // } else if (eventType == "vilCount") {
      // let val = event.target.value;
      this.vilCountParams.startDate = "";
      this.vilCountParams.endDate = "";
      this.vilCountParams.condition = val;
      this.getVilCount();
      // } else if (eventType == "confirmationCount") {
      // let val = event.target.value;
      this.confirmationCountParams.startDate = "";
      this.confirmationCountParams.endDate = "";
      this.confirmationCountParams.condition = val;
      this.getConfirmationCount();
      // } else if (eventType == "queryByCountry") {
      // let val = event.target.value;
      this.queryByCountryParams.startDate = "";
      this.queryByCountryParams.endDate = "";
      this.queryByCountryParams.condition = val;
      this.getQueryByCountry();
      // } else if (eventType == "queryByDepartment") {
      // let val = event.target.value;
      this.queryByDepartmentParams.startDate = "";
      this.queryByDepartmentParams.endDate = "";
      this.queryByDepartmentParams.condition = val;
      this.getQueryByDepartment();
      // } else if (eventType == "queryByPartner") {
      // let val = event.target.value;
      this.queryByPartnerParams.startDate = "";
      this.queryByPartnerParams.endDate = "";
      this.queryByPartnerParams.condition = val;
      this.getQueryByPartner();
      // }
    }
  }

  clearDateFilter(
    item,
    selectedDateRangeWidget,
    selectedDateRangePieChart,
    eventType
  ) {
    this.selectedDateRange = {
      startDate: "",
      endDate: "",
    };
    // if (eventType == "queryCount") {
    this.widgetData.map((wd: any) => {
      if (wd?.event === "avgOpinionTime") {
        wd.selectedFilter = "noFilterApplicable";
      } else {
        wd.selectedFilter = "last7";
        wd.range = false;
      }
    });
    this.pieChartArray.map((pca: any) => (pca.selectedFilter = "last7"));
    this.pieChartArray.map((pca: any) => (pca.range = false));
    item.range = false;
    selectedDateRangeWidget.startDate = "";
    selectedDateRangeWidget.endDate = "";
    this.queryCountParams.startDate = "";
    this.queryCountParams.endDate = "";
    this.queryCountParams.condition = "last7";
    this.getQueryCount();
    // } else if (eventType == "vilCount") {
    item.range = false;
    selectedDateRangeWidget.startDate = "";
    selectedDateRangeWidget.endDate = "";
    this.vilCountParams.startDate = "";
    this.vilCountParams.endDate = "";
    this.vilCountParams.condition = "last7";
    this.getVilCount();
    // } else if (eventType == "confirmationCount") {
    item.range = false;
    selectedDateRangeWidget.startDate = "";
    selectedDateRangeWidget.endDate = "";
    this.confirmationCountParams.startDate = "";
    this.confirmationCountParams.endDate = "";
    this.confirmationCountParams.condition = "last7";
    this.getConfirmationCount();
    // } else if (eventType == "queryByCountry") {
    item.range = false;
    selectedDateRangePieChart.startDate = "";
    selectedDateRangePieChart.endDate = "";
    this.queryByCountryParams.startDate = "";
    this.queryByCountryParams.endDate = "";
    this.queryByCountryParams.condition = "last7";
    this.getQueryByCountry();
    // } else if (eventType == "queryByDepartment") {
    item.range = false;
    selectedDateRangePieChart.startDate = "";
    selectedDateRangePieChart.endDate = "";
    this.queryByDepartmentParams.startDate = "";
    this.queryByDepartmentParams.endDate = "";
    this.queryByDepartmentParams.condition = "last7";
    this.getQueryByDepartment();
    // } else if (eventType == "queryByPartner") {
    item.range = false;
    selectedDateRangePieChart.startDate = "";
    selectedDateRangePieChart.endDate = "";
    this.queryByPartnerParams.startDate = "";
    this.queryByPartnerParams.endDate = "";
    this.queryByPartnerParams.condition = "last7";
    this.getQueryByPartner();
    // }
  }
  setWidgetData() {
    this.widgetData = [
      {
        name: "Query's",
        icon: "query_stats",
        iconBg: "#DA012D",
        value: 0,
        chartData: this.cardChart1Data,
        range: false,
        event: "queryCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "VIL",
        icon: "flight_takeoff",
        iconBg: "#ffbf00",
        value: 0,
        chartData: this.cardChart2Data,
        range: false,
        event: "vilCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "Confirmations",
        icon: "person_add",
        iconBg: "#439946",
        value: 0,
        chartData: this.cardChart3Data,
        range: false,
        event: "confirmationCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "Avg Opinion Time",
        icon: "local_activity",
        iconBg: "#1560BD",
        value: "0",
        chartData: this.cardChart4Data,
        range: false,
        event: "avgOpinionTime",
        selectedFilter: "noFilterApplicable",
        isLoading: false,
      },
    ];
  }

  loadingChartsArray = [false, false, false, false, false, false];

  getQueryCount() {
    this.widgetData[0].isLoading = true;
    this.loadingChartsArray[0] = true;
    this.widgetData[0].value = 0;
    this.hospitalService
      .getQueryCount(this.queryCountParams)
      .subscribe((res) => {
        this.widgetData[0].value = res?.data?.count;
        this.widgetData[0].isLoading = false;
        this.loadingChartsArray[0] = false;
      });
  }
  getVilCount() {
    this.widgetData[1].isLoading = true;
    this.loadingChartsArray[1] = true;
    this.widgetData[1].value = 0;
    this.hospitalService.getVilCount(this.vilCountParams).subscribe((res) => {
      this.widgetData[1].value = res?.data?.count;
      this.widgetData[1].isLoading = false;
      this.loadingChartsArray[1] = false;
    });
  }
  getConfirmationCount() {
    this.widgetData[2].isLoading = true;
    this.loadingChartsArray[2] = true;
    this.widgetData[2].value = 0;
    this.hospitalService
      .getConfirmationCount(this.confirmationCountParams)
      .subscribe((res) => {
        this.widgetData[2].value = res?.data?.count;
        this.widgetData[2].isLoading = false;
        this.loadingChartsArray[2] = false;
      });
  }
  getAvgOpinionTime() {
    this.widgetData[3].isLoading = true;
    this.widgetData[3].value = 0;
    this.hospitalService.getAvgOpinionTime().subscribe((res) => {
      this.widgetData[3].value = res?.data + " " + "H";
      this.widgetData[3].isLoading = false;
    });
  }
  getLast6MonthQueryCount() {
    this.hospitalService.getLast6MonthQueryCount().subscribe((res) => {
      let month = [];
      let count = [];
      res.data.forEach((element) => {
        month.push(element.month.slice(0, 3));
        count.push(element.count);
      });
      this.barChartsArray[0].chartData["xAxis"][0].data = month;
      this.barChartsArray[0].chartData["series"][0].data = count;
      this.barChartsArray[0].loading = false;
    });
    // let month = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    // let count = [0, 0, 0, 0, 0, 7];

    // this.barChartsArray[0].chartData["xAxis"][0].data = month;
    // this.barChartsArray[0].chartData["series"][0].data = count;
    // this.barChartsArray[0].loading = false;
  }
  getLast6MonthVilCount() {
    this.hospitalService.getLast6MonthVilCount().subscribe((res) => {
      let month = [];
      let count = [];
      res.data.forEach((element) => {
        month.push(element.month.slice(0, 3));
        count.push(element.count);
      });
      this.barChartsArray[1].chartData["xAxis"][0].data = month;
      this.barChartsArray[1].chartData["series"][0].data = count;
      this.barChartsArray[1].loading = false;
    });
    // let month = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    // let count = [0, 0, 0, 0, 0, 7];

    // this.barChartsArray[1].chartData["xAxis"][0].data = month;
    // this.barChartsArray[1].chartData["series"][0].data = count;
    // this.barChartsArray[1].loading = false;
  }
  getLast6MonthPatientConfirmationCount() {
    this.hospitalService
      .getLast6MonthPatientConfirmationCount()
      .subscribe((res) => {
        let month = [];
        let count = [];
        res.data.forEach((element) => {
          month.push(element.month.slice(0, 3));
          count.push(element.count);
        });
        this.barChartsArray[2].chartData["xAxis"][0].data = month;
        this.barChartsArray[2].chartData["series"][0].data = count;
        this.barChartsArray[2].loading = false;
      });
    // let month = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    // let count = [0, 0, 0, 0, 0, 7];

    // this.barChartsArray[2].chartData["xAxis"][0].data = month;
    // this.barChartsArray[2].chartData["series"][0].data = count;
    // this.barChartsArray[2].loading = false;
  }
  getJourneyFromOpinion() {
    this.hospitalService.getJourneyFromOpinion().subscribe((res) => {
      let legendData = [];
      let seriesData = [];
      res.data.forEach((element) => {
        legendData.push(element.statusName);
        seriesData.push({
          value: element.count,
          name: element.statusName,
        });
      });

      this.funnelChartArray[0].chartData.legend.data = legendData;
      this.funnelChartArray[0].chartData["series"][0].data = seriesData;
      this.funnelChartArray[0].loading = false;
    });
  }
  getJourneyFromVil() {
    this.hospitalService.getJourneyFromVil().subscribe((res) => {
      let legendData = [];
      let seriesData = [];
      res.data.forEach((element) => {
        legendData.push(element.statusName);
        seriesData.push({
          value: element.count,
          name: element.statusName,
        });
      });
      // this.funnelChartArray[1].chartData.legend.data = legendData;
      this.funnelChartArray[1].chartData["series"][0].data = seriesData;
      this.funnelChartArray[1].loading = false;
    });
  }

  getQueryByCountry() {
    this.pieChartArray[0].loading = true;
    this.loadingChartsArray[3] = true;
    this.pieChartArray[0].chartData["series"][0].data = [];
    this.hospitalService
      .getQueryByCountry(this.queryByCountryParams)
      .subscribe((res) => {
        this.queryByCountryData = res.data;
        let seriesData = [];
        res.data.forEach((element) => {
          seriesData.push({
            value: element.count,
            name: element.name,
          });
        });
        this.pieChartArray[0].chartData["series"][0].data = seriesData;
        this.pieChartArray[0].chartData["legend"] = null;
        this.pieChartArray[0].loading = false;
        this.loadingChartsArray[3] = false;
      });
  }
  getQueryByDepartment() {
    this.pieChartArray[1].loading = true;
    this.loadingChartsArray[4] = true;
    this.pieChartArray[1].chartData["series"][0].data = [];
    this.hospitalService
      .getQueryByDepartment(this.queryByDepartmentParams)
      .subscribe((res) => {
        this.queryByDepartmentData = res.data;
        let seriesData = [];
        res.data.forEach((element) => {
          seriesData.push({
            value: element.count,
            name: element.name,
          });
        });
        this.pieChartArray[1].chartData["series"][0].data = seriesData;
        this.pieChartArray[1].chartData["legend"] = null;
        this.loadingChartsArray[4] = false;
        this.pieChartArray[1].loading = false;
      });
  }
  getQueryByPartner() {
    this.pieChartArray[2].loading = true;
    this.loadingChartsArray[5] = true;
    this.pieChartArray[2].chartData["series"][0].data = [];
    this.hospitalService
      .getQueryByPartner(this.queryByPartnerParams)
      .subscribe((res) => {
        let seriesData = [];
        res.data.forEach((element) => {
          seriesData.push({
            value: element.count,
            name: element.name,
          });
        });
        this.pieChartArray[2].chartData["series"][0].data = seriesData;
        this.loadingChartsArray[5] = false;
        this.pieChartArray[2].chartData["legend"] = null;
        this.pieChartArray[2].loading = false;
      });
  }

  barChartsArray = [
    {
      chartName: "Last 6 Months Queries",
      loading: true,
      chartData: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Query's",
            type: "bar",
            barWidth: "50%",
            data: [],
            showBackground: false,
            color: "rgb(218, 1, 45)",
          },
        ],
      },
    },
    {
      chartName: "Last 6 Months VIL",
      loading: true,
      chartData: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "VIL",
            type: "bar",
            barWidth: "60%",
            data: [],
            color: "rgb(255, 191, 0)",
          },
        ],
      },
    },
    {
      chartName: "Last 6 Months Confirmation's",
      loading: true,
      chartData: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Confirmations",
            type: "bar",
            barWidth: "60%",
            data: [],
            color: "rgb(67, 153, 70)",
          },
        ],
      },
    },
  ];

  funnelChartArray = [
    {
      chartName: "Journey from Opinion",
      loading: true,
      chartStyle: {
        width: "40vw",
      },
      chartData: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}",
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        legend: {
          data: [],
          lineStyle: {
            width: "inherit",
          },
          display: false,
        },
        series: [
          {
            name: "Funnel",
            type: "funnel",
            left: "0%",
            top: 60,
            bottom: 60,
            width: "100%",
            min: 0,
            max: 100,
            minSize: "10%",
            maxSize: "100%",
            sort: "none",
            gap: 5,
            label: {
              show: true,
              position: "inner",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 10,
              },
            },
            data: [],
          },
        ],
      },
    },
    {
      chartName: "Journey from VIL",
      loading: true,
      chartStyle: {
        width: "40vw",
      },
      chartData: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}",
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        legend: {
          data: [],
          lineStyle: {
            width: "inherit",
          },
          display: false,
        },
        series: [
          {
            name: "Funnel",
            type: "funnel",
            left: "0%",
            top: 60,
            bottom: 60,
            width: "100%",
            min: 0,
            max: 100,
            minSize: "10%",
            maxSize: "100%",
            sort: "none",
            gap: 5,
            label: {
              show: true,
              position: "inner",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 10,
              },
            },
            data: [],
          },
        ],
      },
    },
  ];

  pieChartArray = [
    {
      chartName: "Query's by Country",
      range: false,
      event: "queryByCountry",
      loading: true,
      innerData: false,
      chartData: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          bottom: "0",
          display: false,
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "Query's by Country",
            type: "pie",
            radius: "50%",
            center: ["50%", "40%"],
            avoidLabelOverlap: true,
            data: [],
            legend: {
              display: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function (idx) {
          return Math.random() * 200;
        },
      },
      selectedFilter: "last7",
    },
    {
      chartName: "Query's by Department",
      range: false,
      event: "queryByDepartment",
      loading: true,
      innerData: false,
      chartData: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          bottom: "0",
          display: false,
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "Query's by Department",
            type: "pie",
            radius: "50%",
            center: ["50%", "40%"],
            avoidLabelOverlap: true,
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      selectedFilter: "last7",
    },
    {
      chartName: "Query's by Partner",
      range: false,
      event: "queryByPartner",
      loading: true,
      innerData: false,
      chartData: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          bottom: "0",
          display: false,
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "Query's by Partner",
            type: "pie",
            radius: "50%",
            center: ["50%", "40%"],
            avoidLabelOverlap: true,
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      selectedFilter: "last7",
    },
  ];
  onPieChartEvent(event, item, index) {
    if (item.event === "queryByCountry") {
      if (!item.innerData) {
        const queryByCountryFilter = this.queryByCountryData.filter(
          (obj) => obj.name === event.name
        );
        let seriesData = [];
        queryByCountryFilter[0].country.forEach((element) => {
          seriesData.push({
            value: element.count,
            name: element.name,
          });
        });
        item.chartData["series"][0].data = seriesData;
        let myChart = echarts.init(document.querySelector(`#pieChart${index}`));
        myChart.setOption(item.chartData);
      }
    } else if (item.event === "queryByDepartment") {
      if (!item.innerData) {
        const queryByDepartmentFilter = this.queryByDepartmentData.filter(
          (obj) => obj.name === event.name
        );
        let seriesData = [];
        queryByDepartmentFilter[0].treatment.forEach((element) => {
          seriesData.push({
            value: element.count,
            name: element.name,
          });
        });
        item.chartData["series"][0].data = seriesData;
        let myChart = echarts.init(document.querySelector(`#pieChart${index}`));
        myChart.setOption(item.chartData);
      }
    }
  }
}
