import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { ZoneDialogComponent } from "./dialog/zone-dialog/zone-dialog.component";
const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "app-zone",
  templateUrl: "./zone.component.html",
  styleUrls: ["./zone.component.scss"],
})
export class ZoneComponent implements OnInit {
  @Input() hospitalId: any;
  zoneData: any = [];
  totalElementZone: number;
  hospitalEmailZoneSettingData: any;
  defaultCheck = {
    checked: true,
  };
  zoneParams = {
    page: 1,
    limit: 20,
    search: "",
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

  changeDefaultSettingFacilitator() {
    let data = {
      hospitalId: this.hospitalId,
      defaultSetting: true,
    };
    this.facilitatorService
      .editHospitalEmailZoneSetting(data)
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.sharedService.hospitalEmailZoneSettingSubject.next(true);
      });
  }
  getHospitalEmailZoneSetting() {
    this.facilitatorService
      .getHospitalEmailZoneSetting(this.hospitalId)
      .subscribe((res: any) => {
        this.hospitalEmailZoneSettingData = res.data;
        // console.log('this.hospitalEmailZoneSettingData', this.hospitalEmailZoneSettingData)
      });
  }
  addEmailZone(heading: string) {
    if (this.hospitalId) {
      const dialogRef = this.dialog.open(ZoneDialogComponent, {
        width: "100%",
        disableClose: true,
        autoFocus: false,
      });
      dialogRef.componentInstance.dialogTitle = heading;
      dialogRef.componentInstance.hospitalId = this.hospitalId;

      dialogRef.afterClosed().subscribe((result) => {
        if (result == true) {
          this.zoneParams.page = 1;
          this.zoneData = [];
          this.selectedZoneData = null;
          this.navIndex = 0;
          this.getAllHospitalEmailZone();
        }
      });
    }
  }
  editEmailZone(heading: string, item: any) {
    if (this.hospitalId) {
      const dialogRef = this.dialog.open(ZoneDialogComponent, {
        width: "100%",
        disableClose: true,
        autoFocus: false,
      });
      dialogRef.componentInstance.dialogTitle = heading;
      dialogRef.componentInstance.hospitalId = this.hospitalId;
      dialogRef.componentInstance.onEdit(item);

      dialogRef.afterClosed().subscribe((result) => {
        this.zoneParams.page = 1;
        this.zoneData = [];
        this.selectedZoneData = null;
        this.navIndex = 0;
        this.getAllHospitalEmailZone();
      });
    }
  }
  onActive(obj, i) {
    this.navIndex = i;
    this.zoneData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.selectedZoneData = this.zoneData[i];
  }

  getAllHospitalEmailZone() {
    if (this.isLoadingZone) {
      return;
    }
    this.isLoadingZone = true;
    this.facilitatorService
      .getAllHospitalEmailZone(this.hospitalId, this.zoneParams)
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

  deleteEmailZone(id: string) {
    if (this.hospitalId) {
      this.svc.ui
        .warnDialog(
          "Sure you want to delete email zone?",
          dialogButtonConfig,
          4
        )
        .subscribe((res) => {
          if (res.button.name === "YES") {
            this.facilitatorService
              .deleteHospitalEmailZone(id)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.zoneParams.page = 1;
                this.zoneData = [];
                this.selectedZoneData = null;
                this.navIndex = 0;
                this.getAllHospitalEmailZone();
              });
          }
        });
    }
  }
}
