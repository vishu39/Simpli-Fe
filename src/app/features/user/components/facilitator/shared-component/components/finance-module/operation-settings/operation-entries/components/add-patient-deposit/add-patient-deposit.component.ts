import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import * as moment from "moment";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { currencies } from "currencies.json";

@Component({
  selector: "app-add-patient-deposit",
  templateUrl: "./add-patient-deposit.component.html",
  styleUrls: ["./add-patient-deposit.component.scss"],
})
export class AddPatientDepositComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;
  isEdit: boolean = false;

  editingData: any = {};

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  transferOption = ["Cash", "Bank Transfer", "Card", "Wire"];

  constructor(
    public dialogRef: MatDialogRef<AddPatientDepositComponent>,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      dateOfDeposit: ["", [Validators.required]],
      depositAmount: ["", [Validators.required]],
      currency: ["", [Validators.required]],
      currencyConverter: ["", [Validators.required]],
      transferType: ["", [Validators.required]],
      swiftCode: [""],
      fileFirst: [""],
      patient: [this.patientData?._id],
    });

    this.getAllPatientDepositForFinanceBilling();

    this.sortCurrencies();
    let usdCurrencyIndex = this.currencyArray?.findIndex(
      (ca: any) => ca?.code === "USD"
    );
    if (usdCurrencyIndex !== -1) {
      this.formGroup.patchValue({
        currency: this.currencyArray[usdCurrencyIndex],
      });
    }

    this.sortCurrencyConverter();
    let usdCurrencyConverterIndex = this.currencyConverterArray?.findIndex(
      (ca: any) => ca?.code === "USD"
    );
    if (usdCurrencyConverterIndex !== -1) {
      this.formGroup.patchValue({
        currencyConverter:
          this.currencyConverterArray[usdCurrencyConverterIndex],
      });
    }

    if (this.isEdit) {
      this.getPatientDepositForFinanceBillingById();
    }
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
      .getAllPatientDepositForFinanceBilling(
        this.docsParams,
        this.patientData?._id
      )
      .subscribe(
        (res: any) => {
          this.docsData = res?.data?.content;
          this.getHospitalData();
          this.isDocsLoading = false;
        },
        () => {
          this.isDocsLoading = false;
        }
      );
  }

  onClickTransferType(item: any) {
    let swiftControl = this.formGroup.get("swiftCode");
    if (item === "Wire") {
      swiftControl?.setValidators([Validators.required]);
      swiftControl.updateValueAndValidity();
    } else {
      this.formGroup.patchValue({
        swiftCode: "",
      });
      swiftControl.clearValidators();
      swiftControl.updateValueAndValidity();
    }
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

  allCurrencyConverter: any = currencies;
  currencyConverterArray = [];
  currencyConverterFreshList = [];
  preferredCurrencyConverter: string[] = ["USD", "INR", "EUR", "OMR"];
  timeoutCurrencyConverter = null;

  sortCurrencyConverter() {
    const topCurrencies = this.preferredCurrencyConverter?.map((code) =>
      this.allCurrencyConverter.find((currency: any) => currency.code === code)
    );

    const otherCurrencies = this.allCurrencyConverter.filter(
      (currency: any) =>
        !this.preferredCurrencyConverter.includes(currency.code)
    );

    this.currencyConverterArray = [...topCurrencies, ...otherCurrencies];
    this.currencyConverterFreshList = [...topCurrencies, ...otherCurrencies];
  }

  searchCurrencyConverter(filterValue: string) {
    clearTimeout(this.timeoutCurrencyConverter);
    this.timeoutCurrencyConverter = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.currencyConverterFreshList);
        this.currencyConverterArray = [];
        let filterData = filterArray.filter((f: any) =>
          f?.code?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.currencyConverterArray = filterArray;
      } else {
        this.currencyConverterArray = this.currencyConverterFreshList;
      }
    }, 600);
  }

  onClickCurrencyConverter(item: any) {
    this.formGroup.patchValue({
      currency: item,
    });
  }

  compareCurrencyObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  docDataForEdit: any = {};
  getPatientDepositForFinanceBillingById() {
    this.facilitatorService
      .getPatientDepositForFinanceBillingById(this.patientData?._id, {
        hospitalId: this.editingData?.hospitalId,
      })
      .subscribe((res: any) => {
        this.docDataForEdit = res?.data[0];
        this.patchData(this.docDataForEdit);
      });
  }

  paymentRecieptArray = [];
  dischargeSummaryEditArray = [];
  patchData(item: any) {
    this.paymentRecieptArray = item?.paymentReciept;

    let newDate: any = "";
    if (!!item?.dateOfDeposit) {
      newDate = moment(item?.dateOfDeposit);
    }

    this.formGroup.patchValue({
      hospitalId: item?.hospitalId,
      hospitalName: item?.hospitalName,
      dateOfDeposit: newDate ? newDate?.toDate() : "",
      depositAmount: item?.depositAmount,
      currency: item?.currency,
      currencyConverter: item?.currencyConverter,
      transferType: item?.transferType,
      swiftCode: item?.swiftCode,
      fileFirst: [""],
      patient: [this.patientData?._id],
    });

    this.formGroup.get("hospitalName").disable();
  }

  filterHospitalByData(hospitalData: any) {
    this.hospitalData = [];
    let resData = hospitalData;
    this.docsData?.forEach((data: any) => {
      let index = resData?.findIndex((rd: any) => rd?._id === data?.hospitalId);
      if (index !== -1) {
        resData.splice(index, 1);
      }
    });
    this.hospitalData.push(...resData);
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

          if (this.docsData?.length) {
            this.filterHospitalByData(this.hospitalData);
          }

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

      let currency = payload?.currency;
      let currencyConverter = payload?.currencyConverter;
      delete payload["currency"];
      delete payload["currencyConverter"];

      delete payload["fileFirst"];

      let formData = new FormData();
      formData.append("currency", JSON.stringify(currency));
      formData.append("currencyConverter", JSON.stringify(currencyConverter));

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      for (var i = 0; i < this.fileFirstList?.length; i++) {
        formData.append("fileFirst", this.fileFirstList[i]);
      }

      this.facilitatorService
        .addPatientDepositForFinanceBilling(formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);

          this.closeDialog(true);
        });
    }
  }

  editFinalForm() {
    let id = this.patientData._id;
    if (this.formGroup.valid) {
      let payload = {
        ...this.formGroup.getRawValue(),
      };

      let currency = payload?.currency;
      let currencyConverter = payload?.currencyConverter;
      delete payload["currency"];
      delete payload["currencyConverter"];

      delete payload["fileFirst"];

      let formData = new FormData();
      formData.append("currency", JSON.stringify(currency));
      formData.append("currencyConverter", JSON.stringify(currencyConverter));

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      for (var i = 0; i < this.fileFirstList?.length; i++) {
        formData.append("fileFirst", this.fileFirstList[i]);
      }

      if (this.paymentRecieptArray?.length) {
        formData.append(
          "paymentReciept",
          JSON.stringify(this.paymentRecieptArray)
        );
      }

      this.facilitatorService
        .editPatientDepositForFinanceBilling(id, formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);

          this.closeDialog(true);
        });
    }
  }
}
