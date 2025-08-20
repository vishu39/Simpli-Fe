import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from "@angular/material/datepicker";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "app-report-dialog",
  templateUrl: "./report-dialog.component.html",
  styleUrls: ["./report-dialog.component.scss"],
})
export class ReportDialogComponent implements OnInit {
  dialogTitle: string;
  reportForm: FormGroup;
  maxStartDate: Date;

  reportTypeArray: any = [];

  constructor(
    private dialogRef: MatDialogRef<ReportDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
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
      holiday: [""],
      fromTime: [""],
      toTime: [""],
      type: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getPatientExcelReportType();
  }

  getPatientExcelReportType() {
    this.sharedService.getPatientExcelReportType().subscribe((res: any) => {
      this.reportTypeArray = res?.data;
      if (this.reportTypeArray?.length > 0) {
        let masterIndex = this.reportTypeArray?.findIndex(
          (rta: any) => rta === "Master Report"
        );

        if (masterIndex !== -1) {
          this.reportForm.patchValue({
            type: this.reportTypeArray[masterIndex],
          });
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
    if (this.reportForm.valid) {
      let values = this.reportForm.getRawValue();
      let payload = cloneDeep(values);

      if (this.reportForm?.get("type")?.value === "Sunday & Holiday Report") {
        payload["holiday"] = this.model;

        if (
          !payload?.holiday?.length &&
          !payload?.endDate &&
          !payload?.startDate
        ) {
          this.sharedService.showNotification(
            "snackBar-danger",
            "Please select the date range or holiday dates"
          );
          return;
        }
        if (!!payload?.startDate && !payload?.endDate) {
          this.setStartAndEndValidators();
          this.reportForm.markAllAsTouched();
          return;
        }
        if (!!payload?.endDate && !payload?.startDate) {
          this.setStartAndEndValidators();
          this.reportForm.markAllAsTouched();
          return;
        }
        if (!!payload?.startDate && !!payload?.endDate) {
          new Date(payload.endDate);
          payload.endDate.setHours(23, 59, 59);
        }
      } else {
        new Date(payload.endDate);
        payload.endDate.setHours(23, 59, 59);
      }

      this.hospitalService
        .downloadPatientExcelReport(payload)
        .subscribe((res: any) => {
          window.open(res.data);
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
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
    const fromTimeControl = this.reportForm.get("fromTime");
    const toTimeControl = this.reportForm.get("toTime");
    if (eventValue === "Sunday & Holiday Report") {
      startDateControl?.clearValidators();
      startDateControl?.updateValueAndValidity();
      endDateControl?.clearValidators();
      endDateControl?.updateValueAndValidity();

      fromTimeControl?.setValidators([
        Validators.required,
        Validators.pattern(regexService.negativeToPositiveWithoutDecimal),
      ]);
      fromTimeControl?.updateValueAndValidity();
      toTimeControl?.setValidators([
        Validators.required,
        Validators.pattern(regexService.negativeToPositiveWithoutDecimal),
      ]);
      toTimeControl?.updateValueAndValidity();

      this.reportForm.patchValue({
        startDate: "",
        endDate: "",
        fromTime: "0",
        toTime: "0",
      });
    } else {
      this.model = [];

      this.reportForm.patchValue({
        holiday: "",
        fromTime: "",
        toTime: "",
      });

      fromTimeControl?.clearValidators();
      fromTimeControl?.updateValueAndValidity();
      toTimeControl?.clearValidators();
      toTimeControl?.updateValueAndValidity();

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
