import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
@Component({
  selector: "app-calendar-dialog",
  templateUrl: "./calendar-dialog.component.html",
  styleUrls: ["./calendar-dialog.component.scss"],
})
export class CalendarDialogComponent implements OnInit {
  calendarData: any;
  calendarForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.calendarData = this.data?.calendarData;
    // console.log(this.calendarData);

    this.calendarForm = this.fb.group({
      patient_name: [
        { value: this.calendarData?.patient?.name, disabled: true },
      ],
      treatment: [
        { value: this.calendarData?.patient?.treatment, disabled: true },
      ],
      country: [{ value: this.calendarData?.patient?.country, disabled: true }],
      hospital: [{ value: this.calendarData?.hospitalName, disabled: true }],
      cabs: [{ value: this.calendarData?.cabs, disabled: true }],
      flight_name: [{ value: this.calendarData?.flightName, disabled: true }],
      flight_no: [{ value: this.calendarData?.flightNo, disabled: true }],
      arrivalDate: [{ value: this.calendarData?.arrivalDate, disabled: true }],
      contact_person: [
        { value: this.calendarData?.contactPerson, disabled: true },
      ],
      contact_person_number: [
        { value: this.calendarData?.contactPersonNo, disabled: true },
      ],
      coordinatorPickUpTime: [
        { value: this.calendarData?.coordinatorPickUpTime, disabled: true },
      ],
      remarks: [{ value: this.calendarData?.remarks, disabled: true }],
      tickets: [this.calendarData?.ticket],
    });
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
}
