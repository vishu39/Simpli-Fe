import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { currencies } from "currencies.json";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-add-treatment-package-dialog",
  templateUrl: "./add-treatment-package-dialog.component.html",
  styleUrls: ["./add-treatment-package-dialog.component.scss"],
})
export class AddTreatmentPackageDialogComponent implements OnInit {
  dialogTitle: string = "Add Package";
  isEdit = false;
  packageData: any = {};

  isLoadingRequest = false;
  treatmentPackageForm: FormGroup;
  request: any = [];
  dataLoading: boolean = false;
  title = "";

  durationData = ["day", "week", "month", "year"];

  allCurrencies: any = currencies;
  currencyArray = [];
  currencyFreshList = [];
  preferredCurrencies: string[] = ["USD", "INR", "EUR", "OMR"];
  timeoutCurrency = null;

  constructor(
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddTreatmentPackageDialogComponent>
  ) {}

  ngOnInit(): void {
    this.sortCurrencies();
    this.buildForm();
    this.getDoctorData();

    if (!this.isEdit) {
      let usdCurrencyIndex = this.currencyArray?.findIndex(
        (ca: any) => ca?.code === "USD"
      );
      if (usdCurrencyIndex !== -1) {
        this.treatmentPackageForm.patchValue({
          currency: this.currencyArray[usdCurrencyIndex],
        });
      }
      this.patchDraft();
    } else {
      this.getTreatmentPackage();
    }
  }

  retrivedPackageDataFromApi: any = {};

  getTreatmentPackage() {
    this.hospitalService
      .getTreatmentPackage(this.packageData?._id)
      .subscribe((res: any) => {
        this.retrivedPackageDataFromApi = res.data;
        this.patchFormIfEdit(this.retrivedPackageDataFromApi);
      });
  }

  patchFormIfEdit(data: any) {
    if (this.isEdit) {
      const {
        doctorName,
        doctorId,
        hospitalDuration,
        countryDuration,
        stayInCountry,
        stayInHospital,
        initialEvaluationMinimum,
        initialEvaluationMaximum,
        diagnosis,
        remarks,
        treatmentPlan,
        treatment,
        currency,
        treatmentPackageFile,
        name,
      } = data;

      this.treatmentArray.removeAt(0);
      treatment.forEach((t: any) => {
        let formObj: FormGroup = this.createTreatmentform();
        formObj.patchValue({
          name: t?.name,
          room: t?.room,
          minCost: t?.minCost,
          maxCost: t?.maxCost,
        });

        this.treatmentArray.push(formObj);
      });

      this.treatmentPackageFile = treatmentPackageFile;

      this.treatmentPackageForm.patchValue({
        diagnosis: diagnosis,
        treatmentPlan: treatmentPlan,
        stayInCountry: stayInCountry,
        stayInHospital: stayInHospital,
        hospitalDuration: hospitalDuration,
        countryDuration: countryDuration,
        remarks: remarks,
        initialEvaluationMinimum: initialEvaluationMinimum,
        initialEvaluationMaximum: initialEvaluationMaximum,
        currency: currency,
        name: name,
      });
    }
  }

  patchDraft() {
    let treatmentPackageDraftData: any = JSON.parse(
      localStorage.getItem(`treatmentPackageDraft`)
    );

    if (!!treatmentPackageDraftData) {
      if (
        !!treatmentPackageDraftData?.doctorId ||
        !!treatmentPackageDraftData?.doctorName ||
        !!treatmentPackageDraftData?.otherDoctorName ||
        !!treatmentPackageDraftData?.hospitalDuration ||
        !!treatmentPackageDraftData?.countryDuration ||
        !!treatmentPackageDraftData?.stayInCountry ||
        !!treatmentPackageDraftData?.stayInHospital ||
        !!treatmentPackageDraftData?.initialEvaluationMinimum ||
        !!treatmentPackageDraftData?.initialEvaluationMaximum ||
        !!treatmentPackageDraftData?.diagnosis ||
        !!treatmentPackageDraftData?.remarks ||
        !!treatmentPackageDraftData?.treatmentPlan ||
        !!treatmentPackageDraftData?.receivedAt ||
        !!treatmentPackageDraftData?.currency ||
        !!treatmentPackageDraftData?.treatment ||
        !!treatmentPackageDraftData?.name
      ) {
        this.treatmentArray.removeAt(0);
        treatmentPackageDraftData?.treatment?.forEach((t: any) => {
          let formObj: FormGroup = this.createTreatmentform();
          formObj.patchValue({
            name: t?.name,
            room: t?.room,
            minCost: t?.minCost,
            maxCost: t?.maxCost,
          });
          this.treatmentArray.push(formObj);
        });

        let oData = cloneDeep(treatmentPackageDraftData);

        if (oData["treatment"]?.length > 0) {
          delete oData["treatment"];
        }

        this.treatmentPackageForm.patchValue({
          ...oData,
        });
      }
    }

    // localStorage.removeItem(`treatmentPackageDraft`);
  }

  saveDraft() {
    if (
      !!this.treatmentPackageForm?.getRawValue()?.name ||
      !!this.treatmentPackageForm?.getRawValue()?.doctorId ||
      !!this.treatmentPackageForm?.getRawValue()?.doctorName ||
      !!this.treatmentPackageForm?.getRawValue()?.otherDoctorName ||
      !!this.treatmentPackageForm?.getRawValue()?.hospitalDuration ||
      !!this.treatmentPackageForm?.getRawValue()?.countryDuration ||
      !!this.treatmentPackageForm?.getRawValue()?.stayInCountry ||
      !!this.treatmentPackageForm?.getRawValue()?.stayInHospital ||
      !!this.treatmentPackageForm?.getRawValue()?.initialEvaluationMinimum ||
      !!this.treatmentPackageForm?.getRawValue()?.initialEvaluationMaximum ||
      !!this.treatmentPackageForm?.getRawValue()?.diagnosis ||
      !!this.treatmentPackageForm?.getRawValue()?.remarks ||
      !!this.treatmentPackageForm?.getRawValue()?.receivedAt ||
      !!this.treatmentPackageForm?.getRawValue()?.currency ||
      !!this.treatmentPackageForm?.getRawValue()?.treatmentPlan
    ) {
      let treatmentPackageDraftData = {
        doctorId: this.treatmentPackageForm?.getRawValue()?.doctorId,
        doctorName: this.treatmentPackageForm?.getRawValue()?.doctorName,
        otherDoctorName:
          this.treatmentPackageForm?.getRawValue()?.otherDoctorName,
        hospitalDuration:
          this.treatmentPackageForm?.getRawValue()?.hospitalDuration,
        countryDuration:
          this.treatmentPackageForm?.getRawValue()?.countryDuration,
        stayInCountry: this.treatmentPackageForm?.getRawValue()?.stayInCountry,
        stayInHospital:
          this.treatmentPackageForm?.getRawValue()?.stayInHospital,
        initialEvaluationMinimum:
          this.treatmentPackageForm?.getRawValue()?.initialEvaluationMinimum,
        initialEvaluationMaximum:
          this.treatmentPackageForm?.getRawValue()?.initialEvaluationMaximum,
        diagnosis: this.treatmentPackageForm?.getRawValue()?.diagnosis,
        remarks: this.treatmentPackageForm?.getRawValue()?.remarks,
        treatmentPlan: this.treatmentPackageForm?.getRawValue()?.treatmentPlan,
        treatment: this.treatmentPackageForm?.getRawValue()?.treatment,
        receivedAt: this.treatmentPackageForm?.getRawValue()?.receivedAt,
        currency: this.treatmentPackageForm?.getRawValue()?.currency,
        name: this.treatmentPackageForm?.getRawValue()?.name,
      };

      localStorage.setItem(
        `treatmentPackageDraft`,
        JSON.stringify(treatmentPackageDraftData)
      );
    }
  }

  closeDialog(isBool) {
    if (!this.isEdit) {
      this.saveDraft();
    }
    this.dialogRef.close(isBool);
  }

  buildForm() {
    this.treatmentPackageForm = this.fb.group({
      name: ["", [Validators.required]],
      doctorName: ["", [Validators.required]],
      otherDoctorName: [
        "",
        this.treatmentPackageForm?.get("doctorName")?.value === "Other"
          ? [Validators.required]
          : [],
      ],
      doctorId: [""],
      diagnosis: ["", [Validators.required]],
      treatmentPlan: ["", [Validators.required]],
      stayInCountry: ["", [Validators.required]],
      stayInHospital: ["", [Validators.required]],
      hospitalDuration: ["", [Validators.required]],
      countryDuration: ["", [Validators.required]],
      remarks: [""],
      initialEvaluationMinimum: ["", [Validators.required]],
      initialEvaluationMaximum: ["", [Validators.required]],
      treatment: this.fb.array([this.createTreatmentform()]),
      currency: ["", [Validators.required]],
      fileFirst: [[]],
    });
  }

  createTreatmentform() {
    return this.fb.group({
      name: ["", [Validators.required]],
      room: ["", [Validators.required]],
      minCost: ["", [Validators.required]],
      maxCost: [[], [Validators.required]],
    });
  }

  get treatmentArray(): FormArray {
    return this.treatmentPackageForm.get("treatment") as FormArray;
  }

  addTreatment() {
    this.treatmentArray.push(this.createTreatmentform());
  }

  deleteTreatment(i: number) {
    if (this.treatmentArray.value.length > 1) {
      this.treatmentArray.removeAt(i);
    }
  }

  sortCurrencies() {
    const topCurrencies = this.preferredCurrencies?.map((code) =>
      this.allCurrencies.find((currency: any) => currency.code === code)
    );

    const otherCurrencies = this.allCurrencies.filter(
      (currency: any) => !this.preferredCurrencies.includes(currency.code)
    );

    this.currencyArray = [...topCurrencies, ...otherCurrencies];
    this.currencyFreshList = [...topCurrencies, ...otherCurrencies];
  }

  searchCurrency(filterValue: string) {
    clearTimeout(this.timeoutCurrency);
    this.timeoutCurrency = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.currencyFreshList);
        this.currencyArray = [];
        let filterData = filterArray.filter((f: any) =>
          f?.code?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.currencyArray = filterArray;
      } else {
        this.currencyArray = this.currencyFreshList;
      }
    }, 600);
  }

  onClickCurrency(item: any) {
    this.treatmentPackageForm.patchValue({
      currency: item,
    });
  }

  compareCurrencyObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  // Doctor Linking
  doctorData: any = [{ name: "Other" }];
  totalElementDoctor: number;
  doctorParams = {
    page: 1,
    limit: 0,
    search: "",
  };
  timeoutDoctor = null;
  isLoadingDoctor = false;

  getDoctorData() {
    if (this.isLoadingDoctor) {
      return;
    }
    this.isLoadingDoctor = true;

    this.sharedService.getAllDoctor(this.doctorParams).subscribe(
      (res: any) => {
        if (!!res?.data?.content && res?.data?.content?.length > 0) {
          this.doctorData.push(...res.data.content);
          this.totalElementDoctor = res.data.totalElement;
          this.doctorParams.page = this.doctorParams.page + 1;
          this.isLoadingDoctor = false;

          if (this.doctorData?.length > 0 && this.isEdit) {
            this.packageData.doctorId = this.packageData.doctorId
              ? this.packageData.doctorId
              : null;
            let index = this.doctorData?.findIndex(
              (dl: any) => dl?._id === this.packageData?.doctorId
            );

            if (index !== -1) {
              this.treatmentPackageForm.patchValue({
                doctorName: this.doctorData[index]?.name,
                doctorId: this.doctorData[index]?._id,
              });
            } else {
              this.treatmentPackageForm.patchValue({
                doctorName: "Other",
                otherDoctorName: this.packageData?.doctorName,
              });
            }
          }
        } else {
          this.isLoadingDoctor = false;
        }
      },
      () => {
        this.isLoadingDoctor = false;
      }
    );
  }

  onInfiniteScrollDoctor(): void {
    if (this.doctorData.length < this.totalElementDoctor) {
      this.getDoctorData();
    }
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      this.doctorParams.search = filterValue.trim();
      this.doctorParams.page = 1;
      this.doctorData = [{ name: "Other" }];
      this.isLoadingDoctor = false;
      this.getDoctorData();
    }, 600);
  }

  onClickDoctor(item: any) {
    this.treatmentPackageForm.patchValue({
      doctorId: item?._id,
      doctorName: item?.name,
    });
  }

  submit() {
    if (this.treatmentPackageForm?.valid) {
      const {
        name,
        doctorName,
        doctorId,
        diagnosis,
        treatmentPlan,
        stayInCountry,
        stayInHospital,
        hospitalDuration,
        countryDuration,
        remarks,
        initialEvaluationMinimum,
        initialEvaluationMaximum,
        treatment,
        otherDoctorName,
        receivedAt,
        currency,
      } = this.treatmentPackageForm?.getRawValue();

      let paylaod = {
        treatmentPlan,
        stayInCountry,
        stayInHospital,
        hospitalDuration,
        countryDuration,
        initialEvaluationMaximum,
        initialEvaluationMinimum,
        doctorId,
        diagnosis,
        remarks,
        receivedAt,
        doctorName:
          doctorName === "Other" ? otherDoctorName || "Other" : doctorName,
        name,
      };

      let formData = new FormData();

      formData.append("treatment", JSON.stringify(treatment));
      formData.append("currency", JSON.stringify(currency));

      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }

      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("fileFirst", this.fileList[i]);
      }

      if (!this.isEdit) {
        this.hospitalService
          .addTreatmentPackage(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            localStorage.removeItem(`treatmentPackageDraft`);
            this.dialogRef.close(true);
          });
      } else {
        formData.append(
          "treatmentPackageFile",
          JSON.stringify(this.treatmentPackageFile)
        );
        this.hospitalService
          .editTreatmentPackage(formData, this.packageData?._id)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      this.treatmentPackageForm.markAsTouched();
    }
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  treatmentPackageFile = [];

  deleteTreatmentPackageFile(index) {
    this.treatmentPackageFile.splice(index, 1);
  }

  onFileSelected(e: any) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.filePreviewUrls.push(fileUrl);
        file["url"] = fileUrl;
      } else if (
        file.type.includes("application") &&
        file.type !== "application/pdf"
      ) {
        const fileUrl = URL.createObjectURL(file);
        file["url"] = fileUrl;
      } else if (file.type.includes("audio")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", function () {
          file["url"] = reader.result;
        });
      } else if (file.type.includes("video")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (evt: any) => {
          this.filePreviewUrls.push(reader.result as string);
          file["url"] = reader.result as string;
        };
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
}
