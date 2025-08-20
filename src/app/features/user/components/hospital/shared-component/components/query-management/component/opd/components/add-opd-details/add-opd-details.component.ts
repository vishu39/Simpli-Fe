import {
  Component,
  Inject,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddDetailsDialogComponent } from "../../../../dialog/add-details-dialog/add-details-dialog.component";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "shared-add-opd-details",
  templateUrl: "./add-opd-details.component.html",
  styleUrls: ["./add-opd-details.component.scss"],
})
export class AddOpdDetailsComponent implements OnInit, OnChanges {
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
    private hospitalService: HospitalService,
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
        opdId,
        doctorName,
        patient,
        receivedAt,
      } = this.data.data;
      this.getHospitalById(hospitalId);
      this.opdForm.patchValue({
        hospitalId: hospitalId,
        hospitalName: hospitalName,
        opdAt: opdAt,
        meetingLink: meetingLink,
        paymentLink: paymentLink,
        patient: this.data?.patientData?._id,
        opdId: opdId,
        receivedAt: receivedAt,
      });
    }
  }

  patchDraft() {
    let opdDraftData: any = JSON.parse(
      localStorage.getItem(`${this.patientData?._id}addOpdDraft`)
    );
    if (!!opdDraftData) {
      if (
        !!opdDraftData?.hospitalName ||
        !!opdDraftData?.hospitalId ||
        !!opdDraftData?.meetingLink ||
        !!opdDraftData?.paymentLink ||
        !!opdDraftData?.opdAt ||
        !!opdDraftData?.doctorName ||
        !!opdDraftData?.otherDoctorName ||
        !!opdDraftData?.receivedAt ||
        !!opdDraftData?.opdId
      ) {
        this.getHospitalById(opdDraftData?.hospitalId);
        this.opdForm.patchValue({
          ...opdDraftData,
        });
      }
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
      !!formValue?.receivedAt ||
      !!formValue?.opdId
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
      receivedAt: [""],
      opdAt: ["", [Validators.required]],
      meetingLink: ["", [Validators.pattern(regexService.linkRegexPattern)]],
      paymentLink: ["", [Validators.pattern(regexService.linkRegexPattern)]],
      opdId: ["", [Validators.required]],
      patient: [this.patientData?._id, [Validators.required]],
    });
  }

  getPendingOpdRequest() {
    this.isLoadingRequest = true;
    this.hospitalService
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

  closeDialog(isBool: boolean = false) {
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
        patient,
        opdId,
        otherDoctorName,
        receivedAt,
      } = this.opdForm?.value;

      let paylaod = {
        opdReceived: {
          hospitalName: this.isEdit
            ? this.data.data.hospitalName
            : hospitalName,
          hospitalId,
          paymentLink,
          meetingLink,
          opdId,
          opdAt,
          receivedAt,
          doctorName:
            doctorName === "Other" ? otherDoctorName || "Other" : doctorName,
        },
        patient,
      };

      if (!this.isEdit) {
        this.hospitalService.addOpd(paylaod).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          localStorage.removeItem(`${this.patientData?._id}addOpdDraft`);
          this.dialogRef.close(true);
        });
      } else {
        paylaod["opdReceivedEdited"] = paylaod.opdReceived;
        delete paylaod["opdReceived"];
        this.hospitalService.addOpdEdited(paylaod).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
      }
    } else {
      this.opdForm.markAsTouched();
    }
  }
}
