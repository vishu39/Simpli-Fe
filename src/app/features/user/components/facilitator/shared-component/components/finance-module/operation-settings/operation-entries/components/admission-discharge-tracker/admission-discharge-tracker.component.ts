import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "global-shared-admission-discharge-tracker",
  templateUrl: "./admission-discharge-tracker.component.html",
  styleUrls: ["./admission-discharge-tracker.component.scss"],
})
export class AdmissionDischargeTrackerComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;
  isEdit: boolean = false;
  editingData: any = {};

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  admissionOnPlannedDateOptions = ["yes", "no"];

  constructor(
    public dialogRef: MatDialogRef<AdmissionDischargeTrackerComponent>,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      admissionDate: ["", [Validators.required]],
      admittedOnPlannedDate: ["", [Validators.required]],
      admittedOnPlannedDateComment: ["", [Validators.required]],
      dischargeDate: ["", [Validators.required]],
      patient: [this.patientData?._id],
      file: [""],
    });

    this.getHospitalData();
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

  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  onFileSelected(e: any) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.filePreviewUrls.push(fileUrl);
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreviewUrls.push(reader.result as string);
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      this.fileList.push(file);
    });
  }

  onDelete(index: number) {
    if (index !== -1) {
      this.fileList.splice(index, 1);
      this.filePreviewUrls.splice(index, 1);
    }
  }

  addFinalForm() {
    if (this.formGroup.valid) {
      let payload = {
        ...this.formGroup.getRawValue(),
      };

      delete payload["file"];

      let formData = new FormData();

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("fileFirst", this.fileList[i]);
      }

      this.facilitatorService
        .addAdmissionDischargeTrackerForFinanceBilling(formData)
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

      let formData = new FormData();

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("fileFirst", this.fileList[i]);
      }

      this.facilitatorService
        .editAdmissionDischargeTrackerForFinanceBilling(id, formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);

          this.closeDialog(true);
        });
    }
  }
}
