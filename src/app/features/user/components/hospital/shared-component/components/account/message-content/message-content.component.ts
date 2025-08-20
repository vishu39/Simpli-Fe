import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {cloneDeep} from "lodash"
import { HospitalService } from 'src/app/core/service/hospital/hospital.service';
import { SharedService } from 'src/app/core/service/shared/shared.service';
import { CommonService } from 'src/app/smvt-framework/services/common.service';
import { AddMessageContentComponent } from './add-message-content/add-message-content.component';


const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: 'shared-message-content',
  templateUrl: './message-content.component.html',
  styleUrls: ['./message-content.component.scss']
})
export class MessageContentComponent implements OnInit {
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
    private hospitalService: HospitalService,
    private dialog: MatDialog,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllDefaultMessageContent();
  }

  addEmailContent(heading: string) {
    const dialogRef = this.dialog.open(AddMessageContentComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllDefaultMessageContent();
      }
    });
  }

  editEmailContent(heading: string) {
    const dialogRef = this.dialog.open(AddMessageContentComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(this.selectedEmailContentData);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllDefaultMessageContent();
      }
    });
  }

  isDataLoading = true;
  getAllDefaultMessageContent() {
    this.isDataLoading = true;
    this.hospitalService.getAllDefaultMessageContent().subscribe(
      (res: any) => {
        this.emailContentDefaultData = res.data;
        this.emailContentDefaultData.map((obj) => {
          obj.active = false;
        });

        this.emailContentDefaultFreshData= this.emailContentDefaultData
        this.hospitalService.getAllMessageContent().subscribe((res: any) => {
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
    this.hospitalService
      .editMessageContent(
        this.selectedEmailContentData._id,
        this.selectedEmailContentData
      )
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
      });
  }

  deleteMessageContent(id: string) {
    this.svc.ui
      .warnDialog(
        "Sure you want to delete message content?",
        dialogButtonConfig,
        4
      )
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.hospitalService.deleteMessageContent(id).subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.selectedEmailContentData = null;
            this.getAllDefaultMessageContent();
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
