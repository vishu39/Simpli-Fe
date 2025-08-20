import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacilitatorService } from 'src/app/core/service/facilitator/facilitator.service';

@Component({
  selector: 'app-opd-request',
  templateUrl: './opd-request.component.html',
  styleUrls: ['./opd-request.component.scss']
})
export class OpdRequestComponent implements OnInit {
  opdRequestData: any
  patientData: any
  isLoading = false

  constructor(private faciliatorService: FacilitatorService, private router: Router) { }

  ngOnInit(): void {
    this.getOpdRequestByHospitalOpenLink()
  }

  getOpdRequestByHospitalOpenLink() {
    this.isLoading = true
    this.faciliatorService.getOpdRequestByHospitalOpenLink().subscribe((res: any) => {
      if (!res?.data?.opdRequest) {
        localStorage.clear()
        this.router.navigate(["/hospital/hospital-login"])
      }
      this.patientData = res?.data?.patient
      this.opdRequestData = res?.data?.opdRequest
      this.isLoading = false
    })
  }
}
