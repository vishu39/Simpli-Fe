import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddOwnReferralPartnerZoneComponent } from "./component/add-own-referral-partner-zone/add-own-referral-partner-zone.component";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "app-own-referral-zone",
  templateUrl: "./own-referral-zone.component.html",
  styleUrls: ["./own-referral-zone.component.scss"],
})
export class OwnReferralZoneComponent implements OnInit {
  @Input() referralId: any;

  zoneData: any = [];
  totalElementZone: number;
  zoneParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutZone = null;
  isLoadingZone = false;

  selectedZoneData: any;
  navIndex: number = 0;
  // referralId: string;
  constructor(
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public svc: CommonService
  ) {
    // this.sharedService.hospitalEmailZoneSubject.subscribe((res: any) => {
    // })
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.referralId.currentValue) {
      this.zoneParams.page = 1;
      this.zoneData = [];
      this.selectedZoneData = null;
      this.navIndex = 0;
      this.getAllReferralPartnerZone();
    }
  }

  addEmailZone(heading: string) {
    if (this.referralId) {
      const dialogRef = this.dialog.open(AddOwnReferralPartnerZoneComponent, {
        width: "100%",
        disableClose: true,
        autoFocus: false,
      });
      dialogRef.componentInstance.dialogTitle = heading;
      dialogRef.componentInstance.referralId = this.referralId;

      dialogRef.afterClosed().subscribe((result) => {
        if (result == true) {
          this.zoneParams.page = 1;
          this.zoneData = [];
          this.selectedZoneData = null;
          this.navIndex = 0;
          this.getAllReferralPartnerZone();
        }
      });
    }
  }

  editEmailZone(heading: string, item: any) {
    if (this.referralId) {
      const dialogRef = this.dialog.open(AddOwnReferralPartnerZoneComponent, {
        width: "100%",
        disableClose: true,
        autoFocus: false,
      });
      dialogRef.componentInstance.dialogTitle = heading;
      dialogRef.componentInstance.referralId = this.referralId;
      dialogRef.componentInstance.onEdit(item);

      dialogRef.afterClosed().subscribe((result) => {
        this.zoneParams.page = 1;
        this.zoneData = [];
        this.selectedZoneData = null;
        this.navIndex = 0;
        this.getAllReferralPartnerZone();
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

  getAllReferralPartnerZone() {
    if (this.isLoadingZone) {
      return;
    }
    this.isLoadingZone = true;
    this.facilitatorService
      .getAllReferralPartnerZone(this.referralId, this.zoneParams)
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
      this.getAllReferralPartnerZone();
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
      this.getAllReferralPartnerZone();
    }, 600);
  }

  deleteEmailZone(id: string) {
    if (this.referralId) {
      this.svc.ui
        .warnDialog(
          "Sure you want to delete email zone?",
          dialogButtonConfig,
          4
        )
        .subscribe((res) => {
          if (res.button.name === "YES") {
            this.facilitatorService
              .deleteReferralPartnerZone(id)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.zoneParams.page = 1;
                this.zoneData = [];
                this.selectedZoneData = null;
                this.navIndex = 0;
                this.getAllReferralPartnerZone();
              });
          }
        });
    }
  }
}
