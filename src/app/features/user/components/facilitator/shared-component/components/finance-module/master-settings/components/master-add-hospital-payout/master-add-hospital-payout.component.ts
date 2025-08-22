import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "shared-master-add-hospital-payout",
  templateUrl: "./master-add-hospital-payout.component.html",
  styleUrls: ["./master-add-hospital-payout.component.scss"],
})
export class MasterAddHospitalPayoutComponent implements OnInit {
  @Input() selectedMasterOption: any = {};
  @Input() patientData: any = {};
  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  gstOption: any = ["Yes", "No"];
  calculationBillsArray = [
    {
      name: "On Net Bill",
      value: "onNetBill",
    },
    {
      name: "Total - Pharmacy/Consumables",
      value: "totalPharmacy",
    },
  ];
  invoiceArray = [
    {
      name: "Facilitator Fees (Fixed / % Based)",
      value: "facilitatorFees",
    },
    {
      name: "Incentive (% on revenue within time period)",
      value: "incentive",
    },
    {
      name: "Retainership (Fixed/month)",
      value: "retainership",
    },
  ];

  constructor(private fb: FormBuilder) {}

  panelOpenState = true;

  isArrayDataLoading: boolean = false;
  totalNumberOfPages = 0;
  arrayData = [
    {
      hospitalId: "HSP001",
      hospitalName: "Apollo Hospitals",
      op: "500",
      ip: "1000",
      gstApplicable: "Yes",
      invoiceCategory: "General",
      calculationBills: "Automated",
      notes: "Top-rated multi-specialty hospital in Delhi",
    },
    {
      hospitalId: "HSP002",
      hospitalName: "Fortis Healthcare",
      op: "600",
      ip: "1200",
      gstApplicable: "Yes",
      invoiceCategory: "Specialty",
      calculationBills: "Manual",
      notes: "Focus on cardiology and neurology",
    },
    {
      hospitalId: "HSP003",
      hospitalName: "Max Super Specialty",
      op: "550",
      ip: "1100",
      gstApplicable: "No",
      invoiceCategory: "General",
      calculationBills: "Automated",
      notes: "Large OPD base",
    },
    {
      hospitalId: "HSP004",
      hospitalName: "AIIMS Delhi",
      op: "700",
      ip: "1500",
      gstApplicable: "No",
      invoiceCategory: "Teaching",
      calculationBills: "Automated",
      notes: "Government research institute",
    },
    {
      hospitalId: "HSP005",
      hospitalName: "Manipal Hospitals",
      op: "480",
      ip: "980",
      gstApplicable: "Yes",
      invoiceCategory: "Corporate",
      calculationBills: "Manual",
      notes: "Strong presence in Bangalore",
    },
    {
      hospitalId: "HSP006",
      hospitalName: "Narayana Health",
      op: "450",
      ip: "900",
      gstApplicable: "Yes",
      invoiceCategory: "General",
      calculationBills: "Automated",
      notes: "Specializes in affordable healthcare",
    },
    {
      hospitalId: "HSP007",
      hospitalName: "Medanta Medicity",
      op: "650",
      ip: "1300",
      gstApplicable: "Yes",
      invoiceCategory: "Specialty",
      calculationBills: "Manual",
      notes: "Strong cardiology and organ transplant services",
    },
    {
      hospitalId: "HSP008",
      hospitalName: "KIMS Hospitals",
      op: "400",
      ip: "850",
      gstApplicable: "No",
      invoiceCategory: "Regional",
      calculationBills: "Automated",
      notes: "Focuses on South Indian states",
    },
    {
      hospitalId: "HSP009",
      hospitalName: "Columbia Asia",
      op: "520",
      ip: "1020",
      gstApplicable: "Yes",
      invoiceCategory: "Corporate",
      calculationBills: "Manual",
      notes: "Popular with expatriates",
    },
    {
      hospitalId: "HSP010",
      hospitalName: "Ruby Hall Clinic",
      op: "470",
      ip: "950",
      gstApplicable: "No",
      invoiceCategory: "General",
      calculationBills: "Automated",
      notes: "One of the oldest hospitals in Pune",
    },
  ];

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
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      op: ["", [Validators.required]],
      ip: ["", [Validators.required]],
      gstApplicable: ["", [Validators.required]],
      invoiceCategory: ["", [Validators.required]],
      calculationBills: ["", [Validators.required]],
      notes: ["", [Validators.required]],
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
    this.actionTitle = `${type} Hospital Payout Master Data`;
    this.isActionTabVisible = true;
    this.actionType = type;

    if (type === "Edit") {
      this.patchIfEdit(item);
    }
  }

  patchIfEdit(item: any) {
    this.formGroup.patchValue(item);
  }

  exportMasterDataCSV() {
    const data = this.arrayData;
    const dataHeader = [
      "S No.",
      "Hospital Name",
      "GST Applicable",
      "OP",
      "IP",
      "Invoice Category",
      "Calculation Bills",
      "Notes",
    ];

    const csvRows = [];
    csvRows.push(dataHeader.join(","));

    data.forEach((row, index) => {
      const rowData = [
        index + 1,
        `"${row.hospitalName}"`,
        `"${row.gstApplicable}"`,
        `"${row.op}"`,
        `"${row.ip}"`,
        `"${row.invoiceCategory}"`,
        `"${row.calculationBills}"`,
        `"${row.notes}"`,
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
}
