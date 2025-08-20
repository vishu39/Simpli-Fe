import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { cloneDeep, reverse } from "lodash";
import tippy, { Instance } from "tippy.js";
import { startCase } from "lodash";

@Component({
  selector: "app-shared-timlime",
  templateUrl: "./shared-timlime.component.html",
  styleUrls: ["./shared-timlime.component.scss"],
})
export class SharedTimlimeComponent implements OnInit {
  dialogTitle: string;
  patientId: any;
  component: string;
  historyData: any = [];

  isPatientLoading: boolean = true;
  patientData: any;

  constructor(
    private dialogRef: MatDialogRef<SharedTimlimeComponent>,
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService
  ) {}

  ngOnInit(): void {
    if (this.component === "hospital") {
      this.getHospitalPatientById();
    }
    if (this.component === "facilitator") {
      this.getFacilitatorPatientById();
    }
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  getFacilitatorPatientById() {
    this.isPatientLoading = true;
    this.facilitatorService.getPatient(this.patientId).subscribe(
      (res: any) => {
        this.patientData = res.data;
        let array = cloneDeep(this.patientData?.history);
        this.historyData = reverse(array);
        this.isPatientLoading = false;
      },
      () => {
        this.isPatientLoading = false;
      }
    );
  }

  getHospitalPatientById() {
    this.isPatientLoading = true;
    this.hospitalService.getPatient(this.patientId).subscribe(
      (res: any) => {
        this.patientData = res.data;
        let array = cloneDeep(this.patientData?.history);
        this.historyData = reverse(array);
        this.isPatientLoading = false;
      },
      () => {
        this.isPatientLoading = false;
      }
    );
  }

  showHospitalList(hospital: any) {
    let hospitalArray = [];
    hospital?.forEach((i: any) => {
      hospitalArray?.push(i?.hospitalName);
    });
    let str = hospitalArray?.join(", ");
    return str;
  }

  toolTip: any;
  showSendToDetailsOnHover(tooltipButton: any, item: any) {
    let eventString = "";

    if (item?.sendTo) {
      eventString += `<div><strong>Send To:</strong> ${startCase(
        item.sendTo
      )}</div>`;
    }
    eventString += `<div><strong>Email To:</strong> ${
      item?.emailTo || "NIL"
    }</div>`;
    eventString += `<div><strong>Email Cc:</strong> ${
      item?.emailCc?.length > 0 ? item.emailCc.join(", ") : "NIL"
    }</div>`;

    eventString += `<div><strong>Contact:</strong> ${
      item?.contact && item?.contact?.length > 0
        ? item.contact.join(", ")
        : "NIL"
    }</div>`;

    let tooltipInstance: any = tippy(tooltipButton, {
      content: eventString,
      trigger: "hover",
      placement: "bottom",
      theme: "custom",
      allowHTML: true,
      delay: [0, 0],
      duration: [0, 0],
      onShow(instance) {
        instance.popper.style.backgroundColor = "white";
        instance.popper.style.color = "black";
        instance.popper.style.border = "1px solid lightgrey";
        instance.popper.style.borderRadius = "8px";
        instance.popper.style.padding = "12px";
        instance.popper.style.width = "400px";
      },
    });

    this.toolTip = tooltipInstance;

    tooltipInstance.show();
  }

  hideDetails(tooltipButton: any, item: any) {
    this.toolTip.hide();
  }
}
