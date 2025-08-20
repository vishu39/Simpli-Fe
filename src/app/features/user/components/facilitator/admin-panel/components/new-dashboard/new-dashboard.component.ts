import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import * as echarts from "echarts";
// import {
//JEET BHATT
//   ChartComponent,
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexXAxis,
//   ApexDataLabels,
//   ApexTooltip,
//   ApexYAxis,
//   ApexPlotOptions,
//   ApexStroke,
//   ApexLegend,
//   ApexFill,
//   ApexResponsive,
// } from "ng-apexcharts";
import { Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   yaxis: ApexYAxis;
//   stroke: ApexStroke;
//   tooltip: ApexTooltip;
//   dataLabels: ApexDataLabels;
//   legend: ApexLegend;
//   responsive: ApexResponsive[];
//   plotOptions: ApexPlotOptions;
//   fill: ApexFill;
//   colors: string[];
// };
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-new-dashboard",
  templateUrl: "./new-dashboard.component.html",
  styleUrls: ["./new-dashboard.component.scss"],
})
export class NewDashboardComponent implements OnInit {
  selectedOption = "1"; // Setting default value to "Last Updated"

  lineChartsArray: any[] = [];

  dateRangeForm = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  yearControl = new FormControl([]);
  quarterControl = new FormControl([]);
  monthControl = new FormControl([]);
  countryControl = new FormControl([]);
  genderControl = new FormControl([]);
  hospitalControl = new FormControl([]);
  userControl = new FormControl([]);
  treatmentControl = new FormControl([]);
  doctorControl = new FormControl([]);
  partnerControl = new FormControl([]);

  years = [
    { value: 2023, name: 2023 },
    { value: 2024, name: 2024 },
    { value: 2025, name: 2025 },
  ];
  quarters = [
    { value: "Q1", name: "Q1" },
    { value: "Q2", name: "Q2" },
    { value: "Q3", name: "Q3" },
    { value: "Q4", name: "Q4" },
  ];
  months = [
    { value: "January", name: "January" },
    { value: "February", name: "February" },
    { value: "March", name: "March" },
    { value: "April", name: "April" },
    { value: "May", name: "May" },
    { value: "June", name: "June" },
    { value: "July", name: "July" },
    { value: "August", name: "August" },
    { value: "September", name: "September" },
    { value: "October", name: "October" },
    { value: "November", name: "November" },
    { value: "December", name: "December" },
  ];
  countrys = [
    { value: "Japan", name: "Japan" },
    { value: "USA", name: "USA" },
    { value: "India", name: "India" },
    { value: "Germany", name: "Germany" },
    { value: "Australia", name: "Australia" },
    { value: "South Korea", name: "South Korea" },
  ];
  genders = [
    { value: "Male", name: "Male" },
    { value: "Female", name: "Female" },
  ];
  hospitals = [
    { value: "Medanta", name: "Medanta" },
    { value: "HCG", name: "HCG" },
    { value: "Kokilaben", name: "Kokilaben" },
    { value: "Sarvodaya", name: "Sarvodaya" },
  ];
  users = [
    { value: "Mihir Vora", name: "Mihir Vora" },
    { value: "Saurabh Shah", name: "Saurabh Shah" },
    { value: "Dhruv Chabra", name: "Dhruv Chabra" },
    { value: "Vishu Sharma", name: "Vishu Sharma" },
    { value: "Jeet Bhatt", name: "Jeet Bhatt" },
  ];
  treatments = [
    { value: "Urology", name: "Urology" },
    { value: "Gynaecology", name: "Gynaecology" },
    { value: "Spine Surgery", name: "Spine Surgery" },
    { value: "Cancer", name: "Cancer" },
    { value: "Cardiology", name: "Cardiology" },
    { value: "Transplants", name: "Transplants" },
    { value: "Orthopaedic", name: "Orthopaedic" },
  ];
  doctors = [
    { value: "A Jayachandra", name: "A Jayachandra" },
    { value: "A C Vikram", name: "A C Vikram" },
    { value: "A M Vaze", name: "A M Vaze" },
    { value: "A K Dewan", name: "A K Dewan" },
  ];
  partners = [
    { value: "Ref Partner 1", name: "Ref Partner 1" },
    { value: "Ref Partner 2", name: "Ref Partner 2" },
    { value: "Ref Partner 3", name: "Ref Partner 3" },
    { value: "Ref Partner 4", name: "Ref Partner 4" },
  ];

  selectAllyears(event: any) {
    if (event.checked) {
      this.yearControl.setValue(this.years.map((h) => h.value));
    } else {
      this.yearControl.setValue([]);
    }
  }
  selectAllQuarters(event: any) {
    if (event.checked) {
      this.quarterControl.setValue(this.quarters.map((h) => h.value));
    } else {
      this.quarterControl.setValue([]);
    }
  }
  selectAllMonths(event: any) {
    if (event.checked) {
      this.monthControl.setValue(this.months.map((h) => h.value));
    } else {
      this.monthControl.setValue([]);
    }
  }
  selectAllcountrys(event: any) {
    if (event.checked) {
      this.countryControl.setValue(this.countrys.map((h) => h.value));
    } else {
      this.countryControl.setValue([]);
    }
  }
  selectAllgenders(event: any) {
    if (event.checked) {
      this.genderControl.setValue(this.genders.map((h) => h.value));
    } else {
      this.genderControl.setValue([]);
    }
  }
  selectAllHospitals(event: any) {
    if (event.checked) {
      this.hospitalControl.setValue(this.hospitals.map((h) => h.value));
    } else {
      this.hospitalControl.setValue([]);
    }
  }
  selectAllUsers(event: any) {
    if (event.checked) {
      this.userControl.setValue(this.users.map((h) => h.value));
    } else {
      this.userControl.setValue([]);
    }
  }
  selectAllTreatments(event: any) {
    if (event.checked) {
      this.treatmentControl.setValue(this.treatments.map((h) => h.value));
    } else {
      this.treatmentControl.setValue([]);
    }
  }
  selectAllDoctors(event: any) {
    if (event.checked) {
      this.doctorControl.setValue(this.doctors.map((h) => h.value));
    } else {
      this.doctorControl.setValue([]);
    }
  }
  selectAllPartners(event: any) {
    if (event.checked) {
      this.partnerControl.setValue(this.partners.map((h) => h.value));
    } else {
      this.partnerControl.setValue([]);
    }
  }

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
  // public areaChartOptions: Partial<ChartOptions>;
  // public barChartOptions: Partial<ChartOptions>;

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
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
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
    this.initializeLineCharts();
  }

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
  //   ----- CARDS ------

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
        borderColor: "rgba(21, 96, 189, 1)",
        pointBackgroundColor: "rgba(21, 96, 189, .2)",
        backgroundColor: "rgba(21, 96, 189, .2)",
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
        borderColor: "rgba(218, 1, 45, 1)",
        pointBackgroundColor: "rgba(218, 1, 45, .2)",
        backgroundColor: "rgba(218, 1, 45, .2)",
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
    }

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

    this.vilCountParams.startDate = "";
    this.vilCountParams.endDate = "";
    this.vilCountParams.condition = val;
    this.getVilCount();

    this.confirmationCountParams.startDate = "";
    this.confirmationCountParams.endDate = "";
    this.confirmationCountParams.condition = val;
    this.getConfirmationCount();

    this.queryByCountryParams.startDate = "";
    this.queryByCountryParams.endDate = "";
    this.queryByCountryParams.condition = val;
    this.getQueryByCountry();

    this.queryByDepartmentParams.startDate = "";
    this.queryByDepartmentParams.endDate = "";
    this.queryByDepartmentParams.condition = val;
    this.getQueryByDepartment();

    this.queryByPartnerParams.startDate = "";
    this.queryByPartnerParams.endDate = "";
    this.queryByPartnerParams.condition = val;
    this.getQueryByPartner();
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

    selectedDateRangeWidget.startDate = "";
    selectedDateRangeWidget.endDate = "";
    this.queryCountParams.startDate = "";
    this.queryCountParams.endDate = "";
    this.queryCountParams.condition = "last7";
    this.getQueryCount();
    selectedDateRangeWidget.startDate = "";
    selectedDateRangeWidget.endDate = "";
    this.vilCountParams.startDate = "";
    this.vilCountParams.endDate = "";
    this.vilCountParams.condition = "last7";
    this.getVilCount();
    selectedDateRangeWidget.startDate = "";
    selectedDateRangeWidget.endDate = "";
    this.confirmationCountParams.startDate = "";
    this.confirmationCountParams.endDate = "";
    this.confirmationCountParams.condition = "last7";
    this.getConfirmationCount();
    selectedDateRangePieChart.startDate = "";
    selectedDateRangePieChart.endDate = "";
    this.queryByCountryParams.startDate = "";
    this.queryByCountryParams.endDate = "";
    this.queryByCountryParams.condition = "last7";
    this.getQueryByCountry();
    selectedDateRangePieChart.startDate = "";
    selectedDateRangePieChart.endDate = "";
    this.queryByDepartmentParams.startDate = "";
    this.queryByDepartmentParams.endDate = "";
    this.queryByDepartmentParams.condition = "last7";
    this.getQueryByDepartment();
    selectedDateRangePieChart.startDate = "";
    selectedDateRangePieChart.endDate = "";
    this.queryByPartnerParams.startDate = "";
    this.queryByPartnerParams.endDate = "";
    this.queryByPartnerParams.condition = "last7";
    this.getQueryByPartner();
  }

  setWidgetData() {
    this.widgetData = [
      {
        name: "Querie's",
        desc: "Count represents the number of queries added",
        icon: "query_stats",
        iconBg: "rgb(21, 96, 189)",
        value: 0,
        chartData: this.cardChart1Data,
        range: false,
        event: "queryCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "Opinion",
        desc: "Count represents the number of Opinion Sent",
        icon: "local_activity",
        iconBg: "rgb(218, 1, 45)",
        value: "0",
        chartData: this.cardChart4Data,
        range: false,
        event: "avgOpinionTime",
        selectedFilter: "noFilterApplicable",
        isLoading: false,
      },
      {
        name: "VIL",
        desc: "Count represents the number of the VIL Sent",
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
        desc: "Count represents the number of the Confirmation Received",
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
        name: "Pending Queries",
        desc: "Count represents the number of pending queries (Pending reverted to Partner / Patient and awaiting revert from Doctor)",
        icon: "person_add",
        iconBg: "rgb(218, 1, 45)",
        value: 0,
        chartData: this.cardChart4Data,
        range: false,
        event: "confirmationCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "Open Follow Up",
        desc: "Count represents the number of pending follow-up tasks to be done (Till Date)",
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
        name: "Upcoming Arrival",
        desc: "Count represents the number of upcoming Arrivals",
        icon: "local_activity",
        iconBg: "rgb(67, 153, 70)",
        value: "0",
        chartData: this.cardChart3Data,
        range: false,
        event: "avgOpinionTime",
        selectedFilter: "noFilterApplicable",
        isLoading: false,
      },
      {
        name: "On-Ground Patient",
        desc: "Count represents the number of On-Ground Patient",
        icon: "query_stats",
        iconBg: "rgb(21, 96, 189)",
        value: 0,
        chartData: this.cardChart1Data,
        range: false,
        event: "queryCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "Opinion To VIL",
        desc: "% represents the ratio of Queries where Opinion & VIL both sent",
        icon: "query_stats",
        iconBg: "rgb(255, 191, 0)",
        value: 0,
        chartData: this.cardChart2Data,
        range: false,
        event: "queryCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "VIL To Confirmation",
        desc: "% represents the ratio of Queries where VIL Sent & Confirmation Received",
        icon: "local_activity",
        iconBg: "rgb(67, 153, 70)",
        value: "0",
        chartData: this.cardChart3Data,
        range: false,
        event: "avgOpinionTime",
        selectedFilter: "noFilterApplicable",
        isLoading: false,
      },
      {
        name: "Opinion To Confirmation",
        desc: "% represents the ratio of Queries where Opinion sent & Confirmation Received",
        icon: "flight_takeoff",
        iconBg: "rgb(21, 96, 189)",
        value: 0,
        chartData: this.cardChart1Data,
        range: false,
        event: "vilCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "VIL TAT",
        desc: "HH:MM represents the Turn Around Time (TAT) taken for VIL Sent to Partner / Patient since request has been received",
        icon: "person_add",
        iconBg: "rgb(218, 1, 45)",
        value: 0,
        chartData: this.cardChart4Data,
        range: false,
        event: "confirmationCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "Opinion Assigned",
        desc: "HH:MM represents the Turn Around Time (TAT) taken to Forward the Opinion request to the Doctor since it has been received",
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
        name: "Opinion Recd",
        desc: "HH:MM represents the Turn Around Time (TAT) taken for Opinion Received from Doctor since it has been Forwarded",
        icon: "flight_takeoff",
        iconBg: "rgb(21, 96, 189)",
        value: 0,
        chartData: this.cardChart1Data,
        range: false,
        event: "vilCount",
        selectedFilter: "last7",
        isLoading: false,
      },
      {
        name: "Opinion Sent",
        desc: "HH:MM represents the Turn Around Time (TAT) taken for Opinion Sent to Partner  / Patient since it has been Received from Doctor",
        icon: "local_activity",
        iconBg: "rgb(218, 1, 45)",
        value: "0",
        chartData: this.cardChart4Data,
        range: false,
        event: "avgOpinionTime",
        selectedFilter: "noFilterApplicable",
        isLoading: false,
      },
      {
        name: "Opinion TAT",
        desc: "HH:MM represents the Turn Around Time (TAT) taken for Opinion Sent to Partner  / Patient since Request has been Received (from Partner / Patiet)",
        icon: "query_stats",
        iconBg: "rgb(255, 191, 0)",
        value: 0,
        chartData: this.cardChart2Data,
        range: false,
        event: "queryCount",
        selectedFilter: "last7",
        isLoading: false,
      },
    ];
  }
  loadingChartsArray = [false, false, false, false, false, false];
  getQueryCount() {
    this.widgetData[0].isLoading = true;
    this.loadingChartsArray[0] = true;
    this.widgetData[0].value = 0;
    this.facilitatorService
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
    this.facilitatorService
      .getVilCount(this.vilCountParams)
      .subscribe((res) => {
        this.widgetData[1].value = res?.data?.count;
        this.widgetData[1].isLoading = false;
        this.loadingChartsArray[1] = false;
      });
  }
  getConfirmationCount() {
    this.widgetData[2].isLoading = true;
    this.loadingChartsArray[2] = true;
    this.widgetData[2].value = 0;
    this.facilitatorService
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
    this.facilitatorService.getAvgOpinionTime().subscribe((res) => {
      this.widgetData[3].value = res?.data + " " + "H";
      this.widgetData[3].isLoading = false;
    });
  }
  getLast6MonthQueryCount() {
    this.facilitatorService.getLast6MonthQueryCount().subscribe((res) => {
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
  }
  getLast6MonthVilCount() {
    this.facilitatorService.getLast6MonthVilCount().subscribe((res) => {
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
  }
  getLast6MonthPatientConfirmationCount() {
    this.facilitatorService
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
  }
  getJourneyFromOpinion() {
    this.facilitatorService.getJourneyFromOpinion().subscribe((res) => {
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
    this.facilitatorService.getJourneyFromVil().subscribe((res) => {
      let legendData = [];
      let seriesData = [];
      res.data.forEach((element) => {
        legendData.push(element.statusName);
        seriesData.push({
          value: element.count,
          name: element.statusName,
        });
      });
      this.funnelChartArray[1].chartData.legend.data = legendData;
      this.funnelChartArray[1].chartData["series"][0].data = seriesData;
      this.funnelChartArray[1].loading = false;
    });
  }

  getQueryByCountry() {
    this.pieChartArray[0].loading = true;
    this.loadingChartsArray[3] = true;
    this.pieChartArray[0].chartData["series"][0].data = [];
    this.facilitatorService
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
    this.facilitatorService
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
        this.pieChartArray[1].loading = false;
        this.loadingChartsArray[4] = false;
      });
  }
  getQueryByPartner() {
    this.pieChartArray[2].loading = true;
    this.loadingChartsArray[5] = true;
    this.pieChartArray[2].chartData["series"][0].data = [];
    this.facilitatorService
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
        this.pieChartArray[2].chartData["legend"] = null;
        this.pieChartArray[2].loading = false;
        this.loadingChartsArray[5] = false;
      });
  }
  barChartsArray = [
    {
      // chartName: "Last 6 Months Queries",
      chartName: "Queries",
      // loading: true,
      loading: false,
      chartData: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            saveAsImage: {},
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
            // data: [],
            data: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ], // Last 6 months
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
            // data: [],
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
            showBackground: false,
            color: "rgb(21, 96, 189)",
            label: {
              show: true,
              position: "top",
              color: "#000",
              formatter: "{c}",
            },
          },
        ],
      },
    },
    {
      // chartName: "Last 6 Months Queries",
      chartName: "Opinion",
      // loading: true,
      loading: false,
      chartData: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            saveAsImage: {},
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
            // data: [],
            data: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ], // Last 6 months
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
            // data: [],
            data: [8, 18, 28, 35, 44, 56, 66, 76, 86, 96, 106, 116],
            showBackground: false,
            color: "rgb(218, 1, 45)",
            label: {
              show: true,
              position: "top",
              color: "#000",
              formatter: "{c}",
            },
          },
        ],
      },
    },
    {
      chartName: "VIL",
      // chartName: "Last 6 Months VIL",
      // loading: true,
      loading: false,
      chartData: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            saveAsImage: {},
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
            // data: [],
            data: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ], // Last 6 months
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
            // data: [],
            data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 55, 65, 75],
            color: "rgb(255, 191, 0)",
            label: {
              show: true,
              position: "top",
              color: "#000",
              formatter: "{c}",
            },
          },
        ],
      },
    },
    {
      chartName: "Confirmation's",
      // chartName: "Last 6 Months Confirmation's",
      // loading: true,
      loading: false,
      chartData: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            saveAsImage: {},
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
            // data: [],
            data: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ], // Last 6 months
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
            // data: [],
            data: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
            color: "rgb(67, 153, 70)",
            label: {
              show: true,
              position: "top",
              color: "#000",
              formatter: "{c}",
            },
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
            label: {
              show: true,
              position: "outside", // "inside" for labels inside the pie
              formatter: "{b}: {c} ({d}%)", // Display Name, Count, and Percentage
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
            label: {
              show: true,
              position: "outside", // "inside" for labels inside the pie
              formatter: "{b}: {c} ({d}%)", // Display Name, Count, and Percentage
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
  //line Chart
  initializeLineCharts() {
    this.lineChartsArray = [
      {
        chartName: "AVG Opinion Recd and Sent to Partner TAT",
        chartStyle: { height: "400px" },
        loading: false,
        chartData: {
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["TAT Opinion Recd", "Tat Opinion Sent"],
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
          xAxis: {
            type: "category",
            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          },
          yAxis: {
            type: "value",
            min: 56,
            max: 63,
            interval: 1,
            axisLabel: {
              formatter: function (value) {
                let hours = Math.floor(value);
                let minutes = Math.round((value - hours) * 60);
                // return `${hours}:${minutes.toString().padStart(2, '0')} Hrs`;
                return `${hours}:${minutes.toString().padStart(2, "0")}`;
              },
            },
          },
          series: [
            {
              name: "TAT Opinion Recd",
              type: "line",
              data: [61.7, 56.94, 61.54, 62.73, 56.5, 57.32],
              smooth: false,
              color: "rgba(21, 96, 183,1)",
              label: {
                show: true,
                position: "top",
                color: "#000",
                formatter: "{c} Hrs",
              },
            },
            {
              name: "Tat Opinion Sent",
              type: "line",
              data: [57.45, 61.33, 56.35, 58.18, 60.54, 59.23],
              smooth: false,
              color: "rgba(218, 1, 45,1)",
              label: {
                show: true,
                position: "top",
                color: "#000",
                formatter: "{c} Hrs",
              },
            },
          ],
        },
      },
      {
        chartName: "AVG TAT of Assign to DOC & Opinion Recd",
        chartStyle: { height: "400px" },
        loading: false,
        chartData: {
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["Assign To DOC", "Opinion Recd"],
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
          xAxis: {
            type: "category",
            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          },
          yAxis: {
            type: "value",
            min: 30,
            max: 85,
            interval: 5,
            axisLabel: {
              formatter: function (value) {
                let hours = Math.floor(value);
                let minutes = Math.round((value - hours) * 60);
                // return `${hours}:${minutes.toString().padStart(2, '0')} Hrs`;
                return `${hours}:${minutes.toString().padStart(2, "0")}`;
              },
            },
          },
          series: [
            {
              name: "Assign To DOC",
              type: "line",
              data: [37, 82, 57, 37, 35, 36],
              smooth: false,
              color: "rgba(21, 96, 183,1)",
              label: {
                show: true,
                position: "top",
                color: "#000",
                formatter: "{c} Hrs",
              },
            },
            {
              name: "Opinion Recd",
              type: "line",
              data: [61.7, 54.91, 61.54, 62.51, 37.15, 57.32],
              smooth: false,
              color: "rgba(218, 1, 45,1)",
              label: {
                show: true,
                position: "top",
                color: "#000",
                formatter: "{c} Hrs",
              },
            },
          ],
        },
      },
      {
        chartName: "AVG TAT of Patient Entry to Arrival (Hrs)",
        chartStyle: { height: "400px" },
        loading: false,
        chartData: {
          tooltip: {
            trigger: "axis",
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
          xAxis: {
            type: "category",
            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          },
          yAxis: {
            type: "value",
            min: 34, // Start from 0
            max: 51, // Adjust max value based on your data range
            interval: 2, // Set intervals of 1
          },
          series: [
            {
              name: "AVG TAT of Patient Entry to Arrival",
              type: "line",
              data: [36, 51, 48, 37, 35, 34, 35],
              smooth: false,
              color: "rgb(218, 1, 45)",
              label: {
                show: true,
                position: "top",
                color: "#000",
                formatter: "{c} Hrs",
              },
            },
          ],
        },
      },
    ];
  }
}
