import { Component, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-template-setting",
  templateUrl: "./template-setting.component.html",
  styleUrls: ["./template-setting.component.scss"],
})
export class TemplateSettingComponent implements OnInit {
  templateSettingData: any;
  isLoading: Boolean = true;

  constructor(
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.getTemplateSetting();
  }

  getTemplateSetting() {
    this.isLoading = true;
    this.facilitatorService.getTemplateSetting().subscribe(
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
      this.facilitatorService
        .addTemplateSetting(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.getTemplateSetting();
        });
    } else {
      this.facilitatorService
        .editTemplateSetting(this.templateSettingData?._id, values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.getTemplateSetting();
        });
    }
  }
}
