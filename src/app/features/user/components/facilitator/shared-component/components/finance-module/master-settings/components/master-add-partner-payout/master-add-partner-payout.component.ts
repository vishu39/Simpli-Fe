import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
@Component({
  selector: "shared-master-add-partner-payout",
  templateUrl: "./master-add-partner-payout.component.html",
  styleUrls: ["./master-add-partner-payout.component.scss"],
})
export class MasterAddPartnerPayoutComponent implements OnInit {
  @Input() selectedMasterOption: any = {};
  @Input() patientData: any = {};

  topSelectionForm: FormGroup;

  gstOption: any = ["Yes", "No"];

  revenueTypeOptions: any = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService
  ) {}

  panelOpenState = true;

  selectedTab: string = "Out Patient";

  onTabChange(event: MatTabChangeEvent) {
    // this.selectedTabIndex = event.index;
    this.selectedTab = event.tab.textLabel;
  }


  ngOnInit(): void {
    this.topSelectionForm = this.fb.group({
      referralPartner: [null, [Validators.required]],
      hospital: [null, [Validators.required]],
      sourceCountry: [null, [Validators.required]],
    });

    this.formGroup = this.fb.group({
      op: this.fb.array([]),
      ip: this.fb.array([]),
    });

    this.buildPackageForm();

    this.getOwnReferralPartner(false);
    // this.getAllHospital(false);
    this.getRevenueTypeMasterFinanceData();
  }

  getRevenueTypeMasterFinanceData() {
    this.sharedService
      .getRevenueTypeMasterFinanceData()
      .subscribe((res: any) => {
        this.revenueTypeOptions = res?.data;
      });
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

          this.topSelectionForm.patchValue({
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
    this.topSelectionForm.patchValue({
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
      this.topSelectionForm.patchValue({
        sourceCountry: [],
      });
    }
  }


  packageForm: FormGroup;
  buildPackageForm() {
    this.packageForm = this.fb.group({
      package: [null, [Validators.required]],
      payoutInPercentage: ["", [Validators.required]],
      payoutPartnerInPercentage: ["", [Validators.required]],
      payoutInFixedAmount: ["", [Validators.required]],
      payoutPartnerInFixedAmount: ["", [Validators.required]],
    });
  }

  // onClickTopSubmit() {
  //   let values = this.topSelectionForm.getRawValue();
  //   let hospitals = values?.hospital;
  //   let sourceCountry = values?.sourceCountry;
  //   let referralPartner = values?.referralPartner[0];

  //   let payload = {
  //     referralPartnerId: referralPartner?._id,
  //     referralPartnerName: referralPartner?.name,
  //     hospital: hospitals,
  //     sourceCountry: sourceCountry,
  //   };

  //   if (hospitals?.length && !!payload?.referralPartnerId) {
  //     // this.addCommonHospitalForPartnerPayout(payload);
  //   }
  // }

  formGroup: FormGroup;

  // referral partner linking start
  ownReferralPartnerData = [];
  ownReferralPartnerFreshData = [];
  selectedOwnReferralPartnerSearch = [];
  totalElementOwnReferralPartner: number;
  isLoadingOwnReferralPartner: boolean = false;
  isLoadingOwnReferralPartnerSelectAll: boolean = false;
  timeoutOwnReferralPartner = null;

  getOwnReferralPartner(selectAll: boolean) {
    if (this.isLoadingOwnReferralPartner) {
      return;
    }
    this.isLoadingOwnReferralPartner = true;
    this.facilitatorService.getAllReferralPartner().subscribe((res: any) => {
      // if (selectAll) {
      //   this.ownReferralPartnerData = [];
      // }

      this.ownReferralPartnerData.push(...res.data);
      this.ownReferralPartnerFreshData = cloneDeep(this.ownReferralPartnerData);
      this.totalElementOwnReferralPartner = res.data.totalElement;
      this.isLoadingOwnReferralPartner = false;

      // if (selectAll) {
      //   const allPartnerNames = this.ownReferralPartnerData.map((item) => ({
      //     _id: item._id,
      //     name: item.name,
      //   }));

      //   allPartnerNames.forEach((hospital) => {
      //     const isPartnerAlreadySelected =
      //       this.selectedOwnReferralPartnerSearch.some(
      //         (selectedPartner) => selectedPartner._id === hospital._id
      //       );

      //     if (!isPartnerAlreadySelected) {
      //       this.selectedOwnReferralPartnerSearch.push(hospital);
      //     }
      //   });

      //   this.topSelectionForm.patchValue({
      //     referralPartner: this.selectedOwnReferralPartnerSearch,
      //   });
      //   this.isLoadingOwnReferralPartnerSelectAll = false;
      // }
    });
  }

  searchOwnReferralPartner(filterValue: string) {
    clearTimeout(this.timeoutOwnReferralPartner);
    this.timeoutOwnReferralPartner = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.ownReferralPartnerFreshData);
        this.ownReferralPartnerData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.ownReferralPartnerData = filterArray;
      } else {
        this.ownReferralPartnerData = this.ownReferralPartnerFreshData;
      }
    }, 600);
  }

  onClickOwnReferralPartner(item) {
    // const index = this.selectedOwnReferralPartnerSearch.findIndex(
    //   (element) => element._id === item._id
    // ); // Check if the item exists in the array

    // if (index !== -1) {
    //   // If the item exists, remove it
    //   this.selectedOwnReferralPartnerSearch.splice(index, 1);
    // } else {
    //   // If the item doesn't exist, push it
    //   this.selectedOwnReferralPartnerSearch.push(item);
    // }
    this.selectedOwnReferralPartnerSearch = [item];
    this.topSelectionForm.patchValue({
      referralPartner: [...new Set(this.selectedOwnReferralPartnerSearch)],
    });
    if (this.selectedOwnReferralPartnerSearch?.length) {
      this.hospitalData = [];
      this.freshHospitalData = [];
      this.hospitalParams.page = 1;
    }
  }

  // selectAllOwnReferralPartner(event) {
  //   if (event.checked) {
  //     this.isLoadingOwnReferralPartner = false;
  //     this.isLoadingOwnReferralPartnerSelectAll = true;
  //     this.getOwnReferralPartner(true);
  //   } else {
  //     this.selectedOwnReferralPartnerSearch = [];
  //     this.topSelectionForm.patchValue({
  //       referralPartner: [],
  //     });
  //   }
  // }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
  // referral partner linking end

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

          this.topSelectionForm.patchValue({
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
    this.topSelectionForm.patchValue({
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
      this.topSelectionForm.patchValue({
        hospital: [],
      });
    }
  }

  actionTitleForOP: string = "";
  isActionTabVisibleForOp: boolean = false;
  actionTypeForOP: string = "";

  actionTitleForIP: string = "";
  isActionTabVisibleForIp: boolean = false;
  actionTypeForIP: string = "";

  onClickAction(type: string, item: any = null) {
    if (this.selectedTab === "Out Patient") {
      this.actionTitleForOP = `${type} ${this.selectedTab}`;
      this.isActionTabVisibleForOp = true;
      this.actionTypeForOP = type;

      if (type === "Edit") {
        // this.patchIfEditForOp(item);
      }
    } else if (this.selectedTab === "In Patient") {
      this.actionTitleForIP = `${type} ${this.selectedTab}`;
      this.isActionTabVisibleForIp = true;
      this.actionTypeForIP = type;

      if (type === "Edit") {
        // this.patchIfEditForIp(item);
      }
    }
  }

  // patchIfEditForOp(item: any) {
  //   this.opForm.patchValue(item);
  // }

  // patchIfEditForIp(item: any) {
  //   this.ipForm.patchValue(item);
  // }

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
}
