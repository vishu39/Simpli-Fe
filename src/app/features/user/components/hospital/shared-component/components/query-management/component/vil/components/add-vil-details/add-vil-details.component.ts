import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddDetailsDialogComponent } from "../../../../dialog/add-details-dialog/add-details-dialog.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import * as moment from "moment";
import { DatePipe } from "@angular/common";

@Component({
  selector: "shared-add-vil-details",
  templateUrl: "./add-vil-details.component.html",
  styleUrls: ["./add-vil-details.component.scss"],
})
export class AddVilDetailsComponent implements OnInit {
  isLoadingRequest = false;
  vilForm: FormGroup;
  request: any = [];
  isEdit = false;
  title = "";
  uploadedDoc: any = [];

  @Input() patientData: any;

  constructor(
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddDetailsDialogComponent>,
    public editDialogRef: MatDialogRef<AddVilDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (!this.isEdit) {
      this.getVilPendingRequest();
    }
    this.buildForm();
    this.patchFormIfEdit();
  }

  patchFormIfEdit() {
    if (this.isEdit) {
      const {
        hospitalName,
        hospitalId,
        vilLetter,
        vilId,
        referenceNo,
        receivedAt,
      } = this.data.data;
      this.vilForm.patchValue({
        hospitalId: hospitalId,
        hospitalName: hospitalName,
        patient: this.data?.patientData?._id,
        file: vilLetter,
        vilId: vilId,
        referenceNo,
        receivedAt: receivedAt,
      });
      this.vilForm.get("hospitalName").disabled;
      this.uploadedDoc = [vilLetter];
    }
  }

  buildForm() {
    this.vilForm = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: [
        {
          value: "",
          disabled: this.isEdit ? true : false,
        },
        [Validators.required],
      ],
      file: [[], [Validators.required]],
      referenceNo: ["", [Validators.required]],
      vilId: ["", [Validators.required]],
      receivedAt: [""],
      patient: [this.patientData?._id, [Validators.required]],
    });
  }

  getVilPendingRequest() {
    this.isLoadingRequest = true;
    this.hospitalService
      .getPendingVilRequest(this.patientData?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.request = res?.data;
      });
  }

  onClickHospital(item: any) {
    this.vilForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
      vilId: item?.vilId,
    });
  }

  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  onFileSelected(e: any) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
    const file = e.target.files[0];
    if (allowedExtensions.exec(file.name)) {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.filePreviewUrls = [fileUrl];
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreviewUrls = [reader.result as string];
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
    this.fileList = [file];
    this.isAiVilChecker = false;
  }

  closeDialog(isBool) {
    this.editDialogRef.close(isBool);
  }

  submit() {
    if (this.vilForm?.valid) {
      const {
        hospitalName,
        hospitalId,
        patient,
        vilId,
        referenceNo,
        receivedAt,
      } = this.vilForm?.value;
      let formData = new FormData();

      let paylaod = {
        hospitalName: this.isEdit ? this.data.data.hospitalName : hospitalName,
        hospitalId,
        patient,
        vilId,
        referenceNo,
        receivedAt,
      };

      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }

      formData.append("file", this.fileList[0]);

      if (!this.isEdit) {
        this.hospitalService.addVil(formData).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.dialogRef.close(true);
        });
      } else {
        formData.append("vilLetter", JSON.stringify(this.uploadedDoc[0]));
        this.hospitalService.addVilEdited(formData).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
      }
    } else {
      this.vilForm.markAsTouched();
    }
  }

  readFileData: any;
  readTotalData: any = {};

  isAiVilChecker = false;
  readFile(event: any) {
    this.isAiVilChecker = false;
    let formData = new FormData();

    let file: any = [];

    if (this.fileList.length) {
      file = this.fileList[event?.i];
    }

    formData.append("file", file);

    let values = this.vilForm.getRawValue();
    let hospitalId = values?.hospitalId;
    let patient = values?.patient;

    if (hospitalId) {
      if (file?.type?.includes("image")) {
        // this.sharedService
        //   .vilAICheckerByImage(formData, patient, hospitalId)
        //   .subscribe(
        //     (res: any) => {
        //       if (res?.statusCode === 200 && res?.isError === false) {
        //         this.readTotalData = res?.data;
        //         this.vilDataFromAi = this.readTotalData?.vilData;
        //         this.aiDataFromAi = this.readTotalData?.aiData;
        //         this.isAiVilChecker = true;
        //         this.sharedService.showNotification(
        //           "snackBar-success",
        //           res.message
        //         );
        //       } else {
        //         this.readTotalData = {};
        //         this.vilDataFromAi = {};
        //         this.aiDataFromAi = {};
        //         this.isAiVilChecker = false;
        //       }
        //     },
        //     (err) => {
        //       this.readTotalData = {};
        //       this.vilDataFromAi = {};
        //       this.aiDataFromAi = {};
        //       this.isAiVilChecker = false;
        //     }
        //   );
      } else {
        this.sharedService
          .vilAICheckerByFile(formData, patient, hospitalId)
          .subscribe(
            (res: any) => {
              if (res?.statusCode === 200 && res?.isError === false) {
                this.readTotalData = res?.data?.response;
                console.log(this.readTotalData);

                this.isAiVilChecker = true;
                this.sharedService.showNotification(
                  "snackBar-success",
                  res.message
                );
              } else {
                this.readTotalData = {};
                this.isAiVilChecker = false;
              }
            },
            (err) => {
              this.readTotalData = {};
              this.isAiVilChecker = false;
            }
          );
      }
    } else {
      this.sharedService.showNotification(
        "snackBar-danger",
        "Please select any hospital before reading file"
      );
    }
  }
}
