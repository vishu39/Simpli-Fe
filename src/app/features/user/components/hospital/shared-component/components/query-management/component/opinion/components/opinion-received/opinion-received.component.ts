import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddOpinionDetailsComponent } from "../add-opinion-details/add-opinion-details.component";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

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
    private hospitalService: HospitalService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllAddedOpinion();
    this.getAllAddedOpinionEdited();
  }

  isDataLoading = true;
  getAllAddedOpinion() {
    this.isDataLoading = true;
    this.hospitalService.getAllAddedOpinion(this.patientData?._id).subscribe(
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
  getAllAddedOpinionEdited() {
    this.isEditedDataLoading = true;
    this.hospitalService
      .getAllAddedOpinionEdited(this.patientData?._id)
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
            this.hospitalService
              .approveOpinionReceived(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllAddedOpinion();
                this.getAllAddedOpinionEdited();
              });
          }
          if (type === "edited") {
            let payload = {
              _id: item?._id,
              patient: this.patientData?._id,
            };
            this.hospitalService
              .approveOpinionReceivedEdited(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllAddedOpinion();
                this.getAllAddedOpinionEdited();
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
        this.getAllAddedOpinion();
        this.getAllAddedOpinionEdited();
      }
    });
  }
}
