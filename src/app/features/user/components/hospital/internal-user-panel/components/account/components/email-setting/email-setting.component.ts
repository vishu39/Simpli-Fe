import { Component, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-email-setting",
  templateUrl: "./email-setting.component.html",
  styleUrls: ["./email-setting.component.scss"],
})
export class EmailSettingComponent implements OnInit {
  isLoading: boolean = true;
  emailSettingData: any;

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getEmailSetting();
  }

  getEmailSetting() {
    // this.isLoading = true;
    // this.hospitalService.getEmailSetting().subscribe(
    //   (res: any) => {
    //     this.emailSettingData = res.data;
    //     this.isLoading = false;
    //   },
    //   (err) => {
    //     this.isLoading = false;
    //   }
    // );
  }

  submit(values: any) {
    if (!this.emailSettingData) {
      this.hospitalService.addEmailSetting(values).subscribe((res: any) => {
        this.getEmailSetting();
        this.sharedService.showNotification("snackBar-success", res.message);
      });
    } else {
      this.hospitalService
        .editEmailSetting(this.emailSettingData?._id, values)
        .subscribe((res: any) => {
          this.getEmailSetting();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    }
  }
}
