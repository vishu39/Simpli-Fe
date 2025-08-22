import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-master-data-view-docs",
  templateUrl: "./master-data-view-docs.component.html",
  styleUrls: ["./master-data-view-docs.component.scss"],
})
export class MasterDataViewDocsComponent implements OnInit {
  dialogTitle: string = "";
  inputData: any = {};
  selectedMasterOption: any = {};

  constructor(private dialogRef: MatDialogRef<MasterDataViewDocsComponent>) {}

  ngOnInit(): void {}

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
}
