import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { cloneDeep } from "lodash";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";

@Component({
  selector: "app-hospital-template",
  templateUrl: "./hospital-template.component.html",
  styleUrls: ["./hospital-template.component.scss"],
})
export class HospitalTemplateComponent implements OnInit {
  internalUserData: any = [];
  selectedQueryViewData: any;
  onSelectNav: boolean = false;
  hospitalId: string;
  navIndex: number = 0;
  zoneButtomStatus = false;
  objectKeys = Object.keys;

  @ViewChild("selectAllCheckbox") selectAllCheckbox: ElementRef;

  toggleNames = {
    patient: "Addition of Patient",
    opinionRequest: "Opinion Request",
  };

  constructor(
    private sharedService: SharedService, // private hospitalService: HospitalService,
    private supremeService: SupremeService
  ) {}

  ngOnInit(): void {
    this.getAllHospital();
    this.getHospitalTemplateEvent();
  }

  hospitalData = [];
  hospitalDataForAggregator = [];
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
  getAllHospital() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;
    this.supremeService.getAllHospital(this.hospitalParams).subscribe(
      (res: any) => {
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;
        if (this.hospitalData.length) {
          this.hospitalData.map((obj) => {
            obj.active = false;
          });
          this.hospitalData[this.navIndex].active = true;
          this.hospitalId = this.hospitalData[this.navIndex].hospitalId;
          this.getHospitalTemplate(this.hospitalData[this.navIndex].hospitalId);
        }

        this.isLoadingHospital = false;
      },
      () => {
        this.isLoadingHospital = false;
        this.isTempateLoading = false;
      }
    );
  }
  onInfiniteScrollHospital(): void {
    if (this.hospitalData.length < this.totalElementHospital) {
      this.getAllHospital();
    }
  }

  searchHospital(filterValue: any) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalData = []; // Clear existing data when searching
      this.navIndex = 0;
      this.hospitalId = "";
      this.isLoadingHospital = false;
      this.getAllHospital();
    }, 600);
  }

  hospitalEvents = [];
  modifiedHospitalEvents = [];
  isEventLoading = true;
  getHospitalTemplateEvent() {
    this.isEventLoading = true;
    this.supremeService.getHospitalTemplateEvent().subscribe(
      (res: any) => {
        this.hospitalEvents = res?.data;
        this.modifiedHospitalEvents = res?.data;
        this.isEventLoading = false;

        this.hospitalEvents?.map((d: any) => {
          for (const [key, value] of Object.entries(d)) {
            d[key].map((element) => {
              element["selected"] = false;
            });
          }
        });
        // this.hospitalEvents.map((obj) => {
        //   obj.selected = false;
        // });
      },
      () => {
        this.isEventLoading = false;
      }
    );
  }

  templateData: any = {};
  isTempateLoading = true;
  getHospitalTemplate(id: any) {
    this.isTempateLoading = true;
    this.supremeService.getHospitalTemplate(id).subscribe(
      (res: any) => {
        this.templateData = res?.data || {};
        this.isTempateLoading = false;
        if (
          !!this.templateData?.template &&
          this.templateData?.template?.length > 0
        ) {
          let addedHospitalTemplate = this.templateData?.template;
          addedHospitalTemplate?.forEach((t: any, ti: number) => {
            this.hospitalEvents?.map((he: any, hei: number) => {
              for (const [key, value] of Object.entries(he)) {
                let index = he[key]?.findIndex(
                  (he: any) => t?.name === he?.name
                );
                if (index !== -1) {
                  he[key][index].selected = true;
                }
              }
            });
          });
        }
      },
      () => {
        this.isTempateLoading = false;
      }
    );
  }

  onActive(obj, i) {
    this.navIndex = i;
    this.hospitalData.map((obj) => {
      obj.active = false;
    });
    this.hospitalEvents.map((obj) => {
      for (const [key, value] of Object.entries(obj)) {
        obj[key].map((o: any) => {
          o.selected = false;
        });
      }
    });
    if (this.selectAllCheckbox["checked"]) {
      this.selectAllCheckbox["checked"] = false;
    }
    this.templateData = [];
    this.hospitalEvents = [];
    obj.active = true;
    this.hospitalId = obj.hospitalId;
    this.getHospitalTemplateEvent();
    this.getHospitalTemplate(obj.hospitalId);
  }

  onClickSelectAll(e: any, data: any) {
    if (e.checked) {
      data?.forEach((d: any) => {
        for (const [key, value] of Object.entries(d)) {
          d[key].map((element) => {
            element.selected = true;
          });
        }
      });
    } else {
      data?.forEach((d: any) => {
        for (const [key, value] of Object.entries(d)) {
          d[key].map((element) => {
            element.selected = false;
          });
        }
      });
    }
  }

  onClickEvent(item, index, val) {}

  submit() {
    let sEventes = cloneDeep(this.hospitalEvents);
    let newArray = [];
    sEventes?.map((d: any) => {
      for (const [key, value] of Object.entries(d)) {
        d[key].map((element) => {
          if (element?.selected) {
            newArray.push(element);
          }
        });
      }
    });
    newArray.map((s: any) => delete s["selected"]);

    let payload = {
      hospitalId: this.hospitalId,
      template: newArray,
    };

    this.supremeService.addHospitalTemplate(payload).subscribe((res: any) => {
      this.sharedService.showNotification("snackBar-success", res?.message);
      this.templateData = [];
      this.hospitalEvents = [];
      this.getHospitalTemplateEvent();
      this.getHospitalTemplate(this.hospitalId);
      if (this.selectAllCheckbox["checked"]) {
        this.selectAllCheckbox["checked"] = false;
      }
    });
  }
}
