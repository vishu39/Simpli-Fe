import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "shared-finance-billing-view-hospital-uhid",
  templateUrl: "./finance-billing-view-hospital-uhid.component.html",
  styleUrls: ["./finance-billing-view-hospital-uhid.component.scss"],
})
export class FinanceBillingViewHospitalUhidComponent implements OnInit {
  @Input() patientData: any = {};

  constructor(private facilitatorService: FacilitatorService) { }

  ngOnInit(): void {
    this.getAllHospitalUhidForFinanceBilling();
  }

  hospitalUhidParams: any = {
    page: 1,
    limit: 0,
    search: "",
  };

  uhidArray: any = [];
  isLoading: any = false
  getAllHospitalUhidForFinanceBilling() {
    this.isLoading = true
    this.facilitatorService
      .getAllHospitalUhidForFinanceBilling(
        this.hospitalUhidParams,
        this.patientData?._id
      )
      .subscribe((res: any) => {
        this.uhidArray = res?.data?.content
        this.isLoading = false
      }, () => {
        this.isLoading = false
      });
  }
}
