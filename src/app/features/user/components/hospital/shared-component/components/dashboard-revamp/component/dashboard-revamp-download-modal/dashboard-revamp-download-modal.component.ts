import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-dashboard-revamp-download-modal",
  templateUrl: "./dashboard-revamp-download-modal.component.html",
  styleUrls: ["./dashboard-revamp-download-modal.component.scss"],
})
export class DashboardRevampDownloadModalComponent implements OnInit {
  dialogTitle: string = "";

  downloadTypeArray = [
    "Download Top Cards Summary CSV",
    "Download Complete PDF",
  ];

  constructor(
    private dialogRef: MatDialogRef<DashboardRevampDownloadModalComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  downloadTypeForm: FormGroup;
  createForm() {
    this.downloadTypeForm = this.fb.group({
      type: ["", [Validators.required]],
    });
  }

  closeDialog(apiCall: boolean, data = "") {
    this.dialogRef.close({
      apiCall,
      downloadType: data,
    });
  }

  submit() {
    if (this.downloadTypeForm.valid) {
      this.closeDialog(true, this.downloadTypeForm?.get?.("type")?.value);
    } else {
      this.downloadTypeForm.markAllAsTouched();
    }
  }
}
