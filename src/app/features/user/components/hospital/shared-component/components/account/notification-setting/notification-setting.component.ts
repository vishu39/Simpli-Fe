import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-notification-setting",
  templateUrl: "./notification-setting.component.html",
  styleUrls: ["./notification-setting.component.scss"],
})
export class NotificationSettingComponent implements OnInit {
  autoReminderSettingForms: FormGroup[] = [];
  autoReminderSettingData: any[] = [];
  queryManagementEventData: any[] = [];
  isLoading: Boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getNotificationSetting();
    this.getNotificationEvent();
  }

  // Initialize forms based on queryManagementEventData length
  initForms(): void {
    this.autoReminderSettingForms = this.queryManagementEventData?.map(
      (item) => {
        const setting = this.autoReminderSettingData.find(
          (data) => data.eventType === item
        );
        return this.createAutoReminderForm(
          setting || {
            eventType: item || "",
            time: [],
          }
        );
      }
    );
  }

  // Create a FormGroup for each Auto Reminder Setting
  createAutoReminderForm(setting: any): FormGroup {
    const form = this.formBuilder.group({
      eventType: [setting?.eventType || "", [Validators.required]], // Disable the eventType control
      time: setting?.time?.length
        ? this.formBuilder.array(this.createFormArrayForExisting(setting?.time))
        : this.formBuilder.array([this.createFormControlForArray()]),
    });

    form.get("eventType").disable();

    return form;
  }

  createFormArrayForExisting(data: any) {
    let newArray = [];
    data?.forEach((d: any) => {
      let newControl = new FormControl(d, [
        Validators.required,
        Validators.pattern(regexService.zeroToTwentyFourRegex),
      ]);
      newArray.push(newControl);
    });
    return newArray;
  }

  createFormControlForArray() {
    return new FormControl(null, [
      Validators.required,
      Validators.pattern(regexService.zeroToTwentyFourRegex),
    ]);
  }

  timeArray(i: number): FormArray {
    return this.autoReminderSettingForms[i].get("time") as FormArray;
  }

  addTimeInArray(index: number) {
    this.timeArray(index).push(this.createFormControlForArray());
  }

  removeTimeFromArray(mainIndex: number, index: number) {
    this.timeArray(mainIndex).removeAt(index);
  }

  getNotificationEvent() {
    this.sharedService.getNotificationEvent().subscribe((res: any) => {
      this.queryManagementEventData = res.data;
      this.initForms();
    });
  }

  getNotificationSetting() {
    this.isLoading = true;
    this.hospitalService.getNotificationSetting().subscribe(
      (res: any) => {
        this.autoReminderSettingData = res.data;
        this.isLoading = false;
        this.initForms();
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  // Handle form submission for a specific Auto Reminder Setting
  updateAutoReminderSetting(index: number) {
    const form = this.autoReminderSettingForms[index];
    const eventTypeValue = this.queryManagementEventData[index];
    form.value.eventType = eventTypeValue;
    if (form.valid) {
      const setting = this.autoReminderSettingData.find(
        (data) => data.eventType === form.value.eventType
      );
      const settingId = setting?._id || null;
      if (!settingId) {
        this.hospitalService
          .addNotificationSetting(form.value)
          .subscribe((res: any) => {
            this.getNotificationSetting();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      } else {
        // Update an existing Auto Reminder Setting
        this.hospitalService
          .editNotificationSetting(settingId, form.value)
          .subscribe((res: any) => {
            this.getNotificationSetting();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      }
    } else {
      // Mark form controls as touched to show validation errors
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
    }
  }
  resetAutoReminderSetting(index: number) {
    const form = this.autoReminderSettingForms[index];
    const eventTypeValue = this.queryManagementEventData[index];
    form.value.eventType = eventTypeValue;
    // console.log('form.value',form.value)
    if (form.valid) {
      const setting = this.autoReminderSettingData.find(
        (data) => data.eventType === form.value.eventType
      );
      // console.log('setting',setting)
      const settingId = setting?._id || null;
      form.value.time = [];
      if (!settingId) {
        // Add a new Auto Reminder Setting
        this.hospitalService
          .addNotificationSetting(form.value)
          .subscribe((res: any) => {
            this.getNotificationSetting();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      } else {
        // Update an existing Auto Reminder Setting
        this.hospitalService
          .editNotificationSetting(settingId, form.value)
          .subscribe((res: any) => {
            this.getNotificationSetting();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      }
    } else {
      // Mark form controls as touched to show validation errors
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
    }
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
}
