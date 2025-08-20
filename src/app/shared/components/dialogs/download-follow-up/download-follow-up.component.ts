import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from "@angular/material/datepicker";
import { MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import FileSaver from "file-saver";
import { log } from "node:console";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";

@Component({
  selector: "app-download-follow-up",
  templateUrl: "./download-follow-up.component.html",
  styleUrls: ["./download-follow-up.component.scss"],
})
export class DownloadFollowUpComponent implements OnInit {
  dialogTitle: string = "Download Follow Up";
  reportForm: FormGroup;
  maxStartDate: Date;

  reportTypeArray: any = [];

  constructor(
    private dialogRef: MatDialogRef<DownloadFollowUpComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private hospitalService: HospitalService
  ) {
    this.buildForm();
    const today = new Date();
    this.maxStartDate = today;
  }

  buildForm() {
    this.reportForm = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      type: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getFollowUpReportType();
  }

  getFollowUpReportType() {
    this.sharedService.getFollowUpReportType().subscribe((res: any) => {
      this.reportTypeArray = res?.data;
      if (this.reportTypeArray?.length > 0) {
        let ZeroIndexData = this.reportTypeArray[0];
        this.reportForm.patchValue({
          type: ZeroIndexData,
        });

        const startDateControl = this.reportForm.get("startDate");
        const endDateControl = this.reportForm.get("endDate");

        if (ZeroIndexData === "Open Follow Up Report") {
          startDateControl?.clearValidators();
          startDateControl?.updateValueAndValidity();
          endDateControl?.clearValidators();
          endDateControl?.updateValueAndValidity();

          this.reportForm.patchValue({
            startDate: "",
            endDate: "",
          });
          startDateControl.disable();
          endDateControl.disable();
        } else {
          let startDateError = this.reportForm.get("startDate")?.errors;
          let endDateError = this.reportForm.get("endDate")?.errors;

          if (!startDateError?.required) {
            startDateControl?.setValidators([Validators.required]);
            startDateControl?.updateValueAndValidity();
          }
          if (!endDateError?.required) {
            endDateControl?.setValidators([Validators.required]);
            endDateControl?.updateValueAndValidity();
          }

          startDateControl.enable();
          endDateControl.enable();
        }
      }
    });
  }

  setStartAndEndValidators() {
    const startDateControl = this.reportForm.get("startDate");
    const endDateControl = this.reportForm.get("endDate");

    startDateControl?.setValidators([Validators.required]);
    startDateControl?.updateValueAndValidity();
    endDateControl?.setValidators([Validators.required]);
    endDateControl?.updateValueAndValidity();
  }

  
  reportFormSubmit() {
   let loginType=GET_LOGIN_TYPE()
    if (this.reportForm.valid) {
      this.sharedService.startLoader();
      let values = this.reportForm.getRawValue();

      if (values?.endDate) {
        new Date(values.endDate);
        values.endDate.setHours(23, 59, 59);
      }

      if(loginType==='facilitator'){
        this.facilitatorService
        .downloadFollowUpQuery(values)
        .subscribe((res: any) => {
          // window.open(res.data);
          let e = res?.data;
          const uint8Array = new Uint8Array(e?.content?.data);
          let blob = new Blob([uint8Array], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          FileSaver.saveAs(blob, e?.filename);
          this.sharedService.stopLoader();
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
      }
     else if(loginType==='hospital'){
       this.hospitalService
         .downloadFollowUpQuery(values)
         .subscribe((res: any) => {
           // window.open(res.data);
           let e = res?.data;
           const uint8Array = new Uint8Array(e?.content?.data);
           let blob = new Blob([uint8Array], {
             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
           });
           FileSaver.saveAs(blob, e?.filename);
           this.sharedService.stopLoader();
           this.sharedService.showNotification("snackBar-success", res.message);
           this.closeDialog(true);
         });
      }
    } else {
      Object.keys(this.reportForm.controls).forEach((key) => {
        this.reportForm.controls[key].markAsTouched();
      });
    }
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  onChangeMode(event: any) {
    let eventValue = event.value;
    const startDateControl = this.reportForm.get("startDate");
    const endDateControl = this.reportForm.get("endDate");
    if (eventValue === "Open Follow Up Report") {
      startDateControl?.clearValidators();
      startDateControl?.updateValueAndValidity();
      endDateControl?.clearValidators();
      endDateControl?.updateValueAndValidity();

      this.reportForm.patchValue({
        startDate: "",
        endDate: "",
      });
      startDateControl.disable();
      endDateControl.disable();
    } else {
      let startDateError = this.reportForm.get("startDate")?.errors;
      let endDateError = this.reportForm.get("endDate")?.errors;

      startDateControl.enable();
      endDateControl.enable();

      if (!startDateError?.required) {
        startDateControl?.setValidators([Validators.required]);
        startDateControl?.updateValueAndValidity();
      }
      if (!endDateError?.required) {
        endDateControl?.setValidators([Validators.required]);
        endDateControl?.updateValueAndValidity();
      }
    }
  }

  // multiple dates logic
  init = new Date();
  resetModel = new Date(0);
  model = [];

  dateClass = (date: Date) => {
    if (this.findDate(date) !== -1) {
      return ["selected"];
    }
    return [];
  };

  dateChanged(
    event: MatDatepickerInputEvent<Date>,
    picker: MatDatepicker<Date>
  ): void {
    const selectedDate = event.value;

    if (selectedDate) {
      const index = this.findDate(selectedDate);

      if (index === -1) {
        this.model.push(selectedDate);
      } else {
        this.model.splice(index, 1);
      }
      this.resetModel = new Date(0);

      this.keepPickerOpen(picker);
    }
  }

  keepPickerOpen(picker: MatDatepicker<Date>): void {
    const closeFn = picker.close;
    picker.close = () => {};
    picker["_componentRef"].instance._calendar.monthView._createWeekCells();
    setTimeout(() => {
      picker.close = closeFn;
    });
  }

  remove(date: Date): void {
    const index = this.findDate(date);
    this.model.splice(index, 1);
  }

  findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }
}
