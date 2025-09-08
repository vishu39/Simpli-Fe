import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import * as moment from "moment";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "global-shared-upload-final-bill",
  templateUrl: "./upload-final-bill.component.html",
  styleUrls: ["./upload-final-bill.component.scss"],
})
export class UploadFinalBillComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;
  isEdit: boolean = false;

  editingData: any = {};

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  constructor(
    public dialogRef: MatDialogRef<UploadFinalBillComponent>,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      admissionDate: ["", [Validators.required]],
      dischargeDate: ["", [Validators.required]],
      fileFirst: [""],
      fileSecond: [""],
      patient: [this.patientData?._id],
    });

    this.getHospitalData();
  }

  admissionTrackerData: any = {};
  getAdmissionDischargeTrackerForFinanceBillingById() {
    this.facilitatorService
      .getAdmissionDischargeTrackerForFinanceBillingById(
        this.patientData?._id,
        {
          hospitalId: this.formGroup?.getRawValue().hospitalId,
        }
      )
      .subscribe((res: any) => {
        this.dischargeSummaryArray = [];
        this.formGroup.patchValue({
          admissionDate: "",
          dischargeDate: "",
        });
        if (res?.data?.length) {
          this.admissionTrackerData = res?.data[0];
        }
        this.patchFromAdmissionData();
      });
  }

  dischargeSummaryArray: any = [];
  patchFromAdmissionData() {
    let newAdmissionDate: any = "";
    let newDischargeDate: any = "";
    if (!!this.admissionTrackerData?.admissionDate) {
      newAdmissionDate = moment(this.admissionTrackerData?.admissionDate);
    }
    if (!!this.admissionTrackerData?.dischargeDate) {
      newDischargeDate = moment(this.admissionTrackerData?.dischargeDate);
    }

    this.formGroup.patchValue({
      admissionDate: newAdmissionDate ? newAdmissionDate?.toDate() : "",
      dischargeDate: newDischargeDate ? newDischargeDate?.toDate() : "",
    });

    this.dischargeSummaryArray = this.admissionTrackerData?.dischargeSummary;
  }

  // Hospital linking
  hospitalData: any = [];
  totalElementHospital: number;
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutHospital = null;
  isLoadingHospital = false;

  getHospitalData() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService.getAllHospital(this.hospitalParams).subscribe(
      (res: any) => {
        if (!!res?.data?.content && res?.data?.content?.length > 0) {
          this.hospitalData.push(...res.data.content);
          this.totalElementHospital = res.data.totalElement;
          this.hospitalParams.page = this.hospitalParams.page + 1;
          this.isLoadingHospital = false;
        } else {
          this.isLoadingHospital = false;
        }
      },
      () => {
        this.isLoadingHospital = false;
      }
    );
  }

  onInfiniteScrollHospital(): void {
    if (this.hospitalData.length < this.totalElementHospital) {
      this.getHospitalData();
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalData = [];
      this.isLoadingHospital = false;
      this.getHospitalData();
    }, 600);
  }

  onChangeHospital(name: any) {
    this.formGroup.patchValue({
      hospitalName: name,
    });

    this.getAdmissionDischargeTrackerForFinanceBillingById();
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close({
      apiCall,
    });
  }

  actionSubmit(apiCall = false) {
    if (this.isEdit) {
      this.editFinalForm();
    } else {
      this.addFinalForm();
    }
  }

  fileFirstList: any[] = [];
  fileFirstPreviewUrls: string[] = [];

  fileSecondList: any[] = [];
  fileSecondPreviewUrls: string[] = [];
  onFileSelected(e: any, uploadFileType: string) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        if (uploadFileType === "fileFirst") {
          this.fileFirstPreviewUrls.push(fileUrl);
        }
        if (uploadFileType === "fileSecond") {
          this.fileSecondPreviewUrls.push(fileUrl);
        }

        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (uploadFileType === "fileFirst") {
            this.fileFirstPreviewUrls.push(reader.result as string);
          }
          if (uploadFileType === "fileSecond") {
            this.fileSecondPreviewUrls.push(reader.result as string);
          }
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      if (uploadFileType === "fileFirst") {
        this.fileFirstList.push(file);
      }
      if (uploadFileType === "fileSecond") {
        this.fileSecondList.push(file);
      }
    });
  }

  onDelete(index: number, uploadFileType: string) {
    if (index !== -1) {
      if (uploadFileType === "fileFirst") {
        this.fileFirstList.splice(index, 1);
        this.fileFirstPreviewUrls.splice(index, 1);
      }
      if (uploadFileType === "fileSecond") {
        this.fileSecondList.splice(index, 1);
        this.fileSecondPreviewUrls.splice(index, 1);
      }
    }
  }

  addFinalForm() {
    if (this.formGroup.valid) {
      let payload = {
        ...this.formGroup.getRawValue(),
      };

      delete payload["fileFirst"];
      delete payload["fileSecond"];

      let formData = new FormData();

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      if (this.dischargeSummaryArray?.length) {
        formData.append("dischargeSummary", JSON.stringify(this.dischargeSummaryArray));
      }

      for (var i = 0; i < this.fileFirstList?.length; i++) {
        formData.append("fileFirst", this.fileFirstList[i]);
      }

      for (var i = 0; i < this.fileSecondList?.length; i++) {
        formData.append("fileSecond", this.fileSecondList[i]);
      }

      this.facilitatorService
        .addFinalBillForFinanceBilling(formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);

          this.closeDialog(true);
        });
    }
  }

  editFinalForm() {
    let id = this.editingData._id;
    if (this.formGroup.valid) {
      let payload = {
        ...this.formGroup.getRawValue(),
      };

      delete payload["fileFirst"];
      delete payload["fileSecond"];

      let formData = new FormData();

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      for (var i = 0; i < this.fileFirstList?.length; i++) {
        formData.append("fileFirst", this.fileFirstList[i]);
      }

      for (var i = 0; i < this.fileSecondList?.length; i++) {
        formData.append("fileSecond", this.fileSecondList[i]);
      }

      this.facilitatorService
        .editFinalBillForFinanceBilling(id, formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);

          this.closeDialog(true);
        });
    }
  }
}
