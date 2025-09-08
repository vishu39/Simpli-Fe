import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatRadioChange } from "@angular/material/radio";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "global-shared-upload-estimates",
  templateUrl: "./upload-estimates.component.html",
  styleUrls: ["./upload-estimates.component.scss"],
})
export class UploadEstimatesComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;
  isEdit: boolean = false;
  editingData: any = {};

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  estimateOptions = ["yes", "no"];

  constructor(
    public dialogRef: MatDialogRef<UploadEstimatesComponent>,
    private fb: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      estimateGiven: ["", [Validators.required]],
      estimateDate: [""],
      approxAdmissionDate: [""],
      comment: [""],
      // packageName: [""],
      // roomCategory: [""],
      // roomPrice: [""],
      // currency: [""],
      packageArray: this.fb.array([]),
      patient: [this.patientData?._id],
    });

    this.getHospitalData();
    this.sortCurrencies();
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

  setInitialCurrency() {
    let code = "";
    let usdCurrencyIndex = this.currencyArray?.findIndex(
      (ca: any) => ca?.code === "USD"
    );
    if (usdCurrencyIndex !== -1) {
      // this.formGroup.patchValue({
      //   currency: this.currencyArray[usdCurrencyIndex],
      // });
      code = this.currencyArray[usdCurrencyIndex];
    }

    return code;
  }

  allCurrencies: any = currencies;
  currencyArray = [];
  currencyFreshList = [];
  preferredCurrencies: string[] = ["USD", "INR", "EUR", "OMR"];
  timeoutCurrency = null;

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
    this.formGroup.patchValue({
      currency: item,
    });
  }

  compareCurrencyObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  onRadioChange(event: MatRadioChange) {
    let value = event.value;

    // let hospitalIdControl = this.formGroup.get("hospitalId");
    // let hospitalNameControl = this.formGroup.get("hospitalName");
    let estimateDateControl = this.formGroup.get("estimateDate");
    let roomCategoryControl = this.formGroup.get("roomCategory");
    let roomPriceControl = this.formGroup.get("roomPrice");
    let approxAdmissionDateControl = this.formGroup.get("approxAdmissionDate");
    let currencyControl = this.formGroup.get("currency");
    let commentControl = this.formGroup.get("comment");

    if (value === "yes") {
      commentControl?.clearValidators();
      commentControl.updateValueAndValidity();

      this.formGroup.patchValue({
        comment: "",
      });

      this.addPackage();

      // this.setInitialCurrency();
      // hospitalIdControl?.setValidators([Validators.required]);
      // hospitalIdControl.updateValueAndValidity();
      // hospitalNameControl?.setValidators([Validators.required]);
      // hospitalNameControl.updateValueAndValidity();
      estimateDateControl?.setValidators([Validators.required]);
      estimateDateControl.updateValueAndValidity();
      approxAdmissionDateControl?.setValidators([Validators.required]);
      approxAdmissionDateControl.updateValueAndValidity();
      // roomCategoryControl?.setValidators([Validators.required]);
      // roomCategoryControl.updateValueAndValidity();
      // roomPriceControl?.setValidators([Validators.required]);
      // roomPriceControl.updateValueAndValidity();
      // currencyControl?.setValidators([Validators.required]);
      // currencyControl.updateValueAndValidity();
    } else if (value === "no") {
      // hospitalIdControl.clearValidators();
      // hospitalIdControl.updateValueAndValidity();
      // hospitalNameControl.clearValidators();
      // hospitalNameControl.updateValueAndValidity();
      estimateDateControl.clearValidators();
      estimateDateControl.updateValueAndValidity();
      approxAdmissionDateControl.clearValidators();
      approxAdmissionDateControl.updateValueAndValidity();
      // roomCategoryControl.clearValidators();
      // roomCategoryControl.updateValueAndValidity();
      // roomPriceControl.clearValidators();
      // roomPriceControl.updateValueAndValidity();
      // currencyControl.clearValidators();
      // currencyControl.updateValueAndValidity();

      this.formGroup.patchValue({
        // hospitalId: "",
        // hospitalName: "",
        approxAdmissionDate: "",
        estimateDate: "",
        // currency: "",
        // roomCategory: "",
        // roomPrice: "",
      });

      this.getPackageArray.clear();

      commentControl?.setValidators([Validators.required]);
      commentControl.updateValueAndValidity();
    }
  }

  get getPackageArray(): FormArray {
    return this.formGroup.get("packageArray") as FormArray;
  }

  createPackageArrayForm() {
    return this.fb.group({
      packageName: [""],
      roomPrice: ["", [Validators.required]],
      currency: [this.setInitialCurrency(), [Validators.required]],
      roomCategory: ["", [Validators.required]],
    });
  }

  addPackage() {
    this.getPackageArray.push(this.createPackageArrayForm());
  }

  deletePackage(i: number) {
    if (i !== -1) {
      this.getPackageArray.removeAt(i);
    }
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

  addFinalForm() {
    if (this.formGroup.valid) {
      let values = this.formGroup.getRawValue();
      let payload: any = {
        patient: values?.patient,
        hospitalId: values?.hospitalId,
        hospitalName: values?.hospitalName,
        estimateGiven: values?.estimateGiven,
      };

      if (values?.estimateGiven === "yes") {
        payload.estimateDate = values?.estimateDate
        payload.approxAdmissionDate = values?.approxAdmissionDate
        payload.packageArray = values?.packageArray
      }
      if (values?.estimateGiven === "no") {
        payload.comment = values?.comment
      };

    this.facilitatorService
      .addEstimateDocForFinanceBilling(payload)
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

    this.facilitatorService
      .editEstimateDocForFinanceBilling(id, payload)
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res?.message);

        this.closeDialog(true);
      });
  }
}
}
