import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import FileSaver from "file-saver";

@Component({
  selector: "shared-dowload-proforma",
  templateUrl: "./dowload-proforma.component.html",
  styleUrls: ["./dowload-proforma.component.scss"],
})
export class DowloadProformaComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;
  emailFrom: FormGroup;
  hospitalArray = [];
  proformaInvoiceArray = [];

  constructor(
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailSentDialogComponent>
  ) {}

  ngOnInit(): void {
    this.getAllProformaInvoiceReceived();
    this.getAllProformaInvoiceReceivedEdited();
    this.createForm();
  }

  createForm() {
    this.emailFrom = this.fb.group({
      selectHospital: ["", [Validators.required]],
      hospital: [],
      sendProformaInvoice: {},
      patient: this.patientData?._id,
    });
  }

  isDataLoading = true;
  getAllProformaInvoiceReceived() {
    this.isDataLoading = true;
    this.faciliatorService
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
    this.faciliatorService
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

  selectChange(e: any, item: any, isEdited: boolean) {
    if (e.checked) {
      let vilObj = {
        _id: item?._id,
        isEdited,
      };
      this.proformaInvoiceArray.push(vilObj);
      this.hospitalArray.push(item?.hospitalId);
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendProformaInvoice: this.proformaInvoiceArray,
        selectHospital: item?._id,
      });
    } else {
      let hospitalIndex = this.hospitalArray.findIndex(
        (h: any) => h === item?.hospitalId
      );
      if (hospitalIndex !== -1) {
        this.hospitalArray.splice(hospitalIndex, 1);
      }
      let vilIndex = this.proformaInvoiceArray.findIndex(
        (vil: any) => vil?._id === item?._id
      );
      if (vilIndex !== -1) {
        this.proformaInvoiceArray.splice(vilIndex, 1);
      }
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendProformaInvoice: this.proformaInvoiceArray,
        selectHospital: item?._id,
      });
      if (!this.proformaInvoiceArray?.length) {
        this.emailFrom.patchValue({
          selectHospital: "",
        });
      }
    }
  }

  submit() {
    if (this.emailFrom.valid) {
      let values = this.emailFrom.value;
      const { hospital, sendProformaInvoice, patient } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        hospital: newHospital,
        sendProformaInvoice,
        patient,
      };

      this.faciliatorService
        .downloadProformaInvoice(payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);

          res?.data?.forEach((e) => {
            FileSaver.saveAs(e.signedUrl);
          });
          this.dialogRef.close(true);
        });
    } else {
      this.emailFrom.markAllAsTouched();
    }
  }
}
