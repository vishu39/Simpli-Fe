import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
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
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllPreIntimation();
  }

  isDataLoading = true;
  getAllPreIntimation() {
    this.isDataLoading = true;
    this.faciliatorService.getAllPreIntimation(this.patientData?._id).subscribe(
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
    if (!item?.aggregator?.length) {
      this.svc.ui
        .warnDialog("Remind Pre Intimation?", this.dialogButtonConfig, 4)
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              patient: this.patientData?._id,
            };
            this.faciliatorService
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
