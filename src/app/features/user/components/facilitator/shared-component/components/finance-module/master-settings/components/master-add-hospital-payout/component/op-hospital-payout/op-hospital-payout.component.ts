import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { MasterSettingHospitalFilterDialogComponent } from "src/app/shared/components/finance-module/dialogs/master-setting-hospital-filter-dialog/master-setting-hospital-filter-dialog.component";

@Component({
  selector: "app-op-hospital-payout",
  templateUrl: "./op-hospital-payout.component.html",
  styleUrls: ["./op-hospital-payout.component.scss"],
})
export class OpHospitalPayoutComponent implements OnInit {
  @Input() hospitalId: any;
  @Input() hospitalData: any;
  opForm: FormGroup;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildOpForm();

    this.formGroup = this.fb.group({
      op: this.fb.array([]),
    });
    this.getRevenueTypeMasterFinanceData();
    this.getCountryDataForOP(false);
  }

  buildOpForm() {
    this.opForm = this.fb.group({
      country: [null, [Validators.required]],
      calculatedRevenue: ["", [Validators.required]],
      revenueType: [null, [Validators.required]],
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (
      !!simpleChanges?.hospitalId?.currentValue &&
      !simpleChanges?.hospitalId?.firstChange
    ) {
      this.opForm.reset();
      this.isActionTabVisibleForOp = false;
      this.revenueDataForOp = [];
      this.opArray.clear();
      this.getAllOpHospitalPayoutData();
    } else {
      if(this.hospitalId){
        this.getAllOpHospitalPayoutData();
      }
    }
  }

  revenueTypeOptions: any = [];
  getRevenueTypeMasterFinanceData() {
    this.sharedService
      .getRevenueTypeMasterFinanceData()
      .subscribe((res: any) => {
        this.revenueTypeOptions = res?.data;
      });
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
  getAllOpHospitalPayoutData() {    
    this.isDataLoadingForOp = true;
    this.facilitatorService
      .getAllOpHospitalPayoutData(this.opParams, this.hospitalId)
      .subscribe(
        (res: any) => {
          this.revenueDataForOp = res?.data?.content;
          this.totalElementOp = res?.data?.totalElement;
          this.modifyFormArrayDataForOP(this.revenueDataForOp);
          this.calculateTotalPagesForOp();
          this.isDataLoadingForOp = false;
        },
        (err) => {
          this.isDataLoadingForOp = false;
        }
      );
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
      this.getAllOpHospitalPayoutData();
    } else {
      this.opParams.page = this.totalNumberOfPagesForOp;
    }
  }

  prevForOp() {
    if (this.opParams?.page > 1) {
      this.opParams.page = this.opParams?.page - 1;
      this.revenueDataForOp = [];
      this.opArray.clear();
      this.getAllOpHospitalPayoutData();
    }
  }

  modifyFormArrayDataForOP(array: any) {
    if (array?.length) {
      this.opArray.clear();
      array.forEach((a: any) => {
        this.addOpFormField(a);
      });
    }
  }

  get opArray(): FormArray {
    return this.formGroup.get("op") as FormArray;
  }

  addOpFormField(item: any) {
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

    this.opArray.push(buildObj);
  }

  // country linking for OP
  countryDataForOP: any = [];
  totalElementCountryForOP: number;
  countryParamsForOP = {
    page: 1,
    limit: 0,
    search: "",
  };
  timeoutCountryForOP = null;
  isLoadingCountryForOP = false;
  isLoadingCountrySelectAllForOP = false;
  selectedCountrySearchForOP: any = [];
  getCountryDataForOP(selectAll: Boolean) {
    if (this.isLoadingCountryForOP) {
      return;
    }
    this.isLoadingCountryForOP = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParamsForOP)
      .subscribe((res: any) => {
        if (selectAll) {
          this.countryDataForOP = [];
        }

        this.countryDataForOP.push(...res.data.content);
        this.totalElementCountryForOP = res.data.totalElement;
        this.countryParamsForOP.page = this.countryParamsForOP.page + 1;
        this.isLoadingCountryForOP = false;
        if (selectAll) {
          const allCountryNames = this.countryDataForOP.map(
            (item) => item.name
          );
          allCountryNames.forEach(
            (country) =>
              this.selectedCountrySearchForOP.includes(country) ||
              this.selectedCountrySearchForOP.push(country)
          );

          this.opForm.patchValue({
            country: this.selectedCountrySearchForOP,
          });
          this.isLoadingCountrySelectAllForOP = false;
        }
      });
  }

  onInfiniteScrollCountryForOP(): void {
    if (this.countryDataForOP.length < this.totalElementCountryForOP) {
      this.getCountryDataForOP(false);
    }
  }

  searchCountryForOP(filterValue: string) {
    clearTimeout(this.timeoutCountryForOP);
    this.timeoutCountryForOP = setTimeout(() => {
      this.countryParamsForOP.search = filterValue.trim();
      this.countryParamsForOP.page = 1;
      this.countryParamsForOP.limit = 20;
      this.countryDataForOP = []; // Clear existing data when searching
      this.isLoadingCountryForOP = false;
      this.getCountryDataForOP(false);
    }, 600);
  }

  onClickCountryForOP(item) {
    const index = this.selectedCountrySearchForOP.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCountrySearchForOP.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCountrySearchForOP.push(item);
    }
    this.opForm.patchValue({
      country: [...new Set(this.selectedCountrySearchForOP)],
    });
  }

  selectAllCountryForOP(event) {
    if (event.checked) {
      this.countryParamsForOP.page = 1;
      this.countryParamsForOP.limit = 0;
      this.isLoadingCountryForOP = false;
      this.isLoadingCountrySelectAllForOP = true;
      this.getCountryDataForOP(true);
    } else {
      this.selectedCountrySearchForOP = [];
      this.opForm.patchValue({
        country: [],
      });
    }
  }

  actionTitleForOP: string = "";
  isActionTabVisibleForOp: boolean = false;
  actionTypeForOP: string = "";
  onReload() {
    this.formGroup.reset();
    this.isActionTabVisibleForOp = false;
    this.selectedCountrySearchForOP = [];
    this.opArray.clear();
    this.getAllOpHospitalPayoutData();
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
    this.actionTitleForOP = `${type} Out Patient`;
    this.isActionTabVisibleForOp = true;
    this.actionTypeForOP = type;
  }

  outPatientFormSubmit(action: string, index = null) {
    if (action === "add") {
      if (this.opForm.valid) {
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
          ...this.opForm.getRawValue(),
        };

        this.facilitatorService
          .addOpHospitalPayout(payload)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res?.message
            );
            this.onReload();
          });
      } else {
        this.opForm.markAllAsTouched();
      }
    } else if (action === "edit") {
      if (this.opArray?.at(index).valid) {
        let payloadForEdit = {
          ...this.opArray?.at(index)?.getRawValue(),
        };

        this.facilitatorService
          .editOpHospitalPayout(this.hospitalId, payloadForEdit)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res?.message
            );
            this.onReload();
          });
      } else {
        this.opArray?.at(index).markAllAsTouched();
      }
    }
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

            this.opParams.filter_obj = filterObj;
            this.opParams.page = 1;
            this.revenueDataForOp = [];
            this.opArray.clear();
            this.getAllOpHospitalPayoutData();
          } else if (!!filteredData?.search) {
            this.isFilterActive = true;
            this.opParams.search = filteredData?.search;
            this.opParams.page = 1;
            this.revenueDataForOp = [];
            this.opArray.clear();
            this.getAllOpHospitalPayoutData();
          } else {
            this.isFilterActive = false;

            this.selectedFilter = filteredData;
            this.opParams.filter_obj = {};
            this.opParams.search = "";
            this.opParams.page = 1;
            this.revenueDataForOp = [];
            this.opArray.clear();
            this.getAllOpHospitalPayoutData();
          }
        }
      });
  }
}
