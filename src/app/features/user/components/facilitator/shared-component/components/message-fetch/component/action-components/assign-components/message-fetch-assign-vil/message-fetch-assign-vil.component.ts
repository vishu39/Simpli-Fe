import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import {
  GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ,
  GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING,
} from "src/app/shared/util";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-message-fetch-assign-vil",
  templateUrl: "./message-fetch-assign-vil.component.html",
  styleUrls: ["./message-fetch-assign-vil.component.scss"],
})
export class MessageFetchAssignVilComponent implements OnInit {
  @Input() messageData: any;
  @Input() emailFetchData: any;

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

  checkContactData: any;
  isCheckEmailClicked: boolean = false;

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

  genderData = ["male", "female"];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private cd: ChangeDetectorRef
  ) {}
  createForm() {
    this.vilRequestForm = this.fb.group({
      patientName: ["", [Validators.required]],
      givenName: [""],
      surName: [""],
      gender: [""],
      dob: [""],
      country: [null],
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
      treatment: [null],
      department: [null],
      // verifyAddress: [false],
      passportNumber: ["", [Validators.required]],
      patient: [this.emailFetchData?._id],
      hospitalName: [, [Validators.required]],
      hospitalId: ["", [Validators.required]],
      doctorName: [""],
      attendantDetails: this.fb.array([]),
      donorDetails: this.fb.array([]),
      aggregator: [""],
      embasy: [""],
      appointmentDate: [""],
      fileFirst: [],
      fileSecond: [""],
      fileThird: [""],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
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
    this.messageData.attachments = cloneDeep(this.messageData?.mainAttachments);
    this.getPatientById();
    this.createForm();
    this.getAllAggregator();
    this.getVilDataByMessageFetch();
    this.getAllVilRequest();
    this.getCountryData();

    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    let receivedAtDate = moment(this.messageData?.messageData[0]?.timestamp);
    this.vilRequestForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });
  }

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
            // treatment: findItem?.name,
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

  vilDataFromAi: any;
  vilObjFromAi: any;
  isAiLoading = true;
  getVilDataByMessageFetch() {
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
      .getVilDataByMessageFetch({ message: bodyArray })
      .subscribe(
        (res: any) => {
          this.vilDataFromAi = res?.data;
          if (this.messageData?.attachments?.length > 0) {
            this.messageData?.attachments?.map((file: any) => {
              file["url"] = file?.signedUrl;
              file["type"] = file?.mimetype;
              file["name"] = file?.originalname;
            });
          }
          this.vilObjFromAi = this.vilDataFromAi?.vilData;
          this.isAiLoading = false;
          this.fetchVilDataFromAi(this.vilObjFromAi);
        },
        () => {
          this.isAiLoading = false;
        }
      );
  }

  fetchVilDataFromAi(vd: any) {
    let newData = cloneDeep(vd);

    if (!!vd?.embassy) {
      let embassyForm = this.vilRequestForm.get("embassyForm") as FormGroup;

      let embassyDataFromSimilarity = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
        vd?.embassy?.name,
        this.embasyData,
        "embassy"
      );

      if (!!embassyDataFromSimilarity?.name) {
        this.vilRequestForm.patchValue({
          embasy: embassyDataFromSimilarity?.name,
        });

        embassyForm.patchValue({
          ...embassyDataFromSimilarity,
        });
      } else {
        this.vilRequestForm.patchValue({
          embasy: "Other",
        });

        embassyForm.patchValue({
          ...newData?.embassy,
        });

        delete newData["embassy"];
      }
    }

    if (vd?.attendantDetails?.length > 0) {
      vd?.attendantDetails?.forEach((t: any) => {
        let attendantFormGroup = this.createAttendantArrayForm();
        let newDob:any
        if(!!t?.dob){
          newDob = moment(t?.dob);
        }
        attendantFormGroup.patchValue({
          name: t?.name,
          passportNumber: t?.passportNumber,
          country: t?.country,
          files: null,
          address: t?.address,
          emailId: t?.emailId,
          contact: t?.contact,
          relationshipWithPatient: t?.relationshipWithPatient,
          givenName: t?.givenName,
          surName: t?.surName,
          gender: t?.gender,
          dob: newDob ? newDob?.toDate() : "",
          // verifyAddress: t?.verifyAddress,
        });
        this.attendantArray.push(attendantFormGroup);
      });
      delete newData["attendantDetails"];
    }

    if (vd?.donorDetails?.length > 0) {
      vd?.donorDetails?.forEach((t: any) => {
        let formGroup = this.createDonorArrayForm();
        let newDob:any
        if(!!t?.dob){
          newDob = moment(t?.dob);
        }
        formGroup.patchValue({
          name: t?.name,
          passportNumber: t?.passportNumber,
          country: t?.country,
          files: null,
          address: t?.address,
          emailId: t?.emailId,
          contact: t?.contact,
          relationshipWithPatient: t?.relationshipWithPatient,
          givenName: t?.givenName,
          surName: t?.surName,
          gender: t?.gender,
          dob: newDob ? newDob?.toDate() : "",
          // verifyAddress: t?.verifyAddress,
        });
        this.donorArray.push(formGroup);
      });
      delete newData["donorDetails"];
    }

    let dateAppointment = new Date(newData?.appointmentDate);
    let momentAppointmentObj = moment(dateAppointment);

    // let receivedAtDate = moment(this.emailFetchData?.date);

    this.vilRequestForm.patchValue({
      doctorName: newData?.doctorName,
      appointmentDate: momentAppointmentObj.toISOString() || "",
      // receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
      passportNumber: !!this.patientData?.passportNumber
        ? this.patientData?.passportNumber
        : newData?.passportNumber || "",
    });
  }

  patientData: any;
  getPatientById() {
    this.facilitatorService
      .getPatient(this.emailFetchData?._id)
      .subscribe((res: any) => {
        this.patientData = res?.data;
        let newDob: any = "";
        if (
          !!this.patientData?.dob
        ) {
          newDob = moment(this.patientData?.dob);
        }
        this.vilRequestForm.patchValue({
          patientName: this.patientData?.name,
          treatment: this.patientData?.treatment,
          country: this.patientData?.country,
          contact: this.patientData?.contact,
          emailId: this.patientData?.emailId,
          address: this.patientData?.address,
          // verifyAddress: this.patientData?.verifyAddress,
          gender: this.patientData?.gender,
          addressInIndia: this.patientData?.addressInIndia,
          contactInIndia: this.patientData?.contactInIndia,
          givenName: this.patientData?.givenName,
          surName: this.patientData?.surName,
          // department: this.patientData?.department,
          dob: newDob ? newDob?.toDate() : "",
        });

        this.getTreatmentData();
        this.getEmbassyByCountry(this.patientData?.country);
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
      this.facilitatorService.getVilRecipients(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.isCheckEmailClicked = true;
        this.checkContactData = res?.data;
      });
    } else {
      this.vilRequestForm.markAllAsTouched();
    }
  }

  getAllVilRequest() {
    this.facilitatorService
      .getAllVilRequest(this.emailFetchData?._id)
      .subscribe((res: any) => {
        this.allVilRequest = res?.data;
        this.getAllHospital();
        this.getTopHospital();
      });
  }

  filterTopHospitalByRequest(topHospitalData: any) {
    if (this.allVilRequest?.length) {
      let resData = topHospitalData;
      this.allVilRequest?.forEach((data: any) => {
        let index = resData?.findIndex(
          (rd: any) => rd?._id === data?.hospitalId
        );
        if (index !== -1) {
          resData.splice(index, 1);
        }
      });
      this.topHospitalData = resData;
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
    let indexArray = this.fileThirdList[i];
    if (indexArray?.length > 0) {
      indexArray?.forEach((ia: any) => {
        this.messageData?.attachments.push(ia);
      });
      this.fileThirdList.splice(i, 1);
    }

    this.donorArray.removeAt(i);
  }

  addAttendant() {
    this.attendantArray.push(this.createAttendantArrayForm());
  }

  deleteAttendant(i: number) {
    let indexArray = this.fileSecondList[i];
    if (indexArray?.length > 0) {
      indexArray?.forEach((ia: any) => {
        this.messageData?.attachments.push(ia);
      });
      this.fileSecondList.splice(i, 1);
    }

    this.attendantArray.removeAt(i);
  }

  topHospitalChange(item: any) {
    this.vilRequestForm.patchValue({
      hospitalName: item?.name,
      hospitalId: item?._id,
    });
  }

  freshTopHospital = [];
  getTopHospital() {
    this.facilitatorService.getTopHospital().subscribe((res: any) => {
      this.isLoadingTopHospital = true;
      this.topHospitalDataForAggregator.push(...res?.data?.hospital);
      this.freshTopHospital.push(...res?.data?.hospital);
      if (this.allVilRequest?.length) {
        this.filterTopHospitalByRequest(res?.data?.hospital);
        this.isLoadingTopHospital = false;
      } else {
        this.topHospitalData.push(...res?.data?.hospital);
        this.isLoadingTopHospital = false;
      }
    });
  }

  aggregatorRequestList = [];
  freshHospitalData = [];
  getAllHospital() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        this.freshHospitalData.push(...res?.data?.content);
        this.hospitalDataForAggregator.push(...res?.data?.content);
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;
        // for hospital
        if (
          this.allVilRequest?.length &&
          !this.aggregatorRequestList?.length &&
          !this.vilRequestForm.get("aggregator").value
        ) {
          this.filterHospitalByRequest(this.hospitalData);
        }
        if (
          this.aggregatorRequestList?.length ||
          !!this.vilRequestForm.get("aggregator").value
        ) {
          this.filterAggregator(this.aggregatorRequestList);
        }
        this.isLoadingHospital = false;
      });
  }
  onInfiniteScrollHospital(): void {
    if (this.freshHospitalData.length < this.totalElementHospital) {
      this.getAllHospital();
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 20;
      this.hospitalData = []; // Clear existing data when searching
      this.freshHospitalData = []; // Clear existing data when searching
      this.hospitalDataForAggregator = []; // Clear existing data when searching
      this.isLoadingHospital = false;
      this.getAllHospital();
    }, 600);
  }

  onClickHospital(item: any) {
    this.vilRequestForm.patchValue({
      hospitalName: item?.name,
      hospitalId: item?._id,
    });
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  onFileSelected(e: any, fileName: string, arrayIndex: number = null) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        if (fileName === "fileFirst") {
          this.fileFirstPreviewUrls.push(fileUrl);
        }
        if (fileName === "fileSecond") {
          let array = this.fileSecondPreviewUrls[arrayIndex] || [];
          array.push(fileUrl);
          this.fileSecondPreviewUrls[arrayIndex] = array;
        }
        if (fileName === "fileThird") {
          let array = this.fileThirdPreviewUrls[arrayIndex] || [];
          array.push(fileUrl);
          this.fileThirdPreviewUrls[arrayIndex] = array;
        }
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (fileName === "fileFirst") {
            this.fileFirstPreviewUrls.push(reader.result as string);
          }
          if (fileName === "fileSecond") {
            let array = this.fileSecondPreviewUrls[arrayIndex] || [];
            array.push(reader.result as string);
            this.fileSecondPreviewUrls[arrayIndex] = array;
          }
          if (fileName === "fileThird") {
            let array = this.fileThirdPreviewUrls[arrayIndex] || [];
            array.push(reader.result as string);
            this.fileThirdPreviewUrls[arrayIndex] = array;
          }
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      if (fileName === "fileFirst") {
        this.fileFirstList.push(file);
      }
      if (fileName === "fileSecond") {
        let array = this.fileSecondList[arrayIndex] || [];
        array.push(file);
        this.fileSecondList[arrayIndex] = array;
      }
      if (fileName === "fileThird") {
        let array = this.fileThirdList[arrayIndex] || [];
        array.push(file);
        this.fileThirdList[arrayIndex] = array;
      }
    });
  }

  onDelete(fileName: string, mainIndex = 0, index: number) {
    if (fileName === "fileFirst") {
      if (index !== -1) {
        if (!!this.fileFirstList[index]?.signedUrl) {
          this.messageData?.attachments.push(this.fileFirstList?.[index]);
        }
        this.fileFirstList.splice(index, 1);
        this.fileFirstPreviewUrls.splice(index, 1);
      }
    }
    if (fileName === "fileSecond") {
      if (index !== -1) {
        if (!!this.fileSecondList?.[mainIndex]?.[index]?.signedUrl) {
          this.messageData?.attachments.push(
            this.fileSecondList?.[mainIndex]?.[index]
          );
        }
        this.fileSecondList[mainIndex].splice(index, 1);
        this.fileSecondPreviewUrls[mainIndex].splice(index, 1);
        if (!this.fileSecondList[mainIndex]?.length) {
          this.attendantArray?.get(`${mainIndex}`).patchValue({
            files: [],
          });
        }
      }
    }
    if (fileName === "fileThird") {
      if (index !== -1) {
        if (!!this.fileThirdList?.[mainIndex]?.[index]?.signedUrl) {
          this.messageData?.attachments.push(
            this.fileThirdList?.[mainIndex]?.[index]
          );
        }
        this.fileThirdList[mainIndex].splice(index, 1);
        this.fileThirdPreviewUrls[mainIndex].splice(index, 1);
        if (!this.fileThirdList[mainIndex]?.length) {
          this.donorArray?.get(`${mainIndex}`).patchValue({
            files: [],
          });
        }
      }
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

  patchDraft() {
    let vilRequestDraftData: any = JSON.parse(
      localStorage.getItem(`${this.emailFetchData?._id}vilRequestDraft`)
    );

    if (!!vilRequestDraftData) {
      let newData = cloneDeep(vilRequestDraftData);

      if (!!vilRequestDraftData?.embasy) {
        let embassyForm = this.vilRequestForm.get("embassyForm") as FormGroup;
        embassyForm.patchValue({
          ...newData?.embassyForm,
        });
        delete newData["embassyForm"];
      }

      if (vilRequestDraftData?.attendantDetails?.length > 0) {
        vilRequestDraftData?.attendantDetails?.forEach((t: any) => {
          let formObj: FormGroup = this.createAttendantArrayForm();

          formObj.patchValue({
            name: t?.name,
            passportNumber: t?.passportNumber,
            country: t?.country,
            files: [[]],
            address: t?.address,
            emailId: t?.emailId,
            contact: t?.contact,
            relationshipWithPatient: t?.relationshipWithPatient,
            verifyAddress: t?.verifyAddress,
          });
          this.attendantArray.push(formObj);
        });
        delete newData["attendantDetails"];
      }

      if (vilRequestDraftData?.donorDetails?.length > 0) {
        vilRequestDraftData?.donorDetails?.forEach((t: any) => {
          let formObj: FormGroup = this.createDonorArrayForm();

          formObj.patchValue({
            name: t?.name,
            passportNumber: t?.passportNumber,
            country: t?.country,
            files: [[]],
            address: t?.address,
            emailId: t?.emailId,
            contact: t?.contact,
            relationshipWithPatient: t?.relationshipWithPatient,
            verifyAddress: t?.verifyAddress,
          });
          this.donorArray.push(formObj);
        });
        delete newData["donorDetails"];
      }

      if (
        !!vilRequestDraftData?.hospitalName ||
        !!vilRequestDraftData?.hospitalId ||
        !!vilRequestDraftData?.doctorName ||
        !!vilRequestDraftData?.embasy ||
        !!vilRequestDraftData?.appointmentDate ||
        !!vilRequestDraftData?.receivedAt ||
        !!vilRequestDraftData?.aggregator
        // !!vilRequestDraftData?.address ||
        // !!vilRequestDraftData?.verifyAddress ||
        // !!vilRequestDraftData?.contact ||
        // !!vilRequestDraftData?.emailId ||
        // !!vilRequestDraftData?.treatment ||
        // !!vilRequestDraftData?.department
      ) {
        this.vilRequestForm.patchValue({
          ...newData,
        });
      }
    }

    // localStorage.removeItem(`${this.emailFetchData?._id}vilRequestDraft`);
  }

  saveDraft() {
    let formValue = this.vilRequestForm?.getRawValue();

    let newAttendantDetails = cloneDeep(formValue?.attendantDetails);
    let newDonorDetails = cloneDeep(formValue?.donorDetails);

    if (
      !!formValue?.hospitalName ||
      !!formValue?.hospitalId ||
      !!formValue?.doctorName ||
      !!formValue?.embasy ||
      !!formValue?.appointmentDate ||
      !!formValue?.receivedAt ||
      !!formValue?.aggregator
      // !!formValue?.address ||
      // !!formValue?.verifyAddress ||
      // !!formValue?.contact ||
      // !!formValue?.emailId ||
      // !!formValue?.treatment ||
      // !!formValue?.department
    ) {
      let vilRequestDraftData = {
        hospitalName: formValue?.hospitalName,
        hospitalId: formValue?.hospitalId,
        doctorName: formValue?.doctorName,
        embasy: formValue?.embasy,
        appointmentDate: formValue?.appointmentDate,
        embassyForm: formValue?.embassyForm,
        aggregator: formValue?.aggregator,
        receivedAt: formValue?.receivedAt,
        // address: formValue?.address,
        // verifyAddress: formValue?.verifyAddress,
        // contact: formValue?.contact,
        // emailId: formValue?.emailId,
        // treatment: formValue?.treatment,
        // department: formValue?.department,
      };

      if (newAttendantDetails.length > 0) {
        newAttendantDetails?.map((data: any) => {
          delete data["files"];
        });
        vilRequestDraftData["attendantDetails"] = newAttendantDetails;
      }
      if (newDonorDetails.length > 0) {
        newDonorDetails?.map((data: any) => {
          delete data["files"];
        });
        vilRequestDraftData["donorDetails"] = newDonorDetails;
      }

      localStorage.setItem(
        `${this.emailFetchData?._id}vilRequestDraft`,
        JSON.stringify(vilRequestDraftData)
      );
    }
  }

  getAllAggregator(selectAll: boolean = false) {
    if (this.isAggregatorLoading) {
      return;
    }
    this.isAggregatorLoading = true;

    this.sharedService.getAllAggregator().subscribe((res: any) => {
      this.aggregatorList.push(...res.data);
      this.freshAggregatorList.push(...res.data);
      this.totalElementAggrigator = res.data.totalElement;
      this.isAggregatorLoading = false;
    });
  }

  searchAggregator(filterValue: string) {
    clearTimeout(this.timeoutAggregator);
    this.timeoutAggregator = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshAggregatorList);
        this.aggregatorList = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.aggregatorList = filterArray;
      } else {
        this.aggregatorList = this.freshAggregatorList;
      }
    }, 600);
  }

  onClickAggregator(item: any) {
    this.selectedHospitalSearch = [];
    this.vilRequestForm.patchValue({
      hospitalId: "",
      hospitalName: "",
    });
    this.getAllVilRequestByAggregator(item);
  }

  getAllVilRequestByAggregator(item: any) {
    let payload = {
      patient: this.patientData?._id,
      aggregator: item?._id,
    };
    this.facilitatorService
      .getAllVilRequestByAggregator(payload)
      .subscribe((res: any) => {
        this.aggregatorRequestList = res?.data;
        this.filterAggregator(res?.data);
      });
  }

  filterAggregator(data: any) {
    if (data?.length) {
      let hospitalData = cloneDeep(this.hospitalDataForAggregator);
      let topHospitalData = cloneDeep(this.topHospitalDataForAggregator);
      data?.forEach((data: any) => {
        let hospitalIndex = hospitalData?.findIndex(
          (rd: any) => rd?._id === data?.hospitalId
        );
        let topHospitalIndex = topHospitalData?.findIndex(
          (rd: any) => rd?._id === data?.hospitalId
        );
        if (hospitalIndex !== -1) {
          hospitalData.splice(hospitalIndex, 1);
        }
        if (topHospitalIndex !== -1) {
          topHospitalData.splice(topHospitalIndex, 1);
        }
      });
      this.hospitalData = hospitalData;
      this.topHospitalData = topHospitalData;
    } else {
      this.hospitalData = cloneDeep(this.hospitalDataForAggregator);
      this.topHospitalData = cloneDeep(this.topHospitalDataForAggregator);
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

  onFileDrop(event: CdkDragDrop<any>, arrayIndex: number) {
    let id = event?.container?.id;
    let droppedData = event?.item?.data;

    if (id === "fileFirst") {
      this.fileFirstList.push(droppedData);
      this.fileFirstPreviewUrls.push(droppedData?.signedUrl);
      this.vilRequestForm.patchValue({
        fileFirst: this.fileFirstList,
      });
      this.vilRequestForm.controls["fileFirst"].markAsDirty();
      this.vilRequestForm.controls["fileFirst"].markAsTouched();
      this.vilRequestForm.updateValueAndValidity();

      if (this.messageData?.attachments?.length > 0) {
        let findIndex = this.messageData?.attachments?.findIndex(
          (att: any) => att?.signedUrl === droppedData?.signedUrl
        );

        if (findIndex !== -1) {
          this.messageData?.attachments?.splice(findIndex, 1);
        }
      }
    }

    if (id?.includes("fileSecond")) {
      let array = this.fileSecondList[arrayIndex] || [];
      let arrayFilePreview = this.fileSecondPreviewUrls[arrayIndex] || [];
      array.push(droppedData);
      arrayFilePreview.push(droppedData?.signedUrl);
      this.fileSecondList[arrayIndex] = array;
      this.fileSecondPreviewUrls[arrayIndex] = arrayFilePreview;

      this.attendantArray?.get(`${arrayIndex}`).patchValue({
        files: this.fileSecondList[arrayIndex],
      });

      this.attendantArray.get(`${arrayIndex}`).markAsDirty();
      this.attendantArray.get(`${arrayIndex}`).markAsTouched();
      this.vilRequestForm.updateValueAndValidity();

      if (this.messageData?.attachments?.length > 0) {
        let findIndex = this.messageData?.attachments?.findIndex(
          (att: any) => att?.signedUrl === droppedData?.signedUrl
        );

        if (findIndex !== -1) {
          this.messageData?.attachments?.splice(findIndex, 1);
        }
      }
    }

    if (id?.includes("fileThird")) {
      let array = this.fileThirdList[arrayIndex] || [];
      let arrayFilePreview = this.fileThirdPreviewUrls[arrayIndex] || [];
      array.push(droppedData);
      arrayFilePreview.push(droppedData?.signedUrl);
      this.fileThirdList[arrayIndex] = array;
      this.fileThirdPreviewUrls[arrayIndex] = arrayFilePreview;

      this.donorArray?.get(`${arrayIndex}`).patchValue({
        files: this.fileThirdList[arrayIndex],
      });

      this.donorArray.get(`${arrayIndex}`).markAsDirty();
      this.donorArray.get(`${arrayIndex}`).markAsTouched();
      this.vilRequestForm.updateValueAndValidity();

      if (this.messageData?.attachments?.length > 0) {
        let findIndex = this.messageData?.attachments?.findIndex(
          (att: any) => att?.signedUrl === droppedData?.signedUrl
        );

        if (findIndex !== -1) {
          this.messageData?.attachments?.splice(findIndex, 1);
        }
      }
    }

    // this.vilRequestForm.markAllAsTouched();
    this.cd.detectChanges();
  }

  selectedTab = "Email Details";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }

  readFileData: any;
  readFileNeededObj: any;

  isFileReading: boolean = false;
  onClickReadFile(data: any, type: string, i: any = null) {
    if (data?.uploadType === "fileUploaded") {
      let payload = {
        url: data?.item?.url || data?.item?.path,
        fileName: data?.item?.name,
      };

      if (data?.item?.type?.includes("image")) {
        this.facilitatorService
          .getPatientDataByMessageImageRead(payload)
          .subscribe((res: any) => {
            this.readFileData = res?.data;
            this.readFileNeededObj = this.readFileData?.patientData;
            this.isFileReading = true;
            this.fetchDataFromAi(this.readFileNeededObj, type, i);
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      } else {
        this.facilitatorService
          .getPatientDataByMessageFileRead(payload)
          .subscribe((res: any) => {
            this.readFileData = res?.data;
            this.readFileNeededObj = this.readFileData?.patientData;
            this.isFileReading = true;
            this.fetchDataFromAi(this.readFileNeededObj, type, i);
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      }
    } else if (data?.uploadType === "fileUploader") {
      let formData = new FormData();
      let file: any = [];
      if (type === "patientPassport") {
        file = this.fileFirstList[data?.i];
      } else if (type === "attendantPassport") {
        file = this.fileSecondList[i][data?.i];
      } else if (type === "donorPassport") {
        file = this.fileThirdList[i][data?.i];
      }

      formData.append("file", file);

      if (file?.type?.includes("image")) {
        this.sharedService
          .readPassportFromImage(formData)
          .subscribe((res: any) => {
            this.readFileData = res?.data;
            this.readFileNeededObj = this.readFileData?.patientData;
            this.isFileReading = true;
            this.fetchDataFromAi(this.readFileNeededObj, type, i);
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      } else {
        this.sharedService
          .readPassportFromFile(formData)
          .subscribe((res: any) => {
            this.readFileData = res?.data;
            this.readFileNeededObj = this.readFileData?.patientData;
            this.isFileReading = true;
            this.fetchDataFromAi(this.readFileNeededObj, type, i);
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      }
    }
  }

  // fetchDataFromAi(item: any, type: string, i = null) {
  //   let address = item?.address;
  //   let country = item?.country;
  //   let dob = item?.dob;
  //   let gender = item?.gender;
  //   let givenName = item?.givenName;
  //   let passportNumber = item?.passportNumber;
  //   let surName = item?.surName;

  //   let attendantPassport = this.attendantArray as FormArray;
  //   let attendantIndexForm = attendantPassport.at(i) as FormGroup;

  //   let donorPassport = this.donorArray as FormArray;
  //   let donorIndexForm = donorPassport.at(i) as FormGroup;

  //   let patchingAddress = "";
  //   if (address !== "" && address !== undefined && address !== null) {
  //     patchingAddress = item?.address || "";

  //     if (type === "patientPassport") {
  //       this.vilRequestForm.patchValue({
  //         address: patchingAddress,
  //       });
  //     } else if (type === "attendantPassport") {
  //       attendantIndexForm.patchValue({
  //         address: patchingAddress,
  //       });
  //     } else if (type === "donorPassport") {
  //       donorIndexForm.patchValue({
  //         address: patchingAddress,
  //       });
  //     }
  //   }

  //   let patchingCountry = "";
  //   if (country !== "" && country !== undefined && country !== null) {
  //     patchingCountry = item?.country
  //       ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
  //           item?.country,
  //           this.countryData
  //         )
  //       : null;

  //     if (type === "patientPassport") {
  //       this.vilRequestForm.patchValue({
  //         country: patchingCountry,
  //       });
  //     } else if (type === "attendantPassport") {
  //       attendantIndexForm.patchValue({
  //         country: patchingCountry,
  //       });
  //     } else if (type === "donorPassport") {
  //       donorIndexForm.patchValue({
  //         country: patchingCountry,
  //       });
  //     }
  //   }

  //   let patchingDob: any = "";
  //   if (dob !== "" && dob !== undefined && dob !== null) {
  //     let newDob = moment(item?.dob);
  //     patchingDob = newDob.toDate();

  //     if (type === "patientPassport") {
  //       this.vilRequestForm.patchValue({
  //         dob: patchingDob,
  //       });
  //     } else if (type === "attendantPassport") {
  //       attendantIndexForm.patchValue({
  //         dob: patchingDob,
  //       });
  //     } else if (type === "donorPassport") {
  //       donorIndexForm.patchValue({
  //         dob: patchingDob,
  //       });
  //     }
  //   }

  //   let patchingGender = "";
  //   if (gender !== "" && gender !== undefined && gender !== null) {
  //     patchingGender = item?.gender
  //       ? GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING(
  //           item?.gender,
  //           this.genderData
  //         )
  //       : null;

  //     if (type === "patientPassport") {
  //       this.vilRequestForm.patchValue({
  //         gender: patchingGender,
  //       });
  //     } else if (type === "attendantPassport") {
  //       attendantIndexForm.patchValue({
  //         gender: patchingGender,
  //       });
  //     } else if (type === "donorPassport") {
  //       donorIndexForm.patchValue({
  //         gender: patchingGender,
  //       });
  //     }
  //   }

  //   let patchingGivenName = "";
  //   if (givenName !== "" && givenName !== undefined && givenName !== null) {
  //     patchingGivenName = item?.givenName || "";

  //     if (type === "patientPassport") {
  //       this.vilRequestForm.patchValue({
  //         givenName: patchingGivenName,
  //       });
  //     } else if (type === "attendantPassport") {
  //       attendantIndexForm.patchValue({
  //         givenName: patchingGivenName,
  //       });
  //     } else if (type === "donorPassport") {
  //       donorIndexForm.patchValue({
  //         givenName: patchingGivenName,
  //       });
  //     }
  //   }

  //   let patchingPassportNumber = "";
  //   if (
  //     passportNumber !== "" &&
  //     passportNumber !== undefined &&
  //     passportNumber !== null
  //   ) {
  //     patchingPassportNumber = item?.passportNumber || "";

  //     if (type === "patientPassport") {
  //       this.vilRequestForm.patchValue({
  //         passportNumber: patchingPassportNumber,
  //       });
  //     } else if (type === "attendantPassport") {
  //       attendantIndexForm.patchValue({
  //         passportNumber: patchingPassportNumber,
  //       });
  //     } else if (type === "donorPassport") {
  //       donorIndexForm.patchValue({
  //         passportNumber: patchingPassportNumber,
  //       });
  //     }
  //   }

  //   let patchingSurName = "";
  //   if (surName !== "" && surName !== undefined && surName !== null) {
  //     patchingSurName = item?.surName || "";

  //     if (type === "patientPassport") {
  //       this.vilRequestForm.patchValue({
  //         surName: patchingSurName,
  //       });
  //     } else if (type === "attendantPassport") {
  //       attendantIndexForm.patchValue({
  //         surName: patchingSurName,
  //       });
  //     } else if (type === "donorPassport") {
  //       donorIndexForm.patchValue({
  //         surName: patchingSurName,
  //       });
  //     }
  //   }

  //   let patchingName = "";
  //   if (patchingGivenName && patchingSurName) {
  //     patchingName = patchingGivenName + " " + patchingSurName;

  //     if (type === "patientPassport") {
  //       this.vilRequestForm.patchValue({
  //         patientName: patchingName,
  //       });
  //     } else if (type === "attendantPassport") {
  //       attendantIndexForm.patchValue({
  //         name: patchingName,
  //       });
  //     } else if (type === "donorPassport") {
  //       donorIndexForm.patchValue({
  //         name: patchingName,
  //       });
  //     }
  //   }

  //   // if (type === "patientPassport") {
  //   //   this.vilRequestForm.patchValue({
  //   //     address: patchingAddress,
  //   //     country: patchingCountry,
  //   //     dob: patchingDob,
  //   //     gender: patchingGender,
  //   //     givenName: patchingGivenName,
  //   //     passportNumber: patchingPassportNumber,
  //   //     surName: patchingSurName,
  //   //     patientName: patchingName,
  //   //   });
  //   // } else if (type === "attendantPassport") {
  //   //   if (item?.address) {
  //   //     let attendantPassport = this.attendantArray as FormArray;
  //   //     let indexForm = attendantPassport.at(i) as FormGroup;
  //   //     indexForm.patchValue({
  //   //       address: patchingAddress,
  //   //       dob: patchingDob,
  //   //       gender: patchingGender,
  //   //       givenName: patchingGivenName,
  //   //       passportNumber: patchingPassportNumber,
  //   //       surName: patchingSurName,
  //   //       country: patchingCountry,
  //   //       name: patchingName,
  //   //     });
  //   //   }
  //   // } else if (type === "donorPassport") {
  //   //   if (item?.address) {
  //   //     let donorPassport = this.donorArray as FormArray;
  //   //     let indexForm = donorPassport.at(i) as FormGroup;
  //   //     indexForm.patchValue({
  //   //       address: patchingAddress,
  //   //       dob: patchingDob,
  //   //       gender: patchingGender,
  //   //       givenName: patchingGivenName,
  //   //       passportNumber: patchingPassportNumber,
  //   //       surName: patchingSurName,
  //   //       country: patchingCountry,
  //   //       name: patchingName,
  //   //     });
  //   //   }
  //   // }
  // }

  fetchDataFromAi(item: any, type: string, i: number | null = null) {
    const isValid = (val: any) =>
      val !== "" && val !== null && val !== undefined;

    const getTargetForm = () => {
      if (type === "patientPassport") return this.vilRequestForm;
      if (type === "attendantPassport")
        return (this.attendantArray as FormArray).at(i!) as FormGroup;
      if (type === "donorPassport")
        return (this.donorArray as FormArray).at(i!) as FormGroup;
      return null;
    };

    const patchObject: any = {};
    const targetForm = getTargetForm();

    if (!targetForm) return;

    if (isValid(item?.address)) patchObject.address = item.address;

    if (isValid(item?.country)) {
      patchObject.country = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
        item.country,
        this.countryData
      );
    }

    if (isValid(item?.dob)) {
      patchObject.dob = item.dob ? moment(item.dob).toDate() : "";
    }

    if (isValid(item?.gender)) {
      patchObject.gender = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING(
        item.gender,
        this.genderData
      );
    }

    if (isValid(item?.givenName)) patchObject.givenName = item.givenName;
    if (isValid(item?.surName)) patchObject.surName = item.surName;
    if (isValid(item?.passportNumber))
      patchObject.passportNumber = item.passportNumber;

    // Construct full name if both exist
    if (patchObject.givenName && patchObject.surName) {
      patchObject[
        type === "patientPassport" ? "patientName" : "name"
      ] = `${patchObject.givenName} ${patchObject.surName}`;
    }

    // Finally patch all at once
    targetForm.patchValue(patchObject);
  }
}
