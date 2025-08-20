import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddDetailsDialogComponent } from "../../../../dialog/add-details-dialog/add-details-dialog.component";
import { regexService } from "src/app/core/service/regex";
import { cloneDeep } from "lodash";

@Component({
  selector: "shared-add-patient-confirmation-details",
  templateUrl: "./add-patient-confirmation-details.component.html",
  styleUrls: ["./add-patient-confirmation-details.component.scss"],
})
export class AddPatientConfirmationDetailsComponent implements OnInit {
  @Input() patientData: any;

  patientConfirmationForm: FormGroup;

  // hospital variables
  isEdit = false;
  title = "";
  uploadedDoc: any = [];

  constructor(
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddDetailsDialogComponent>,
    public editDialogRef: MatDialogRef<AddPatientConfirmationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (!this.isEdit) {
      this.getAllAddedPatientConfirmation();
    }
    this.patchFormIfEdit();
  }

  deleteTicket(index: number) {
    this.uploadedDoc.splice(index, 1);
  }

  patchFormIfEdit() {
    if (this.isEdit) {
      const {
        hospitalName,
        hospitalId,
        treatment,
        country,
        ticket,
        cabs,
        flightName,
        flightNo,
        arrivalDate,
        contactPerson,
        contactPersonNo,
        coordinatorAddress,
        coordinatorPickUpTime,
        remarks,
      } = this.data.data;

      this.patientConfirmationForm.patchValue({
        patientName: this.data?.patientData?.name,
        patient: this.data?.patientData?._id,
        treatment: this.data?.patientData?.treatment,
        country: this.data?.patientData?.country,
        hospitalName: hospitalName,
        hospitalId: hospitalId,
        cabs: cabs,
        flightName: flightName,
        flightNo: flightNo,
        arrivalDate: arrivalDate,
        contactPerson: contactPerson,
        contactPersonNo: contactPersonNo,
        coordinatorAddress: coordinatorAddress,
        coordinatorPickUpTime: coordinatorPickUpTime,
        remarks: remarks,
        fileFirst: ticket,
      });
      this.uploadedDoc = ticket;
    }
  }

  createForm() {
    this.patientConfirmationForm = this.fb.group({
      patientName: [{ value: this.patientData?.name, disabled: true }],
      patient: [this.patientData?._id],
      treatment: [{ value: this.patientData?.treatment, disabled: true }],
      country: [{ value: this.patientData?.country, disabled: true }],
      hospitalName: [
        {
          value: "",
          disabled: this.isEdit ? true : false,
        },
        [Validators.required],
      ],
      hospitalId: ["", [Validators.required]],
      cabs: [""],
      flightName: [""],
      flightNo: [""],
      arrivalDate: ["", [Validators.required]],
      contactPerson: [""],
      contactPersonNo: ["", [Validators.pattern(regexService.contactRegex)]],
      coordinatorAddress: [""],
      coordinatorPickUpTime: [""],
      remarks: ["", [Validators.required]],
      fileFirst: [""],
    });
  }

  topHospitalChange(item: any) {
    this.patientConfirmationForm.patchValue({
      hospitalName: item?.name,
      hospitalId: item?._id,
    });
  }

  addedData = [];
  getAllAddedPatientConfirmation() {
    this.hospitalService
      .getAllAddedPatientConfirmation(this.patientData?._id)
      .subscribe((res: any) => {
        this.addedData = res?.data;
        this.getAllHospital();
      });
  }

  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  onFileSelected(e: any) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.filePreviewUrls.push(fileUrl);
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreviewUrls.push(reader.result as string);
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      this.fileList.push(file);
    });
  }

  onDelete(index: number) {
    if (index !== -1) {
      this.fileList.splice(index, 1);
      this.filePreviewUrls.splice(index, 1);
    }
    if (!this.fileList.length) {
      this.patientConfirmationForm.patchValue({
        fileFirst: null,
      });
    }
  }

  closeDialog(isBool) {
    this.editDialogRef.close(isBool);
  }

  submit() {
    if (this.patientConfirmationForm.valid) {
      let values = this.patientConfirmationForm.value;
      let paylaod = {
        patient: values?.patient,
        hospitalName: this.isEdit
          ? this.data?.data?.hospitalName
          : values?.hospitalName,
        hospitalId: values?.hospitalId,
        cabs: values?.cabs,
        flightName: values?.flightName,
        flightNo: values?.flightNo,
        arrivalDate: values?.arrivalDate,
        contactPerson: values?.contactPerson,
        contactPersonNo: values?.contactPersonNo,
        coordinatorAddress: values?.coordinatorAddress,
        coordinatorPickUpTime: values?.coordinatorPickUpTime,
        remarks: values?.remarks,
      };
      let formData = new FormData();
      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }
      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("fileFirst", this.fileList[i]);
      }

      if (!this.isEdit) {
        this.hospitalService
          .addPatientConfirmation(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.dialogRef.close(true);
          });
      } else {
        formData.append("ticket", JSON.stringify(this.uploadedDoc));
        formData.append(
          "patientConfirmationId",
          JSON.stringify(this.data?.data?.patientConfirmationId)
        );
        formData.append("status", JSON.stringify(this.data?.data?.status));
        this.hospitalService
          .addPatientConfirmationEdited(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      this.patientConfirmationForm.markAllAsTouched();
    }
  }

  onClickHospital(item: any) {
    this.patientConfirmationForm.patchValue({
      hospitalName: item?.name,
      hospitalId: item?._id,
    });
  }

  // hospital api
  aggregatorRequestList = [];
  freshHospitalData = [];
  // hospital variables
  hospitalData = [];
  hospitalDataForAggregator = [];
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll: boolean = false;
  totalElementHospital: number;
  selectedHospitalSearch = [];
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };

  getAllHospital() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        this.hospitalDataForAggregator.push(...res?.data?.content);
        this.hospitalData.push(...res.data.content);
        this.freshHospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;

        // for hospital
        if (this.addedData?.length) {
          this.addedData.forEach((data: any) => {
            let index = this.hospitalData.findIndex(
              (hos: any) => hos?._id === data?.hospitalId
            );
            if (index !== -1) {
              this.hospitalData.splice(index, 1);
            }
          });
        }

        this.isLoadingHospital = false;
      });
  }
  onInfiniteScrollHospital(): void {
    if (this.freshHospitalData.length < this.totalElementHospital) {
      this.getAllHospital();
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 20;
      this.hospitalData = []; // Clear existing data when searching
      this.freshHospitalData = []; // Clear existing data when searching
      this.hospitalDataForAggregator = []; // Clear existing data when searching
      this.isLoadingHospital = false;
      this.getAllHospital();
    }, 600);
  }
}
