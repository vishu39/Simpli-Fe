import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
@Component({
  selector: "app-template-setting",
  templateUrl: "./template-setting.component.html",
  styleUrls: ["./template-setting.component.scss"],
})
export class TemplateSettingComponent implements OnInit {
  templateSettingData: any;
  isLoading: Boolean = true;

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.getTemplateSetting();
  }

  getTemplateSetting() {
    this.isLoading = true;
    this.hospitalService.getTemplateSetting().subscribe(
      (res: any) => {
        this.templateSettingData = res.data;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  submit(values: any) {
    if (!this.templateSettingData) {
      this.hospitalService.addTemplateSetting(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.getTemplateSetting();
      });
    } else {
      this.hospitalService
        .editTemplateSetting(this.templateSettingData?._id, values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.getTemplateSetting();
        });
    }
  }
}
