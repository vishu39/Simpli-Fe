import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddHospitalDialogComponent } from "../../../../dialog/add-hospital-dialog/add-hospital-dialog.component";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { AcknowledgementModalComponent } from "src/app/shared/components/dialogs/acknowledgement-modal/acknowledgement-modal.component";

@Component({
  selector: "shared-add-patient-confirmation",
  templateUrl: "./add-patient-confirmation.component.html",
  styleUrls: ["./add-patient-confirmation.component.scss"],
})
export class AddPatientConfirmationComponent implements OnInit, OnChanges {
  @Input() patientData: any;
  @Input() isDialogClosed: boolean = false;
  @Input() isFormChange = "opinionRequest";

  patientConfirmationForm: FormGroup;
  isLoadingTopHospital: boolean = true;
  topHospitalData = [];
  topHospitalDataForAggregator = [];
  allPatientConfirmationRequest = [];

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

  // aggregator variables
  aggregatorList: any = [];
  freshAggregatorList: any = [];
  timeoutAggregator = null;
  totalElementAggrigator: number;
  isAggregatorLoading: boolean = false;
  selectedAggregatorSearch = [];

  checkContactData: any;
  isCheckEmailClicked: boolean = false;

  isEdit = false;
  title = "";
  uploadedDoc: any = [];

  constructor(
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddHospitalDialogComponent>,
    public editDialogRef: MatDialogRef<AddPatientConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (!this.isEdit) {
      this.getAllPatientConfirmation();
    }
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

  deleteTicket(index: number) {
    this.uploadedDoc.splice(index, 1);
  }

  patchFormIfEdit() {
    // console.log(this.data.data);

    if (this.isEdit) {
      const {
        hospitalName,
        hospitalId,
        treatment,
        country,
        ticket,
        aggregator,
        cabs,
        flightName,
        flightNo,
        arrivalDate,
        contactPerson,
        contactPersonNo,
        coordinatorAddress,
        coordinatorPickUpTime,
        remarks,
        receivedAt,
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
        receivedAt: receivedAt,
      });
      this.uploadedDoc = ticket;
    }
  }

  patchDraft() {
    let patientConfirmationDraftData: any = JSON.parse(
      localStorage.getItem(`${this.patientData?._id}patientConfirmationDraft`)
    );

    if (!!patientConfirmationDraftData) {
      if (
        !!patientConfirmationDraftData?.hospitalName ||
        !!patientConfirmationDraftData?.hospitalId ||
        !!patientConfirmationDraftData?.cabs ||
        !!patientConfirmationDraftData?.flightName ||
        !!patientConfirmationDraftData?.flightNo ||
        !!patientConfirmationDraftData?.arrivalDate ||
        !!patientConfirmationDraftData?.contactPerson ||
        !!patientConfirmationDraftData?.contactPersonNo ||
        !!patientConfirmationDraftData?.coordinatorAddress ||
        !!patientConfirmationDraftData?.coordinatorPickUpTime ||
        !!patientConfirmationDraftData?.receivedAt ||
        !!patientConfirmationDraftData?.remarks
      ) {
        this.patientConfirmationForm.patchValue({
          ...patientConfirmationDraftData,
        });
      }
    }
    // localStorage.removeItem(`${this.patientData?._id}patientConfirmationDraft`);
  }

  saveDraft() {
    let formValue = this.patientConfirmationForm?.getRawValue();

    if (
      !!formValue?.hospitalName ||
      !!formValue?.hospitalId ||
      !!formValue?.cabs ||
      !!formValue?.flightName ||
      !!formValue?.flightNo ||
      !!formValue?.arrivalDate ||
      !!formValue?.contactPerson ||
      !!formValue?.contactPersonNo ||
      !!formValue?.coordinatorAddress ||
      !!formValue?.coordinatorPickUpTime ||
      !!formValue?.receivedAt ||
      !!formValue?.remarks
    ) {
      let patientConfirmationDraftData = {
        hospitalName: formValue?.hospitalName,
        hospitalId: formValue?.hospitalId,
        cabs: formValue?.cabs,
        flightName: formValue?.flightName,
        flightNo: formValue?.flightNo,
        arrivalDate: formValue?.arrivalDate,
        contactPerson: formValue?.contactPerson,
        contactPersonNo: formValue?.contactPersonNo,
        coordinatorAddress: formValue?.coordinatorAddress,
        coordinatorPickUpTime: formValue?.coordinatorPickUpTime,
        remarks: formValue?.remarks,
        receivedAt: formValue?.receivedAt,
      };

      localStorage.setItem(
        `${this.patientData?._id}patientConfirmationDraft`,
        JSON.stringify(patientConfirmationDraftData)
      );
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
      aggregator: [""],
      cabs: [""],
      flightName: [""],
      flightNo: [""],
      arrivalDate: ["", [Validators.required]],
      contactPerson: [""],
      contactPersonNo: ["", [Validators.pattern(regexService.contactRegex)]],
      coordinatorAddress: [""],
      coordinatorPickUpTime: [""],
      receivedAt: [""],
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

  getAllPatientConfirmation() {
    this.hospitalService
      .getAllPatientConfirmation(this.patientData?._id)
      .subscribe((res: any) => {
        this.allPatientConfirmationRequest = res?.data;
        this.getTopHospital();
        this.getAllHospital();
      });
  }

  filterTopHospitalByRequest(topHospitalData: any) {
    if (this.allPatientConfirmationRequest?.length) {
      let resData = topHospitalData;
      this.allPatientConfirmationRequest?.forEach((data: any) => {
        let index = resData?.findIndex(
          (rd: any) => rd?._id === data?.hospitalId
        );
        if (index !== -1) {
          resData.splice(index, 1);
        }
      });
      this.topHospitalData = resData;
    }
  }

  filterHospitalByRequest(hospitalData: any) {
    this.hospitalData = [];
    let resData = hospitalData;
    this.allPatientConfirmationRequest?.forEach((data: any) => {
      let index = resData?.findIndex((rd: any) => rd?._id === data?.hospitalId);
      if (index !== -1) {
        resData.splice(index, 1);
      }
    });
    this.hospitalData.push(...resData);
  }

  freshTopHospital = [];
  getTopHospital() {
    this.isLoadingTopHospital = true;
    this.hospitalService.getTopHospital().subscribe((res: any) => {
      this.topHospitalDataForAggregator.push(...res?.data?.hospital);
      this.freshTopHospital.push(...res?.data?.hospital);
      if (this.allPatientConfirmationRequest?.length) {
        this.filterTopHospitalByRequest(res?.data?.hospital);
        this.isLoadingTopHospital = false;
      } else {
        this.topHospitalData.push(...res?.data?.hospital);
        this.isLoadingTopHospital = false;
      }
    });
  }

  aggregatorRequestList = [];
  freshHospitalData = [];
  getAllHospital() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        this.hospitalDataForAggregator.push(...res?.data?.content);
        this.freshHospitalData.push(...res?.data?.content);
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;
        // for hospital
        if (this.allPatientConfirmationRequest?.length) {
          this.filterHospitalByRequest(this.hospitalData);
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

  onClickHospital(item: any) {
    this.patientConfirmationForm.patchValue({
      hospitalName: item?.name,
      hospitalId: item?._id,
    });
  }

  getPatientConfirmationRecipients() {
    if (this.patientConfirmationForm.valid) {
      let values = {
        patientConfirmation: [
          {
            hospitalId: this.patientConfirmationForm?.get("hospitalId")?.value,
            hospitalName:
              this.patientConfirmationForm?.get("hospitalName")?.value,
          },
        ],
        patient: this.patientConfirmationForm?.get("patient")?.value,
      };

      this.hospitalService
        .getPatientConfirmationRecipients(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.isCheckEmailClicked = true;
          this.checkContactData = res?.data;
        });
    } else {
      this.patientConfirmationForm.markAllAsTouched();
    }
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
        receivedAt: values?.receivedAt,
      };
      let formData = new FormData();
      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }
      for (var i = 0; i < this.fileList?.length; i++) {
        formData.append("fileFirst", this.fileList[i]);
      }
      // console.log(paylaod);
      // console.log(this.uploadedDoc);
      // console.log(this.fileList);

      if (!this.isEdit) {
        this.hospitalService
          .addpatientConfirmation(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            localStorage.removeItem(
              `${this.patientData?._id}patientConfirmationDraft`
            );
            let acknowledgementPayload = {
              eventName: "patientConfirmation",
              patient: this.patientData?._id,
            };

            let ackEventPayload = {
              ...paylaod,
            };

            this.acknowledgementPopupByEvent(
              acknowledgementPayload,
              ackEventPayload
            );
            // this.dialogRef.close(true);
          });
      } else {
        formData.append("ticket", JSON.stringify(this.uploadedDoc));
        formData.append(
          "patientConfirmationId",
          JSON.stringify(this.data?.data?.patientConfirmationId)
        );
        formData.append("status", JSON.stringify(this.data?.data?.status));
        this.hospitalService
          .patientConfirmationEdited(formData)
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

  acknowledgementData: any;
  acknowledgementPopupByEvent(payload: any, values: any) {
    this.sharedService
      .acknowledgementPopupByEvent(payload)
      .subscribe((res: any) => {
        this.acknowledgementData = res?.data;
        if (!this.acknowledgementData?.found) {
          this.dialogRef.close(true);
        } else {
          this.openAcknowledgePopup(payload, values);
          this.dialogRef.close(true);
        }
      });
  }

  openAcknowledgePopup(payload: any, values: any) {
    const dialogRef = this.dialog.open(AcknowledgementModalComponent, {
      width: "60%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "";
    dialogRef.componentInstance.acknowledgementData = this.acknowledgementData;
    dialogRef.componentInstance.acknowledgementPayload = payload;
    dialogRef.componentInstance.eventPayload = values;
    dialogRef.componentInstance.type = payload?.eventName;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
      }
    });
  }

  selectedTab = "Email Details";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
