import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { facilitatorAdminUserType } from "src/app/core/models/role";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FollowupModalComponent } from "src/app/shared/components/dialogs/followup-modal/followup-modal.component";

@Component({
  selector: "shared-send-opd",
  templateUrl: "./send-opd.component.html",
  styleUrls: ["./send-opd.component.scss"],
})
export class SendOpdComponent implements OnInit {
  @Input() patientData: any;
  emailFrom: FormGroup;
  request: any = [];
  requestEdited: any = [];
  selected: string;

  constructor(
    private faciliatorService: FacilitatorService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SendOpdComponent>
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
      emailTo: ["", [Validators.pattern(regexService.emailRegex)]],
      emailCc: this.fb.array([]),
      selectHospital: ["", [Validators.required]],
      hospitalId: "",
      sendOpd: {},
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
  submit() {
    if (this.emailFrom.valid) {
      let values = this.emailFrom.value;
      const {
        emailTo,
        emailCc,
        hospitalId,
        sendOpd,
        patient,
        contact,
        sendTo,
      } = values;
      let payload = {
        emailTo,
        emailCc,
        hospitalId,
        sendOpd,
        patient,
        contact,
        sendTo,
      };

      if (contact?.length > 0 || !!emailTo) {
        this.faciliatorService.sendOpd(payload).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          let followupPayload = {
            eventName: "OPD",
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
