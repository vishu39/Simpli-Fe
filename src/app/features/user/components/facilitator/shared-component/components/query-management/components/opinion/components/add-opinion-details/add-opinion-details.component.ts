import { Component, Inject, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddDetailsDialogComponent } from "../../../../dialog/add-details-dialog/add-details-dialog.component";
import { cloneDeep } from "lodash";
import { currencies } from "currencies.json";

@Component({
  selector: "shared-add-opinion-details",
  templateUrl: "./add-opinion-details.component.html",
  styleUrls: ["./add-opinion-details.component.scss"],
})
export class AddOpinionDetailsComponent implements OnInit {
  isLoadingRequest = false;
  opinionForm: FormGroup;
  doctorsList = [];
  doctorFreshList: any = [];
  timeoutDoctor = null;
  request: any = [];
  dataLoading: boolean = false;
  isEdit = false;
  title = "";

  durationData = ["day", "week", "month", "year"];

  @Input() patientData: any;
  @Input() isDialogClosed: boolean = false;
  @Input() isFormChange: any = "addOpinion";

  constructor(
    private faciliatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddDetailsDialogComponent>,
    public editDialogRef: MatDialogRef<AddOpinionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    if (!this.isEdit) {
      this.getPendingOpinionRequest();
      let usdCurrencyIndex = this.currencyArray?.findIndex(
        (ca: any) => ca?.code === "USD"
      );
      if (usdCurrencyIndex !== -1) {
        this.opinionForm.patchValue({
          currency: this.currencyArray[usdCurrencyIndex],
        });
      }
      this.patchDraft();
    }

    this.patchFormIfEdit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isDialogClosed?.currentValue) {
      if (!this.isEdit) {
        this.saveDraft();
      }
    }
    if (!!changes?.isFormChange?.currentValue) {
      if (!this.isEdit) {
        this.saveDraft();
      }
    }
  }

  patchFormIfEdit() {
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
        opinionId,
        initialEvaluationMinimum,
        initialEvaluationMaximum,
        diagnosis,
        remarks,
        treatmentPlan,
        treatment,
        currency,
      } = this.data.data;
      this.getHospitalById(hospitalId);

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
        opinionId: opinionId,
        patient: this.data?.patientData?._id,
        receivedAt: receivedAt,
        currency: currency,
      });
    }
  }

  patchDraft() {
    let opinionDraftData: any = JSON.parse(
      localStorage.getItem(`${this.patientData?._id}addOpinionDraft`)
    );
    if (
      !!opinionDraftData?.hospitalName ||
      !!opinionDraftData?.hospitalId ||
      !!opinionDraftData?.doctorId ||
      !!opinionDraftData?.accreditation ||
      !!opinionDraftData?.hospitalCity ||
      !!opinionDraftData?.doctorName ||
      !!opinionDraftData?.otherDoctorName ||
      !!opinionDraftData?.hospitalDuration ||
      !!opinionDraftData?.countryDuration ||
      !!opinionDraftData?.stayInCountry ||
      !!opinionDraftData?.stayInHospital ||
      !!opinionDraftData?.initialEvaluationMinimum ||
      !!opinionDraftData?.initialEvaluationMaximum ||
      !!opinionDraftData?.diagnosis ||
      !!opinionDraftData?.remarks ||
      !!opinionDraftData?.opinionId ||
      !!opinionDraftData?.treatmentPlan ||
      !!opinionDraftData?.treatment ||
      !!opinionDraftData?.currency ||
      !!opinionDraftData?.receivedAt
    ) {
      this.treatmentArray.removeAt(0);
      opinionDraftData?.treatment?.forEach((t: any) => {
        let formObj: FormGroup = this.createTreatmentform();
        formObj.patchValue({
          name: t?.name,
          room: t?.room,
          minCost: t?.minCost,
          maxCost: t?.maxCost,
        });

        this.treatmentArray.push(formObj);
      });

      let oData = cloneDeep(opinionDraftData);

      if (oData["treatment"]?.length > 0) {
        delete oData["treatment"];
      }

      this.getHospitalById(opinionDraftData?.hospitalId);
      this.opinionForm.patchValue({
        ...oData,
      });
    }

    // localStorage.removeItem(`${this.patientData?._id}addOpinionDraft`);
  }

  saveDraft() {
    if (
      !!this.opinionForm?.getRawValue()?.hospitalName ||
      !!this.opinionForm?.getRawValue()?.hospitalId ||
      !!this.opinionForm?.getRawValue()?.doctorId ||
      // !!this.opinionForm?.getRawValue()?.accreditation ||
      !!this.opinionForm?.getRawValue()?.hospitalCity ||
      !!this.opinionForm?.getRawValue()?.doctorName ||
      !!this.opinionForm?.getRawValue()?.otherDoctorName ||
      !!this.opinionForm?.getRawValue()?.hospitalDuration ||
      !!this.opinionForm?.getRawValue()?.countryDuration ||
      !!this.opinionForm?.getRawValue()?.stayInCountry ||
      !!this.opinionForm?.getRawValue()?.stayInHospital ||
      !!this.opinionForm?.getRawValue()?.initialEvaluationMinimum ||
      !!this.opinionForm?.getRawValue()?.initialEvaluationMaximum ||
      !!this.opinionForm?.getRawValue()?.diagnosis ||
      !!this.opinionForm?.getRawValue()?.remarks ||
      !!this.opinionForm?.getRawValue()?.opinionId ||
      !!this.opinionForm?.getRawValue()?.treatmentPlan ||
      !!this.opinionForm?.getRawValue()?.currency ||
      !!this.opinionForm?.getRawValue()?.receivedAt
    ) {
      let opinionDraftData = {
        hospitalName: this.opinionForm?.getRawValue()?.hospitalName,
        hospitalId: this.opinionForm?.getRawValue()?.hospitalId,
        doctorId: this.opinionForm?.getRawValue()?.doctorId,
        accreditation: this.opinionForm?.getRawValue()?.accreditation,
        hospitalCity: this.opinionForm?.getRawValue()?.hospitalCity,
        doctorName: this.opinionForm?.getRawValue()?.doctorName,
        otherDoctorName: this.opinionForm?.getRawValue()?.otherDoctorName,
        hospitalDuration: this.opinionForm?.getRawValue()?.hospitalDuration,
        countryDuration: this.opinionForm?.getRawValue()?.countryDuration,
        stayInCountry: this.opinionForm?.getRawValue()?.stayInCountry,
        stayInHospital: this.opinionForm?.getRawValue()?.stayInHospital,
        initialEvaluationMinimum:
          this.opinionForm?.getRawValue()?.initialEvaluationMinimum,
        initialEvaluationMaximum:
          this.opinionForm?.getRawValue()?.initialEvaluationMaximum,
        diagnosis: this.opinionForm?.getRawValue()?.diagnosis,
        remarks: this.opinionForm?.getRawValue()?.remarks,
        opinionId: this.opinionForm?.getRawValue()?.opinionId,
        treatmentPlan: this.opinionForm?.getRawValue()?.treatmentPlan,
        treatment: this.opinionForm?.getRawValue()?.treatment,
        receivedAt: this.opinionForm?.getRawValue()?.receivedAt,
        currency: this.opinionForm?.getRawValue()?.currency,
      };

      localStorage.setItem(
        `${this.patientData?._id}addOpinionDraft`,
        JSON.stringify(opinionDraftData)
      );
    }
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

  buildForm() {
    this.opinionForm = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: [
        {
          value: "",
          disabled: this.isEdit ? true : false,
        },
        [Validators.required],
      ],
      hospitalCity: ["", [Validators.required]],
      doctorName: ["", [Validators.required]],
      otherDoctorName: [
        "",
        this.opinionForm?.get("doctorName")?.value === "Other"
          ? [Validators.required]
          : [],
      ],
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
      opinionId: ["", [Validators.required]],
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

  getPendingOpinionRequest() {
    this.isLoadingRequest = true;
    this.faciliatorService
      .getPendingOpinionRequest(this.patientData?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.request = res?.data;
      });
  }

  onClickHospital(item: any) {
    this.getHospitalById(item?.hospitalId);
    this.opinionForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
      opinionId: item?.opinionId,
    });
  }

  getHospitalById(id: string) {
    this.dataLoading = true;
    // this.sharedService.startLoader();
    this.sharedService
      .getCmsData(`getHospital/${id}`, {})
      .subscribe((res: any) => {
        this.doctorsList = [{ name: "Other" }];
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
          if (this.doctorsList?.length && this.isEdit) {
            let obj = this.doctorsList?.find(
              (dl: any) => dl?.name === this.data?.data?.doctorName
            );
            if (!!obj) {
              this.opinionForm.patchValue({
                doctorName: this.data?.data?.doctorName,
              });
            } else {
              this.opinionForm.patchValue({
                doctorName: "Other",
                otherDoctorName: this.data?.data?.doctorName,
              });
            }
          }
          // this.sharedService.stopLoader();
        }
      });
  }

  onClickDoctor(item: any) {
    this.opinionForm.patchValue({
      doctorId: item?._id,
      doctorName: item?.name,
    });
  }

  closeDialog(isBool) {
    this.editDialogRef.close(isBool);
  }

  submit() {
    if (this.opinionForm?.valid) {
      const {
        hospitalId,
        hospitalName,
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
          hospitalName: this.isEdit
            ? this.data.data.hospitalName
            : hospitalName,
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
      // console.log('paylaod',paylaod)
      if (!this.isEdit) {
        this.faciliatorService
          .opinionReceived(paylaod)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            localStorage.removeItem(`${this.patientData?._id}addOpinionDraft`);
            this.dialogRef.close(true);
          });
      } else {
        paylaod["opinionReceivedEdited"] = paylaod?.opinionReceived;
        delete paylaod["opinionReceived"];
        this.faciliatorService
          .opinionReceivedEdited(paylaod)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      this.opinionForm.markAsTouched();
    }
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
}
