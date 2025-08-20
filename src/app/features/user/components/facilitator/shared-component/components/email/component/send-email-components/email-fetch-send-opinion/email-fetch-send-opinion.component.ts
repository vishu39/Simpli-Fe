import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-email-fetch-send-opinion",
  templateUrl: "./email-fetch-send-opinion.component.html",
  styleUrls: ["./email-fetch-send-opinion.component.scss"],
})
export class EmailFetchSendOpinionComponent implements OnInit {
  @Input() patientData: any;
  @Input() emailData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;
  emailFrom: FormGroup;
  hospitalArray = [];
  opinionArray = [];

  formatList = [
    {
      title: "Format 1 - Only Medical Comparison",
      value: "format1",
    },
    {
      title: "Format 2 - Details with Other information ",
      value: "format2",
    },
  ];
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

  constructor(
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllLanguages();
    this.getAllOpinionReceived();
    this.getAllOpinionReceivedEdited();
    this.createForm();
    this.emailFrom.patchValue({
      targetLanguage: "en",
      format: "format1",
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
      targetLanguage: [null, [Validators.required]],
      format: ["", [Validators.required]],
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

    this.patchEmailToValue();
    this.patchEmailCcValue();
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

  patchEmailToValue() {
    let currentEmailToArray = this.emailToArrayOfString
      ? cloneDeep(this.emailToArrayOfString)
      : [];
    this.patchEmailToFormValue(currentEmailToArray?.join(", "));
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

  isDataLoading = true;
  getAllOpinionReceived() {
    this.isDataLoading = true;
    this.faciliatorService
      .getAllOpinionReceived(this.patientData?._id)
      .subscribe(
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
  getAllOpinionReceivedEdited() {
    this.isEditedDataLoading = true;
    this.faciliatorService
      .getAllOpinionReceivedEdited(this.patientData?._id)
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
    if (e.checked) {
      let vilObj = {
        _id: item?._id,
        isEdited,
      };
      this.opinionArray.push(vilObj);
      this.hospitalArray.push(item?.hospitalId);
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendOpinion: this.opinionArray,
        selectHospital: item?._id,
      });
    } else {
      let hospitalIndex = this.hospitalArray.findIndex(
        (h: any) => h === item?.hospitalId
      );
      if (hospitalIndex !== -1) {
        this.hospitalArray.splice(hospitalIndex, 1);
      }
      let vilIndex = this.opinionArray.findIndex(
        (vil: any) => vil?._id === item?._id
      );
      if (vilIndex !== -1) {
        this.opinionArray.splice(vilIndex, 1);
      }
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendOpinion: this.opinionArray,
        selectHospital: item?._id,
      });
      if (!this.opinionArray?.length) {
        this.emailFrom.patchValue({
          selectHospital: "",
        });
      }
    }
  }

  onLanguageChange(item: any) {
    // console.log(item);
  }
}
