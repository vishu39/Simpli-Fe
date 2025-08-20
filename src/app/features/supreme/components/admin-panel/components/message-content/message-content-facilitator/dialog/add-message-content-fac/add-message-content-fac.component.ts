import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { SharedService } from 'src/app/core/service/shared/shared.service';
import { SupremeService } from 'src/app/core/service/supreme/supreme.service';
import { cloneDeep } from "lodash";

@Component({
  selector: 'app-add-message-content-fac',
  templateUrl: './add-message-content-fac.component.html',
  styleUrls: ['./add-message-content-fac.component.scss']
})
export class AddMessageContentFacComponent implements OnInit {
  dialogTitle: string;
  messageContentForm: FormGroup;
  messageContentModuleData: any = [];
  messageContentModuleFreshData: any = [];
  messageContentData: any = [];
  messageContentFreshData: any = [];
  selectedMessageContentData: any;
  isMentionOpen = false;
  public Editor = ClassicEditor;
  mentionConfig = {
    triggerChar: "@",
    allowSpace: true,
    labelKey: "value",
    mentionSelect: this.formatMention,
  };
  constructor(
    private dialogRef: MatDialogRef<AddMessageContentFacComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private supremeService: SupremeService
  ) {
    this.buildForm();
  }

  buildForm() {
    this.messageContentForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });
  }

  formatMention(item: any) {
    return "@" + item.value + " ";
  }
  onEventSelect(item: any) {
    const filterData = this.messageContentData.filter(
      (obj) => obj.name === item.name
    );
    if (filterData.length) {
      this.sharedService.showNotification(
        "snackBar-danger",
        "Event already exist"
      );
    } else {
      this.selectedMessageContentData = item;
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
    this.getMessageContentModuleFac();
    this.getAllMessageContentFac();
  }
  getAllMessageContentFac() {
    this.supremeService.getAllMessageContentFac().subscribe((res: any) => {
      this.messageContentData = res.data;
      this.messageContentFreshData = res.data;
    });
  }
  getMessageContentModuleFac() {
    this.supremeService.getMessageContentModuleFac().subscribe((res) => {
      this.messageContentModuleData = res.data;
      this.messageContentModuleFreshData = res.data;
    });
  }

  messageContentFormSubmit() {
    if (this.messageContentForm.valid) {
      if (!this.selectedMessageContentData._id)
        this.supremeService
          .addMessageContentFac(this.messageContentForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      else {
        this.supremeService
          .editMessageContentFac(
            this.selectedMessageContentData._id,
            this.messageContentForm.value
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
      Object.keys(this.messageContentForm.controls).forEach((key) => {
        this.messageContentForm.controls[key].markAsTouched();
      });
    }
  }

  onEdit(data) {
    this.selectedMessageContentData = data;
    this.messageContentForm.patchValue({
      name: this.selectedMessageContentData.name,
      message: this.selectedMessageContentData.message,
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
        let filterArray = cloneDeep(this.messageContentModuleFreshData);        
        this.messageContentModuleData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.displayName?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.messageContentModuleData = filterArray;
      } else {
        this.messageContentModuleData = this.messageContentModuleFreshData;
      }
    }, 600);
  }
}
