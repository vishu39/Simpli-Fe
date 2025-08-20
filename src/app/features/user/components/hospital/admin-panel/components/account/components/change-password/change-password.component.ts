import { Component, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  submit(values: any) {
    this.hospitalService.changePassword(values).subscribe((res: any) => {
      localStorage.clear();
      location.reload();
      this.sharedService.showNotification("snackBar-success", res.message);
    });
  }
}
