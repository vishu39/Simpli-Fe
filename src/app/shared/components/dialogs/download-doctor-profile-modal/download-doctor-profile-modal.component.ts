import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";
import FileSaver from "file-saver";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-download-doctor-profile-modal",
  templateUrl: "./download-doctor-profile-modal.component.html",
  styleUrls: ["./download-doctor-profile-modal.component.scss"],
})
export class DownloadDoctorProfileModalComponent implements OnInit {
  dialogTitle: string;
  doctorId: string;

  doctorProfileForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DownloadDoctorProfileModalComponent>,
    private facilitatorService: FacilitatorService,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  loginType = GET_LOGIN_TYPE();

  ngOnInit(): void {
    if (this.loginType === "hospital") {
      this.getDoctorFormatType();
    }
    this.getAllLanguages();
    this.createForm();
    this.doctorProfileForm.patchValue({
      targetLanguage: "en",
    });
  }

  formatList = [];
  isDataLoading = false;
  getDoctorFormatType() {
    this.isDataLoading = true;
    this.sharedService.getDoctorFormatType().subscribe(
      (res: any) => {
        if (res?.data) {
          this.formatList = res?.data;
          this.doctorProfileForm.patchValue({
            format: this.formatList[0]?.value,
          });
          this.isDataLoading = false;
        }
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  // Language Linking
  totalElementLanguage: number;
  timeoutLanguage = null;
  isLoadingLanguage = false;
  languageList = [];
  languageParams = {
    page: 1,
    limit: 0,
    search: "",
  };
  getAllLanguages() {
    if (this.isLoadingLanguage) {
      return;
    }
    this.isLoadingLanguage = true;

    this.sharedService
      .getCmsData("getAllLanguage", this.languageParams)
      .subscribe((res: any) => {
        this.languageList.push(...res.data.content);
        this.totalElementLanguage = res.data.totalElement;
        this.languageParams.page = this.languageParams.page + 1;
        this.isLoadingLanguage = false;
      });
  }

  onInfiniteScrollLanguage(): void {
    if (this.languageList.length < this.totalElementLanguage) {
      this.getAllLanguages();
    }
  }

  searchLanguage(filterValue: string) {
    clearTimeout(this.timeoutLanguage);
    this.timeoutLanguage = setTimeout(() => {
      this.languageParams.search = filterValue.trim();
      this.languageParams.page = 1;
      this.languageList = []; // Clear existing data when searching
      this.isLoadingLanguage = false;
      this.getAllLanguages();
    }, 600);
  }

  createForm() {
    if (this.loginType === "facilitator") {
      this.doctorProfileForm = this.fb.group({
        targetLanguage: [null, [Validators.required]],
      });
    }
    if (this.loginType === "hospital") {
      this.doctorProfileForm = this.fb.group({
        targetLanguage: [null, [Validators.required]],
        format: ["", [Validators.required]],
      });
    }
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  submit() {
    if (this.doctorProfileForm.valid) {
      let values = this.doctorProfileForm.getRawValue();
      let data = {
        doctorId: this.doctorId,
        targetLanguage: values?.targetLanguage,
      };
      if (this.loginType === "facilitator") {
        this.facilitatorService
          .downloadDoctorProfile(data)
          .subscribe((res: any) => {
            this.fileSaverFunction(res?.data);
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
      if (this.loginType === "hospital") {
        data["format"] = values?.format;
        this.hospitalService
          .downloadDoctorProfile(data)
          .subscribe((res: any) => {
            this.fileSaverFunction(res?.data);
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      this.doctorProfileForm.markAllAsTouched();
    }
  }

  fileSaverFunction(data: any) {
    data.forEach((e) => {
      const uint8Array = new Uint8Array(e?.content?.data);
      let blob = new Blob([uint8Array], { type: e?.contentType });
      FileSaver.saveAs(blob, e?.filename);
    });
  }
}
