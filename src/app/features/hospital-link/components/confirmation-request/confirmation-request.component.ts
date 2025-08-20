import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-confirmation-request",
  templateUrl: "./confirmation-request.component.html",
  styleUrls: ["./confirmation-request.component.scss"],
})
export class ConfirmationRequestComponent implements OnInit {
  requestData: any;
  patientData: any;
  isLoading: boolean = false;

  constructor(
    private faciliatorService: FacilitatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPatientConfirmationByHospitalOpenLink();
  }

  getPatientConfirmationByHospitalOpenLink() {
    this.isLoading = true;
    this.faciliatorService
      .getPatientConfirmationByHospitalOpenLink()
      .subscribe((res: any) => {
        let data = res?.data;
        if (!data?.patientConfirmation) {
          localStorage.clear();
          this.router.navigate(["/hospital/hospital-login"]);
        }
        this.patientData = data?.patient;
        this.requestData = data?.patientConfirmation;
        this.isLoading = false;
      });
  }
}
