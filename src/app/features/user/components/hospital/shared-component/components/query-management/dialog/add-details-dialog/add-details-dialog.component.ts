import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-details-dialog",
  templateUrl: "./add-details-dialog.component.html",
  styleUrls: ["./add-details-dialog.component.scss"],
})
export class AddDetailsDialogComponent implements OnInit {
  dialogTitle: string;
  selected: string;
  patientData: any;

  radioGroup = [
    { name: "Add Opinion", value: "addOpinion" },
    { name: "Add Vil", value: "addVil" },
    { name: "Add OPD", value: "opdRequest" },
  ];

  constructor(
    public dialogRef: MatDialogRef<AddDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.patientData = this.data?.patient;
  }

  ngOnInit(): void {
    this.selected = "addOpinion";
  }

  isFormChange: any = "addOpinion";
  formChange(val: any) {
    this.isFormChange = val;
  }

  isDialogClosed = false;
  closeDialog(apiCall: boolean): void {
    this.isDialogClosed = true;
    this.dialogRef.close(apiCall);
  }
}
