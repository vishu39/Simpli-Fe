import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-acknowledgement-setting",
  templateUrl: "./acknowledgement-setting.component.html",
  styleUrls: ["./acknowledgement-setting.component.scss"],
})
export class AcknowledgementSettingComponent implements OnInit {
  acknowledgementData: any[] = [];
  acknowledgementQueryManagementEventData: any[] = [];
  isLoading: Boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAcknowledgementQueryManagementEvent();
  }

  isPermissionError= false
  getAcknowledgementSetting() {
    this.isLoading = true;
    this.hospitalService.getAcknowledgementSetting().subscribe(
      (res: any) => {
        this.acknowledgementData = res.data;
        this.isLoading = false;
        this.isPermissionError= false
        this.mapEventArray();
      },
      (err) => {
        this.isLoading = false;
        if(err){
          this.isPermissionError= true
        }
      }
    );
  }

  getAcknowledgementQueryManagementEvent() {
    this.sharedService
      .getAcknowledgementQueryManagementEvent()
      .subscribe((res: any) => {
        this.acknowledgementQueryManagementEventData = res.data;
        this.getAcknowledgementSetting();
      });
  }

  eventsDataArray: any = [];
  mapEventArray(): void {
    this.eventsDataArray = [];
    this.modeArray[0].isActive = this.acknowledgementData[0]?.auto || false;
    this.modeArray[1].isActive =
      this.acknowledgementData[0]?.popup ||
      this.acknowledgementData[0]?.popUp ||
      false;

    this.acknowledgementQueryManagementEventData.map((item) => {
      const setting = this.acknowledgementData[0]?.event?.find(
        (data: any) => data.name === item
      );

      if (setting) {
        let eventObj = {
          name: setting?.name,
          value: setting?.value,
        };
        this.eventsDataArray.push(eventObj);
      } else {
        let eventObj = {
          name: item,
          value: false,
        };
        this.eventsDataArray.push(eventObj);
      }
    });
  }

  onToggleChange(event: any, index: any) {
    let { checked } = event;
    if (checked) {
      this.eventsDataArray[index].value = true;
    } else {
      this.eventsDataArray[index].value = false;
    }
  }

  modeArray: any = [
    {
      title: "Auto",
      isActive: false,
    },
    {
      title: "Popup",
      isActive: false,
    },
  ];

  onToggleModeChange(event: any, index: any) {
    let { checked } = event;
    if (checked) {
      this.modeArray?.forEach((mode:any) => {
        mode.isActive = false;
      });
      this.modeArray[index].isActive = true;
    } else {
      this.modeArray[index].isActive = false;
    }
  }

  submit() {
    const settingId = this.acknowledgementData[0]?._id || null;
    let payload = {
      event: this.eventsDataArray,
      auto: this.modeArray[0]?.isActive,
      popUp: this.modeArray[1]?.isActive,
    };

    if (!settingId) {
      this.hospitalService
        .addAcknowledgementSetting(payload)
        .subscribe((res: any) => {
          this.getAcknowledgementSetting();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.hospitalService
        .editAcknowledgementSetting(settingId, payload)
        .subscribe((res: any) => {
          this.getAcknowledgementSetting();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    }
  }
}
