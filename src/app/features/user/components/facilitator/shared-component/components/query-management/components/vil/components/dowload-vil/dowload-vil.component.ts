import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import { saveAs } from "file-saver";

@Component({
  selector: "shared-dowload-vil",
  templateUrl: "./dowload-vil.component.html",
  styleUrls: ["./dowload-vil.component.scss"],
})
export class DowloadVilComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;
  emailFrom: FormGroup;
  hospitalArray = [];
  vilArray = [];

  constructor(
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailSentDialogComponent>
  ) {}

  ngOnInit(): void {
    this.getAllVilReceived();
    this.getAllVilReceivedEdited();
    this.createForm();
  }

  createForm() {
    this.emailFrom = this.fb.group({
      selectHospital: ["", [Validators.required]],
      hospital: [],
      sendVil: {},
      patient: this.patientData?._id,
    });
  }

  isDataLoading = true;
  getAllVilReceived() {
    this.isDataLoading = true;
    this.faciliatorService.getAllVilReceived(this.patientData?._id).subscribe(
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
    this.faciliatorService
      .getAllVilReceivedEdited(this.patientData?._id)
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

  submit() {
    if (this.emailFrom.valid) {
      let values = this.emailFrom.value;
      const { hospital, sendVil, patient } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        hospital: newHospital,
        sendVil,
        patient,
      };

      this.faciliatorService.downloadVil(payload).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);

        res?.data?.forEach((e) => {
          saveAs(e.signedUrl);
        });
        this.dialogRef.close(true);
      });
    } else {
      this.emailFrom.markAllAsTouched();
    }
  }
}
