import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
@Component({
  selector: "app-report-dialog",
  templateUrl: "./report-dialog.component.html",
  styleUrls: ["./report-dialog.component.scss"],
})
export class ReportDialogComponent implements OnInit {
  dialogTitle: string;
  reportForm: FormGroup;
  maxStartDate: Date;

  constructor(
    private dialogRef: MatDialogRef<ReportDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService
  ) {
    this.buildForm();
    const today = new Date();
    this.maxStartDate = today;
  }

  buildForm() {
    this.reportForm = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {}

  reportFormSubmit() {
    if (this.reportForm.valid) {
      new Date(this.reportForm.value.endDate);
      this.reportForm.value.endDate.setHours(23, 59, 59);
      this.facilitatorService
        .downloadPatientExcelReport(this.reportForm.value)
        .subscribe((res: any) => {
          window.open(res.data);
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
    } else {
      Object.keys(this.reportForm.controls).forEach((key) => {
        this.reportForm.controls[key].markAsTouched();
      });
    }
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
}
