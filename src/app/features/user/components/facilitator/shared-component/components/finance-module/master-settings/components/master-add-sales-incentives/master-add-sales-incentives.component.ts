import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "shared-master-add-sales-incentives",
  templateUrl: "./master-add-sales-incentives.component.html",
  styleUrls: ["./master-add-sales-incentives.component.scss"],
})
export class MasterAddSalesIncentivesComponent implements OnInit {
  @Input() selectedMasterOption: any = {};
  @Input() patientData: any = {};
  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  typeArray = [
    {
      name: "Employee",
      value: "employee",
    },
    {
      name: "Referral Partner",
      value: "referralPartner",
    },
  ];

  frequencyArray = [
    {
      name: "Monthly",
      value: "monthly",
    },
    {
      name: "Quarterly",
      value: "quaterly",
    },
    {
      name: "On-Demand",
      value: "onDemand",
    },
  ];

  revenueBasisArray = [
    {
      name: "Country",
      value: "country",
    },
    {
      name: "Partner",
      value: "partner",
    },
    {
      name: "Country + Partner",
      value: "both",
    },
  ];

  constructor(private fb: FormBuilder) {}

  panelOpenState = true;

  isArrayDataLoading: boolean = false;
  totalNumberOfPages = 0;

  arrayData: any = [];

  totalElement: number;
  dataParams = {
    page: 1,
    limit: 10,
    search: "",
    filterObj: {},
  };

  // this.calculateTotalPages();

  calculateTotalPages() {
    this.totalNumberOfPages = Math.ceil(
      this.totalElement / this.dataParams.limit
    );
  }

  next() {
    this.dataParams.page = this.dataParams?.page + 1;
    if (this.dataParams?.page <= this.totalNumberOfPages) {
      // this.getAllEmailFetch();
    } else {
      this.dataParams.page = this.totalNumberOfPages;
    }
  }

  prev() {
    if (this.dataParams?.page > 1) {
      this.dataParams.page = this.dataParams?.page - 1;
      // this.getAllEmailFetch();
    }
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      type: ["", [Validators.required]],
      revenueBasis: ["", [Validators.required]],
      frequency: ["", [Validators.required]],
      payoutPercentage: ["", [Validators.required]],
      activationStartDate: ["", [Validators.required]],
      activationEndDate: ["", [Validators.required]],
    });

    this.formGroup.patchValue({
      patient: this.patientData?._id,
    });

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

  onReload() {
    this.actionTitle = "";
    this.isActionTabVisible = false;
    this.actionType = "";

    this.formGroup.reset();
  }

  actionTitle: string = "";
  isActionTabVisible: boolean = false;
  actionType: string = "";

  onClickAction(type: string, item: any = null) {
    this.actionTitle = `${type} Sales Incentives Master Data`;
    this.isActionTabVisible = true;
    this.actionType = type;

    if (type === "Edit") {
      this.patchIfEdit(item);
    }
  }

  patchIfEdit(item: any) {
    this.formGroup.patchValue(item);
    console.log(this.formGroup.value);
  }

  exportMasterDataCSV() {
    const data = this.arrayData;
    const dataHeader = [
      "S No.",
      "Type",
      "Revenue Basis",
      "Frequency",
      "Payout Percentage",
      "Activation Start Date",
      "Activation End Date",
    ];

    const csvRows = [];
    csvRows.push(dataHeader.join(","));

    data.forEach((row, index) => {
      const rowData = [
        index + 1,
        `"${row.type}"`,
        `"${row.revenueBasis}"`,
        `"${row.frequency}"`,
        `"${row.payoutPercentage}"`,
        `"${row.activationStartDate}"`,
        `"${row.activationEndDate}"`,
      ];
      csvRows.push(rowData.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "data.csv");
    a.click();
  }

  getNameForType(value: string) {
    let obj = this.typeArray.find((cba: any) => cba?.value === value);

    return obj?.name || "";
  }

  getNameForRevenue(value: string) {
    let obj = this.revenueBasisArray.find((cba: any) => cba?.value === value);

    return obj?.name || "";
  }

  getNameForFrequency(value: string) {
    let obj = this.frequencyArray.find((cba: any) => cba?.value === value);

    return obj?.name || "";
  }

  finalFormSubmit() {
    if (this.formGroup.valid) {
      let payload = {
        ...this.formGroup.getRawValue(),
      };

      if (this.actionType === "Add") {
        this.arrayData.unshift(payload);
        this.onReload();
      } else if (this.actionType === "Edit") {
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
