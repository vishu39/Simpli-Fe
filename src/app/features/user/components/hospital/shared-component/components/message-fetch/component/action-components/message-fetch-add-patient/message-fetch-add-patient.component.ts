import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { hospitalAdminUserType } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import {
  GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ,
  GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING,
} from "src/app/shared/util";
import { environment } from "src/environments/environment";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-message-fetch-add-patient",
  templateUrl: "./message-fetch-add-patient.component.html",
  styleUrls: ["./message-fetch-add-patient.component.scss"],
})
export class MessageFetchAddPatientComponent implements OnInit {
  @Input() messageData: any;
  @Input() selectedProfile: any;
  @Input() addPatientForm: FormGroup;
  @Output("modeChange") modeChange: EventEmitter<any> = new EventEmitter();
  @Output("patientFormBack") patientFormBack: EventEmitter<any> =
    new EventEmitter();
  @Output("recheckFormSubmit") recheckFormSubmit: EventEmitter<any> =
    new EventEmitter();
  @Output("addPatientFormSubmit") addPatientFormSubmit: EventEmitter<any> =
    new EventEmitter();

  @Output("checkDuplicate") checkDuplicate: EventEmitter<any> =
    new EventEmitter();
  report = [];
  isPatientLoading = false;
  userType = hospitalAdminUserType;
  decodedToken: any = this.sharedService.decodeToken();
  patientData: any;
  referralPartnerData: any = [];
  referralPartnerFreshData: any = [];
  isDuplicateFound: boolean = false;
  patientMhid: string;
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
  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  // Treatment Linking

  treatmentData: any = [];
  totalElementTreatment: number;
  treatmentParams = {
    page: 1,
    limit: 0,
    search: "",
  };
  timeoutTreatment = null;
  isLoadingTreatment = false;

  genderData = ["male", "female"];
  ageDurationData = ["day", "month", "year"];

  timeoutPartner = null;

  referralTypeName = {
    pre: "Pre defined",
    own: "Own",
  };

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {}

  reCheckForm() {
    this.isDuplicateFound = false;
    this.recheckFormSubmit.emit();
  }

  buildForm(formField) {
    this.addPatientForm = this.formBuilder.group(formField);
  }

  referralPartnerArray = [
    this.userType.referralPartner,
    this.userType.referralDoctor,
    this.userType.insurance,
    this.userType.corporate,
  ];
  ngOnInit(): void {
    this.getPatientDataByMessageFetch();
    this.getTreatmentData();
    this.getCountryData();
    if (this.referralPartnerArray.includes(this.decodedToken.userType)) {
      this.addPatientForm.controls["referralPartner"].disable();
    } else {
      this.getAllReferralPartner();
    }
    // this.patchDraft();
    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    let receivedAtDate = moment(this.messageData?.messageData[0]?.timestamp);
    this.addPatientForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });

    if (this.messageData?.attachments?.length > 0) {
      this.messageData?.attachments?.forEach((res: any) => {
        res["url"] = res?.signedUrl;
        res["type"] = res?.mimetype;
        res["name"] = res?.originalname;
        this.fileList.push(res);
        this.filePreviewUrls.push(res?.signedUrl);
      });
    }

    if (this.fileList?.length > 0) {
      this.addPatientForm.patchValue({
        report: this.fileList,
      });
    }
  }

  stringSimilarityPercentage = environment.stringSimilarityPercentage;
  newPatientData: any;
  commingEmailData: any;
  isEmailLoading = true;
  getPatientDataByMessageFetch() {
    this.isEmailLoading = true;

    let bodyArray: any = [];
    if (this.messageData?.messageData?.length > 0) {
      this.messageData?.messageData?.forEach((md: any) => {
        if (md?.message_type === "chat" || md?.body) {
          bodyArray.push(md?.body);
        }
      });
    }

    this.hospitalService
      .getPatientDataByMessageFetch({ message: bodyArray })
      .subscribe(
        (res: any) => {
          this.commingEmailData = res?.data;
          this.newPatientData = res?.data?.patientData;
          this.onEdit(this.newPatientData);
          this.getTreatmentData();
          this.isEmailLoading = false;
        },
        () => {
          this.isEmailLoading = false;
        }
      );
  }

  getPatientById(id: string) {
    this.isPatientLoading = true;
    this.hospitalService.getPatient(id).subscribe((res: any) => {
      this.patientData = res?.Data;
      this.isPatientLoading = false;
      // this.onEdit(res?.data);
    });
  }

  deleteReport(index) {
    this.report.splice(index, 1);
  }
  downloadImage(image: any, name: string) {
    window.open(image, "_blank");
  }

  backToForm() {
    this.isDuplicateFound = false;
    this.patientFormBack.emit();
  }

  onEdit(data: any) {
    this.patientData = data;
    if (this.patientData?.treatment == "") {
      this.patientData.treatment = null;
    }

    if (this.patientData?.referralType === "pre") {
      this.addPatientForm.get("referralPartner").disable();
    }

    let referralPartnerDataGet = this.patientData?.referralPartner
      ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
          this.patientData?.referralPartner,
          this.referralPartnerData,
          "referralPartner"
        )
      : "";

    // let receivedAtDate = moment(this.emailData?.date);

    // patching
    this.addPatientForm.patchValue({
      name: this.patientData?.name || "",
      // receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
      emailId: this.patientData?.emailId || "",
      contact: this.patientData?.contact || "",
      passportNumber: this.patientData?.passportNumber || "",
      age: this.patientData?.age || "",
      medicalHistory: this.patientData?.medicalHistory || "",
      remarks: this.patientData?.remarks || "",
      ageDuration: this.patientData?.ageDuration
        ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING(
            this.patientData?.ageDuration,
            this.ageDurationData
          )
        : null,
      gender: this.patientData?.gender
        ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING(
            this.patientData?.gender,
            this.genderData
          )
        : null,
      country: this.patientData?.country
        ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
            this.patientData?.country,
            this.countryData
          )
        : null,
      referralPartner: referralPartnerDataGet?._id
        ? referralPartnerDataGet?._id
        : "",
      referralType: referralPartnerDataGet?.referralType
        ? referralPartnerDataGet?.referralType
        : "",
      referralPartnerName: referralPartnerDataGet?.name
        ? referralPartnerDataGet?.name
        : "",
    });

    // if (this.messageData?.attachments?.length > 0) {
    //   this.messageData?.attachments?.forEach((res: any) => {
    //     res["url"] = res?.signedUrl;
    //     res["type"] = res?.mimetype;
    //     res["name"] = res?.originalname;
    //     this.fileList.push(res);
    //     this.filePreviewUrls.push(res?.signedUrl);
    //   });
    // }

    // if (this.fileList?.length > 0) {
    //   this.addPatientForm.patchValue({
    //     report: this.fileList,
    //   });
    // }

    this.checkDuplicate.emit();
  }

  onChangeMode(event: any) {
    this.modeChange.emit(event);
  }

  patchDraft() {
    let pData = JSON.parse(localStorage.getItem("patientDraft"));
    if (
      !!pData?.name ||
      !!pData?.gender ||
      !!pData?.country ||
      !!pData?.treatment ||
      !!pData?.age ||
      !!pData?.ageDuration ||
      !!pData?.contact ||
      !!pData?.emailId ||
      !!pData?.passportNumber ||
      !!pData?.referralPartner ||
      !!pData?.medicalHistory ||
      !!pData?.receivedAt ||
      !!pData?.remarks
    ) {
      this.addPatientForm.patchValue({
        mode: this.addPatientForm.value.mode,
        ...pData,
      });
    }
    localStorage.removeItem("patientDraft");
  }

  saveDraft() {
    const {
      name,
      gender,
      country,
      treatment,
      age,
      ageDuration,
      contact,
      emailId,
      passportNumber,
      referralPartner,
      referralPartnerName,
      referralType,
      mode,
      receivedAt,
      medicalHistory,
      remarks,
    } = this.addPatientForm.getRawValue();

    if (
      !!name ||
      !!gender ||
      !!country ||
      !!treatment ||
      !!age ||
      !!ageDuration ||
      !!contact ||
      !!emailId ||
      !!passportNumber ||
      !!referralPartner ||
      !!medicalHistory ||
      remarks ||
      referralPartnerName ||
      receivedAt ||
      referralType
    ) {
      let patientData = {
        name,
        gender,
        country,
        treatment,
        age,
        ageDuration,
        contact,
        emailId,
        passportNumber,
        referralPartner,
        referralPartnerName,
        referralType,
        // mode,
        medicalHistory,
        remarks,
        receivedAt,
      };
      localStorage.setItem("patientDraft", JSON.stringify(patientData));
    }
  }

  getAllReferralPartner() {
    this.hospitalService.getAllReferralPartner().subscribe((res: any) => {
      if (res?.data?.length) {
        let data = res?.data?.map((d: any) => {
          d["referralType"] = "own";
          return d;
        });

        this.referralPartnerData = data;
        this.referralPartnerFreshData = cloneDeep(this.referralPartnerData);
      }
      this.getPreReferralPartner();
    });
  }

  preReferralPartnerParams = {
    page: 1,
    limit: "",
    search: "",
  };
  getPreReferralPartner() {
    this.sharedService
      .getAllFacilitator(this.preReferralPartnerParams)
      .subscribe((res: any) => {
        if (res?.data?.content?.length) {
          let data = res?.data?.content?.map((d: any) => {
            d["referralType"] = "pre";
            return d;
          });
          this.referralPartnerData.push(...data);
          this.referralPartnerFreshData.push(...data);
        }
      });
  }

  onClickReferralItem(item: any) {
    this.addPatientForm.patchValue({
      referralType: item?.referralType,
      referralPartnerName: item?.name,
    });
  }

  searchReferralPartner(filterValue: string) {
    clearTimeout(this.timeoutPartner);
    this.timeoutPartner = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.referralPartnerFreshData);
        this.referralPartnerData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.referralPartnerData = filterArray;
      } else {
        this.referralPartnerData = this.referralPartnerFreshData;
      }
    }, 600);
  }

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

  getTreatmentData() {
    if (this.isLoadingTreatment) {
      return;
    }
    this.isLoadingTreatment = true;

    this.sharedService
      .getCmsData("getAllTreatment", this.treatmentParams)
      .subscribe((res: any) => {
        this.treatmentData.push(...res.data.content);
        this.totalElementTreatment = res.data.totalElement;
        this.treatmentParams.page = this.treatmentParams.page + 1;
        this.isLoadingTreatment = false;
        this.addPatientForm.patchValue({
          treatment: this.patientData?.treatment
            ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
                this.patientData?.treatment,
                this.treatmentData,
                "treatment"
              )
            : null,
        });
      });
  }
  onInfiniteScrollTreatment(): void {
    if (this.treatmentData.length < this.totalElementTreatment) {
      this.getTreatmentData();
    }
  }

  searchTreatment(filterValue: string) {
    clearTimeout(this.timeoutTreatment);
    this.timeoutTreatment = setTimeout(() => {
      this.treatmentParams.search = filterValue.trim();
      this.treatmentParams.page = 1;
      this.treatmentData = []; // Clear existing data when searching
      this.isLoadingTreatment = false;
      this.getTreatmentData();
    }, 600);
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  onFileSelected(e: any) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.filePreviewUrls.push(fileUrl);
        file["url"] = fileUrl;
      } else if (
        file.type.includes("application") &&
        file.type !== "application/pdf"
      ) {
        const fileUrl = URL.createObjectURL(file);
        file["url"] = fileUrl;
      } else if (file.type.includes("audio")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", function () {
          file["url"] = reader.result;
        });
      } else if (file.type.includes("video")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (evt: any) => {
          this.filePreviewUrls.push(reader.result as string);
          file["url"] = reader.result as string;
        };
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreviewUrls.push(reader.result as string);
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      this.fileList.push(file);
    });
  }

  onDelete(index: number) {
    if (index !== -1) {
      this.fileList.splice(index, 1);
      this.filePreviewUrls.splice(index, 1);
    }
  }

  readFileData: any;
  readFileNeededObj: any;

  isFileReading: boolean = false;
  onClickReadFile(data: any) {
    let payload = {
      url: data?.item?.url || data?.item?.path,
      fileName: data?.item?.name,
    };

    if (data?.item?.type?.includes("image")) {
      this.hospitalService
        .getPatientDataByMessageImageRead(payload)
        .subscribe((res: any) => {
          this.readFileData = res?.data;
          this.readFileNeededObj = this.readFileData?.patientData;
          this.isFileReading = true;
          this.resetForm();
          this.fetchDataFromAi(this.readFileNeededObj);
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.hospitalService
        .getPatientDataByMessageFileRead(payload)
        .subscribe((res: any) => {
          this.readFileData = res?.data;
          this.readFileNeededObj = this.readFileData?.patientData;
          this.isFileReading = true;
          this.resetForm();
          this.fetchDataFromAi(this.readFileNeededObj);
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    }
  }

  resetForm() {
    if (this.phoneInput) {
      const inputElement = this.phoneInput.nativeElement.querySelector("input"); // Find the actual input
      if (inputElement) {
        inputElement.value = ""; // Reset the input field manually
      }
    }
    this.addPatientForm.reset({
      mode: this.addPatientForm?.getRawValue()?.mode,
      receivedAt: this.addPatientForm?.getRawValue()?.receivedAt,
      contact: "",
    });
  }

  @ViewChild("phone", { static: false, read: ElementRef })
  phoneInput!: ElementRef;
  fetchDataFromAi(item: any) {
    if (item?.treatment === "") {
      item.treatment = null;
    }

    if (item?.referralType === "pre") {
      this.addPatientForm.get("referralPartner").disable();
    }

    let referralPartnerDataGet = item?.referralPartner
      ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
          item?.referralPartner,
          this.referralPartnerData,
          "referralPartner"
        )
      : "";

    // let receivedAtDate = moment(this.emailData?.date);

    // patching
    this.addPatientForm.patchValue({
      name: item?.name || "",
      // receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
      emailId: item?.emailId || "",
      contact: item?.contact || "",
      passportNumber: item?.passportNumber || "",
      age: item?.age || "",
      medicalHistory: item?.medicalHistory || "",
      remarks: item?.remarks || "",
      ageDuration: item?.ageDuration
        ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING(
            item?.ageDuration,
            this.ageDurationData
          )
        : null,
      gender: item?.gender
        ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING(
            item?.gender,
            this.genderData
          )
        : null,
      country: item?.country
        ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
            item?.country,
            this.countryData
          )
        : null,
      referralPartner: referralPartnerDataGet?._id
        ? referralPartnerDataGet?._id
        : "",
      referralType: referralPartnerDataGet?.referralType
        ? referralPartnerDataGet?.referralType
        : "",
      referralPartnerName: referralPartnerDataGet?.name
        ? referralPartnerDataGet?.name
        : "",
      treatment: item?.treatment
        ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
            item?.treatment,
            this.treatmentData,
            "treatment"
          )
        : null,
    });

    this.fileList = [];
    this.filePreviewUrls = [];
    if (this.messageData?.attachments?.length > 0) {
      this.messageData?.attachments?.forEach((res: any) => {
        res["url"] = res?.signedUrl;
        res["type"] = res?.mimetype;
        res["name"] = res?.originalname;
        this.fileList.push(res);
        this.filePreviewUrls.push(res?.signedUrl);
      });
    }

    if (this.fileList?.length > 0) {
      this.addPatientForm.patchValue({
        report: this.fileList,
      });
    }

    this.checkDuplicate.emit();
  }
}
