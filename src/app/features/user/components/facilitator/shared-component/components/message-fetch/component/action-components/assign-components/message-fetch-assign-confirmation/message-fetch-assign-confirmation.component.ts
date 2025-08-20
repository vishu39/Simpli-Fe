import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-message-fetch-assign-confirmation",
  templateUrl: "./message-fetch-assign-confirmation.component.html",
  styleUrls: ["./message-fetch-assign-confirmation.component.scss"],
})
export class MessageFetchAssignConfirmationComponent implements OnInit {
  @Input() messageData: any;
  @Input() emailFetchData: any;

  patientConfirmationForm: FormGroup;
  isLoadingTopHospital: boolean = true;
  topHospitalData = [];
  topHospitalDataForAggregator = [];
  allPatientConfirmationRequest = [];

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

  checkContactData: any;
  isCheckEmailClicked: boolean = false;

  isEdit = false;
  title = "";
  uploadedDoc: any = [];

  constructor(
    private facilitatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.messageData.attachments = cloneDeep(this.messageData?.mainAttachments);
    this.getPatientById();
    this.getAllAggregator();
    this.getPatientConfirmationDataByMessageFetch();
    this.createForm();
    this.getAllPatientConfirmation();

    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    let receivedAtDate = moment(this.messageData?.messageData[0]?.timestamp);
    this.patientConfirmationForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });
  }

  confirmationDataFromAi: any;
  confirmationObjFromAi: any;
  isAiLoading = true;
  getPatientConfirmationDataByMessageFetch() {
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
      .getPatientConfirmationDataByMessageFetch({ message: bodyArray })
      .subscribe(
        (res: any) => {
          this.confirmationDataFromAi = res?.data;
          if (this.messageData?.attachments?.length > 0) {
            this.messageData?.attachments?.map((file: any) => {
              file["url"] = file?.signedUrl;
              file["type"] = file?.mimetype;
              file["name"] = file?.originalname;
            });
          }
          this.confirmationObjFromAi =
            this.confirmationDataFromAi?.confirmationData;
          this.isAiLoading = false;
          this.fetchConfirmationDataFromAi(
            this.confirmationDataFromAi?.confirmationData
          );
        },
        () => {
          this.isAiLoading = false;
        }
      );
  }

  fetchConfirmationDataFromAi(cd: any) {
    let dateArrivalObj = new Date(cd?.arrivalDate);
    let momentArrivalObj = moment(dateArrivalObj);

    let datePickupObj = new Date(cd?.coordinatorPickUpTime);
    let momentPickupObj = moment(datePickupObj);

    // let receivedAtDate = moment(this.emailFetchData?.date);

    this.patientConfirmationForm.patchValue({
      cabs: cd?.cabs || "",
      flightName: cd?.flightName || "",
      flightNo: cd?.flightNo || "",
      contactPerson: cd?.contactPerson || "",
      contactPersonNo: cd?.contactPersonNo || "",
      coordinatorAddress: cd?.coordinatorAddress || "",
      remarks: cd?.remarks || "",
      // receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
      arrivalDate: !!cd?.arrivalDate ? momentArrivalObj.toISOString() : "",
      coordinatorPickUpTime: !!cd?.coordinatorPickUpTime
        ? momentPickupObj.toISOString()
        : "",
    });
  }

  patientData: any;
  getPatientById() {
    this.facilitatorService
      .getPatient(this.emailFetchData?._id)
      .subscribe((res: any) => {
        this.patientData = res?.data;
        this.patientConfirmationForm.patchValue({
          patientName: this.patientData?.name,
          treatment: this.patientData?.treatment,
          country: this.patientData?.country,
        });

        this.patientConfirmationForm.controls["patientName"].disable();
        this.patientConfirmationForm.controls["treatment"].disable();
        this.patientConfirmationForm.controls["country"].disable();
      });
  }

  deleteTicket(index: number) {
    if (this.uploadedDoc?.length > 0) {
      this.messageData?.attachments.push(this.uploadedDoc?.[index]);
      this.uploadedDoc.splice(index, 1);
    }
  }

  patchDraft() {
    let patientConfirmationDraftData: any = JSON.parse(
      localStorage.getItem(
        `${this.emailFetchData?._id}patientConfirmationDraft`
      )
    );

    if (!!patientConfirmationDraftData) {
      if (
        !!patientConfirmationDraftData?.hospitalName ||
        !!patientConfirmationDraftData?.hospitalId ||
        !!patientConfirmationDraftData?.cabs ||
        !!patientConfirmationDraftData?.flightName ||
        !!patientConfirmationDraftData?.flightNo ||
        !!patientConfirmationDraftData?.arrivalDate ||
        !!patientConfirmationDraftData?.contactPerson ||
        !!patientConfirmationDraftData?.contactPersonNo ||
        !!patientConfirmationDraftData?.coordinatorAddress ||
        !!patientConfirmationDraftData?.coordinatorPickUpTime ||
        !!patientConfirmationDraftData?.remarks ||
        !!patientConfirmationDraftData?.receivedAt ||
        !!patientConfirmationDraftData?.aggregator
      ) {
        this.patientConfirmationForm.patchValue({
          ...patientConfirmationDraftData,
        });
      }
    }
    // localStorage.removeItem(`${this.emailFetchData?._id}patientConfirmationDraft`);
  }

  saveDraft() {
    let formValue = this.patientConfirmationForm?.getRawValue();

    if (
      !!formValue?.hospitalName ||
      !!formValue?.hospitalId ||
      !!formValue?.cabs ||
      !!formValue?.flightName ||
      !!formValue?.flightNo ||
      !!formValue?.arrivalDate ||
      !!formValue?.contactPerson ||
      !!formValue?.contactPersonNo ||
      !!formValue?.coordinatorAddress ||
      !!formValue?.coordinatorPickUpTime ||
      !!formValue?.remarks ||
      !!formValue?.receivedAt ||
      !!formValue?.aggregator
    ) {
      let patientConfirmationDraftData = {
        hospitalName: formValue?.hospitalName,
        hospitalId: formValue?.hospitalId,
        cabs: formValue?.cabs,
        flightName: formValue?.flightName,
        flightNo: formValue?.flightNo,
        arrivalDate: formValue?.arrivalDate,
        contactPerson: formValue?.contactPerson,
        contactPersonNo: formValue?.contactPersonNo,
        coordinatorAddress: formValue?.coordinatorAddress,
        coordinatorPickUpTime: formValue?.coordinatorPickUpTime,
        remarks: formValue?.remarks,
        aggregator: formValue?.aggregator,
        receivedAt: formValue?.receivedAt,
      };

      localStorage.setItem(
        `${this.emailFetchData?._id}patientConfirmationDraft`,
        JSON.stringify(patientConfirmationDraftData)
      );
    }
  }

  createForm() {
    this.patientConfirmationForm = this.fb.group({
      patientName: ["", [Validators.required]],
      patient: [this.emailFetchData?._id],
      treatment: ["", [Validators.required]],
      country: ["", [Validators.required]],
      hospitalName: [
        {
          value: "",
          disabled: this.isEdit ? true : false,
        },
        [Validators.required],
      ],
      hospitalId: ["", [Validators.required]],
      aggregator: [""],
      cabs: [""],
      flightName: [""],
      flightNo: [""],
      arrivalDate: ["", [Validators.required]],
      contactPerson: [""],
      contactPersonNo: ["", [Validators.pattern(regexService.contactRegex)]],
      coordinatorAddress: [""],
      coordinatorPickUpTime: [""],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
      remarks: ["", [Validators.required]],
      fileFirst: [""],
    });
  }

  topHospitalChange(item: any) {
    this.patientConfirmationForm.patchValue({
      hospitalName: item?.name,
      hospitalId: item?._id,
    });
  }

  getAllPatientConfirmation() {
    this.facilitatorService
      .getAllPatientConfirmation(this.emailFetchData?._id)
      .subscribe((res: any) => {
        this.allPatientConfirmationRequest = res?.data;
        this.getTopHospital();
        this.getAllHospital();
      });
  }

  filterTopHospitalByRequest(topHospitalData: any) {
    if (this.allPatientConfirmationRequest?.length) {
      let resData = topHospitalData;
      this.allPatientConfirmationRequest?.forEach((data: any) => {
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
    this.allPatientConfirmationRequest?.forEach((data: any) => {
      let index = resData?.findIndex((rd: any) => rd?._id === data?.hospitalId);
      if (index !== -1) {
        resData.splice(index, 1);
      }
    });
    this.hospitalData.push(...resData);
  }

  freshTopHospital = [];
  getTopHospital() {
    this.isLoadingTopHospital = true;
    this.facilitatorService.getTopHospital().subscribe((res: any) => {
      this.topHospitalDataForAggregator.push(...res?.data?.hospital);
      this.freshTopHospital.push(...res?.data?.hospital);
      if (this.allPatientConfirmationRequest?.length) {
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
        this.hospitalDataForAggregator.push(...res?.data?.content);
        this.freshHospitalData.push(...res?.data?.content);
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;
        // for hospital
        if (
          this.allPatientConfirmationRequest?.length &&
          !this.aggregatorRequestList?.length &&
          !this.patientConfirmationForm.get("aggregator").value
        ) {
          this.filterHospitalByRequest(this.hospitalData);
        }
        if (
          this.aggregatorRequestList?.length ||
          !!this.patientConfirmationForm.get("aggregator").value
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
    this.patientConfirmationForm.patchValue({
      hospitalName: item?.name,
      hospitalId: item?._id,
    });
  }

  getPatientConfirmationRecipients() {
    if (this.patientConfirmationForm.valid) {
      let values = {
        patientConfirmation: [
          {
            hospitalId: this.patientConfirmationForm?.get("hospitalId")?.value,
            hospitalName:
              this.patientConfirmationForm?.get("hospitalName")?.value,
          },
        ],
        patient: this.patientConfirmationForm?.get("patient")?.value,
      };

      this.facilitatorService
        .getPatientConfirmationRecipients(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.isCheckEmailClicked = true;
          this.checkContactData = res?.data;
        });
    } else {
      this.patientConfirmationForm.markAllAsTouched();
    }
  }

  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  onFileSelected(e: any) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.filePreviewUrls.push(fileUrl);
        file["url"] = fileUrl;
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
      if (!!this.fileList[index]?.signedUrl) {
        this.messageData?.attachments.push(this.fileList?.[index]);
      }

      this.fileList.splice(index, 1);
      this.filePreviewUrls.splice(index, 1);
    }
    if (!this.fileList.length) {
      this.patientConfirmationForm.patchValue({
        fileFirst: null,
      });
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
    this.patientConfirmationForm.patchValue({
      hospitalId: "",
      hospitalName: "",
    });
    this.getAllPatientConfirmationByAggregator(item);
  }

  getAllPatientConfirmationByAggregator(item: any) {
    let payload = {
      patient: this.emailFetchData?._id,
      aggregator: item?._id,
    };
    this.facilitatorService
      .getAllPatientConfirmationByAggregator(payload)
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
      this.fileList.push(droppedData);
      this.filePreviewUrls.push(droppedData?.signedUrl);

      this.patientConfirmationForm.patchValue({
        fileFirst: this.fileList,
      });
      this.patientConfirmationForm.controls["fileFirst"].markAsDirty();
      this.patientConfirmationForm.controls["fileFirst"].markAsTouched();
      this.patientConfirmationForm.updateValueAndValidity();

      if (this.messageData?.attachments?.length > 0) {
        let findIndex = this.messageData?.attachments?.findIndex(
          (att: any) => att?.signedUrl === droppedData?.signedUrl
        );

        if (findIndex !== -1) {
          this.messageData?.attachments?.splice(findIndex, 1);
        }
      }
    }

    // this.stopAutoScroll();
  }

  selectedTab = "Email Details";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
