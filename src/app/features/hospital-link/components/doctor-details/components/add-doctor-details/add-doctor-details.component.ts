import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { currencies } from "currencies.json";

@Component({
  selector: "app-add-doctor-details",
  templateUrl: "./add-doctor-details.component.html",
  styleUrls: ["./add-doctor-details.component.scss"],
})
export class AddDoctorDetailsComponent implements OnInit {
  @Input() requestData: any;
  @Input() patientData: any;
  @Input() decodedToken: any;
  @Output("refetch") refetch: EventEmitter<any> = new EventEmitter();

  opinionForm: FormGroup;
  doctorsList: any = [{ name: "Other" }];
  doctorFreshList: any = [];
  timeoutDoctor = null;
  dataLoading: boolean = false;
  durationData = ["day", "week", "month", "year"];

  constructor(
    private router: Router,
    private faciliatorService: FacilitatorService,
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

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
    this.opinionForm.patchValue({
      currency: item,
    });
  }

  compareCurrencyObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  ngOnInit(): void {
    this.sortCurrencies();
    this.buildForm();

    if (this.decodedToken?.customerType === "hospital") {
      this.getAllTreatmentPackageByDoctor();
    }

    this.getHospitalById(this.requestData?.hospitalId);
    let usdCurrencyIndex = this.currencyArray?.findIndex(
      (ca: any) => ca?.code === "USD"
    );
    if (usdCurrencyIndex !== -1) {
      this.opinionForm.patchValue({
        currency: this.currencyArray[usdCurrencyIndex],
      });
    }
  }

  packageData: any = [];
  totalPackageElement: number = 0;
  packageParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  timeoutPackage = null;

  isPackageDataLoading: boolean = false;
  getAllTreatmentPackageByDoctor() {
    if (this.isPackageDataLoading) {
      return;
    }
    this.isPackageDataLoading = true;
    this.hospitalService
      .getAllTreatmentPackageByDoctorOpenLink(
        this.packageParams,
        this.requestData?.doctorId
      )
      .subscribe(
        (res: any) => {
          this.packageData = res.data.content;
          this.totalPackageElement = res.data.totalElement;
          this.packageParams.page = this.packageParams.page + 1;
          this.isPackageDataLoading = false;
        },
        (err) => {
          this.isPackageDataLoading = false;
        }
      );
  }

  onInfiniteScrollPackage(): void {
    if (this.packageData.length < this.totalPackageElement) {
      this.getAllTreatmentPackageByDoctor();
    }
  }

  searchPackage(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      this.packageParams.search = filterValue.trim();
      this.packageParams.page = 1;
      this.packageData = [];
      this.isPackageDataLoading = false;
      this.getAllTreatmentPackageByDoctor();
    }, 600);
  }

  onClickPackage(data: any) {
    let values = this.opinionForm?.getRawValue();
    this.opinionForm.reset({
      hospitalId: values?.hospitalId,
      hospitalName: values?.hospitalName,
      hospitalCity: values?.hospitalCity,
      accreditation: values?.accreditation,
      treatmentPackage: data?._id,
      patient: values?.patient,
      opinionId: values?.opinionId,
      doctorName: values?.doctorName,
      doctorId: values?.doctorId,
      receivedAt: values?.receivedAt,
    });
    this.patchPackageData(data);
  }

  patchPackageData(item: any) {
    const {
      doctorName,
      doctorId,
      hospitalDuration,
      countryDuration,
      stayInCountry,
      stayInHospital,
      initialEvaluationMinimum,
      initialEvaluationMaximum,
      diagnosis,
      remarks,
      treatmentPlan,
      treatment,
      currency,
      name,
    } = item;

    this.treatmentArray.clear();
    this.treatmentArray.removeAt(0);
    treatment.forEach((t: any) => {
      let formObj: FormGroup = this.createTreatmentform();
      formObj.patchValue({
        name: t?.name,
        room: t?.room,
        minCost: t?.minCost,
        maxCost: t?.maxCost,
      });

      this.treatmentArray.push(formObj);
    });

    this.opinionForm.patchValue({
      diagnosis: diagnosis,
      treatmentPlan: treatmentPlan,
      stayInCountry: stayInCountry,
      stayInHospital: stayInHospital,
      hospitalDuration: hospitalDuration,
      countryDuration: countryDuration,
      remarks: remarks,
      initialEvaluationMinimum: initialEvaluationMinimum,
      initialEvaluationMaximum: initialEvaluationMaximum,
      currency: currency,
      name: name,
    });

    if (this.doctorsList?.length > 0) {
      let index = this.doctorsList?.findIndex(
        (dl: any) => dl?._id === doctorId
      );

      if (index !== -1) {
        this.opinionForm.patchValue({
          doctorName: this.doctorsList[index]?.name,
          doctorId: this.doctorsList[index]?._id,
        });
      } else {
        this.opinionForm.patchValue({
          doctorName: "Other",
          otherDoctorName: doctorName,
          doctorId: undefined,
        });
      }
    }
  }

  buildForm() {
    this.opinionForm = this.fb.group({
      hospitalId: this.requestData?.hospitalId,
      hospitalName: [
        {
          value: this.requestData?.hospitalName,
          disabled: true,
        },
      ],
      hospitalCity: ["", [Validators.required]],
      doctorName: [
        {
          value: this.requestData?.doctorName,
          disabled: true,
        },
        [Validators.required],
      ],
      doctorId: [this.requestData?.doctorId || ""],
      diagnosis: ["", [Validators.required]],
      treatmentPlan: ["", [Validators.required]],
      stayInCountry: ["", [Validators.required]],
      stayInHospital: ["", [Validators.required]],
      hospitalDuration: ["", [Validators.required]],
      countryDuration: ["", [Validators.required]],
      remarks: [""],
      accreditation: [[, [Validators.required]]],
      currency: ["", [Validators.required]],
      initialEvaluationMinimum: ["", [Validators.required]],
      initialEvaluationMaximum: ["", [Validators.required]],
      treatment: this.fb.array([this.createTreatmentform()]),
      patient: [this.patientData?._id, [Validators.required]],
      receivedAt: [""],
      treatmentPackage: [""],
    });
  }

  createTreatmentform() {
    return this.fb.group({
      name: ["", [Validators.required]],
      room: ["", [Validators.required]],
      minCost: ["", [Validators.required]],
      maxCost: [[], [Validators.required]],
    });
  }

  get treatmentArray(): FormArray {
    return this.opinionForm.get("treatment") as FormArray;
  }

  addTreatment() {
    this.treatmentArray.push(this.createTreatmentform());
  }

  deleteTreatment(i: number) {
    if (this.treatmentArray.value.length > 1) {
      this.treatmentArray.removeAt(i);
    }
  }

  getHospitalById(id: string) {
    this.dataLoading = true;
    this.sharedService
      .getCmsData(`getHospital/${id}`, {})
      .subscribe((res: any) => {
        if (res?.data) {
          let newAggredation = [];
          res?.data?.accreditation?.forEach((a: any) => {
            newAggredation.push(a?.name);
          });
          this.opinionForm.patchValue({
            accreditation: newAggredation,
            hospitalCity: res?.data?.city[0]?.name,
          });
          this.doctorsList.push(...res?.data?.doctor);
          this.doctorFreshList = this.doctorsList;
          this.dataLoading = false;
        }
      });
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.doctorFreshList);
        this.doctorsList = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.doctorsList = filterArray;
      } else {
        this.doctorsList = this.doctorFreshList;
      }
    }, 600);
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  submit() {
    if (this.opinionForm?.valid) {
      const {
        hospitalId,
        hospitalCity,
        doctorId,
        diagnosis,
        treatmentPlan,
        stayInCountry,
        stayInHospital,
        hospitalDuration,
        countryDuration,
        remarks,
        accreditation,
        initialEvaluationMinimum,
        initialEvaluationMaximum,
        treatment,
        patient,
        receivedAt,
        currency,
        treatmentPackage,
      } = this.opinionForm?.value;

      let paylaod: any = {
        doctorOpinionReceived: {
          hospitalName: this.requestData?.hospitalName,
          hospitalId,
          hospitalCity,
          treatment,
          treatmentPlan,
          stayInCountry,
          stayInHospital,
          hospitalDuration,
          countryDuration,
          accreditation,
          initialEvaluationMaximum,
          initialEvaluationMinimum,
          doctorId,
          diagnosis,
          remarks,
          receivedAt,
          doctorName: this.requestData?.doctorName,
          currency,
        },
        patient,
      };

      if (this.decodedToken?.customerType === "facilitator") {
        this.faciliatorService
          .opinionReceivedDoctorOpenLink(paylaod)
          .subscribe((res: any) => {
            this.refetch.emit();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      }

      if (this.decodedToken?.customerType === "hospital") {
        paylaod.doctorOpinionReceived.treatmentPackage = treatmentPackage
          ? treatmentPackage
          : null;
        this.hospitalService
          .addOpinionByDoctorOpenLink(paylaod)
          .subscribe((res: any) => {
            this.refetch.emit();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            localStorage.clear();
            this.router.navigate(["/hospital/hospital-login"]);
          });
      }
    } else {
      this.opinionForm.markAsTouched();
    }
  }
}
