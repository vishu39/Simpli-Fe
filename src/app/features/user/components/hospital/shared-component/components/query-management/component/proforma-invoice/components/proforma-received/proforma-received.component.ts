import { Component, Input, OnInit } from "@angular/core";
import { AddProformaInvoiceDetailsComponent } from "../add-proforma-invoice-details/add-proforma-invoice-details.component";
import { MatDialog } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "shared-proforma-received",
  templateUrl: "./proforma-received.component.html",
  styleUrls: ["./proforma-received.component.scss"],
})
export class ProformaReceivedComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  requestEdited = [];

  constructor(
    private hospitalService: HospitalService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllProformaInvoiceReceived();
    this.getAllProformaInvoiceReceivedEdited();
  }

  isDataLoading = true;
  getAllProformaInvoiceReceived() {
    this.isDataLoading = true;
    this.hospitalService
      .getAllProformaInvoiceReceived(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.request = res?.data;
            this.isDataLoading = false;
          }
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  isEditedDataLoading = true;
  getAllProformaInvoiceReceivedEdited() {
    this.isEditedDataLoading = true;
    this.hospitalService
      .getAllProformaInvoiceReceivedEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.requestEdited = res?.data;
            this.isEditedDataLoading = false;
          }
        },
        (err) => {
          this.isEditedDataLoading = false;
        }
      );
  }

  openEditModal(item: any) {
    const dialogRef = this.dialog.open(AddProformaInvoiceDetailsComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        data: item,
        patientData: this.patientData,
      },
    });
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.title = "Edit Proforma Invoice Details";
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllProformaInvoiceReceived();
        this.getAllProformaInvoiceReceivedEdited();
      }
    });
  }
}
