import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-treating-doc-added-opinion",
  templateUrl: "./treating-doc-added-opinion.component.html",
  styleUrls: ["./treating-doc-added-opinion.component.scss"],
})
export class TreatingDocAddedOpinionComponent implements OnInit {
  @Input() patientData: any;
  @Input() editFeatureEnabled = false;
  request = [];

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDoctorOpinionReceivedByHospitalOpenLink();
  }

  isDataLoading = true;
  getDoctorOpinionReceivedByHospitalOpenLink() {
    this.isDataLoading = true;
    this.hospitalService.getDoctorOpinionReceivedByHospitalOpenLink().subscribe(
      (res: any) => {
        if (!!res?.data) {
          this.request = [res?.data];
        }
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  // openEditModal(item: any) {
  //   const dialogRef = this.dialog.open(TreatmentDocAddDetailComponent, {
  //     width: "100%",
  //     disableClose: true,
  //     autoFocus: false,
  //     data: {
  //       data: item,
  //       patientData: this.patientData,
  //     },
  //   });
  //   dialogRef.componentInstance.isEdit = true;
  //   dialogRef.componentInstance.dialogTitle = "Edit Doctor Opinion Details";
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result == true) {
  //       this.getAllAddedOpinionByDoctor();
  //     }
  //   });
  // }
}
