import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatRadioChange } from "@angular/material/radio";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";

@Component({
  selector: "global-shared-upload-estimates",
  templateUrl: "./upload-estimates.component.html",
  styleUrls: ["./upload-estimates.component.scss"],
})
export class UploadEstimatesComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  estimateOptions = ["yes", "no"];

  constructor(
    public dialogRef: MatDialogRef<UploadEstimatesComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sortCurrencies();
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

    let hospitalIdControl = this.formGroup.get("hospitalId");
    let hospitalNameControl = this.formGroup.get("hospitalName");
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
      hospitalIdControl?.setValidators([Validators.required]);
      hospitalIdControl.updateValueAndValidity();
      hospitalNameControl?.setValidators([Validators.required]);
      hospitalNameControl.updateValueAndValidity();
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
      hospitalIdControl.clearValidators();
      hospitalIdControl.updateValueAndValidity();
      hospitalNameControl.clearValidators();
      hospitalNameControl.updateValueAndValidity();
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
        hospitalId: "",
        hospitalName: "",
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
    this.formGroup.reset();
    this.dialogRef.close();
  }

  actionSubmit(apiCall = false) {
    if (this.formGroup?.valid) {
      this.dialogRef.close({
        apiCall,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
