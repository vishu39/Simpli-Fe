import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";

@Component({
  selector: "global-shared-upload-billing-doc",
  templateUrl: "./upload-billing-doc.component.html",
  styleUrls: ["./upload-billing-doc.component.scss"],
})
export class UploadBillingDocComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  categoriesOptions = ["Registration Bill", "OP Bill", "IP Bill"];

  constructor(public dialogRef: MatDialogRef<UploadBillingDocComponent>) {}

  ngOnInit(): void {
    this.sortCurrencies();
    let usdCurrencyIndex = this.currencyArray?.findIndex(
      (ca: any) => ca?.code === "USD"
    );
    if (usdCurrencyIndex !== -1) {
      this.formGroup.patchValue({
        currency: this.currencyArray[usdCurrencyIndex],
      });
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

  compareCurrencyObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  closeDialog(apiCall: boolean): void {
    this.formGroup.reset();
    this.fileList = [];
    this.filePreviewUrls = [];
    this.dialogRef.close();
  }

  actionSubmit(apiCall = false) {
    this.dialogRef.close({
      apiCall,
    });
  }

  // fileList: any[] = [];
  // filePreviewUrls: string[] = [];
  // onFileSelected(e: any) {
  //   const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
  //   const file = e.target.files[0];
  //   if (allowedExtensions.exec(file.name)) {
  //     if (file.type === "application/pdf") {
  //       const fileUrl = URL.createObjectURL(file);
  //       this.filePreviewUrls = [fileUrl];
  //       file["url"] = fileUrl;
  //     } else {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.filePreviewUrls = [reader.result as string];
  //         file["url"] = reader.result as string;
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  //   this.fileList = [file];
  // }

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
}
