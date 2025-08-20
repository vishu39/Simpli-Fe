import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddMessageContentHosComponent } from "./dialog/add-message-content-hos/add-message-content-hos.component";
import { cloneDeep } from "lodash";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "app-message-content-hospital",
  templateUrl: "./message-content-hospital.component.html",
  styleUrls: ["./message-content-hospital.component.scss"],
})
export class MessageContentHospitalComponent implements OnInit {
  messageContentData: any = [];
  messageContentFreshData: any = [];
  selectedMessageContentData: any;
  navIndex: number = 0;
  constructor(
    private sharedService: SharedService,
    private supremeService: SupremeService,
    private dialog: MatDialog,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllMessageContentHos();
  }

  addMessageContent(heading: string) {
    const dialogRef = this.dialog.open(AddMessageContentHosComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllMessageContentHos();
      }
    });
  }

  editMessageContent(heading: string) {
    const dialogRef = this.dialog.open(AddMessageContentHosComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(this.selectedMessageContentData);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllMessageContentHos();
      }
    });
  }

  isDataLoading = true;
  getAllMessageContentHos() {
    this.isDataLoading = true;
    this.supremeService.getAllMessageContentHos().subscribe(
      (res: any) => {
        this.messageContentData = res?.data;
        if (this.messageContentData?.length) {
          this.messageContentData?.map((obj) => {
            obj.active = false;
          });
          this.messageContentData[this.navIndex].active = true;
          this.messageContentFreshData = this.messageContentData;
          this.getMessageContentHos(this.messageContentData[this.navIndex]._id);
        }
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  isContentLoading = false;
  getMessageContentHos(id) {
    this.isContentLoading = true;
    this.supremeService.getMessageContentHos(id).subscribe(
      (res: any) => {
        this.selectedMessageContentData = res.data;
        this.isContentLoading = false;
      },
      (err) => {
        this.isContentLoading = false;
      }
    );
  }
  onActive(obj, i) {
    this.navIndex = i;
    this.messageContentData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.getMessageContentHos(obj._id);
  }

  deleteMessageContentHospital(id: string) {
    this.svc.ui
      .warnDialog(
        "Sure you want to delete message content?",
        dialogButtonConfig,
        4
      )
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.supremeService
            .deleteMessageContentHos(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.selectedMessageContentData = null;
              this.messageContentData = [];
              this.navIndex = 0;
              this.getAllMessageContentHos();
            });
        }
      });
  }

  timeoutEvent = null;
  search(filterValue: string) {
    clearTimeout(this.timeoutEvent);
    this.timeoutEvent = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.messageContentFreshData);
        this.messageContentData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.displayName?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.messageContentData = filterArray;
        this.resetDetailsData()
      } else {
        this.messageContentData = this.messageContentFreshData;
        this.resetDetailsData()
      }
    }, 600);
  }

  resetDetailsData() {
    if (this.messageContentData?.length > 0) {
      this.navIndex = 0;
      let firstIndexObj = this.messageContentData[this.navIndex];
      this.messageContentData?.map((obj: any) => {
        obj.active = false;
      });
      firstIndexObj.active = true;
      this.getMessageContentHos(firstIndexObj._id);
    } else {
      this.navIndex = 0;
      this.selectedMessageContentData = null;
    }
  }
}
