import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddDetailsDialogComponent } from "../../../../dialog/add-details-dialog/add-details-dialog.component";

@Component({
  selector: "shared-add-proforma-invoice-details",
  templateUrl: "./add-proforma-invoice-details.component.html",
  styleUrls: ["./add-proforma-invoice-details.component.scss"],
})
export class AddProformaInvoiceDetailsComponent implements OnInit {
  isLoadingRequest = false;
  proformaInvoceForm: FormGroup;
  request: any = [];
  title = "";
  isEdit = false;
  uploadedDoc: any = [];

  @Input() patientData: any;

  constructor(
    private faciliatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddDetailsDialogComponent>,
    public editDialogRef: MatDialogRef<AddProformaInvoiceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (!this.isEdit) {
      this.getPendingProformaInvoiceRequest();
    }
    this.buildForm();
    this.patchFormIfEdit();
  }

  patchFormIfEdit() {
    if (this.isEdit) {
      const { hospitalName, hospitalId, receivedAt, piId, proformaInvoice } =
        this.data.data;
      this.proformaInvoceForm.patchValue({
        hospitalId: hospitalId,
        hospitalName: hospitalName,
        receivedAt: receivedAt,
        piId: piId,
        patient: this.data?.patientData?._id,
        file: proformaInvoice,
      });
      this.proformaInvoceForm.get("hospitalName").disabled;
      this.uploadedDoc = [proformaInvoice];
    }
  }

  buildForm() {
    this.proformaInvoceForm = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: [
        {
          value: "",
          disabled: this.isEdit ? true : false,
        },
        [Validators.required],
      ],
      file: [[], [Validators.required]],
      receivedAt: [""],
      piId: ["", [Validators.required]],
      patient: [this.patientData?._id, [Validators.required]],
    });
  }

  getPendingProformaInvoiceRequest() {
    this.isLoadingRequest = true;
    this.faciliatorService
      .getPendingProformaInvoiceRequest(this.patientData?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.request = res?.data;
      });
  }

  onClickHospital(item: any) {
    this.proformaInvoceForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
      piId: item?.piId,
    });
  }

  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  onFileSelected(e: any) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
    const file = e.target.files[0];
    if (allowedExtensions.exec(file.name)) {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.filePreviewUrls = [fileUrl];
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreviewUrls = [reader.result as string];
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
    this.fileList = [file];
  }

  closeDialog(isBool) {
    this.editDialogRef.close(isBool);
  }

  submit() {
    if (this.proformaInvoceForm?.valid) {
      const { hospitalName, hospitalId, piId, patient, receivedAt } =
        this.proformaInvoceForm?.value;
      let formData = new FormData();

      let paylaod = {
        hospitalName: this.isEdit ? this.data.data.hospitalName : hospitalName,
        hospitalId,
        piId,
        receivedAt,
        patient,
      };

      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }

      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("file", this.fileList[i]);
      }

      if (!this.isEdit) {
        this.faciliatorService
          .proformaInvoiceReceived(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.dialogRef.close(true);
          });
      } else {
        formData.append("proformaInvoice", JSON.stringify(this.uploadedDoc[0]));
        this.faciliatorService
          .proformaInvoiceReceivedEdited(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      this.proformaInvoceForm.markAsTouched();
    }
  }
}
