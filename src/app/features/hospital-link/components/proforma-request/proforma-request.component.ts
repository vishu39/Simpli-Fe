import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacilitatorService } from 'src/app/core/service/facilitator/facilitator.service';

@Component({
  selector: 'app-proforma-request',
  templateUrl: './proforma-request.component.html',
  styleUrls: ['./proforma-request.component.scss']
})
export class ProformaRequestComponent implements OnInit {
  requestData: any
  patientData: any
  isLoading: boolean = false


  constructor(private faciliatorService: FacilitatorService, private router: Router) { }

  ngOnInit(): void {
    this.getProformaInvoiceRequestByHospitalOpenLink()
  }

  getProformaInvoiceRequestByHospitalOpenLink() {
    this.isLoading = true
    this.faciliatorService.getProformaInvoiceRequestByHospitalOpenLink().subscribe((res: any) => {
      let data = res?.data
      if (!res?.data?.proformaInvoiceRequest) {
        localStorage.clear()
        this.router.navigate(["/hospital/hospital-login"])
      }
      this.patientData = data?.patient
      this.requestData = data?.proformaInvoiceRequest
      this.isLoading = false
    })
  }

}
