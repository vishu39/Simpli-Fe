import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "global-shared-admission-discharge-tracker",
  templateUrl: "./admission-discharge-tracker.component.html",
  styleUrls: ["./admission-discharge-tracker.component.scss"],
})
export class AdmissionDischargeTrackerComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  admissionOnPlannedDateOptions = ["yes", "no"];

  constructor(
    public dialogRef: MatDialogRef<AdmissionDischargeTrackerComponent>
  ) {}

  ngOnInit(): void {}

  closeDialog(apiCall: boolean): void {
    this.formGroup.reset();
    this.fileList = [];
    this.filePreviewUrls = [];
    this.dialogRef.close();
  }

  actionSubmit(apiCall = false) {
    this.dialogRef.close({
      apiCall,
      fileList: this.fileList,
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
  }
}
