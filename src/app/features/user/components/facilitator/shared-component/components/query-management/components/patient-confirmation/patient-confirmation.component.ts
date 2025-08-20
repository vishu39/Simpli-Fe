import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddPatientConfirmationComponent } from "./components/add-patient-confirmation/add-patient-confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "shared-patient-confirmation",
  templateUrl: "./patient-confirmation.component.html",
  styleUrls: ["./patient-confirmation.component.scss"],
})
export class PatientConfirmationComponent implements OnInit {
  @Input() patientData: any;
  panelOpenState = false;
  requests: any = [];
  requestEdited: any = [];

  dialogButtonConfig = [
    { name: "NO", color: "warn" },
    { name: "YES", color: "primary" },
  ];

  constructor(
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllPatientConfirmation();
    this.getAllPatientConfirmationEdited();
  }

  isDataLoading = true;
  getAllPatientConfirmation() {
    this.requests = [];
    this.isDataLoading = true;
    this.faciliatorService
      .getAllPatientConfirmation(this.patientData?._id)
      .subscribe(
        (res: any) => {
          let data = res?.data;
          this.requests = data;
          this.isDataLoading = false;
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  isEditedDataLoading = true;
  getAllPatientConfirmationEdited() {
    this.requestEdited = [];
    this.isEditedDataLoading = true;
    this.faciliatorService
      .getAllPatientConfirmationEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          let data = res?.data;
          this.requestEdited = data;
          this.isEditedDataLoading = false;
        },
        (err) => {
          this.isEditedDataLoading = false;
        }
      );
  }

  remind(item: any) {
    if (!item?.aggregator?.length) {
      this.svc.ui
        .warnDialog(
          "Remind Patient Confirmation Request?",
          this.dialogButtonConfig,
          4
        )
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              patient: this.patientData?._id,
            };
            this.faciliatorService
              .resendPatientConfirmation(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllPatientConfirmation();
              });
          }
        });
    }
  }

  remindEdited(item: any) {
    if (!item?.aggregator?.length) {
      this.svc.ui
        .warnDialog(
          "Remind Patient Confirmation Request?",
          this.dialogButtonConfig,
          4
        )
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              _id: item?._id,
              patient: this.patientData?._id,
            };
            this.faciliatorService
              .resendPatientConfirmationEdited(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllPatientConfirmationEdited();
              });
          }
        });
    }
  }

  openEditModal(item: any) {
    this.panelOpenState = false;
    const dialogRef = this.dialog.open(AddPatientConfirmationComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        data: item,
        patientData: this.patientData,
      },
    });
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.title = "Edit Details";
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllPatientConfirmation();
        this.getAllPatientConfirmationEdited();
      }
    });
  }
}
