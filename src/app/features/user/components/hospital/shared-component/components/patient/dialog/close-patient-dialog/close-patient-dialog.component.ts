import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
@Component({
  selector: "app-close-hospital-patient-dialog",
  templateUrl: "./close-patient-dialog.component.html",
  styleUrls: ["./close-patient-dialog.component.scss"],
})
export class ClosePatientDialogComponent implements OnInit {
  dialogTitle: string;
  closePatientForm: FormGroup;
  patientId: string;

  constructor(
    private dialogRef: MatDialogRef<ClosePatientDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {
    this.buildForm();
  }

  buildForm() {
    this.closePatientForm = this.formBuilder.group({
      closedReason: ["", [Validators.required]],
    });
  }
  ngOnInit(): void {}

  closePatientFormSubmit() {
    if (this.closePatientForm.valid) {
      this.hospitalService
        .closePatientQuery(this.patientId, this.closePatientForm.value)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
    } else {
      Object.keys(this.closePatientForm.controls).forEach((key) => {
        this.closePatientForm.controls[key].markAsTouched();
      });
    }
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
}
