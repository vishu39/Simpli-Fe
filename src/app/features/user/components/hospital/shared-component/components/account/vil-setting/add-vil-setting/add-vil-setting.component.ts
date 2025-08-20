import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-add-vil-setting",
  templateUrl: "./add-vil-setting.component.html",
  styleUrls: ["./add-vil-setting.component.scss"],
})
export class AddVilSettingComponent implements OnInit {
  dialogTitle: string;
  isEdit: boolean = false;
  signatoryData: any = {};
  vilSettingForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddVilSettingComponent>,
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.vilSettingForm = this.fb.group({
      signingAuthorityName: ["", [Validators.required]],
      signingAuthorityEmailId: [
        "",
        [Validators.required, Validators.pattern(regexService.emailRegex)],
      ],
      signingAuthorityContactNo: [
        "",
        [Validators.required, Validators.pattern(regexService.contactRegex)],
      ],
      signingAuthorityDesignation: ["", [Validators.required]],
      signature: ["", [Validators.required]],
    });

    this.patchIfEdit();
  }

  patchIfEdit() {
    if (this.isEdit) {
      this.vilSettingForm.patchValue(this.signatoryData);
      this.vilSettingForm.controls["signature"].clearValidators();
      this.vilSettingForm.controls["signature"].updateValueAndValidity();
    }
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
  }

  closeDialog(apiCall: boolean) {
    this.dialogRef.close(apiCall);
  }

  submit() {
    if (this.vilSettingForm.valid) {
      const formData = new FormData();
      const {
        signingAuthorityName,
        signingAuthorityEmailId,
        signingAuthorityContactNo,
        signingAuthorityDesignation,
        signature,
      } = this.vilSettingForm.value;

      formData.append("signingAuthorityName", signingAuthorityName);
      formData.append("_id", this.signatoryData?._id);
      formData.append("signingAuthorityEmailId", signingAuthorityEmailId);
      formData.append("signingAuthorityContactNo", signingAuthorityContactNo);
      formData.append(
        "signingAuthorityDesignation",
        signingAuthorityDesignation
      );
      formData.append("fileFirst", signature?._files?.[0]);

      if (!this.isEdit) {
        this.hospitalService.addVilSetting(formData).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
      } else {
        this.hospitalService.editVilSetting(formData).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
      }
    } else {
      this.vilSettingForm.markAllAsTouched();
    }
  }
}
