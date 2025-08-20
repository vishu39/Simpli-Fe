import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "app-customer-dialog",
  templateUrl: "./customer-dialog.component.html",
  styleUrls: ["./customer-dialog.component.scss"],
})
export class CustomerDialogComponent implements OnInit {
  dialogTitle: string;
  customerForm: FormGroup;
  customerData = null;
  roleData: any;
  minDateFrom: Date;
  minDateUntil: Date;

  // Country Linking
  countryData: any = [];
  totalElementCountry: number;
  countryParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  timeoutCountry = null;
  isLoadingCountry = false;

  // City Linking

  cityData: any = [];
  totalElementCity: number;
  cityParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutCity = null;
  isLoadingCity = false;

  // Group linking
  groupData: any;
  totalElementGroup: number;
  groupDataDetails = {
    page: "1",
    limit: "",
    search: "",
  };
  timeoutGroup = null;

  // Hospital linking
  hospitalData: any;
  totalElementHospital: number;
  hospitalDataDetails = {
    page: "1",
    limit: "",
    search: "",
  };
  timeoutHospital = null;

  facilitatorData: any;
  totalElementFacilitator: number;
  facilitatorDataDetails = {
    page: "1",
    limit: "",
    search: "",
  };

  timeoutFacilitator = null;

  plansData: any;
  productFamilyData:any;
  planCurrencyData:any;
  planPriceData:any;
  constructor(
    private dialogRef: MatDialogRef<CustomerDialogComponent>,
    private supremeService: SupremeService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.buildForm();
    this.getCountryData();
    this.getCityData();
    this.getGroupData();
    this.getHospitalData();
    this.getFacilitatorData();
    this.getAllProductFamily();
    this.getAllPlanCurrency();
    const today = new Date();
    this.minDateFrom = new Date(today);
    this.minDateUntil = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
  }
  customerTypeData = ["facilitator", "hospital"];
  hospitalTypeData = ["hospitalGroup", "hospitalUnit"];
  buildForm() {
    this.customerForm = this.formBuilder.group({
      customerType: ["", [Validators.required]],
      name: ["", [Validators.required]],
      emailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
      contact: [
        "",
        [Validators.required, Validators.pattern(regexService.contactRegex)],
      ],
      billingAddress: ["", [Validators.required]],
      plan: ["", [Validators.required]],
      productFamily:["", [Validators.required]],
      planPrice:["", [Validators.required]],
      planCurrency:["", [Validators.required]],
      role: ["", [Validators.required]],
      onPremise: [false, []],
      onPremiseDB: [false, []],
      country: [null, [Validators.required]],
      dbName: [
        "",
        [Validators.required, Validators.pattern(regexService.dbRegex)],
      ],
      bucketName: [
        "",
        [Validators.required, Validators.pattern(regexService.s3BucketRegex)],
      ],
      city: [null, [Validators.required]],
      aggregator: [[], []],
      hospitalType: ["", []],
      hospitalId: ["", []],
      blocked: [false, []],
    });
  }
  ngOnInit(): void {
    this.getAllRole();
  }
  customerTypeChange(event) {
    if (event.value === "hospital") {
      this.customerForm.controls["hospitalType"].setValidators([
        Validators.required,
      ]);
    } else if (event.value === "facilitator") {
      this.customerForm.controls["hospitalType"].clearValidators();
      this.customerForm.patchValue({
        hospitalType: "",
        hospitalId: "",
      });
    }
    this.customerForm.patchValue({
      name: "",
    });
  }
  hospitalTypeChange() {
    this.customerForm.patchValue({
      name: "",
    });
  }
  getAllRole() {
    this.supremeService.getAllRole().subscribe((res: any) => {
      this.roleData = res.data;
    });
  }
  customerFormSubmit() {
    if (this.customerForm.valid) {
      if (this.customerForm.value.customerType === "hospital") {
        if (
          this.customerForm.value.name._id &&
          this.customerForm.value.name.name
        ) {
          this.customerForm.value.hospitalId = this.customerForm.value.name._id;
          this.customerForm.value.name = this.customerForm.value.name.name;
        }
      }
      // console.log('this.customerForm.value', this.customerForm.value)

      if (this.customerData == undefined) {
        this.supremeService
          .addCustomer(this.customerForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.supremeService
          .editCustomer(this.customerData._id, this.customerForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.customerForm.controls).forEach((key) => {
        this.customerForm.controls[key].markAsTouched();
      });
    }
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
  onEdit(data) {
    this.customerData = data;
    this.customerForm.controls.dbName.disable();
    this.customerForm.controls.bucketName.disable();
    this.customerForm.get("plan").clearValidators();
    this.customerForm.get("plan").updateValueAndValidity();
    this.customerForm.get("productFamily").clearValidators();
    this.customerForm.get("productFamily").updateValueAndValidity();
    this.customerForm.get("planPrice").clearValidators();
    this.customerForm.get("planPrice").updateValueAndValidity();

    this.customerForm.get("planCurrency").clearValidators();
    this.customerForm.get("planCurrency").updateValueAndValidity();
    this.customerForm.patchValue({
      customerType: this.customerData.customerType,
      name: this.customerData.name,
      emailId: this.customerData.emailId,
      password: this.customerData.password,
      dbName: this.customerData.dbName,
      bucketName: this.customerData.bucketName,
      contact: this.customerData.contact,
      billingAddress: this.customerData.billingAddress,
      onPremise: this.customerData.onPremise,
      onPremiseDB: this.customerData.onPremiseDB,
      country: this.customerData.country,
      city: this.customerData.city,
      aggregator: this.customerData.aggregator,
      hospitalType: this.customerData.hospitalType,
      hospitalId: this.customerData.hospitalId,
      blocked: this.customerData.blocked,
      role: this.customerData?.role?._id,
    });
  }
  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
  // Country linking
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
      this.getCountryData();
    }, 600);
  }
  // City Linking
  getCityData() {
    if (this.isLoadingCity) {
      return;
    }
    this.isLoadingCity = true;

    this.sharedService
      .getCmsData("getAllCity", this.cityParams)
      .subscribe((res: any) => {
        this.cityData.push(...res.data.content);
        this.totalElementCity = res.data.totalElement;
        this.cityParams.page = this.cityParams.page + 1;
        this.isLoadingCity = false;
      });
  }
  onInfiniteScrollCity(): void {
    if (this.cityData.length < this.totalElementCity) {
      this.getCityData();
    }
  }

  searchCity(filterValue: string) {
    clearTimeout(this.timeoutCity);
    this.timeoutCity = setTimeout(() => {
      this.cityParams.search = filterValue.trim();
      this.cityParams.page = 1;
      this.cityData = []; // Clear existing data when searching
      this.isLoadingCity = false;
      this.getCityData();
    }, 600);
  }
  // Group linking
  getGroupData() {
    this.sharedService
      .getCmsData("getAllGroup", this.groupDataDetails)
      .subscribe((res: any) => {
        this.groupData = res.data.content;
        this.totalElementGroup = res.data.totalElement;
      });
  }

  searchGroup(filterValue: string) {
    clearTimeout(this.timeoutGroup);
    this.timeoutGroup = setTimeout(() => {
      this.groupDataDetails.search = filterValue.trim();
      this.getGroupData();
    }, 600);
  }

  // Hospital linking

  getHospitalData() {
    this.sharedService
      .getCmsData("getAllHospital", this.hospitalDataDetails)
      .subscribe((res: any) => {
        this.hospitalData = res.data.content;
        this.totalElementHospital = res.data.totalElement;
      });
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalDataDetails.search = filterValue.trim();
      this.getHospitalData();
    }, 600);
  }

  getFacilitatorData() {
    this.supremeService
      .getAllFacilitator(this.facilitatorDataDetails)
      .subscribe((res: any) => {
        if (this.customerData) {
          this.facilitatorData = res.data?.content?.filter(
            (obj) => this.customerData._id != obj._id
          );
        } else {
          this.facilitatorData = res.data.content;
        }
        this.totalElementFacilitator = res.data.totalElement;
      });
  }

  searchFacilitator(filterValue: string) {
    clearTimeout(this.timeoutFacilitator);
    this.timeoutFacilitator = setTimeout(() => {
      this.facilitatorDataDetails.search = filterValue.trim();
      this.getFacilitatorData();
    }, 600);
  }
  compareFn(user1, user2) {
    return user1.name === user2;
  }

  getAllPlansData(familyId) {
    this.supremeService.getAllPlans(familyId).subscribe((res: any) => {
      this.plansData = res.data;
    });
  }
  getAllProductFamily() {
    this.supremeService.getAllProductFamily().subscribe((res: any) => {
      this.productFamilyData = res.data;
    });
  }
  productFamilyChange(){
    this.getAllPlansData(this.customerForm.value.productFamily)
  }
  planCurrencyChange(){
    if(this.customerForm.value.plan.id && this.customerForm.value.planCurrency){
      this.getPlanPrice(this.customerForm.value.plan.id,this.customerForm.value.planCurrency)
    }
  }
  getAllPlanCurrency(){
    this.supremeService.getAllPlanCurrency().subscribe((res: any) => {
      this.planCurrencyData = res.data;
    });
  }
  getPlanPrice(planId, currency) {
    this.supremeService.getPlanPrice(planId, currency).subscribe((res: any) => {
      this.planPriceData = res.data;
    });
  }
}
