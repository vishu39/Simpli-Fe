import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/core/service/shared/shared.service';
import { SupremeService } from 'src/app/core/service/supreme/supreme.service';
import { CommonService } from 'src/app/smvt-framework/services/common.service';
import { AddMessageContentFacComponent } from './dialog/add-message-content-fac/add-message-content-fac.component';
import { cloneDeep } from "lodash";


const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];


@Component({
  selector: 'app-message-content-facilitator',
  templateUrl: './message-content-facilitator.component.html',
  styleUrls: ['./message-content-facilitator.component.scss']
})
export class MessageContentFacilitatorComponent implements OnInit {
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
    this.getAllMessageContentFac();
  }

  addMessageContent(heading: string) {
    const dialogRef = this.dialog.open(AddMessageContentFacComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllMessageContentFac();
      }
    });
  }

  editMessageContent(heading: string) {
    const dialogRef = this.dialog.open(AddMessageContentFacComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(this.selectedMessageContentData);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllMessageContentFac();
      }
    });
  }

  isDataLoading = true;
  getAllMessageContentFac() {
    this.isDataLoading = true;
    this.supremeService.getAllMessageContentFac().subscribe(
      (res: any) => {
        this.messageContentData = res?.data;
        if (this.messageContentData?.length) {
          this.messageContentData?.map((obj) => {
            obj.active = false;
          });
          this.messageContentData[this.navIndex].active = true;
          this.messageContentFreshData = this.messageContentData;
          this.getMessageContentFac(this.messageContentData[this.navIndex]._id);
        }
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  isContentLoading = false;
  getMessageContentFac(id) {
    this.isContentLoading = true;
    this.supremeService.getMessageContentFac(id).subscribe(
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
    this.getMessageContentFac(obj._id);
  }

  deleteMessageContentFacilitator(id: string) {
    this.svc.ui
      .warnDialog(
        "Sure you want to delete message content?",
        dialogButtonConfig,
        4
      )
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.supremeService
            .deleteMessageContentFac(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.selectedMessageContentData = null;
              this.messageContentData = [];
              this.navIndex = 0;
              this.getAllMessageContentFac();
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
      this.getMessageContentFac(firstIndexObj._id);
    } else {
      this.navIndex = 0;
      this.selectedMessageContentData = null;
    }
  }
}
