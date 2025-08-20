import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { hospitalAdminUserType, role } from "src/app/core/models/role";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "app-add-hospital-patient-dialog",
  templateUrl: "./add-patient-dialog.component.html",
  styleUrls: ["./add-patient-dialog.component.scss"],
})
export class AddPatientDialogComponent implements OnInit {
  dialogTitle: string;
  addPatientForm: FormGroup;
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
    limit: 20,
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
    limit: 20,
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
    private dialogRef: MatDialogRef<AddPatientDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {
    this.buildForm({
      name: ["", [Validators.required]],
      country: [null, [Validators.required]],
      gender: ["", [Validators.required]],
      treatment: [null, [Validators.required]],
      age: ["", [Validators.required]],
      ageDuration: ["", [Validators.required]],
      contact: [
        "",
        [Validators.required, Validators.pattern(regexService.contactRegex)],
      ],
      emailId: [
        "",
        [Validators.required, Validators.pattern(regexService.emailRegex)],
      ],
      passportNumber: [""],
      referralPartner: [""],
      referralType: [""],
      referralPartnerName: [""],
      medicalHistory: ["", [Validators.required]],
      remarks: [""],
      receivedAt: [""],
      report: [],
      mode: ["normal", [Validators.required]],
    });
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
    this.getCountryData();
    this.getTreatmentData();
    if (this.referralPartnerArray.includes(this.decodedToken.userType)) {
      this.addPatientForm.controls["referralPartner"].disable();
    } else {
      this.getAllReferralPartner();
    }
    if (!this.isEdit) {
      this.patchDraft();
    }
  }

  getPatientById(id: string) {
    this.isPatientLoading = true;
    this.hospitalService.getPatient(id).subscribe((res: any) => {
      this.patientData = res?.Data;
      this.isPatientLoading = false;
      this.onEdit(res?.data);
    });
  }

  deleteReport(index) {
    this.report.splice(index, 1);
  }
  downloadImage(image: any, name: string) {
    window.open(image, "_blank");
  }

  checkDuplicatePatient() {
    if (this.addPatientForm.valid) {
      if (this.patientData) {
        this.addPatientFormSubmit();
      } else {
        const data = {
          name: this.addPatientForm.value.name,
          country: this.addPatientForm.value.country,
          age: this.addPatientForm.value.age,
          ageDuration: this.addPatientForm.value.ageDuration,
          passportNumber: this.addPatientForm.value.passportNumber,
        };
        this.sharedService.startLoader();
        this.hospitalService.checkDuplicatePatient(data).subscribe(
          (res: any) => {
            // console.log('res', res)
            if (!res?.data?.found) {
              this.isDuplicateFound = false;
              this.addPatientFormSubmit();
            } else {
              this.sharedService.stopLoader();
              this.isDuplicateFound = true;
              this.patientMhid = res.data.patientMhidCode;
            }
          },
          (err) => {
            this.sharedService.stopLoader();
          }
        );
      }
    } else {
      Object.keys(this.addPatientForm.controls).forEach((key) => {
        this.addPatientForm.controls[key].markAsTouched();
      });
    }
  }

  backToForm() {
    this.isDuplicateFound = false;
  }

  addPatientFormSubmit() {
    if (this.addPatientForm.valid) {
      const formData = new FormData();
      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("fileFirst", this.fileList[i]);
      }
      formData.append("name", this.addPatientForm.value.name);
      formData.append("gender", this.addPatientForm.value.gender);
      formData.append("country", this.addPatientForm.value.country);
      formData.append("treatment", this.addPatientForm.value.treatment);
      formData.append("age", this.addPatientForm.value.age);
      formData.append("ageDuration", this.addPatientForm.value.ageDuration);
      formData.append("contact", this.addPatientForm.value.contact);
      formData.append(
        "receivedAt",
        this.addPatientForm.getRawValue().receivedAt
      );
      formData.append("emailId", this.addPatientForm.value.emailId);
      formData.append(
        "passportNumber",
        this.addPatientForm.value.passportNumber
      );

      if (this.addPatientForm.getRawValue().referralPartner) {
        formData.append(
          "referralPartner",
          this.addPatientForm.getRawValue().referralPartner
        );
        formData.append(
          "referralType",
          this.addPatientForm.getRawValue().referralType
        );
        formData.append(
          "referralPartnerName",
          this.addPatientForm.getRawValue().referralPartnerName
        );
      }
      formData.append(
        "medicalHistory",
        this.addPatientForm.value.medicalHistory
      );
      formData.append("remarks", this.addPatientForm.value.remarks);

      if (!this.patientData) {
        this.hospitalService.addPatient(formData).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
      } else {
        formData.append("report", JSON.stringify(this.report));
        this.hospitalService
          .editPatient(this.patientData?._id, formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.addPatientForm.controls).forEach((key) => {
        this.addPatientForm.controls[key].markAsTouched();
      });
    }
  }

  isEdit = false;
  onEdit(data) {
    this.isEdit = true;
    this.patientData = data;
    if (this.patientData.treatment == "") {
      this.patientData.treatment = null;
    }

    if (this.patientData?.referralType === "pre") {
      this.addPatientForm.get("referralPartner").disable();
    }

    this.addPatientForm.patchValue({
      name: this.patientData.name,
      gender: this.patientData.gender,
      country: this.patientData.country,
      treatment: this.patientData.treatment,
      age: this.patientData.age,
      ageDuration: this.patientData.ageDuration,
      contact: this.patientData.contact,
      emailId: this.patientData.emailId,
      passportNumber: this.patientData.passportNumber,
      referralPartner: this.patientData?.referralPartner,
      medicalHistory: this.patientData.medicalHistory,
      remarks: this.patientData.remarks,
      receivedAt: this.patientData?.receivedAt,
      referralType: this.patientData?.referralType,
      referralPartnerName: this.patientData?.referralPartnerName,
    });

    this.report = this.patientData.report;
  }

  onChangeMode(event: any) {
    if (event.value === "normal") {
      this.buildForm({
        name: [this.addPatientForm.value.name, [Validators.required]],
        country: [this.addPatientForm.value.country, [Validators.required]],
        gender: [this.addPatientForm.value.gender, [Validators.required]],
        treatment: [this.addPatientForm.value.treatment, [Validators.required]],
        age: [this.addPatientForm.value.age, [Validators.required]],
        ageDuration: [
          this.addPatientForm.value.ageDuration,
          [Validators.required],
        ],
        contact: [
          this.addPatientForm.value.contact,
          [Validators.required, Validators.pattern(regexService.contactRegex)],
        ],
        emailId: [
          this.addPatientForm.value.emailId,
          [Validators.required, Validators.pattern(regexService.emailRegex)],
        ],
        passportNumber: [this.addPatientForm.value.passportNumber],
        referralPartner: [this.addPatientForm.getRawValue().referralPartner],
        medicalHistory: [
          this.addPatientForm.value.medicalHistory,
          [Validators.required],
        ],
        remarks: [this.addPatientForm.value.remarks],
        receivedAt: [this.addPatientForm.value.receivedAt],
        report: [],
        mode: ["normal", [Validators.required]],
        referralType: [this.addPatientForm.getRawValue().referralType],
        referralPartnerName: [
          this.addPatientForm.getRawValue().referralPartnerName,
        ],
      });
      if (this.isEdit) {
        if (this.addPatientForm.getRawValue().referralType === "pre") {
          this.addPatientForm.get("referralPartner").disable();
        }
      }
    } else if (event.value === "preIntimation") {
      this.buildForm({
        name: [this.addPatientForm.value.name, [Validators.required]],
        country: [this.addPatientForm.value.country, [Validators.required]],
        gender: [this.addPatientForm.value.gender, []],
        treatment: [this.addPatientForm.value.treatment, []],
        age: [this.addPatientForm.value.age, []],
        ageDuration: [this.addPatientForm.value.ageDuration, []],
        contact: [
          this.addPatientForm.value.contact,
          [Validators.pattern(regexService.contactRegex)],
        ],
        emailId: [
          this.addPatientForm.value.emailId,
          [Validators.pattern(regexService.emailRegex)],
        ],
        passportNumber: [this.addPatientForm.value.passportNumber],
        referralPartner: [this.addPatientForm.getRawValue().referralPartner],
        medicalHistory: [this.addPatientForm.value.medicalHistory, []],
        remarks: [this.addPatientForm.value.remarks],
        receivedAt: [this.addPatientForm.value.receivedAt],
        report: [],
        mode: ["preIntimation", [Validators.required]],
        referralType: [this.addPatientForm.getRawValue().referralType],
        referralPartnerName: [
          this.addPatientForm.getRawValue().referralPartnerName,
        ],
      });
      if (this.isEdit) {
        if (this.addPatientForm.getRawValue().referralType === "pre") {
          this.addPatientForm.get("referralPartner").disable();
        }
      }
    }
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
      medicalHistory,
      remarks,
      receivedAt,
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
      !!remarks ||
      !!referralPartnerName ||
      !!receivedAt ||
      !!referralType
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

  closeDialog(apiCall: boolean): void {
    if (!this.isEdit && !apiCall) {
      this.saveDraft();
    }
    this.dialogRef.close(apiCall);
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
}
