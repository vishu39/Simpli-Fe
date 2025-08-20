import { Component, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-communication-setting",
  templateUrl: "./communication-setting.component.html",
  styleUrls: ["./communication-setting.component.scss"],
})
export class CommunicationSettingComponent implements OnInit {
  communicationData: any = {};
  isLoading: Boolean = true;

  constructor(
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getCommunicationSetting();
  }

  getCommunicationSetting() {
    this.isLoading = true;
    this.facilitatorService.getCommunicationSetting().subscribe(
      (res: any) => {
        this.communicationData = res.data;
        this.isLoading = false;
        this.mapEventArray();
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  mapEventArray(): void {
    this.eventArray[0].value = this.communicationData?.sendEmail || false;
    this.eventArray[1].value = this.communicationData?.sendMessage || false;
  }

  eventArray: any = [
    {
      title: "Send Email",
      value: false,
    },
    {
      title: "Send Message",
      value: false,
    },
  ];

  submit() {
    const settingId = this.communicationData?._id || null;
    let payload = {
      sendEmail: this.eventArray[0].value,
      sendMessage: this.eventArray[1].value,
    };

    if (!settingId) {
      this.facilitatorService
        .addCommunicationSetting(payload)
        .subscribe((res: any) => {
          this.getCommunicationSetting();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.facilitatorService
        .editCommunicationSetting(settingId, payload)
        .subscribe((res: any) => {
          this.getCommunicationSetting();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    }
  }
}
