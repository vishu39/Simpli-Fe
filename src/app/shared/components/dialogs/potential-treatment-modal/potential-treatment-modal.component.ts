import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-potential-treatment-modal",
  templateUrl: "./potential-treatment-modal.component.html",
  styleUrls: ["./potential-treatment-modal.component.scss"],
})
export class PotentialTreatmentModalComponent implements OnInit {
  dialogTitle: string = "";
  potentialData: any;

  constructor(
    public dialogRef: MatDialogRef<PotentialTreatmentModalComponent>
  ) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
