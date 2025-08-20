import { Component, Input, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "app-treating-doc-pending-opinion",
  templateUrl: "./treating-doc-pending-opinion.component.html",
  styleUrls: ["./treating-doc-pending-opinion.component.scss"],
})
export class TreatingDocPendingOpinionComponent implements OnInit {
  @Input() patientData: any;
  request = [];

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  dialogButtonConfig = [
    { name: "NO", color: "warn" },
    { name: "YES", color: "primary" },
  ];

  ngOnInit(): void {
    this.getDoctorOpinionRequestByDoctorOpenLink();
  }

  isDataLoading = true;
  getDoctorOpinionRequestByDoctorOpenLink() {
    this.isDataLoading = true;
    this.hospitalService.getDoctorOpinionRequestByDoctorOpenLink().subscribe(
      (res: any) => {
        this.request = [res?.data?.opinionRequest];
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }
}
