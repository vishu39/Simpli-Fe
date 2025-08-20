import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import {cloneDeep} from 'lodash'

@Component({
  selector: "shared-vil",
  templateUrl: "./vil.component.html",
  styleUrls: ["./vil.component.scss"],
})
export class VilComponent implements OnInit {
  @Input() patientData: any;
  clonedOldPatientData:any
  panelOpenState = false;
  requests: any = [];

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
    this.clonedOldPatientData= cloneDeep(this.patientData)
    this.getAllVilRequest();
  }

  refetch() {
    this.requests = [];
    this.getPatientById();
  }

  getPatientById() {
    this.hospitalService
      .getPatient(this.clonedOldPatientData?._id)
      .subscribe((res: any) => {
        this.patientData = res?.data;
        this.getAllVilRequest();
      });
  }

  isDataLoading = true;
  getAllVilRequest() {
    this.isDataLoading = true;
    this.hospitalService.getPendingVilRequest(this.patientData?._id).subscribe(
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
    if (this.patientData?.referralType !== "pre") {
      this.svc.ui
        .warnDialog("Remind VIL Request?", this.dialogButtonConfig, 4)
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              patient: this.patientData?._id,
            };
            this.hospitalService
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
