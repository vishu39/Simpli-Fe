import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";

@Component({
  selector: "app-followup-modal",
  templateUrl: "./followup-modal.component.html",
  styleUrls: ["./followup-modal.component.scss"],
})
export class FollowupModalComponent implements OnInit {
  dialogTitle: string;
  followupPayload: any;
  followupData: any;
  type: any;
  eventPayload: any;

  loginType = GET_LOGIN_TYPE();

  formGp: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FollowupModalComponent>,
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGp = this.fb.group({
      followUpDate: ["", [Validators.required]],
    });
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close();
  }

  submit() {
    let modifiedEventData = {
      ...this.eventPayload,
    };

    if (!!this.followupPayload?.emailFrom) {
      modifiedEventData["emailFrom"] = this.followupPayload?.emailFrom;
    }

    let finalPayload = {
      eventName: this.type,
      patient: this.eventPayload?.patient,
      followUpDate: this.formGp?.getRawValue()?.followUpDate,
      // eventData: modifiedEventData,
      // mode: "popUp",
    };

    if (this.loginType === "hospital") {
      this.sendPopupForHospital(finalPayload);
    }
    if (this.loginType === "facilitator") {
      this.sendPopupForFacilitator(finalPayload);
    }
  }

  sendPopupForHospital(payload: any) {
    if (this.formGp?.valid) {
      this.hospitalService.addFollowUp(payload).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeDialog(true);
      });
    } else {
      this.formGp.markAllAsTouched();
    }
  }
  sendPopupForFacilitator(payload: any) {
    if (this.formGp?.valid) {
      this.facilitatorService.addFollowUp(payload).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeDialog(true);
      });
    } else {
      this.formGp.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
