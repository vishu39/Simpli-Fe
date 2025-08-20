import { Component, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  submit(values: any) {
    this.facilitatorService.changePassword(values).subscribe((res: any) => {
      localStorage.clear();
      location.reload();
      this.sharedService.showNotification("snackBar-success", res.message);
    });
  }
}
