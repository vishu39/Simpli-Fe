import { Component, Input, OnInit } from "@angular/core";
import { AddVilDetailsComponent } from "../add-vil-details/add-vil-details.component";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "shared-vil-received",
  templateUrl: "./vil-received.component.html",
  styleUrls: ["./vil-received.component.scss"],
})
export class VilReceivedComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;

  constructor(
    private faciliatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllVilReceived();
    this.getAllVilReceivedEdited();
  }

  isDataLoading = true;
  getAllVilReceived() {
    this.isDataLoading = true;
    this.faciliatorService.getAllVilReceived(this.patientData?._id).subscribe(
      (res: any) => {
        if (res?.data) {
          this.request = res?.data;
          this.isDataLoading = false;
        }
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  isEditedDataLoading = true;
  getAllVilReceivedEdited() {
    this.isEditedDataLoading = true;
    this.faciliatorService
      .getAllVilReceivedEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.requestEdited = res?.data;
            this.isEditedDataLoading = false;
          }
        },
        (err) => {
          this.isEditedDataLoading = false;
        }
      );
  }

  openEditModal(item: any) {
    const dialogRef = this.dialog.open(AddVilDetailsComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        data: item,
        patientData: this.patientData,
      },
    });
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.title = "Edit VIL Details";
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllVilReceived();
        this.getAllVilReceivedEdited();
      }
    });
  }
}
