import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { EmailFetchChoosePatientComponent } from "../email-fetch-choose-patient/email-fetch-choose-patient.component";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailFetchSendOpinionComponent } from "../send-email-components/email-fetch-send-opinion/email-fetch-send-opinion.component";
import { EmailFetchSendVilComponent } from "../send-email-components/email-fetch-send-vil/email-fetch-send-vil.component";
import { EmailFetchSendProformaComponent } from "../send-email-components/email-fetch-send-proforma/email-fetch-send-proforma.component";
import { EmailFetchSendOpdComponent } from "../send-email-components/email-fetch-send-opd/email-fetch-send-opd.component";
import { FollowupModalComponent } from "src/app/shared/components/dialogs/followup-modal/followup-modal.component";

@Component({
  selector: "app-reply-to-all",
  templateUrl: "./reply-to-all.component.html",
  styleUrls: ["./reply-to-all.component.scss"],
})
export class ReplyToAllComponent implements OnInit {
  @ViewChild("stepper") stepper!: MatStepper;
  @Output("overlayClose") overlayClose: EventEmitter<any> = new EventEmitter();
  @Input() emailData: any;

  currentStepIndex: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ReplyToAllComponent>,
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {}

  isDialogClosed = false;
  closeOverlay() {
    this.isDialogClosed = true;
    this.overlayClose.emit();
  }

  ngOnInit(): void {
    this.selected = "opinion";
  }

  closeDialog(apiCall: boolean) {
    this.dialogRef.close(apiCall);
  }

  navigateStepperToNext(stepper: any) {
    const currentStep = stepper.selectedIndex;

    switch (currentStep) {
      case 0:
        if (this.choosedPatientFormControl?.valid) {
          this.nextStep();
        } else {
          this.choosedPatientFormControl.markAllAsTouched();
        }
        break;
      case 1:
        this.finalStepSubmitFunction();
        break;
    }
  }

  navigateStepperToPrevious(stepper: any) {
    this.previousStep();
  }

  navigateFromButton = false;
  nextStep() {
    this.navigateFromButton = true;
    const currentStep = this.stepper.selectedIndex;
    this.stepper.next();
    this.currentStepIndex = currentStep + 1;
    this.navigateFromButton = false;
  }

  stepOneOption: string = "";
  previousStep() {
    this.stepOneOption = this.choosedPatientFormControl.value;
    this.stepper.reset();
    if (!!this.stepOneOption) {
      this.choosedPatientFormControl.setValue(this.stepOneOption);
    }
  }

  // choose patient methods and variables
  @ViewChild(EmailFetchChoosePatientComponent)
  emailFetchChoosePatientComponent!: EmailFetchChoosePatientComponent;

  choosedPatientData: any;
  choosedPatientIdFormControl: any = new FormControl(null, Validators.required);
  choosedPatientFormControl: any = new FormControl(null, Validators.required);

  selected: string;

  radioGroup = [
    { name: "Send Opinion", value: "opinion" },
    { name: "Send VIL", value: "vil" },
    { name: "Send OPD", value: "opd" },
    { name: " Send Proforma Invoice", value: "proformaInvoice" },
  ];

  isFormChange: any = "opinion";
  selectedTask: FormControl = new FormControl("opinion");

  formChange(val: any) {
    this.isFormChange = val;
    this.selectedTask.setValue(val);
  }

  finalStepSubmitFunction() {
    switch (this.selectedTask?.value) {
      case "opinion":
        this.sendOpinionSubmit();
        break;
      case "vil":
        this.sendVilSubmit();
        break;
      case "opd":
        this.sendOpdSubmit();
        break;
      case "proformaInvoice":
        this.sendProformaSubmit();
        break;
    }
  }

  @ViewChild(EmailFetchSendOpinionComponent)
  emailFetchSendOpinionComponent!: EmailFetchSendOpinionComponent;

  sendOpinionSubmit() {
    if (this.emailFetchSendOpinionComponent.emailFrom.valid) {
      let values = this.emailFetchSendOpinionComponent.emailFrom.value;
      const {
        emailTo,
        emailCc,
        hospital,
        sendOpinion,
        patient,
        targetLanguage,
        format,
      } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        emailTo,
        emailCc,
        hospital: newHospital,
        sendOpinion,
        patient,
        targetLanguage,
        format,
      };

      let params = {
        messageId: this.emailData?.messageId,
      };

      this.faciliatorService
        .sendOpinion(payload, params)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          let followupPayload = {
            eventName: "Opinion",
            patient: this.choosedPatientFormControl?.value
          };
          this.followupPopupByEvent(followupPayload, payload);
          // this.closeOverlay();
        });
    } else {
      this.emailFetchSendOpinionComponent.emailFrom.markAllAsTouched();
    }
  }

  @ViewChild(EmailFetchSendOpdComponent)
  emailFetchSendOpdComponent!: EmailFetchSendOpdComponent;

  sendOpdSubmit() {
    if (this.emailFetchSendOpdComponent.emailFrom.valid) {
      let values = this.emailFetchSendOpdComponent.emailFrom.value;
      const { emailTo, emailCc, hospitalId, sendOpd, patient } = values;
      let payload = {
        emailTo,
        emailCc,
        hospitalId,
        sendOpd,
        patient,
      };

      let params = {
        messageId: this.emailData?.messageId,
      };

      this.faciliatorService.sendOpd(payload, params).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let followupPayload = {
          eventName: "OPD",
          patient: this.choosedPatientFormControl?.value
        };
        this.followupPopupByEvent(followupPayload, payload);
        // this.closeOverlay();
      });
    } else {
      this.emailFetchSendOpdComponent.emailFrom.markAllAsTouched();
    }
  }

  @ViewChild(EmailFetchSendProformaComponent)
  emailFetchSendProformaComponent!: EmailFetchSendProformaComponent;

  sendProformaSubmit() {
    if (this.emailFetchSendProformaComponent.emailFrom.valid) {
      let values = this.emailFetchSendProformaComponent.emailFrom.value;
      const { emailTo, emailCc, hospital, sendProformaInvoice, patient } =
        values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        emailTo,
        emailCc,
        hospital: newHospital,
        sendProformaInvoice,
        patient,
      };

      let params = {
        messageId: this.emailData?.messageId,
      };

      this.faciliatorService
        .sendProformaInvoice(payload, params)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          let followupPayload = {
            eventName: "Proforma Invoice",
            patient: this.choosedPatientFormControl?.value
          };
          this.followupPopupByEvent(followupPayload, payload);
          // this.closeOverlay();
        });
    } else {
      this.emailFetchSendProformaComponent.emailFrom.markAllAsTouched();
    }
  }

  @ViewChild(EmailFetchSendVilComponent)
  emailFetchSendVilComponent!: EmailFetchSendVilComponent;

  sendVilSubmit() {
    if (this.emailFetchSendVilComponent.emailFrom.valid) {
      let values = this.emailFetchSendVilComponent.emailFrom.value;
      const { emailTo, emailCc, hospital, sendVil, patient } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        emailTo,
        emailCc,
        hospital: newHospital,
        sendVil,
        patient,
      };

      let params = {
        messageId: this.emailData?.messageId,
      };

      this.faciliatorService.sendVil(payload, params).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let followupPayload = {
          eventName: "VIL",
          patient: this.choosedPatientFormControl?.value
        };
        this.followupPopupByEvent(followupPayload, payload);
        // this.closeOverlay();
      });
    } else {
      this.emailFetchSendVilComponent.emailFrom.markAllAsTouched();
    }
  }


  followupData: any;
  followupPopupByEvent(payload: any,values:any) {    
    this.sharedService
      .followUpPopup(payload)
      .subscribe((res: any) => {
        this.followupData = res?.data;             
        if (this.followupData?.auto===false && this.followupData?.popup===false) {
          this.closeOverlay();
        } else if(this.followupData?.auto===true || this.followupData?.popup===true) {
          this.openFollowupPopup(payload,values);
          this.closeOverlay();
        }
      });
  }

  openFollowupPopup(payload:any,values:any) {
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
}
