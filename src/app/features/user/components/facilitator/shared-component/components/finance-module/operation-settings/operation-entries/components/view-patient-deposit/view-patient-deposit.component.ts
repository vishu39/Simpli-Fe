import { Component, Input, OnInit } from '@angular/core';
import { AddPatientDepositComponent } from '../add-patient-deposit/add-patient-deposit.component';
import { FacilitatorService } from 'src/app/core/service/facilitator/facilitator.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'global-shared-view-patient-deposit',
  templateUrl: './view-patient-deposit.component.html',
  styleUrls: ['./view-patient-deposit.component.scss']
})
export class ViewPatientDepositComponent implements OnInit {
 @Input() patientData: any = {};
  panelOpenState: any;
  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllPatientDepositForFinanceBilling();
  }

  docsParams: any = {
    page: 1,
    limit: 0,
    search: "",
  };
  isDocsLoading: boolean = false;
  docsData = [];
  getAllPatientDepositForFinanceBilling() {
    this.isDocsLoading = true;
    this.facilitatorService
      .getAllPatientDepositForFinanceBilling(this.docsParams, this.patientData?._id)
      .subscribe(
        (res: any) => {
          this.docsData = res?.data?.content;
          this.docsData?.map((data: any) => {
            data.paymentReciept = [];
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
    this.getPatientDepositForFinanceBillingById(i);
  }

  selectedHospital: any = "";
  getPatientDepositForFinanceBillingById(i: any) {
    this.facilitatorService
      .getPatientDepositForFinanceBillingById(this.patientData?._id, {
        hospitalId: this.selectedHospital?.hospitalId,
      })
      .subscribe((res: any) => {
        this.docsData[i].paymentReciept = res?.data[0]?.paymentReciept;
      });
  }

  openModalForEdit(item: any) {
    const dialogRef = this.dialog.open(AddPatientDepositComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Edit Patient Deposit";
    dialogRef.componentInstance.patientData = this.patientData;
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.editingData = item;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
        this.docsData=[]
        this.getAllPatientDepositForFinanceBilling()
      }
    });
  }
}
