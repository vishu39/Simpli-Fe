import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { hospitalAdminUserType } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "app-email-fetch-send-opinion",
  templateUrl: "./email-fetch-send-opinion.component.html",
  styleUrls: ["./email-fetch-send-opinion.component.scss"],
})
export class EmailFetchSendOpinionComponent implements OnInit {
  sendToArray = [
    {
      title: "Referral Partner",
      value: hospitalAdminUserType.referralPartner,
    },
    { title: "Patient", value: "patient" },
  ];

  @Input() patientData: any;
  @Input() emailData: any;
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

  emailToArrayOfString: String[] = [];
  emailCcArrayOfString: String[] = [];
  createForm() {
    this.emailFrom = this.fb.group({
      sendTo: ["", [Validators.required]],
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
      targetLanguage: [null, [Validators.required]],
      format: ["", [Validators.required]],
      signatory: ["", [Validators.required]],
      sendOpinion: {},
      patient: this.patientData?._id,
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

  extractEmails(input: string): string[] {
    if (!input || typeof input !== "string") {
      return [];
    }
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = input.match(emailRegex);
    return emails ? emails : [];
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
  }

  onLanguageChange(item: any) {
    // console.log(item);
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
}
