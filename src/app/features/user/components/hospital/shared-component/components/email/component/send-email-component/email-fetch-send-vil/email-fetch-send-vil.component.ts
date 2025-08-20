import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { cloneDeep, startCase } from "lodash";
import { hospitalAdminUserType } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import tippy from "tippy.js";

@Component({
  selector: "app-email-fetch-send-vil",
  templateUrl: "./email-fetch-send-vil.component.html",
  styleUrls: ["./email-fetch-send-vil.component.scss"],
})
export class EmailFetchSendVilComponent implements OnInit {
  @Input() patientData: any;
  @Input() emailData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;
  emailFrom: FormGroup;
  hospitalArray = [];
  vilArray = [];
  uhidCode: string = "";

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAccountDetailsAttribute();
    this.checkSentVil();
  }

  getAccountDetailsAttribute() {
    this.hospitalService.getAccountDetailsAttribute().subscribe((res: any) => {
      this.uhidCode = res?.data?.uhidCode;
    });
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
      sendVil: {},
      patient: this.patientData?._id,
      embassy: [""],
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
    { title: "Embassy", value: "embassy" },
  ];

  checkVilSentData: any = {};
  isOverrideAvailable: boolean = false;
  isOverrideLoading = true;
  checkSentVil() {
    this.isOverrideLoading = true;
    this.hospitalService.checkSentVil(this.patientData?._id).subscribe(
      (res: any) => {
        this.checkVilSentData = res?.data;
        this.getIssuedVil();
        // this.getAllVilReceived();
        // this.getAllVilReceivedEdited();
        this.createForm();

        if (!!this.checkVilSentData?.vilExist) {
          this.isOverrideAvailable = true;
        } else {
          this.isOverrideAvailable = false;
        }
        this.isOverrideLoading = false;
      },
      () => {
        this.isOverrideLoading = false;
      }
    );
  }

  overrideForm() {
    this.isOverrideAvailable = false;
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
      this.resetEmbassyData();
      if (this.patientData?.referralType === "pre") {
        this.getPreReferralPartner();
      } else if (this.patientData?.referralType === "own") {
        this.getOwnReferralPartner();
      } else {
        this.patchEmailToValue(hospitalAdminUserType.referralPartner, "");
        this.patchEmailCcValue();
      }
    } else if (val === "patient") {
      this.resetEmbassyData();
      this.patchEmailToValue(val, this.patientData?.emailId);
      this.patchEmailCcValue();
    } else if (val === "embassy") {
      this.resetEmbassyData();
      this.getEmbassyByCountry(this.patientData.country);
      this.patchEmailToValue(val, "");
      this.patchEmailCcValue();
    }
  }

  resetEmbassyData() {
    this.embasyData = [];
    this.embassyFreshData = [];
    this.selectedEmbassyArray = [];
    this.selectedEmbassySearch = [];
    this.emailFrom.patchValue({
      embassy: [...this.selectedEmbassySearch],
    });
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
    this.emailArray.removeAt(i);
  }

  createEmailCcForm() {
    return this.fb.control("", [
      Validators.pattern(regexService.emailRegexMultiple),
    ]);
  }

  isVilDataLoading: boolean = true;
  issuedVilData: any;
  getIssuedVil() {
    this.isVilDataLoading = true;
    this.hospitalService
      .getIssuedVil(this.patientData?._id)
      .subscribe((res: any) => {
        this.issuedVilData = res?.data;
        this.isVilDataLoading = false;
      });
  }

  isDataLoading = true;
  getAllVilReceived() {
    this.isDataLoading = true;
    this.hospitalService.getAllAddedVil(this.patientData?._id).subscribe(
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
  getAllVilReceivedEdited() {
    this.isEditedDataLoading = true;
    this.hospitalService.getAllAddedVilEdited(this.patientData?._id).subscribe(
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

  selectChange(e: any, item: any, isEdited: boolean, isIssuedVil = false) {
    let vilObj = {
      _id: item?._id,
      isEdited,
      isIssuedVil,
    };
    this.emailFrom.patchValue({
      hospital: [item?.hospitalId],
      sendVil: [vilObj],
      selectHospital: item?._id,
    });
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  // tooltip
  toolTip: any;
  showSendToDetailsOnHover(tooltipButton: any, item: any) {
    let eventString = "";
    if (item?.sendTo === "patient") {
      eventString = `
      <div><strong>Patient Name:</strong> ${startCase(
        item?.patient?.name
      )}</div>
      <div><strong>Email To:</strong> ${item?.emailTo || "NIL"}</div>
      <div><strong> Email Cc:</strong> ${
        item?.emailCc?.length > 0 ? item?.emailCc?.join(", ") : "NIL"
      }</div>
`;
    } else if (item?.sendTo === "referral partner") {
      eventString = `
      <div><strong>Email To:</strong> ${item?.emailTo || "NIL"}</div>
      <div><strong> Email Cc:</strong> ${
        item?.emailCc?.length > 0 ? item?.emailCc?.join(", ") : "NIL"
      }</div>      
`;
    } else if (item?.sendTo === "embassy") {
      eventString = `
      <div><strong>Email To:</strong> ${item?.emailTo || "NIL"}</div>
      <div><strong> Email Cc:</strong> ${
        item?.emailCc?.length > 0 ? item?.emailCc?.join(", ") : "NIL"
      }</div>      
`;
    }
    let tooltipInstance: any = tippy(tooltipButton, {
      content: eventString,
      trigger: "hover",
      placement: "right",
      theme: "custom",
      allowHTML: true,
      delay: [0, 0],
      duration: [0, 0],
      onShow(instance) {
        instance.popper.style.backgroundColor = "white";
        instance.popper.style.color = "black";
        instance.popper.style.border = "1px solid lightgrey";
        instance.popper.style.borderRadius = "8px";
        instance.popper.style.padding = "12px";
        instance.popper.style.width = "400px";
      },
    });

    this.toolTip = tooltipInstance;

    tooltipInstance.show();
  }

  hideDetails(tooltipButton: any, item: any) {
    this.toolTip.hide();
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  // embasy variable
  isLoadingEmbasy: boolean = false;
  isLoadingEmbasySelectAll: boolean = false;
  embasyData = [];
  embassyFreshData = [];
  selectedEmbassySearch = [];
  timeoutEmbassy = null;
  selectedEmbasy = {};

  getEmbassyByCountry(countryName, selectAll: Boolean = false) {
    if (this.isLoadingEmbasy) {
      return;
    }
    this.isLoadingEmbasy = true;
    this.sharedService
      .getCmsData(`getEmbassyByCountry/${countryName}`, {})
      .subscribe((res: any) => {
        // if (selectAll) {
        //   this.embasyData = [];
        // }
        this.embasyData.push(...res?.data);
        this.embassyFreshData = this.embasyData;
        this.isLoadingEmbasy = false;

        // if (selectAll) {
        //   const allEmbassy = this.embasyData;

        //   allEmbassy?.forEach((emabssy: any) => {
        //     const isEmbassyAlreadySelected = this.selectedEmbassySearch?.some(
        //       (selectedEmbassy) => selectedEmbassy._id === emabssy._id
        //     );

        //     if (!isEmbassyAlreadySelected) {
        //       this.selectedEmbassySearch.push({
        //         _id: emabssy?._id,
        //         name: emabssy?.name,
        //       });
        //       this.selectedEmbassyArray.push(emabssy);
        //       this.patchEmailToAndCC();
        //     }
        //   });

        //   this.emailFrom.patchValue({
        //     embassy: this.selectedEmbassySearch,
        //   });
        //   this.isLoadingEmbasySelectAll = false;
        // }
      });
  }

  searchEmbassy(filterValue: string) {
    clearTimeout(this.timeoutEmbassy);
    this.timeoutEmbassy = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.embassyFreshData);
        this.embasyData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.embasyData = filterArray;
      } else {
        this.embasyData = this.embassyFreshData;
      }
    }, 600);
  }

  selectAllEmbassy(event: any) {
    // if (event.checked) {
    //   this.isLoadingEmbasySelectAll = true;
    //   this.getEmbassyByCountry(this.patientData?.country, true);
    // } else {
    //   this.selectedEmbassySearch = [];
    //   this.patchEmailToAndCC();
    //   let formArray = this.emailArray?.value;
    //   if (formArray.length > 0) {
    //     formArray?.forEach((fa: any, index: any) => {
    //       this.emailArray.removeAt(index);
    //     });
    //   }
    //   this.emailFrom.patchValue({
    //     embassy: [],
    //     emailTo: "",
    //   });
    // }
  }

  selectedEmbassyArray: any[] = [];
  emailCcFormControls = {};
  emailCcPushedAtZeroIndex = false;

  onClickEmbassy(item: any) {
    const index = this.selectedEmbassySearch.findIndex(
      (element) => element._id === item._id
    );

    if (index !== -1) {
      // Item exists, remove it
      this.selectedEmbassySearch.splice(index, 1);
      this.selectedEmbassyArray.splice(index, 1);
      this.patchEmailToAndCC();
    } else {
      // Add new item
      this.selectedEmbassySearch.push({
        _id: item._id,
        name: item.name,
      });
      this.selectedEmbassyArray.push(item);
      this.patchEmailToAndCC();
    }

    this.emailFrom.patchValue({
      embassy: [...this.selectedEmbassySearch],
    });
  }

  patchEmailToAndCC() {
    const emailToArray: any[] = [...this.emailToArrayOfString];
    const emailCcArray = [...this.emailCcArrayOfString];

    if (this.selectedEmbassyArray.length > 0) {
      this.selectedEmbassyArray?.forEach((embassy: any) => {
        if (embassy.emailTo1) emailToArray.push(embassy.emailTo1);
        if (embassy.emailTo2) emailToArray.push(embassy.emailTo2);
        if (embassy.emailCc1) emailCcArray.push(embassy?.emailCc1);
        if (embassy.emailCc2) emailCcArray.push(embassy?.emailCc2);
      });

      this.emailFrom.patchValue({
        emailTo: emailToArray.join(", "),
      });

      if (emailCcArray?.length > 0) {
        let emailCcString = emailCcArray?.join(", ");
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
    } else {
      if (this.emailCcPushedAtZeroIndex && !emailCcArray?.length) {
        this.emailArray.removeAt(0);
        this.emailCcPushedAtZeroIndex = false;
      }
      this.emailFrom.patchValue({
        emailTo: emailToArray.join(", "),
      });
    }
  }
}
