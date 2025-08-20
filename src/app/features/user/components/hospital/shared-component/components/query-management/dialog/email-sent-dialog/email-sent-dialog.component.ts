import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-email-sent-dialog",
  templateUrl: "./email-sent-dialog.component.html",
  styleUrls: ["./email-sent-dialog.component.scss"],
})
export class EmailSentDialogComponent implements OnInit {
  dialogTitle: string;
  selected: string;
  patientData: any;

  radioGroup = [
    { name: "Send Opinion", value: "opinion" },
    { name: "Send VIL", value: "vil" },
    { name: "Send OPD", value: "opd" },
    { name: " Send Proforma Invoice", value: "proformaInvoice" },
  ];

  constructor(
    public dialogRef: MatDialogRef<EmailSentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.patientData = this.data?.patient;
  }

  ngOnInit(): void {
    this.selected = "opinion";
  }

  isFormChange: any = "opinion";
  formChange(val: any) {
    this.isFormChange = val;
  }

  isDialogClosed = false;
  closeDialog(apiCall: boolean): void {
    this.isDialogClosed = true;
    this.dialogRef.close(apiCall);
  }
}
