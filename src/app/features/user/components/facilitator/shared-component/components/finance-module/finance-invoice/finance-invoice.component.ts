import { Component, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-finance-invoice",
  templateUrl: "./finance-invoice.component.html",
  styleUrls: ["./finance-invoice.component.scss"],
})
export class FinanceInvoiceComponent implements OnInit {
  patientData = [
    {
      patientName: "Patient 1",
      type: "IP",
      hospAdmission: "01/01/25",
      hospDischarge: "05/01/25",
      hospitalAmt: 10000,
      ourAdmission: "01/01/25",
      ourDischarge: "05/01/25",
      ourAmt: 9500,
      hospitalPayout: 9000,
      defaultAmt: 10000,
      invoiceDesc: "Facilitator Fees",
      ok: false,
    },
    {
      patientName: "Patient 2",
      type: "IP",
      hospAdmission: "01/02/25",
      hospDischarge: "05/02/25",
      hospitalAmt: 20000,
      ourAdmission: "01/02/25",
      ourDischarge: "05/02/25",
      ourAmt: 19000,
      hospitalPayout: 18000,
      defaultAmt: 20000,
      invoiceDesc: "Facilitator Fees",
      ok: false,
    },
    {
      patientName: "Patient 3",
      type: "IP",
      hospAdmission: "01/03/25",
      hospDischarge: "05/03/25",
      hospitalAmt: 30000,
      ourAdmission: "01/03/25",
      ourDischarge: "05/03/25",
      ourAmt: 28500,
      hospitalPayout: 27000,
      defaultAmt: 30000,
      invoiceDesc: "Facilitator Fees",
      ok: false,
    },
    {
      patientName: "Patient 4",
      type: "IP",
      hospAdmission: "01/04/25",
      hospDischarge: "05/04/25",
      hospitalAmt: 40000,
      ourAdmission: "01/04/25",
      ourDischarge: "05/04/25",
      ourAmt: 38000,
      hospitalPayout: 36000,
      defaultAmt: 40000,
      invoiceDesc: "Facilitator Fees",
      ok: false,
    },
    {
      patientName: "Patient 5",
      type: "IP",
      hospAdmission: "01/05/25",
      hospDischarge: "05/05/25",
      hospitalAmt: 50000,
      ourAdmission: "01/05/25",
      ourDischarge: "05/05/25",
      ourAmt: 47500,
      hospitalPayout: 45000,
      defaultAmt: 50000,
      invoiceDesc: "Facilitator Fees",
      ok: false,
    },
  ];

  typeOptions = ["IP", "OP", "Package"];
  invoiceOptions = ["Facilitator Fees", "Consultation Fees", "Other"];

  payoutData = [
    {
      patientName: "Patient 1",
      partnerReferred: "Partner 1",
      ourPayoutPercent: "5%",
      ourPayoutAmount: 475,
      hospitalPayout: 9000,
    },
    {
      patientName: "Patient 2",
      partnerReferred: "Partner 2",
      ourPayoutPercent: "5%",
      ourPayoutAmount: 950,
      hospitalPayout: 18000,
    },
    {
      patientName: "Patient 3",
      partnerReferred: "Partner 3",
      ourPayoutPercent: "5%",
      ourPayoutAmount: 1425,
      hospitalPayout: 27000,
    },
    {
      patientName: "Patient 4",
      partnerReferred: "Partner 4",
      ourPayoutPercent: "5%",
      ourPayoutAmount: 1900,
      hospitalPayout: 36000,
    },
    {
      patientName: "Patient 5",
      partnerReferred: "Partner 5",
      ourPayoutPercent: "5%",
      ourPayoutAmount: 2375,
      hospitalPayout: 45000,
    },
  ];

  feeData = [
    { patientName: "Patient 1", type: "IP", ourAmt: 9500, percentApplied: 25 },
    { patientName: "Patient 2", type: "OP", ourAmt: 19000, percentApplied: 20 },
    { patientName: "Patient 3", type: "IP", ourAmt: 28500, percentApplied: 25 },
    { patientName: "Patient 4", type: "OP", ourAmt: 38000, percentApplied: 20 },
    { patientName: "Patient 5", type: "IP", ourAmt: 47500, percentApplied: 25 },
  ];

  // Calculate fees
  getFacilitatorFee(item: any): number {
    return (item.ourAmt * item.percentApplied) / 100;
  }

  // Total Fees
  get totalFees(): number {
    return this.feeData.reduce(
      (sum, item) => sum + this.getFacilitatorFee(item),
      0
    );
  }

  patients = [
    { name: "Patient 1", facilitatorFees: 500, gstPercent: 18 },
    { name: "Patient 2", facilitatorFees: 1000, gstPercent: 18 },
    { name: "Patient 3", facilitatorFees: 1500, gstPercent: 18 },
    { name: "Patient 4", facilitatorFees: 2000, gstPercent: 18 },
    { name: "Patient 5", facilitatorFees: 2500, gstPercent: 18 },
  ];

  facilitatorGSTIN = "27ABCDE1234F1Z5";
  hospitalGSTIN = "27HSPTL5678X1Z2";
  invoiceNo = "INV-2025-001";
  invoiceDate = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY

  getGrandTotal(): number {
    return this.patients.reduce((sum, p) => {
      const gst = (p.facilitatorFees * p.gstPercent) / 100;
      return sum + p.facilitatorFees + gst;
    }, 0);
  }

  constructor(
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService
  ) {}

  ngOnInit(): void {
    this.getHospitalData();
  }

  // Hospital Linking
  hospitalData: any = [];
  totalElementHospital: number;
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutHospital = null;
  isLoadingHospital = false;
  selectHospital = {
    _id: "",
  };
  selectedHospitalId: string = "";

  // Hospital linking
  getHospitalData() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService.getAllHospital(this.hospitalParams).subscribe(
      (res: any) => {
        if (!!res?.data?.content && res?.data?.content?.length > 0) {
          this.hospitalData.push(...res.data.content);
          this.totalElementHospital = res.data.totalElement;
          this.hospitalParams.page = this.hospitalParams.page + 1;
          this.isLoadingHospital = false;
        } else {
          this.isLoadingHospital = false;
        }
      },
      () => {
        this.isLoadingHospital = false;
      }
    );
  }

  onInfiniteScrollHospital(): void {
    if (this.hospitalData.length < this.totalElementHospital) {
      this.getHospitalData();
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalData = []; // Clear existing data when searching
      this.isLoadingHospital = false;
      this.getHospitalData();
    }, 600);
  }

  onChangeHospital(event) {
    this.selectedHospitalId = event.value;
    this.getAllCompanyMasterData();
  }

  companyData: any = [];
  isCompanyDataLoading: boolean = false;
  totalNumberOfPages = 0;

  totalElementCompany: number;
  timeoutCompany = null;
  companyParams = {
    page: 1,
    limit: 10,
    search: "",
    filter_obj: {},
  };

  selectedCompanyId: any = "";
  getAllCompanyMasterData() {
    this.isCompanyDataLoading = true;
    this.facilitatorService
      .getAllCompanyMasterData(this.companyParams)
      .subscribe(
        (res: any) => {
          this.companyData.push(...res.data.content);
          this.totalElementCompany = res?.data?.totalElement;
          this.companyParams.page = this.companyParams.page + 1;
          this.isCompanyDataLoading = false;
        },
        () => {
          this.isCompanyDataLoading = false;
        }
      );
  }

  onInfiniteScrollCompanyMaster(): void {
    if (this.companyData.length < this.totalElementCompany) {
      this.getAllCompanyMasterData();
    }
  }

  searchCompanyMaster(filterValue: string) {
    clearTimeout(this.timeoutCompany);
    this.timeoutCompany = setTimeout(() => {
      this.companyParams.search = filterValue.trim();
      this.companyParams.page = 1;
      this.companyData = []; // Clear existing data when searching
      this.isCompanyDataLoading = false;
      this.getAllCompanyMasterData();
    }, 600);
  }

  onChangeCompanyMaster(event) {
    this.selectedCompanyId = event.value;
    this.getAllCompanyMasterData();
  }
}
