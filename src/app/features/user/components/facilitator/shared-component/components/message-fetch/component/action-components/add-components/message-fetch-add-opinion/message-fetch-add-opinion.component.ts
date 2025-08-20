import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { currencies } from "currencies.json";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import {
  GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ,
  GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING,
} from "src/app/shared/util";
import * as moment from "moment";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-message-fetch-add-opinion",
  templateUrl: "./message-fetch-add-opinion.component.html",
  styleUrls: ["./message-fetch-add-opinion.component.scss"],
})
export class MessageFetchAddOpinionComponent implements OnInit {
  @Input() messageData: any;
  @Input() emailFetchData: any;
  isLoadingRequest = false;
  opinionForm: FormGroup;
  doctorsList = [];
  doctorFreshList: any = [];
  timeoutDoctor = null;
  request: any = [];
  dataLoading: boolean = false;
  title = "";

  durationData = ["day", "week", "month", "year"];

  constructor(
    private facilitatorService: FacilitatorService,
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
    this.messageData.attachments = cloneDeep(this.messageData?.mainAttachments);

    this.sortCurrencies();
    this.getPendingOpinionRequest();
    this.getAddOpinionDataByMessageFetch();
    this.buildForm();
    let usdCurrencyIndex = this.currencyArray?.findIndex(
      (ca: any) => ca?.code === "USD"
    );
    if (usdCurrencyIndex !== -1) {
      this.opinionForm.patchValue({
        currency: this.currencyArray[usdCurrencyIndex],
      });
    }

    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    let receivedAtDate = moment(this.messageData?.messageData[0]?.timestamp);
    this.opinionForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });
  }

  addDataFromAi: any;
  addObjFromAi: any;
  isAiLoading = true;
  getAddOpinionDataByMessageFetch() {
    this.isAiLoading = true;

    let bodyArray: any = [];
    if (this.messageData?.messageData?.length > 0) {
      this.messageData?.messageData?.forEach((md: any) => {
        if (md?.message_type === "chat" || md?.body) {
          bodyArray.push(md?.body);
        }
      });
    }

    this.facilitatorService
      .getAddOpinionDataByMessageFetch({ message: bodyArray })
      .subscribe(
        (res: any) => {
          this.addDataFromAi = res?.data;
          this.addObjFromAi = this.addDataFromAi?.opinionData;
          if (this.messageData?.attachments?.length > 0) {
            this.messageData?.attachments?.map((file: any) => {
              file["url"] = file?.signedUrl;
              file["type"] = file?.mimetype;
              file["name"] = file?.originalname;
            });
          }
          this.isAiLoading = false;
          this.fetchDataFromAi(this.addObjFromAi);
        },
        () => {
          this.isAiLoading = false;
        }
      );
  }

  fetchDataFromAi(data: any) {
    let currencyObj: any;

    if (!!data?.currency) {
      currencyObj = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
        data?.currency,
        this.currencyArray,
        "currency"
      );
    }

    let usdCurrencyIndex = this.currencyArray?.findIndex(
      (ca: any) => ca?.code === "USD"
    );

    // let receivedAtDate = moment(this.emailFetchData?.date);
    this.opinionForm.patchValue({
      hospitalDuration: data?.hospitalDuration
        ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING(
            data?.hospitalDuration,
            this.durationData
          )
        : null,
      countryDuration: data?.countryDuration
        ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING(
            data?.countryDuration,
            this.durationData
          )
        : null,
      stayInCountry: data?.stayInCountry || "",
      stayInHospital: data?.stayInHospital || "",
      initialEvaluationMinimum: data?.initialEvaluationMinimum || "",
      initialEvaluationMaximum: data?.initialEvaluationMaximum || "",
      // receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
      diagnosis: data?.diagnosis || "",
      remarks: data?.remarks || "",
      treatmentPlan: data?.treatmentPlan || "",
      currency: currencyObj?.code
        ? currencyObj
        : this.currencyArray[usdCurrencyIndex],
    });

    let hospitalObj: any;

    if (!!data?.hospitalName) {
      hospitalObj = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
        data?.hospitalName,
        this.request,
        "addVil"
      );
    }

    if (!!hospitalObj?.hospitalName) {
      this.onClickHospital(hospitalObj);
    }

    if (data?.treatment?.length > 0) {
      this.treatmentArray.removeAt(0);
      data?.treatment.forEach((t: any) => {
        let treatmentFg = this.createTreatmentform();
        treatmentFg.patchValue({
          name: t?.name,
          room: t?.room,
          minCost: t?.minCost,
          maxCost: t?.maxCost,
        });
        // let formObj: FormGroup = this.fb.group();
        this.treatmentArray.push(treatmentFg);
      });
    }
  }

  patchFormIfEdit(data: any) {
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
      remarks,
      opinionId,
      treatmentPlan,
      treatment,
      receivedAt,
      currency,
    } = data;
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
      opinionId: opinionId,
      initialEvaluationMinimum: initialEvaluationMinimum,
      initialEvaluationMaximum: initialEvaluationMaximum,
      patient: this.emailFetchData?._id,
      // receivedAt: receivedAt,
      currency: currency,
    });
  }

  patchDraft() {
    let opinionDraftData: any = JSON.parse(
      localStorage.getItem(`${this.emailFetchData?._id}addOpinionDraft`)
    );
    if (!!opinionDraftData) {
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
    }

    // localStorage.removeItem(`${this.emailFetchData?._id}addOpinionDraft`);
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
        `${this.emailFetchData?._id}addOpinionDraft`,
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
      hospitalName: ["", [Validators.required]],
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
      patient: [this.emailFetchData?._id, [Validators.required]],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
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
    this.facilitatorService
      .getPendingOpinionRequest(this.emailFetchData?._id)
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
          if (this.doctorsList?.length > 0) {
            let doctorObj: any;

            if (
              !!this.addObjFromAi?.doctorName ||
              !!this.readFileNeededObj?.doctorName
            ) {
              if (!this.isFileReading) {
                doctorObj = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
                  this.addObjFromAi?.doctorName,
                  this.doctorsList,
                  "common"
                );
              } else {
                doctorObj = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
                  this.readFileNeededObj?.doctorName,
                  this.doctorsList,
                  "common"
                );
              }
            }

            if (!!doctorObj?._id) {
              this.opinionForm.patchValue({
                doctorId: doctorObj?._id,
                doctorName: doctorObj?.name,
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

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  // image preview function
  isLightBox: boolean = false;
  lightBoxData: any;
  openLightBox($event: any, data: any[], i: number) {
    this.lightBoxData = { data, i, $event };
    this.isLightBox = true;
  }

  closeLightBox({ $event, eventType }) {
    if (eventType == "CLOSE") this.isLightBox = false;
  }

  downloadImage(image: any, name: string) {
    window.open(image, "_blank");
  }

  getDocIcon(file: any) {
    let imageType = "";
    if (file.name.includes(".doc")) {
      imageType = "word";
    } else if (file.name.includes(".xlsx") || file.name.includes(".xls")) {
      imageType = "excel";
    } else if (file.name.includes(".zip")) {
      imageType = "zip";
    }
    return `/assets/images/icons/${imageType}.png`;
  }

  getRandomDocImage() {
    return `/assets/images/icons/unknown.png`;
  }

  readFileData: any;
  readFileNeededObj: any;

  isFileReading: boolean = false;
  onClickReadFile(file: any) {
    let payload = {
      url: file?.url || file?.path,
      fileName: file?.name,
    };

    if (file?.type?.includes("image")) {
      this.facilitatorService
        .getAddOpinionDataByMessageImageRead(payload)
        .subscribe((res: any) => {
          this.readFileData = res?.data;
          this.readFileNeededObj = this.readFileData?.opinionData;
          this.isFileReading = true;
          this.resetForm();
          this.fetchDataFromAi(this.readFileNeededObj);
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.facilitatorService
        .getAddOpinionDataByMessageFileRead(payload)
        .subscribe((res: any) => {
          this.readFileData = res?.data;
          this.readFileNeededObj = this.readFileData?.opinionData;
          this.isFileReading = true;
          this.resetForm();
          this.fetchDataFromAi(this.readFileNeededObj);
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    }
  }

  resetForm() {
    this.opinionForm.reset({
      patient: this.emailFetchData?._id,
      receivedAt: this.opinionForm?.getRawValue()?.receivedAt,
    });
    this.doctorsList = [];
    this.doctorFreshList = [];
    this.treatmentArray.value.forEach((ta: any, index: any) => {
      if (index > 0) {
        this.treatmentArray.removeAt(index);
      }
    });
  }
}
