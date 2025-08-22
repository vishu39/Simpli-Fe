import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import { MasterDataViewDocsComponent } from "../../dialog/master-data-view-docs/master-data-view-docs.component";

@Component({
  selector: "shared-master-add-company",
  templateUrl: "./master-add-company.component.html",
  styleUrls: ["./master-add-company.component.scss"],
})
export class MasterAddCompanyComponent implements OnInit {
  @Input() selectedMasterOption: any = {};
  @Input() patientData: any = {};
  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  gstOption: any = ["Yes", "No"];

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  panelOpenState = true;

  isCompanyDataLoading: boolean = false;
  totalNumberOfPages = 0;
  companyData = [
    {
      companyName: "ABC Pvt Ltd",
      address: "123 MG Road, Delhi, India",
      gstNo: "27ABCDE1234F1Z5",
      companyPanNo: "ABCDE1234F",
      email: "contact@abc.com",
      contact: "+91-9876543210",
      registrationNo: "123412341234",
      paymentTerms: "Net 30",
      currency: { code: "INR" },
      gstApplicable: "Yes",
    },
    {
      companyName: "XYZ Enterprises",
      address: "56 Park Street, Kolkata, India",
      gstNo: "19XYZDE5678G1Z2",
      companyPanNo: "XYZDE5678G",
      email: "info@xyz.com",
      contact: "+91-9812345678",
      registrationNo: "567856785678",
      paymentTerms: "Net 15",
      currency: { code: "INR" },
      gstApplicable: "Yes",
    },
    {
      companyName: "MNO Traders",
      address: "45 Brigade Road, Bangalore, India",
      gstNo: "29MNOPQ7890H1Z3",
      companyPanNo: "MNOPQ7890H",
      email: "support@mno.com",
      contact: "+91-9123456789",
      registrationNo: "901290129012",
      paymentTerms: "Advance",
      currency: { code: "INR" },
      gstApplicable: "No",
    },
    {
      companyName: "Global Tech Solutions",
      address: "Sector 18, Noida, India",
      gstNo: "09GTSAB1234I1Z4",
      companyPanNo: "GTSAB1234I",
      email: "sales@globaltech.com",
      contact: "+91-9898989898",
      registrationNo: "111122223333",
      paymentTerms: "Net 45",
      currency: { code: "INR" },
      gstApplicable: "Yes",
    },
    {
      companyName: "Sunrise Exports",
      address: "Anna Nagar, Chennai, India",
      gstNo: "33SUNRS2345J1Z5",
      companyPanNo: "SUNRS2345J",
      email: "exports@sunrise.com",
      contact: "+91-9000011111",
      registrationNo: "222233334444",
      paymentTerms: "Net 60",
      currency: { code: "INR" },
      gstApplicable: "Yes",
    },
  ];

  // companyData: any = [];

  totalElementCompany: number;
  companyParams = {
    page: 1,
    limit: 10,
    search: "",
    filterObj: {},
  };

  // this.calculateTotalPages();

  calculateTotalPages() {
    this.totalNumberOfPages = Math.ceil(
      this.totalElementCompany / this.companyParams.limit
    );
  }

  next() {
    this.companyParams.page = this.companyParams?.page + 1;
    if (this.companyParams?.page <= this.totalNumberOfPages) {
      // this.getAllEmailFetch();
    } else {
      this.companyParams.page = this.totalNumberOfPages;
    }
  }

  prev() {
    if (this.companyParams?.page > 1) {
      this.companyParams.page = this.companyParams?.page - 1;
      // this.getAllEmailFetch();
    }
  }

  openViewModal(item: any) {
    const dialogRef = this.dialog.open(MasterDataViewDocsComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "View Details";
    dialogRef.componentInstance.inputData = item;
    dialogRef.componentInstance.selectedMasterOption =
      this.selectedMasterOption;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
      }
    });
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      companyName: ["", [Validators.required]],
      gstApplicable: ["", [Validators.required]],
      currency: ["", [Validators.required]],
      gstNo: ["", [Validators.required]],
      email: [
        "",
        [Validators.required, Validators.pattern(regexService.emailRegex)],
      ],
      contact: ["", [Validators.required]],
      paymentTerms: ["", [Validators.required]],
      registrationNo: ["", [Validators.required]],
      companyPanNo: ["", [Validators.required]],

      signingAuthorityName: ["", [Validators.required]],
      signingAuthorityDesignation: ["", [Validators.required]],

      gstCertificate: ["", [Validators.required]],
      registrationCertificate: ["", [Validators.required]],
      panCertificate: ["", [Validators.required]],
      signingAuthorityImage: ["", [Validators.required]],
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

  fileFirstList: any[] = [];
  fileSecondList: any[] = [];
  fileThirdList: any[] = [];
  fileFourthList: any[] = [];

  fileFirstPreviewUrls: string[] = [];
  fileSecondPreviewUrls: string[] = [];
  fileThirdPreviewUrls: string[] = [];
  fileFourthPreviewUrls: string[] = [];
  onFileSelected(e: any, type: string) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
    const file = e.target.files[0];
    if (allowedExtensions.exec(file.name)) {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        if (type === "first") {
          this.fileFirstPreviewUrls = [fileUrl];
        }
        if (type === "second") {
          this.fileSecondPreviewUrls = [fileUrl];
        }
        if (type === "third") {
          this.fileThirdPreviewUrls = [fileUrl];
        }
        if (type === "fourth") {
          this.fileFourthPreviewUrls = [fileUrl];
        }
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (type === "first") {
            this.fileFirstPreviewUrls = [reader.result as string];
          }
          if (type === "second") {
            this.fileSecondPreviewUrls = [reader.result as string];
          }
          if (type === "third") {
            this.fileThirdPreviewUrls = [reader.result as string];
          }
          if (type === "fourth") {
            this.fileFourthPreviewUrls = [reader.result as string];
          }
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }

    if (type === "first") {
      this.fileFirstList = [file];
    }
    if (type === "second") {
      this.fileSecondList = [file];
    }
    if (type === "third") {
      this.fileThirdList = [file];
    }
    if (type === "fourth") {
      this.fileFourthList = [file];
    }
  }

  onReload() {
    this.actionTitle = "";
    this.isActionTabVisible = false;
    this.actionType = "";

    this.fileFirstList = [];
    this.fileFirstPreviewUrls = [];
    this.fileSecondList = [];
    this.fileSecondPreviewUrls = [];
    this.fileThirdList = [];
    this.fileThirdPreviewUrls = [];
    this.formGroup.reset();
  }

  actionTitle: string = "";
  isActionTabVisible: boolean = false;
  actionType: string = "";

  onClickAction(type: string, item: any = null) {
    this.actionTitle = `${type} Company Data`;
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
    const data = this.companyData;
    const dataHeader = [
      "S No.",
      "Company Name",
      "GST Applicable",
      "Currency",
      "Email",
      "Contact",
      "Payment Terms",
      "GST No",
      "Aadhar No",
      "Pan No",
    ];

    const csvRows = [];
    csvRows.push(dataHeader.join(","));

    data.forEach((row, index) => {
      const rowData = [
        index + 1,
        `"${row.companyName}"`,
        `"${row.gstApplicable}"`,
        `"${row.currency?.code}"`,
        `"${row.email}"`,
        `"${row.contact}"`,
        `"${row.paymentTerms}"`,
        `"${row.gstNo}"`,
        `"${row.registrationNo}"`,
        `"${row.companyPanNo}"`,
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

  finalFormSubmit() {
    if (this.formGroup.valid) {
      let payload = {
        ...this.formGroup.getRawValue(),
      };

      payload["gstCertificate"] = this.fileFirstList;
      payload["registrationCertificate"] = this.fileSecondList;
      payload["panCertificate"] = this.fileThirdList;
      payload["signingAuthorityImage"] = this.fileFourthList;

      if (this.actionType === "Add") {
        this.companyData.unshift(payload);
        this.onReload();
      } else if (this.actionType === "Edit") {
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
