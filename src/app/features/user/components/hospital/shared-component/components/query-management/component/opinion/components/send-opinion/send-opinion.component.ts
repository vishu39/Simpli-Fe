import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import { regexService } from "src/app/core/service/regex";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { hospitalAdminUserType } from "src/app/core/models/role";
import { cloneDeep } from "lodash";
import { FollowupModalComponent } from "src/app/shared/components/dialogs/followup-modal/followup-modal.component";
import { log } from "node:console";

@Component({
  selector: "shared-send-opinion",
  templateUrl: "./send-opinion.component.html",
  styleUrls: ["./send-opinion.component.scss"],
})
export class SendOpinionComponent implements OnInit {
  sendToArray = [
    {
      title: "Referral Partner",
      value: hospitalAdminUserType.referralPartner,
    },
    { title: "Patient", value: "patient" },
  ];

  @Input() patientData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;
  emailFrom: FormGroup;
  hospitalArray = [];
  opinionArray = [];

  formatList = [];
  // Language Linking
  totalElementLanguage: number;
  timeoutLanguage = null;
  isLoadingLanguage = false;
  languageList = [];
  languageParams = {
    page: 1,
    limit: 20,
    search: "",
  };

  @Input() isDialogClosed: boolean = false;
  @Input() isFormChange: any = "opinion";

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailSentDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getVilSetting();
    this.getOpinionFormatType();
    this.getAllLanguages();
    this.getAllAddedOpinion();
    this.getAllAddedOpinionEdited();
    this.createForm();
    this.emailFrom.patchValue({
      targetLanguage: "en",
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isDialogClosed?.currentValue) {
      localStorage.setItem(
        `signatorySelected`,
        this.emailFrom.get("signatory")?.value
      );
    }

    if (!!changes?.isFormChange?.previousValue) {
      if (
        changes?.isFormChange?.previousValue !==
        changes?.isFormChange?.currentValue
      ) {
        localStorage.setItem(
          `signatorySelected`,
          this.emailFrom.get("signatory")?.value
        );
      }
    }
  }

  vilSettingData: any = [];
  signatoryData: any = [];
  signatoryFreshData: any = [];
  isLoadingSignatory = false;
  getVilSetting() {
    this.isLoadingSignatory = true;
    this.hospitalService.getVilSetting().subscribe((res: any) => {
      this.vilSettingData = res?.data;
      this.signatoryData = this.vilSettingData?.signatory;
      // signatory selected logic
      if (this.signatoryData?.length > 0) {
        let signatorySelectedItem =
          localStorage.getItem("signatorySelected") || "";
        if (!!signatorySelectedItem) {
          let findIndex = this.signatoryData?.findIndex(
            (sd: any) => sd?._id === signatorySelectedItem
          );
          if (!!findIndex && findIndex !== -1) {
            this.emailFrom.patchValue({
              signatory: signatorySelectedItem,
            });
            this.selectedSignatorySearch = [signatorySelectedItem];
          } else {
            this.emailFrom.patchValue({
              signatory: this.signatoryData[0]?._id,
            });
            this.selectedSignatorySearch = [this.signatoryData[0]?._id];
          }
        } else {
          this.emailFrom.patchValue({
            signatory: this.signatoryData[0]?._id,
          });
          this.selectedSignatorySearch = [this.signatoryData[0]?._id];
        }
      }
      this.signatoryFreshData = this.vilSettingData?.signatory;
      this.isLoadingSignatory = false;
    });
  }

  timeout = null;
  isSearchLoading = false;
  searchSignatory(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.signatoryFreshData);
        this.signatoryData = [];
        this.isSearchLoading = true;
        let filterData = filterArray.filter((f: any) =>
          f?.signingAuthorityName
            ?.toLowerCase()
            .includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.signatoryData = filterArray;
        this.isSearchLoading = false;
      } else {
        this.signatoryData = this.signatoryFreshData;
        this.isSearchLoading = false;
      }
    }, 600);
  }

  selectedSignatorySearch: any = [];
  onClickSignatory(item: any) {
    this.selectedSignatorySearch = [item?._id];
  }

  getPreReferralPartner() {
    this.sharedService
      .getPreReferralPartner(this.patientData?.referralPartner)
      .subscribe((res: any) => {
        this.emailFrom.patchValue({
          emailTo: res?.data?.emailId || "",
        });
        if (res?.data?.contact) {
          this.setContactNumberFromSendTo(res?.data?.contact);
        }
      });
  }

  getOwnReferralPartner() {
    this.sharedService
      .getOwnReferralPartner(this.patientData?.referralPartner)
      .subscribe((res: any) => {
        this.emailFrom.patchValue({
          emailTo: res?.data?.emailId || "",
        });
        if (res?.data?.contact) {
          this.setContactNumberFromSendTo(res?.data?.contact);
        }
      });
  }

  changeSendTo(val: string) {
    this.emailFrom.patchValue({
      sendTo: val,
      emailTo: "",
    });
    
    if (val === hospitalAdminUserType.referralPartner) {    
      if (this.patientData?.referralType === "pre") {
        this.contactArray?.clear()
        this.getPreReferralPartner();
      } else if (this.patientData?.referralType === "own") {
        this.contactArray?.clear()
        this.getOwnReferralPartner();
      }else{
        this.contactArray?.clear()
      }
    } else if (val === "patient") {
      this.emailFrom.patchValue({
        emailTo: this.patientData?.emailId || "",
      });
      this.contactArray?.clear()
      if (this.patientData?.contact) {
        this.setContactNumberFromSendTo(this.patientData?.contact);
      }
    }
  }

  getOpinionFormatType() {
    this.isDataLoading = true;
    this.sharedService.getOpinionFormatType().subscribe(
      (res: any) => {
        if (res?.data) {
          this.formatList = res?.data;
          this.emailFrom.patchValue({
            format: this.formatList[0]?.value,
          });
          this.isDataLoading = false;
        }
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  getAllLanguages() {
    if (this.isLoadingLanguage) {
      return;
    }
    this.isLoadingLanguage = true;

    this.sharedService
      .getCmsData("getAllLanguage", this.languageParams)
      .subscribe((res: any) => {
        this.languageList.push(...res.data.content);
        this.totalElementLanguage = res.data.totalElement;
        this.languageParams.page = this.languageParams.page + 1;
        this.isLoadingLanguage = false;
      });
  }
  onInfiniteScrollLanguage(): void {
    if (this.languageList.length < this.totalElementLanguage) {
      this.getAllLanguages();
    }
  }

  searchLanguage(filterValue: string) {
    clearTimeout(this.timeoutLanguage);
    this.timeoutLanguage = setTimeout(() => {
      this.languageParams.search = filterValue.trim();
      this.languageParams.page = 1;
      this.languageList = []; // Clear existing data when searching
      this.isLoadingLanguage = false;
      this.getAllLanguages();
    }, 600);
  }

  createForm() {
    this.emailFrom = this.fb.group({
      sendTo: ["", [Validators.required]],
      emailTo: ["", [Validators.pattern(regexService.emailRegex)]],
      emailCc: this.fb.array([]),
      selectHospital: ["", [Validators.required]],
      hospital: [],
      targetLanguage: [null, [Validators.required]],
      format: ["", [Validators.required]],
      signatory: ["", [Validators.required]],
      sendOpinion: {},
      patient: this.patientData?._id,
      contact: this.fb.array([]),
    });

    this.changeSendTo(hospitalAdminUserType.referralPartner);
  }

  get emailArray(): FormArray {
    return this.emailFrom.get("emailCc") as FormArray;
  }

  addCc() {
    this.emailArray.push(this.createEmailCcForm());
  }

  deleteCc(i: number) {
    this.emailArray.removeAt(i);
  }

  createEmailCcForm() {
    return this.fb.control("", [Validators.pattern(regexService.emailRegex)]);
  }

  isDataLoading = true;
  getAllAddedOpinion() {
    this.isDataLoading = true;
    this.hospitalService.getAllAddedOpinion(this.patientData?._id).subscribe(
      (res: any) => {
        if (res?.data) {
          this.request = res?.data;
          this.isDataLoading = false;
        }
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  isEditedDataLoading = true;
  getAllAddedOpinionEdited() {
    this.isEditedDataLoading = true;
    this.hospitalService
      .getAllAddedOpinionEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.requestEdited = res?.data;
            this.isEditedDataLoading = false;
          }
        },
        (err) => {
          this.isEditedDataLoading = false;
        }
      );
  }

  selectChange(e: any, item: any, isEdited: boolean) {
    let opinion = {
      _id: item?._id,
      isEdited,
    };
    this.emailFrom.patchValue({
      hospital: [item?.hospitalId],
      sendOpinion: [opinion],
      selectHospital: item?._id,
    });

    // if (e.checked) {
    //   let vilObj = {
    //     _id: item?._id,
    //     isEdited,
    //   };
    //   this.opinionArray.push(vilObj);
    //   this.hospitalArray.push(item?.hospitalId);
    //   this.emailFrom.patchValue({
    //     hospital: this.hospitalArray,
    //     sendOpinion: this.opinionArray,
    //     selectHospital: item?._id,
    //   });
    // } else {
    //   let hospitalIndex = this.hospitalArray.findIndex(
    //     (h: any) => h === item?.hospitalId
    //   );
    //   if (hospitalIndex !== -1) {
    //     this.hospitalArray.splice(hospitalIndex, 1);
    //   }
    //   let vilIndex = this.opinionArray.findIndex(
    //     (vil: any) => vil?._id === item?._id
    //   );
    //   if (vilIndex !== -1) {
    //     this.opinionArray.splice(vilIndex, 1);
    //   }
    //   this.emailFrom.patchValue({
    //     hospital: this.hospitalArray,
    //     sendOpinion: this.opinionArray,
    //     selectHospital: item?._id,
    //   });
    //   if (!this.opinionArray?.length) {
    //     this.emailFrom.patchValue({
    //       selectHospital: "",
    //     });
    //   }
    // }
  }

  onLanguageChange(item: any) {
    // console.log(item);
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  submit() {
    if (this.emailFrom.valid) {
      let values = this.emailFrom.value;
      const {
        emailTo,
        emailCc,
        hospital,
        sendOpinion,
        patient,
        targetLanguage,
        format,
        sendTo,
        contact,
      } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        emailTo,
        emailCc,
        hospital: newHospital,
        sendOpinion,
        patient,
        targetLanguage,
        format,
        sendTo,
        signatory: this.selectedSignatorySearch,
        contact,
      };

      if (contact?.length > 0 || !!emailTo) {
        this.hospitalService.sendOpinion(payload).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          localStorage.setItem(
            `signatorySelected`,
            this.emailFrom.get("signatory")?.value
          );
          let followupPayload = {
            eventName: "Opinion",
            patient: this.patientData?._id,
          };
          this.followupPopupByEvent(followupPayload, payload);
          // this.dialogRef.close(true);
        });
      } else {
        this.sharedService.showNotification(
          "snackBar-danger",
          "Please provide either an email or a contact number."
        );
      }
    } else {
      this.emailFrom.markAllAsTouched();
    }
  }

  followupData: any;
  followupPopupByEvent(payload: any, values: any) {
    this.sharedService.followUpPopup(payload).subscribe((res: any) => {
      this.followupData = res?.data;
      if (
        this.followupData?.auto === false &&
        this.followupData?.popup === false
      ) {
        this.dialogRef.close(true);
      } else if (
        this.followupData?.auto === true ||
        this.followupData?.popup === true
      ) {
        this.openFollowupPopup(payload, values);
        this.dialogRef.close(true);
      }
    });
  }

  openFollowupPopup(payload: any, values: any) {
    const dialogRef = this.dialog.open(FollowupModalComponent, {
      width: "60%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "";
    dialogRef.componentInstance.followupData = this.followupData;
    dialogRef.componentInstance.followupPayload = payload;
    dialogRef.componentInstance.eventPayload = values;
    dialogRef.componentInstance.type = payload?.eventName;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
      }
    });
  }

  // mobile code
  get contactArray(): FormArray {
    return this.emailFrom.get("contact") as FormArray;
  }

  addContact() {
    this.contactArray.push(this.createContactForm());
  }

  deleteContact(i: number) {
    this.contactArray.removeAt(i);
  }

  createContactForm() {
    return this.fb.control("");
  }

  setContactNumberFromSendTo(val: any) {
    let control = this.fb.control(val);
    this.contactArray.push(control);
  }
}
