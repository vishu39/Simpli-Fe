import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import jwtDecode from "jwt-decode";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "app-doctor-details",
  templateUrl: "./doctor-details.component.html",
  styleUrls: ["./doctor-details.component.scss"],
})
export class DoctorDetailsComponent implements OnInit {
  requestData: any;
  patientData: any;
  isLoading: boolean = false;

  constructor(
    private faciliatorService: FacilitatorService,
    private hospitalService: HospitalService,
    private router: Router
  ) {
    this.tokenDecode = jwtDecode(localStorage.getItem("loginLinkToken"));
  }
  tokenDecode: any;

  ngOnInit(): void {
    if (this.tokenDecode?.customerType === "facilitator") {
      this.getDoctorOpinionRequestByDoctorOpenLinkFacilitator();
    } else if (this.tokenDecode?.customerType === "hospital") {
      this.getDoctorOpinionRequestByDoctorOpenLinkHospital();
    }
  }

  getRefetch() {
    if (this.tokenDecode?.customerType === "facilitator") {
      this.getDoctorOpinionRequestByDoctorOpenLinkFacilitator();
    } else if (this.tokenDecode?.customerType === "hospital") {
      this.getDoctorOpinionRequestByDoctorOpenLinkHospital();
    }
  }

  getDoctorOpinionRequestByDoctorOpenLinkFacilitator() {
    this.isLoading = true;
    this.faciliatorService
      .getDoctorOpinionRequestByDoctorOpenLink()
      .subscribe((res: any) => {
        let data = res?.data;
        if (!res?.data?.opinionRequest) {
          localStorage.clear();
          this.router.navigate(["/hospital/hospital-login"]);
        }

        this.patientData = data?.patient;
        this.requestData = data?.opinionRequest;
        this.isLoading = false;
      });
  }

  getDoctorOpinionRequestByDoctorOpenLinkHospital() {
    this.isLoading = true;
    this.hospitalService
      .getDoctorOpinionRequestByDoctorOpenLink()
      .subscribe((res: any) => {
        let data = res?.data;
        this.patientData = data?.patient;
        this.requestData = data?.opinionRequest;
        this.isLoading = false;
      });
  }
}
