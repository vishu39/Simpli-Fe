import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-hospital-dialog",
  templateUrl: "./add-hospital-dialog.component.html",
  styleUrls: ["./add-hospital-dialog.component.scss"],
})
export class AddHospitalDialogComponent implements OnInit {
  dialogTitle: string;
  selected: string;
  addOpinionForm: FormGroup;
  patientData: any;
  radioGroup = [
    { name: "Pre Intimation", value: "preIntimation" },
    { name: "OPD Request", value: "opdRequest" },
    { name: "Proforma Invoice", value: "proformaInvoice" },
    { name: "Opinion Request", value: "opinionRequest" },
    { name: "Request VIL", value: "requestVil" },
    { name: "Confirmation", value: "confirmation" },
  ];

  constructor(
    public dialogRef: MatDialogRef<AddHospitalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.patientData = this.data?.patient;
  }

  ngOnInit(): void {
    this.selected = "opinionRequest";
  }

  isFormChange = "opinionRequest";
  selectChange(value: string) {
    this.isFormChange = value;
  }

  isDialogClosed = false;
  closeDialog(apiCall: boolean): void {
    this.isDialogClosed = true;
    this.dialogRef.close(apiCall);
    // this.selected = "opinionRequest"
  }
}
