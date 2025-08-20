import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { hospitalAdminUserType } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
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
    private hospitalService: HospitalService,
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
    this.hospitalService.getAllAddedOpd(this.patientData?._id).subscribe(
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
    this.hospitalService.getAllAddedOpdEdited(this.patientData?._id).subscribe(
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
      sendTo: ["", [Validators.required]],
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
