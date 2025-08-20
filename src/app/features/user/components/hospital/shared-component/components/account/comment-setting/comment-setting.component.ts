import { Component, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-comment-setting",
  templateUrl: "./comment-setting.component.html",
  styleUrls: ["./comment-setting.component.scss"],
})
export class CommentSettingComponent implements OnInit {
  commentSettingData: any;
  isLoading: Boolean = true;

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.getCommentSetting();
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
    {
      title: "Send Push Notification",
      value: false,
    },
  ];

  getCommentSetting() {
    this.isLoading = true;
    this.hospitalService.getCommentSetting().subscribe(
      (res: any) => {
        this.commentSettingData = res.data;
        this.isLoading = false;
        if (this.commentSettingData) {
          this.eventArray[0].value =
            this.commentSettingData?.sendEmail || false;
          this.eventArray[1].value =
            this.commentSettingData?.sendMessage || false;
          this.eventArray[2].value =
            this.commentSettingData?.sendPushNotification || false;
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  formSubmit() {
    let payload = {
      sendEmail: this.eventArray[0].value,
      sendMessage: this.eventArray[1].value,
      sendPushNotification: this.eventArray[2].value,
    };
    if (!this.commentSettingData) {
      this.hospitalService.addCommentSetting(payload).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.getCommentSetting();
      });
    } else {
      this.hospitalService
        .editCommentSetting(this.commentSettingData?._id, payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.getCommentSetting();
        });
    }
  }
}
