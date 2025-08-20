import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { QueryViewSettingDialogComponent } from "./dialog/query-view-setting-dialog/query-view-setting-dialog.component";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "hospital-shared-query-view-setting",
  templateUrl: "./query-view-setting.component.html",
  styleUrls: ["./query-view-setting.component.scss"],
})
export class QueryViewSettingComponent implements OnInit {
  internalUserData: any = [];
  selectedQueryViewData: any;
  onSelectNav: boolean = false;
  internalUserId: string;
  navIndex: number = 0;
  zoneButtomStatus = false;

  constructor(
    private sharedService: SharedService,
    private hospitalService: HospitalService,
    private dialog: MatDialog,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllInternalUser();
  }

  addQueryViewSetting(heading: string) {
    if (!this.zoneButtomStatus) {
      const dialogRef = this.dialog.open(QueryViewSettingDialogComponent, {
        width: "100%",
        disableClose: true,
        autoFocus: false,
      });
      dialogRef.componentInstance.dialogTitle = heading;
      dialogRef.componentInstance.internalUserId = this.internalUserId;
      dialogRef.componentInstance.selectedQueryViewData =
        this.selectedQueryViewData;

      dialogRef.afterClosed().subscribe((result) => {
        if (result == true) {
          this.onSelectNav = false;
          this.isSettingLoading = true;
          this.selectedQueryViewData = {};
          this.internalUserData = [];
          this.getAllInternalUser();
        }
      });
    }
  }

  editQueryViewSetting(heading: string, index: number) {
    if (!this.zoneButtomStatus) {
      const dialogRef = this.dialog.open(QueryViewSettingDialogComponent, {
        width: "100%",
        disableClose: true,
        autoFocus: false,
      });
      dialogRef.componentInstance.dialogTitle = heading;
      dialogRef.componentInstance.internalUserId = this.internalUserId;
      dialogRef.componentInstance.selectedQueryViewData =
        this.selectedQueryViewData;
      dialogRef.componentInstance.onEdit(index);

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.onSelectNav = false;
          this.isSettingLoading = true;
          this.selectedQueryViewData = {};
          this.internalUserData = [];
          this.getAllInternalUser();
        }
      });
    }
  }

  isInternalUserLoading = true;
  getAllInternalUser() {
    this.isInternalUserLoading = true;
    this.hospitalService
      .getAllEmployeeUserHopsital({ isQueryViewSetting: true })
      .subscribe(
        (res: any) => {
          this.internalUserData = res.data;
          if (this.internalUserData.length) {
            this.internalUserData.map((obj) => {
              obj.active = false;
            });
            this.internalUserData[this.navIndex].active = true;
            this.internalUserId = this.internalUserData[this.navIndex]._id;
            this.getQueryViewSetting(this.internalUserData[this.navIndex]._id);
          }
          this.isInternalUserLoading = false;
        },
        (err) => {
          this.isInternalUserLoading = false;
        }
      );
  }

  isSettingLoading = false;
  getQueryViewSetting(id) {
    this.isSettingLoading = true;
    this.zoneButtomStatus = true;
    this.hospitalService.getQueryViewSettingByInternalUser(id).subscribe(
      (res: any) => {
        this.onSelectNav = true;
        this.zoneButtomStatus = false;
        this.selectedQueryViewData = res.data;
        // this.userPermissionForm.patchValue({
        //   roleName: this.selectedRole.roleName
        // })
        this.isSettingLoading = false;
      },
      (err) => {
        this.isSettingLoading = false;
      }
    );
  }
  onActive(obj, i) {
    this.navIndex = i;
    this.internalUserData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.internalUserId = obj._id;
    this.getQueryViewSetting(obj._id);
  }

  deleteQueryViewSetting(id: string) {
    this.svc.ui
      .warnDialog(
        "Sure you want to delete query view setting?",
        dialogButtonConfig,
        4
      )
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.hospitalService
            .deleteQueryViewSetting(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.selectedQueryViewData = null;
              this.getAllInternalUser();
            });
        }
      });
  }

  deleteZone(zoneIndex: number) {
    this.svc.ui
      .warnDialog("Sure you want to delete zone?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          // console.log('zoneIndex',zoneIndex)
          const data = {
            internalUser: this.internalUserId,
            zone: this.selectedQueryViewData.zone.filter(
              (_, index) => index !== zoneIndex
            ),
          };
          // console.log('data',data)
          this.hospitalService
            .editQueryViewSetting(this.selectedQueryViewData._id, data)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.selectedQueryViewData = null;
              this.getAllInternalUser();
            });
        }
      });
  }
}
