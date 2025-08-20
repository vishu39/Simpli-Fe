import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "app-zone-default",
  templateUrl: "./zone-default.component.html",
  styleUrls: ["./zone-default.component.scss"],
})
export class ZoneDefaultComponent implements OnInit {
  @Input() hospitalId: any;
  zoneData: any = [];
  hospitalEmailZoneSettingData: any;
  totalElementZone: number;
  zoneParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  defaultCheck = {
    checked: true,
  };
  timeoutZone = null;
  isLoadingZone = false;

  selectedZoneData: any;
  navIndex: number = 0;
  constructor(
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public svc: CommonService
  ) {
    this.sharedService.hospitalEmailZoneSettingSubject.subscribe((res) => {
      this.getHospitalEmailZoneSetting();
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.hospitalId.currentValue) {
      this.zoneParams.page = 1;
      this.zoneData = [];
      this.selectedZoneData = null;
      this.navIndex = 0;
      this.getAllHospitalEmailZone();
      this.getHospitalEmailZoneSetting();
    }
  }

  changeNoZoneSetting(event) {
    const data = {
      hospitalId: this.hospitalId,
      noZone: event.checked,
    };
    this.facilitatorService
      .editHospitalEmailZoneSetting(data)
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.getHospitalEmailZoneSetting();
      });
  }
  changeDefaultSettingFacilitator() {
    let data = {
      hospitalId: this.hospitalId,
      defaultSetting: false,
    };
    this.facilitatorService
      .editHospitalEmailZoneSetting(data)
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.sharedService.hospitalEmailZoneSettingSubject.next(true);
      });
  }
  onActive(obj, i) {
    this.navIndex = i;
    this.zoneData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.selectedZoneData = this.zoneData[i];
  }
  getHospitalEmailZoneSetting() {
    this.facilitatorService
      .getHospitalEmailZoneSetting(this.hospitalId)
      .subscribe((res: any) => {
        this.hospitalEmailZoneSettingData = res.data;
        // console.log('this.hospitalEmailZoneSettingData', this.hospitalEmailZoneSettingData)
      });
  }
  getAllHospitalEmailZone() {
    if (this.isLoadingZone) {
      return;
    }
    this.isLoadingZone = true;
    this.facilitatorService
      .getAllDefaultHospitalEmailZone(this.hospitalId, this.zoneParams)
      .subscribe(
        (res: any) => {
          this.zoneData.push(...res.data.content);
          // console.log('this.zoneData', this.zoneData)
          this.totalElementZone = res.data.totalElement;
          this.zoneParams.page = this.zoneParams.page + 1;
          this.isLoadingZone = false;

          if (this.zoneData.length) {
            this.zoneData.map((obj) => {
              obj.active = false;
            });
            this.zoneData[this.navIndex].active = true;
            this.selectedZoneData = this.zoneData[this.navIndex];
          } else {
            this.selectedZoneData = null;
          }
        },
        (err) => {
          this.isLoadingZone = false;
        }
      );
  }
  onInfiniteScrollZone(): void {
    if (this.zoneData.length < this.totalElementZone) {
      this.getAllHospitalEmailZone();
    }
  }

  searchZone(filterValue: string) {
    clearTimeout(this.timeoutZone);
    this.timeoutZone = setTimeout(() => {
      this.zoneParams.search = filterValue.trim();
      this.zoneParams.page = 1;
      this.zoneData = []; // Clear existing data when searching
      this.navIndex = 0;
      this.isLoadingZone = false;
      this.getAllHospitalEmailZone();
    }, 600);
  }
}
