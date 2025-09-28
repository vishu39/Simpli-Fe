import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { MasterSettingPartnerFilterDialogComponent } from "src/app/shared/components/finance-module/dialogs/master-setting-partner-filter-dialog/master-setting-partner-filter-dialog.component";

@Component({
  selector: "app-ip-partner-payout",
  templateUrl: "./ip-partner-payout.component.html",
  styleUrls: ["./ip-partner-payout.component.scss"],
})
export class IpPartnerPayoutComponent implements OnInit {
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
      partnersPayout: ["", [Validators.required]],
      revenueTypePartner: ["", [Validators.required]],
    });

    this.formGroup = this.fb.group({
      ip: this.fb.array([]),
    });
  }

  revenueTypeOptions: any = [];

  ngOnInit(): void {
    this.getAllHospital(false);
    this.getCountryDataForSource(false);
  }

  getRevenueTypeMasterFinanceData() {
    this.sharedService
      .getRevenueTypeMasterFinanceData()
      .subscribe((res: any) => {
        this.revenueTypeOptions = res?.data;
      });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (
      !!simpleChanges?.referralPartner?.currentValue &&
      !simpleChanges?.referralPartner?.firstChange
    ) {
      this.addFormGroup.reset();
      this.isAddVisible = false;
      this.ipArray.clear();
      this.getAllIpPartnerPayoutData();
    } else {
      if (this.referralPartner.length) {
        this.getRevenueTypeMasterFinanceData();
        this.getAllIpPartnerPayoutData();
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

  get ipArray(): FormArray {
    return this.formGroup.get("ip") as FormArray;
  }

  ipParams = {
    page: 1,
    limit: 10,
    search: "",
    filter_obj: {},
  };
  isDataLoadingForIp: boolean = false;
  totalNumberOfPagesForIp = 0;
  revenueDataForIp: any = [];
  totalElementIp: number = 0;
  getAllIpPartnerPayoutData() {
    this.isDataLoadingForIp = true;
    let referralPartnerId = this.referralPartner[0]?._id;
    this.facilitatorService
      .getAllIpPartnerPayoutData(this.ipParams, referralPartnerId)
      .subscribe(
        (res: any) => {
          this.revenueDataForIp = res?.data?.content;
          this.totalElementIp = res?.data?.totalElement;
          this.calculateTotalPagesForIp();
          this.isDataLoadingForIp = false;

          if (this.revenueDataForIp?.length) {
            this.ipArray.clear();
            this.revenueDataForIp?.forEach((data: any) => {
              this.addIpFormField({
                _id: data?.hospitalId,
                name: data?.hospitalName,
                calculatedRevenue: data?.calculatedRevenue,
                revenueType: data?.revenueType,
                partnersPayout: data?.partnersPayout,
                revenueTypePartner: data?.revenueTypePartner,
                sourceCountry: data?.sourceCountry,
              });
            });
          }
        },
        (err) => {
          this.isDataLoadingForIp = false;
        }
      );
  }

  calculateTotalPagesForIp() {
    this.totalNumberOfPagesForIp = Math.ceil(
      this.totalElementIp / this.ipParams.limit
    );
  }

  nextForIp() {
    this.ipParams.page = this.ipParams?.page + 1;
    if (this.ipParams?.page <= this.totalNumberOfPagesForIp) {
      this.revenueDataForIp = [];
      this.ipArray.clear();
      this.getAllIpPartnerPayoutData();
    } else {
      this.ipParams.page = this.totalNumberOfPagesForIp;
    }
  }

  prevForIp() {
    if (this.ipParams?.page > 1) {
      this.ipParams.page = this.ipParams?.page - 1;
      this.revenueDataForIp = [];
      this.ipArray.clear();
      this.getAllIpPartnerPayoutData();
    }
  }

  addIpFormField(item: any) {
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
      calculatedRevenue: [
        {
          value: item?.calculatedRevenue || "",
          disabled: true,
        },
        [Validators.required],
      ],
      revenueType: [
        {
          value: item?.revenueType || "",
          disabled: true,
        },
        [Validators.required],
      ],
      partnersPayout: ["", [Validators.required]],
      revenueTypePartner: ["", [Validators.required]],
    });

    this.ipArray.push(buildObj);
  }

  onReload() {
    this.addFormGroup.reset();
    this.isAddVisible = false;
    this.selectedCountrySearchForSource = [];
    this.selectedHospitalSearch = [];
    this.getAllIpPartnerPayoutData();
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
        .addIpPartnerPayout(payload)
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

    if (this.ipArray?.at(index).valid) {
      let payload = {
        referralPartnerId: referralPartner?._id,
        referralPartnerName: referralPartner?.name,
        ...this.ipArray?.at(index)?.getRawValue(),
      };

      this.facilitatorService
        .editIpPartnerPayout(referralPartner?._id, payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          // this.onReload();
        });
    } else {
      this.ipArray?.at(index).markAllAsTouched();
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
      (dialogRef.componentInstance.type = "inPatient"),
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
            filteredData?.currencyPartner?.length > 0
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
            if (filteredData?.currencyPartner?.length > 0) {
              filterObj["currencyPartner"] = filteredData?.currencyPartner;
            }

            this.ipParams.filter_obj = filterObj;
            this.ipParams.page = 1;
            this.revenueDataForIp = [];
            this.ipArray.clear();
            this.getAllIpPartnerPayoutData();
          } else if (!!filteredData?.search) {
            this.isFilterActive = true;
            this.ipParams.search = filteredData?.search;
            this.ipParams.page = 1;
            this.revenueDataForIp = [];
            this.ipArray.clear();
            this.getAllIpPartnerPayoutData();
          } else {
            this.isFilterActive = false;
            this.selectedFilter = filteredData;
            this.ipParams.filter_obj = {};
            this.ipParams.search = "";
            this.ipParams.page = 1;
            this.revenueDataForIp = [];
            this.ipArray.clear();
            this.getAllIpPartnerPayoutData();
          }
        }
      });
  }
}
