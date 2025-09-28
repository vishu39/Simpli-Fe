import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "global-shared-vil-ai-checker-table",
  templateUrl: "./vil-ai-checker-table.component.html",
  styleUrls: ["./vil-ai-checker-table.component.scss"],
})
export class VilAiCheckerTableComponent implements OnInit {
  @Input() isAiVilChecker: boolean = false;
  @Input() readTotalData: any = {};

  statusAccordingToIcon = {
    Correct: { icon: "check_circle", bg: "green" },
    Mismatched: { icon: "cancel", bg: "red" },
    Incorrect: { icon: "warning", bg: "orange" },
  };

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {}

  getCorrectDate(date: any): string {
    if (!date) return "";

    let newDob;

    // Try parsing DD/MM/YYYY format first
    if (typeof date === "string" && date.includes("/")) {
      newDob = moment(date, "DD/MM/YYYY", true); // true = strict parsing
    } else {
      newDob = moment(date); // ISO and other formats
    }

    if (!newDob.isValid()) {
      return "";
    }

    const convertedDate = newDob.toDate();
    return this.datePipe.transform(convertedDate, "mediumDate") || "";
  }

  getCorrectDateForAppointment(date: any): string {
    if (!date) return "";

    let newDob;

    // Try parsing DD/MM/YYYY format first
    if (typeof date === "string" && date.includes("/")) {
      newDob = moment(date, "DD/MM/YYYY", true); // true = strict parsing
    } else {
      newDob = moment(date); // ISO and other formats
    }

    if (!newDob.isValid()) {
      return "";
    }

    const convertedDate = newDob.toDate();
    return this.datePipe.transform(convertedDate, "medium") || "";
  }
}
