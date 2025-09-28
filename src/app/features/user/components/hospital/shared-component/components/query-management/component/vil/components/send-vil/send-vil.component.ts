import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import { regexService } from "src/app/core/service/regex";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { hospitalAdminUserType } from "src/app/core/models/role";
import tippy, { Instance } from "tippy.js";
import { startCase, cloneDeep } from "lodash";
import { FollowupModalComponent } from "src/app/shared/components/dialogs/followup-modal/followup-modal.component";

@Component({
  selector: "shared-send-vil",
  templateUrl: "./send-vil.component.html",
  styleUrls: ["./send-vil.component.scss"],
})
export class SendVilComponent implements OnInit {
  @Input() patientData: any;
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
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailSentDialogComponent>,
    private dialog: MatDialog
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
      emailTo: ["", [Validators.pattern(regexService.emailRegexMultiple)]],
      emailCc: this.fb.array([]),
      selectHospital: ["", [Validators.required]],
      hospital: [],
      sendVil: {},
      patient: this.patientData?._id,
      embassy: [""],
      sendTo: ["", [Validators.required]],
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
      this.resetEmbassyData();
      if (this.patientData?.referralType === "pre") {
        this.contactArray?.clear();
        this.getPreReferralPartner();
      } else if (this.patientData?.referralType === "own") {
        this.contactArray?.clear();
        this.getOwnReferralPartner();
      } else {
        this.contactArray?.clear();
      }
    } else if (val === "patient") {
      this.resetEmbassyData();
      this.emailFrom.patchValue({
        emailTo: this.patientData?.emailId || "",
      });
      this.contactArray?.clear();
      if (this.patientData?.contact) {
        this.setContactNumberFromSendTo(this.patientData?.contact);
      }
    } else if (val === "embassy") {
      this.resetEmbassyData();
      this.getEmbassyByCountry(this.patientData.country);
      this.emailFrom.patchValue({
        emailTo: "",
      });
      this.contactArray?.clear();
      // if (this.patientData?.contact) {
      //   this.setContactNumberFromSendTo(this.patientData?.contact);
      // }
    }
  }

  resetEmbassyData() {
    this.embasyData = [];
    this.embassyFreshData = [];
    this.selectedEmbasy = {};
    this.selectedEmbassyArray = [];
    this.selectedEmbassySearch = [];
    this.emailFrom.patchValue({
      embassy: [...this.selectedEmbassySearch],
    });
    this.patchEmailToAndCC();
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
    // let vilObj = {
    //   _id: item?._id,
    //   isEdited,
    //   isIssuedVil,
    // };
    // this.emailFrom.patchValue({
    //   hospital: [item?.hospitalId],
    //   sendVil: [vilObj],
    //   selectHospital: item?._id,
    // });

    if (e.checked) {
      let vilObj = {
        _id: item?._id,
        isEdited,
        isIssuedVil,
      };
      this.vilArray.push(vilObj);
      this.hospitalArray.push(item?.hospitalId);
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendVil: this.vilArray,
        selectHospital: item?._id,
      });
    } else {
      let hospitalIndex = this.hospitalArray.findIndex(
        (h: any) => h === item?.hospitalId
      );
      if (hospitalIndex !== -1) {
        this.hospitalArray.splice(hospitalIndex, 1);
      }
      let vilIndex = this.vilArray.findIndex(
        (vil: any) => vil?._id === item?._id
      );
      if (vilIndex !== -1) {
        this.vilArray.splice(vilIndex, 1);
      }
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendVil: this.vilArray,
        selectHospital: item?._id,
      });
      if (!this.vilArray?.length) {
        this.emailFrom.patchValue({
          selectHospital: "",
        });
      }
    }
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
  submit() {
    if (this.emailFrom.valid) {
      let values = this.emailFrom.value;
      const { emailTo, emailCc, hospital, sendVil, patient, sendTo, contact } =
        values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        emailTo,
        emailCc,
        hospital: newHospital,
        sendVil,
        patient,
        sendTo,
        status: this.checkVilSentData?.vilExist ? "override" : "sent",
        contact,
      };

      if (contact?.length > 0 || !!emailTo) {
        this.hospitalService.sendVil(payload).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          let followupPayload = {
            eventName: "VIL",
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
      eventString += `<div><strong>Contact:</strong> ${
        item?.contact?.length > 0 ? item.contact.join(", ") : "NIL"
      }</div>`;
    } else if (item?.sendTo === "referral partner") {
      eventString = `
      <div><strong>Email To:</strong> ${item?.emailTo || "NIL"}</div>
      <div><strong> Email Cc:</strong> ${
        item?.emailCc?.length > 0 ? item?.emailCc?.join(", ") : "NIL"
      }</div>      
`;
      eventString += `<div><strong>Contact:</strong> ${
        item?.contact?.length > 0 ? item.contact.join(", ") : "NIL"
      }</div>`;
    } else if (item?.sendTo === "embassy") {
      eventString = `
      <div><strong>Email To:</strong> ${item?.emailTo || "NIL"}</div>
      <div><strong> Email Cc:</strong> ${
        item?.emailCc?.length > 0 ? item?.emailCc?.join(", ") : "NIL"
      }</div>      
`;
      eventString += `<div><strong>Contact:</strong> ${
        item?.contact?.length > 0 ? item.contact.join(", ") : "NIL"
      }</div>`;
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

  // selectedEmbassyArray: any = [];
  // onClickEmbassy(item: any) {
  //   const index = this.selectedEmbassySearch.findIndex(
  //     (element) => element._id === item._id
  //   );

  //   if (index !== -1) {
  //     this.selectedEmbassySearch.splice(index, 1);
  //     this.selectedEmbassyArray.splice(index, 1);
  //   } else {
  //     this.selectedEmbassySearch.push({
  //       _id: item?._id,
  //       name: item?.name,
  //     });
  //     this.selectedEmbassyArray.push(item);
  //   }

  //   this.patchEmailToAndCC();

  //   this.emailFrom.patchValue({
  //     embassy: [...new Set(this.selectedEmbassySearch)],
  //   });
  // }

  // patchEmailToAndCC() {
  //   if (this.selectedEmbassyArray?.length > 0) {
  //     let emailToArray = [];
  //     let emailCcArray = [];
  //     this.selectedEmbassyArray?.forEach((res: any) => {
  //       if (!!res?.emailTo1) {
  //         emailToArray.push(res?.emailTo1);
  //       }
  //       if (!!res?.emailTo2) {
  //         emailToArray.push(res?.emailTo2);
  //       }
  //       if (!!res?.emailCc1) {
  //         emailCcArray.push(res?.emailCc1);
  //       }
  //       if (!!res?.emailCc2) {
  //         emailCcArray.push(res?.emailCc2);
  //       }
  //     });
  //     let emailToString = emailToArray?.join(", ");
  //     this.emailFrom.patchValue({
  //       emailTo: emailToString,
  //     });

  //     if (emailCcArray?.length > 0) {
  //       let emailCcString = emailCcArray?.join(", ");
  //       let currentEmailArray = this.emailArray?.value;
  //       if (!currentEmailArray?.length) {
  //         let fc = this.createEmailCcForm();
  //         fc?.patchValue(emailCcString);
  //         this.emailArray.insert(0, fc);
  //       } else {
  //         this.emailArray.at(0).patchValue(emailCcString);
  //       }
  //     } else {
  //       this.emailArray.removeAt(0);
  //       // // formArray?.forEach((fa: any, index: any) => {
  //       // //   this.emailArray.removeAt(index);
  //       // // });
  //     }
  //   } else {
  //     this.emailArray.removeAt(0);
  //     this.emailFrom.patchValue({
  //       emailTo: "",
  //     });
  //   }
  // }

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
    const emailToArray: string[] = [];
    const emailCcArray = [];

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
      if (this.emailCcPushedAtZeroIndex) {
        this.emailArray.removeAt(0);
        this.emailCcPushedAtZeroIndex = false;
      }
      this.emailFrom.patchValue({
        emailTo: "",
      });
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
