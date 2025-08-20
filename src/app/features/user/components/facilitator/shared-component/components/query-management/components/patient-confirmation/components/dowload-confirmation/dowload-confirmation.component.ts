import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import FileSaver from "file-saver";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "shared-dowload-confirmation",
  templateUrl: "./dowload-confirmation.component.html",
  styleUrls: ["./dowload-confirmation.component.scss"],
})
export class DowloadConfirmationComponent implements OnInit {
  @Input() patientData: any;
  panelOpenState = false;
  requests: any = [];
  emailFrom: FormGroup;
  confirmationArray = [];

  requestEdited: any = [];

  dialogButtonConfig = [
    { name: "NO", color: "warn" },
    { name: "YES", color: "primary" },
  ];

  constructor(
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailSentDialogComponent>,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllPatientConfirmation();
    this.getAllPatientConfirmationEdited();
  }

  createForm() {
    // this.emailFrom = this.fb.group({
    //   selectHospital: ["", [Validators.required]],
    // });
    this.emailFrom = this.fb.group({
      selectHospital: ["", [Validators.required]],
      hospital: [],
      sendTicket: {},
      patient: this.patientData?._id,
    });
  }

  isDataLoading = true;
  getAllPatientConfirmation() {
    this.isDataLoading = true;
    this.faciliatorService
      .getAllPatientConfirmation(this.patientData?._id)
      .subscribe(
        (res: any) => {
          let data = res?.data;
          this.requests = data;
          this.isDataLoading = false;
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  isEditedDataLoading = true;
  getAllPatientConfirmationEdited() {
    this.isEditedDataLoading = true;
    this.faciliatorService
      .getAllPatientConfirmationEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          let data = res?.data;
          this.requestEdited = data;
          this.isEditedDataLoading = false;
        },
        (err) => {
          this.isEditedDataLoading = false;
        }
      );
  }

  hospitalArray = [];
  ticketArray = [];

  selectChange(e: any, item: any, isEdited: boolean) {
    if (e.checked) {
      let ticketObj = {
        _id: item?._id,
        isEdited,
      };
      this.ticketArray.push(ticketObj);
      this.hospitalArray.push(item?.hospitalId);
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendTicket: this.ticketArray,
        selectHospital: item?._id,
      });
    } else {
      let hospitalIndex = this.hospitalArray.findIndex(
        (h: any) => h === item?.hospitalId
      );
      if (hospitalIndex !== -1) {
        this.hospitalArray.splice(hospitalIndex, 1);
      }
      let ticketIndex = this.ticketArray.findIndex(
        (ticket: any) => ticket?._id === item?._id
      );
      if (ticketIndex !== -1) {
        this.ticketArray.splice(ticketIndex, 1);
      }
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendTicket: this.ticketArray,
        selectHospital: item?._id,
      });
      if (!this.ticketArray?.length) {
        this.emailFrom.patchValue({
          selectHospital: "",
        });
      }
    }
    // if (e.checked) {
    //   let vilObj = {
    //     _id: item?._id,
    //     hospitalId: item?.hospitalId,
    //     ticket: item?.ticket,
    //   };
    //   this.confirmationArray.push(vilObj);
    //   this.emailFrom.patchValue({
    //     sendConfirmation: this.confirmationArray,
    //     selectHospital: item?._id,
    //   });
    // } else {
    //   let vilIndex = this.confirmationArray.findIndex(
    //     (vil: any) => vil?._id === item?._id
    //   );
    //   if (vilIndex !== -1) {
    //     this.confirmationArray.splice(vilIndex, 1);
    //   }
    //   this.emailFrom.patchValue({
    //     sendConfirmation: this.confirmationArray,
    //     selectHospital: item?._id,
    //   });
    //   if (!this.confirmationArray?.length) {
    //     this.emailFrom.patchValue({
    //       selectHospital: "",
    //     });
    //   }
    // }
  }

  submit() {
    if (this.emailFrom.valid) {
      let values = this.emailFrom.value;
      const { hospital, sendTicket, patient } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        hospital: newHospital,
        sendTicket,
        patient,
      };
      this.faciliatorService
        .getAllPatientConfirmationTicket(payload)
        .subscribe((res: any) => {
          res?.data?.forEach(async (e) => {
            FileSaver.saveAs(e?.signedUrl, e?.originalname);
          });

          this.sharedService.showNotification("snackBar-success", res.message);
          this.dialogRef.close(true);
        });
    } else {
      this.emailFrom.markAllAsTouched();
    }
  }

  remind(item: any) {
    if (!item?.aggregator?.length) {
      this.svc.ui
        .warnDialog(
          "Remind Patient Confirmation Request?",
          this.dialogButtonConfig,
          4
        )
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              patient: this.patientData?._id,
            };
            this.faciliatorService
              .resendPatientConfirmation(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllPatientConfirmation();
              });
          }
        });
    }
  }

  remindEdited(item: any) {
    if (!item?.aggregator?.length) {
      this.svc.ui
        .warnDialog(
          "Remind Patient Confirmation Request?",
          this.dialogButtonConfig,
          4
        )
        .subscribe((res) => {
          if (res.button.name === "YES") {
            let payload = {
              hospitalId: item?.hospitalId,
              _id: item?._id,
              patient: this.patientData?._id,
            };
            this.faciliatorService
              .resendPatientConfirmationEdited(payload)
              .subscribe((res: any) => {
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
                this.getAllPatientConfirmationEdited();
              });
          }
        });
    }
  }
}
