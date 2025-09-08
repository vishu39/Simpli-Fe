import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "global-shared-finance-billing-view-estimate-bills",
  templateUrl: "./finance-billing-view-estimate-bills.component.html",
  styleUrls: ["./finance-billing-view-estimate-bills.component.scss"],
})
export class FinanceBillingViewEstimateBillsComponent implements OnInit {
  @Input() patientData: any = {};
  panelOpenState: any;
  constructor(private facilitatorService: FacilitatorService) {}

  ngOnInit(): void {
    this.getAllEstimateDocForFinanceBilling();
  }

  docsParams: any = {
    page: 1,
    limit: 0,
    search: "",
  };
  isDocsLoading: boolean = false;
  docsData = [];
  getAllEstimateDocForFinanceBilling() {
    this.isDocsLoading = true;
    this.facilitatorService
      .getAllEstimateDocForFinanceBilling(this.docsParams, this.patientData?._id)
      .subscribe(
        (res: any) => {
          this.docsData = res?.data?.content;
          this.isDocsLoading = false;
        },
        () => {
          this.isDocsLoading = false;
        }
      );
  }

  hasEstimateNotGiven(): boolean {
  return this.docsData?.some(est => est?.estimateGiven === 'no');
}

hasEstimateGiven(): boolean {
  return this.docsData?.some(e => e?.estimateGiven === 'yes');
}
}
