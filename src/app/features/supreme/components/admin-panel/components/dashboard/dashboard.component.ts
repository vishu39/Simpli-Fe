import { AfterViewInit, Component, NgZone, OnInit } from "@angular/core";
import * as moment from "moment";
import { SMBarChart } from "src/app/smvt-framework/interfaces/sm-framework-defaults";
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
import { commentsData, staticPieChartData } from "./staticChartData";
import { Router } from "@angular/router";
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
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, AfterViewInit {
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
  filterValue: any;
  currentDate: Date = new Date();
  staticComments: any[] = commentsData;

  constructor(private router: Router, private zone: NgZone) {}

  ngOnInit() {
    this.smallChart1();
    this.smallChart2();
    this.smallChart3();
    this.smallChart4();
    this.chart1();
    this.chart2();
    this.setWidgetData();
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
  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: "New Patients",
          data: [31, 40, 28, 51, 42, 85, 77],
        },
        {
          name: "Old Patients",
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
        foreColor: "#9aa0ac",
      },
      colors: ["#407fe4", "#908e8e"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19",
          "2018-09-20",
          "2018-09-21",
          "2018-09-22",
          "2018-09-23",
          "2018-09-24",
          "2018-09-25",
        ],
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: 0,
      },

      tooltip: {
        theme: "dark",
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  private chart2() {
    this.barChartOptions = {
      series: [
        {
          name: "Colds and Flu",
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: "Headaches",
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: "Malaria",
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: "Typhoid",
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        foreColor: "#9aa0ac",
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "category",
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
      legend: {
        show: false,
      },
      fill: {
        opacity: 0.8,
        colors: ["#01B8AA", "#374649", "#FD625E", "#F2C80F"],
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
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

  emitSelectEvent(event: any) {
    let val = event.target.value;
    this.filterValue = val;
    return this.filterValue;
  }
  setWidgetData() {
    this.widgetData = [
      {
        name: "Query's",
        icon: "query_stats",
        iconBg: "rgb(218, 1, 45)",
        value: 450,
        chartData: this.cardChart1Data,
        range: false,
      },
      {
        name: "VIL",
        icon: "flight_takeoff",
        iconBg: "rgb(255, 191, 0)",
        value: 190,
        chartData: this.cardChart2Data,
        range: false,
      },
      {
        name: "Confirmations",
        icon: "person_add",
        iconBg: "rgb(67, 153, 70)",
        value: 80,
        chartData: this.cardChart3Data,
        range: false,
      },
      {
        name: "Avg Opinion Time",
        icon: "local_activity",
        iconBg: "rgb(21, 96, 189)",
        value: "5hr",
        chartData: this.cardChart4Data,
        range: false,
      },
    ];
  }

  barChartsArray: SMBarChart[] = [
    {
      chartName: "Last 6 Months Queries",
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
            data: this.getLastSixMonthNames(),
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
            data: [160, 220, 250, 340, 300, 230, 220],
            showBackground: false,
            color: "rgb(218, 1, 45)",
          },
        ],
      },
    },
    {
      chartName: "Last 6 Months VIL",
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
            data: this.getLastSixMonthNames(),
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
            data: [100, 220, 200, 334, 390, 200, 220],
            color: "rgb(255, 191, 0)",
          },
        ],
      },
    },
    {
      chartName: "Last 6 Months Confirmation's",
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
            data: this.getLastSixMonthNames(),
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
            data: [140, 300, 230, 330, 200, 303, 230],
            color: "rgb(67, 153, 70)",
          },
        ],
      },
    },
  ];

  funnelChartArray: SMBarChart[] = [
    {
      chartName: "Journey from Opinion",
      chartStyle: {
        width: "39vw",
      },
      chartData: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        legend: {
          data: ["Pre Intimation, Opinion, OPD, PI", "VIL", "Confirmation"],
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
            sort: "descending",
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
            data: [
              { value: 60, name: "Pre Intimation, Opinion, OPD, PI" },
              { value: 40, name: "VIL" },
              { value: 20, name: "Confirmation" },
            ],
          },
        ],
      },
    },
    {
      chartName: "Journey from VIL",
      chartStyle: {
        width: "40vw",
      },
      chartData: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        legend: {
          data: ["VIL", "Confirmation"],
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
            sort: "descending",
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
            data: [
              { value: 40, name: "VIL" },
              { value: 20, name: "Confirmation" },
            ],
          },
        ],
      },
    },
  ];

  pieChartArray: SMBarChart[] = [
    {
      chartName: "Query's by Country",
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
            name: "Query's From",
            type: "pie",
            radius: "50%",
            center: ["50%", "40%"],
            avoidLabelOverlap: true,
            data: [
              { value: 800, name: "SAARC" },
              { value: 100, name: "Middle East" },
              { value: 300, name: "Others" },
              { value: 180, name: "East Africa" },
              { value: 160, name: "CIS" },
              { value: 100, name: "West Africa" },
              { value: 170, name: "South East Asia" },
              { value: 90, name: "Southern Africa" },
              { value: 50, name: "Northern Africa" },
              { value: 80, name: "Central Africa" },
            ],
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
    },
    {
      chartName: "Query's by Department",
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
            name: "Query's From",
            type: "pie",
            radius: "45%",
            center: ["50%", "25%"],
            avoidLabelOverlap: true,
            data: [
              { value: 8, name: "General Surgery" },
              { value: 21, name: "Endocrinology" },
              { value: 3, name: "Pulmonology" },
              { value: 137, name: "Cardiology" },
              { value: 2, name: "Urology" },
              { value: 128, name: "Gynecology" },
              { value: 81, name: "Transplants" },
              { value: 4, name: "Dental Treatments" },
              { value: 202, name: "Orthopaedic" },
              { value: 8, name: "Robotic Surgery" },
              { value: 187, name: "Neurology" },
              { value: 4, name: "Ophthalmology" },
              { value: 918, name: "Others" },
              { value: 28, name: "Spine Surgery" },
              { value: 72, name: "Nephology" },
              { value: 3, name: "Gastroenterology" },
              { value: 128, name: "Cosmetic & Plastic Surgery" },
              { value: 7, name: "Pediatric Surgery" },
              { value: 74, name: "Ear Nose Throat Surgery" },
              { value: 480, name: "Cancer" },
            ],
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
    },
    {
      chartName: "Query's by Partner",
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
            name: "Query's From",
            type: "pie",
            radius: "50%",
            center: ["50%", "40%"],
            avoidLabelOverlap: true,
            data: [
              { value: 50, name: "KMT" },
              { value: 5, name: "UAP insurance" },
              { value: 30, name: "Exo care" },
              { value: 10, name: "Treatment Traveler" },
              { value: 40, name: "Mediex" },
              { value: 20, name: "Dr ABC" },
              { value: 12, name: "Dr Okomo " },
              { value: 3, name: "MPH Hospital" },
              { value: 28, name: "London Healthcare centre" },
            ],
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
    },
  ];
  ngAfterViewInit(): void {
    setTimeout(() => {
      for (let i = 0; i < this.pieChartArray.length; i++) {
        let myChart = echarts.init(document.querySelector(`#pieChart${i}`));
        myChart.on("click", (params: any) => {
          myChart.setOption({
            series: [
              {
                name: "",
                data: this.findChildData(params),
              },
            ],
          });
        });
      }
    });
  }
  findChildData(params: any) {
    let staticChartData: any[] = staticPieChartData;
    let data = staticChartData.find(
      (val: any) => params.name == val.name
    )?.children;
    return data
      ? data
      : this.zone.run(() => {
          this.router.navigate([
            "/supreme/admin/query-management",
            { paramsData: params },
          ]);
        });
  }
}
