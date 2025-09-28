import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddHospitalDialogComponent } from "../../../../dialog/add-hospital-dialog/add-hospital-dialog.component";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import {
  GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ,
  GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_STRING,
} from "src/app/shared/util";
import { AcknowledgementModalComponent } from "src/app/shared/components/dialogs/acknowledgement-modal/acknowledgement-modal.component";
import * as moment from "moment";

@Component({
  selector: "shared-add-vil-request",
  templateUrl: "./add-vil-request.component.html",
  styleUrls: ["./add-vil-request.component.scss"],
})
export class AddVilRequestComponent implements OnInit {
  @Input() patientData: any;
  @Input() isDialogClosed: boolean = false;
  @Input() isFormChange = "opinionRequest";

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
    private faciliatorService: FacilitatorService,
    public dialogRef: MatDialogRef<AddHospitalDialogComponent>,
    private dialog: MatDialog
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
      emailId: ["", [Validators.pattern(regexService.emailRegex)]],
      contact: ["", [Validators.pattern(regexService.contactRegex)]],
      address: [""],
      treatment: [null],
      department: [null],
      // verifyAddress: [false],
      passportNumber: ["", [Validators.required]],
      patient: [this.patientData?._id],
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
    this.getPatientById();
    this.getAllVilRequest();
    this.getAllAggregator();
    this.getCountryData();
    this.getEmbassyByCountry(this.patientData?.country);
    this.getTreatmentData();
    this.patchDraft();

    // let newDob: any = "";
    // if (!!this.patientData?.dob) {
    //   newDob = moment(this.patientData?.dob);
    // }

    // this.vilRequestForm.patchValue({
    //   dob: newDob ? newDob?.toDate() : "",
    //   contactInIndia: this.patientData?.contactInIndia || "",
    //   addressInIndia: this.patientData?.addressInIndia || "",
    //   treatment: this.patientData?.treatment,
    // });
  }

  getPatientById() {
    this.faciliatorService
      .getPatient(this.patientData._id)
      .subscribe((res: any) => {
        this.patientData = res?.data;

        let newDob: any = "";
        if (!!this.patientData?.dob) {
          newDob = moment(this.patientData?.dob);
        }

        this.vilRequestForm.patchValue({
          patientName: this.patientData?.name,
          givenName: this.patientData?.givenName,
          surName: this.patientData?.surName,
          gender: this.patientData?.gender,
          country: this.patientData?.country || null,
          emailId: this.patientData?.emailId,
          contact: this.patientData?.contact,
          address: this.patientData?.address,
          passportNumber: this.patientData?.passportNumber,
          patient: this.patientData?._id,
          dob: newDob ? newDob?.toDate() : "",
          contactInIndia: this.patientData?.contactInIndia || "",
          addressInIndia: this.patientData?.addressInIndia || "",
          treatment: this.patientData?.treatment,
        });
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isDialogClosed?.currentValue) {
      // if (!this.isEdit) {
      this.saveDraft();
      // }
    }
    if (!!changes?.isFormChange?.currentValue) {
      this.saveDraft();
    }
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
      this.faciliatorService.getVilRecipients(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.isCheckEmailClicked = true;
        this.checkContactData = res?.data;
      });
    } else {
      this.vilRequestForm.markAllAsTouched();
    }
  }

  getAllVilRequest() {
    this.faciliatorService
      .getAllVilRequest(this.patientData?._id)
      .subscribe((res: any) => {
        this.allVilRequest = res?.data;
        this.getAllHospital();
        this.getTopHospital();
        let lastIndexData = this.allVilRequest?.at(-1);
        this.lastVilDataAdded = lastIndexData;
        if (!!this.lastVilDataAdded?._id) {
          this.patchLastIndexData(this.lastVilDataAdded);
        }
      });
  }

  lastVilDataAdded: any = {};
  lastVilAddedPatientPassport = [];
  lastVilAddedAttendantPassport = [];
  lastVilAddedDonorPassport = [];
  patchLastIndexData(addedData: any) {
    this.lastVilAddedPatientPassport = cloneDeep(addedData?.patientPassport);
    this.lastVilAddedAttendantPassport = cloneDeep(
      addedData?.attendantPassport
    );
    this.lastVilAddedDonorPassport = cloneDeep(addedData?.donorPassport);

    if (!!addedData._id) {
      let newData = cloneDeep(addedData);

      delete newData["hospitalId"];
      delete newData["hospitalName"];

      if (!!addedData?.embassy) {
        let embassyDataFromSimilarity = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
          addedData?.embassy?.name,
          this.embasyData,
          "embassy"
        );

        let embassyForm = this.vilRequestForm.get("embassyForm") as FormGroup;

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

      if (addedData?.attendantDetails?.length > 0) {
        this.attendantArray.clear();
        addedData?.attendantDetails?.forEach((t: any) => {
          let formObj: FormGroup = this.createAttendantArrayForm();
          let newDob: any;
          if (!!t?.dob) {
            newDob = moment(t?.dob);
          }
          formObj.patchValue({
            name: t?.name,
            passportNumber: t?.passportNumber,
            country: t?.country,
            files: [[]],
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
          this.attendantArray.push(formObj);
        });
        delete newData["attendantDetails"];
      }

      if (addedData?.donorDetails?.length > 0) {
        this.donorArray.clear();
        addedData?.donorDetails?.forEach((t: any) => {
          let formObj: FormGroup = this.createDonorArrayForm();
          let newDob: any;
          if (!!t?.dob) {
            newDob = moment(t?.dob);
          }
          formObj.patchValue({
            name: t?.name,
            passportNumber: t?.passportNumber,
            country: t?.country,
            files: [[]],
            address: t?.address,
            emailId: t?.emailId,
            contact: t?.contact,
            relationshipWithPatient: t?.relationshipWithPatient,
            // verifyAddress: t?.verifyAddress,
            givenName: t?.givenName,
            surName: t?.surName,
            gender: t?.gender,
            dob: newDob ? newDob?.toDate() : "",
          });
          this.donorArray.push(formObj);
        });
        delete newData["donorDetails"];
      }

      delete newData["aggregator"];
      if (!newData?.aggregator?.length) {
        newData.aggregator = "";
      }

      if (
        !!addedData?.doctorName ||
        !!addedData?.embasy ||
        !!addedData?.receivedAt ||
        !!addedData?.appointmentDate ||
        !!addedData?.givenName ||
        !!addedData?.surName ||
        !!addedData?.dob ||
        !!addedData?.country ||
        !!addedData?.gender ||
        !!addedData?.addressInIndia ||
        !!addedData?.contactInIndia ||
        !!addedData?.contact
      ) {
        this.vilRequestForm.patchValue({
          ...newData,
        });
      }
    }
  }

  deleteDataFromAddedVilPassports(type: string, i: number) {
    switch (type) {
      case "patient":
        if (i !== -1) {
          if (this.lastVilAddedPatientPassport?.length > 0) {
            this.lastVilAddedPatientPassport?.splice(i, 1);
          }
        }
        break;
      case "attendant":
        if (i !== -1) {
          if (this.lastVilAddedAttendantPassport?.length > 0) {
            this.lastVilAddedAttendantPassport?.splice(i, 1);
          }
        }
        break;
      case "donor":
        if (i !== -1) {
          if (this.lastVilAddedDonorPassport?.length > 0) {
            this.lastVilAddedDonorPassport?.splice(i, 1);
          }
        }
        break;
      default:
        break;
    }
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
    this.donorArray.removeAt(i);
  }

  addAttendant() {
    this.attendantArray.push(this.createAttendantArrayForm());
  }

  deleteAttendant(i: number) {
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
    this.faciliatorService.getTopHospital().subscribe((res: any) => {
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

        let aggVal = this.vilRequestForm.get("aggregator").value;

        if (Array.isArray(aggVal)) {
          if (!aggVal?.length) {
            this.vilRequestForm.patchValue({
              aggregator: "",
            });
          }
        }

        if (
          this.allVilRequest?.length &&
          !this.aggregatorRequestList?.length &&
          !this.vilRequestForm.get("aggregator").value
        ) {
          this.filterHospitalByRequest(this.hospitalData);
        }
        if (
          this.aggregatorRequestList?.length ||
          this.vilRequestForm.get("aggregator").value
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
          // this.fileFirstPreviewUrls = [fileUrl];
        }
        if (fileName === "fileSecond") {
          let array = this.fileSecondPreviewUrls[arrayIndex] || [];
          array.push(fileUrl);
          // array = [fileUrl];
          this.fileSecondPreviewUrls[arrayIndex] = array;
        }
        if (fileName === "fileThird") {
          let array = this.fileThirdPreviewUrls[arrayIndex] || [];
          array.push(fileUrl);
          // array = [fileUrl];
          this.fileThirdPreviewUrls[arrayIndex] = array;
        }
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (fileName === "fileFirst") {
            this.fileFirstPreviewUrls.push(reader.result as string);
            // this.fileFirstPreviewUrls = [reader.result as string];
          }
          if (fileName === "fileSecond") {
            let array = this.fileSecondPreviewUrls[arrayIndex] || [];
            array.push(reader.result as string);
            // array = [reader.result as string];
            this.fileSecondPreviewUrls[arrayIndex] = array;
          }
          if (fileName === "fileThird") {
            let array = this.fileThirdPreviewUrls[arrayIndex] || [];
            array.push(reader.result as string);
            // array = [reader.result as string];
            this.fileThirdPreviewUrls[arrayIndex] = array;
          }
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      if (fileName === "fileFirst") {
        this.fileFirstList.push(file);
        // this.fileFirstList = [file];
      }
      if (fileName === "fileSecond") {
        let array = this.fileSecondList[arrayIndex] || [];
        array.push(file);
        // array = [file];
        this.fileSecondList[arrayIndex] = array;
      }
      if (fileName === "fileThird") {
        let array = this.fileThirdList[arrayIndex] || [];
        array.push(file);
        // array = [file];
        this.fileThirdList[arrayIndex] = array;
      }
    });
  }

  onDelete(fileName: string, mainIndex = 0, index: number) {
    if (fileName === "fileFirst") {
      if (index !== -1) {
        this.fileFirstList.splice(index, 1);
        this.fileFirstPreviewUrls.splice(index, 1);
      }
      // this.fileFirstList = [];
      // this.fileFirstPreviewUrls = [];
      // this.vilRequestForm.patchValue({
      //   fileFirst: [],
      // });
    }
    if (fileName === "fileSecond") {
      if (index !== -1) {
        this.fileSecondList[mainIndex].splice(index, 1);
        this.fileSecondPreviewUrls[mainIndex].splice(index, 1);
        if (!this.fileSecondList[mainIndex]?.length) {
          this.attendantArray?.get(`${mainIndex}`).patchValue({
            files: [],
          });
        }
      }
      // this.fileSecondList[mainIndex] = [];
      // this.fileSecondPreviewUrls[mainIndex] = [];
      // this.attendantArray?.get(`${mainIndex}`).patchValue({
      //   files: [],
      // });
    }
    if (fileName === "fileThird") {
      if (index !== -1) {
        this.fileThirdList[mainIndex].splice(index, 1);
        this.fileThirdPreviewUrls[mainIndex].splice(index, 1);
        if (!this.fileThirdList[mainIndex]?.length) {
          this.donorArray?.get(`${mainIndex}`).patchValue({
            files: [],
          });
        }
      }
      // this.fileThirdList[mainIndex] = [];
      // this.fileThirdPreviewUrls[mainIndex] = [];
      // this.donorArray?.get(`${mainIndex}`).patchValue({
      //   files: [],
      // });
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
    this.faciliatorService
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
      localStorage.getItem(`${this.patientData?._id}vilRequestDraft`)
    );

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
        let newDob: any;
        if (!!t?.dob) {
          newDob = moment(t?.dob);
        }
        formObj.patchValue({
          name: t?.name,
          passportNumber: t?.passportNumber,
          country: t?.country,
          files: [[]],
          address: t?.address,
          emailId: t?.emailId,
          contact: t?.contact,
          relationshipWithPatient: t?.relationshipWithPatient,
          // verifyAddress: t?.verifyAddress,
          givenName: t?.givenName,
          surName: t?.surName,
          gender: t?.gender,
          dob: newDob ? newDob?.toDate() : "",
        });
        this.attendantArray.push(formObj);
      });
      delete newData["attendantDetails"];
    }

    if (vilRequestDraftData?.donorDetails?.length > 0) {
      vilRequestDraftData?.donorDetails?.forEach((t: any) => {
        let formObj: FormGroup = this.createDonorArrayForm();
        let newDob: any;
        if (!!t?.dob) {
          newDob = moment(t?.dob);
        }
        formObj.patchValue({
          name: t?.name,
          passportNumber: t?.passportNumber,
          country: t?.country,
          files: [[]],
          address: t?.address,
          emailId: t?.emailId,
          contact: t?.contact,
          relationshipWithPatient: t?.relationshipWithPatient,
          // verifyAddress: t?.verifyAddress,
          givenName: t?.givenName,
          surName: t?.surName,
          gender: t?.gender,
          dob: newDob ? newDob?.toDate() : "",
        });
        this.donorArray.push(formObj);
      });
      delete newData["donorDetails"];
    }

    if (newData?.aggregator?.length) {
      delete newData["aggregator"];
    }
    // if (!newData?.aggregator?.length) {
    //   newData.aggregator = "";
    // }

    if (
      !!vilRequestDraftData?.hospitalName ||
      !!vilRequestDraftData?.hospitalId ||
      !!vilRequestDraftData?.doctorName ||
      !!vilRequestDraftData?.embasy ||
      !!vilRequestDraftData?.appointmentDate ||
      !!vilRequestDraftData?.receivedAt
      // !!vilRequestDraftData?.address ||
      // !!vilRequestDraftData?.verifyAddress ||
      // !!vilRequestDraftData?.emailId ||
      // !!vilRequestDraftData?.contact ||
      // !!vilRequestDraftData?.treatment ||
      // !!vilRequestDraftData?.department
    ) {
      this.vilRequestForm.patchValue({
        ...newData,
      });
    }

    // localStorage.removeItem(`${this.patientData?._id}vilRequestDraft`);
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
      !!formValue?.aggregator ||
      !!formValue?.receivedAt ||
      !!formValue?.embassyForm ||
      newAttendantDetails?.length > 0 ||
      newDonorDetails?.length > 0
      // !!formValue?.address ||
      // !!formValue?.verifyAddress ||
      // !!formValue?.emailId ||
      // !!formValue?.contact ||
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
        // emailId: formValue?.emailId,
        // contact: formValue?.contact,
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
        `${this.patientData?._id}vilRequestDraft`,
        JSON.stringify(vilRequestDraftData)
      );
    }
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
        aggregator: values?.aggregator,
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
      for (var i = 0; i < this.fileFirstList?.length; i++) {
        formData.append("fileFirst", this.fileFirstList[i]);
      }
      let secondFileArray = [];
      this.fileSecondList?.forEach((second: any) => {
        second?.forEach((s: any) => {
          secondFileArray.push(s);
        });
      });
      let thirdFileArray = [];
      this.fileThirdList?.forEach((third: any) => {
        third?.forEach((t: any) => {
          thirdFileArray.push(t);
        });
      });
      for (var i = 0; i < secondFileArray?.length; i++) {
        formData.append("fileSecond", secondFileArray[i]);
      }
      for (var i = 0; i < thirdFileArray?.length; i++) {
        formData.append("fileThird", thirdFileArray[i]);
      }

      formData.append(
        "patientPassport",
        JSON.stringify(this.lastVilAddedPatientPassport)
      );
      formData.append(
        "attendantPassport",
        JSON.stringify(this.lastVilAddedAttendantPassport)
      );
      formData.append(
        "donorPassport",
        JSON.stringify(this.lastVilAddedDonorPassport)
      );

      formData.append(
        "vilRequest",
        JSON.stringify([
          {
            hospitalName: values?.hospitalName,
            hospitalId: values?.hospitalId,
          },
        ])
      );
      formData.append("embassy", JSON.stringify(values?.embassyForm));
      let donorDetails = values?.donorDetails;
      donorDetails?.map((value: any) => {
        delete value["files"];
      });
      formData.append("donorDetails", JSON.stringify(donorDetails));

      let attendantDetails = values?.attendantDetails;
      attendantDetails?.map((value: any) => {
        delete value["files"];
      });
      formData.append("attendantDetails", JSON.stringify(attendantDetails));

      this.faciliatorService.addVilRequest(formData).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        localStorage.removeItem(`${this.patientData?._id}vilRequestDraft`);
        let acknowledgementPayload = {
          eventName: "vilRequest",
          patient: this.patientData?._id,
        };

        let ackEventPayload = {
          ...payload,
          embassy: values?.embassyForm,
          donorDetails: donorDetails,
          attendantDetails: attendantDetails,
          vilRequest: [
            {
              hospitalName: values?.hospitalName,
              hospitalId: values?.hospitalId,
            },
          ],
        };

        this.acknowledgementPopupByEvent(
          acknowledgementPayload,
          ackEventPayload
        );
        // this.dialogRef.close(true);
      });
    } else {
      this.vilRequestForm.markAllAsTouched();
    }
  }
  acknowledgementData: any;
  acknowledgementPopupByEvent(payload: any, values: any) {
    this.sharedService
      .acknowledgementPopupByEvent(payload)
      .subscribe((res: any) => {
        this.acknowledgementData = res?.data;
        if (!this.acknowledgementData?.found) {
          this.dialogRef.close(true);
        } else {
          this.openAcknowledgePopup(payload, values);
          this.dialogRef.close(true);
        }
      });
  }

  openAcknowledgePopup(payload: any, values: any) {
    const dialogRef = this.dialog.open(AcknowledgementModalComponent, {
      width: "60%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "";
    dialogRef.componentInstance.acknowledgementData = this.acknowledgementData;
    dialogRef.componentInstance.acknowledgementPayload = payload;
    dialogRef.componentInstance.eventPayload = values;
    dialogRef.componentInstance.type = payload?.eventName;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
      }
    });
  }

  selectedTab = "Email Details";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }

  readFileData: any;
  readFileNeededObj: any;
  isFileReading: boolean = false;
  readFile(event: any, type: string, i: any) {
    let formData = new FormData();

    let file: any = [];

    if (type === "patientPassport") {
      file = this.fileFirstList[event?.i];
    } else if (type === "attendantPassport") {
      file = this.fileSecondList[i][event?.i];
    } else if (type === "donorPassport") {
      file = this.fileThirdList[i][event?.i];
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
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.sharedService
        .readPassportFromFile(formData)
        .subscribe((res: any) => {
          this.readFileData = res?.data;
          this.readFileNeededObj = this.readFileData?.patientData;
          this.isFileReading = true;
          this.fetchDataFromAi(this.readFileNeededObj, type, i);
          this.sharedService.showNotification("snackBar-success", res.message);
        });
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
