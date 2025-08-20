import { Component, OnInit, ViewChild } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
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
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDateRangePicker } from "@angular/material/datepicker";

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
  selector: "app-shared-treating-doctor-dashboard",
  templateUrl: "./shared-treating-doctor-dashboard.component.html",
  styleUrls: ["./shared-treating-doctor-dashboard.component.scss"],
})
export class SharedTreatingDoctorDashboardComponent implements OnInit {
  public cardChart1: any;
  public cardChart1Data: any;
  public cardChart1Label: any;

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

  rangeFormGroup: FormGroup;
  constructor(
    // private router: Router,
    // private zone: NgZone,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  rangeFormGroup1: FormGroup;
  rangeFormGroup2: FormGroup;

  ngOnInit() {
    this.rangeFormGroup1 = this.fb.group({
      startDate: [null],
      endDate: [null],
    });
    this.rangeFormGroup2 = this.fb.group({
      startDate: [null],
      endDate: [null],
    });

    // this.rangeFormGroup1.valueChanges.subscribe((value) => {
    //   console.log(value);

    //   if (value.startDate && value.endDate) {
    //     this.rangeFormGroup2.patchValue(value, { emitEvent: false });
    //   }
    // });

    // this.rangeFormGroup2.valueChanges.subscribe((value) => {
    //   console.log(value);
    //   if (value.startDate && value.endDate) {
    //     this.rangeFormGroup1.patchValue(value, { emitEvent: false });
    //   }
    // });

    this.smallChart1();
    this.smallChart4();
    this.setWidgetData();
    this.getQueryCount();
    this.getAvgOpinionTime();
    this.getLast6MonthQueryCount();
    this.getQueryByCountry();
  }

  startDate: Date | null = null;
  endDate: Date | null = null;

  onDateChange() {}

  applyDateRange(eventType: string) {
    let startDate = "";
    let endDate = "";
    if (eventType === "picker1") {
      startDate = this.rangeFormGroup1?.value?.startDate;
      endDate = this.rangeFormGroup1?.value?.endDate;

      if (startDate && endDate) {
        this.rangeFormGroup2.patchValue(
          {
            startDate,
            endDate,
          },
          { emitEvent: false }
        );
      }
    }
    if (eventType === "picker2") {
      startDate = this.rangeFormGroup2?.value?.startDate;
      endDate = this.rangeFormGroup2?.value?.endDate;

      if (startDate && endDate) {
        this.rangeFormGroup1.patchValue(
          {
            startDate,
            endDate,
          },
          { emitEvent: false }
        );
      }
    }

    if (startDate && endDate) {
      this.queryCountParams.condition = "dateRange";
      (this.queryCountParams.startDate = startDate),
        (this.queryCountParams.endDate = new Date(endDate));
      this.queryCountParams.endDate.setHours(23, 59, 59);
      this.getQueryCount();
      this.queryByCountryParams.condition = "dateRange";
      (this.queryByCountryParams.startDate = startDate),
        (this.queryByCountryParams.endDate = new Date(endDate));
      this.queryByCountryParams.endDate.setHours(23, 59, 59);
      this.getQueryByCountry();
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

      this.queryByCountryParams.startDate = "";
      this.queryByCountryParams.endDate = "";
      this.queryByCountryParams.condition = val;
      this.getQueryByCountry();
    }
  }

  clearDateFilter() {
    this.rangeFormGroup1.patchValue(
      {
        startDate: "",
        endDate: "",
      },
      { emitEvent: false }
    );

    this.rangeFormGroup2.patchValue(
      {
        startDate: "",
        endDate: "",
      },
      { emitEvent: false }
    );

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

    this.queryCountParams.startDate = "";
    this.queryCountParams.endDate = "";
    this.queryCountParams.condition = "last7";
    this.getQueryCount();

    this.queryByCountryParams.startDate = "";
    this.queryByCountryParams.endDate = "";
    this.queryByCountryParams.condition = "last7";
    this.getQueryByCountry();
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

  loadingChartsArray = [false, false];
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

  getAvgOpinionTime() {
    this.widgetData[1].isLoading = true;
    this.widgetData[1].value = 0;
    this.hospitalService.getAvgOpinionTime().subscribe((res) => {
      this.widgetData[1].value = res?.data + " " + "H";
      this.widgetData[1].isLoading = false;
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
  }

  getQueryByCountry() {
    this.pieChartArray[0].loading = true;
    this.loadingChartsArray[1] = true;
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
        this.loadingChartsArray[1] = false;
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
    }
  }
}
