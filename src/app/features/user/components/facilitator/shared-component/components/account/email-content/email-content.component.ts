import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { EmailContentDialogComponent } from "./dialog/email-content-dialog/email-content-dialog.component";
import {cloneDeep} from "lodash"

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "shared-email-content",
  templateUrl: "./email-content.component.html",
  styleUrls: ["./email-content.component.scss"],
})
export class EmailContentComponent implements OnInit {
  emailContentData: any = [];
  selectedEmailContentData: any;
  selectedEmailContentDefaultData: any;
  emailContentDefaultData: any = [];
  emailContentDefaultFreshData: any = [];
  navIndex: number = 0;
  defaultCheck = {
    checked: true,
  };
  constructor(
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllDefaultEmailContent();
  }

  addEmailContent(heading: string) {
    const dialogRef = this.dialog.open(EmailContentDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllDefaultEmailContent();
      }
    });
  }

  editEmailContent(heading: string) {
    const dialogRef = this.dialog.open(EmailContentDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(this.selectedEmailContentData);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllDefaultEmailContent();
      }
    });
  }

  isDataLoading = true;
  getAllDefaultEmailContent() {
    this.isDataLoading = true;
    this.facilitatorService.getAllDefaultEmailContent().subscribe(
      (res: any) => {
        this.emailContentDefaultData = res.data;
        this.emailContentDefaultData.map((obj) => {
          obj.active = false;
        });

        this.emailContentDefaultFreshData= this.emailContentDefaultData
        this.facilitatorService.getAllEmailContent().subscribe((res: any) => {
          this.emailContentData = res.data;
          if (this.emailContentDefaultData.length) {
            this.emailContentDefaultData[this.navIndex].active = true;
            this.selectedEmailContentDefaultData =
              this.emailContentDefaultData[this.navIndex];
            const filterData = this.emailContentData.filter(
              (obj) => obj.name === this.selectedEmailContentDefaultData.name
            );
            this.selectedEmailContentData = filterData[0];
          }
        });
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  onActive(obj, i) {
    this.navIndex = i;
    this.emailContentDefaultData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.selectedEmailContentDefaultData = this.emailContentDefaultData[i];
    const filterData = this.emailContentData.filter(
      (obj) => obj.name === this.selectedEmailContentDefaultData.name
    );
    this.selectedEmailContentData = filterData[0];
  }
  changeDefaultSettingFacilitator(event: Boolean) {
    if (event) {
      this.selectedEmailContentData.defaultSetting = true;
    } else {
      this.selectedEmailContentData.defaultSetting = false;
    }
    this.facilitatorService
      .editEmailContent(
        this.selectedEmailContentData._id,
        this.selectedEmailContentData
      )
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
      });
  }

  deleteEmailContent(id: string) {
    this.svc.ui
      .warnDialog(
        "Sure you want to delete email content?",
        dialogButtonConfig,
        4
      )
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.facilitatorService
            .deleteEmailContent(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.selectedEmailContentData = null;
              this.getAllDefaultEmailContent();
            });
        }
      });
  }

  timeoutEvent = null;
  search(filterValue: string) {
    clearTimeout(this.timeoutEvent);
    this.timeoutEvent = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.emailContentDefaultFreshData);
        this.emailContentDefaultData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.displayName?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.emailContentDefaultData = filterArray;
        this.resetDetailsData()
      } else {
        this.emailContentDefaultData = this.emailContentDefaultFreshData;
        this.resetDetailsData()
      }
    }, 600);
  }

  resetDetailsData() {
    if (this.emailContentDefaultData?.length > 0) {      
      this.navIndex = 0;
      let firstIndexObj = this.emailContentDefaultData[this.navIndex];
      this.emailContentDefaultData?.map((obj: any) => {
        obj.active = false;
      });
      firstIndexObj.active = true;
      this.selectedEmailContentDefaultData = firstIndexObj;

      let selectedEmailContentDataOBJ=this.emailContentData?.find((res:any)=>res?.displayName=== firstIndexObj?.displayName)
      this.selectedEmailContentData = selectedEmailContentDataOBJ;
      
    } else {
      this.navIndex = 0;
      this.selectedEmailContentDefaultData = null;
      this.selectedEmailContentData = null;
    }
  }
}
