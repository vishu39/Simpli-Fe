import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { currencies } from "currencies.json";
import { MasterSettingHospitalFilterDialogComponent } from "src/app/shared/components/finance-module/dialogs/master-setting-hospital-filter-dialog/master-setting-hospital-filter-dialog.component";

@Component({
  selector: "app-packages-hospital-payout",
  templateUrl: "./packages-hospital-payout.component.html",
  styleUrls: ["./packages-hospital-payout.component.scss"],
})
export class PackagesHospitalPayoutComponent implements OnInit {
  @Input() hospitalId: any;
  @Input() hospitalData: any;
  packageForm: FormGroup;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {
    this.buildPackageForm();

    this.formGroup = this.fb.group({
      package: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getRevenueTypeMasterFinanceData();
    this.getCountryDataForPackage(false);

    this.sortCurrenciesForPackage();
    let usdCurrencyIndex = this.currencyArrayForPackage?.findIndex(
      (ca: any) => ca?.code === "USD"
    );
    if (usdCurrencyIndex !== -1) {
      this.packageForm.patchValue({
        currency: this.currencyArrayForPackage[usdCurrencyIndex],
      });
    }

    this.sortCurrenciesPayoutForPackage();
    let usdCurrencyPayoutIndex = this.currencyPayoutArrayForPackage?.findIndex(
      (ca: any) => ca?.code === "USD"
    );
    if (usdCurrencyPayoutIndex !== -1) {
      this.packageForm.patchValue({
        currencyPayout:
          this.currencyPayoutArrayForPackage[usdCurrencyPayoutIndex],
      });
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (
      !!simpleChanges?.hospitalId?.currentValue &&
      !simpleChanges?.hospitalId?.firstChange
    ) {
      this.packageForm.reset();
      this.isActionTabVisibleForPackage = false;
      this.revenueDataForPackage = [];
      this.packageArray.clear();
      this.getAllPackageHospitalPayoutData();
    } else {
      if (this.hospitalId) {
        this.getAllPackageHospitalPayoutData();
      }
    }
  }

  buildPackageForm() {
    this.packageForm = this.fb.group({
      packageName: [null, [Validators.required]],
      packageCost: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      country: [null, [Validators.required]],
      payoutInPercentage: [""],
      payoutInFixedAmount: [""],
      currencyPayout: [null, [Validators.required]],
    });
  }

  revenueTypeOptions: any = [];
  getRevenueTypeMasterFinanceData() {
    this.sharedService
      .getRevenueTypeMasterFinanceData()
      .subscribe((res: any) => {
        this.revenueTypeOptions = res?.data;
      });
  }

  packageParams = {
    page: 1,
    limit: 10,
    search: "",
    filter_obj: {},
  };
  isDataLoadingForPackage: boolean = false;
  totalNumberOfPagesForPackage = 0;
  revenueDataForPackage: any = [];
  totalElementPackage: number = 0;
  getAllPackageHospitalPayoutData() {
    this.isDataLoadingForPackage = true;
    this.facilitatorService
      .getAllPackageHospitalPayoutData(this.packageParams, this.hospitalId)
      .subscribe(
        (res: any) => {
          this.revenueDataForPackage = res?.data?.content;
          this.totalElementPackage = res?.data?.totalElement;
          this.modifyFormArrayDataForPackage(this.revenueDataForPackage);
          this.calculateTotalPagesForPackage();
          this.isDataLoadingForPackage = false;
        },
        (err) => {
          this.isDataLoadingForPackage = false;
        }
      );
  }

  calculateTotalPagesForPackage() {
    this.totalNumberOfPagesForPackage = Math.ceil(
      this.totalElementPackage / this.packageParams.limit
    );
  }

  nextForPackage() {
    this.packageParams.page = this.packageParams?.page + 1;
    if (this.packageParams?.page <= this.totalNumberOfPagesForPackage) {
      this.revenueDataForPackage = [];
      this.packageArray.clear();
      this.getAllPackageHospitalPayoutData();
    } else {
      this.packageParams.page = this.totalNumberOfPagesForPackage;
    }
  }

  prevForPackage() {
    if (this.packageParams?.page > 1) {
      this.packageParams.page = this.packageParams?.page - 1;
      this.revenueDataForPackage = [];
      this.packageArray.clear();
      this.getAllPackageHospitalPayoutData();
    }
  }

  modifyFormArrayDataForPackage(array: any) {
    if (array?.length) {
      this.packageArray.clear();
      array.forEach((a: any) => {
        this.addPackageFormField(a);
      });
    }
  }

  get packageArray(): FormArray {
    return this.formGroup.get("package") as FormArray;
  }

  addPackageFormField(item: any) {
    let buildObj = this.fb.group({
      hospitalId: item?.hospitalId,
      hospitalName: item?.hospitalName,
      packageName: [item?.packageName || "", [Validators.required]],
      packageCost: [item?.packageCost || "", [Validators.required]],
      currency: [item?.currency || "", [Validators.required]],
      currencyPayout: [item?.currencyPayout || "", [Validators.required]],
      country: [
        {
          value: item?.country || "",
          disabled: true,
        },
        [Validators.required],
      ],
      payoutInPercentage: [
        item?.payoutInPercentage || "",
        [Validators.required],
      ],
      payoutInFixedAmount: [item?.payoutInFixedAmount, [Validators.required]],
    });

    this.packageArray.push(buildObj);
  }

  allCurrenciesForPackage: any = currencies;
  currencyArrayForPackage = [];
  currencyFreshListForPackage = [];
  preferredCurrenciesForPackage: string[] = ["USD", "INR", "EUR", "OMR"];
  timeoutCurrencyForPackage = null;

  sortCurrenciesForPackage() {
    const topCurrencies = this.preferredCurrenciesForPackage?.map((code) =>
      this.allCurrenciesForPackage.find(
        (currency: any) => currency.code === code
      )
    );

    const otherCurrencies = this.allCurrenciesForPackage.filter(
      (currency: any) =>
        !this.preferredCurrenciesForPackage.includes(currency.code)
    );

    this.currencyArrayForPackage = [...topCurrencies, ...otherCurrencies];
    this.currencyFreshListForPackage = [...topCurrencies, ...otherCurrencies];
  }

  searchCurrencyForPackage(filterValue: string) {
    clearTimeout(this.timeoutCurrencyForPackage);
    this.timeoutCurrencyForPackage = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.currencyFreshListForPackage);
        this.currencyArrayForPackage = [];
        let filterData = filterArray.filter((f: any) =>
          f?.code?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.currencyArrayForPackage = filterArray;
      } else {
        this.currencyArrayForPackage = this.currencyFreshListForPackage;
      }
    }, 600);
  }

  onClickCurrencyForPackage(item: any) {
    this.packageForm.patchValue({
      currency: item,
    });
  }

  allPayoutCurrenciesForPackage: any = currencies;
  currencyPayoutArrayForPackage = [];
  currencyPayoutFreshListForPackage = [];
  preferredCurrenciesPayoutForPackage: string[] = ["USD", "INR", "EUR", "OMR"];
  timeoutCurrencyPayoutForPackage = null;

  sortCurrenciesPayoutForPackage() {
    const topCurrencies = this.preferredCurrenciesPayoutForPackage?.map(
      (code) =>
        this.allPayoutCurrenciesForPackage.find(
          (currency: any) => currency.code === code
        )
    );

    const otherCurrencies = this.allPayoutCurrenciesForPackage.filter(
      (currency: any) =>
        !this.preferredCurrenciesPayoutForPackage.includes(currency.code)
    );

    this.currencyPayoutArrayForPackage = [...topCurrencies, ...otherCurrencies];
    this.currencyPayoutFreshListForPackage = [
      ...topCurrencies,
      ...otherCurrencies,
    ];
  }

  searchCurrencyPayoutForPackage(filterValue: string) {
    clearTimeout(this.timeoutCurrencyPayoutForPackage);
    this.timeoutCurrencyPayoutForPackage = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.currencyPayoutFreshListForPackage);
        this.currencyPayoutArrayForPackage = [];
        let filterData = filterArray.filter((f: any) =>
          f?.code?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.currencyPayoutArrayForPackage = filterArray;
      } else {
        this.currencyPayoutArrayForPackage =
          this.currencyPayoutFreshListForPackage;
      }
    }, 600);
  }

  onClickCurrencyPayoutForPackage(item: any) {
    this.packageForm.patchValue({
      currencyPayout: item,
    });
  }

  // country linking for Package
  countryDataForPackage: any = [];
  totalElementCountryForPackage: number;
  countryParamsForPackage = {
    page: 1,
    limit: 0,
    search: "",
  };
  timeoutCountryForPackage = null;
  isLoadingCountryForPackage = false;
  isLoadingCountrySelectAllForPackage = false;
  selectedCountrySearchForPackage: any = [];
  getCountryDataForPackage(selectAll: Boolean) {
    if (this.isLoadingCountryForPackage) {
      return;
    }
    this.isLoadingCountryForPackage = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParamsForPackage)
      .subscribe((res: any) => {
        if (selectAll) {
          this.countryDataForPackage = [];
        }

        this.countryDataForPackage.push(...res.data.content);
        this.totalElementCountryForPackage = res.data.totalElement;
        this.countryParamsForPackage.page =
          this.countryParamsForPackage.page + 1;
        this.isLoadingCountryForPackage = false;
        if (selectAll) {
          const allCountryNames = this.countryDataForPackage.map(
            (item) => item.name
          );
          allCountryNames.forEach(
            (country) =>
              this.selectedCountrySearchForPackage.includes(country) ||
              this.selectedCountrySearchForPackage.push(country)
          );

          this.packageForm.patchValue({
            country: this.selectedCountrySearchForPackage,
          });
          this.isLoadingCountrySelectAllForPackage = false;
        }
      });
  }

  onInfiniteScrollCountryForPackage(): void {
    if (
      this.countryDataForPackage.length < this.totalElementCountryForPackage
    ) {
      this.getCountryDataForPackage(false);
    }
  }

  searchCountryForPackage(filterValue: string) {
    clearTimeout(this.timeoutCountryForPackage);
    this.timeoutCountryForPackage = setTimeout(() => {
      this.countryParamsForPackage.search = filterValue.trim();
      this.countryParamsForPackage.page = 1;
      this.countryParamsForPackage.limit = 20;
      this.countryDataForPackage = []; // Clear existing data when searching
      this.isLoadingCountryForPackage = false;
      this.getCountryDataForPackage(false);
    }, 600);
  }

  onClickCountryForPackage(item) {
    const index = this.selectedCountrySearchForPackage.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCountrySearchForPackage.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCountrySearchForPackage.push(item);
    }
    this.packageForm.patchValue({
      country: [...new Set(this.selectedCountrySearchForPackage)],
    });
  }

  compareCurrencyObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  exportMasterDataCSV() {
    // const data = this.arrayData;
    // const dataHeader = [
    //   "S No.",
    //   "Hospital Name",
    //   "GST Applicable",
    //   "OP",
    //   "IP",
    //   "Invoice Category",
    //   "Calculation Bills",
    //   "Notes",
    // ];
    // const csvRows = [];
    // csvRows.push(dataHeader.join(","));
    // data.forEach((row, index) => {
    //   const rowData = [
    //     index + 1,
    //     `"${row.hospitalName}"`,
    //     `"${row.gstApplicable}"`,
    //     `"${row.op}"`,
    //     `"${row.ip}"`,
    //     `"${row.invoiceCategory}"`,
    //     `"${row.calculationBills}"`,
    //     `"${row.notes}"`,
    //   ];
    //   csvRows.push(rowData.join(","));
    // });
    // const csvContent = csvRows.join("\n");
    // const blob = new Blob([csvContent], { type: "text/csv" });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.setAttribute("href", url);
    // a.setAttribute("download", "data.csv");
    // a.click();
  }

  onClickAction(type: string, item: any = null) {
    this.actionTitleForPackage = `${type} Packages`;
    this.isActionTabVisibleForPackage = true;
    this.actionTypeForPackage = type;
  }

  packageFormSubmit(action: any, index: any) {
    if (action === "add") {
      if (this.packageForm.valid) {
        let findHospitalIndex = this.hospitalData?.findIndex(
          (hos: any) => hos?._id === this.hospitalId
        );
        let hospitalName = "";
        if (findHospitalIndex !== -1) {
          hospitalName = this.hospitalData[findHospitalIndex]?.name;
        }

        let payload = {
          hospitalId: this.hospitalId,
          hospitalName: hospitalName || "",
          ...this.packageForm.getRawValue(),
        };

        this.facilitatorService
          .addPackageHospitalPayout(payload)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res?.message
            );
            this.onReload();
          });
      } else {
        this.packageForm.markAllAsTouched();
      }
    } else if (action === "edit") {
      if (this.packageArray?.at(index).valid) {
        let payloadForEdit = {
          ...this.packageArray?.at(index)?.getRawValue(),
        };

        this.facilitatorService
          .editPackageHospitalPayout(this.hospitalId, payloadForEdit)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res?.message
            );
            this.onReload();
          });
      } else {
        this.packageArray?.at(index).markAllAsTouched();
      }
    }
  }

  actionTitleForPackage: string = "";
  isActionTabVisibleForPackage: boolean = false;
  actionTypeForPackage: string = "";
  onReload() {
    this.formGroup.reset();
    this.isActionTabVisibleForPackage = false;
    this.selectedCountrySearchForPackage = [];
    this.packageArray.clear();
    this.getAllPackageHospitalPayoutData();
  }

  selectedFilter: any = [];
  isFilterActive = false;
  openFilterModal(type: any) {
    const dialogRef = this.dialog.open(
      MasterSettingHospitalFilterDialogComponent,
      {
        width: "60%",
        disableClose: true,
        autoFocus: false,
      }
    );

    let selectedFilterData: any = {};
    selectedFilterData = this.selectedFilter;

    dialogRef.componentInstance.openedComponent = "facilitator";
    (dialogRef.componentInstance.selectedFilter = selectedFilterData),
      (dialogRef.componentInstance.type = type),
      dialogRef.afterClosed().subscribe((result) => {
        const { apiCall, filteredData, type } = result;
        if (apiCall) {
          this.selectedFilter = filteredData;

          if (
            filteredData?.country?.length > 0 ||
            filteredData?.revenueType?.length > 0 ||
            filteredData?.currency?.length > 0 ||
            filteredData?.currencyPayout?.length > 0
          ) {
            this.isFilterActive = true;
            let filterObj = {};

            if (filteredData?.country?.length > 0) {
              filterObj["country"] = filteredData?.country;
            }
            if (filteredData?.revenueType?.length > 0) {
              filterObj["revenueType"] = filteredData?.revenueType;
            }
            if (filteredData?.currency?.length > 0) {
              filterObj["currency"] = filteredData?.currency;
            }
            if (filteredData?.currencyPayout?.length > 0) {
              filterObj["currencyPayout"] = filteredData?.currencyPayout;
            }

            this.packageParams.filter_obj = filterObj;
            this.packageParams.page = 1;
            this.revenueDataForPackage = [];
            this.packageArray.clear();
            this.getAllPackageHospitalPayoutData();
          } else if (!!filteredData?.search) {
            this.isFilterActive = true;
            this.packageParams.search = filteredData?.search;
            this.packageParams.page = 1;
            this.revenueDataForPackage = [];
            this.packageArray.clear();
            this.getAllPackageHospitalPayoutData();
          } else {
            this.isFilterActive = false;

            this.selectedFilter = filteredData;
            this.packageParams.filter_obj = {};
            this.packageParams.search = "";
            this.packageParams.page = 1;
            this.revenueDataForPackage = [];
            this.packageArray.clear();
            this.getAllPackageHospitalPayoutData();
          }
        }
      });
  }
}
