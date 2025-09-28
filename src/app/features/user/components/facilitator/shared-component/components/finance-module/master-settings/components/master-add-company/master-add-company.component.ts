import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { currencies } from "currencies.json";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import { MasterDataViewDocsComponent } from "../../dialog/master-data-view-docs/master-data-view-docs.component";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { MasterSettingCompanyFilterDialogComponent } from "src/app/shared/components/finance-module/dialogs/master-setting-company-filter-dialog/master-setting-company-filter-dialog.component";
import { Country, State, City } from "country-state-city";

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

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}

  isTableExpansionOpen = true;
  isFormExpansionOpen = false;

  // this.calculateTotalPages();

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
      gstApplicable: [""],
      currency: [""],
      gstNo: [""],
      email: ["", [Validators.pattern(regexService.emailRegex)]],
      contact: [""],
      paymentTerms: [""],
      registrationNo: [""],
      companyPanNo: [""],
      
      msmeApplicable: [""],
      msmeNo: [""],

      signingAuthorityName: [""],
      signingAuthorityDesignation: [""],

      gstCertificate: [""],
      registrationCertificate: [""],
      panCertificate: [""],
      stampWithSignature: [""],

      addressLine1: [""],
      addressLine2: [""],
      city: [""],
      district: [""],
      state: [""],
      pincode: [""],
      country: [""],
      locality: [""],
    });

    this.getAllCompanyMasterData();
    this.getCountryData();

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

  companyData: any = [];
  isCompanyDataLoading: boolean = false;
  totalNumberOfPages = 0;

  totalElementCompany: number;
  companyParams = {
    page: 1,
    limit: 10,
    search: "",
    filter_obj: {},
  };

  getAllCompanyMasterData() {
    this.isCompanyDataLoading = true;
    this.facilitatorService
      .getAllCompanyMasterData(this.companyParams)
      .subscribe(
        (res: any) => {
          this.companyData = res?.data?.content;
          this.totalElementCompany = res?.data?.totalElement;
          this.calculateTotalPages();
          this.isCompanyDataLoading = false;
        },
        () => {
          this.isCompanyDataLoading = false;
        }
      );
  }

  calculateTotalPages() {
    this.totalNumberOfPages = Math.ceil(
      this.totalElementCompany / this.companyParams.limit
    );
  }

  next() {
    this.companyParams.page = this.companyParams?.page + 1;
    if (this.companyParams?.page <= this.totalNumberOfPages) {
      this.companyData = [];
      this.getAllCompanyMasterData();
    } else {
      this.companyParams.page = this.totalNumberOfPages;
    }
  }

  prev() {
    if (this.companyParams?.page > 1) {
      this.companyParams.page = this.companyParams?.page - 1;
      this.companyData = [];
      this.getAllCompanyMasterData();
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
    this.companyData = [];
    this.fileFirstList = [];
    this.fileFirstPreviewUrls = [];
    this.fileSecondList = [];
    this.fileSecondPreviewUrls = [];
    this.fileThirdList = [];
    this.fileThirdPreviewUrls = [];
    this.selectedItemForEdit = {};
    this.formGroup.reset();

    this.getAllCompanyMasterData();
  }

  actionTitle: string = "";
  isActionTabVisible: boolean = false;
  actionType: string = "";

  selectedItemForEdit: any = {};

  onClickAction(type: string, item: any = null) {
    this.actionTitle = `${type} Company Data`;
    this.isActionTabVisible = true;
    this.actionType = type;
    this.isTableExpansionOpen = false;
    this.isFormExpansionOpen = true;

    if (type === "Edit") {
      this.selectedItemForEdit = {};
      this.patchIfEdit(item);
    }
  }

  patchIfEdit(item: any) {
    this.selectedItemForEdit = item;
    this.formGroup.patchValue(item);
    this.formGroup.patchValue({
      addressLine1: item?.address?.[0]?.addressLine1,
      addressLine2: item?.address?.[0]?.addressLine2,
      city: item?.address?.[0]?.city,
      district: item?.address?.[0]?.district,
      state: item?.address?.[0]?.state,
      pincode: item?.address?.[0]?.pincode,
      country: item?.address?.[0]?.country,
      locality: item?.address?.[0]?.locality,
    });
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

  // Country Linking
  countryData: any = [];
  totalElementCountry: number;
  countryParams = {
    page: 1,
    limit: 0,
    search: "",
  };
  timeoutCountry = null;
  isLoadingCountry = false;
  searchInputCountry = "";

  getCountryData() {
    if (this.isLoadingCountry) {
      return;
    }
    this.isLoadingCountry = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParams)
      .subscribe((res: any) => {
        this.countryData.push(...res.data.content);
        this.totalElementCountry = res.data.totalElement;
        this.countryParams.page = this.countryParams.page + 1;
        this.isLoadingCountry = false;
      });
  }

  onInfiniteScrollCountry(): void {
    if (this.countryData.length < this.totalElementCountry) {
      this.getCountryData();
    }
  }

  searchCountry(filterValue: string) {
    clearTimeout(this.timeoutCountry);
    this.timeoutCountry = setTimeout(() => {
      this.countryParams.search = filterValue.trim();
      this.countryParams.page = 1;
      this.countryData = []; // Clear existing data when searching
      this.isLoadingCountry = false;
      this.searchInputCountry = filterValue.trim();
      this.getCountryData();
    }, 600);
  }

  onClickCountry(item: any) {
    this.statesArray = cloneDeep(State.getStatesOfCountry(item?.isoCode));
    this.statesFreshArray = cloneDeep(State.getStatesOfCountry(item?.isoCode));
    this.formGroup.patchValue({
      state: "",
      city: "",
    });
  }

  statesArray: any = [];
  statesFreshArray: any = [];
  timeoutState = null;
  citiesArray: any = [];
  citiesFreshArray: any = [];
  timeoutCity = null;

  searchState(filterValue: string) {
    clearTimeout(this.timeoutState);
    this.timeoutState = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.statesFreshArray);
        this.statesArray = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.statesArray = filterArray;
      } else {
        this.statesArray = this.statesFreshArray;
      }
    }, 600);
  }

  onClickState(item: any) {
    this.citiesArray = cloneDeep(
      City.getCitiesOfState(item?.countryCode, item?.isoCode)
    );
    this.citiesFreshArray = cloneDeep(
      City.getCitiesOfState(item?.countryCode, item?.isoCode)
    );
    this.formGroup.patchValue({
      city: "",
    });
  }

  onClickCity(item: any) {
  }

  searchCity(filterValue: string) {
    clearTimeout(this.timeoutCity);
    this.timeoutCity = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.citiesFreshArray);
        this.citiesArray = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.citiesArray = filterArray;
      } else {
        this.citiesArray = this.citiesFreshArray;
      }
    }, 600);
  }

  finalFormSubmit() {
    if (this.formGroup.valid) {
      let values = {
        ...this.formGroup.getRawValue(),
      };
      let currency = values?.currency;

      let addressObj = {
        addressLine1: values?.addressLine1,
        addressLine2: values?.addressLine2,
        city: values?.city,
        district: values?.district,
        state: values?.state,
        pincode: values?.pincode,
        country: values?.country,
        locality: values?.locality,
      };

      delete values["addressLine1"];
      delete values["addressLine2"];
      delete values["city"];
      delete values["district"];
      delete values["state"];
      delete values["pincode"];
      delete values["country"];
      delete values["locality"];
      delete values["currency"];
      delete values["gstCertificate"];
      delete values["registrationCertificate"];
      delete values["panCertificate"];
      delete values["stampWithSignature"];

      let formData = new FormData();

      formData.append("address", JSON.stringify(addressObj));

      formData.append("currency", JSON.stringify(currency));

      for (const key in values) {
        formData.append(key, values[key]);
      }

      for (var i = 0; i < this.fileFirstList?.length; i++) {
        formData.append("fileFirst", this.fileFirstList[i]);
      }

      for (var i = 0; i < this.fileSecondList?.length; i++) {
        formData.append("fileSecond", this.fileSecondList[i]);
      }

      for (var i = 0; i < this.fileThirdList?.length; i++) {
        formData.append("fileThird", this.fileThirdList[i]);
      }

      for (var i = 0; i < this.fileFourthList?.length; i++) {
        formData.append("fileFourth", this.fileFourthList[i]);
      }

      if (this.actionType === "Add") {
        this.facilitatorService
          .addCompanyMaster(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res?.message
            );
            this.onReload();
          });
      } else if (this.actionType === "Edit") {
        this.facilitatorService
          .editCompanyMaster(this.selectedItemForEdit?._id, formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res?.message
            );
            this.onReload();
          });
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  selectedFilter: any = [];

  isFilterActive = false;
  openFilterModal() {
    const dialogRef = this.dialog.open(
      MasterSettingCompanyFilterDialogComponent,
      {
        width: "60%",
        disableClose: true,
        autoFocus: false,
      }
    );

    let selectedFilterData: any = this.selectedFilter;

    dialogRef.componentInstance.openedComponent = "facilitator";
    (dialogRef.componentInstance.selectedFilter = selectedFilterData),
      dialogRef.afterClosed().subscribe((result) => {
        const { apiCall, filteredData } = result;
        if (apiCall) {
          this.selectedFilter = filteredData;
          if (
            filteredData?.currency?.length > 0 ||
            filteredData?.gstApplicable?.length > 0
          ) {
            this.isFilterActive = true;
            let filterObj = {};
            if (filteredData?.currency?.length > 0) {
              filterObj["currency"] = filteredData?.currency;
            }
            if (filteredData?.gstApplicable?.length > 0) {
              filterObj["gstApplicable"] = filteredData?.gstApplicable;
            }

            this.companyParams.filter_obj = filterObj;
            this.companyParams.page = 1;
            this.companyData = [];
            this.getAllCompanyMasterData();
          } else if (!!filteredData?.search) {
            this.isFilterActive = true;

            this.companyParams.search = filteredData?.search;
            this.companyParams.page = 1;
            this.companyData = [];
            this.getAllCompanyMasterData();
          } else {
            this.isFilterActive = false;

            this.selectedFilter = filteredData;
            this.companyParams.filter_obj = {};
            this.companyParams.search = "";
            this.companyParams.page = 1;
            this.companyData = [];
            this.getAllCompanyMasterData();
          }
        }
      });
  }
}
