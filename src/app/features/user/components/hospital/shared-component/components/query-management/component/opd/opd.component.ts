import { Component, Input, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "shared-opd",
  templateUrl: "./opd.component.html",
  styleUrls: ["./opd.component.scss"],
})
export class OpdComponent implements OnInit {
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
    this.getPendingOpdRequest();
  }

  isDataLoading = true;
  getPendingOpdRequest() {
    this.isDataLoading = true;
    this.hospitalService.getPendingOpdRequest(this.patientData?._id).subscribe(
      (res: any) => {
        this.request = res?.data;
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
        .warnDialog("Remind OPD Request?", this.dialogButtonConfig, 4)
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              patient: this.patientData?._id,
            };
            this.hospitalService
              .resendOpdRequest(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getPendingOpdRequest();
              });
          }
        });
    }
  }
}
