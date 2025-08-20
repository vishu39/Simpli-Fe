import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";

@Component({
  selector: "app-acknowledgement-modal",
  templateUrl: "./acknowledgement-modal.component.html",
  styleUrls: ["./acknowledgement-modal.component.scss"],
})
export class AcknowledgementModalComponent implements OnInit {
  dialogTitle: string;
  acknowledgementPayload: any;
  acknowledgementData: any;
  type: any;
  eventPayload: any;

  loginType = GET_LOGIN_TYPE();

  constructor(
    public dialogRef: MatDialogRef<AcknowledgementModalComponent>,
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close();
  }

  submit() {
    let modifiedEventData = {
      ...this.eventPayload,
    };

    if (!!this.acknowledgementPayload?.emailFrom) {
      modifiedEventData["emailFrom"] = this.acknowledgementPayload?.emailFrom;
    }

    let finalPayload = {
      eventName: this.type,
      eventData: modifiedEventData,
      mode: "popUp",
    };

    if (this.loginType === "hospital") {
      this.sendAcknowledgementForHospital(finalPayload);
    }
    if (this.loginType === "facilitator") {
      this.sendAcknowledgementForFacilitator(finalPayload);
    }
  }

  sendAcknowledgementForHospital(payload: any) {
    this.hospitalService.sendAcknowledgement(payload).subscribe((res:any)=>{
      this.sharedService.showNotification("snackBar-success", res.message);
      this.closeDialog(true)
    })
  }
  sendAcknowledgementForFacilitator(payload: any) {
    this.facilitatorService.sendAcknowledgement(payload).subscribe((res:any)=>{
      this.sharedService.showNotification("snackBar-success", res.message);
      this.closeDialog(true)
    })
  }
}
