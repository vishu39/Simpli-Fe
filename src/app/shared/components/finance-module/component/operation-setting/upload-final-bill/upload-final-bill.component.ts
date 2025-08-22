import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "global-shared-upload-final-bill",
  templateUrl: "./upload-final-bill.component.html",
  styleUrls: ["./upload-final-bill.component.scss"],
})
export class UploadFinalBillComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  constructor(public dialogRef: MatDialogRef<UploadFinalBillComponent>) {}

  ngOnInit(): void {}

  closeDialog(apiCall: boolean): void {
    this.formGroup.reset();
    this.fileFirstList = [];
    this.fileFirstPreviewUrls = [];
    this.fileFirstPreviewUrls = [];
    this.fileSecondPreviewUrls = [];
    this.dialogRef.close();
  }

  actionSubmit(apiCall = false) {
    this.dialogRef.close({
      apiCall,
    });
  }

  // fileFirstList: any[] = [];
  // fileFirstPreviewUrls: string[] = [];

  // fileSecondList: any[] = [];
  // fileSecondPreviewUrls: string[] = [];
  // onFileSelected(e: any, uploadFileType: string) {
  //   const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
  //   const file = e.target.files[0];
  //   if (allowedExtensions.exec(file.name)) {
  //     if (file.type === "application/pdf") {
  //       const fileUrl = URL.createObjectURL(file);

  //       if (uploadFileType === "fileFirst") {
  //         this.fileFirstPreviewUrls = [fileUrl];
  //       }
  //       if (uploadFileType === "fileSecond") {
  //         this.fileSecondPreviewUrls = [fileUrl];
  //       }

  //       file["url"] = fileUrl;
  //     } else {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         if (uploadFileType === "fileFirst") {
  //           this.fileFirstPreviewUrls = [reader.result as string];
  //         }
  //         if (uploadFileType === "fileSecond") {
  //           this.fileSecondPreviewUrls = [reader.result as string];
  //         }
  //         file["url"] = reader.result as string;
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }

  //   if (uploadFileType === "fileFirst") {
  //     this.fileFirstList = [file];
  //   }
  //   if (uploadFileType === "fileSecond") {
  //     this.fileSecondList = [file];
  //   }
  // }

  fileFirstList: any[] = [];
  fileFirstPreviewUrls: string[] = [];

  fileSecondList: any[] = [];
  fileSecondPreviewUrls: string[] = [];
  onFileSelected(e: any, uploadFileType: string) {
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        if (uploadFileType === "fileFirst") {
          this.fileFirstPreviewUrls.push(fileUrl);
        }
        if (uploadFileType === "fileSecond") {
          this.fileSecondPreviewUrls.push(fileUrl);
        }

        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (uploadFileType === "fileFirst") {
            this.fileFirstPreviewUrls.push(reader.result as string);
          }
          if (uploadFileType === "fileSecond") {
            this.fileSecondPreviewUrls.push(reader.result as string);
          }
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      if (uploadFileType === "fileFirst") {
        this.fileFirstList.push(file);
      }
      if (uploadFileType === "fileSecond") {
        this.fileSecondList.push(file);
      }
    });
  }

  onDelete(index: number, uploadFileType: string) {
    if (index !== -1) {
      if (uploadFileType === "fileFirst") {
        this.fileFirstList.splice(index, 1);
        this.fileFirstPreviewUrls.splice(index, 1);
      }
      if (uploadFileType === "fileSecond") {
        this.fileSecondList.splice(index, 1);
        this.fileSecondPreviewUrls.splice(index, 1);
      }
    }
  }
}
