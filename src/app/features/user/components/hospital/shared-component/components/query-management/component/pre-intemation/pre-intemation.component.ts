import { Component, Input, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "shared-pre-intemation",
  templateUrl: "./pre-intemation.component.html",
  styleUrls: ["./pre-intemation.component.scss"],
})
export class PreIntemationComponent implements OnInit {
  @Input() patientData: any;
  request = [];

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
    this.getAllPreIntimation();
  }

  isDataLoading = true;
  getAllPreIntimation() {
    this.isDataLoading = true;
    this.hospitalService.getAllPreIntimation(this.patientData?._id).subscribe(
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
        .warnDialog("Remind Pre Intimation?", this.dialogButtonConfig, 4)
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              patient: this.patientData?._id,
            };
            this.hospitalService
              .resendPreIntimation(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllPreIntimation();
              });
          }
        });
    }
  }
}
