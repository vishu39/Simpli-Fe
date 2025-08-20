import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import {cloneDeep} from "lodash"

@Component({
  selector: "app-email-hospital-content-dialog",
  templateUrl: "./email-content-dialog.component.html",
  styleUrls: ["./email-content-dialog.component.scss"],
})
export class EmailContentDialogComponent implements OnInit {
  dialogTitle: string;
  emailContentForm: FormGroup;
  emailContentModuleData: any = [];
  emailContentModuleFreshData: any = [];
  emailContentData: any = [];
  selectedEmailContentData: any;
  isMentionOpen = false;
  public Editor = ClassicEditor;
  mentionConfig = {
    triggerChar: "@",
    allowSpace: true,
    labelKey: "value",
    mentionSelect: this.formatMention,
  };
  constructor(
    private dialogRef: MatDialogRef<EmailContentDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {
    this.buildForm();
  }

  buildForm() {
    this.emailContentForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      subject: ["", [Validators.required]],
      body: ["", [Validators.required]],
    });
  }

  formatMention(item: any) {
    return "@" + item.value + " ";
  }
  onEventSelect(item: any) {
    const filterData = this.emailContentData.filter(
      (obj) => obj.name === item.name
    );
    if (filterData.length) {
      this.sharedService.showNotification(
        "snackBar-danger",
        "Event already exist"
      );
    } else {
      this.selectedEmailContentData = item;
    }
  }
  onEditorReady(editor: any) {
    // Access the CKEditor instance
    editor.editing.view.document.on("enter", (eventInfo: any, data: any) => {
      // Prevent the default "Enter" key action
      if (this.isMentionOpen) {
        eventInfo.stop();
        this.isMentionOpen = false;
      }
    });
  }

  onMentionsPanelOpened() {
    this.isMentionOpen = true;
  }

  ngOnInit(): void {
    this.getEmailContentModule();
    this.getAllEmailContent();
  }
  getAllEmailContent() {
    this.hospitalService.getAllEmailContent().subscribe((res: any) => {
      this.emailContentData = res.data;
    });
  }
  getEmailContentModule() {
    this.hospitalService.getEmailContentModule().subscribe((res) => {
      this.emailContentModuleData = res.data;
      this.emailContentModuleFreshData = res.data;
    });
  }

  emailContentFormSubmit() {
    if (this.emailContentForm.valid) {
      if (!this.selectedEmailContentData._id)
        this.hospitalService
          .addEmailContent(this.emailContentForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      else {
        this.hospitalService
          .editEmailContent(
            this.selectedEmailContentData._id,
            this.emailContentForm.value
          )
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.emailContentForm.controls).forEach((key) => {
        this.emailContentForm.controls[key].markAsTouched();
      });
    }
  }

  onEdit(data) {
    this.selectedEmailContentData = data;
    this.emailContentForm.patchValue({
      name: this.selectedEmailContentData.name,
      subject: this.selectedEmailContentData.subject,
      body: this.selectedEmailContentData.body,
    });
  }
  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  timeoutEvent = null;
  search(filterValue: string) {    
    clearTimeout(this.timeoutEvent);
    this.timeoutEvent = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.emailContentModuleFreshData);        
        this.emailContentModuleData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.displayName?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.emailContentModuleData = filterArray;
      } else {
        this.emailContentModuleData = this.emailContentModuleFreshData;
      }
    }, 600);
  }
}
