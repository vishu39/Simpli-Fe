import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import { regexService } from "src/app/core/service/regex";
import { FollowupModalComponent } from "src/app/shared/components/dialogs/followup-modal/followup-modal.component";
import { facilitatorAdminUserType } from "src/app/core/models/role";

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

  constructor(
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailSentDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllProformaInvoiceReceived();
    this.getAllProformaInvoiceReceivedEdited();
    this.createForm();
  }

  createForm() {
    this.emailFrom = this.fb.group({
      emailTo: ["", [Validators.pattern(regexService.emailRegex)]],
      emailCc: this.fb.array([]),
      selectHospital: ["", [Validators.required]],
      hospital: [],
      sendProformaInvoice: {},
      patient: this.patientData?._id,
      contact: this.fb.array([]),
      sendTo: ["", [Validators.required]],
    });

    this.changeSendTo(facilitatorAdminUserType.referralPartner);
  }

  getOwnReferralPartner() {
    this.sharedService
      .getOwnReferralPartner(this.patientData?.referralPartner?._id)
      .subscribe((res: any) => {
        this.emailFrom.patchValue({
          emailTo: res?.data?.emailId || "",
        });
        if (res?.data?.contact) {
          this.setContactNumberFromSendTo(res?.data?.contact);
        }
      });
  }

  sendToArray = [
    {
      title: "Referral Partner",
      value: facilitatorAdminUserType.referralPartner,
    },
    { title: "Patient", value: "patient" },
  ];

  changeSendTo(val: string) {
    this.emailFrom.patchValue({
      sendTo: val,
      emailTo: "",
    });

    if (val === facilitatorAdminUserType.referralPartner) {
      if (this.patientData?.referralPartner) {
        this.contactArray?.clear();
        this.getOwnReferralPartner();
      } else {
        this.contactArray?.clear();
      }
    } else if (val === "patient") {
      this.emailFrom.patchValue({
        emailTo: this.patientData?.emailId || "",
      });
      this.contactArray?.clear();
      if (this.patientData?.contact) {
        this.setContactNumberFromSendTo(this.patientData?.contact);
      }
    }
  }

  setContactNumberFromSendTo(val: any) {
    let control = this.fb.control(val);
    this.contactArray.push(control);
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
  getAllProformaInvoiceReceived() {
    this.isDataLoading = true;
    this.faciliatorService
      .getAllProformaInvoiceReceived(this.patientData?._id)
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
  getAllProformaInvoiceReceivedEdited() {
    this.isEditedDataLoading = true;
    this.faciliatorService
      .getAllProformaInvoiceReceivedEdited(this.patientData?._id)
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
      this.proformaInvoiceArray.push(vilObj);
      this.hospitalArray.push(item?.hospitalId);
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendProformaInvoice: this.proformaInvoiceArray,
        selectHospital: item?._id,
      });
    } else {
      let hospitalIndex = this.hospitalArray.findIndex(
        (h: any) => h === item?.hospitalId
      );
      if (hospitalIndex !== -1) {
        this.hospitalArray.splice(hospitalIndex, 1);
      }
      let vilIndex = this.proformaInvoiceArray.findIndex(
        (vil: any) => vil?._id === item?._id
      );
      if (vilIndex !== -1) {
        this.proformaInvoiceArray.splice(vilIndex, 1);
      }
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendProformaInvoice: this.proformaInvoiceArray,
        selectHospital: item?._id,
      });
      if (!this.proformaInvoiceArray?.length) {
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
      const {
        emailTo,
        emailCc,
        hospital,
        sendProformaInvoice,
        patient,
        contact,
        sendTo,
      } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        emailTo,
        emailCc,
        hospital: newHospital,
        sendProformaInvoice,
        patient,
        contact,
        sendTo,
      };

      if (contact?.length > 0 || !!emailTo) {
        this.faciliatorService
          .sendProformaInvoice(payload)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
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
}
