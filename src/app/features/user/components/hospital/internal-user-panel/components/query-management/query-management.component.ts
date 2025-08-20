import { Component, OnInit } from "@angular/core";
import { treatingDoctorUserType } from "src/app/core/models/role";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-query-management",
  templateUrl: "./query-management.component.html",
  styleUrls: ["./query-management.component.scss"],
})
export class QueryManagementComponent implements OnInit {
  treatingDoctorUserType = treatingDoctorUserType;
  constructor(private sharedService: SharedService) {}

  decodedToken: any = this.sharedService.decodeToken();

  ngOnInit(): void {}
}
