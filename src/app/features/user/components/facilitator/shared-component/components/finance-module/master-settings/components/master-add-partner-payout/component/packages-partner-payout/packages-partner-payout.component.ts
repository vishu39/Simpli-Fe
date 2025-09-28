import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { currencies } from "currencies.json";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { MasterSettingPartnerFilterDialogComponent } from "src/app/shared/components/finance-module/dialogs/master-setting-partner-filter-dialog/master-setting-partner-filter-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-packages-partner-payout",
  templateUrl: "./packages-partner-payout.component.html",
  styleUrls: ["./packages-partner-payout.component.scss"],
})
export class PackagesPartnerPayoutComponent implements OnInit {
  @Input() referralPartner: any;
  formGroup: FormGroup;
  addFormGroup: FormGroup;
  isAddVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {
    this.addFormGroup = this.fb.group({
      hospital: [null, [Validators.required]],
      sourceCountry: [null, [Validators.required]],
      payoutPartnerInPercentage: ["", [Validators.required]],
      payoutPartnerInFixedAmount: ["", [Validators.required]],
    });

    this.formGroup = this.fb.group({
      packages: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getAllHospital(false);
    this.getCountryDataForSource(false);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (!!simpleChanges?.referralPartner?.currentValue) {
      this.addFormGroup.reset();
      this.isAddVisible = false;
      this.packageArray.clear();
      this.getAllPackagePartnerPayoutData();
    } else {
      if (this.referralPartner.length) {
        this.getAllPackagePartnerPayoutData();
      }
    }
  }

  // Hospital linking
  hospitalData = [];
  freshHospitalData = [];
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll: boolean = false;
  totalElementHospital: number;
  selectedHospitalSearch = [];
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };

  getAllHospital(selectAll: Boolean) {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.hospitalData = [];
        }
        this.freshHospitalData.push(...res.data.content);
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;

        this.isLoadingHospital = false;

        this.getCountryDataForSource(false);
        // if (this.commonAddedHospitalData?.length) {
        //   this.filterHospitalByRequest(this.hospitalData);
        // }

        if (selectAll) {
          const allHospital = this.hospitalData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allHospital.forEach((hospital) => {
            const isHospitalAlreadySelected = this.selectedHospitalSearch.some(
              (selectedHospital) => selectedHospital._id === hospital._id
            );

            if (!isHospitalAlreadySelected) {
              this.selectedHospitalSearch.push(hospital);
            }
          });

          this.addFormGroup.patchValue({
            hospital: this.selectedHospitalSearch,
          });

          this.isLoadingHospitalSelectAll = false;
        }
      });
  }

  onInfiniteScrollHospital(): void {
    if (this.freshHospitalData.length < this.totalElementHospital) {
      this.getAllHospital(false);
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 20;
      this.hospitalData = [];
      this.freshHospitalData = [];
      this.isLoadingHospital = false;
      this.getAllHospital(false);
    }, 600);
  }

  onClickHospital(item) {
    const index = this.selectedHospitalSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedHospitalSearch.splice(index, 1);
    } else {
      this.selectedHospitalSearch.push(item);
    }
    this.addFormGroup.patchValue({
      hospital: [...new Set(this.selectedHospitalSearch)],
    });
  }

  selectAllHospital(event: any) {
    if (event.checked) {
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 0;
      this.isLoadingHospital = false;
      this.isLoadingHospitalSelectAll = true;
      this.getAllHospital(true);
    } else {
      this.selectedHospitalSearch = [];
      this.addFormGroup.patchValue({
        hospital: [],
      });
    }
  }

  filterHospitalByRequest(hospitalData: any) {
    this.hospitalData = [];
    let resData = hospitalData;
    // this.commonAddedHospitalData?.forEach((data: any) => {
    //   let index = resData?.findIndex((rd: any) => rd?._id === data?.hospitalId);
    //   if (index !== -1) {
    //     resData.splice(index, 1);
    //   }
    // });
    this.hospitalData.push(...resData);
  }

  // country linking for OP
  countryDataForSource: any = [];
  totalElementCountryForSource: number;
  countryParamsForSource = {
    page: 1,
    limit: 0,
    search: "",
  };
  timeoutCountryForSource = null;
  isLoadingCountryForSource = false;
  isLoadingCountrySelectAllForSource = false;
  selectedCountrySearchForSource: any = [];
  getCountryDataForSource(selectAll: Boolean) {
    if (this.isLoadingCountryForSource) {
      return;
    }
    this.isLoadingCountryForSource = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParamsForSource)
      .subscribe((res: any) => {
        if (selectAll) {
          this.countryDataForSource = [];
        }

        this.countryDataForSource.push(...res.data.content);
        this.totalElementCountryForSource = res.data.totalElement;
        this.countryParamsForSource.page = this.countryParamsForSource.page + 1;
        this.isLoadingCountryForSource = false;
        if (selectAll) {
          const allCountryNames = this.countryDataForSource.map(
            (item) => item.name
          );
          allCountryNames.forEach(
            (country) =>
              this.selectedCountrySearchForSource.includes(country) ||
              this.selectedCountrySearchForSource.push(country)
          );

          this.addFormGroup.patchValue({
            sourceCountry: this.selectedCountrySearchForSource,
          });
          this.isLoadingCountrySelectAllForSource = false;
        }
      });
  }

  onInfiniteScrollCountryForSource(): void {
    if (this.countryDataForSource.length < this.totalElementCountryForSource) {
      this.getCountryDataForSource(false);
    }
  }

  searchCountryForSource(filterValue: string) {
    clearTimeout(this.timeoutCountryForSource);
    this.timeoutCountryForSource = setTimeout(() => {
      this.countryParamsForSource.search = filterValue.trim();
      this.countryParamsForSource.page = 1;
      this.countryParamsForSource.limit = 20;
      this.countryDataForSource = []; // Clear existing data when searching
      this.isLoadingCountryForSource = false;
      this.getCountryDataForSource(false);
    }, 600);
  }

  onClickCountryForSource(item) {
    const index = this.selectedCountrySearchForSource.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCountrySearchForSource.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCountrySearchForSource.push(item);
    }
    this.addFormGroup.patchValue({
      sourceCountry: [...new Set(this.selectedCountrySearchForSource)],
    });
  }

  selectAllCountryForSource(event) {
    if (event.checked) {
      this.countryParamsForSource.page = 1;
      this.countryParamsForSource.limit = 0;
      this.isLoadingCountryForSource = false;
      this.isLoadingCountrySelectAllForSource = true;
      this.getCountryDataForSource(true);
    } else {
      this.selectedCountrySearchForSource = [];
      this.addFormGroup.patchValue({
        sourceCountry: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  get packageArray(): FormArray {
    return this.formGroup.get("packages") as FormArray;
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
  getAllPackagePartnerPayoutData() {
    this.isDataLoadingForPackage = true;
    let referralPartnerId = this.referralPartner[0]?._id;
    this.facilitatorService
      .getAllPackagePartnerPayoutData(this.packageParams, referralPartnerId)
      .subscribe(
        (res: any) => {
          this.revenueDataForPackage = res?.data?.content;
          this.totalElementPackage = res?.data?.totalElement;
          this.calculateTotalPagesForPackage();
          this.isDataLoadingForPackage = false;

          if (this.revenueDataForPackage?.length) {
            this.packageArray.clear();
            this.revenueDataForPackage?.forEach((data: any) => {
              this.addPackageFormField({
                _id: data?.hospitalId,
                name: data?.hospitalName,
                packageName: data?.packageName,
                packageCost: data?.packageCost,
                currency: data?.currency,
                currencyPayout: data?.currencyPayout,
                payoutInPercentage: data?.payoutInPercentage,
                payoutInFixedAmount: data?.payoutInFixedAmount,
                payoutPartnerInPercentage: data?.payoutPartnerInPercentage,
                payoutPartnerInFixedAmount: data?.payoutPartnerInFixedAmount,
                sourceCountry: data?.sourceCountry,
              });
            });
          }
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
      this.getAllPackagePartnerPayoutData();
    } else {
      this.packageParams.page = this.totalNumberOfPagesForPackage;
    }
  }

  prevForPackage() {
    if (this.packageParams?.page > 1) {
      this.packageParams.page = this.packageParams?.page - 1;
      this.revenueDataForPackage = [];
      this.packageArray.clear();
      this.getAllPackagePartnerPayoutData();
    }
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
    // this.packageForm.patchValue({
    //   currency: item,
    // });
  }

  addPackageFormField(item: any) {
    let buildObj = this.fb.group({
      hospitalId: [
        {
          value: item?._id || "",
          disabled: true,
        },
        [Validators.required],
      ],
      hospitalName: [
        {
          value: item?.name || "",
          disabled: true,
        },
        [Validators.required],
      ],
      sourceCountry: [
        {
          value: item?.sourceCountry || "",
          disabled: true,
        },
        [Validators.required],
      ],
      packageName: [
        {
          value: item?.packageName || "",
          disabled: true,
        },
        [Validators.required],
      ],
      packageCost: [
        {
          value: item?.packageCost || "",
          disabled: true,
        },
        [Validators.required],
      ],
      currency: [
        {
          value: item?.currency?.code || "",
          disabled: true,
        },
        [Validators.required],
      ],
      currencyPayout: [
        {
          value: item?.currencyPayout?.code || "",
          disabled: true,
        },
        [Validators.required],
      ],
      payoutInPercentage: [
        {
          value: item?.payoutInPercentage || "",
          disabled: true,
        },
        [Validators.required],
      ],
      payoutInFixedAmount: [
        {
          value: item?.payoutInFixedAmount || "",
          disabled: true,
        },
        [Validators.required],
      ],
      payoutPartnerInPercentage: [
        item?.payoutPartnerInPercentage || "",
        [Validators.required],
      ],
      payoutPartnerInFixedAmount: [
        item?.payoutPartnerInFixedAmount || "",
        [Validators.required],
      ],
    });

    this.packageArray.push(buildObj);
  }

  onReload() {
    this.addFormGroup.reset();
    this.isAddVisible = false;
    this.selectedCountrySearchForSource = [];
    this.selectedHospitalSearch = [];
    this.packageArray.clear();
    this.getAllPackagePartnerPayoutData();
  }

  addPayoutForm() {
    if (this.addFormGroup.valid) {
      let referralPartner: any = this.referralPartner[0];
      let payload = {
        referralPartnerId: referralPartner?._id,
        referralPartnerName: referralPartner?.name,
        ...this.addFormGroup?.getRawValue(),
      };

      this.facilitatorService
        .addPackagePartnerPayout(payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.onReload();
        });
    } else {
      this.addFormGroup.markAllAsTouched();
    }
  }

  editPayoutForm(index = null) {
    let referralPartner: any = this.referralPartner[0];

    if (this.packageArray?.at(index).valid) {
      let payload = {
        referralPartnerId: referralPartner?._id,
        referralPartnerName: referralPartner?.name,
        ...this.packageArray?.at(index)?.getRawValue(),
      };

      this.facilitatorService
        .editPackagePartnerPayout(referralPartner?._id, payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.onReload();
        });
    } else {
      this.packageArray?.at(index).markAllAsTouched();
    }
  }

  selectedFilter: any = [];

  isFilterActive = false;
  openFilterModal() {
    const dialogRef = this.dialog.open(
      MasterSettingPartnerFilterDialogComponent,
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
      (dialogRef.componentInstance.type = "package"),
      dialogRef.afterClosed().subscribe((result) => {
        const { apiCall, filteredData, type } = result;
        if (apiCall) {
          this.selectedFilter = filteredData;

          if (
            filteredData?.country?.length > 0 ||
            filteredData?.hospital?.length > 0 ||
            filteredData?.revenueType?.length > 0 ||
            filteredData?.currency?.length > 0 ||
            filteredData?.revenueTypePartner?.length > 0 ||
            filteredData?.currencyPayout?.length > 0
          ) {
            this.isFilterActive = true;
            let filterObj = {};

            if (filteredData?.country?.length > 0) {
              filterObj["country"] = filteredData?.country;
            }
            if (filteredData?.hospital?.length > 0) {
              filterObj["hospital"] = filteredData?.hospital;
            }
            if (filteredData?.revenueType?.length > 0) {
              filterObj["revenueType"] = filteredData?.revenueType;
            }
            if (filteredData?.currency?.length > 0) {
              filterObj["currency"] = filteredData?.currency;
            }
            if (filteredData?.revenueTypePartner?.length > 0) {
              filterObj["revenueTypePartner"] =
                filteredData?.revenueTypePartner;
            }
            if (filteredData?.currencyPayout?.length > 0) {
              filterObj["currencyPayout"] = filteredData?.currencyPayout;
            }

            this.packageParams.filter_obj = filterObj;
            this.packageParams.page = 1;
            this.revenueDataForPackage = [];
            this.packageArray.clear();
            this.getAllPackagePartnerPayoutData();
          } else if (!!filteredData?.search) {
            this.isFilterActive = true;
            this.packageParams.search = filteredData?.search;
            this.packageParams.page = 1;
            this.revenueDataForPackage = [];
            this.packageArray.clear();
            this.getAllPackagePartnerPayoutData();
          } else {
            this.isFilterActive = false;
            this.selectedFilter = filteredData;
            this.packageParams.filter_obj = {};
            this.packageParams.search = "";
            this.packageParams.page = 1;
            this.revenueDataForPackage = [];
            this.packageArray.clear();
            this.getAllPackagePartnerPayoutData();
          }
        }
      });
  }
}
