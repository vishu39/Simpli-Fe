import { Component, Input, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "shared-opinion",
  templateUrl: "./opinion.component.html",
  styleUrls: ["./opinion.component.scss"],
})
export class OpinionComponent implements OnInit {
  @Input() patientData: any;
  allPendingOpinionRequest = [];

  dialogButtonConfig = [
    { name: "NO", color: "warn" },
    { name: "YES", color: "primary" },
  ];

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getPendingOpinionRequest();
  }

  isDataLoading = true;
  getPendingOpinionRequest() {
    this.isDataLoading = true;
    this.hospitalService
      .getPendingOpinionRequest(this.patientData?._id)
      .subscribe(
        (res: any) => {
          this.allPendingOpinionRequest = res?.data;
          this.isDataLoading = false;
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  remind(item: any) {
    if (this.patientData?.referralType !== "pre") {
      this.svc.ui
        .warnDialog("Remind Opinion Request?", this.dialogButtonConfig, 4)
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              patient: this.patientData?._id,
            };
            this.hospitalService
              .resendOpinionRequest(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getPendingOpinionRequest();
              });
          }
        });
    }
  }
}
