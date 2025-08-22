import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
@Component({
  selector: "shared-master-add-partner-payout",
  templateUrl: "./master-add-partner-payout.component.html",
  styleUrls: ["./master-add-partner-payout.component.scss"],
})
export class MasterAddPartnerPayoutComponent implements OnInit {
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

  arrayData: any = [
    {
      referralPartnerId: "RP001",
      referralPartnerName: "HealthPlus Network",
      hospitalId: "HSP001",
      hospitalName: "Apollo Hospitals",
      gstApplicable: "Yes",
      invoiceCategory: "facilitatorFees",
      calculationBills: "onNetBill",
    },
    {
      referralPartnerId: "RP002",
      referralPartnerName: "CareConnect",
      hospitalId: "HSP002",
      hospitalName: "Fortis Healthcare",
      gstApplicable: "Yes",
      invoiceCategory: "incentive",
      calculationBills: "totalPharmacy",
    },
    {
      referralPartnerId: "RP003",
      referralPartnerName: "MediLink Services",
      hospitalId: "HSP003",
      hospitalName: "Max Super Specialty",
      gstApplicable: "No",
      invoiceCategory: "retainership",
      calculationBills: "onNetBill",
    },
    {
      referralPartnerId: "RP004",
      referralPartnerName: "Wellness Partners",
      hospitalId: "HSP004",
      hospitalName: "AIIMS Delhi",
      gstApplicable: "No",
      invoiceCategory: "facilitatorFees",
      calculationBills: "totalPharmacy",
    },
    {
      referralPartnerId: "RP005",
      referralPartnerName: "Global Care Associates",
      hospitalId: "HSP005",
      hospitalName: "Manipal Hospitals",
      gstApplicable: "Yes",
      invoiceCategory: "incentive",
      calculationBills: "onNetBill",
    },
    {
      referralPartnerId: "RP006",
      referralPartnerName: "LifeBridge",
      hospitalId: "HSP006",
      hospitalName: "Narayana Health",
      gstApplicable: "Yes",
      invoiceCategory: "retainership",
      calculationBills: "totalPharmacy",
    },
    {
      referralPartnerId: "RP007",
      referralPartnerName: "Prime Health Partners",
      hospitalId: "HSP007",
      hospitalName: "Medanta Medicity",
      gstApplicable: "Yes",
      invoiceCategory: "facilitatorFees",
      calculationBills: "onNetBill",
    },
    {
      referralPartnerId: "RP008",
      referralPartnerName: "Regional Health Link",
      hospitalId: "HSP008",
      hospitalName: "KIMS Hospitals",
      gstApplicable: "No",
      invoiceCategory: "incentive",
      calculationBills: "totalPharmacy",
    },
    {
      referralPartnerId: "RP009",
      referralPartnerName: "Elite Health Services",
      hospitalId: "HSP009",
      hospitalName: "Columbia Asia",
      gstApplicable: "Yes",
      invoiceCategory: "retainership",
      calculationBills: "onNetBill",
    },
    {
      referralPartnerId: "RP010",
      referralPartnerName: "Trusted Medi Network",
      hospitalId: "HSP010",
      hospitalName: "Ruby Hall Clinic",
      gstApplicable: "No",
      invoiceCategory: "facilitatorFees",
      calculationBills: "totalPharmacy",
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
      referralPartnerId: ["", [Validators.required]],
      referralPartnerName: ["", [Validators.required]],
      hospitalId: ["", [Validators.required]],
      op: ["", [Validators.required]],
      ip: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
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
    this.actionTitle = `${type} Partner Payout Master Data`;
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
      "Referral Partner Name",
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
        `"${row.referralPartnerName}"`,
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

  getNameForCalcBill(value: string) {
    let obj = this.calculationBillsArray.find(
      (cba: any) => cba?.value === value
    );

    return obj?.name || "";
  }

  getNameForInvoiceCategory(value: string) {
    let obj = this.invoiceArray.find((cba: any) => cba?.value === value);

    return obj?.name || "";
  }
}
