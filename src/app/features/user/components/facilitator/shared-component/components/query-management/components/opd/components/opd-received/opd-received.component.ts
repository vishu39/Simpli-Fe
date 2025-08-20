import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { AddOpdDetailsComponent } from "../add-opd-details/add-opd-details.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "shared-opd-received",
  templateUrl: "./opd-received.component.html",
  styleUrls: ["./opd-received.component.scss"],
})
export class OpdReceivedComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;

  constructor(
    private faciliatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllOpdReceived();
    this.getAllOpdReceivedEdited();
  }

  isDataLoading = true;
  getAllOpdReceived() {
    this.isDataLoading = true;
    this.faciliatorService.getAllOpdReceived(this.patientData?._id).subscribe(
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
  getAllOpdReceivedEdited() {
    this.isEditedDataLoading = true;
    this.faciliatorService
      .getAllOpdReceivedEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            // console.log(res?.data);

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
    const dialogRef = this.dialog.open(AddOpdDetailsComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        data: item,
        patientData: this.patientData,
      },
    });
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.title = "Edit OPD Details";
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllOpdReceived();
        this.getAllOpdReceivedEdited();
      }
    });
  }
}
