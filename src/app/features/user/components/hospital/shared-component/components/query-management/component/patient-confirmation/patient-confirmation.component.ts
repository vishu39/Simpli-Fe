import { Component, Input, OnInit } from "@angular/core";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddPatientConfirmationComponent } from "./components/add-patient-confirmation/add-patient-confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { AddPatientConfirmationDetailsComponent } from "./components/add-patient-confirmation-details/add-patient-confirmation-details.component";

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
    private hospitalService: HospitalService,
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
    this.hospitalService
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
    this.hospitalService
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

  remind(item: any) {
    if (this.patientData?.referralType !== "pre") {
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
            this.hospitalService
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
    if (this.patientData?.referralType !== "pre") {
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
            this.hospitalService
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
}
