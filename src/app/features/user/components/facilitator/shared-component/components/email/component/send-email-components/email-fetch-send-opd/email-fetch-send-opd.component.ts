import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-email-fetch-send-opd",
  templateUrl: "./email-fetch-send-opd.component.html",
  styleUrls: ["./email-fetch-send-opd.component.scss"],
})
export class EmailFetchSendOpdComponent implements OnInit {
  @Input() patientData: any;
  @Input() emailData: any;
  emailFrom: FormGroup;
  request: any = [];
  requestEdited: any = [];
  selected: string;

  constructor(
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllOpdReceived();
    this.getAllOpdReceivedEdited();
  }

  isDataLoading = true;
  getAllOpdReceived() {
    this.isDataLoading = true;
    this.faciliatorService.getAllOpdReceived(this.patientData?._id).subscribe(
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
  getAllOpdReceivedEdited() {
    this.isEditedDataLoading = true;
    this.faciliatorService
      .getAllOpdReceivedEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            // console.log(res?.data);

            this.requestEdited = res?.data;
            this.isEditedDataLoading = false;
          }
        },
        (err) => {
          this.isEditedDataLoading = false;
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
      hospitalId: "",
      sendOpd: {},
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
    return this.fb.control("", [Validators.pattern(regexService.emailRegex)]);
  }

  selectChange(item: any, isEdited: boolean) {
    let sendOpd = {
      _id: item?._id,
      isEdited,
    };
    this.emailFrom.patchValue({
      hospitalId: item?.hospitalId,
      sendOpd: sendOpd,
      selectHospital: item?._id,
    });
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
}
