import { Component, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "shared-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.scss"],
})
export class EmailComponent implements OnInit {
  navigationButtonArray = [];

  constructor(private hospitalService: HospitalService) {}

  ngOnInit(): void {
    // this.getUnreadEmailFetchCount();
  }

  // totalUnreadMessage = 0;
  // getUnreadEmailFetchCount() {
  //   this.hospitalService.getUnreadEmailFetchCount().subscribe((res: any) => {
  //     this.totalUnreadMessage = res?.data?.count;
  //   });
  // }
}
