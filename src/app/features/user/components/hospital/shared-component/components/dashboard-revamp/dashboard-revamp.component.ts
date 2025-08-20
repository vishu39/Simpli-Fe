import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  cardsDataArray,
  GenderArray,
  modifyCardsData,
  MonthArray,
  QuaterArray,
  YearArray,
  monthConstant,
  genderLabelByCategory,
} from "./dashboardConstant";
import { DashboardRevampFilterModalComponent } from "./component/dashboard-revamp-filter-modal/dashboard-revamp-filter-modal.component";
import { MatDialog } from "@angular/material/dialog";

import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
} from "ng-apexcharts";
import { SidebarService } from "src/app/core/service/sidebar-service.service";
import { DOCUMENT } from "@angular/common";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import * as moment from "moment";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow"
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DashboardRevampDownloadModalComponent } from "./component/dashboard-revamp-download-modal/dashboard-revamp-download-modal.component";
import {
  convertKeysToLowercase,
  countryCodeList,
} from "src/app/shared/sharedConstant";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

am4core.useTheme(am4themes_animated);

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: "shared-dashboard-revamp",
  templateUrl: "./dashboard-revamp.component.html",
  styleUrls: ["./dashboard-revamp.component.scss"],
})
export class DashboardRevampComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog,
    private sidebarService: SidebarService,
    private renderer: Renderer2,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private hospitalService: HospitalService
  ) { }

  setInitialDateRange() {
    const today = moment();
    const sixMonthEndDate = moment(today).endOf("month");
    const sixMonthStartDate = moment(sixMonthEndDate)
      .subtract(5, "months")
      .startOf("month");

    let newObj = {
      startDate: sixMonthStartDate.toDate(),
      endDate: sixMonthEndDate.toDate(),
    };
    this.filterSelectionForm.patchValue({
      dateRange: newObj,
    });
  }

  setYearsArray() {
    const today = moment();
    let currentYear = today?.year();

    for (let i = currentYear - 3; i <= currentYear; i++) {
      let newObj = { value: i, name: i };
      this.years.push(newObj);
    }
  }

  isSidebarShrunk: boolean;
  ngOnInit(): void {
    this.buildForm();
    this.setYearsArray();
    // this.getAllDasboardCards();
    this.getCountryData(false);
    this.getTreatmentData(false);
    this.getAllHospital(false);
    // this.getOwnReferralPartner(false);
    this.getAllReferralPartner();
    this.getDoctorData(false);
    this.getAllInternalUser();
    this.setCardsData();

    // Force shrink the sidebar
    this.renderer.addClass(this.document.body, "side-closed");
    this.renderer.addClass(this.document.body, "submenu-closed");

    // Update shared sidebar state
    this.sidebarService.setSidebarShrunk(true);

    this.sidebarService.sidebarShrunk$.subscribe((res: any) => {
      this.isSidebarShrunk = res;
    });
  }

  private chart!: am4maps.MapChart;

  createChartForMap(data = []) {
    this.chart = am4core.create("chartdiv", am4maps.MapChart);
    this.chart.geodata = am4geodata_worldLow;
    this.chart.projection = new am4maps.projections.Miller();

    // this.chart.maxZoomLevel = 2;
    // this.chart.chartContainer.wheelable = false;

    // Set background color
    this.chart.background.fill = am4core.color("#f5f5f5");
    this.chart.background.fillOpacity = 1;

    // Polygon series
    const polygonSeries = this.chart.series.push(
      new am4maps.MapPolygonSeries()
    );
    polygonSeries.useGeodata = true;
    // polygonSeries.exclude = ["IN"]; 

    polygonSeries.data = data;

    // Template settings
    const polygonTemplate = polygonSeries.mapPolygons.template;

    polygonTemplate.events.on("over", (ev: any) => {
      const dataItem = ev.target.dataItem;
      if (!dataItem || !dataItem.dataContext || !dataItem.dataContext.queries) {
        ev.target.tooltipText = ""; // remove tooltip
        ev.target.isHover = false; // cancel hover effect
      }
    });

    polygonTemplate.tooltipText =
      `{name}\n` +
      `Query: {queries}\n` +
      `Opinion: {opinion}\n` +
      `VIL: {vil}\n` +
      `Confirmations: {confiramtion}`;

    polygonTemplate.polygon.fillOpacity = 0.6;
    polygonTemplate.strokeOpacity = 0;
    polygonTemplate.fill = am4core.color("#d9d9d9"); // fallback
    polygonTemplate.propertyFields.fill = "fill"; // use custom fill per data\

    polygonTemplate.stroke = am4core.color("#000");           // Black border
    polygonTemplate.strokeWidth = 1;                          // Thicker
    polygonTemplate.nonScalingStroke = true;
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  queryCountTopCardsCountsData: any = {};
  getQueryCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "query") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "query");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService.getQueryCountForTopCards(filter_obj).subscribe({
      next: (res: any) => {
        this.queryCountTopCardsCountsData = res?.data;
        if (targetCard) {
          targetCard.value = this.queryCountTopCardsCountsData?.query || 0;
          targetCard.isLoading = false;
        }
      },
      error: () => {
        if (targetCard) {
          targetCard.isLoading = false;
        }
      },
    });
  }

  opinionCountTopCardsCountsData: any = {};
  getOpinionCountForTopCards(filter_obj: any) {
    // Try to find the "opinion" card in both visible and hidden arrays
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "opinion") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "opinion");

    // If found, show loading
    if (targetCard) {
      targetCard.isLoading = true;
    }

    // Call the API
    this.hospitalService.getOpinionCountForTopCards(filter_obj).subscribe({
      next: (res: any) => {
        this.opinionCountTopCardsCountsData = res?.data;

        if (targetCard) {
          targetCard.value = this.opinionCountTopCardsCountsData?.opinion || 0;
          targetCard.isLoading = false;
        }
      },
      error: () => {
        if (targetCard) {
          targetCard.isLoading = false;
        }
      },
    });
  }

  vilCountTopCardsCountsData: any = {};
  getVilCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "vil") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "vil");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService.getVilCountForTopCards(filter_obj).subscribe({
      next: (res: any) => {
        this.vilCountTopCardsCountsData = res?.data;

        if (targetCard) {
          targetCard.value = this.vilCountTopCardsCountsData?.vil || 0;
          targetCard.isLoading = false;
        }
      },
      error: () => {
        if (targetCard) {
          targetCard.isLoading = false;
        }
      },
    });
  }

  confirmationCountTopCardsCountsData: any = {};
  getConfirmationCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "confirmation") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "confirmation");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getConfirmationCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.confirmationCountTopCardsCountsData = res?.data;

          if (targetCard) {
            targetCard.value =
              this.confirmationCountTopCardsCountsData?.confirmation || 0;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  pendingQueryCountTopCardsCountsData: any = {};
  getPendingQueryCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "pendingQuery") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "pendingQuery");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getPendingQueryCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.pendingQueryCountTopCardsCountsData = res?.data;

          if (targetCard) {
            targetCard.value =
              this.pendingQueryCountTopCardsCountsData?.pendingQuery || 0;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  followUpQueryCountTopCardsCountsData: any = {};
  getOpenFollowUpCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "openFollowUp") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "openFollowUp");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getOpenFollowUpCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.followUpQueryCountTopCardsCountsData = res?.data;

          if (targetCard) {
            targetCard.value =
              this.followUpQueryCountTopCardsCountsData?.openFollowUp || 0;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  upcommingArrivalCountTopCardsCountsData: any = {};
  getUpcommingArrivalCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "upcomingArrival") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "upcomingArrival");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getUpcommingArrivalCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.upcommingArrivalCountTopCardsCountsData = res?.data;

          if (targetCard) {
            targetCard.value =
              this.upcommingArrivalCountTopCardsCountsData?.upcomingArrival ||
              0;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  onGroundCountTopCardsCountsData: any = {};
  getOnGroundCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "onGroundPatient") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "onGroundPatient");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService.getOnGroundCountForTopCards(filter_obj).subscribe({
      next: (res: any) => {
        this.onGroundCountTopCardsCountsData = res?.data;

        if (targetCard) {
          targetCard.value =
            this.onGroundCountTopCardsCountsData?.onGroundPatient || 0;
          targetCard.isLoading = false;
        }
      },
      error: () => {
        if (targetCard) {
          targetCard.isLoading = false;
        }
      },
    });
  }

  opinionToVilCountTopCardsCountsData: any = {};
  getOpinionToVilCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "opinionToVil") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "opinionToVil");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getOpinionToVilCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.opinionToVilCountTopCardsCountsData = res?.data;

          if (targetCard) {
            const first =
              this.opinionToVilCountTopCardsCountsData?.opinionToVil?.[0]
                ?.count || 0;
            const second =
              this.opinionToVilCountTopCardsCountsData?.opinionToVil?.[1]
                ?.count || 0;
            targetCard.value = `${first} : ${second}`;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  vilToConfirmationCountTopCardsCountsData: any = {};
  getVilToConfirmationCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "vilToConfirmation") ||
      this.cardHiddenArray.find(
        (cd: any) => cd?.keyType === "vilToConfirmation"
      );

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getVilToConfirmationCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.vilToConfirmationCountTopCardsCountsData = res?.data;

          if (targetCard) {
            const first =
              this.vilToConfirmationCountTopCardsCountsData
                ?.vilToConfirmation?.[0]?.count || 0;
            const second =
              this.vilToConfirmationCountTopCardsCountsData
                ?.vilToConfirmation?.[1]?.count || 0;
            targetCard.value = `${first} : ${second}`;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  opinionToConfirmationCountTopCardsCountsData: any = {};
  getOpinionToConfirmationCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find(
        (cd: any) => cd?.keyType === "opinionToConfirmation"
      ) ||
      this.cardHiddenArray.find(
        (cd: any) => cd?.keyType === "opinionToConfirmation"
      );

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getOpinionToConfirmationCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.opinionToConfirmationCountTopCardsCountsData = res?.data;

          if (targetCard) {
            const first =
              this.opinionToConfirmationCountTopCardsCountsData
                ?.opinionToConfirmation?.[0]?.count || 0;
            const second =
              this.opinionToConfirmationCountTopCardsCountsData
                ?.opinionToConfirmation?.[1]?.count || 0;
            targetCard.value = `${first} : ${second}`;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  vilTatCountTopCardsCountsData: any = {};
  getVilTatCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "vilTat") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "vilTat");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService.getVilTatCountForTopCards(filter_obj).subscribe({
      next: (res: any) => {
        this.vilTatCountTopCardsCountsData = res?.data;

        if (targetCard) {
          targetCard.value = this.vilTatCountTopCardsCountsData?.vilTat || 0;
          targetCard.isLoading = false;
        }
      },
      error: () => {
        if (targetCard) {
          targetCard.isLoading = false;
        }
      },
    });
  }

  opinionAssignedTatCountTopCardsCountsData: any = {};
  getOpinionAssignedTatCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "opinionAssignedTat") ||
      this.cardHiddenArray.find(
        (cd: any) => cd?.keyType === "opinionAssignedTat"
      );

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getOpinionAssignedTatCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.opinionAssignedTatCountTopCardsCountsData = res?.data;

          if (targetCard) {
            targetCard.value =
              this.opinionAssignedTatCountTopCardsCountsData
                ?.opinionAssignedTat || 0;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  opinionRecdTatCountTopCardsCountsData: any = {};
  getOpinionRecdTatCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "opinionRecdTat") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "opinionRecdTat");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getOpinionRecdTatCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.opinionRecdTatCountTopCardsCountsData = res?.data;

          if (targetCard) {
            targetCard.value =
              this.opinionRecdTatCountTopCardsCountsData?.opinionRecdTat || 0;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  opinionSentTatCountTopCardsCountsData: any = {};
  getOpinionSentTatCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "opinionSentTat") ||
      this.cardHiddenArray.find((cd: any) => cd?.keyType === "opinionSentTat");

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getOpinionSentTatCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.opinionSentTatCountTopCardsCountsData = res?.data;

          if (targetCard) {
            targetCard.value =
              this.opinionSentTatCountTopCardsCountsData?.opinionSentTat || 0;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  overallOpinionTatCountTopCardsCountsData: any = {};
  getOverAllOpinionTatCountForTopCards(filter_obj: any) {
    const targetCard =
      this.cardsData.find((cd: any) => cd?.keyType === "overallOpinionTat") ||
      this.cardHiddenArray.find(
        (cd: any) => cd?.keyType === "overallOpinionTat"
      );

    if (targetCard) {
      targetCard.isLoading = true;
    }

    this.hospitalService
      .getOverAllOpinionTatCountForTopCards(filter_obj)
      .subscribe({
        next: (res: any) => {
          this.overallOpinionTatCountTopCardsCountsData = res?.data;

          if (targetCard) {
            targetCard.value =
              this.overallOpinionTatCountTopCardsCountsData
                ?.overallOpinionTat || 0;
            targetCard.isLoading = false;
          }
        },
        error: () => {
          if (targetCard) {
            targetCard.isLoading = false;
          }
        },
      });
  }

  // topCards api end

  queryBarChartData: any = {};
  getQueryBarChartData(filter_obj: any) {
    this.apexBarChartDataArray[0].isLoading = true;
    this.hospitalService.getQueryBarChartData(filter_obj).subscribe(
      (res: any) => {
        this.queryBarChartData = res?.data;
        const { labels, finalCountArray } = this.queryBarChartData;

        this.apexBarChartDataArray[0].series[0].data = [...finalCountArray];
        this.apexBarChartDataArray[0].xaxis.categories = [...labels];

        this.apexBarChartDataArray[0].isLoading = false;
      },
      () => {
        this.apexBarChartDataArray[0].isLoading = false;
      }
    );
  }

  opinionBarChartData: any = {};
  getOpinionBarChartData(filter_obj: any) {
    this.apexBarChartDataArray[1].isLoading = true;
    this.hospitalService.getOpinionBarChartData(filter_obj).subscribe(
      (res: any) => {
        this.opinionBarChartData = res?.data;
        const { labels, countData } = this.opinionBarChartData;

        this.apexBarChartDataArray[1].series[0].data = [...countData];
        this.apexBarChartDataArray[1].xaxis.categories = [...labels];

        // let modData = monthConstant.map((month) => countData[month] || 0);

        // this.apexBarChartDataArray[1].series[0].data = [...modData];

        this.apexBarChartDataArray[1].isLoading = false;
      },
      () => {
        this.apexBarChartDataArray[1].isLoading = false;
      }
    );
  }

  vilBarChartData: any = {};
  getVilBarChartData(filter_obj: any) {
    this.apexBarChartDataArray[2].isLoading = true;
    this.hospitalService.getVilBarChartData(filter_obj).subscribe(
      (res: any) => {
        this.vilBarChartData = res?.data;
        const { labels, countData } = this.vilBarChartData;

        this.apexBarChartDataArray[2].series[0].data = [...countData];
        this.apexBarChartDataArray[2].xaxis.categories = [...labels];

        // let modData = monthConstant.map((month) => countData[month] || 0);

        // this.apexBarChartDataArray[2].series[0].data = [...modData];

        this.apexBarChartDataArray[2].isLoading = false;
      },
      () => {
        this.apexBarChartDataArray[2].isLoading = false;
      }
    );
  }

  confirmationBarChartData: any = {};
  getConfirmationBarChartData(filter_obj: any) {
    this.apexBarChartDataArray[3].isLoading = true;
    this.hospitalService.getConfirmationBarChartData(filter_obj).subscribe(
      (res: any) => {
        this.confirmationBarChartData = res?.data;
        // const { countData, monthlyDataObj } = this.confirmationBarChartData;
        const { labels, countData } = this.confirmationBarChartData;

        this.apexBarChartDataArray[3].series[0].data = [...countData];
        this.apexBarChartDataArray[3].xaxis.categories = [...labels];

        // let modData = monthConstant.map((month) => countData[month] || 0);

        // this.apexBarChartDataArray[3].series[0].data = [...modData];

        this.apexBarChartDataArray[3].isLoading = false;
      },
      () => {
        this.apexBarChartDataArray[3].isLoading = false;
      }
    );
  }

  totalMultiLineChartData: any = {};
  getTotalMultiLineChartData(filter_obj: any) {
    this.apexMultipleLineChartDataArray[0].isLoading = true;
    this.hospitalService.getTotalMultiLineChartData(filter_obj).subscribe(
      (res: any) => {
        this.totalMultiLineChartData = res?.data;
        const {
          labelsForPatientData,
          countForPatientData,
          labelsForOpinionRequest,
          countDataForOpinionRequest,
          labelsForVilRequest,
          countDataForVilRequest,
          labelsForPatientConfiramtion,
          countDataForPatientConfiramtion,
        } = this.totalMultiLineChartData;

        let labels = [...labelsForOpinionRequest];

        this.apexMultipleLineChartDataArray[0].xaxis.categories = [...labels];

        this.apexMultipleLineChartDataArray[0].series[0].data = [
          ...countDataForPatientConfiramtion,
        ];
        this.apexMultipleLineChartDataArray[0].series[1].data = [
          ...countDataForVilRequest,
        ];
        this.apexMultipleLineChartDataArray[0].series[2].data = [
          ...countDataForOpinionRequest,
        ];
        this.apexMultipleLineChartDataArray[0].series[3].data = [
          ...countForPatientData,
        ];

        this.apexMultipleLineChartDataArray[0].isLoading = false;
      },
      () => {
        this.apexMultipleLineChartDataArray[0].isLoading = false;
      }
    );
  }

  totalGenderDiversityPieChartData: any = {};
  mainGenderData = [];
  maleGenderData = [];
  femaleGenderData = [];
  otherGenderData = [];
  getGenderDiversityPieChartData(filter_obj: any) {
    this.apexGenderDiversityChartDataArray[0].isLoading = true;
    this.hospitalService
      .getGenderDiversityPieChartData(filter_obj)
      .subscribe(
        (res: any) => {
          this.totalGenderDiversityPieChartData = res?.data;
          const {
            maleDataCount,
            maleDataArray,
            femaleDataCount,
            femaleDataArray,
            restDataArray,
            restDataCount,
            maleCategorisedData,
            femaleCategorisedData,
            restCategorisedData,
          } = this.totalGenderDiversityPieChartData;

          this.maleGenderData = cloneDeep(maleDataArray);
          this.femaleGenderData = cloneDeep(femaleDataArray);
          this.otherGenderData = cloneDeep(restDataArray);
          this.maleCategoryData = cloneDeep(maleCategorisedData);
          this.femaleCategoryData = cloneDeep(femaleCategorisedData);
          this.otherCategoryData = cloneDeep(restCategorisedData);

          this.mainGenderData = [maleDataCount, femaleDataCount, restDataCount];

          this.apexGenderDiversityChartDataArray[0].series =
            this.mainGenderData;
          this.apexGenderDiversityChartDataArray[0].labels = [
            "Male",
            "Female",
            "Other",
          ];

          this.apexGenderDiversityChartDataArray[0].isLoading = false;
        },
        () => {
          this.apexGenderDiversityChartDataArray[0].isLoading = false;
        }
      );
  }

  totalPatientByStatusBarChartData: any = {};
  patientByStatusMainSeriesData = [];
  getPatientByStatusBarChart(filter_obj: any) {
    this.apexGenderDiversityChartDataArray[1].isLoading = true;
    this.hospitalService.getPatientByStatusBarChart(filter_obj).subscribe(
      (res: any) => {
        this.totalPatientByStatusBarChartData = res?.data;

        const {
          opinionRequestedCount,
          opinionReceivedCount,
          opdRequestedCount,
          opdReceivedCount,
          vilRequestedCount,
          vilReceivedCount,
          proformaRequestedCount,
          proformaReceivedCount,
          preIntimationCount,
          patientConfirmationCount,
          opinionForwardToDoctorCount,
          opinionDoctorRepliedCount
        } = this.totalPatientByStatusBarChartData;

        this.patientByStatusMainSeriesData = [
          {
            name: "Opinion Added",
            data: [opinionDoctorRepliedCount, 0, 0, 0, 0],
          },
          {
            name: "Opinion Forward To Doc.",
            data: [opinionForwardToDoctorCount, 0, 0, 0, 0],
          },
          {
            name: "Opinion Requested",
            data: [opinionRequestedCount, 0, 0, 0, 0],
          },

          { name: "OPD Added", data: [0, opdReceivedCount, 0, 0, 0] },
          { name: "OPD Requested", data: [0, opdRequestedCount, 0, 0, 0] },

          {
            name: "Proforma Added",
            data: [0, 0, proformaReceivedCount, 0, 0],
          },
          {
            name: "Proforma Request",
            data: [0, 0, proformaRequestedCount, 0, 0],
          },

          { name: "VIL Added", data: [0, 0, 0, vilReceivedCount, 0] },
          { name: "VIL Request", data: [0, 0, 0, vilRequestedCount, 0] },

          {
            name: "Patient Confirmation",
            data: [0, 0, 0, 0, patientConfirmationCount],
          },
          { name: "Pre Intimation", data: [0, 0, 0, 0, preIntimationCount] },
        ];

        this.apexGenderDiversityChartDataArray[1].series =
          this.patientByStatusMainSeriesData;
        this.apexGenderDiversityChartDataArray[1].isLoading = false;
      },
      () => {
        this.apexGenderDiversityChartDataArray[1].isLoading = false;
      }
    );
  }

  totalCountryPieChartData: any = {};
  countryGroupLabels = [];
  countryGroupCounts = [];
  countryByGroupCounts = [];
  countryByGroupLabels = [];
  getCountryPieChartData(filter_obj: any) {
    this.totalCountryPieChartData = {};
    this.countryGroupLabels = [];
    this.countryGroupCounts = [];
    this.countryByGroupCounts = [];
    this.countryByGroupLabels = [];

    this.apexGenderDiversityChartDataArray[2].isLoading = true;
    this.apexGenderDiversityChartDataArray[3].isLoading = true;
    this.hospitalService.getCountryPieChartData(filter_obj).subscribe(
      (res: any) => {
        this.totalCountryPieChartData = res?.data;

        this.totalCountryPieChartData?.forEach((item: any) => {
          this.countryGroupLabels.push(item?.name);
          this.countryGroupCounts.push(item?.count);
        });

        this.apexGenderDiversityChartDataArray[2].series =
          this.countryGroupCounts;
        this.apexGenderDiversityChartDataArray[2].labels =
          this.countryGroupLabels;

        this.apexGenderDiversityChartDataArray[3].series[0] = {
          data: [...this.countryGroupCounts],
        };
        this.countryGroupCounts;
        this.apexGenderDiversityChartDataArray[3].xaxis.categories =
          this.countryGroupLabels;

        this.apexGenderDiversityChartDataArray[2].isLoading = false;
        this.apexGenderDiversityChartDataArray[3].isLoading = false;
      },
      () => {
        this.apexGenderDiversityChartDataArray[2].isLoading = false;
        this.apexGenderDiversityChartDataArray[3].isLoading = false;
      }
    );
  }

  journeyFromOpinionFunnelChartData: any = {};
  journeyFromOpinionFunnelChartMainData: any = {};
  getJourneyFromOpinionFunnelChartData(filter_obj: any) {
    this.apexFunnelChartDataArray[0].isLoading = true;
    this.hospitalService
      .getJourneyFromOpinionFunnelChartData(filter_obj)
      .subscribe(
        (res: any) => {
          this.journeyFromOpinionFunnelChartData = res?.data;

          let firstBarValue =
            this.journeyFromOpinionFunnelChartData?.[0]?.count === 0
              ? 0.01
              : this.journeyFromOpinionFunnelChartData?.[0]?.count;
          let secondBarValue =
            this.journeyFromOpinionFunnelChartData?.[1]?.count === 0
              ? 0.01
              : this.journeyFromOpinionFunnelChartData?.[1]?.count;

          let thirdBarValue =
            this.journeyFromOpinionFunnelChartData?.[2]?.count === 0
              ? 0.01
              : this.journeyFromOpinionFunnelChartData?.[2]?.count;

          this.journeyFromOpinionFunnelChartMainData = [
            firstBarValue,
            secondBarValue,
            thirdBarValue,
          ];

          this.apexFunnelChartDataArray[0].series = [
            {
              name: "Journey From Opinion",
              data: [...this.journeyFromOpinionFunnelChartMainData],
            },
          ];

          this.apexFunnelChartDataArray[0].isLoading = false;
        },
        () => {
          this.apexFunnelChartDataArray[0].isLoading = false;
        }
      );
  }

  journeyFromVilFunnelChartData: any = {};
  journeyFromVilFunnelChartMainData: any = {};
  getJourneyFromVilFunnelChartData(filter_obj: any) {
    this.apexFunnelChartDataArray[1].isLoading = true;
    this.hospitalService
      .getJourneyFromVilFunnelChartData(filter_obj)
      .subscribe(
        (res: any) => {
          this.journeyFromVilFunnelChartData = res?.data;

          let firstBarValue =
            this.journeyFromVilFunnelChartData?.[0]?.count === 0
              ? 0.01
              : this.journeyFromVilFunnelChartData?.[0]?.count;
          let secondBarValue =
            this.journeyFromVilFunnelChartData?.[1]?.count === 0
              ? 0.01
              : this.journeyFromVilFunnelChartData?.[1]?.count;

          this.journeyFromVilFunnelChartMainData = [
            firstBarValue,
            secondBarValue,
          ];

          this.apexFunnelChartDataArray[1].series = [
            {
              name: "Journey From Vil",
              data: [...this.journeyFromVilFunnelChartMainData],
            },
          ];

          this.apexFunnelChartDataArray[1].isLoading = false;
        },
        () => {
          this.apexFunnelChartDataArray[1].isLoading = false;
        }
      );
  }

  directConfirmationFunnelChartData: any = {};
  directConfirmationFunnelChartMainData: any = {};
  getDirectConfiramtionFunnelChartData(filter_obj: any) {
    this.apexFunnelChartDataArray[2].isLoading = true;
    this.hospitalService
      .getDirectConfiramtionFunnelChartData(filter_obj)
      .subscribe(
        (res: any) => {
          this.directConfirmationFunnelChartData = res?.data;

          let firstBarValue =
            this.directConfirmationFunnelChartData?.[0]?.count === 0
              ? 0.01
              : this.directConfirmationFunnelChartData?.[0]?.count;

          this.directConfirmationFunnelChartMainData = [firstBarValue];

          this.apexFunnelChartDataArray[2].series = [
            {
              name: "Direct Confirmation",
              data: [...this.directConfirmationFunnelChartMainData],
            },
          ];

          this.apexFunnelChartDataArray[2].isLoading = false;
        },
        () => {
          this.apexFunnelChartDataArray[2].isLoading = false;
        }
      );
  }

  journeyFromOpinionToConfirmationFunnelChartData: any = {};
  journeyFromOpinionToConfirmationFunnelChartMainData: any = {};
  getJourneyFromOpinionToConfirmationFunnelChartData(filter_obj: any) {
    // this.apexFunnelChartDataArray[3].isLoading = true;
    // this.hospitalService
    //   .getJourneyFromOpinionToConfirmationFunnelChartData(filter_obj)
    //   .subscribe(
    //     (res: any) => {
    //       this.journeyFromOpinionToConfirmationFunnelChartData = res?.data;

    //       let firstBarValue =
    //         this.journeyFromOpinionToConfirmationFunnelChartData?.[0]?.count ===
    //           0
    //           ? 0.01
    //           : this.journeyFromOpinionToConfirmationFunnelChartData?.[0]
    //             ?.count;
    //       let secondBarValue =
    //         this.journeyFromOpinionToConfirmationFunnelChartData?.[1]?.count ===
    //           0
    //           ? 0.01
    //           : this.journeyFromOpinionToConfirmationFunnelChartData?.[1]
    //             ?.count;

    //       this.journeyFromOpinionToConfirmationFunnelChartMainData = [
    //         firstBarValue,
    //         secondBarValue,
    //       ];

    //       this.apexFunnelChartDataArray[3].series = [
    //         {
    //           name: "Journey From Opinion To Vil",
    //           data: [
    //             ...this.journeyFromOpinionToConfirmationFunnelChartMainData,
    //           ],
    //         },
    //       ];

    //       this.apexFunnelChartDataArray[3].isLoading = false;
    //     },
    //     () => {
    //       this.apexFunnelChartDataArray[3].isLoading = false;
    //     }
    //   );
  }

  departmentAndTreatmentTreemapChartData: any = {};
  departmentAndTreatmentTreemapChartMainData: any = {};

  treatmentDataAccordingToDepartment: any = {};
  mapTreatmentGraphArray: any = [];

  getDepartmentAndTreatmentTreeMapChartData(filter_obj: any) {
    this.apexDepartmentTreeChartDataArray[0].isLoading = true;
    this.hospitalService
      .getDepartmentAndTreatmentTreeMapChartData(filter_obj)
      .subscribe(
        (res: any) => {
          this.departmentAndTreatmentTreemapChartData = res?.data;

          let originalMainArray = [];

          this.departmentAndTreatmentTreemapChartData?.forEach((daT: any) => {
            let obj = {
              x: daT?.name || "",
              y: daT?.count || 0,
            };

            this.treatmentDataAccordingToDepartment[daT?.name] = daT?.treatment;
            originalMainArray.push(obj);
          });

          this.departmentAndTreatmentTreemapChartMainData = originalMainArray;

          this.apexDepartmentTreeChartDataArray[0].series = [
            {
              data: this.departmentAndTreatmentTreemapChartMainData,
            },
          ];

          this.apexDepartmentTreeChartDataArray[0].isLoading = false;
        },
        () => {
          this.apexDepartmentTreeChartDataArray[0].isLoading = false;
        }
      );
  }

  overAllVilTatMultiLineChartData: any = {};
  getOverAllVilTatMultiLineChartData(filter_obj: any) {
    this.apexTatAreaChartDataArray[0].isLoading = true;
    this.hospitalService
      .getOverAllVilTatMultiLineChartData(filter_obj)
      .subscribe(
        (res: any) => {
          this.overAllVilTatMultiLineChartData = res?.data;
          const { avgTatArray, labels } = this.overAllVilTatMultiLineChartData;

          let newArray = avgTatArray?.map((data: any[]) => {
            return data?.map((value: any) => {
              const [hrStr, minStr] = value.split(".");
              const hr = parseInt(hrStr, 10);
              const min = parseInt(minStr || "0", 10);
              let newValue = hr + min / 60;

              return Number(newValue?.toFixed(2));
            });
          });

          let data = [
            {
              name: "Req. Recd. To Req. Assign",
              data: [...newArray[0]],
            },
            {
              name: "Req. Assign to Recd.",
              data: [...newArray[1]],
            },
            {
              name: "Recd. To Added",
              data: [...newArray[2]],
            },
            {
              name: "Added to Sent",
              data: [...newArray[3]],
            },
            {
              name: "Req. Recd. To Sent",
              data: [...newArray[4]],
            },
          ];

          this.apexTatAreaChartDataArray[0].series = [...data];
          this.apexTatAreaChartDataArray[0].xaxis.categories = [...labels];
          this.apexTatAreaChartDataArray[0].isLoading = false;
        },
        () => {
          this.apexTatAreaChartDataArray[0].isLoading = false;
        }
      );
  }

  overAllOpinionTatMultiLineChartData: any = {};
  getOverAllOpinionTatMultiLineChartData(filter_obj: any) {
    this.apexTatAreaChartDataArray[1].isLoading = true;
    this.hospitalService
      .getOverAllOpinionTatMultiLineChartData(filter_obj)
      .subscribe(
        (res: any) => {
          this.overAllOpinionTatMultiLineChartData = res?.data;
          const { avgTatArray, labels } =
            this.overAllOpinionTatMultiLineChartData;

          let newArray = avgTatArray?.map((data: any[]) => {
            return data?.map((value: any) => {
              const [hrStr, minStr] = value.split(".");
              const hr = parseInt(hrStr, 10);
              const min = parseInt(minStr || "0", 10);
              let newValue = hr + min / 60;

              return Number(newValue?.toFixed(2));
            });
          });

          let data = [
            {
              name: "Req. Recd. To Req. Assign",
              data: [...newArray[0]],
            },
            {
              name: "Req. Assign to Recd.",
              data: [...newArray[1]],
            },
            {
              name: "Recd. To Added",
              data: [...newArray[2]],
            },
            {
              name: "Added to Sent",
              data: [...newArray[3]],
            },
            {
              name: "Req. Recd. To Sent",
              data: [...newArray[4]],
            },
          ];

          this.apexTatAreaChartDataArray[1].series = [...data];
          this.apexTatAreaChartDataArray[1].xaxis.categories = [...labels];

          this.apexTatAreaChartDataArray[1].isLoading = false;
        },
        () => {
          this.apexTatAreaChartDataArray[1].isLoading = false;
        }
      );
  }

  countryColorObj = convertKeysToLowercase();
  countryCodeList = countryCodeList;
  countryMapData: any = {};
  isMapLoading = false;
  getCountryMapData(filter_obj: any) {
    // this.isMapLoading = true;
    // this.hospitalService.getCountryMapData(filter_obj).subscribe(
    //   (res: any) => {
    //     this.countryMapData = res?.data?.finalCountryMapObj;
    //     let finalMapArray: any = [];
    //     Object.keys(this.countryMapData).forEach((country) => {
    //       let countryInLowerCase = country?.toLowerCase();
    //       let countryCode = this.countryCodeList[countryInLowerCase];
    //       let countryClrObj = this.countryColorObj[countryInLowerCase];

    //       let newObj = {
    //         id: countryCode,
    //         name: country,
    //         queries: this.countryMapData[country]?.totalQuery,
    //         opinion: this.countryMapData[country]?.totalOpinion,
    //         vil: this.countryMapData[country]?.totalVil,
    //         confiramtion: this.countryMapData[country]?.totalConfirmation,
    //         backgroundColor: countryClrObj?.backgroundColor,
    //         textColor: countryClrObj?.textColor,
    //         fill: am4core.color(countryClrObj.backgroundColor),
    //       };

    //       finalMapArray.push(newObj);
    //     });

    //     this.createChartForMap(finalMapArray);
    //     this.isMapLoading = false;
    //   },
    //   () => {
    //     this.createChartForMap([]);
    //     this.isMapLoading = false;
    //   }
    // );
  }

  @ViewChild("pdfContent", { static: false }) pdfContent!: ElementRef;
  downloadCardDataCSV() {
    const dialogRef = this.dialog.open(DashboardRevampDownloadModalComponent, {
      minWidth: "50%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Download Type";

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
        let downloadType = result?.downloadType;
        if (downloadType === "Download Top Cards Summary CSV") {
          this.downloadTopCardsSummaryCSV();
        }
        if (downloadType === "Download Complete PDF") {
          this.sharedService.startLoader();
          this.downloadCompletePDF();
        }
      }
    });
  }

  downloadTopCardsSummaryCSV() {
    const data = this.cardsData;
    const dataHeader = ["S.No", "Name", "Description", "Value"];

    const csvRows = [];
    csvRows.push(dataHeader.join(","));

    data.forEach((row, index) => {
      const rowData = [
        index + 1,
        `"${row.name}"`,
        `"${row.desc}"`,
        `"${row.value}"`,
      ];
      csvRows.push(rowData.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "data.csv");
    a.click();
  }

  downloadCompletePDF() {
    // download full page
    const element = this.pdfContent.nativeElement;

    html2canvas(element, { useCORS: true, scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("download.pdf");
      this.sharedService.stopLoader();
    });
  }

  isAllSelectedFilterDataLoading = false;
  allSelectedFilterData: any = [];
  getAllSelectedFilter() {
    this.isAllSelectedFilterDataLoading = true;
    this.hospitalService.getAllSelectedFilter().subscribe(
      (res: any) => {
        this.allSelectedFilterData = res?.data?.filters;
        this.changeDefaultFilterFromSelectedData(this.allSelectedFilterData);
        this.isAllSelectedFilterDataLoading = false;
      },
      (err) => {
        this.isAllSelectedFilterDataLoading = false;
      }
    );
  }

  get dateRangeObj() {
    let formObj = this.filterSelectionForm.get("dateRange") as FormGroup;
    return formObj;
  }

  isFilterSelected() {
    let filterSelected: boolean;
    if (
      this.cardHiddenArray?.length ||
      (this.allSelectedFilterData?.dateRange?.startDate &&
        this.allSelectedFilterData?.dateRange?.endDate) ||
      this.allSelectedFilterData?.ageTo ||
      this.allSelectedFilterData?.ageFrom ||
      this.allSelectedFilterData?.ageDuration ||
      this.allSelectedFilterData?.month?.length ||
      this.allSelectedFilterData?.year?.length ||
      this.allSelectedFilterData?.gender?.length ||
      this.allSelectedFilterData?.quater?.length ||
      this.allSelectedFilterData?.hospital?.length ||
      this.allSelectedFilterData?.country?.length ||
      this.allSelectedFilterData?.user?.length ||
      this.allSelectedFilterData?.treatment?.length ||
      this.allSelectedFilterData?.referralPartner?.length ||
      this.allSelectedFilterData?.doctor?.length
    ) {
      filterSelected = true;
    } else {
      filterSelected = false;
    }
    return filterSelected;
  }

  onRangeSubmit(picker: any) {
    this.selectedMonthArray = [];
    this.selectedYearArray = [];
    this.selectedQuaterArray = [];

    picker.close();
  }

  onRangeClear(picker: any) {
    this.resetDateRange();
    picker.close();
  }

  resetDateRange() {
    let newObj = {
      startDate: null,
      endDate: null,
    };
    this.filterSelectionForm.patchValue({
      dateRange: newObj,
    });
  }

  clearAgeFilter() {
    this.filterSelectionForm.patchValue({
      ageDuration: "",
    });
  }

  changeDefaultFilterFromSelectedData(data: any) {
    if (data?.hiddenCards?.length) {
      this.cardHiddenArray = data?.hiddenCards;
    }

    if (data?.dateRange?.startDate && data?.dateRange?.endDate) {
      let dateRangeGroup = this.dateRangeObj;
      dateRangeGroup.patchValue({
        startDate: data?.dateRange?.startDate,
        endDate: data?.dateRange?.endDate,
      });
    } else {
      if (
        !data?.year?.length &&
        !data?.month?.length &&
        !data?.quater?.length
      ) {
        this.setInitialDateRange();
      }
    }

    if (data?.ageTo && data?.ageFrom && data?.ageDuration) {
      this.filterSelectionForm.patchValue({
        ageTo: data?.ageTo,
        ageFrom: data?.ageFrom,
        ageDuration: data?.ageDuration,
      });
      if (data?.ageFrom) {
        this.filterSelectionForm?.get("ageTo").enable();
      }
    }

    if (data?.month?.length) {
      this.selectedMonthArray = data?.month;
    }
    if (data?.year?.length) {
      this.selectedYearArray = data?.year;
    }
    // if (data?.updated?.length) {
    //   this.selectedUpdatedArray = data?.updated;
    // }
    if (data?.gender?.length) {
      this.selectedGenderArray = data?.gender;
    }
    if (data?.quater?.length) {
      this.selectedQuaterArray = data?.quater;
    }

    if (data?.hospital?.length) {
      this.selectedHospitalSearch = data?.hospital;
      this.filterSelectionForm.patchValue({
        hospital: this.selectedHospitalSearch,
      });
    }
    if (data?.country?.length) {
      this.selectedCountrySearch = data?.country;
      this.filterSelectionForm.patchValue({
        country: this.selectedCountrySearch,
      });
    }
    if (data?.user?.length) {
      this.selectedUserSearch = data?.user;
      this.filterSelectionForm.patchValue({
        user: this.selectedUserSearch,
      });
    }
    if (data?.treatment?.length) {
      this.selectedTreatmentSearch = data?.treatment;
      this.filterSelectionForm.patchValue({
        treatment: this.selectedTreatmentSearch,
      });
    }
    if (data?.referralPartner?.length) {
      this.selectedReferralPartnerSearch = data?.referralPartner;
      this.filterSelectionForm.patchValue({
        referralPartner: data?.referralPartner,
      });
    }
    if (data?.doctor?.length) {
      this.selectedDoctorSearch = data?.doctor;
      this.filterSelectionForm.patchValue({
        doctor: data?.doctor,
      });
    }

    let range = this.filterSelectionForm?.getRawValue()?.dateRange;
    let ageTo = this.filterSelectionForm?.getRawValue()?.ageTo;
    let ageFrom = this.filterSelectionForm?.getRawValue()?.ageFrom;
    let ageDuration = this.filterSelectionForm?.getRawValue()?.ageDuration;

    let filter_obj = {};

    if (this.selectedMonthArray?.length) {
      filter_obj["month"] = this.selectedMonthArray;
    }
    if (range?.startDate && range?.endDate) {
      filter_obj["dateRange"] = range;
    }
    if (this.selectedGenderArray?.length) {
      filter_obj["gender"] = this.selectedGenderArray;
    }
    if (this.selectedQuaterArray?.length) {
      filter_obj["quater"] = this.selectedQuaterArray;
    }
    if (this.selectedYearArray?.length) {
      filter_obj["year"] = this.selectedYearArray;
    }

    if (this.selectedCountrySearch?.length) {
      filter_obj["country"] = this.selectedCountrySearch;
    }
    if (this.selectedTreatmentSearch?.length) {
      filter_obj["treatment"] = this.selectedTreatmentSearch;
    }
    if (this.selectedReferralPartnerSearch?.length) {
      filter_obj["referralPartner"] = this.selectedReferralPartnerSearch;
    }
    if (this.selectedUserSearch?.length) {
      filter_obj["users"] = this.selectedUserSearch;
    }
    if (this.selectedHospitalSearch?.length) {
      filter_obj["hospitals"] = this.selectedHospitalSearch;
    }
    if (this.selectedDoctorSearch?.length) {
      filter_obj["doctor"] = this.selectedDoctorSearch;
    }
    if (ageTo && ageFrom && ageDuration) {
      filter_obj["ageTo"] = ageTo;
      filter_obj["ageFrom"] = ageFrom;
      filter_obj["ageDuration"] = ageDuration;
    }

    if (this.cardHiddenArray?.length) {
      let modifiedData = modifyCardsData(this.cardsData, this.cardHiddenArray);
      this.cardsData = modifiedData;
      this.topCardsApiCallFunction(filter_obj);
    } else {
      this.topCardsApiCallFunction(filter_obj);
    }
    this.chartApiCalls(filter_obj);
  }

  chartApiCalls(filter_obj: any) {
    this.getQueryBarChartData(filter_obj);
    this.getOpinionBarChartData(filter_obj);
    this.getVilBarChartData(filter_obj);
    this.getConfirmationBarChartData(filter_obj);
    this.getTotalMultiLineChartData(filter_obj);
    this.getGenderDiversityPieChartData(filter_obj);
    this.getCountryPieChartData(filter_obj);
    this.getPatientByStatusBarChart(filter_obj);
    this.getJourneyFromOpinionFunnelChartData(filter_obj);
    this.getJourneyFromVilFunnelChartData(filter_obj);
    this.getDirectConfiramtionFunnelChartData(filter_obj);
    this.getJourneyFromOpinionToConfirmationFunnelChartData(filter_obj);
    this.getDepartmentAndTreatmentTreeMapChartData(filter_obj);
    this.getOverAllVilTatMultiLineChartData(filter_obj);
    this.getOverAllOpinionTatMultiLineChartData(filter_obj);
    this.getCountryMapData(filter_obj);
  }

  topCardsApiCallFunction(filter_obj: any) {
    this.getQueryCountForTopCards(filter_obj);
    this.getOpinionCountForTopCards(filter_obj);
    this.getVilCountForTopCards(filter_obj);
    this.getConfirmationCountForTopCards(filter_obj);
    this.getPendingQueryCountForTopCards(filter_obj);
    this.getOpenFollowUpCountForTopCards(filter_obj);
    this.getUpcommingArrivalCountForTopCards(filter_obj);
    this.getOnGroundCountForTopCards(filter_obj);
    this.getOpinionToVilCountForTopCards(filter_obj);
    this.getVilToConfirmationCountForTopCards(filter_obj);
    this.getOpinionToConfirmationCountForTopCards(filter_obj);
    this.getVilTatCountForTopCards(filter_obj);
    this.getOpinionAssignedTatCountForTopCards(filter_obj);
    this.getOpinionRecdTatCountForTopCards(filter_obj);
    this.getOpinionSentTatCountForTopCards(filter_obj);
    this.getOverAllOpinionTatCountForTopCards(filter_obj);
  }

  filterSelectionForm: FormGroup;

  buildForm() {
    this.filterSelectionForm = this.fb.group({
      country: [],
      treatment: [],
      hospital: [],
      doctor: [],
      user: [],
      referralPartner: [],
      ageTo: [
        {
          disabled: true,
          value: "",
        },
      ],
      ageFrom: [""],
      ageDuration: [],
      dateRange: this.fb.group({
        startDate: [""],
        endDate: [""],
      }),
    });
  }

  onClickFilterVisibilityIcon(value: boolean) {
    this.isSidebarShrunk = value;
  }

  cardArray: any = cardsDataArray;
  cardsData: any[];
  setCardsData() {
    this.cardsData = this.cardArray;

    this.getAllSelectedFilter();
  }

  cardHiddenArray: any = [];
  onClickCardHide(index: any) {
    let data = this.cardsData[index];

    let obj = data;
    this.cardHiddenArray.push(obj);
    if (index !== -1) {
      this.cardsData.splice(index, 1);
    }

    this.onClickFilterSubmit();
  }

  openFiltersModal() {
    const dialogRef = this.dialog.open(DashboardRevampFilterModalComponent, {
      minWidth: "60%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Selected Filter";
    dialogRef.componentInstance.appliedFilters = {
      hiddenCards: this.cardHiddenArray,
      // selectedUpdatedArray: this.selectedUpdatedArray,
      selectedYearArray: this.selectedYearArray,
      selectedMonthArray: this.selectedMonthArray,
      selectedQuaterArray: this.selectedQuaterArray,
      selectedGenderArray: this.selectedGenderArray,
      ...this.filterSelectionForm?.getRawValue(),
    };

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall === true) {
        this.cardHiddenArray = result?.data?.hiddenCards;
        this.cardsData = this.cardArray;
        this.onClickFilterSubmit();
      }
    });
  }

  onClickFilterSubmit() {
    let data = {
      hiddenCards: this.cardHiddenArray,
      // hiddenCharts: this.cardHiddenArray,
      // updated: this.selectedUpdatedArray,
      year: this.selectedYearArray,
      month: this.selectedMonthArray,
      quater: this.selectedQuaterArray,
      gender: this.selectedGenderArray,
      ...this.filterSelectionForm?.getRawValue(),
    };

    this.addSelectedDashboardFilter(data);
  }

  onTypeAgeFromValue() {
    const ageFromValue = this.filterSelectionForm.get("ageFrom")?.value;
    const ageToControl = this.filterSelectionForm.get("ageTo");

    if (ageFromValue) {
      ageToControl?.enable();
    } else {
      ageToControl?.disable();
      this.filterSelectionForm.patchValue({
        ageTo: "",
      });
    }
  }

  addSelectedDashboardFilter(data: any) {
    let yearLength = data?.year?.length

    switch (yearLength) {
      case 1:
        // No limit set for 1 year
        break;

      case 2:
        if (data?.month?.length > 6) {
          this.sharedService.showNotification(
            "snackBar-danger",
            "You can select only 6 months with 2 years"
          );
          return;
        }
        if (data?.quater?.length > 3) {
          this.sharedService.showNotification(
            "snackBar-danger",
            "You can select only 3 quarters with 2 years"
          );
          return;
        }
        break;

      case 3:
        if (data?.month?.length > 4) {
          this.sharedService.showNotification(
            "snackBar-danger",
            "You can select only 4 months with 3 years"
          );
          return;
        }
        if (data?.quater?.length > 2) {
          this.sharedService.showNotification(
            "snackBar-danger",
            "You can select only 2 quarters with 3 years"
          );
          return;
        }
        break;

      case 4:
        if (data?.month?.length > 3) {
          this.sharedService.showNotification(
            "snackBar-danger",
            "You can select only 3 months with 4 years"
          );
          return;
        }
        if (data?.quater?.length > 1) {
          this.sharedService.showNotification(
            "snackBar-danger",
            "You can select only 1 quarter with 4 years"
          );
          return;
        }
        break;

      default:
        break;
    }
    this.hospitalService
      .addSelectedDashboardFilter(data)
      .subscribe((res: any) => {
        // console.log(res);
        this.allSelectedFilterData = [];
        this.getAllSelectedFilter();
      });
  }

  // selectedUpdatedArray: any = ["lastUpdated"];
  selectedYearArray: any = [];
  selectedMonthArray: any = [];
  selectedQuaterArray: any = [];
  selectedGenderArray: any = [];
  onClickBtnFilter(data: any, type: any) {
    // month logic start
    if (type === "month") {
      this.resetDateRange();
      if (this.selectedQuaterArray?.length) {
        this.selectedQuaterArray = [];
      }

      let findSelectedIndex = this.selectedMonthArray?.findIndex(
        (sMA: any) => sMA === data?.value
      );

      const yearCount = this.selectedYearArray?.length;

      if (yearCount < 1) {
        this.sharedService.showNotification(
          "snackBar-danger",
          "You have to select at least one year with month"
        );
        this.selectedMonthArray = []
        return;
      }

      let maxMonths = 0;
      switch (yearCount) {
        case 1:
          maxMonths = 12;
          break;
        case 2:
          maxMonths = 6;
          break;
        case 3:
          maxMonths = 4;
          break;
        case 4:
          maxMonths = 3;
          break;
        default:
          break;
      }

      if (findSelectedIndex !== -1) {
        this.selectedMonthArray?.splice(findSelectedIndex, 1);
      } else {
        this.selectedMonthArray.push(data?.value);
        if (maxMonths < this.selectedMonthArray?.length) {
          this.selectedMonthArray?.splice(0, 1);
        }
      }

    }
    // month logic end
    // year logic start
    if (type === "year") {
      this.resetDateRange();
      let findSelectedIndex = this.selectedYearArray?.findIndex(
        (sYA: any) => sYA === data?.value
      );

      if (findSelectedIndex !== -1) {
        this.selectedYearArray?.splice(findSelectedIndex, 1);
      } else {
        this.selectedYearArray.push(data?.value);
      }

      if (!this.selectedYearArray?.length) {
        this.selectedQuaterArray = []
        this.selectedMonthArray = []
      }
    }
    // year logic end
    // quater logic start
    if (type === "quater") {
      this.resetDateRange();
      if (this.selectedMonthArray?.length) {
        this.selectedMonthArray = [];
      }

      let findSelectedIndex = this.selectedQuaterArray?.findIndex(
        (sQA: any) => sQA === data?.value
      );

      const yearCount = this.selectedYearArray?.length;

      if (yearCount < 1) {
        this.sharedService.showNotification(
          "snackBar-danger",
          "You have to select at least one year with quater"
        );
        this.selectedQuaterArray = []
        return;
      }

      let maxQuarters = 0;
      switch (yearCount) {
        case 1:
          maxQuarters = 4;
          break;
        case 2:
          maxQuarters = 3;
          break;
        case 3:
          maxQuarters = 2;
          break;
        case 4: ;
          maxQuarters = 1;
          break;
        default:
          break;
      }


      if (findSelectedIndex !== -1) {
        this.selectedQuaterArray?.splice(findSelectedIndex, 1);
      } else {
        this.selectedQuaterArray.push(data?.value);
        if (maxQuarters < this.selectedQuaterArray?.length) {
          this.selectedQuaterArray?.splice(0, 1);
        }
      }
    }
    // quater logic end

    if (type === "gender") {
      let findSelectedIndex = this.selectedGenderArray?.findIndex(
        (sQA: any) => sQA === data?.value
      );

      if (findSelectedIndex !== -1) {
        this.selectedGenderArray?.splice(findSelectedIndex, 1);
      } else {
        this.selectedGenderArray.push(data?.value);
      }
    }

    // if (type === "uad") {
    //   this.selectedUpdatedArray = [data?.value];
    // }
  }

  updatedDataArray = [
    { name: "Last Updated", value: "lastUpdated" },
    { name: "Query Added", value: "queryAdded" },
  ];

  years = [];
  quarters = QuaterArray;
  months = MonthArray;
  genderData = GenderArray;

  ageDurationData = ["day", "month", "year"];

  // apex charts

  apexBarChartDataArray: any = [
    {
      isLoading: false,
      title: {
        text: "Queries",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      series: [
        {
          name: "Queries",
          data: [],
        },
      ],
      chart: {
        height: 240,
        width: "100%",
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      colors: [
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
        "rgb(21, 96, 189)",
      ],
      plotOptions: {
        bar: {
          columnWidth: "70%",
          distributed: true,
          dataLabels: {
            position: "center",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toString(),
        // offsetY: -20,
        position: 'center',
        style: {
          fontSize: "12px",
          colors: ["white"],
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "12px",
            colors: "#333",
          },
        },
      },
    },
    // -------
    {
      isLoading: false,
      title: {
        text: "Opinion",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(218, 1, 45)",
        },
      },
      series: [
        {
          name: "Opinion",
          data: [],
        },
      ],
      chart: {
        height: 240,
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      colors: [
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
        "rgb(218, 1, 45)",
      ],
      plotOptions: {
        bar: {
          columnWidth: "70%",
          distributed: true,
          dataLabels: {
            position: "center",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toString(),
        // offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["white"],
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        categories: [...monthConstant],
        labels: {
          style: {
            colors: "#333",
            fontSize: "12px",
          },
        },
      },
    },
    // -------
    {
      isLoading: false,
      title: {
        text: "VIL",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(255, 191, 0)",
        },
      },
      series: [
        {
          name: "VIL",
          data: [],
        },
      ],
      chart: {
        height: 240,
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      colors: [
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
        "rgb(255, 191, 0)",
      ],
      plotOptions: {
        bar: {
          columnWidth: "70%",
          distributed: true,
          dataLabels: {
            position: "center",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toString(),
        // offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["white"],
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        categories: [...monthConstant],
        labels: {
          style: {
            colors: "#333",
            fontSize: "12px",
          },
        },
      },
    },
    // -----------
    {
      isLoading: false,
      title: {
        text: "Confirmation's",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(67, 153, 70)",
        },
      },
      series: [
        {
          name: "Confirmation",
          data: [],
        },
      ],
      chart: {
        height: 240,
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      colors: [
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
        "rgb(67, 153, 70)",
      ],
      plotOptions: {
        bar: {
          columnWidth: "70%",
          distributed: true,
          dataLabels: {
            position: "center",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toString(),
        // offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["white"],
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        categories: [...monthConstant],
        labels: {
          style: {
            colors: "#333",
            fontSize: "12px",
          },
        },
      },
    },
  ];

  // gender logic start

  backToOrginal(type: string) {
    if (type === "genderPie") {
      this.backToOrginalGenderData();
    }
    if (type === "countryPie") {
      this.backToOrginalCountryData();
    }
  }

  genderLabelByCategory = genderLabelByCategory;

  updateChart(title: string) {
    this.apexGenderDiversityChartDataArray[0].labels = [
      "0 to 5",
      "6 to 11",
      "12 to 17",
      "18 to 29",
      "30 to 44",
      "45 to 59",
      "60 to 74",
      "75 above",
    ];

    if (title === "Male") {
      this.apexGenderDiversityChartDataArray[0].series = [
        ...this.maleCategoryData,
      ];
    }

    if (title === "Female") {
      this.apexGenderDiversityChartDataArray[0].series = [
        ...this.femaleCategoryData,
      ];
    }

    if (title === "Other") {
      this.apexGenderDiversityChartDataArray[0].series = [
        ...this.otherCategoryData,
      ];
    }

    this.apexGenderDiversityChartDataArray[0].title.text = title;

    this.apexGenderDiversityChartDataArray[0].isShowBackButton = true;
    this.apexGenderDiversityChartDataArray[1].isShowBackButton = true;
  }

  maleCategoryData: any = [];
  femaleCategoryData: any = [];
  otherCategoryData: any = [];
  backToOrginalGenderData() {
    this.apexGenderDiversityChartDataArray[0].series = [...this.mainGenderData];
    this.apexGenderDiversityChartDataArray[0].labels = [
      ...["Male", "Female", "Other"],
    ];

    this.apexGenderDiversityChartDataArray[0].title.text = "Gender Diversity";
    this.apexGenderDiversityChartDataArray[0].isShowBackButton = false;
    this.apexGenderDiversityChartDataArray[1].isShowBackButton = false;
  }

  // gender logic end

  // country logic start
  backToOrginalCountryData() {
    this.apexGenderDiversityChartDataArray[2].series = [
      ...this.countryGroupCounts,
    ];
    this.apexGenderDiversityChartDataArray[2].labels = [
      ...this.countryGroupLabels,
    ];

    this.apexGenderDiversityChartDataArray[3].series = [
      {
        data: [...this.countryGroupCounts],
      },
    ];

    this.apexGenderDiversityChartDataArray[3].xaxis = {
      categories: [...this.countryGroupLabels],
    };
    this.apexGenderDiversityChartDataArray[3].title.text = "Top 5 Region";

    this.apexGenderDiversityChartDataArray[2].title.text =
      "Patients By Country";
    this.apexGenderDiversityChartDataArray[2].isShowBackButton = false;
    this.apexGenderDiversityChartDataArray[3].isShowBackButton = false;
  }

  // country logic end
  apexGenderDiversityChartDataArray = [
    {
      isLoading: false,
      type: "genderPie",
      isShowBackButton: false,
      colors: [
        "#1E90FF",
        "#FF69B4",
        "#32CD32",
        "#FFA500",
        "#8A2BE2",
        "#32CD32",
        "#FFA500",
        "#8A2BE2",
      ],
      series: [],
      labels: [],
      chart: {
        type: "pie",
        dataLabels: {
          offset: 20, // distance from pie
          minAngleToShowLabel: 10, // hides labels for very small slices
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 0,
          blur: 4,
          opacity: 0.2,
        },
        height: 253,
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const selectedIndex = config.dataPointIndex;
            const selectedLabel = config.w.config.labels[selectedIndex];

            if (selectedLabel === "Male") {
              this.updateChart("Male");
            } else if (selectedLabel === "Female") {
              this.updateChart("Female");
            } else if (selectedLabel === "Other") {
              this.updateChart("Other");
            }
          },
        },
      },
      title: {
        text: "Gender Diversity",
        align: "left",
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      legend: {
        show: true,
        position: "right",
        labels: {
          colors: "#000",
          useSeriesColors: false,
        },
        fontSize: "10px", // 👈 set font size here
      },
      plotOptions: {
        pie: {
          expandOnClick: true, // required for the expand/lift effect
          // donut: {
          //   labels: {
          //     show: false,
          //   },
          // },
          dataLabels: {
            // offset: 50,
            // minAngleToShowLabel: 20,
            style: {
              textAnchor: "middle",
              fontSize: "11px",
              fontWeight: "normal",
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
        style: {
          colors: ["#fff"],
          fontSize: "12px",
          fontWeight: "normal",
          textAnchor: "middle",
        },
        formatter: function (val, opts) {
          const label = opts.w.globals.labels[opts.seriesIndex];
          const value = opts.w.config.series[opts.seriesIndex];
          return `${label}`;
        },
        dropShadow: {
          enable: false,
        },
      },
      stroke: {
        show: false,
      },
      // responsive: [
      //   {
      //     breakpoint: 480,
      //     options: {
      //       chart: { width: 200 },
      //       legend: { position: "bottom" }
      //     }
      //   }
      // ]
    },
    {
      isLoading: false,
      isShowBackButton: false,
      type: "genderPie",
      title: {
        text: "Patients By Status",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      series: [],
      chart: {
        type: "bar",
        height: 240,
        stacked: true,
        // stackType: "100%"
      },
      plotOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
      },
      xaxis: {
        labels: {
          rotate: 0,
          style: {
            fontSize: "10px",
          },
        },
        categories: [
          "Opinion",
          "OPD",
          "Proforma Invoice",
          "VIL",
          ["Confirmation/", "Pre Intimation"],
        ],
      },
      colors: [
        // "rgb(218, 1, 45)",
        "rgb(67, 153, 70)",
        "rgb(255, 191, 0)",
        "rgb(21, 96, 189)",

        // "rgb(218, 1, 45)",
        "rgb(67, 153, 70)",
        "rgb(21, 96, 189)",
        // "rgb(255, 191, 0)",

        // "rgb(218, 1, 45)",
        "rgb(67, 153, 70)",
        "rgb(21, 96, 189)",
        // "rgb(255, 191, 0)",

        // "rgb(218, 1, 45)",
        "rgb(67, 153, 70)",
        "rgb(21, 96, 189)",
        // "rgb(255, 191, 0)",

        // "rgb(218, 1, 45)",
        "rgb(67, 153, 70)",
        "rgb(21, 96, 189)",
        // "rgb(255, 191, 0)",
      ],
      fill: {
        opacity: 1,
      },
      legend: {
        show: false,
      },
    },
    // country charts data
    {
      isLoading: false,
      type: "countryPie",
      isShowBackButton: false,
      colors: ["#1E90FF", "#FF69B4", "#32CD32", "#FFA500", "#8A2BE2"],
      series: [],
      labels: [],
      chart: {
        type: "pie",
        height: 253,
        dataLabels: {
          offset: 50,
          minAngleToShowLabel: 10,
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 0,
          blur: 4,
          opacity: 0.2,
        },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            if (!this.apexGenderDiversityChartDataArray[2].isShowBackButton) {
              const selectedIndex = config.dataPointIndex;
              const selectedLabel = config.w.config.labels[selectedIndex];

              this.apexGenderDiversityChartDataArray[2].title.text =
                selectedLabel;
              let item = this.totalCountryPieChartData?.find(
                (e: any) => e?.name === selectedLabel
              );
              this.countryByGroupCounts = [];
              this.countryByGroupLabels = [];
              item?.country?.forEach((c: any) => {
                this.countryByGroupCounts.push(c?.count);
                this.countryByGroupLabels.push(c?.name);
              });

              this.apexGenderDiversityChartDataArray[2].series =
                this.countryByGroupCounts;
              this.apexGenderDiversityChartDataArray[2].labels =
                this.countryByGroupLabels;

              this.apexGenderDiversityChartDataArray[3].series = [
                {
                  data: [...this.countryByGroupCounts],
                },
              ];

              this.apexGenderDiversityChartDataArray[3].xaxis = {
                categories: [...this.countryByGroupLabels],
              };

              this.apexGenderDiversityChartDataArray[3].title.text =
                selectedLabel;

              this.apexGenderDiversityChartDataArray[2].isShowBackButton = true;
              this.apexGenderDiversityChartDataArray[3].isShowBackButton = true;
            }
          },
        },
      },
      title: {
        text: "Patients By Country",
        align: "left",
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      legend: {
        show: true,
        position: "right",
        labels: {
          colors: "#000",
          useSeriesColors: false,
        },
        fontSize: "9px",
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
          dataLabels: {
            // offset: 30,
            minAngleToShowLabel: 0,
            style: {
              textAnchor: "middle",
              fontSize: "9px",
              fontWeight: "normal",
              colors: ["#fff"],
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
        style: {
          colors: ["#fff"],
          fontSize: "10px",
          fontWeight: "normal",
          textAnchor: "middle",
        },
        formatter: function (val, opts) {
          const label = opts.w.globals.labels[opts.seriesIndex];
          const value = opts.w.config.series[opts.seriesIndex];
          return `${label[0]}`;
        },
        dropShadow: {
          enable: false,
        },
      },
      stroke: {
        show: false,
      },
    },
    {
      isLoading: false,
      isShowBackButton: false,
      type: "countryPie",
      title: {
        text: "Top 5 Regions",
        align: "left",
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      legend: {
        show: false,
      },
      chart: {
        height: 240,
        width: "100%",
        type: "bar",
        events: {
          dataPointSelection: (event, chartContext, config) => {
            if (!this.apexGenderDiversityChartDataArray[2].isShowBackButton) {
              const selectedIndex = config.dataPointIndex;
              const selectedLabel =
                config.w.config.xaxis?.categories?.[selectedIndex] || "";

              this.apexGenderDiversityChartDataArray[2].title.text =
                selectedLabel;

              let item = this.totalCountryPieChartData?.find(
                (e: any) => e?.name === selectedLabel
              );

              this.countryByGroupCounts = [];
              this.countryByGroupLabels = [];
              item?.country?.forEach((c: any) => {
                this.countryByGroupCounts.push(c?.count);
                this.countryByGroupLabels.push(c?.name);
              });

              this.apexGenderDiversityChartDataArray[2].series =
                this.countryByGroupCounts;

              this.apexGenderDiversityChartDataArray[2].labels =
                this.countryByGroupLabels;

              this.apexGenderDiversityChartDataArray[3].series = [
                {
                  data: [...this.countryByGroupCounts],
                },
              ];

              this.apexGenderDiversityChartDataArray[3].xaxis = {
                categories: [...this.countryByGroupLabels],
              };

              this.apexGenderDiversityChartDataArray[3].title.text =
                selectedLabel;

              this.apexGenderDiversityChartDataArray[2].isShowBackButton = true;
              this.apexGenderDiversityChartDataArray[3].isShowBackButton = true;
            }
          },
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      colors: ["#1E90FF", "#FF69B4", "#32CD32", "#FFA500", "#8A2BE2"],
      dataLabels: {
        enabled: false,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["#fff"],
      },
      series: [],
      xaxis: {
        categories: [
          // "Asia",
          // "Africa",
          // "Eroupe",
          // "North America",
          // "South America",
        ],
      },
    },
  ];

  apexFunnelChartDataArray = [
    {
      isLoading: false,
      series: [],
      chart: {
        type: "bar",
        height: 240,
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          borderRadiusApplication: "around",
          horizontal: true,
          barHeight: "90%",
          isFunnel: true,
          borderRadiusWhenStacked: "last",
          distributed: true,
        },
      },
      colors: ["rgb(21, 96, 189)", "rgb(255, 191, 0)", "rgb(67, 153, 70)"],
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          let value = val === 0.01 ? 0 : val;
          let label = opt.w.globals.labels[opt.dataPointIndex] + ": " + value;
          return label;
        },
        dropShadow: {
          enabled: true,
        },
      },
      title: {
        text: "Journey From Opinion",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      xaxis: {
        categories: [
          ["Opinion", "Pre Intimation", "OPD", "PI"],
          "VIL",
          "Confirmation",
        ],
      },
      legend: {
        show: false,
      },
      // tooltip: {
      //   y: {
      //     formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
      //       return `${value}`; // 👈 shows raw value (e.g., "1")
      //       // Or use: return `${Math.round(value)}`
      //     }
      //   }
      // }
    },
    {
      isLoading: false,
      series: [],
      chart: {
        type: "bar",
        height: 240,
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          borderRadiusApplication: "around",
          horizontal: true,
          barHeight: "80%",
          isFunnel: true,
          borderRadiusWhenStacked: "last",
          distributed: true,
        },
      },
      colors: ["rgb(255, 191, 0)", "rgb(67, 153, 70)"],
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          let value = val === 0.01 ? 0 : val;
          let label = opt.w.globals.labels[opt.dataPointIndex] + ": " + value;
          return label;
        },
        dropShadow: {
          enabled: true,
        },
      },
      title: {
        text: "Journey From VIL",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      xaxis: {
        categories: ["VIL", "Confirmation"],
      },
      legend: {
        show: false,
      },
    },
    {
      isLoading: false,
      series: [],
      chart: {
        type: "bar",
        height: 240,
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          borderRadiusApplication: "around",
          horizontal: true,
          barHeight: "50%",
          isFunnel: true,
          borderRadiusWhenStacked: "last",
          distributed: true,
        },
      },
      colors: ["rgb(67, 153, 70)"],
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          let value = val === 0.01 ? 0 : val;
          let label = opt.w.globals.labels[opt.dataPointIndex] + ": " + value;
          return label;
        },
        dropShadow: {
          enabled: true,
        },
      },
      title: {
        text: "Direct Confirmation",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      xaxis: {
        categories: ["Direct Confirmation"],
      },
      legend: {
        show: false,
      },
    },
    // {
    //   isLoading: false,
    //   series: [],
    //   chart: {
    //     type: "bar",
    //     height: 240,
    //   },
    //   plotOptions: {
    //     bar: {
    //       borderRadius: 5,
    //       borderRadiusApplication: "around",
    //       horizontal: true,
    //       barHeight: "80%",
    //       isFunnel: true,
    //       borderRadiusWhenStacked: "last",
    //       distributed: true,
    //     },
    //   },
    //   colors: ["rgb(21, 96, 189)", "rgb(67, 153, 70)"],
    //   dataLabels: {
    //     enabled: true,
    //     formatter: function (val, opt) {
    //       let value = val === 0.01 ? 0 : val;
    //       let label = opt.w.globals.labels[opt.dataPointIndex] + ": " + value;
    //       return label;
    //     },
    //     dropShadow: {
    //       enabled: true,
    //     },
    //   },
    //   title: {
    //     text: "Journey From Opinion To Confirmation",
    //     align: "left",
    //     margin: 2,
    //     offsetY: 0,
    //     style: {
    //       fontSize: "17px",
    //       fontWeight: "bold",
    //       color: "rgb(21, 96, 189)",
    //     },
    //   },
    //   xaxis: {
    //     categories: [
    //       ["Opinion", "Pre Intimation", "OPD", "PI"],
    //       "Confirmation",
    //     ],
    //   },
    //   legend: {
    //     show: false,
    //   },
    // },
  ];

  apexMultipleLineChartDataArray = [
    {
      isLoading: false,
      title: {
        text: "Total Query/Opinion/VIL/Confirmation",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      fullWidth: true,
      series: [
        {
          name: "Total Confirmations",
          data: [],
        },
        {
          name: "Total VIL",
          data: [],
        },
        {
          name: "Total Opinion",
          data: [],
        },
        {
          name: "Total Query",
          data: [],
        },
      ],
      colors: [
        "rgb(67, 153, 70)",
        "rgb(255, 191, 0)",
        "rgb(218, 1, 45)",
        "rgb(21, 96, 189)",
      ],
      chart: {
        height: 340,
        type: "line",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [5, 7, 5, 6],
        curve: "straight",
        dashArray: [0, 8, 5, 2],
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        labels: {
          trim: false,
        },
        categories: [
          ["Jan"],
          ["Feb"],
          ["Mar"],
          ["Apr"],
          ["May"],
          ["June"],
          ["July"],
          ["Aug"],
          ["Sept"],
          ["Oct"],
          ["Nov"],
          ["Dec"],
        ],
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
        ],
      },
      grid: {
        borderColor: "#64646466",
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
    },
  ];

  // treemap start //
  backToDepartments() {
    this.apexDepartmentTreeChartDataArray[0].series = [
      {
        data: this.departmentAndTreatmentTreemapChartMainData,
      },
    ];

    this.apexDepartmentTreeChartDataArray[0].isShowBackButton = false;
  }

  apexDepartmentTreeChartDataArray = [
    {
      isShowBackButton: false,
      isLoading: false,
      fullWidth: true,
      title: {
        text: "Department & Treatment Treemap",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false, // optional - makes colors solid instead of shaded
        },
      },
      series: [],
      colors: ["#4CAF50", "#2196F3", "#9C27B0", "#FF9800", "#FF5722"],
      chart: {
        height: 260,
        type: "treemap",
        events: {
          dataPointSelection: (event, chartContext, config) => {
            if (!this.apexDepartmentTreeChartDataArray[0].isShowBackButton) {
              const selectedDept =
                config.w.config.series[0].data[config.dataPointIndex].x;

              const treatmentsArray =
                this.treatmentDataAccordingToDepartment[selectedDept];

              let originalMainArray = [];

              treatmentsArray?.forEach((t: any) => {
                let obj = {
                  x: t?.name || "",
                  y: t?.count || 0,
                };

                originalMainArray.push(obj);
              });

              this.apexDepartmentTreeChartDataArray[0].series = [
                {
                  data: originalMainArray,
                },
              ];

              this.apexDepartmentTreeChartDataArray[0].isShowBackButton = true;
            }
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5],
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: "#f1f1f1",
      },
    },
  ];

  // tat areachart start
  apexTatAreaChartDataArray = [
    {
      isLoading: false,
      title: {
        text: "VIL TAT Chart",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      chart: {
        height: 260,
        type: "area",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      colors: ["#4CAF50", "#2196F3", "#9C27B0", "#FF9800", "#FF5722"],
      series: [],

      xaxis: {
        categories: [
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
        ],
      },

      yaxis: {
        labels: {
          formatter: function (value) {
            const [hrStr, minStr] = value.toString().split(".");
            const hr = Math.floor(+hrStr);
            const min = Math.round(parseInt(minStr || 0, 10));
            let newMin = Number(min.toFixed(2));
            return `${hr}:${newMin.toString().padStart(2, "0")} hrs`;
          },
        },
        // title: {
        //   text: "Time",
        // },
      },

      tooltip: {
        y: {
          formatter: function (value) {
            const [hrStr, minStr] = value.toString().split(".");
            const hr = Math.floor(+hrStr);
            const min = Math.round(parseInt(minStr || 0, 10));
            let newMin = Number(min.toFixed(2));
            return `${hr}:${newMin.toString().padStart(2, "0")} hrs`;
          },
        },
      },

      grid: {
        row: {
          colors: ["#f3f6ff", "transparent"],
          opacity: 0.5,
        },
      },
    },
    {
      isLoading: false,
      title: {
        text: "Opinion TAT Chart",
        align: "left",
        margin: 2,
        offsetY: 0,
        style: {
          fontSize: "17px",
          fontWeight: "bold",
          color: "rgb(21, 96, 189)",
        },
      },
      chart: {
        height: 260,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      colors: ["#4CAF50", "#2196F3", "#9C27B0", "#FF9800", "#FF5722"],
      series: [],

      xaxis: {
        categories: [
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
        ],
      },

      yaxis: {
        labels: {
          formatter: function (value) {
            const [hrStr, minStr] = value.toString().split(".");
            const hr = Math.floor(+hrStr);
            const min = Math.round(parseInt(minStr || 0, 10));
            let newMin = Number(min.toFixed(2));
            return `${hr}:${newMin.toString().padStart(2, "0")} hrs`;
          },
        },
        // title: {
        //   text: "Time",
        // },
      },

      tooltip: {
        y: {
          formatter: function (value) {
            const [hrStr, minStr] = value.toString().split(".");
            const hr = Math.floor(+hrStr);
            const min = Math.round(parseInt(minStr || 0, 10));
            let newMin = Number(min.toFixed(2));
            return `${hr}:${newMin.toString().padStart(2, "0")} hrs`;
          },
        },
      },

      grid: {
        row: {
          colors: ["#f3f6ff", "transparent"],
          opacity: 0.5,
        },
      },
    },
  ];

  // tat areachart end

  // filter data api's

  // Country Linking
  countryData: any = [];
  totalElementCountry: number;
  countryParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutCountry = null;
  isLoadingCountry = false;
  isLoadingCountrySelectAll = false;
  selectedCountrySearch: any = [];
  getCountryData(selectAll: Boolean) {
    if (this.isLoadingCountry) {
      return;
    }
    this.isLoadingCountry = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.countryData = [];
        }

        this.countryData.push(...res.data.content);
        this.totalElementCountry = res.data.totalElement;
        this.countryParams.page = this.countryParams.page + 1;
        this.isLoadingCountry = false;
        if (selectAll) {
          const allCountryNames = this.countryData.map((item) => item.name);
          allCountryNames.forEach(
            (country) =>
              this.selectedCountrySearch.includes(country) ||
              this.selectedCountrySearch.push(country)
          );
          this.filterSelectionForm.patchValue({
            country: this.selectedCountrySearch,
          });
          this.isLoadingCountrySelectAll = false;
        }
      });
  }

  onInfiniteScrollCountry(): void {
    if (this.countryData.length < this.totalElementCountry) {
      this.getCountryData(false);
    }
  }

  searchCountry(filterValue: string) {
    clearTimeout(this.timeoutCountry);
    this.timeoutCountry = setTimeout(() => {
      this.countryParams.search = filterValue.trim();
      this.countryParams.page = 1;
      this.countryParams.limit = 20;
      this.countryData = []; // Clear existing data when searching
      this.isLoadingCountry = false;
      this.getCountryData(false);
    }, 600);
  }

  onClickCountry(item) {
    const index = this.selectedCountrySearch.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCountrySearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCountrySearch.push(item);
    }
    this.filterSelectionForm.patchValue({
      country: [...new Set(this.selectedCountrySearch)],
    });
  }

  selectAllCountry(event) {
    if (event.checked) {
      this.countryParams.page = 1;
      this.countryParams.limit = 0;
      this.isLoadingCountry = false;
      this.isLoadingCountrySelectAll = true;
      this.getCountryData(true);
    } else {
      this.selectedCountrySearch = [];
      this.filterSelectionForm.patchValue({
        country: [],
      });
    }
  }

  // Treatment Linking

  treatmentData: any = [];
  totalElementTreatment: number;
  treatmentParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutTreatment = null;
  isLoadingTreatment = false;
  isLoadingTreatmentSelectAll = false;
  selectedTreatmentSearch: any = [];
  getTreatmentData(selectAll: Boolean) {
    if (this.isLoadingTreatment) {
      return;
    }
    this.isLoadingTreatment = true;

    this.sharedService
      .getCmsData("getAllTreatment", this.treatmentParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.treatmentData = [];
        }
        this.treatmentData.push(...res.data.content);
        this.totalElementTreatment = res.data.totalElement;
        this.treatmentParams.page = this.treatmentParams.page + 1;
        this.isLoadingTreatment = false;
        if (selectAll) {
          const allTreatmentNames = this.treatmentData.map((item) => item.name);
          allTreatmentNames.forEach(
            (treatment) =>
              this.selectedTreatmentSearch.includes(treatment) ||
              this.selectedTreatmentSearch.push(treatment)
          );
          this.filterSelectionForm.patchValue({
            treatment: this.selectedTreatmentSearch,
          });
          this.isLoadingTreatmentSelectAll = false;
        }
      });
  }

  onInfiniteScrollTreatment(): void {
    if (this.treatmentData.length < this.totalElementTreatment) {
      this.getTreatmentData(false);
    }
  }

  searchTreatment(filterValue: string) {
    clearTimeout(this.timeoutTreatment);
    this.timeoutTreatment = setTimeout(() => {
      this.treatmentParams.search = filterValue.trim();
      this.treatmentParams.page = 1;
      this.treatmentParams.limit = 20;
      this.treatmentData = []; // Clear existing data when searching
      this.isLoadingTreatment = false;
      this.getTreatmentData(false);
    }, 600);
  }

  onClickTreatment(item) {
    const index = this.selectedTreatmentSearch.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedTreatmentSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedTreatmentSearch.push(item);
    }
    this.filterSelectionForm.patchValue({
      treatment: [...new Set(this.selectedTreatmentSearch)],
    });
  }

  selectAllTreatment(event) {
    if (event.checked) {
      this.treatmentParams.page = 1;
      this.treatmentParams.limit = 0;
      this.isLoadingTreatment = false;
      this.isLoadingTreatmentSelectAll = true;
      this.getTreatmentData(true);
    } else {
      this.selectedTreatmentSearch = [];
      this.filterSelectionForm.patchValue({
        treatment: [],
      });
    }
  }

  // hospital linking
  hospitalData = [];
  freshHospitalData = [];
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll: boolean = false;
  totalElementHospital: number;
  selectedHospitalSearch = [];
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };

  getAllHospital(selectAll: Boolean) {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.hospitalData = [];
        }
        this.freshHospitalData.push(...res.data.content);
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;

        this.isLoadingHospital = false;

        if (selectAll) {
          const allHospital = this.hospitalData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allHospital.forEach((hospital) => {
            const isHospitalAlreadySelected = this.selectedHospitalSearch.some(
              (selectedHospital) => selectedHospital._id === hospital._id
            );

            if (!isHospitalAlreadySelected) {
              this.selectedHospitalSearch.push(hospital);
            }
          });

          this.filterSelectionForm.patchValue({
            hospital: this.selectedHospitalSearch,
          });

          this.isLoadingHospitalSelectAll = false;
        }
      });
  }

  onInfiniteScrollHospital(): void {
    if (this.freshHospitalData.length < this.totalElementHospital) {
      this.getAllHospital(false);
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 20;
      this.hospitalData = [];
      this.freshHospitalData = [];
      this.isLoadingHospital = false;
      this.getAllHospital(false);
    }, 600);
  }

  onClickHospital(item) {
    const index = this.selectedHospitalSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedHospitalSearch.splice(index, 1);
    } else {
      this.selectedHospitalSearch.push(item);
    }
    this.filterSelectionForm.patchValue({
      hospital: [...new Set(this.selectedHospitalSearch)],
    });
  }

  selectAllHospital(event: any) {
    if (event.checked) {
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 0;
      this.isLoadingHospital = false;
      this.isLoadingHospitalSelectAll = true;
      this.getAllHospital(true);
    } else {
      this.selectedHospitalSearch = [];
      this.filterSelectionForm.patchValue({
        hospital: [],
      });
    }
  }

  // ownReferralPartnerData = [];
  // ownReferralPartnerFreshData = [];
  // selectedOwnReferralPartnerSearch = [];
  // totalElementOwnReferralPartner: number;
  // isLoadingOwnReferralPartner: boolean = false;
  // isLoadingOwnReferralPartnerSelectAll: boolean = false;
  // timeoutOwnReferralPartner = null;

  // getOwnReferralPartner(selectAll: boolean) {
  //   if (this.isLoadingOwnReferralPartner) {
  //     return;
  //   }
  //   this.isLoadingOwnReferralPartner = true;
  //   this.hospitalService.getAllReferralPartner().subscribe((res: any) => {
  //     if (selectAll) {
  //       this.ownReferralPartnerData = [];
  //     }

  //     this.ownReferralPartnerData.push(...res.data);
  //     this.ownReferralPartnerFreshData = cloneDeep(this.ownReferralPartnerData);
  //     this.totalElementOwnReferralPartner = res.data.totalElement;
  //     this.isLoadingOwnReferralPartner = false;

  //     if (selectAll) {
  //       const allPartnerNames = this.ownReferralPartnerData.map((item) => ({
  //         _id: item._id,
  //         name: item.name,
  //       }));

  //       allPartnerNames.forEach((hospital) => {
  //         const isPartnerAlreadySelected =
  //           this.selectedOwnReferralPartnerSearch.some(
  //             (selectedPartner) => selectedPartner._id === hospital._id
  //           );

  //         if (!isPartnerAlreadySelected) {
  //           this.selectedOwnReferralPartnerSearch.push(hospital);
  //         }
  //       });

  //       this.filterSelectionForm.patchValue({
  //         referralPartner: this.selectedOwnReferralPartnerSearch,
  //       });
  //       this.isLoadingOwnReferralPartnerSelectAll = false;
  //     }
  //   });
  // }



  // searchOwnReferralPartner(filterValue: string) {
  //   clearTimeout(this.timeoutOwnReferralPartner);
  //   this.timeoutOwnReferralPartner = setTimeout(() => {
  //     if (!!filterValue) {
  //       let filterArray = cloneDeep(this.ownReferralPartnerFreshData);
  //       this.ownReferralPartnerData = [];
  //       let filterData = filterArray.filter((f: any) =>
  //         f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
  //       );
  //       if (filterData.length) {
  //         filterArray = filterData;
  //       } else {
  //         filterArray = [];
  //       }
  //       this.ownReferralPartnerData = filterArray;
  //     } else {
  //       this.ownReferralPartnerData = this.ownReferralPartnerFreshData;
  //     }
  //   }, 600);
  // }

  // onClickOwnReferralPartner(item) {
  //   const index = this.selectedOwnReferralPartnerSearch.findIndex(
  //     (element) => element._id === item._id
  //   ); // Check if the item exists in the array

  //   if (index !== -1) {
  //     // If the item exists, remove it
  //     this.selectedOwnReferralPartnerSearch.splice(index, 1);
  //   } else {
  //     // If the item doesn't exist, push it
  //     this.selectedOwnReferralPartnerSearch.push(item);
  //   }
  //   this.filterSelectionForm.patchValue({
  //     referralPartner: [...new Set(this.selectedOwnReferralPartnerSearch)],
  //   });
  // }

  // selectAllOwnReferralPartner(event) {
  //   if (event.checked) {
  //     this.isLoadingOwnReferralPartner = false;
  //     this.isLoadingOwnReferralPartnerSelectAll = true;
  //     this.getOwnReferralPartner(true);
  //   } else {
  //     this.selectedOwnReferralPartnerSearch = [];
  //     this.filterSelectionForm.patchValue({
  //       referralPartner: [],
  //     });
  //   }
  // }

  // referral partner start

  referralPartnerData: any = [];
  referralPartnerFreshData: any = [];
  selectedReferralPartnerSearch: any = [];
  isLoadingReferralPartner = true
  isLoadingReferralPartnerSelectAll = false
  timeoutPartner = null;

  referralTypeName = {
    pre: "Pre defined",
    own: "Own",
  };

  getAllReferralPartner() {
    this.isLoadingReferralPartner = true
    this.hospitalService.getAllReferralPartner().subscribe((res: any) => {
      if (res?.data?.length) {
        let data = res?.data?.map((d: any) => {
          d["referralType"] = "own";
          return d;
        });

        this.referralPartnerData = data;
        this.referralPartnerFreshData = cloneDeep(this.referralPartnerData);
      }
      this.getPreReferralPartner();
    }, (err) => {
      this.isLoadingReferralPartner = false
    });
  }

  preReferralPartnerParams = {
    page: 1,
    limit: "",
    search: "",
  };
  getPreReferralPartner() {
    this.sharedService
      .getAllFacilitator(this.preReferralPartnerParams)
      .subscribe((res: any) => {
        if (res?.data?.content?.length) {
          let data = res?.data?.content?.map((d: any) => {
            d["referralType"] = "pre";
            return d;
          });
          this.referralPartnerData.push(...data);
          this.referralPartnerFreshData.push(...data);
          this.isLoadingReferralPartner = false
        }
      }, (err) => {
        this.isLoadingReferralPartner = false
      });
  }

  onClickReferralItem(item: any) {
    const index = this.selectedReferralPartnerSearch.findIndex(
      (element) => element._id === item._id
    ); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedReferralPartnerSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedReferralPartnerSearch.push(item);
    }
    this.filterSelectionForm.patchValue({
      referralPartner: [...new Set(this.selectedReferralPartnerSearch)],
    });
  }

  searchReferralPartner(filterValue: string) {
    clearTimeout(this.timeoutPartner);
    this.timeoutPartner = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.referralPartnerFreshData);
        this.referralPartnerData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.referralPartnerData = filterArray;
      } else {
        this.referralPartnerData = this.referralPartnerFreshData;
      }
    }, 600);
  }

  selectAllReferralPartner(event) {
    if (event.checked) {
      // this.isLoadingOwnReferralPartner = true;
      this.selectedReferralPartnerSearch = [];

      this.referralPartnerData?.forEach((data: any) => {
        this.selectedReferralPartnerSearch.push({
          _id: data?._id,
          name: data?.name,
          referralType: data?.referralType,
        });
      });

      this.filterSelectionForm.patchValue({
        referralPartner: [...new Set(this.selectedReferralPartnerSearch)],
      });
    } else {
      this.selectedReferralPartnerSearch = [];
      this.filterSelectionForm.patchValue({
        referralPartner: [],
      });
    }

    // if (event.checked) {
    //   this.isLoadingOwnReferralPartner = false;
    //   this.isLoadingOwnReferralPartnerSelectAll = true;
    //   this.getOwnReferralPartner(true);
    // } else {
    //   this.selectedOwnReferralPartnerSearch = [];
    //   this.filterSelectionForm.patchValue({
    //     referralPartner: [],
    //   });
    // }
  }
  // referral partner end


  // Doctor linking
  doctorData: any = [];
  freshDoctorData: any = [];
  totalElementDoctor: number;
  doctorParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutDoctor = null;
  isLoadingDoctor = false;
  isLoadingDoctorSelectAll = false;
  selectedDoctorSearch = [];

  getDoctorData(selectAll: Boolean) {
    if (this.isLoadingDoctor) {
      return;
    }
    this.isLoadingDoctor = true;

    this.sharedService.getAllDoctor(this.doctorParams).subscribe(
      (res: any) => {
        if (selectAll) {
          this.doctorData = [];
        }
        this.freshDoctorData.push(...res.data.content);
        this.doctorData.push(...res.data.content);
        this.totalElementDoctor = res.data.totalElement;
        this.doctorParams.page = this.doctorParams.page + 1;
        this.isLoadingDoctor = false;

        if (selectAll) {
          const allDoctor = this.doctorData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));

          allDoctor.forEach((doctor) => {
            const isDoctorAlreadySelected = this.selectedDoctorSearch.some(
              (selectedDoctor) => selectedDoctor._id === doctor._id
            );

            if (!isDoctorAlreadySelected) {
              this.selectedDoctorSearch.push(doctor);
            }
          });

          this.filterSelectionForm.patchValue({
            doctor: this.selectedDoctorSearch,
          });

          this.isLoadingDoctorSelectAll = false;
        }
      },
      () => {
        this.isLoadingDoctor = false;
      }
    );
  }

  onInfiniteScrollDoctor(): void {
    if (this.freshDoctorData?.length < this.totalElementDoctor) {
      this.getDoctorData(false);
    }
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      this.doctorParams.search = filterValue.trim();
      this.doctorParams.page = 1;
      this.doctorParams.limit = 20;
      this.doctorData = [];
      this.freshDoctorData = [];
      this.isLoadingDoctor = false;
      this.getDoctorData(false);
    }, 600);
  }

  onClickDoctor(item) {
    const index = this.selectedDoctorSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedDoctorSearch.splice(index, 1);
    } else {
      this.selectedDoctorSearch.push(item);
    }
    this.filterSelectionForm.patchValue({
      doctor: [...new Set(this.selectedDoctorSearch)],
    });
  }

  selectAllDoctor(event: any) {
    if (event.checked) {
      this.doctorParams.page = 1;
      this.doctorParams.limit = 0;
      this.isLoadingDoctor = false;
      this.isLoadingDoctorSelectAll = true;
      this.getDoctorData(true);
    } else {
      this.selectedDoctorSearch = [];
      this.filterSelectionForm.patchValue({
        doctor: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  // user data linking
  isInternalUserLoading = true;
  isInternalUserLoadingSelectAll = false;
  getAllInternalUser() {
    this.isInternalUserLoading = true;
    this.isAdminLoading = true;
    this.hospitalService.getAllEmployeeUserHopsital({ isQueryViewSetting: true }).subscribe(
      (res: any) => {
        this.internalUserData = res.data || [];
        this.getAdminDetails();
        // this.isInternalUserLoading = false;
      },
      (err) => {
        this.isInternalUserLoading = false;
        this.isAdminLoading = false;
      }
    );
  }

  copyInternalUserData: any = [];
  isAdminLoading = false;
  isAdminLoadingSelectAll = false;
  getAdminDetails() {
    this.isAdminLoading = true;
    this.sharedService.getAdminDetails().subscribe(
      (res: any) => {
        this.internalUserData.unshift(res.data);
        if (this.internalUserData?.length) {
          this.isAdminLoading = false;
          this.isInternalUserLoading = false;
        } else {
          this.isAdminLoading = false;
          this.isInternalUserLoading = false;
        }
        this.copyInternalUserData = cloneDeep(this.internalUserData);
      },
      () => {
        this.isAdminLoading = false;
        this.isInternalUserLoading = false;
      }
    );
  }

  timeoutInternalUser = null;
  internalUserData: any = [];
  selectedUserSearch: any = [];

  searchInternalUser(filterValue: string) {
    clearTimeout(this.timeoutInternalUser);
    this.timeoutInternalUser = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.internalUserData);
        this.internalUserData = [];
        let filterData = this.copyInternalUserData.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.internalUserData = filterArray;
      } else {
        this.internalUserData = this.copyInternalUserData;
      }
    }, 600);
  }

  onClickUser(item) {
    const index = this.selectedUserSearch.findIndex(
      (element) => element?._id === item?._id
    );
    if (index !== -1) {
      this.selectedUserSearch.splice(index, 1);
    } else {
      this.selectedUserSearch.push(item);
    }
    this.filterSelectionForm.patchValue({
      user: [...new Set(this.selectedUserSearch)],
    });
  }

  selectAllUser(event) {
    if (event.checked) {
      this.isAdminLoadingSelectAll = false;
      this.isInternalUserLoadingSelectAll = false;
      // this.isAdminLoadingSelectAll = true;
      this.selectedUserSearch = [];
      this.internalUserData?.forEach((iud: any) => {
        this.selectedUserSearch.push({
          _id: iud?._id,
          name: iud?.name,
        });
      });

      this.filterSelectionForm.patchValue({
        user: [...new Set(this.selectedUserSearch)],
      });
    } else {
      this.selectedUserSearch = [];
      this.filterSelectionForm.patchValue({
        user: [],
      });
    }
  }

  compareObjectsForUser(item1, item2) {
    return item1._id === item2._id;
  }
}
