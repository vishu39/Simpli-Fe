import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dowload-details-dialog',
  templateUrl: './dowload-details-dialog.component.html',
  styleUrls: ['./dowload-details-dialog.component.scss']
})
export class DowloadDetailsDialogComponent implements OnInit {
  dialogTitle: string;
  selected: string
  patientData: any

  radioGroup = [
    { name: "Download Opinion", value: "opinion" },
    { name: "Download VIL", value: "vil" },
    { name: "Download Tickets", value: "confirmation" },
    { name: " Download Proforma Invoice", value: "proformaInvoice" },
  ]

  constructor(public dialogRef: MatDialogRef<DowloadDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.patientData = this.data?.patient
  }

  ngOnInit(): void {
    this.selected = "opinion"
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

}
