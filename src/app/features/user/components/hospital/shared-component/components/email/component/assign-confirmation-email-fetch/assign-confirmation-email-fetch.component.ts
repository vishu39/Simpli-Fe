import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import * as moment from "moment";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-assign-confirmation-email-fetch",
  templateUrl: "./assign-confirmation-email-fetch.component.html",
  styleUrls: ["./assign-confirmation-email-fetch.component.scss"],
})
export class AssignConfirmationEmailFetchComponent implements OnInit {
  @Input() patientId: any;
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
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getPatientById();
    this.getPatientConfirmationDataByEmailFetch();
    this.createForm();
    this.getAllPatientConfirmation();
    // this.patchFormIfEdit();
    // if (!this.isEdit) {
    //   this.patchDraft();
    // }
  }

  confirmationDataFromAi: any;
  confirmationObjFromAi: any;
  isAiLoading = true;
  getPatientConfirmationDataByEmailFetch() {
    this.isAiLoading = true;
    this.hospitalService
      .getPatientConfirmationDataByEmailFetch(this.emailFetchData?._id)
      .subscribe(
        (res: any) => {
          this.confirmationDataFromAi = res?.data;

          if (this.confirmationDataFromAi?.attachment?.length > 0) {
            this.confirmationDataFromAi?.attachment?.map((file: any) => {
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

    let receivedAtDate = moment(this.emailFetchData?.date);

    this.patientConfirmationForm.patchValue({
      cabs: cd?.cabs || "",
      flightName: cd?.flightName || "",
      flightNo: cd?.flightNo || "",
      contactPerson: cd?.contactPerson || "",
      contactPersonNo: cd?.contactPersonNo || "",
      coordinatorAddress: cd?.coordinatorAddress || "",
      remarks: cd?.remarks || "",
      arrivalDate: !!cd?.arrivalDate ? momentArrivalObj.toISOString() : "",
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
      coordinatorPickUpTime: !!cd?.coordinatorPickUpTime
        ? momentPickupObj.toISOString()
        : "",
    });
  }

  patientData: any;
  getPatientById() {
    this.hospitalService.getPatient(this.patientId).subscribe((res: any) => {
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

  ngOnChanges(changes: SimpleChanges) {
    // if (changes?.isDialogClosed?.currentValue) {
    //   if (!this.isEdit) {
    //     this.saveDraft();
    //   }
    // }
    // if (!!changes?.isFormChange?.currentValue) {
    //   if (!this.isEdit) {
    //     this.saveDraft();
    //   }
    // }
  }

  deleteTicket(index: number) {
    if (this.uploadedDoc?.length > 0) {
      this.confirmationDataFromAi?.attachment.push(this.uploadedDoc?.[index]);
      this.uploadedDoc.splice(index, 1);
    }
  }

  patchDraft() {
    let patientConfirmationDraftData: any = JSON.parse(
      localStorage.getItem(`${this.patientId}patientConfirmationDraft`)
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
        !!patientConfirmationDraftData?.receivedAt ||
        !!patientConfirmationDraftData?.remarks
      ) {
        this.patientConfirmationForm.patchValue({
          ...patientConfirmationDraftData,
        });
      }
    }
    // localStorage.removeItem(`${this.patientId}patientConfirmationDraft`);
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
      !!formValue?.receivedAt ||
      !!formValue?.remarks
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
        receivedAt: formValue?.receivedAt,
      };

      localStorage.setItem(
        `${this.patientId}patientConfirmationDraft`,
        JSON.stringify(patientConfirmationDraftData)
      );
    }
  }

  createForm() {
    this.patientConfirmationForm = this.fb.group({
      patientName: ["", [Validators.required]],
      patient: [this.patientId],
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
    this.hospitalService
      .getAllPatientConfirmation(this.patientId)
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
    this.hospitalService.getTopHospital().subscribe((res: any) => {
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

      this.hospitalService
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
        this.confirmationDataFromAi?.attachment.push(this.fileList?.[index]);
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

  listEntered(event: CdkDragDrop<any>) {
    // this.stopAutoScroll();
    // this.startAutoScroll();
  }

  ngAfterViewInit(): void {
    // this.renderer.listen(
    //   this.cont.nativeElement,
    //   "mousemove",
    //   this.onDragMove.bind(this)
    // );
  }

  // onDragMove(event: MouseEvent): void {
  //   const cont = this.cont.nativeElement;
  //   const { scrollTop, offsetHeight, scrollHeight } = cont;
  //   const pointerY = event.clientY - cont.getBoundingClientRect().top;

  //   if (pointerY < this.scrollThreshold) {
  //     cont.scrollTop = Math.max(0, scrollTop - this.scrollStep);
  //   } else if (pointerY > offsetHeight - this.scrollThreshold) {
  //     cont.scrollTop = Math.min(scrollHeight, scrollTop + this.scrollStep);
  //   }
  // }

  // startAutoScroll(): void {
  //   this.scrollInterval = setInterval(() => {
  //     // This function can be empty because `onDragOver` handles the actual scrolling
  //   }, 100);
  // }

  // stopAutoScroll(): void {
  //   if (this.scrollInterval) {
  //     clearInterval(this.scrollInterval);
  //     this.scrollInterval = null;
  //   }
  // }

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

      if (this.confirmationDataFromAi?.attachment?.length > 0) {
        let findIndex = this.confirmationDataFromAi?.attachment?.findIndex(
          (att: any) => att?.signedUrl === droppedData?.signedUrl
        );

        if (findIndex !== -1) {
          this.confirmationDataFromAi?.attachment?.splice(findIndex, 1);
        }
      }
    }

    // this.stopAutoScroll();
  }

  selectedTab = "Email Details";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }

  @ViewChild("cont") cont: ElementRef;
  private scrollInterval: any;

  // onMouseMove(event: MouseEvent) {
  //   const element = this.cont.nativeElement;
  //   const rect = element.getBoundingClientRect();
  //   const scrollZoneHeight = 10; // height in pixels for the scroll zone
  //   const scrollSpeed = 20; // speed of scrolling

  //   // Calculate the mouse position relative to the component
  //   const mouseY = event.clientY - rect.top;

  //   if (mouseY >= rect.height - scrollZoneHeight) {
  //     this.startScrolling("down", scrollSpeed);
  //   } else if (mouseY <= scrollZoneHeight) {
  //     this.startScrolling("up", scrollSpeed);
  //   } else {
  //     this.stopScrolling();
  //   }
  // }

  // startScrolling(direction: "up" | "down", speed: number) {
  //   if (this.scrollInterval) {
  //     return;
  //   }
  //   const element = this.cont.nativeElement;
  //   this.scrollInterval = setInterval(() => {
  //     if (direction === "down") {
  //       element.scrollTop += speed;
  //     } else if (direction === "up") {
  //       element.scrollTop -= speed;
  //     }
  //   }, 50);
  // }

  // stopScrolling() {
  //   if (this.scrollInterval) {
  //     clearInterval(this.scrollInterval);
  //     this.scrollInterval = null;
  //   }
  // }

  // ngOnDestroy() {
  //   this.stopScrolling();
  // }
}
