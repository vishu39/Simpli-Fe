import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { cloneDeep } from "lodash";
import { hospitalAdminUserType } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-email-fetch-send-proforma",
  templateUrl: "./email-fetch-send-proforma.component.html",
  styleUrls: ["./email-fetch-send-proforma.component.scss"],
})
export class EmailFetchSendProformaComponent implements OnInit {
  @Input() patientData: any;
  @Input() emailData: any;
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
    private fb: FormBuilder
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
      emailTo: [
        "",
        [
          Validators.required,
          Validators.pattern(regexService.emailRegexMultiple),
        ],
      ],
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
    });

    let fromEmailString: any = this.extractEmails(this.emailData?.from);
    let emailToArray = this.extractEmails(this.emailData?.to);

    if (emailToArray?.length > 0) {
      let similarEmailIndex = emailToArray?.findIndex(
        (eTA: any) => eTA === fromEmailString?.[0]
      );
      if (similarEmailIndex !== -1) {
        emailToArray?.splice(similarEmailIndex, 1);
      }
    }

    this.emailToArrayOfString = [...fromEmailString, ...emailToArray];
    this.emailCcArrayOfString = this.extractEmails(this.emailData?.cc);

    if (this.emailToArrayOfString?.length > 0) {
      let findSameOriginIndex = this.emailToArrayOfString?.findIndex(
        (eTA: any) => eTA === this.emailData?.origin
      );
      if (findSameOriginIndex !== -1) {
        this.emailToArrayOfString?.splice(findSameOriginIndex, 1);
      }
    }

    if (this.emailCcArrayOfString?.length > 0) {
      let findSameOriginIndex = this.emailCcArrayOfString?.findIndex(
        (eTA: any) => eTA === this.emailData?.origin
      );
      if (findSameOriginIndex !== -1) {
        this.emailCcArrayOfString?.splice(findSameOriginIndex, 1);
      }
    }

    this.changeSendTo(hospitalAdminUserType.referralPartner);
  }

  emailToArrayOfString: String[] = [];
  emailCcArrayOfString: String[] = [];
  extractEmails(input: string): string[] {
    if (!input || typeof input !== "string") {
      return [];
    }
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = input.match(emailRegex);
    return emails ? emails : [];
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
        this.patchEmailToValue(
          hospitalAdminUserType.referralPartner,
          res?.data?.emailId
        );
        this.patchEmailCcValue();
      });
  }

  getOwnReferralPartner() {
    this.sharedService
      .getOwnReferralPartner(this.patientData?.referralPartner)
      .subscribe((res: any) => {
        this.patchEmailToValue(
          hospitalAdminUserType.referralPartner,
          res?.data?.emailId
        );
        this.patchEmailCcValue();
      });
  }

  changeSendTo(val: string) {
    this.emailFrom.patchValue({
      sendTo: val,
    });

    if (val === hospitalAdminUserType.referralPartner) {
      if (this.patientData?.referralType === "pre") {
        this.getPreReferralPartner();
      } else if (this.patientData?.referralType === "own") {
        this.getOwnReferralPartner();
      } else {
        this.patchEmailToValue(val, "");
        this.patchEmailCcValue();
      }
    } else if (val === "patient") {
      this.patchEmailToValue(val, this.patientData?.emailId);
      this.patchEmailCcValue();
    }
  }

  patchEmailToValue(value: string, emailId: any) {
    let currentEmailToArray = this.emailToArrayOfString
      ? cloneDeep(this.emailToArrayOfString)
      : [];
    if (!!emailId) {
      currentEmailToArray.push(emailId);
      this.patchEmailToFormValue(currentEmailToArray?.join(", "));
    } else {
      this.patchEmailToFormValue(currentEmailToArray?.join(", "));
    }
  }

  patchEmailToFormValue(value: string) {
    this.emailFrom.patchValue({
      emailTo: value || "",
    });
  }

  emailCcPushedAtZeroIndex = false;
  patchEmailCcValue() {
    let currentEmailCCArray = this.emailCcArrayOfString
      ? cloneDeep(this.emailCcArrayOfString)
      : [];
    if (currentEmailCCArray?.length > 0) {
      let emailCcString = currentEmailCCArray?.join(", ");
      if (!this.emailCcPushedAtZeroIndex) {
        let fc = this.createEmailCcForm();
        fc?.patchValue(emailCcString);
        this.emailArray.insert(0, fc);
        this.emailCcPushedAtZeroIndex = true;
      } else {
        this.emailArray.at(0).patchValue(emailCcString);
      }
    } else {
      if (this.emailCcPushedAtZeroIndex) {
        this.emailArray.removeAt(0);
        this.emailCcPushedAtZeroIndex = false;
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
    if (this.emailCcPushedAtZeroIndex && i === 0) {
      this.emailCcPushedAtZeroIndex = false;
    }
    this.emailArray.removeAt(i);
  }

  createEmailCcForm() {
    return this.fb.control("", [
      Validators.pattern(regexService.emailRegexMultiple),
    ]);
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
}
