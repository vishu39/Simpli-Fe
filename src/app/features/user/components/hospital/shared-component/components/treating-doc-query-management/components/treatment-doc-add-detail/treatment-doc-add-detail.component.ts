import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { cloneDeep } from "lodash";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { currencies } from "currencies.json";

@Component({
  selector: "app-treatment-doc-add-detail",
  templateUrl: "./treatment-doc-add-detail.component.html",
  styleUrls: ["./treatment-doc-add-detail.component.scss"],
})
export class TreatmentDocAddDetailComponent implements OnInit {
  dialogTitle: string;

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

  constructor(
    private dialogRef: MatDialogRef<TreatmentDocAddDetailComponent>,
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
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
    this.opinionForm.patchValue({
      currency: item,
    });
  }

  compareCurrencyObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  ngOnInit(): void {
    this.sortCurrencies();
    if (!this.isEdit) {
      this.getPendingOpinionRequestByDoctor();
    }

    this.buildForm();
    // this.patchFormIfEdit();
    this.getAllAddedOpinion(this.data?.data);
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
  getAllTreatmentPackageByDoctor(id: any) {
    if (this.isPackageDataLoading) {
      return;
    }
    this.isPackageDataLoading = true;
    this.hospitalService
      .getAllTreatmentPackageByDoctor(this.packageParams, id)
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
      this.getAllTreatmentPackageByDoctor(this.currentDoctorId);
    }
  }

  searchPackage(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      this.packageParams.search = filterValue.trim();
      this.packageParams.page = 1;
      this.packageData = [];
      this.isPackageDataLoading = false;
      this.getAllTreatmentPackageByDoctor(this.currentDoctorId);
    }, 600);
  }

  selectedPackageData: any = {};
  onClickPackage(data: any) {
    let values = this.opinionForm?.getRawValue();
    this.selectedPackageData = data;
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
          doctorName: doctorName,
        });
      }
    }
  }

  pendingRequestData = [];
  getPendingOpinionRequest(patchData: any) {
    this.isLoadingRequest = true;
    this.hospitalService
      .getPendingOpinionRequest(this.patientData?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.pendingRequestData = res?.data;

        if (this.pendingRequestData.length) {
          let opinionDataObj = this.pendingRequestData.find(
            (od: any) => od?.hospitalId === patchData?.hospitalId
          );
          if (!!opinionDataObj?.opinionId) {
            this.opinionId = opinionDataObj?.opinionId;
          }
        }
      });
  }

  opinionId: string;
  patchFormIfEdit(patchData: any) {
    console.log(patchData);

    if (this.isEdit) {
      let usdCurrencyIndex = this.currencyArray?.findIndex(
        (ca: any) => ca?.code === "USD"
      );

      this.currentDoctorId = patchData?.doctorId;

      this.getAllTreatmentPackageByDoctor(patchData?.doctorId);

      // this.getAllAddedOpinion(this.data.data);
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
        initialEvaluationMinimum,
        initialEvaluationMaximum,
        diagnosis,
        _id,
        remarks,
        treatmentPlan,
        treatment,
        receivedAt,
        createdAt,
        currency,
        treatmentPackage,
      } = patchData;

      this.getPendingOpinionRequest(patchData);

      this.currentDoctorName = doctorName;
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
        patient: this.patientData?._id,
        receivedAt: createdAt,
        currency: !!currency?.code
          ? currency
          : this.currencyArray[usdCurrencyIndex],
        treatmentPackage: treatmentPackage,
      });
    }
  }

  isOpinionAlreadyAdded = false;
  opinionData = [];
  opinionObject: any = {};
  getAllAddedOpinion(d: any) {
    if (this.isEdit) {
      this.hospitalService.getAllAddedOpinion(this.patientData?._id).subscribe(
        (res: any) => {
          if (res?.data) {
            this.opinionData = res?.data;
            if (this.opinionData.length) {
              let opinionDataObj = this.opinionData.find(
                (od: any) => od?.hospitalId === d?.hospitalId
              );
              if (!!opinionDataObj?.opinionId) {
                this.isOpinionAlreadyAdded = true;
                this.opinionObject = opinionDataObj;
                this.dialogTitle = "Edit Opinion Details";
                this.patchFormIfEdit(this.data.data);
              } else {
                this.dialogTitle = "Add Opinion Details";
                this.isOpinionAlreadyAdded = false;
                this.opinionObject = {};
                this.patchFormIfEdit(this.data.data);
              }
            } else {
              this.dialogTitle = "Add Opinion Details";
              this.isOpinionAlreadyAdded = false;
              this.opinionObject = {};
              this.patchFormIfEdit(this.data.data);
            }
          }
        },
        (err) => {
          this.isOpinionAlreadyAdded = false;
          this.opinionObject = {};
        }
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
      doctorName: [
        {
          value: "",
          disabled: true,
        },
      ],
      doctorId: [""],
      diagnosis: ["", [Validators.required]],
      treatmentPlan: ["", [Validators.required]],
      stayInCountry: ["", [Validators.required]],
      stayInHospital: ["", [Validators.required]],
      hospitalDuration: ["", [Validators.required]],
      countryDuration: ["", [Validators.required]],
      remarks: [""],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
      accreditation: [[, [Validators.required]]],
      currency: ["", [Validators.required]],
      initialEvaluationMinimum: ["", [Validators.required]],
      initialEvaluationMaximum: ["", [Validators.required]],
      treatment: this.fb.array([this.createTreatmentform()]),
      patient: [this.patientData?._id, [Validators.required]],
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

  getPendingOpinionRequestByDoctor() {
    this.isLoadingRequest = true;
    this.hospitalService
      .getPendingOpinionRequestByDoctor(this.patientData?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.request = res?.data;
      });
  }

  currentDoctorName = "";
  currentDoctorId = "";
  onClickHospital(item: any) {
    this.getHospitalById(item?.hospitalId);
    this.opinionForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
      doctorName: item?.doctorName,
      doctorId: item?.doctorId,
    });
    this.currentDoctorName = item?.doctorName;
    this.currentDoctorId = item?.doctorId;
    this.getAllTreatmentPackageByDoctor(item?.doctorId);
  }

  getHospitalById(id: string) {
    this.dataLoading = true;
    // this.sharedService.startLoader();
    this.sharedService
      .getCmsData(`getHospital/${id}`, {})
      .subscribe((res: any) => {
        this.doctorsList = [];
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
          } else if (
            this.doctorsList?.length &&
            !this.isEdit &&
            !!this.selectedPackageData?._id
          ) {
            let index = this.doctorsList?.findIndex(
              (dl: any) => dl?._id === this.selectedPackageData?.doctorId
            );

            if (index !== -1) {
              this.opinionForm.patchValue({
                doctorName: this.doctorsList[index]?.name,
                doctorId: this.doctorsList[index]?._id,
              });
            } else {
              this.opinionForm.patchValue({
                doctorName: "Other",
                otherDoctorName: this.selectedPackageData?.doctorName,
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

  submit() {
    if (this.opinionForm?.valid) {
      const {
        hospitalId,
        hospitalName,
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
        otherDoctorName,
        receivedAt,
        currency,
        treatmentPackage,
      } = this.opinionForm?.getRawValue();

      let paylaod = {
        doctorOpinionReceived: {
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
          doctorName:
            this.currentDoctorName === "Other"
              ? otherDoctorName || "Other"
              : this.currentDoctorName,
          currency,
          treatmentPackage: treatmentPackage ? treatmentPackage : null,
        },
        patient,
      };

      if (!this.isEdit) {
        this.hospitalService
          .addOpinionByDoctor(paylaod)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.dialogRef.close(true);
          });
      } else {
        if (!this.isOpinionAlreadyAdded) {
          paylaod["opinionReceived"] = paylaod?.doctorOpinionReceived;
          paylaod["opinionReceived"]["receivedAt"] = receivedAt;
          delete paylaod["doctorOpinionReceived"];
          paylaod["opinionReceived"].opinionId = this.opinionId;
          this.hospitalService.addOpinion(paylaod).subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
        } else {
          paylaod["opinionReceivedEdited"] = paylaod?.doctorOpinionReceived;
          paylaod["opinionReceivedEdited"]["receivedAt"] = receivedAt;
          paylaod["opinionReceivedEdited"].opinionId =
            this.opinionObject?.opinionId;
          delete paylaod["doctorOpinionReceived"];
          this.hospitalService
            .addOpinionEdited(paylaod)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.closeDialog(true);
            });
        }
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
