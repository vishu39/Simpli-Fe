import { Component, OnInit } from "@angular/core";
import { treatingDoctorUserType } from "src/app/core/models/role";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  treatingDoctorUserType = treatingDoctorUserType;
  constructor(private sharedService: SharedService) {}

  decodedToken: any = this.sharedService.decodeToken();

  ngOnInit(): void {}
}
