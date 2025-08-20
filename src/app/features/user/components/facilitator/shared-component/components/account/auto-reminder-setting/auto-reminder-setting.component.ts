// Inside your component class

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: 'shared-auto-reminder-setting',
  templateUrl: './auto-reminder-setting.component.html',
  styleUrls: ['./auto-reminder-setting.component.scss']
})
export class AutoReminderSettingComponent implements OnInit {
  autoReminderSettingForms: FormGroup[] = [];
  autoReminderSettingData: any[] = [];
  queryManagementEventData: any[] = [];
  isLoading:Boolean=true;

  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.getAutoReminderSettings();
    this.getQueryManagementEvent();
  }

  // Initialize forms based on queryManagementEventData length
  initForms(): void {
    this.autoReminderSettingForms = this.queryManagementEventData.map(item => {
      const setting = this.autoReminderSettingData.find(data => data.eventType === item);
      return this.createAutoReminderForm(setting || { eventType: item, time1: '', time2: '' });
    });
  }

  // Create a FormGroup for each Auto Reminder Setting
  createAutoReminderForm(setting: any): FormGroup {
    const form = this.formBuilder.group({
      eventType: [{ value: setting?.eventType || '', disabled: true }, [Validators.required]], // Disable the eventType control
      time1: [setting?.time1 || '', []],
      time2: [setting?.time2 || '', []]
    });

    // Disable the eventType control
    form.get('eventType').disable();

    return form;
  }

  // Fetch Auto Reminder Settings from the API
  getAutoReminderSettings() {
    this.isLoading=true;
    this.facilitatorService.getAutoReminderSetting().subscribe(
      (res: any) => {
        this.autoReminderSettingData = res.data;
        this.isLoading=false;
        this.initForms();
      },(err)=>{
        this.isLoading=false;
      }
    );
  }

  // Fetch Query Management Events from the API
  getQueryManagementEvent() {
    this.sharedService.getQueryManagementEvent().subscribe(
      (res: any) => {
        this.queryManagementEventData = res.data;
        this.initForms();
      }
    );
  }

  // Handle form submission for a specific Auto Reminder Setting
  updateAutoReminderSetting(index: number) {
    const form = this.autoReminderSettingForms[index];
    const eventTypeValue = this.queryManagementEventData[index]; 
    form.value.eventType=eventTypeValue
    // console.log('form.value',form.value)
    if (form.valid) {
      const setting = this.autoReminderSettingData.find(data => data.eventType === form.value.eventType);
      // console.log('setting',setting)
      const settingId = setting?._id || null;
      if (!settingId) {
        // Add a new Auto Reminder Setting
        this.facilitatorService.addAutoReminderSetting(form.value).subscribe(
          (res: any) => {
            this.getAutoReminderSettings();
            this.sharedService.showNotification('snackBar-success', res.message);
          }
        );
      } else {
        // Update an existing Auto Reminder Setting
        this.facilitatorService.editAutoReminderSetting(settingId, form.value).subscribe(
          (res: any) => {
            this.getAutoReminderSettings();
            this.sharedService.showNotification('snackBar-success', res.message);
          }
        );
      }
    } else {
      // Mark form controls as touched to show validation errors
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }
  resetAutoReminderSetting(index: number) {
    const form = this.autoReminderSettingForms[index];
    const eventTypeValue = this.queryManagementEventData[index]; 
    form.value.eventType=eventTypeValue
    // console.log('form.value',form.value)
    if (form.valid) {
      const setting = this.autoReminderSettingData.find(data => data.eventType === form.value.eventType);
      // console.log('setting',setting)
      const settingId = setting?._id || null;
      form.value.time1=null;
      form.value.time2=null;
      if (!settingId) {
        // Add a new Auto Reminder Setting
        this.facilitatorService.addAutoReminderSetting(form.value).subscribe(
          (res: any) => {
            this.getAutoReminderSettings();
            this.sharedService.showNotification('snackBar-success', res.message);
          }
        );
      } else {
        // Update an existing Auto Reminder Setting
        this.facilitatorService.editAutoReminderSetting(settingId, form.value).subscribe(
          (res: any) => {
            this.getAutoReminderSettings();
            this.sharedService.showNotification('snackBar-success', res.message);
          }
        );
      }
    } else {
      // Mark form controls as touched to show validation errors
      Object.keys(form.controls).forEach(key => {
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
