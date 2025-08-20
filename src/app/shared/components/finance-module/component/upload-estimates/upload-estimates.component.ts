import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatRadioChange } from "@angular/material/radio";

@Component({
  selector: "global-shared-upload-estimates",
  templateUrl: "./upload-estimates.component.html",
  styleUrls: ["./upload-estimates.component.scss"],
})
export class UploadEstimatesComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  estimateOptions = ["yes", "no"];

  constructor(public dialogRef: MatDialogRef<UploadEstimatesComponent>) {}

  ngOnInit(): void {}

  onRadioChange(event: MatRadioChange) {
    let value = event.value;

    let hospitalIdControl = this.formGroup.get("hospitalId");
    let hospitalNameControl = this.formGroup.get("hospitalName");
    let estimateDateControl = this.formGroup.get("estimateDate");
    let roomCategoryControl = this.formGroup.get("roomCategory");
    let roomPriceControl = this.formGroup.get("roomPrice");
    let approxAdmissionDateControl = this.formGroup.get("approxAdmissionDate");
    let commentControl = this.formGroup.get("comment");

    if (value === "yes") {
      commentControl?.clearValidators();
      commentControl.updateValueAndValidity();

      this.formGroup.patchValue({
        comment: "",
      });

      hospitalIdControl?.setValidators([Validators.required]);
      hospitalIdControl.updateValueAndValidity();
      hospitalNameControl?.setValidators([Validators.required]);
      hospitalNameControl.updateValueAndValidity();
      estimateDateControl?.setValidators([Validators.required]);
      estimateDateControl.updateValueAndValidity();
      roomCategoryControl?.setValidators([Validators.required]);
      roomCategoryControl.updateValueAndValidity();
      roomPriceControl?.setValidators([Validators.required]);
      roomPriceControl.updateValueAndValidity();
      approxAdmissionDateControl?.setValidators([Validators.required]);
      approxAdmissionDateControl.updateValueAndValidity();
    } else if (value === "no") {
      hospitalIdControl.clearValidators();
      hospitalIdControl.updateValueAndValidity();
      hospitalNameControl.clearValidators();
      hospitalNameControl.updateValueAndValidity();
      estimateDateControl.clearValidators();
      estimateDateControl.updateValueAndValidity();
      roomCategoryControl.clearValidators();
      roomCategoryControl.updateValueAndValidity();
      roomPriceControl.clearValidators();
      roomPriceControl.updateValueAndValidity();
      approxAdmissionDateControl.clearValidators();
      approxAdmissionDateControl.updateValueAndValidity();

      this.formGroup.patchValue({
        hospitalId: "",
        hospitalName: "",
        estimateDate: "",
        roomCategory: "",
        roomPrice: "",
        approxAdmissionDate: "",
      });

      commentControl?.setValidators([Validators.required]);
      commentControl.updateValueAndValidity();
    }
  }
  closeDialog(apiCall: boolean): void {
    this.formGroup.reset();
    this.dialogRef.close();
  }

  actionSubmit(apiCall = false) {
    if (this.formGroup?.valid) {
      this.dialogRef.close({
        apiCall,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
