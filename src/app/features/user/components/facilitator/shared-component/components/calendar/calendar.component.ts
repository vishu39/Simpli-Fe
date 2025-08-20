import { Component, OnInit, ViewChild } from "@angular/core";
import { CalendarOptions, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { MatDialog } from "@angular/material/dialog";
import { CalendarDialogComponent } from "./dialog/calendar-dialog/calendar-dialog.component";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { DatePipe } from "@angular/common";
import { convertKeysToLowercase } from "src/app/shared/sharedConstant";
import tippy from "tippy.js";
import * as moment from "moment";

@Component({
  selector: "shared-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  date = new Date();
  day = this.date.getDate();
  month = this.date.getMonth();
  year = this.date.getFullYear();
  firstDay = new Date(this.year, this.month, 1, 0, 0);
  lastDay = new Date(this.year, this.month + 1, 0, 23, 59, 59);
  loading: boolean = true;

  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getPatientConfirmationCalendar(this.firstDay, this.lastDay);
  }
  getPatientConfirmationCalendar(startDate: any, endDate: any) {
    this.loading = true;
    this.facilitatorService
      .getPatientConfirmationCalendar({
        startDate,
        endDate,
      })
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.loading = false;
            this.mapCalanderData(res?.data);
          }
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  mapCalanderData(data: any) {
    let arr: any = [];
    if (data?.length) {
      data?.forEach((d: any) => {
        d.backgroundColur = "red";
        let calendarOptionObj = {
          title: d?.patient?.name,
          start: new Date(d?.arrivalDate),
          end: moment(d?.arrivalDate).endOf("d").toISOString(),
          data: d,
        };
        arr.push(calendarOptionObj);
      });

      this.calendarOptions.events = arr;
    }
  }

  getEventTextColor(eventData: any): string {
    let country = eventData.patient.country.toLowerCase();

    return this.countryColorObj?.[country]?.textColor || "white";
  }

  getEventColor(eventData: any): string {
    let country = eventData.patient.country.toLowerCase();

    return this.countryColorObj?.[country]?.backgroundColor || "green";
  }

  countryColorObj = convertKeysToLowercase();

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    weekends: true,
    editable: true,
    selectable: true,
    eventClick: this.handleEventClick.bind(this),
    datesSet: this.handleDateSet.bind(this),
    eventDidMount: this.handleEventDidMount.bind(this),
  };

  ngAfterViewInit() {
    // this.attachHeaderButtonListeners();
  }

  attachHeaderButtonListeners() {
    const calendarEl = document.querySelector(".fc-toolbar-chunk");
    const monthButton = document.querySelector(".fc-dayGridMonth-button");
    const weekButton = document.querySelector(".fc-timeGridWeek-button");
    const dayButton = document.querySelector(".fc-timeGridDay-button");

    monthButton.addEventListener("click", (event: any) => {
      this.handleHeaderButtonClick(event);
    });
    weekButton.addEventListener("click", (event: any) => {
      this.handleHeaderButtonClick(event);
    });
    dayButton.addEventListener("click", (event: any) => {
      this.handleHeaderButtonClick(event);
    });

    if (calendarEl) {
      calendarEl.addEventListener("click", (event: any) => {
        let targetButton = event.target.closest(
          ".fc-prev-button, .fc-next-button, .fc-today-button"
        );

        if (targetButton) {
          this.handleHeaderButtonClick(event);
        }
      });
    }
  }

  @ViewChild("calendar") calendar: any;

  handleHeaderButtonClick(event) {
    let info = this.calendar.calendar;
    let currentData = info?.view.getCurrentData();
    let monthName = "";
    let currYear: number;
    let monthIndex: number;
    let selectedFirstDay: any;
    let selectedLastDay: any;
    let gridType = info?.view?.type;

    switch (gridType) {
      case "dayGridMonth":
        monthName = currentData?.viewTitle?.split(" ")[0];
        currYear = currentData?.viewTitle?.split(" ")[1];
        monthIndex = this.getMonthIndex(monthName);
        selectedFirstDay = new Date(currYear, monthIndex, 1, 0, 0);
        selectedLastDay = new Date(currYear, monthIndex + 1, 0, 23, 59, 59);
        break;
      default:
        selectedFirstDay = info.view.activeStart;
        selectedLastDay = new Date(info.view.activeEnd - 1);
        break;
    }

    this.getPatientConfirmationCalendar(selectedFirstDay, selectedLastDay);
  }

  handleEventDidMount(info: any) {
    let data = info.event.extendedProps.data;
    let treatment = data?.patient?.treatment || "NIL";
    const formattedDate = this.datePipe.transform(data.arrivalDate, "medium");
    const eventDetails = `
    Hospital Name: ${data.hospitalName}<br>
  Country: ${data?.patient?.country}<br>
  Treatment: ${treatment}<br>
  Arrival Date: ${formattedDate}
        `;
    tippy(info.el, {
      content: eventDetails,
      placement: "top",
      theme: "custom",
      allowHTML: true,
      delay: [0, 0],
      duration: [0, 0],
      onShow(instance) {
        instance.popper.style.backgroundColor = "white";
        instance.popper.style.color = "black";
        instance.popper.style.border = "1px solid lightgrey";
        instance.popper.style.padding = "12px";
      },
    });

    const backgroundColor = this.getEventColor(info.event.extendedProps.data);
    const textColor = this.getEventTextColor(info.event.extendedProps.data);
    info.el.style.backgroundColor = backgroundColor;
    info.el.style.borderColor = backgroundColor;
    info.el.style.color = textColor;
  }

  getMonthIndex(monthName: any) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const index = monthNames.findIndex(
      (name) => name.toLowerCase() === monthName.toLowerCase()
    );
    return index !== -1 ? index : -1;
  }

  handleDateSet(info: any) {
    let currentData = info?.view.getCurrentData();
    let monthName = "";
    let currYear: number;
    let monthIndex: number;
    let selectedFirstDay: any;
    let selectedLastDay: any;
    let gridType = info?.view?.type;

    switch (gridType) {
      case "dayGridMonth":
        monthName = currentData?.viewTitle?.split(" ")[0];
        currYear = currentData?.viewTitle?.split(" ")[1];
        monthIndex = this.getMonthIndex(monthName);
        selectedFirstDay = new Date(currYear, monthIndex, 1, 0, 0);
        selectedLastDay = new Date(currYear, monthIndex + 1, 0, 23, 59, 59);
        break;
      default:
        selectedFirstDay = info?.start;
        selectedLastDay = new Date(info?.end - 1);
        break;
    }
    this.getPatientConfirmationCalendar(selectedFirstDay, selectedLastDay);
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick(clickInfo);
  }

  eventClick(row: any) {
    this.dialog.open(CalendarDialogComponent, {
      minWidth: "60%",
      disableClose: true,
      autoFocus: false,
      data: {
        calendarData: row.event.extendedProps.data,
      },
    });
  }
}
