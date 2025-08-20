import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import * as moment from "moment";

@Component({
  selector: "shared-edit-vil",
  templateUrl: "./edit-vil.component.html",
  styleUrls: ["./edit-vil.component.scss"],
})
export class EditVilComponent implements OnInit {
  @Input() patientData: any;
  @Input() vilData: any;
  @Input() isPreviewer = false;
  @Input() comp: string;
  @Output("refetch") refetch: EventEmitter<any> = new EventEmitter();

  fileFirstList: any[] = [];
  fileSecondList: any[] = [];
  fileThirdList: any[] = [];
  fileFirstPreviewUrls: string[] = [];
  fileSecondPreviewUrls = [];
  fileThirdPreviewUrls = [];
  searchInputCountry = "";

  vilRequestForm: FormGroup;

  isLoadingTopHospital: boolean = true;
  topHospitalData = [];
  topHospitalDataForAggregator = [];
  allVilRequest = [];

  // hospital variables
  hospitalData = [];
  hospitalDataForAggregator = [];
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll: boolean = false;
  totalElementHospital: number;
  selectedHospitalSearch = [];
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };

  // aggregator variables
  aggregatorList: any = [];
  freshAggregatorList: any = [];
  timeoutAggregator = null;
  totalElementAggrigator: number;
  isAggregatorLoading: boolean = false;
  selectedAggregatorSearch = [];

  // embasy variable
  isLoadingEmbasy: boolean = false;
  embasyData = [{ name: "Other" }];
  embassyFreshData = [];
  timeoutEmbassy = null;
  selectedEmbasy = {};

  emailData: any;
  isCheckEmailClicked: boolean = false;

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

  genderData = ["male", "female"];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {}
  createForm() {
    this.vilRequestForm = this.fb.group({
      patientName: [this.patientData?.name, [Validators.required]],
      givenName: [""],
      surName: [""],
      gender: [""],
      dob: [""],
      country: [this.patientData?.country || null],
      addressInIndia: [""],
      contactInIndia: [""],
      emailId: [
        this.patientData?.emailId,
        [Validators.pattern(regexService.emailRegex)],
      ],
      contact: [
        this.patientData?.contact,
        [Validators.pattern(regexService.contactRegex)],
      ],
      address: [this.patientData?.address],
      // verifyAddress: [false],
      treatment: [null],
      department: [null],
      passportNumber: [this.patientData?.passportNumber, [Validators.required]],
      patient: [this.patientData?._id],
      vilRequest: [[], [Validators.required]],
      vilId: ["", [Validators.required]],
      doctorName: [""],
      attendantDetails: this.fb.array([]),
      donorDetails: this.fb.array([]),
      embasy: [""],
      appointmentDate: [""],
      fileFirst: [],
      fileSecond: [""],
      fileThird: [""],
      receivedAt: [""],
      embassyForm: this.fb.group({
        name: [""],
        addressLetterTo1: [""],
        addressLetterTo2: [""],
        addressLine1: [""],
        addressLine2: [""],
        addressLine3: [""],
        emailTo1: ["", [Validators.pattern(regexService.emailRegex)]],
        emailTo2: ["", [Validators.pattern(regexService.emailRegex)]],
        emailCc1: ["", [Validators.pattern(regexService.emailRegex)]],
        emailCc2: ["", [Validators.pattern(regexService.emailRegex)]],
      }),
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.getCountryData();
    this.getEmbassyByCountry(this.patientData?.country);
    this.getTreatmentData();
    this.patchIfEdit();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes?.isPreviewer?.currentValue === true) {
  //     this.patchIfEdit();
  //   }
  // }

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

  getTreatmentData() {
    if (this.isLoadingTreatment) {
      return;
    }
    this.isLoadingTreatment = true;

    this.sharedService
      .getCmsData("getAllTreatment", this.treatmentParams)
      .subscribe((res: any) => {
        this.treatmentData.push(...res.data.content);
        let findItem = this.treatmentData.find(
          (td: any) => td?.name === this.patientData?.treatment
        );

        if (findItem) {
          this.departmentArray = findItem?.department;
          this.freshDepartmentArray = findItem?.department;

          this.vilRequestForm.patchValue({
            treatment: findItem?.name,
            department: findItem?.department[0]?.name,
          });
        }

        this.totalElementTreatment = res.data.totalElement;
        // this.treatmentParams.page = this.treatmentParams.page + 1;
        this.isLoadingTreatment = false;
      });
  }
  onInfiniteScrollTreatment(): void {
    // if (this.treatmentData.length < this.totalElementTreatment) {
    //   this.getTreatmentData();
    // }
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

  onClickTreatment(item: any) {
    let name = item?.name;
    this.departmentArray = item?.department;
    this.freshDepartmentArray = item?.department;

    let departmentName = item?.department[0]?.name;
    this.vilRequestForm.patchValue({
      treatment: name,
      department: departmentName,
    });
  }

  departmentArray: any = [];
  freshDepartmentArray: any = [];
  timeoutDepartment = null;
  searchDepartment(filterValue: string) {
    clearTimeout(this.timeoutDepartment);
    this.timeoutDepartment = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshDepartmentArray);
        this.departmentArray = [];
        let filterData = filterArray.filter((f: any) =>
          f?.code?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.departmentArray = filterArray;
      } else {
        this.departmentArray = this.freshDepartmentArray;
      }
    }, 600);
  }

  attendantImageArray = [];
  donorImageArray = [];
  patchIfEdit() {
    let vilRequest: FormArray = this.fb.array([
      this.fb.group({
        hospitalId: this.vilData?.hospitalId,
        hospitalName: this.vilData?.hospitalName,
      }),
    ]);

    if (this.vilData?.donorDetails?.length) {
      this.patchDonorForm(this.vilData.donorDetails);
    }
    if (this.vilData?.attendantDetails?.length) {
      this.patchAttendantForm(this.vilData.attendantDetails);
    }

    this.attendantImageArray = cloneDeep(this.vilData.attendantPassport);
    this.donorImageArray = cloneDeep(this.vilData.donorPassport);

    let newDob: any = "";
    if (
      !!this.patientData?.dob
    ) {
      newDob = moment(this.patientData?.dob);
    }
    this.vilRequestForm.patchValue({
      vilRequest: vilRequest.value,
      vilId: this.vilData?.vilId,
      patientName: this.patientData?.name,
      passportNumber: this.patientData?.passportNumber,
      patient: this.patientData?._id,
      hospitalName: this.vilData.hospitalName,
      hospitalId: this.vilData.hospitalId,
      doctorName: this.vilData.doctorName,
      appointmentDate: this.vilData.appointmentDate,
      fileFirst: this.vilData.patientPassport,
      fileSecond: this.vilData.attendantPassport,
      fileThird: this.vilData.donorPassport,
      receivedAt: this.vilData.receivedAt,

      emailId: this.patientData?.emailId,
      contact: this.patientData?.contact,
      address: this.patientData?.address,
      // verifyAddress: this.patientData?.verifyAddress,
      treatment: this.patientData?.treatment,
      department: this.patientData?.department,

      givenName: this.patientData?.givenName,
      surName: this.patientData?.surName,
      gender: this.patientData?.gender,
      dob: newDob ? newDob?.toDate() : "",
      addressInIndia: this.patientData?.addressInIndia,
      contactInIndia: this.patientData?.contactInIndia,
      country: this.patientData?.country,
    });

    this.vilRequestForm.get("embassyForm").patchValue(this.vilData?.embassy);
  }

  patchAttendantForm(attendantData: any) {
    attendantData.forEach((data: any) => {
        let newDob:any
        if(!!data?.dob){
          newDob = moment(data?.dob);
        }
      let obj: FormGroup = this.fb.group({
        name: [data.name, [Validators.required]],
        passportNumber: [data.passportNumber, [Validators.required]],
        country: [data.country, [Validators.required]],
        address: [data.address],
        emailId: [data.emailId],
        contact: [data.contact],
        relationshipWithPatient: [data?.relationshipWithPatient],
        // verifyAddress: [data?.verifyAddress],
        givenName: [data?.givenName],
        surName: [data?.surName],
        gender: [data?.gender],
        dob: [newDob ? newDob?.toDate() : ""],
      });
      this.attendantArray.push(obj);
    });
  }

  patchDonorForm(donorData: any) {
    donorData.forEach((data: any) => {
        let newDob:any
        if(!!data?.dob){
          newDob = moment(data?.dob);
        }
      let obj: FormGroup = this.fb.group({
        name: [data.name, [Validators.required]],
        passportNumber: [data.passportNumber, [Validators.required]],
        country: [data.country, [Validators.required]],
        address: [data.address],
        emailId: [data.emailId],
        contact: [data.contact],
        relationshipWithPatient: [data?.relationshipWithPatient],
        // verifyAddress: [data?.verifyAddress],
        givenName: [data?.givenName],
        surName: [data?.surName],
        gender: [data?.gender],
        dob: [newDob ? newDob?.toDate() : ""],
      });
      this.donorArray.push(obj);
    });
  }

  getVilRecipients() {
    if (this.vilRequestForm.valid) {
      let values = {
        vilRequest: [
          {
            hospitalId: this.vilRequestForm?.get("hospitalId")?.value,
            hospitalName: this.vilRequestForm?.get("hospitalName")?.value,
          },
        ],
        patient: this.vilRequestForm?.get("patient")?.value,
      };
      this.hospitalService.getVilRecipients(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.isCheckEmailClicked = true;
        this.emailData = res?.data;
      });
    } else {
      this.vilRequestForm.markAllAsTouched();
    }
  }

  filterHospitalByRequest(hospitalData: any) {
    this.hospitalData = [];
    let resData = hospitalData;
    this.allVilRequest?.forEach((data: any) => {
      let index = resData?.findIndex((rd: any) => rd?._id === data?.hospitalId);
      if (index !== -1) {
        resData.splice(index, 1);
      }
    });
    this.hospitalData.push(...resData);
  }

  getEmbassyByCountry(countryName) {
    this.isLoadingEmbasy = true;

    this.sharedService
      .getCmsData(`getEmbassyByCountry/${countryName}`, {})
      .subscribe((res: any) => {
        this.embasyData.push(...res?.data);
        this.embassyFreshData = this.embasyData;
        this.isLoadingEmbasy = false;
      });
  }

  searchEmbassy(filterValue: string) {
    clearTimeout(this.timeoutEmbassy);
    this.timeoutEmbassy = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.embassyFreshData);
        this.embasyData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.embasyData = filterArray;
      } else {
        this.embasyData = this.embassyFreshData;
      }
    }, 600);
  }

  onClickEmbasy(item: any) {
    if (item?.name !== "Other") {
      this.vilRequestForm.get("embassyForm").patchValue({
        name: item?.name,
        addressLetterTo1: item?.addressLetterTo1,
        addressLetterTo2: item?.addressLetterTo2,
        addressLine1: item?.addressLine1,
        addressLine2: item?.addressLine2,
        addressLine3: item?.addressLine3,
        emailTo1: item?.emailTo1,
        emailTo2: item?.emailTo2,
        emailCc1: item?.emailCc1,
        emailCc2: item?.emailCc2,
      });
    } else {
      this.vilRequestForm.get("embassyForm").reset();
    }
  }

  createAttendantArrayForm() {
    return this.fb.group({
      name: ["", [Validators.required]],
      passportNumber: ["", [Validators.required]],
      country: [null, [Validators.required]],
      files: [[]],
      address: [""],
      emailId: ["", [Validators.pattern(regexService.emailRegex)]],
      contact: ["", [Validators.pattern(regexService.contactRegex)]],
      relationshipWithPatient: [""],
      // verifyAddress: [false],
      givenName: [""],
      surName: [""],
      gender: [""],
      dob: [""],
    });
  }
  createDonorArrayForm() {
    return this.fb.group({
      name: ["", [Validators.required]],
      passportNumber: ["", [Validators.required]],
      country: [null, [Validators.required]],
      files: [[]],
      address: [""],
      emailId: ["", [Validators.pattern(regexService.emailRegex)]],
      contact: ["", [Validators.pattern(regexService.contactRegex)]],
      relationshipWithPatient: [""],
      // verifyAddress: [false],
      givenName: [""],
      surName: [""],
      gender: [""],
      dob: [""],
    });
  }

  get donorArray(): FormArray {
    return this.vilRequestForm.get("donorDetails") as FormArray;
  }
  get attendantArray(): FormArray {
    return this.vilRequestForm.get("attendantDetails") as FormArray;
  }

  addDonor() {
    this.donorArray.push(this.createDonorArrayForm());
  }

  deleteDonor(i: number) {
    this.donorArray.removeAt(i);
  }

  addAttendant() {
    this.attendantArray.push(this.createAttendantArrayForm());
  }

  deleteAttendant(i: number) {
    this.attendantArray.removeAt(i);
  }

  aggregatorRequestList = [];

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  // onFileSelected(e: any, fileName: string, arrayIndex: number = null) {
  //   Array.from(e.target.files).forEach((file: any) => {
  //     if (file.type === "application/pdf") {
  //       const fileUrl = URL.createObjectURL(file);
  //       if (fileName === "fileFirst") {
  //         this.fileFirstPreviewUrls.push(fileUrl);
  //       }
  //       if (fileName === "fileSecond") {
  //         let array = this.fileSecondPreviewUrls[arrayIndex] || [];
  //         array.push(fileUrl);
  //         this.fileSecondPreviewUrls[arrayIndex] = array;
  //       }
  //       if (fileName === "receivedAt") {
  //         let array = this.fileThirdPreviewUrls[arrayIndex] || [];
  //         array.push(fileUrl);
  //         this.fileThirdPreviewUrls[arrayIndex] = array;
  //       }
  //       file["url"] = fileUrl;
  //     } else {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         if (fileName === "fileFirst") {
  //           this.fileFirstPreviewUrls.push(reader.result as string);
  //         }
  //         if (fileName === "fileSecond") {
  //           let array = this.fileSecondPreviewUrls[arrayIndex] || [];
  //           array.push(reader.result as string);
  //           this.fileSecondPreviewUrls[arrayIndex] = array;
  //         }
  //         if (fileName === "fileThird") {
  //           let array = this.fileThirdPreviewUrls[arrayIndex] || [];
  //           array.push(reader.result as string);
  //           this.fileThirdPreviewUrls[arrayIndex] = array;
  //         }
  //         file["url"] = reader.result as string;
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //     if (fileName === "fileFirst") {
  //       this.fileFirstList.push(file);
  //     }
  //     if (fileName === "fileSecond") {
  //       let array = this.fileSecondList[arrayIndex] || [];
  //       array.push(file);
  //       this.fileSecondList[arrayIndex] = array;
  //     }
  //     if (fileName === "fileThird") {
  //       let array = this.fileThirdList[arrayIndex] || [];
  //       array.push(file);
  //       this.fileThirdList[arrayIndex] = array;
  //     }
  //   });
  // }

  // onDelete(fileName: string, mainIndex = 0, index: number) {
  //   if (fileName === "fileFirst") {
  //     if (index !== -1) {
  //       this.fileFirstList.splice(index, 1);
  //       this.fileFirstPreviewUrls.splice(index, 1);
  //     }
  //   }
  //   if (fileName === "fileSecond") {
  //     if (index !== -1) {
  //       this.fileSecondList[mainIndex].splice(index, 1);
  //       this.fileSecondPreviewUrls[mainIndex].splice(index, 1);
  //       if (!this.fileSecondList[mainIndex]?.length) {
  //         this.attendantArray?.get(`${mainIndex}`).patchValue({
  //           files: [],
  //         });
  //       }
  //     }
  //   }
  //   if (fileName === "fileThird") {
  //     if (index !== -1) {
  //       this.fileThirdList[mainIndex].splice(index, 1);
  //       this.fileThirdPreviewUrls[mainIndex].splice(index, 1);
  //       if (!this.fileThirdList[mainIndex]?.length) {
  //         this.donorArray?.get(`${mainIndex}`).patchValue({
  //           files: [],
  //         });
  //       }
  //     }
  //   }
  // }

  onFileSelected(e: any, fileName: string, arrayIndex: number = null) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        if (fileName === "fileFirst") {
          // this.fileFirstPreviewUrls.push(fileUrl);
          this.fileFirstPreviewUrls = [fileUrl];
        }
        if (fileName === "fileSecond") {
          let array = this.fileSecondPreviewUrls[arrayIndex] || [];
          // array.push(fileUrl);
          array = [fileUrl];
          this.fileSecondPreviewUrls[arrayIndex] = array;
        }
        if (fileName === "fileThird") {
          let array = this.fileThirdPreviewUrls[arrayIndex] || [];
          // array.push(fileUrl);
          array = [fileUrl];
          this.fileThirdPreviewUrls[arrayIndex] = array;
        }
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (fileName === "fileFirst") {
            // this.fileFirstPreviewUrls.push(reader.result as string);
            this.fileFirstPreviewUrls = [reader.result as string];
          }
          if (fileName === "fileSecond") {
            let array = this.fileSecondPreviewUrls[arrayIndex] || [];
            // array.push(reader.result as string);
            array = [reader.result as string];
            this.fileSecondPreviewUrls[arrayIndex] = array;
          }
          if (fileName === "fileThird") {
            let array = this.fileThirdPreviewUrls[arrayIndex] || [];
            // array.push(reader.result as string);
            array = [reader.result as string];
            this.fileThirdPreviewUrls[arrayIndex] = array;
          }
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      if (fileName === "fileFirst") {
        // this.fileFirstList.push(file);
        this.fileFirstList = [file];
      }
      if (fileName === "fileSecond") {
        let array = this.fileSecondList[arrayIndex] || [];
        // array.push(file);
        array = [file];
        this.fileSecondList[arrayIndex] = array;
      }
      if (fileName === "fileThird") {
        let array = this.fileThirdList[arrayIndex] || [];
        // array.push(file);
        array = [file];
        this.fileThirdList[arrayIndex] = array;
      }
    });
  }

  onDelete(fileName: string, mainIndex = 0, index: number) {
    if (fileName === "fileFirst") {
      // if (index !== -1) {
      //   this.fileFirstList.splice(index, 1);
      //   this.fileFirstPreviewUrls.splice(index, 1);
      // }
      this.fileFirstList = [];
      this.fileFirstPreviewUrls = [];
    }
    if (fileName === "fileSecond") {
      // if (index !== -1) {
      //   this.fileSecondList[mainIndex].splice(index, 1);
      //   this.fileSecondPreviewUrls[mainIndex].splice(index, 1);
      //   if (!this.fileSecondList[mainIndex]?.length) {
      //     this.attendantArray?.get(`${mainIndex}`).patchValue({
      //       files: [],
      //     });
      //   }
      // }
      this.fileSecondList[mainIndex] = [];
      this.fileSecondPreviewUrls[mainIndex] = [];
    }
    if (fileName === "fileThird") {
      // if (index !== -1) {
      //   this.fileThirdList[mainIndex].splice(index, 1);
      //   this.fileThirdPreviewUrls[mainIndex].splice(index, 1);
      //   if (!this.fileThirdList[mainIndex]?.length) {
      //     this.donorArray?.get(`${mainIndex}`).patchValue({
      //       files: [],
      //     });
      //   }
      // }
      this.fileSecondList[mainIndex] = [];
      this.fileSecondPreviewUrls[mainIndex] = [];
    }
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
      this.searchInputCountry = filterValue.trim();
      this.getCountryData();
    }, 600);
  }

  onSubmit() {
    if (this.vilRequestForm.valid) {
      let formData = new FormData();
      let values = this.vilRequestForm.value;
      let payload = {
        patientName: values?.patientName,
        passportNumber: values?.passportNumber,
        patient: this.patientData?._id,
        doctorName: values?.doctorName,
        appointmentDate: values?.appointmentDate,
        vilId: values?.vilId,
        receivedAt: values?.receivedAt,
        emailId: values?.emailId,
        contact: values?.contact,
        treatment: values?.treatment,
        department: values?.department,
        address: values?.address,
        // verifyAddress: values?.verifyAddress,
        givenName: values?.givenName,
        surName: values?.surName,
        gender: values?.gender,
        dob: values?.dob,
        addressInIndia: values?.addressInIndia,
        contactInIndia: values?.contactInIndia,
        country: values?.country,
      };

      for (const key in payload) {
        formData.append(key, payload[key]);
      }
      // for (var i = 0; i < values?.fileFirst?.length; i++) {
      formData.append("patientPassport", JSON.stringify(values?.fileFirst));
      // }

      // for (var i = 0; i < values?.fileSecond?.length; i++) {
      formData.append("attendantPassport", JSON.stringify(values?.fileSecond));
      // }
      // for (var i = 0; i < values?.fileThird?.length; i++) {
      formData.append("donorPassport", JSON.stringify(values?.fileThird));
      // }
      formData.append("vilRequest", JSON.stringify(values?.vilRequest));
      formData.append("embassy", JSON.stringify(values?.embassyForm));
      let donorDetails = values?.donorDetails;

      formData.append("donorDetails", JSON.stringify(donorDetails));

      let attendantDetails = values?.attendantDetails;
      formData.append("attendantDetails", JSON.stringify(attendantDetails));

      this.hospitalService.editVilRequest(formData).subscribe((res: any) => {
        this.refetch.emit();
        this.sharedService.showNotification("snackBar-success", res.message);
      });
    } else {
      this.vilRequestForm.markAllAsTouched();
    }
  }

  deleteDonorImage(i: number) {
    if (this.donorImageArray?.length > 0) {
      // if (i !== -1) {
      //   this.donorImageArray?.splice(i, 1);
      //   this.vilRequestForm.patchValue({
      //     fileThird: this.donorImageArray,
      //   });
      // }
      this.vilRequestForm.patchValue({
        fileThird: [],
      });
    }
  }

  deleteAttendantImage(i: number) {
    if (this.attendantImageArray?.length > 0) {
      // if (i !== -1) {
      //   this.attendantImageArray?.splice(i, 1);
      //   this.vilRequestForm.patchValue({
      //     fileSecond: this.attendantImageArray,
      //   });
      // }
      this.vilRequestForm.patchValue({
        fileSecond: [],
      });
    }
  }
}
