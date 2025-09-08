import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { currencies } from "currencies.json";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-master-setting-hospital-filter-dialog",
  templateUrl: "./master-setting-hospital-filter-dialog.component.html",
  styleUrls: ["./master-setting-hospital-filter-dialog.component.scss"],
})
export class MasterSettingHospitalFilterDialogComponent implements OnInit {
  dialogTitle: string = "Filter Payout";
  openedComponent: any = "";
  selectedFilter: any = [];
  type: any = "";
  filterForm: FormGroup;
  filterFormTwo: FormGroup;

  revenueTypeOptions: any = [];

  constructor(
    public dialogRef: MatDialogRef<MasterSettingHospitalFilterDialogComponent>,
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [""],
      country: [],
      revenueType: [],
      currency: [],
      currencyPayout: [],
    });
    let country = this.selectedFilter?.country;
    let revenueType = this.selectedFilter?.revenueType;
    let currency = this.selectedFilter?.currency;
    let search = this.selectedFilter?.search;
    let currencyPayout = this.selectedFilter?.currencyPayout;

    if (
      country?.length > 0 ||
      revenueType?.length > 0 ||
      currency?.length > 0 ||
      currencyPayout?.length > 0 ||
      !!search
    ) {
      this.selectedCountry = country;
      this.selectedRevenueType = revenueType;
      this.selectedCurrency = currency;
      this.selectedCurrencyPayout = currencyPayout;

      this.filterForm.patchValue({
        country: this.selectedCountry,
        revenueType: this.selectedRevenueType,
        currency: this.selectedCurrency,
        currencyPayout: this.selectedCurrencyPayout,
        search: search,
      });
    }

    this.getCountryData();
    this.sortCurrencies();
    this.sortCurrenciesPayout();
    this.getRevenueTypeMasterFinanceData();
  }

  getRevenueTypeMasterFinanceData() {
    this.sharedService
      .getRevenueTypeMasterFinanceData()
      .subscribe((res: any) => {
        this.revenueTypeOptions = res?.data;
      });
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

  // currency Payout linking
  selectedCurrencyPayout = [];

  allCurrenciesPayout: any = currencies;
  currencyPayoutArray = [];
  currencyPayoutFreshList = [];
  preferredCurrenciesPayout: string[] = ["USD", "INR", "EUR", "OMR"];
  timeoutCurrencyPayout = null;

  sortCurrenciesPayout() {
    const topCurrencies = this.preferredCurrenciesPayout?.map((code) =>
      this.allCurrenciesPayout.find((currency: any) => currency.code === code)
    );

    const otherCurrencies = this.allCurrenciesPayout.filter(
      (currency: any) => !this.preferredCurrenciesPayout.includes(currency.code)
    );

    this.currencyPayoutArray = [...topCurrencies, ...otherCurrencies];
    this.currencyPayoutFreshList = [...topCurrencies, ...otherCurrencies];
  }

  onClickCurrencyPayout(item: any) {
    const index = this.selectedCurrencyPayout.findIndex(
      (element) => element.code === item.code
    );

    if (index !== -1) {
      this.selectedCurrencyPayout.splice(index, 1);
    } else {
      this.selectedCurrencyPayout.push(item);
    }
    this.filterForm.patchValue({
      currencyPayout: [...new Set(this.selectedCurrencyPayout)],
    });
  }

  searchCurrencyPayout(filterValue: string) {
    clearTimeout(this.timeoutCurrencyPayout);
    this.timeoutCurrencyPayout = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.currencyPayoutFreshList);
        this.currencyPayoutArray = [];
        let filterData = filterArray.filter((f: any) =>
          f?.code?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.currencyPayoutArray = filterArray;
      } else {
        this.currencyPayoutArray = this.currencyPayoutFreshList;
      }
    }, 600);
  }

  selectAllCurrencyPayout(event: any) {
    if (event.checked) {
      this.selectedCurrencyPayout = [];

      const allCurrency = this.currencyPayoutArray.map((item: any) => item);

      allCurrency.forEach((iu: any) => {
        const isCurrencySelected = this.selectedCurrencyPayout.some(
          (selectedCurrencyPayout: any) => selectedCurrencyPayout === iu
        );

        if (!isCurrencySelected) {
          this.selectedCurrencyPayout.push(iu);
        }
      });
      this.filterForm.patchValue({
        currencyPayout: this.selectedCurrencyPayout,
      });
    } else {
      this.selectedCurrencyPayout = [];
      this.filterForm.patchValue({
        currencyPayout: [],
      });
    }
  }

  compareCurrencyObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  // country linking
  countryData: any = [];
  totalElementCountry: number;
  countryParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutCountry = null;
  isLoadingCountry = false;
  fileList: any[] = [];
  filePreviewUrls: string[] = [];

  getCountryData(selectAll = false) {
    if (this.isLoadingCountry) {
      return;
    }
    this.isLoadingCountry = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.countryData = [];
        }
        this.countryData.push(...res.data.content);
        this.totalElementCountry = res.data.totalElement;
        this.countryParams.page = this.countryParams.page + 1;
        this.isLoadingCountry = false;

        // select all
        if (selectAll) {
          const allHospital = this.countryData?.map((item) => item.name);
          allHospital.forEach((hospital) => {
            const isHospitalAlreadySelected = this.selectedCountry.some(
              (selectedHospital) => selectedHospital === hospital
            );

            if (!isHospitalAlreadySelected) {
              this.selectedCountry.push(hospital);
            }
          });

          this.filterForm.patchValue({
            country: this.selectedCountry,
          });
          this.isLoadingCountrySelectAll = false;
        }
      });
  }

  onInfiniteScrollCountry(): void {
    if (this.countryData.length < this.totalElementCountry) {
      this.getCountryData();
    }
  }

  searchCountry(filterValue: string) {
    clearTimeout(this.timeoutCountry);
    this.timeoutCountry = setTimeout(() => {
      this.countryParams.search = filterValue.trim();
      this.countryParams.page = 1;
      this.countryData = []; // Clear existing data when searching
      this.isLoadingCountry = false;
      this.getCountryData();
    }, 600);
  }

  selectedCountry = [];
  isLoadingCountrySelectAll: boolean = false;
  onClickCountry(item: any) {
    const index = this.selectedCountry.indexOf(item);
    // console.log('index', index)
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCountry.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCountry.push(item);
    }

    this.filterForm.patchValue({
      country: [...new Set(this.selectedCountry)],
    });
  }

  selectAllCountry(event: any) {
    if (event.checked) {
      this.countryParams.page = 1;
      this.countryParams.limit = 0;
      this.isLoadingCountry = false;
      this.isLoadingCountrySelectAll = true;
      this.getCountryData(true);
    } else {
      this.selectedCountry = [];
      this.filterForm.patchValue({
        country: [],
      });
    }
  }

  // revenue Type linking
  selectedRevenueType = [];

  onClickRevenueType(item: any) {
    const index = this.selectedRevenueType?.indexOf(item);
    if (index !== -1) {
      this.selectedRevenueType.splice(index, 1);
    } else {
      this.selectedRevenueType.push(item);
    }
    this.filterForm.patchValue({
      revenueType: [...new Set(this.selectedRevenueType)],
    });
  }

  selectAllRevenueType(event: any) {
    if (event.checked) {
      this.selectedRevenueType = [];

      const allRevenueType = this.revenueTypeOptions.map((item) => item);

      allRevenueType.forEach((iu: any) => {
        const isRevenueSelected = this.selectedRevenueType.some(
          (selectedRevenueType: any) => selectedRevenueType === iu
        );

        if (!isRevenueSelected) {
          this.selectedRevenueType.push(iu);
        }
      });
      this.filterForm.patchValue({
        revenueType: this.selectedRevenueType,
      });
    } else {
      this.selectedRevenueType = [];
      this.filterForm.patchValue({
        revenueType: [],
      });
    }
  }

  resetFilter() {
    this.filterForm.reset({
      search: "",
      country: [],
      currency: [],
      revenueType: [],
    });
    this.closeDialog(true);
  }

  closeDialog(apiCall: boolean) {
    let data = {
      apiCall,
      filteredData: !apiCall ? {} : this.filterForm?.getRawValue(),
      type: this.type,
    };
    this.dialogRef.close(data);
  }

  onSubmit() {
    this.closeDialog(true);
  }
}
