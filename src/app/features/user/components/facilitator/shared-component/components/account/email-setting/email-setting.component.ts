import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { regexService } from "src/app/core/service/regex";
@Component({
  selector: "shared-email-setting",
  templateUrl: "./email-setting.component.html",
  styleUrls: ["./email-setting.component.scss"],
})
export class EmailSettingComponent implements OnInit {
  emailSettingForm: FormGroup;
  emailSettingData: any;
  isLoading: Boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.buildForm();
    this.getEmailSetting();
  }
  buildForm() {
    this.emailSettingForm = this.formBuilder.group({
      hospitalCommEmailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      hospitalCommPassword: ["", [Validators.required]],
      patientCommEmailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      patientCommPassword: ["", [Validators.required]],
      reportCommEmailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      reportCommPassword: ["", [Validators.required]],
      emailHost: ["", [Validators.required]],
    });
  }
  getEmailSetting() {
    this.isLoading = true;
    // this.facilitatorService.getEmailSetting().subscribe(
    //   (res: any) => {
    //     this.emailSettingData = res.data;
    //     this.isLoading = false;

    //     // console.log("this.emailSettingData", this.emailSettingData);
    //     if (this.emailSettingData) {
    //       this.emailSettingForm.patchValue({
    //         hospitalCommEmailId: this.emailSettingData.hospitalCommEmailId,
    //         hospitalCommPassword: this.emailSettingData.hospitalCommPassword,
    //         patientCommEmailId: this.emailSettingData.patientCommEmailId,
    //         patientCommPassword: this.emailSettingData.patientCommPassword,
    //         reportCommEmailId: this.emailSettingData.reportCommEmailId,
    //         reportCommPassword: this.emailSettingData.reportCommPassword,
    //         emailHost: this.emailSettingData.emailHost,
    //       });
    //     }
    // },
    (err) => {
      this.isLoading = false;
    };
    // );
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  formSubmit() {
    // console.log("this.emailSettingForm", this.emailSettingForm.value);
    if (this.emailSettingForm.valid) {
      if (!this.emailSettingData) {
        this.facilitatorService
          .addEmailSetting(this.emailSettingForm.value)
          .subscribe((res: any) => {
            this.getEmailSetting();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      } else {
        this.facilitatorService
          .editEmailSetting(
            this.emailSettingData?._id,
            this.emailSettingForm.value
          )
          .subscribe((res: any) => {
            this.getEmailSetting();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      }
    } else {
      Object.keys(this.emailSettingForm.controls).forEach((key) => {
        this.emailSettingForm.controls[key].markAsTouched();
      });
    }
  }
}
