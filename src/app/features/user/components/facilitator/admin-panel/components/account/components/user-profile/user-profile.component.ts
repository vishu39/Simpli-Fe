import { Component, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  isLoading: boolean = false;
  userProfileData: any;

  constructor(
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.isLoading = true;
    this.facilitatorService.getProfile().subscribe(
      (res: any) => {
        this.userProfileData = res.data;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  submit(values: any) {
    this.facilitatorService.editProfile(values).subscribe((res: any) => {
      this.sharedService.showNotification("snackBar-success", res.message);
      this.getProfile();
    });
  }
}
