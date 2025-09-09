import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { AdmissionDischargeTrackerComponent } from "../admission-discharge-tracker/admission-discharge-tracker.component";

@Component({
  selector: "global-shared-finance-billing-view-admission-tracker-details",
  templateUrl:
    "./finance-billing-view-admission-tracker-details.component.html",
  styleUrls: [
    "./finance-billing-view-admission-tracker-details.component.scss",
  ],
})
export class FinanceBillingViewAdmissionTrackerDetailsComponent
  implements OnInit
{
  @Input() patientData: any = {};
  panelOpenState: any;
  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllAdmissionDischargeTrackerForFinanceBilling();
  }

  docsParams: any = {
    page: 1,
    limit: 0,
    search: "",
  };
  isDocsLoading: boolean = false;
  docsData = [];
  getAllAdmissionDischargeTrackerForFinanceBilling() {
    this.isDocsLoading = true;
    this.facilitatorService
      .getAllAdmissionDischargeTrackerForFinanceBilling(
        this.docsParams,
        this.patientData?._id
      )
      .subscribe(
        (res: any) => {
          this.docsData = res?.data?.content;
          this.docsData?.map((data: any) => {
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
    this.getAdmissionDischargeTrackerForFinanceBillingById(i);
  }

  selectedHospital: any = "";
  getAdmissionDischargeTrackerForFinanceBillingById(i: any) {
    this.facilitatorService
      .getAdmissionDischargeTrackerForFinanceBillingById(
        this.patientData?._id,
        {
          hospitalId: this.selectedHospital?.hospitalId,
        }
      )
      .subscribe((res: any) => {
        this.docsData[i].dischargeSummary = res?.data[0]?.dischargeSummary;
      });
  }

  openModalForEdit(item: any) {
    const dialogRef = this.dialog.open(AdmissionDischargeTrackerComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Edit Admission trakcer";
    dialogRef.componentInstance.patientData = this.patientData;
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.editingData = item;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
        this.docsData = [];
        this.getAllAdmissionDischargeTrackerForFinanceBilling();
      }
    });
  }
}
