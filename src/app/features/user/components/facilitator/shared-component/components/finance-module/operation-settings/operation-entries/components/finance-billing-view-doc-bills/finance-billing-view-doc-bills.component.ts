import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { UploadBillingDocComponent } from "../upload-billing-doc/upload-billing-doc.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "global-shared-finance-billing-view-doc-bills",
  templateUrl: "./finance-billing-view-doc-bills.component.html",
  styleUrls: ["./finance-billing-view-doc-bills.component.scss"],
})
export class FinanceBillingViewDocBillsComponent implements OnInit {
  @Input() patientData: any = {};
  panelOpenState: any;
  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllBillingDocForFinanceBilling();
  }

  docsParams: any = {
    page: 1,
    limit: 0,
    search: "",
  };
  isDocsLoading: boolean = false;
  docsData = [];
  getAllBillingDocForFinanceBilling() {
    this.isDocsLoading = true;
    this.facilitatorService
      .getAllBillingDocForFinanceBilling(this.docsParams, this.patientData?._id)
      .subscribe(
        (res: any) => {
          this.docsData = res?.data?.content;
          this.docsData?.map((data: any) => {
            data.billingDocs = [];
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
    this.getBillingDocForFinanceBillingById(i);
  }

  selectedHospital: any = "";
  getBillingDocForFinanceBillingById(i: any) {
    this.facilitatorService
      .getBillingDocForFinanceBillingById(this.patientData?._id, {
        hospitalId: this.selectedHospital?.hospitalId,
      })
      .subscribe((res: any) => {
        this.docsData[i].billingDocs = res?.data[0]?.billingDocs;
      });
  }

  openModalForEdit(item: any) {
    const dialogRef = this.dialog.open(UploadBillingDocComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Edit Billing Doc";
    dialogRef.componentInstance.patientData = this.patientData;
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.editingData = item;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
        this.docsData = [];
        this.getAllBillingDocForFinanceBilling();
      }
    });
  }
}
