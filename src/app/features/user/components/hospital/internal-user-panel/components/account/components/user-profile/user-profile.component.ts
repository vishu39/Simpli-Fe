import { Component, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
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
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.isLoading = true;
    this.hospitalService.getProfile().subscribe(
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
    this.hospitalService.editProfile(values).subscribe((res: any) => {
      this.sharedService.showNotification("snackBar-success", res.message);
      this.getProfile();
    });
  }
}
