import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { EmailContentHospitalDialogComponent } from "./dialog/email-content-hospital-dialog/email-content-hospital-dialog.component";
import { cloneDeep } from "lodash";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "app-email-content-hospital",
  templateUrl: "./email-content-hospital.component.html",
  styleUrls: ["./email-content-hospital.component.scss"],
})
export class EmailContentHospitalComponent implements OnInit {
  emailContentData: any = [];
  emailContentFreshData: any = [];
  selectedEmailContentData: any;
  navIndex: number = 0;
  constructor(
    private sharedService: SharedService,
    private supremeService: SupremeService,
    private dialog: MatDialog,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllEmailContentHospital();
  }

  addEmailContent(heading: string) {
    const dialogRef = this.dialog.open(EmailContentHospitalDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllEmailContentHospital();
      }
    });
  }

  editEmailContent(heading: string) {
    const dialogRef = this.dialog.open(EmailContentHospitalDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(this.selectedEmailContentData);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllEmailContentHospital();
      }
    });
  }

  isDataLoading = true;
  getAllEmailContentHospital() {
    this.isDataLoading = true;
    this.supremeService.getAllEmailContentHospital().subscribe(
      (res: any) => {
        this.emailContentData = res?.data;
        if (this.emailContentData?.length) {
          this.emailContentData?.map((obj) => {
            obj.active = false;
          });
          this.emailContentData[this.navIndex].active = true;
          this.emailContentFreshData=this.emailContentData
          this.getEmailContentHospital(
            this.emailContentData[this.navIndex]._id
          );
        }
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  isContentLoading = false;
  getEmailContentHospital(id) {
    this.isContentLoading = true;
    this.supremeService.getEmailContentHospital(id).subscribe(
      (res: any) => {
        this.selectedEmailContentData = res.data;
        this.isContentLoading = false;
      },
      (err) => {
        this.isContentLoading = false;
      }
    );
  }
  onActive(obj, i) {
    this.navIndex = i;
    this.emailContentData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.getEmailContentHospital(obj._id);
  }

  deleteEmailContentHospital(id: string) {
    this.svc.ui
      .warnDialog(
        "Sure you want to delete email content?",
        dialogButtonConfig,
        4
      )
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.supremeService
            .deleteEmailContentHospital(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.selectedEmailContentData = null;
              this.emailContentData = [];
              this.navIndex = 0;
              this.getAllEmailContentHospital();
            });
        }
      });
  }

  timeoutEvent = null;
  search(filterValue: string) {
    clearTimeout(this.timeoutEvent);
    this.timeoutEvent = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.emailContentFreshData);
        this.emailContentData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.displayName?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.emailContentData = filterArray;
        this.resetDetailsData()
      } else {
        this.emailContentData = this.emailContentFreshData;
        this.resetDetailsData()
      }
    }, 600);
  }

  resetDetailsData() {
    if (this.emailContentData?.length > 0) {
      this.navIndex = 0;
      let firstIndexObj = this.emailContentData[this.navIndex];
      this.emailContentData?.map((obj: any) => {
        obj.active = false;
      });
      firstIndexObj.active = true;
      this.getEmailContentHospital(firstIndexObj._id);
    } else {
      this.navIndex = 0;
      this.selectedEmailContentData = null;
    }
  }
}
