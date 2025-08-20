import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { AddOpinionDetailsComponent } from "../add-opinion-details/add-opinion-details.component";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "shared-opinion-received",
  templateUrl: "./opinion-received.component.html",
  styleUrls: ["./opinion-received.component.scss"],
})
export class OpinionReceivedComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;

  dialogButtonConfig = [
    { name: "NO", color: "warn" },
    { name: "YES", color: "primary" },
  ];

  constructor(
    private faciliatorService: FacilitatorService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllOpinionReceived();
    this.getAllOpinionReceivedEdited();
  }

  isDataLoading = true;
  getAllOpinionReceived() {
    this.isDataLoading = true;
    this.faciliatorService
      .getAllOpinionReceived(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.request = res?.data;
            this.isDataLoading = false;
          }
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  isEditedDataLoading = true;
  getAllOpinionReceivedEdited() {
    this.isEditedDataLoading = true;
    this.faciliatorService
      .getAllOpinionReceivedEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.requestEdited = res?.data;
            this.isEditedDataLoading = false;
          }
        },
        (err) => {
          this.isEditedDataLoading = false;
        }
      );
  }

  approveOpinion(item: any, type: string) {
    this.svc.ui
      .warnDialog("Approve Opinion?", this.dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          if (type === "default") {
            let payload = {
              hospitalId: item?.hospitalId,
              patient: this.patientData?._id,
            };
            this.faciliatorService
              .approveOpinionReceived(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllOpinionReceived();
                this.getAllOpinionReceivedEdited();
              });
          }
          if (type === "edited") {
            let payload = {
              _id: item?._id,
              patient: this.patientData?._id,
            };
            this.faciliatorService
              .approveOpinionReceivedEdited(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllOpinionReceived();
                this.getAllOpinionReceivedEdited();
              });
          }
        }
      });
  }

  openEditModal(item: any) {
    const dialogRef = this.dialog.open(AddOpinionDetailsComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        data: item,
        patientData: this.patientData,
      },
    });
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.title = "Edit Opinion Details";
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllOpinionReceived();
        this.getAllOpinionReceivedEdited();
      }
    });
  }
}
