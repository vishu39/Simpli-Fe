import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { UploadEstimatesComponent } from "../upload-estimates/upload-estimates.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "global-shared-finance-billing-view-estimate-bills",
  templateUrl: "./finance-billing-view-estimate-bills.component.html",
  styleUrls: ["./finance-billing-view-estimate-bills.component.scss"],
})
export class FinanceBillingViewEstimateBillsComponent implements OnInit {
  @Input() patientData: any = {};
  panelOpenState: any;
  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

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
      .getAllEstimateDocForFinanceBilling(
        this.docsParams,
        this.patientData?._id
      )
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
    return this.docsData?.some((est) => est?.estimateGiven === "no");
  }

  hasEstimateGiven(): boolean {
    return this.docsData?.some((e) => e?.estimateGiven === "yes");
  }

  openModalForEdit(item: any) {
    const dialogRef = this.dialog.open(UploadEstimatesComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Edit Estimate Docs";
    dialogRef.componentInstance.patientData = this.patientData;
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.editingData = item;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
        this.docsData=[]
        this.getAllEstimateDocForFinanceBilling()
      }
    });
  }
}
