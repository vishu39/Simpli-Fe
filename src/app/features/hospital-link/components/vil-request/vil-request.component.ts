import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-vil-request",
  templateUrl: "./vil-request.component.html",
  styleUrls: ["./vil-request.component.scss"],
})
export class VilRequestComponent implements OnInit {
  requestData: any;
  patientData: any;
  isLoading: boolean = false;

  constructor(
    private faciliatorService: FacilitatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getVilRequestByHospitalOpenLink();
  }

  getVilRequestByHospitalOpenLink() {
    this.isLoading = true;
    this.faciliatorService
      .getVilRequestByHospitalOpenLink()
      .subscribe((res: any) => {
        let data = res?.data;
        if (!res?.data?.vilRequest) {
          localStorage.clear();
          this.router.navigate(["/hospital/hospital-login"]);
        }

        this.patientData = data?.patient;
        this.requestData = data?.vilRequest;
        this.isLoading = false;
      });
  }
}
