import { Component, Input, OnInit } from "@angular/core";
import { AddVilDetailsComponent } from "../add-vil-details/add-vil-details.component";
import { MatDialog } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

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
    private hospitalService: HospitalService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllAddedVil();
    this.getAllAddedVilEdited();
  }

  isDataLoading = true;
  getAllAddedVil() {
    this.isDataLoading = true;
    this.hospitalService.getAllAddedVil(this.patientData?._id).subscribe(
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
  getAllAddedVilEdited() {
    this.isEditedDataLoading = true;
    this.hospitalService.getAllAddedVilEdited(this.patientData?._id).subscribe(
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
        this.getAllAddedVil();
        this.getAllAddedVilEdited();
      }
    });
  }
}
