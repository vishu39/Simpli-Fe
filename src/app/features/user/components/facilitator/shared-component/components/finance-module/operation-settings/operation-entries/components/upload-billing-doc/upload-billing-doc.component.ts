import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "global-shared-upload-billing-doc",
  templateUrl: "./upload-billing-doc.component.html",
  styleUrls: ["./upload-billing-doc.component.scss"],
})
export class UploadBillingDocComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;
  isEdit: boolean = false;
  editingData: any = {};

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  categoriesOptions = [
    "Registration Bill",
    "OP Bill",
    "IP Bill",
    "Part of Package cost",
  ];

  constructor(
    public dialogRef: MatDialogRef<UploadBillingDocComponent>,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      category: ["", [Validators.required]],
      amount: [""],
      pharmacyAndConsumableAmount: [""],
      doctorConsultancyAmount: [""],
      currency: ["", [Validators.required]],
      file: [],
      patient: [this.patientData?._id],
    });

    this.getHospitalData();
    this.sortCurrencies();
    let usdCurrencyIndex = this.currencyArray?.findIndex(
      (ca: any) => ca?.code === "USD"
    );
    if (usdCurrencyIndex !== -1) {
      this.formGroup.patchValue({
        currency: this.currencyArray[usdCurrencyIndex],
      });
    }

    if (this.isEdit) {
      this.getBillingDocForFinanceBillingById();
    }
  }

  docDataForEdit: any = {};
  getBillingDocForFinanceBillingById() {
    this.facilitatorService
      .getBillingDocForFinanceBillingById(this.patientData?._id, {
        hospitalId: this.editingData?.hospitalId,
      })
      .subscribe((res: any) => {
        this.docDataForEdit = res?.data[0];
        this.patchData(this.docDataForEdit);
      });

    this.formGroup.get("hospitalName").disable();
  }

  billingDocsArray = [];
  patchData(item: any) {
    this.billingDocsArray = item?.billingDocs;
    this.formGroup.patchValue({
      hospitalId: item?.hospitalId,
      hospitalName: item?.hospitalName,
      category: item?.category,
      amount: item?.amount,
      pharmacyAndConsumableAmount: item?.pharmacyAndConsumableAmount,
      doctorConsultancyAmount: item?.doctorConsultancyAmount,
      currency: item?.currency,
      file: "",
      patient: [this.patientData?._id],
    });
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
      let currency = payload?.currency;

      delete payload["file"];
      delete payload["currency"];

      let formData = new FormData();
      formData.append("currency", JSON.stringify(currency));

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("fileFirst", this.fileList[i]);
      }

      this.facilitatorService
        .addBillingDocForFinanceBilling(formData)
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

      delete payload["file"];
      delete payload["currency"];

      let formData = new FormData();
      formData.append("currency", JSON.stringify(currency));

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("fileFirst", this.fileList[i]);
      }

      if (this.billingDocsArray?.length) {
        formData.append("billingDocs", JSON.stringify(this.billingDocsArray));
      }

      this.facilitatorService
        .editBillingDocForFinanceBilling(id, formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);

          this.closeDialog(true);
        });
    }
  }
}
