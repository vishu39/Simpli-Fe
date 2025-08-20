import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "shared-vil",
  templateUrl: "./vil.component.html",
  styleUrls: ["./vil.component.scss"],
})
export class VilComponent implements OnInit {
  @Input() patientData: any;
  panelOpenState = false;
  requests: any = [];

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
    this.getAllVilRequest();
  }

  isDataLoading = true;
  getAllVilRequest() {
    this.isDataLoading = true;
    this.faciliatorService
      .getPendingVilRequest(this.patientData?._id)
      .subscribe(
        (res: any) => {
          let data = res?.data;
          this.requests = data;
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
        .warnDialog("Remind VIL Request?", this.dialogButtonConfig, 4)
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              patient: this.patientData?._id,
            };
            this.faciliatorService
              .resendVilRequest(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllVilRequest();
              });
          }
        });
    }
  }
}
