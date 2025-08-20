import { Component, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-account-details",
  templateUrl: "./account-details.component.html",
  styleUrls: ["./account-details.component.scss"],
})
export class AccountDetailsComponent implements OnInit {
  accountDetailsData: any = null;
  isLoading: Boolean = true;

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getAccountDetails();
  }

  getAccountDetails() {
    this.isLoading = true;
    this.hospitalService.getAccountDetails().subscribe(
      (res: any) => {
        this.accountDetailsData = res.data;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  submit(formData: any) {
    if (!this.accountDetailsData) {
      this.hospitalService.addAccountDetails(formData).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        location.reload();
      });
    } else {
      this.hospitalService
        .editAccountDetails(formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          location.reload();
        });
    }
  }
}
