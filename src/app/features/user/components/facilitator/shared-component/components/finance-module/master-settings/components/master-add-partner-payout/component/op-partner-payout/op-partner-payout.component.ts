import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { MasterSettingPartnerFilterDialogComponent } from "src/app/shared/components/finance-module/dialogs/master-setting-partner-filter-dialog/master-setting-partner-filter-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-op-partner-payout",
  templateUrl: "./op-partner-payout.component.html",
  styleUrls: ["./op-partner-payout.component.scss"],
})
export class OpPartnerPayoutComponent implements OnInit, OnChanges {
  @Input() referralPartner: any;
  formGroup: FormGroup;
  addFormGroup: FormGroup;
  isAddVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {}

  revenueTypeOptions: any = [];

  ngOnInit(): void {
    this.addFormGroup = this.fb.group({
      hospital: [null, [Validators.required]],
      sourceCountry: [null, [Validators.required]],
      partnersPayout: ["", [Validators.required]],
      revenueTypePartner: ["", [Validators.required]],
    });

    this.formGroup = this.fb.group({
      op: this.fb.array([]),
    });

    this.getAllHospital(false);
    this.getCountryDataForSource(false);
    this.getRevenueTypeMasterFinanceData();
  }

  getRevenueTypeMasterFinanceData() {
    this.sharedService
      .getRevenueTypeMasterFinanceData()
      .subscribe((res: any) => {
        this.revenueTypeOptions = res?.data;
      });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (!!simpleChanges?.referralPartner?.currentValue) {
      this.addFormGroup.reset();
      this.isAddVisible = false;
      this.opArray.clear();
      this.getAllOpPartnerPayoutData();
    } else {
      if (this.referralPartner.length) {
        this.getAllOpPartnerPayoutData();
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

  get opArray(): FormArray {
    return this.formGroup.get("op") as FormArray;
  }

  opParams = {
    page: 1,
    limit: 10,
    search: "",
    filter_obj: {},
  };
  isDataLoadingForOp: boolean = false;
  totalNumberOfPagesForOp = 0;
  revenueDataForOp: any = [];
  totalElementOp: number = 0;
  getAllOpPartnerPayoutData() {
    this.isDataLoadingForOp = true;
    let referralPartnerId = this.referralPartner[0]?._id;
    this.facilitatorService
      .getAllOpPartnerPayoutData(this.opParams, referralPartnerId)
      .subscribe(
        (res: any) => {
          this.revenueDataForOp = res?.data?.content;
          this.totalElementOp = res?.data?.totalElement;
          this.calculateTotalPagesForOp();
          this.isDataLoadingForOp = false;

          if (this.revenueDataForOp?.length) {
            this.opArray.clear();
            this.revenueDataForOp?.forEach((data: any) => {
              this.addOpFormField({
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
          this.isDataLoadingForOp = false;
        }
      );
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  calculateTotalPagesForOp() {
    this.totalNumberOfPagesForOp = Math.ceil(
      this.totalElementOp / this.opParams.limit
    );
  }

  nextForOp() {
    this.opParams.page = this.opParams?.page + 1;
    if (this.opParams?.page <= this.totalNumberOfPagesForOp) {
      this.revenueDataForOp = [];
      this.opArray.clear();
      this.getAllOpPartnerPayoutData();
    } else {
      this.opParams.page = this.totalNumberOfPagesForOp;
    }
  }

  prevForOp() {
    if (this.opParams?.page > 1) {
      this.opParams.page = this.opParams?.page - 1;
      this.revenueDataForOp = [];
      this.opArray.clear();
      this.getAllOpPartnerPayoutData();
    }
  }

  addOpFormField(item: any) {
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
      partnersPayout: [item?.partnersPayout || "", [Validators.required]],
      revenueTypePartner: [
        item?.revenueTypePartner || "",
        [Validators.required],
      ],
    });

    this.opArray.push(buildObj);
  }

  onReload() {
    this.addFormGroup.reset();
    this.isAddVisible = false;
    this.selectedCountrySearchForSource = [];
    this.selectedHospitalSearch = [];
    this.getAllOpPartnerPayoutData();
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
        .addOpPartnerPayout(payload)
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

    if (this.opArray?.at(index).valid) {
      let payload = {
        referralPartnerId: referralPartner?._id,
        referralPartnerName: referralPartner?.name,
        ...this.opArray?.at(index)?.getRawValue(),
      };

      this.facilitatorService
        .editOpPartnerPayout(referralPartner?._id, payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.onReload();
        });
    } else {
      this.opArray?.at(index).markAllAsTouched();
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
      (dialogRef.componentInstance.type = "outPatient"),
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

            this.opParams.filter_obj = filterObj;
            this.opParams.page = 1;
            this.revenueDataForOp = [];
            this.opArray.clear();
            this.getAllOpPartnerPayoutData();
          } else if (!!filteredData?.search) {
            this.isFilterActive = true;
            this.opParams.search = filteredData?.search;
            this.opParams.page = 1;
            this.revenueDataForOp = [];
            this.opArray.clear();
            this.getAllOpPartnerPayoutData();
          } else {
            this.isFilterActive = false;
            this.selectedFilter = filteredData;
            this.opParams.filter_obj = {};
            this.opParams.search = "";
            this.opParams.page = 1;
            this.revenueDataForOp = [];
            this.opArray.clear();
            this.getAllOpPartnerPayoutData();
          }
        }
      });
  }
}
