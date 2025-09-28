import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import { regexService } from "src/app/core/service/regex";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { hospitalAdminUserType } from "src/app/core/models/role";
import { cloneDeep } from "lodash";
import { FollowupModalComponent } from "src/app/shared/components/dialogs/followup-modal/followup-modal.component";

@Component({
  selector: "shared-send-proforma-invoice",
  templateUrl: "./send-proforma-invoice.component.html",
  styleUrls: ["./send-proforma-invoice.component.scss"],
})
export class SendProformaInvoiceComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;
  emailFrom: FormGroup;
  hospitalArray = [];
  proformaInvoiceArray = [];

  formatList = [];

  // Language Linking
  totalElementLanguage: number;
  timeoutLanguage = null;
  isLoadingLanguage = false;
  languageList = [];
  languageParams = {
    page: 1,
    limit: 0,
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
    this.getBankDetails();
    this.getAllLanguages();
    this.getAllProformaInvoiceRequest();
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

  createForm() {
    this.emailFrom = this.fb.group({
      emailTo: ["", [Validators.pattern(regexService.emailRegex)]],
      emailCc: this.fb.array([]),
      selectHospital: ["", [Validators.required]],
      hospital: [],
      sendProformaInvoice: {},
      patient: this.patientData?._id,
      format: ["", [Validators.required]],
      bankAccountId: ["", [Validators.required]],
      targetLanguage: ["", [Validators.required]],
      sendTo: ["", [Validators.required]],
      signatory: ["", [Validators.required]],
      contact: this.fb.array([]),
    });
    this.changeSendTo(hospitalAdminUserType.referralPartner);
  }

  sendToArray = [
    {
      title: "Referral Partner",
      value: hospitalAdminUserType.referralPartner,
    },
    { title: "Patient", value: "patient" },
  ];
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
      emailTo: ""
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

  isDataNewLoading = true;
  proformaInvoiceRequestData = [];
  getAllProformaInvoiceRequest() {
    this.isDataNewLoading = true;
    this.hospitalService
      .getAllProformaInvoiceRequest(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.proformaInvoiceRequestData = res?.data;
            if (this.proformaInvoiceRequestData?.length) {
              this.getAllAddedOpinion();
              this.getAllAddedOpinionEdited();
            }
            this.isDataNewLoading = false;
          }
        },
        (err) => {
          this.isDataNewLoading = false;
        }
      );
  }

  isDataLoading = true;
  getAllAddedOpinion() {
    this.isDataLoading = true;
    this.hospitalService.getAllAddedOpinion(this.patientData?._id).subscribe(
      (res: any) => {
        if (res?.data?.length > 0) {
          let array = [];
          if (this.proformaInvoiceRequestData?.length) {
            this.proformaInvoiceRequestData?.forEach((piD: any) => {
              res?.data?.forEach((res: any) => {
                if (res?.hospitalId === piD?.hospitalId) {
                  if (!!res?.hospitalId) {
                    array.push(res);
                  }
                }
              });
            });
          }
          this.request = array;
        }
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  isEditedDataLoading = false;
  getAllAddedOpinionEdited() {
    this.isEditedDataLoading = true;
    this.hospitalService
      .getAllAddedOpinionEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data?.length > 0) {
            let array = [];
            if (this.proformaInvoiceRequestData?.length) {
              this.proformaInvoiceRequestData?.forEach((piD: any) => {
                res?.data?.forEach((res: any) => {
                  if (res?.hospitalId === piD?.hospitalId) {
                    if (!!res?.hospitalId) {
                      array.push(res);
                    }
                  }
                });
              });
            }
            this.requestEdited = array;
          }
          this.isEditedDataLoading = false;
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
      sendProformaInvoice: [opinion],
      selectHospital: item?._id,
    });
    // if (e.checked) {
    //   let vilObj = {
    //     _id: item?._id,
    //     isEdited,
    //   };
    //   this.proformaInvoiceArray.push(vilObj);
    //   this.hospitalArray.push(item?.hospitalId);
    //   this.emailFrom.patchValue({
    //     hospital: this.hospitalArray,
    //     sendProformaInvoice: this.proformaInvoiceArray,
    //     selectHospital: item?._id,
    //   });
    // } else {
    //   let hospitalIndex = this.hospitalArray.findIndex(
    //     (h: any) => h === item?.hospitalId
    //   );
    //   if (hospitalIndex !== -1) {
    //     this.hospitalArray.splice(hospitalIndex, 1);
    //   }
    //   let vilIndex = this.proformaInvoiceArray.findIndex(
    //     (vil: any) => vil?._id === item?._id
    //   );
    //   if (vilIndex !== -1) {
    //     this.proformaInvoiceArray.splice(vilIndex, 1);
    //   }
    //   this.emailFrom.patchValue({
    //     hospital: this.hospitalArray,
    //     sendProformaInvoice: this.proformaInvoiceArray,
    //     selectHospital: item?._id,
    //   });
    //   if (!this.proformaInvoiceArray?.length) {
    //     this.emailFrom.patchValue({
    //       selectHospital: "",
    //     });
    //   }
    // }
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  bankDetailsData = [];
  getBankDetails() {
    this.hospitalService.getBankDetails().subscribe((res: any) => {
      if (res?.data.length) {
        this.bankDetailsData = res?.data[0]?.bankAccount;
      }
    });
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

  submit() {
    if (this.emailFrom.valid) {
      let values = this.emailFrom.value;
      const {
        emailTo,
        emailCc,
        hospital,
        sendProformaInvoice,
        patient,
        format,
        bankAccountId,
        targetLanguage,
        sendTo,
        contact,
      } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        emailTo,
        emailCc,
        hospital: newHospital,
        sendOpinion: sendProformaInvoice,
        patient,
        format,
        bankAccountId,
        targetLanguage,
        sendTo,
        signatory: this.selectedSignatorySearch,
        contact,
      };
      if (contact?.length > 0 || !!emailTo) {
        this.hospitalService
          .sendProformaInvoice(payload)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            localStorage.setItem(
              `signatorySelected`,
              this.emailFrom.get("signatory")?.value
            );
            let followupPayload = {
              eventName: "Proforma Invoice",
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
