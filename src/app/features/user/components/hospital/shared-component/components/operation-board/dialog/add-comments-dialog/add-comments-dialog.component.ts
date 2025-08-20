import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import { DatePipe } from "@angular/common";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SubjectService } from "src/app/core/service/subject/subject.service";

@Component({
  selector: "app-add-comments-dialog",
  templateUrl: "./add-comments-dialog.component.html",
  styleUrls: ["./add-comments-dialog.component.scss"],
})
export class AddCommentsDialogComponent implements OnInit {
  // important
  querryData: any;
  patientData: any;
  vilData: any;
  patientConfirmationData: any;
  isUserLoading: boolean = false;
  isUserLoadingAll: boolean = false;
  userData: any = [];
  freshUserData: any = [];
  isLoading: boolean = false;
  chatArray = [];
  isCommentLoading: boolean = false;
  totalChatElement: number;

  fileList: any = [];

  isComments: boolean = true;
  isReports: boolean = false;
  isPassport: boolean = false;
  isTickets: boolean = false;
  isItinerary: boolean = false;
  uploadedFiles: File[] = [];
  mentionConfig = {
    triggerChar: "@",
    allowSpace: true,
    labelKey: "name",
    mentionSelect: this.formatMention,
  };

  commentParams = {
    page: 1,
    limit: 10,
    search: "",
  };

  timeoutUser = null;
  timeoutComment = null;
  comment: string;
  selectedMention: any = [];

  commentForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matRef: MatDialogRef<AddCommentsDialogComponent>,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private subjectService: SubjectService
  ) {
    this.audioElement = new Audio();
    this.sharedService.realTimeNotificationSubject.subscribe((pn: any) => {
      if (!!pn) {
        this.chatArray.push(pn);
        this.scrollCalled = false;
        if (!this.scrollCalled) {
          this.scrollToBottom();
        }
        if (this.data?.title?.length > 0) {
          this.readComment();
        }
      }
    });
  }

  formatMention(item: any) {
    return "@" + item.name + " ";
  }

  onMention(e: any) {
    console.log(e);
  }

  @ViewChild("scrollMe") private myScrollContainer: ElementRef;

  readComment() {
    let data =
      this.data?.title === "Querry" || this.data?.title === "Comment"
        ? this.data?.itemData?.patient
        : this.data?.itemData;
    this.hospitalService.readComment(data?._id).subscribe((res: any) => {
      this.sharedService.unreadCommentSubject.next(true);
    });
  }

  isDark() {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit(): void {
    if (this.data?.title?.length > 0) {
      this.readComment();
    }
    this.commentForm = this.fb.group({
      comment: ["", [Validators.required]],
      selectedUser: [[], [Validators.required]],
    });

    this.querryData =
      this.data?.title === "Querry" || this.data?.title === "Comment"
        ? this.data?.itemData?.patient
        : this.data?.itemData;
    if (this.querryData?._id) {
      this.getUserList();
      this.getPatientById();
      this.getAllVilRequest();
      this.getAllPatientConfirmation();
      this.getComment();
    }
  }

  scrollCalled: boolean = false;
  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight;
        this.scrollCalled = true;
      } catch (err) {}
    }, 100);
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  getUserList(selectAll: Boolean = false) {
    this.isUserLoading = true;
    this.sharedService
      .getAllUserByQueryViewSetting(this.querryData?._id)
      .subscribe(
        (res: any) => {
          this.userData = res?.data;
          this.freshUserData = res?.data;
          this.isUserLoading = false;
          this.isUserLoadingAll = false;

          if (this.data?.title === "Follow Up Query") {
            this.getFollowUpMention(selectAll);
          } else {
            if (selectAll) {
              let newArr = cloneDeep(this.userData);
              newArr?.map((d: any) => {
                if (d?.userType !== "referral partner") {
                  if (d?.userType) {
                    const isConfirmationMentionAlreadySelected =
                      this.selectedUser.some(
                        (selectedMention) => selectedMention._id === d._id
                      );

                    if (!isConfirmationMentionAlreadySelected) {
                      this.selectedUser.push(d);
                    }
                  }
                }
              });

              this.commentForm.patchValue({
                selectedUser: this.selectedUser,
              });
            }
          }
        },
        () => {
          if (this.data?.title === "Follow Up Query") {
            this.getFollowUpMention(selectAll);
          }
        }
      );
  }

  selectedUser = [];
  onClickUser(item: any) {
    const index = this.selectedUser.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedUser.splice(index, 1);
    } else {
      this.selectedUser.push(item);
    }
    this.commentForm.patchValue({
      selectedUser: [...new Set(this.selectedUser)],
    });
  }

  removeSelecteduser(i: number) {
    if (i !== -1) {
      this.selectedUser.splice(i, 1);
      this.commentForm.patchValue({
        selectedUser: [...new Set(this.selectedUser)],
      });
    }
  }

  searchUser(filterValue: string) {
    clearTimeout(this.timeoutUser);
    this.timeoutUser = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshUserData);
        this.userData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.userData = filterArray;
      } else {
        this.userData = this.freshUserData;
      }
    }, 600);
  }

  selectAllUser(event: any) {
    if (event.checked) {
      this.isUserLoading = false;
      this.isUserLoadingAll = true;
      this.getUserList(true);
    } else {
      this.selectedUser = [];
      this.commentForm.patchValue({
        selectedUser: [...new Set(this.selectedUser)],
      });
    }
  }

  getComment() {
    this.isCommentLoading = true;
    this.hospitalService
      .getComment(this.commentParams, this.querryData?._id)
      .subscribe(
        (res: any) => {
          let data = res?.data;
          let chats = cloneDeep(data?.content);
          this.totalChatElement = data?.totalElement;
          let newArray = [];
          newArray.unshift(...chats);
          let reverseArray = newArray.reverse();
          this.chatArray.unshift(...reverseArray);
          this.commentParams.page = this.commentParams.page + 1;
          this.isCommentLoading = false;
          if (!this.scrollCalled) {
            this.scrollToBottom();
          }
          if (!this.scrollMidCalled && this.scrollCalled) {
            this.scrollToMid();
          }
        },
        (err) => {
          this.isCommentLoading = false;
        }
      );
  }

  onInfiniteScrollComment(): void {
    if (!this.isCommentLoading) {
      if (this.chatArray.length < this.totalChatElement) {
        this.scrollMidCalled = false;
        this.getComment();
      }
    }
  }

  scrollMidCalled: boolean = false;
  scrollToMid(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight /
          this.commentParams.page;
        this.scrollMidCalled = true;
      } catch (err) {}
    }, 100);
  }

  searchComment(filterValue: string) {
    clearTimeout(this.timeoutComment);
    this.timeoutComment = setTimeout(() => {
      this.commentParams.search = filterValue.trim();
      this.commentParams.page = 1;
      this.chatArray = []; // Clear existing data when searching
      this.isCommentLoading = false;
      this.scrollCalled = false;
      this.getComment();
    }, 600);
  }

  getPatientById() {
    this.isLoading = true;
    this.hospitalService
      .getPatient(this.querryData?._id)
      .subscribe((res: any) => {
        this.patientData = res?.data;
        this.isLoading = false;
      });
  }

  allVilRequest: any;
  isVilLoading = true;
  getAllVilRequest() {
    this.isVilLoading = true;
    this.hospitalService.getPendingVilRequest(this.querryData?._id).subscribe(
      (res: any) => {
        let data = res?.data;
        this.allVilRequest = data;
        this.vilData = data;
        this.isVilLoading = false;
      },
      (err) => {
        this.isVilLoading = true;
      }
    );
  }

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;
  getAllPatientConfirmation() {
    this.isPatientLoading = true;
    this.hospitalService
      .getAllPatientConfirmation(this.querryData?._id)
      .subscribe(
        (res: any) => {
          let data = res?.data;
          this.allPatientConfirmationRequest = cloneDeep(data);
          this.patientConfirmationData = data;
          this.freshPatientConfirmationData = cloneDeep(data);
          this.freshPatientConfirmationDataForUHID = cloneDeep(data);
          if (this.data.title === "On Ground Patient") {
            let cloneData = cloneDeep(data);
            let newArray: any = [];

            let today = new Date();
            this.querryData?.onGroundStatus?.forEach((og: any) => {
              let ogArrivalData = new Date(og?.arrivalDate);
              if (ogArrivalData <= today) {
                let obj = cloneData.find(
                  (cd: any) =>
                    cd?.patientConfirmationId === og?.patientConfirmationId
                );
                newArray.push(obj);
              }
            });
            this.patientConfirmationData = newArray;
          }
          if (
            this.data?.title === "Upcoming Arrival" ||
            this.data?.title === "On Ground Patient"
          ) {
            this.getPatientItinerary();
          }
          this.isPatientLoading = false;
        },
        (err) => {
          this.isPatientLoading = false;
        }
      );
  }

  close() {
    this.data.title = "";
    this.matRef.close();
    if (!!this.newActionSelected) {
      this.sharedService.callApiForCompletedAndFinance.next(true);
    }
  }

  inputValue = "";
  filteredMentions = [];
  showDropdown = false;

  onInputChange(event: Event) {
    const inputText = (event.target as HTMLInputElement).value;
    this.comment = inputText;
    this.commentForm.patchValue({
      comment: inputText,
    });
  }

  onFileChange(e: any) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
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
          file["url"] = reader.result as string;
        };
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      this.fileList.push(file);
    });
  }

  deleteFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }
  isRecording = false;
  recordedAudio: string;
  audioList: string[] = [];

  mediaRecorder: MediaRecorder;
  recordedChunks: any[] = [];
  recordings: any[] = [];
  audioElement: HTMLAudioElement;

  startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.isRecording = true;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.addEventListener("dataavailable", (event: any) => {
          this.recordedChunks.push(event.data);
        });
        this.mediaRecorder.addEventListener("stop", () => {
          const recording = new Blob(this.recordedChunks, {
            type: "audio/mpeg",
          });

          let file = new File([recording], `rec-${Date.now()}.mp3`, {
            type: recording.type,
          });
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener("load", function () {
            file["url"] = reader.result;
          });
          this.fileList.push(file);
          this.recordings.push(recording);
          this.recordedChunks = [];
        });
        this.mediaRecorder.start();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
  playRecording(recording: any) {
    const url = URL.createObjectURL(recording);
    this.audioElement.src = url;
    this.audioElement.play();
  }
  stopPlaying() {
    this.audioElement.pause();
  }
  deleteRecording(recording: any) {
    this.audioElement.pause();
    const index = this.recordings.indexOf(recording);
    if (index > -1) {
      this.recordings.splice(index, 1);
    }
  }

  deleteFiles(index: number) {
    if (index !== -1) {
      this.fileList.splice(index, 1);
    }
  }

  isCommentButtonEnable() {
    if (
      !!this.commentForm?.get("comment")?.value ||
      this.commentForm?.get("selectedUser")?.value?.length ||
      !!this.fileList?.length
    ) {
      return false;
    }
    return true;
  }

  @ViewChild("selectAllCheckbox") selectAllCheckbox: ElementRef;
  onSubmit() {
    if (this.commentForm.valid) {
      let mentionArray = [];
      if (this.commentForm?.get("selectedUser")?.value?.length) {
        this.commentForm?.get("selectedUser")?.value?.forEach((user: any) => {
          let obj = {
            userId: !user?.name?.includes("Follow up") ? user?._id : null,
            userName: user?.name,
            userType: !user?.name?.includes("Follow up")
              ? user?.userType
              : null,
            emailId: !user?.name?.includes("Follow up") ? user?.emailId : null,
            contact: !user?.name?.includes("Follow up") ? user?.contact : null,
          };
          mentionArray.push(obj);
        });
      }

      let formData = new FormData();
      formData.append("mention", JSON.stringify(mentionArray));
      formData.append("message", this.commentForm?.get("comment")?.value);
      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("fileFirst", this.fileList[i]);
      }
      this.hospitalService
        .addComment(formData, this.querryData?._id)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.chatArray = [];
          this.commentForm.reset();
          this.selectedUser = [];
          this.scrollCalled = false;
          this.fileList = [];
          this.commentParams.page = 1;
          this.selectAllCheckbox["checked"] = false;
          this.getComment();
        });
    } else {
      this.commentForm.markAllAsTouched();
    }
  }

  // move to button code

  actionComment = new FormControl("");
  actionSelected = "";
  showCommentField = false;

  addCommentField(action: string) {
    this.showFollowUpField = false;
    if (this.showPatientItineraryForm) {
      this.showPatientItineraryForm = false;
    }
    if (this.showHospitalUHIDForm) {
      this.showHospitalUHIDForm = false;
    }

    this.showCommentField = true;
    this.actionSelected = action;
    this.newActionSelected = action;
  }

  back() {
    this.newActionSelected = "";
    this.actionSelected = "";
    this.actionComment.reset();
    this.showCommentField = false;
  }

  actionSubmit() {
    if (this.actionSelected === "both") {
      this.moveToCompletedQuery();
    } else if (this.actionSelected === "completed") {
      this.moveToCompletedQuery();
    } else if (this.actionSelected === "finance") {
      this.moveToFinanceQuery();
    } else if (this.actionSelected === "patientItinerary") {
      this.addPatientItinerary();
    }
  }

  newActionSelected = "";

  moveToCompletedQuery() {
    let payload = {
      comment: this.actionComment.value,
    };
    this.hospitalService
      .moveToCompletedQuery(this.querryData?._id, payload)
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        if (this.actionSelected !== "both") {
          this.actionSelected = "";
          this.actionComment.reset();
          this.showCommentField = false;
          this.close();
        } else {
          this.moveToFinanceQuery();
        }
      });
  }

  moveToFinanceQuery() {
    let payload = {
      comment: this.actionComment.value,
    };
    this.hospitalService
      .moveToFinanceQuery(this.querryData?._id, payload)
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.actionSelected = "";
        this.actionComment.reset();
        this.showCommentField = false;
        this.close();
      });
  }

  // patient itinerary code

  showPatientItineraryForm = false;
  patientItineraryForm: FormGroup;
  isPatientItineraryLoading: boolean = true;
  patientItineraryData: any = [];
  piFile = [];

  getPatientItinerary() {
    this.isPatientItineraryLoading = true;
    this.hospitalService
      .getPatientItinerary(this.querryData?._id)
      .subscribe((res: any) => {
        this.patientItineraryData = res?.data;
        this.isPatientItineraryLoading = false;
        if (this.patientItineraryData?.length) {
          this.patientItineraryData?.forEach((pi: any) => {
            let i = this.freshPatientConfirmationDataForUHID?.findIndex(
              (fpcd: any) => fpcd?.hospitalId === pi?.hospitalId
            );
            if (i !== -1) {
              this.freshPatientConfirmationDataForUHID?.splice(i, 1);
            }
          });
        }
      });
  }

  addPatientItineraryForm() {
    if (this.showCommentField) {
      this.showCommentField = false;
    }
    if (this.showHospitalUHIDForm) {
      this.showHospitalUHIDForm = false;
    }
    this.showPatientItineraryForm = true;
    this.buildPiForm();
    this.actionSelected = "patientItinerary";

    this.onSelectHospital(this.freshPatientConfirmationData?.at(-1));
  }

  buildPiForm() {
    this.patientItineraryForm = this.fb.group({
      patientConfirmationId: ["", [Validators.required]],
      hospitalId: ["", [Validators.required]],
      hospitalName: [
        {
          value: "",
          disabled: this.isPiEdit ? true : false,
        },
        [Validators.required],
      ],
      arrivalDate: ["", [Validators.required]],
      hospitalUHID: [""],
      flightName: [""],
      flightNo: [""],
      simCard: [""],
      hotelName: [""],
      hotelLocation: [""],
      hotelMapLink: ["", [Validators.pattern(regexService.linkRegexPattern)]],
      appointmentDate: [""],
      doctorName: [""],
      driverName: [""],
      pickUpLocation: [""],
      dropLocation: [""],
      pickupRequired: [false],
      carDetails: [""],
      carType: [""],
      driverNumber: ["", [Validators.pattern(regexService.contactRegex)]],
      file: [""],
      remarks: [""],
      patient: [""],
    });
  }

  onSelectHospital(item: any) {
    this.patientItineraryForm.reset({
      pickupRequired: false,
    });
    let obj: any;
    if (this.patientItineraryData?.length) {
      obj = this.patientItineraryData?.find(
        (data: any) => data?.hospitalId === item?.hospitalId
      );
    }

    if (!!obj) {
      this.patientItineraryForm.patchValue({
        patientConfirmationId: obj?.patientConfirmationId,
        hospitalId: obj?.hospitalId,
        hospitalName: obj?.hospitalName,
        arrivalDate: obj?.arrivalDate,
        hospitalUHID: obj?.hospitalUHID || "",
        flightName: obj?.flightName || "",
        flightNo: obj?.flightNo || "",
        simCard: obj?.simCard || "",
        hotelName: obj?.hotelName || "",
        hotelLocation: obj?.hotelLocation || "",
        hotelMapLink: obj?.hotelMapLink || "",
        appointmentDate: obj?.appointmentDate || "",
        doctorName: obj?.doctorName || "",
        driverName: obj?.driverName || "",
        pickUpLocation: obj?.pickUpLocation || "",
        dropLocation: obj?.dropLocation || "",
        pickupRequired: obj?.pickupRequired,
        carDetails: obj?.carDetails || "",
        carType: obj?.carType || "",
        driverNumber: obj?.driverNumber || "",
        file: obj?.coordinatorPhoto || "",
        remarks: obj?.remarks || "",
        patient: this.querryData?._id,
      });
      this.piEditObj = obj;
    } else {
      this.piEditObj = {};
      this.patientItineraryForm?.patchValue({
        patientConfirmationId: item?.patientConfirmationId,
        hospitalId: item?.hospitalId,
        hospitalName: item?.hospitalName,
        arrivalDate: item?.arrivalDate,
        flightName: item?.flightName || "",
        flightNo: item?.flightNo || "",
        patient: this.querryData?._id,
        remarks: item?.remarks,
        hospitalUHID: "",
        simCard: "",
        hotelName: "",
        hotelLocation: "",
        hotelMapLink: "",
        appointmentDate: "",
        doctorName: "",
        carDetails: "",
        carType: "",
        driverNumber: "",
        file: "",
        driverName: "",
        pickUpLocation: "",
        dropLocation: "",
      });
    }
  }

  onFileUploaded(e: any) {
    this.piFile = [];
    let file = e.target.files[0];
    if (file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      file["url"] = fileUrl;
    } else if (
      file.type.includes("application") &&
      file.type !== "application/pdf"
    ) {
      const fileUrl = URL.createObjectURL(file);
      file["url"] = fileUrl;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        file["url"] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    this.piFile.push(file);
    this.patientItineraryForm.patchValue({
      file: file,
    });
  }

  backPI() {
    this.patientItineraryForm.reset();
    this.showPatientItineraryForm = false;
    this.piFile = [];
    this.actionSelected = "";
    if (this.isPiEdit) {
      this.isPiEdit = false;
      this.piEditObj = {};
    }
  }

  addPatientItinerary() {
    if (this.patientItineraryForm.valid) {
      let payload = this.patientItineraryForm?.value;
      if (this.isPiEdit) {
        payload.hospitalName = this.piEditObj?.hospitalName;
      }
      let formData = new FormData();
      for (const key in payload) {
        formData.append(key, payload[key]);
      }
      this.hospitalService
        .addPatientItinerary(formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.getPatientItinerary();
          this.patientItineraryForm.reset();
          this.showPatientItineraryForm = false;
          this.showHospitalUHIDForm = false;
          this.piFile = [];
          this.actionSelected = "";
          if (this.isPiEdit) {
            this.isPiEdit = false;
            this.piEditObj = {};
          }
        });
    } else {
      this.patientItineraryForm.markAllAsTouched();
    }
  }

  textCopied = false;
  copyData(item: any) {
    let text = `
    Hi,
    Patient Name - ${this.querryData?.name}
    Country - ${this.querryData?.country} 
    Arriving on - ${
      this.datePipe.transform(item?.arrivalDate, "medium") || "NIL"
    }
    Flight Details :
    Flight Name - ${item?.flightName || "NIL"}
    Flight Number - ${item?.flightNo || "NIL"}
    Hospital - ${item?.hospitalName}
    To arrange pickup from the hospital team and we need the following details:
    Sim card number - ${item?.simCard || "NIL"}
    Accommodation details :
    Hotel Name - ${item?.hotelName || "NIL"}
    Hotel Location - ${item?.hotelLocation || "NIL"}
    Hotel Map Link - ${item?.hotelMapLink || "NIL"}
    Pickup Location - ${item?.pickUpLocation || "NIL"}
    Drop Location - ${item?.dropLocation || "NIL"}
    Pickup confirmation - ${item?.pickupRequired ? "Yes" : "No"}
    Appointment Date Confirmation - ${
      this.datePipe.transform(item?.appointmentDate, "medium") || "NIL"
    }
    Please fill this out & confirm the details asap so we can arrange for the same
    Thanks!`;

    navigator.clipboard.writeText(text);
    this.textCopied = true;

    this.sharedService.showNotification(
      "snackBar-success",
      "Itinerary copied successfully"
    );

    setTimeout(() => {
      this.textCopied = false;
    }, 5000);
  }

  isPiEdit = false;
  piEditObj: any;

  editPi(item: any) {
    this.isPiEdit = true;
    this.showPatientItineraryForm = true;
    this.actionSelected = "patientItinerary";
    this.buildPiForm();
    this.piEditObj = item;
    this.patientItineraryForm.patchValue({
      ...item,
      patient: this.querryData?._id,
    });
  }

  showHospitalUHIDForm = false;

  addHospitalUHIDForm() {
    if (this.showCommentField) {
      this.showCommentField = false;
    }
    if (this.showPatientItineraryForm) {
      this.showPatientItineraryForm = false;
    }
    this.showHospitalUHIDForm = true;
    this.buildUHIDForm();
    this.actionSelected = "patientItinerary";

    this.onSelectHospitalForUHID(
      this.freshPatientConfirmationDataForUHID?.at(-1)
    );
  }

  buildUHIDForm() {
    this.patientItineraryForm = this.fb.group({
      patientConfirmationId: ["", [Validators.required]],
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      hospitalUHID: [""],
      patient: [this.querryData?._id],
    });
  }

  onSelectHospitalForUHID(item: any) {
    this.patientItineraryForm?.patchValue({
      patientConfirmationId: item?.patientConfirmationId,
      hospitalId: item?.hospitalId,
      hospitalName: item?.hospitalName,
    });
  }

  backUHID() {
    this.patientItineraryForm.reset();
    this.showHospitalUHIDForm = false;
    this.actionSelected = "";
  }

  showFollowUpField = false;
  followUpForm: FormGroup;
  openFollowUp() {
    if (!this.showFollowUpField) {
      this.followUpForm = this.fb.group({
        followUpDate: ["", [Validators.required]],
      });
      this.showFollowUpField = true;
      this.showCloseFollowUpField = false;
      this.showPatientItineraryForm = false;
      this.showHospitalUHIDForm = false;
      this.showCommentField = false;
    }
  }

  closeFollowUpFormGroup: FormGroup;
  showCloseFollowUpField = false;
  closeFollowUp() {
    if (!this.showCloseFollowUpField) {
      this.closeFollowUpFormGroup = this.fb.group({
        comment: ["", [Validators.required]],
      });
      this.showCloseFollowUpField = true;
      this.showFollowUpField = false;
      this.showPatientItineraryForm = false;
      this.showHospitalUHIDForm = false;
      this.showCommentField = false;
    }
  }

  backCloseFollowup() {
    this.closeFollowUpFormGroup.reset();
    this.showCloseFollowUpField = false;
  }

  backFollowup() {
    this.showFollowUpField = false;
    this.followUpForm.reset();
  }

  addFollowUp() {
    if (this.followUpForm?.valid) {
      let payload = {
        patient: this.patientData?._id,
        followUpDate: this.followUpForm?.getRawValue()?.followUpDate,
      };
      this.hospitalService.addFollowUp(payload).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.subjectService.followUpApiRecallSubject.next(true);
        this.showFollowUpField = false;
        this.data.title = "";
        this.matRef.close();
      });
    } else {
      this.followUpForm?.markAllAsTouched();
    }
  }

  submitCloseFollowUp() {
    if (this.closeFollowUpFormGroup.valid) {
      let values = this.closeFollowUpFormGroup.getRawValue();
      let payload = {
        patient: this.patientData?._id,
        comment: values?.comment,
      };

      this.hospitalService.closeFollowUp(payload).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.subjectService.followUpApiRecallSubject.next(true);
        this.data.title = "";
        this.closeFollowUpFormGroup.reset();
        this.showCloseFollowUpField = false;
        this.matRef.close();
      });
    } else {
      this.closeFollowUpFormGroup.markAllAsTouched();
    }
  }

  followUpMentionArray = [];
  getFollowUpMention(selectAll: any) {
    this.sharedService.getFollowUpMention().subscribe((res: any) => {
      this.followUpMentionArray = res?.data;
      let newArray: any = [];
      if (this.followUpMentionArray?.length > 0) {
        newArray = this.followUpMentionArray.map((re: any) => {
          const randomPart = Math.random().toString(36).substring(2, 10);
          const timestamp = Date.now().toString(36);
          let newObj = {
            name: re,
            userType: null,
            emailId: null,
            _id: `${randomPart}-${timestamp}`,
          };
          return newObj;
        });

        let newUserArray = [...newArray, ...this.userData];

        this.userData = newUserArray;
        this.freshUserData = newUserArray;
      }

      if (selectAll) {
        let newArr = cloneDeep(this.userData);
        newArr?.map((d: any) => {
          if (d?.userType !== "referral partner") {
            if (d?.userType) {
              const isConfirmationMentionAlreadySelected =
                this.selectedUser.some(
                  (selectedMention) => selectedMention._id === d._id
                );

              if (!isConfirmationMentionAlreadySelected) {
                this.selectedUser.push(d);
              }
            }
          }
        });

        this.commentForm.patchValue({
          selectedUser: this.selectedUser,
        });
      }
    });
  }
}
