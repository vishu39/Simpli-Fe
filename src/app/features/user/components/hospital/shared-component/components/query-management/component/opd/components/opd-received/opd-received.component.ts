import { Component, Input, OnInit } from "@angular/core";
import { AddOpdDetailsComponent } from "../add-opd-details/add-opd-details.component";
import { MatDialog } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

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
    private hospitalService: HospitalService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllAddedOpd();
    this.getAllAddedOpdEdited();
  }

  isDataLoading = true;
  getAllAddedOpd() {
    this.isDataLoading = true;
    this.hospitalService.getAllAddedOpd(this.patientData?._id).subscribe(
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
  getAllAddedOpdEdited() {
    this.isEditedDataLoading = true;
    this.hospitalService.getAllAddedOpdEdited(this.patientData?._id).subscribe(
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
        this.getAllAddedOpd();
        this.getAllAddedOpdEdited();
      }
    });
  }
}
