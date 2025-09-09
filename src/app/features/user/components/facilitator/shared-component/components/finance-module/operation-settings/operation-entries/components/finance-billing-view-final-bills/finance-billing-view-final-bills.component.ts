import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { UploadFinalBillComponent } from "../upload-final-bill/upload-final-bill.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "global-shared-finance-billing-view-final-bills",
  templateUrl: "./finance-billing-view-final-bills.component.html",
  styleUrls: ["./finance-billing-view-final-bills.component.scss"],
})
export class FinanceBillingViewFinalBillsComponent implements OnInit {
  @Input() patientData: any = {};
  panelOpenState: any;
  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllFinalBillForFinanceBilling();
  }

  docsParams: any = {
    page: 1,
    limit: 0,
    search: "",
  };
  isDocsLoading: boolean = false;
  docsData = [];
  getAllFinalBillForFinanceBilling() {
    this.isDocsLoading = true;
    this.facilitatorService
      .getAllFinalBillForFinanceBilling(this.docsParams, this.patientData?._id)
      .subscribe(
        (res: any) => {
          this.docsData = res?.data?.content;
          this.docsData?.map((data: any) => {
            data.finalBill = [];
            data.dischargeSummary = [];
          });
          this.isDocsLoading = false;
        },
        () => {
          this.isDocsLoading = false;
        }
      );
  }

  onClickAccordian(item: any, i: any) {
    this.selectedHospital = item;
    this.getFinalBillForFinanceBillingById(i);
  }

  selectedHospital: any = "";
  getFinalBillForFinanceBillingById(i: any) {
    this.facilitatorService
      .getFinalBillForFinanceBillingById(this.patientData?._id, {
        hospitalId: this.selectedHospital?.hospitalId,
      })
      .subscribe((res: any) => {
        this.docsData[i].finalBill = res?.data[0]?.finalBill;
        this.docsData[i].dischargeSummary = res?.data[0]?.dischargeSummary;
      });
  }

  openModalForEdit(item: any) {
    const dialogRef = this.dialog.open(UploadFinalBillComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Edit Final Bill";
    dialogRef.componentInstance.patientData = this.patientData;
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.editingData = item;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
        this.docsData=[]
        this.getAllFinalBillForFinanceBilling()
      }
    });
  }
}
