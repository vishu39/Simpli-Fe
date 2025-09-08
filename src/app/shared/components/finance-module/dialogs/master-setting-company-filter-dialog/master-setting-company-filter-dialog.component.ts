import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { currencies } from "currencies.json";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-master-setting-company-filter-dialog",
  templateUrl: "./master-setting-company-filter-dialog.component.html",
  styleUrls: ["./master-setting-company-filter-dialog.component.scss"],
})
export class MasterSettingCompanyFilterDialogComponent implements OnInit {
  dialogTitle: string = "Filter Payout";
  openedComponent: any = "";
  selectedFilter: any = [];
  type: any = "";
  filterForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MasterSettingCompanyFilterDialogComponent>,
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sortCurrencies();

    this.filterForm = this.fb.group({
      search: [""],
      currency: [],
      gstApplicable: [],
    });

    let gstApplicable = this.selectedFilter?.gstApplicable;
    let currency = this.selectedFilter?.currency;
    let search = this.selectedFilter?.search;

    if (gstApplicable?.length > 0 || currency?.length > 0 || !!search) {
      this.selectedCurrency = currency;
      this.selectedGstApplicable = gstApplicable;
      this.filterForm.patchValue({
        gstApplicable: this.selectedGstApplicable,
        currency: this.selectedCurrency,
        search: search,
      });
    }
  }

  // Gst Applicable linking
  gstOption: any = ["Yes", "No"];
  selectedGstApplicable = [];

  onClickGstApplicable(item: any) {
    const index = this.selectedGstApplicable?.indexOf(item);
    if (index !== -1) {
      this.selectedGstApplicable.splice(index, 1);
    } else {
      this.selectedGstApplicable.push(item);
    }
    this.filterForm.patchValue({
      gstApplicable: [...new Set(this.selectedGstApplicable)],
    });
  }

  selectAllGstApplicable(event: any) {
    if (event.checked) {
      this.selectedGstApplicable = [];

      const allGstApplicable = this.gstOption.map((item: any) => item);

      allGstApplicable.forEach((iu: any) => {
        const isGstSelected = this.selectedGstApplicable.some(
          (selectedGstApplicable: any) => selectedGstApplicable === iu
        );

        if (!isGstSelected) {
          this.selectedGstApplicable.push(iu);
        }
      });
      this.filterForm.patchValue({
        gstApplicable: this.selectedGstApplicable,
      });
    } else {
      this.selectedGstApplicable = [];
      this.filterForm.patchValue({
        gstApplicable: [],
      });
    }
  }

  // currency Applicable linking
  selectedCurrency = [];

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

  onClickCurrency(item: any) {
    const index = this.selectedCurrency.findIndex(
      (element) => element.code === item.code
    );

    if (index !== -1) {
      this.selectedCurrency.splice(index, 1);
    } else {
      this.selectedCurrency.push(item);
    }
    this.filterForm.patchValue({
      currency: [...new Set(this.selectedCurrency)],
    });
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

  selectAllCurrency(event: any) {
    if (event.checked) {
      this.selectedCurrency = [];

      const allCurrency = this.currencyArray.map((item: any) => item);

      allCurrency.forEach((iu: any) => {
        const isCurrencySelected = this.selectedCurrency.some(
          (selectedCurrency: any) => selectedCurrency === iu
        );

        if (!isCurrencySelected) {
          this.selectedCurrency.push(iu);
        }
      });
      this.filterForm.patchValue({
        currency: this.selectedCurrency,
      });

      console.log(this.selectedCurrency);
    } else {
      this.selectedCurrency = [];
      this.filterForm.patchValue({
        currency: [],
      });
    }
  }

  compareCurrencyObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  resetFilter() {
    this.filterForm.reset({
      search: "",
      country: [],
    });
    this.closeDialog(true);
  }

  closeDialog(apiCall: boolean) {
    let data = {
      apiCall,
      filteredData: !apiCall ? {} : this.filterForm.value,
      type: this.type,
    };
    this.dialogRef.close(data);
  }

  onSubmit() {
    this.closeDialog(true);
  }
}
