import { Component, Inject, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddDetailsDialogComponent } from "../../../../dialog/add-details-dialog/add-details-dialog.component";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "shared-add-opd-details",
  templateUrl: "./add-opd-details.component.html",
  styleUrls: ["./add-opd-details.component.scss"],
})
export class AddOpdDetailsComponent implements OnInit {
  isLoadingRequest = false;
  opdForm: FormGroup;
  doctorsList = [];
  doctorFreshList: any = [];
  timeoutDoctor = null;
  request: any = [];
  dataLoading: boolean = false;
  isEdit = false;
  title = "";

  @Input() patientData: any;
  @Input() isDialogClosed: boolean = false;
  @Input() isFormChange: boolean = false;

  constructor(
    private faciliatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddDetailsDialogComponent>,
    public editDialogRef: MatDialogRef<AddOpdDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (!this.isEdit) {
      this.getPendingOpdRequest();
    }
    this.buildForm();
    this.patchFormIfEdit();
    if (!this.isEdit) {
      this.patchDraft();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isDialogClosed?.currentValue) {
      if (!this.isEdit) {
        this.saveDraft();
      }
    }
    if (!!changes?.isFormChange?.currentValue) {
      if (!this.isEdit) {
        this.saveDraft();
      }
    }
  }

  patchFormIfEdit() {
    if (this.isEdit) {
      const {
        hospitalName,
        hospitalId,
        meetingLink,
        paymentLink,
        opdAt,
        receivedAt,
        doctorName,
        opdId,
        patient,
      } = this.data.data;
      this.getHospitalById(hospitalId);
      this.opdForm.patchValue({
        hospitalId: hospitalId,
        hospitalName: hospitalName,
        opdAt: opdAt,
        receivedAt: receivedAt,
        meetingLink: meetingLink,
        paymentLink: paymentLink,
        opdId: opdId,
        patient: this.data?.patientData?._id,
      });
    }
  }

  patchDraft() {
    let opdDraftData: any = JSON.parse(
      localStorage.getItem(`${this.patientData?._id}addOpdDraft`)
    );
    if (
      !!opdDraftData?.hospitalName ||
      !!opdDraftData?.hospitalId ||
      !!opdDraftData?.meetingLink ||
      !!opdDraftData?.paymentLink ||
      !!opdDraftData?.opdAt ||
      !!opdDraftData?.doctorName ||
      !!opdDraftData?.otherDoctorName ||
      !!opdDraftData?.opdId ||
      !!opdDraftData?.receivedAt
    ) {
      this.getHospitalById(opdDraftData?.hospitalId);
      this.opdForm.patchValue({
        ...opdDraftData,
      });
    }

    // localStorage.removeItem(`${this.patientData?._id}addOpdDraft`);
  }

  saveDraft() {
    let formValue = this.opdForm?.getRawValue();

    if (
      !!formValue?.hospitalName ||
      !!formValue?.hospitalId ||
      !!formValue?.meetingLink ||
      !!formValue?.paymentLink ||
      !!formValue?.opdAt ||
      !!formValue?.doctorName ||
      !!formValue?.otherDoctorName ||
      !!formValue?.opdId ||
      !!formValue?.receivedAt
    ) {
      let opdDraftData = {
        hospitalName: formValue?.hospitalName,
        hospitalId: formValue?.hospitalId,
        meetingLink: formValue?.meetingLink,
        paymentLink: formValue?.paymentLink,
        opdAt: formValue?.opdAt,
        doctorName: formValue?.doctorName,
        otherDoctorName: formValue?.otherDoctorName,
        opdId: formValue?.opdId,
        receivedAt: formValue?.receivedAt,
      };

      localStorage.setItem(
        `${this.patientData?._id}addOpdDraft`,
        JSON.stringify(opdDraftData)
      );
    }
  }

  buildForm() {
    this.opdForm = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: [
        {
          value: "",
          disabled: this.isEdit ? true : false,
        },
        [Validators.required],
      ],
      doctorName: ["", [Validators.required]],
      otherDoctorName: [""],
      opdAt: ["", [Validators.required]],
      receivedAt: [""],
      meetingLink: ["", [Validators.pattern(regexService.linkRegexPattern)]],
      paymentLink: ["", [Validators.pattern(regexService.linkRegexPattern)]],
      opdId: ["", [Validators.required]],
      patient: [this.patientData?._id, [Validators.required]],
    });
  }

  getPendingOpdRequest() {
    this.isLoadingRequest = true;
    this.faciliatorService
      .getPendingOpdRequest(this.patientData?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.request = res?.data;
      });
  }

  onClickHospital(item: any) {
    this.getHospitalById(item?.hospitalId);
    this.opdForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
      opdId: item?.opdId,
    });
  }

  getHospitalById(id: string) {
    this.dataLoading = true;
    // this.sharedService.startLoader();
    this.sharedService
      .getCmsData(`getHospital/${id}`, {})
      .subscribe((res: any) => {
        this.doctorsList = [{ name: "Other" }];
        if (res?.data) {
          this.doctorsList.push(...res?.data?.doctor);
          this.doctorFreshList = this.doctorsList;
          this.dataLoading = false;
          if (this.doctorsList?.length && this.isEdit) {
            let obj = this.doctorsList?.find(
              (dl: any) => dl?.name === this.data?.data?.doctorName
            );
            if (!!obj) {
              this.opdForm.patchValue({
                doctorName: this.data?.data?.doctorName,
              });
            } else {
              this.opdForm.patchValue({
                doctorName: "Other",
                otherDoctorName: this.data?.data?.doctorName,
              });
            }
          }
          // this.sharedService.stopLoader();
        }
      });
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.doctorFreshList);
        this.doctorsList = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.doctorsList = filterArray;
      } else {
        this.doctorsList = this.doctorFreshList;
      }
    }, 600);
  }

  closeDialog(isBool) {
    this.editDialogRef.close(isBool);
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  submit() {
    if (this.opdForm?.valid) {
      const {
        hospitalName,
        hospitalId,
        opdAt,
        meetingLink,
        paymentLink,
        doctorName,
        opdId,
        patient,
        receivedAt,
        otherDoctorName,
      } = this.opdForm?.value;

      let paylaod = {
        opdReceived: {
          hospitalName: this.isEdit
            ? this.data.data.hospitalName
            : hospitalName,
          hospitalId,
          opdId,
          receivedAt,
          paymentLink,
          meetingLink,
          opdAt,
          doctorName:
            doctorName === "Other" ? otherDoctorName || "Other" : doctorName,
        },
        patient,
      };

      if (!this.isEdit) {
        this.faciliatorService.opdReceived(paylaod).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          localStorage.removeItem(`${this.patientData?._id}addOpdDraft`);
          this.dialogRef.close(true);
        });
      } else {
        paylaod["opdReceivedEdited"] = paylaod.opdReceived;
        delete paylaod["opdReceived"];
        this.faciliatorService
          .opdReceivedEdited(paylaod)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      this.opdForm.markAsTouched();
    }
  }
}
