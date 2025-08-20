import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "global-shared-add-hospital-uhid",
  templateUrl: "./add-hospital-uhid.component.html",
  styleUrls: ["./add-hospital-uhid.component.scss"],
})
export class AddHospitalUhidComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  constructor(public dialogRef: MatDialogRef<AddHospitalUhidComponent>) {}

  ngOnInit(): void {
    this.formGroup.patchValue({
      patient: this.patientData?._id,
    });
  }

  closeDialog(apiCall: boolean): void {
    this.formGroup.reset();
    this.dialogRef.close();
  }

  actionSubmit(apiCall = false) {
    this.dialogRef.close({
      apiCall,
    });
  }
}
