import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-followup-setting",
  templateUrl: "./followup-setting.component.html",
  styleUrls: ["./followup-setting.component.scss"],
})
export class FollowupSettingComponent implements OnInit {
  followupData: any[] = [];
  followupQueryManagementEventData: any[] = [];
  isLoading: Boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getFollowUpQueryManagementEvent();
    this.eventForm = this.formBuilder.group({
      event: this.formBuilder.array([]),
    });
  }

  getFollowUpSetting() {
    this.isLoading = true;
    this.facilitatorService.getFollowUpSetting().subscribe(
      (res: any) => {
        this.followupData = res.data;
        this.isLoading = false;
        this.mapEventArray();
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getFollowUpQueryManagementEvent() {
    this.sharedService
      .getFollowUpQueryManagementEvent()
      .subscribe((res: any) => {
        this.followupQueryManagementEventData = res.data;
        this.getFollowUpSetting();
      });
  }

  eventsDataArray: any = [];
  eventForm: FormGroup;

  get eventArrayForm(): FormArray {
    return this.eventForm.get("event") as FormArray;
  }

  createEventFormGroup(obj: any) {
    let formObj = this.formBuilder.group({
      name: [obj?.name],
      time: [
        {
          value:obj?.time,
          disabled: obj?.popUp ? true : false
        },
        [Validators.pattern(regexService.positiveIntegerOneToInfinity)]
      ],
      auto: [obj?.auto],
      popUp: [obj?.popUp]
    });

    return formObj;
  }

  mapEventArray(): void {
    this.eventsDataArray = [];
    // this.modeArray[0].isActive = this.followupData[0]?.auto || false;
    // this.modeArray[1].isActive =
    //   this.followupData[0]?.popup || this.followupData[0]?.popUp || false;

    this.followupQueryManagementEventData.map((item) => {
      const setting = this.followupData[0]?.event?.find(
        (data: any) => data.name === item
      );

      if (setting) {
        let eventObj = {
          name: setting?.name,
          time: setting?.time,
          auto: setting?.auto,
          popUp: setting?.popUp
        };
        this.eventArrayForm.push(this.createEventFormGroup(eventObj));
      } else {
        let eventObj = {
          name: item,
          time: "",
          auto: false,
          popUp: false
        };
        this.eventArrayForm.push(this.createEventFormGroup(eventObj));
      }
    });
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

  onToggleModeChange(event: any, index: any,type:string) {    
    const group = this.eventArrayForm.at(index) as FormGroup;
    let { checked } = event;
    if (checked) {
        group.patchValue({ 
          auto: false,
          popUp: false
        });

        group.patchValue({ 
          [type]: true
        });

        if(type==='popUp'){
          group?.controls['time']?.disable()
        }else{
          group?.controls['time']?.enable()
        }

    } else {
      group.patchValue({ 
        [type]: false
      });
    }
  }


  submit() {
    if(this.eventForm?.valid){
    const settingId = this.followupData[0]?._id || null;
    let payload = {
      event: this.eventArrayForm?.getRawValue(),
      // auto: this.modeArray[0]?.isActive,
      // popUp: this.modeArray[1]?.isActive,
    };
    
    if (!settingId) {
      this.facilitatorService
        .addFollowUpSetting(payload)
        .subscribe((res: any) => {
          this.eventArrayForm?.clear()
          this.getFollowUpSetting();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.facilitatorService
        .editFollowUpSetting(settingId, payload)
        .subscribe((res: any) => {
          this.eventArrayForm?.clear()
          this.getFollowUpSetting();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    }
  }
  else{
    this.eventForm.markAllAsTouched()
  }
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
}
