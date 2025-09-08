import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { MasterSettingHospitalFilterDialogComponent } from "src/app/shared/components/finance-module/dialogs/master-setting-hospital-filter-dialog/master-setting-hospital-filter-dialog.component";

@Component({
  selector: "app-ip-hospital-payout",
  templateUrl: "./ip-hospital-payout.component.html",
  styleUrls: ["./ip-hospital-payout.component.scss"],
})
export class IpHospitalPayoutComponent implements OnInit {
  @Input() hospitalId: any;
  @Input() hospitalData: any;
  ipForm: FormGroup;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildIpForm();

    this.formGroup = this.fb.group({
      ip: this.fb.array([]),
    });

    this.getRevenueTypeMasterFinanceData();
    this.getCountryDataForIP(false);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (
      !!simpleChanges?.hospitalId?.currentValue &&
      !simpleChanges?.hospitalId?.firstChange
    ) {
      this.ipForm.reset();
      this.isActionTabVisibleForIp = false;
      this.revenueDataForIp = [];
      this.ipArray.clear();
      this.getAllIpHospitalPayoutData();
    } else {
      if (this.hospitalId) {
        this.getAllIpHospitalPayoutData();
      }
    }
  }

  buildIpForm() {
    this.ipForm = this.fb.group({
      country: [null, [Validators.required]],
      calculatedRevenue: ["", [Validators.required]],
      revenueType: [null, [Validators.required]],
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
  getAllIpHospitalPayoutData() {
    this.isDataLoadingForIp = true;
    this.facilitatorService
      .getAllIpHospitalPayoutData(this.ipParams, this.hospitalId)
      .subscribe(
        (res: any) => {
          this.revenueDataForIp = res?.data?.content;
          this.totalElementIp = res?.data?.totalElement;
          this.modifyFormArrayDataForIP(this.revenueDataForIp);
          this.calculateTotalPagesForIp();
          this.isDataLoadingForIp = false;
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
      this.getAllIpHospitalPayoutData();
    } else {
      this.ipParams.page = this.totalNumberOfPagesForIp;
    }
  }

  prevForIp() {
    if (this.ipParams?.page > 1) {
      this.ipParams.page = this.ipParams?.page - 1;
      this.revenueDataForIp = [];
      this.ipArray.clear();
      this.getAllIpHospitalPayoutData();
    }
  }

  modifyFormArrayDataForIP(array: any) {
    if (array?.length) {
      this.ipArray.clear();
      array.forEach((a: any) => {
        this.addIpFormField(a);
      });
    }
  }

  get ipArray(): FormArray {
    return this.formGroup.get("ip") as FormArray;
  }

  addIpFormField(item: any) {
    let buildObj = this.fb.group({
      hospitalId: item?.hospitalId,
      hospitalName: item?.hospitalName,
      country: [
        {
          value: item?.country || "",
          disabled: true,
        },
        [Validators.required],
      ],
      calculatedRevenue: [item?.calculatedRevenue || "", [Validators.required]],
      revenueType: [item?.revenueType, [Validators.required]],
    });

    this.ipArray.push(buildObj);
  }

  // country linking for IP
  countryDataForIP: any = [];
  totalElementCountryForIP: number;
  countryParamsForIP = {
    page: 1,
    limit: 0,
    search: "",
  };
  timeoutCountryForIP = null;
  isLoadingCountryForIP = false;
  isLoadingCountrySelectAllForIP = false;
  selectedCountrySearchForIP: any = [];
  getCountryDataForIP(selectAll: Boolean) {
    if (this.isLoadingCountryForIP) {
      return;
    }
    this.isLoadingCountryForIP = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParamsForIP)
      .subscribe((res: any) => {
        if (selectAll) {
          this.countryDataForIP = [];
        }

        this.countryDataForIP.push(...res.data.content);
        this.totalElementCountryForIP = res.data.totalElement;
        this.countryParamsForIP.page = this.countryParamsForIP.page + 1;
        this.isLoadingCountryForIP = false;
        if (selectAll) {
          const allCountryNames = this.countryDataForIP.map(
            (item) => item.name
          );
          allCountryNames.forEach(
            (country) =>
              this.selectedCountrySearchForIP.includes(country) ||
              this.selectedCountrySearchForIP.push(country)
          );

          this.ipForm.patchValue({
            country: this.selectedCountrySearchForIP,
          });
          this.isLoadingCountrySelectAllForIP = false;
        }
      });
  }

  onInfiniteScrollCountryForIP(): void {
    if (this.countryDataForIP.length < this.totalElementCountryForIP) {
      this.getCountryDataForIP(false);
    }
  }

  searchCountryForIP(filterValue: string) {
    clearTimeout(this.timeoutCountryForIP);
    this.timeoutCountryForIP = setTimeout(() => {
      this.countryParamsForIP.search = filterValue.trim();
      this.countryParamsForIP.page = 1;
      this.countryParamsForIP.limit = 20;
      this.countryDataForIP = []; // Clear existing data when searching
      this.isLoadingCountryForIP = false;
      this.getCountryDataForIP(false);
    }, 600);
  }

  onClickCountryForIP(item) {
    const index = this.selectedCountrySearchForIP.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCountrySearchForIP.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCountrySearchForIP.push(item);
    }
    this.ipForm.patchValue({
      country: [...new Set(this.selectedCountrySearchForIP)],
    });
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
    this.actionTitleForIP = `${type} In Patient`;
    this.isActionTabVisibleForIp = true;
    this.actionTypeForIP = type;
  }

  inPatientFormSubmit(action: string, index = null) {
    if (action === "add") {
      if (this.ipForm.valid) {
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
          ...this.ipForm.getRawValue(),
        };

        this.facilitatorService
          .addIpHospitalPayout(payload)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res?.message
            );
            this.onReload();
          });
      } else {
        this.ipForm.markAllAsTouched();
      }
    } else if (action === "edit") {
      if (this.ipArray?.at(index).valid) {
        let payloadForEdit = {
          ...this.ipArray?.at(index)?.getRawValue(),
        };

        this.facilitatorService
          .editIpHospitalPayout(this.hospitalId, payloadForEdit)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res?.message
            );
            this.onReload();
          });
      } else {
        this.ipArray?.at(index).markAllAsTouched();
      }
    }
  }

  actionTitleForIP: string = "";
  isActionTabVisibleForIp: boolean = false;
  actionTypeForIP: string = "";
  onReload() {
    this.formGroup.reset();
    this.isActionTabVisibleForIp = false;
    this.selectedCountrySearchForIP = [];
    this.ipArray.clear();
    this.getAllIpHospitalPayoutData();
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

            this.ipParams.filter_obj = filterObj;
            this.ipParams.page = 1;
            this.revenueDataForIp = [];
            this.ipArray.clear();
            this.getAllIpHospitalPayoutData();
          } else if (!!filteredData?.search) {
            this.isFilterActive = true;
            this.ipParams.search = filteredData?.search;
            this.ipParams.page = 1;
            this.revenueDataForIp = [];
            this.ipArray.clear();
            this.getAllIpHospitalPayoutData();
          } else {
            this.isFilterActive = false;

            this.selectedFilter = filteredData;
            this.ipParams.filter_obj = {};
            this.ipParams.search = "";
            this.ipParams.page = 1;
            this.revenueDataForIp = [];
            this.ipArray.clear();
            this.getAllIpHospitalPayoutData();
          }
        }
      });
  }
}
