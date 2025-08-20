import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { currencies } from "currencies.json";

@Component({
  selector: "app-add-details-opinion",
  templateUrl: "./add-details-opinion.component.html",
  styleUrls: ["./add-details-opinion.component.scss"],
})
export class AddDetailsOpinionComponent implements OnInit, OnChanges {
  @Input() requestData: any;
  @Input() patientData: any;
  @Input() dataForEdit: any;
  @Input() isEdit: boolean = false;
  @Output("refetch") refetch: EventEmitter<any> = new EventEmitter();

  opinionForm: FormGroup;
  doctorsList = [{ name: "Other" }];
  doctorFreshList: any = [];
  timeoutDoctor = null;
  dataLoading: boolean = false;
  durationData = ["day", "week", "month", "year"];

  constructor(
    private router: Router,
    private faciliatorService: FacilitatorService,
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (!!changes?.dataForEdit?.currentValue) {
        this.patchOpinionForm();
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
      doctorName: ["", [Validators.required]],
      otherDoctorName: [""],
      doctorId: [""],
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
      opinionId: [this.requestData?.opinionId, [Validators.required]],
      patient: [this.patientData?._id, [Validators.required]],
      receivedAt: [""],
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

  onClickDoctor(item: any) {
    this.opinionForm.patchValue({
      doctorId: item?._id,
      doctorName: item?.name,
    });
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  patchOpinionForm() {
    if (this.isEdit) {
      const {
        hospitalName,
        hospitalId,
        accreditation,
        doctorName,
        doctorId,
        hospitalCity,
        hospitalDuration,
        countryDuration,
        stayInCountry,
        stayInHospital,
        receivedAt,
        // opinionId,
        initialEvaluationMinimum,
        initialEvaluationMaximum,
        diagnosis,
        remarks,
        treatmentPlan,
        treatment,
        currency,
      } = this.dataForEdit;

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
        hospitalId: hospitalId,
        hospitalName: hospitalName,
        hospitalCity: hospitalCity,
        doctorName: doctorName,
        doctorId: doctorId,
        diagnosis: diagnosis,
        treatmentPlan: treatmentPlan,
        stayInCountry: stayInCountry,
        stayInHospital: stayInHospital,
        hospitalDuration: hospitalDuration,
        countryDuration: countryDuration,
        remarks: remarks,
        accreditation: accreditation,
        initialEvaluationMinimum: initialEvaluationMinimum,
        initialEvaluationMaximum: initialEvaluationMaximum,
        // opinionId: opinionId,
        patient: this.patientData?._id,
        receivedAt: receivedAt,
        currency: currency,
      });
    }
  }

  submit() {
    if (this.opinionForm?.valid) {
      const {
        hospitalId,
        hospitalCity,
        doctorName,
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
        opinionId,
        patient,
        receivedAt,
        otherDoctorName,
        currency,
      } = this.opinionForm?.value;

      let paylaod = {
        opinionReceived: {
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
          opinionId,
          receivedAt,
          doctorName:
            doctorName === "Other" ? otherDoctorName || "Other" : doctorName,
          currency,
        },
        patient,
      };

      this.faciliatorService
        .opinionReceivedOpenLink(paylaod)
        .subscribe((res: any) => {
          this.refetch.emit();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.opinionForm.markAsTouched();
    }
  }
}
