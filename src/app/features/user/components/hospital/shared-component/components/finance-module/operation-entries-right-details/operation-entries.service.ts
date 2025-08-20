import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OperationEntriesService {
  constructor() {}
  tabs: any[] = [
    { name: "Medical History" },
    { name: "Reports" },
    { name: "UHIDS" },
    { name: "Amounts" },
    { name: "Doc Bills" },
    { name: "Estimate Bills" },
    { name: "Admission/Discharge Tracker" },
    { name: "Final Bills" },
  ];

  queryButtons: any[] = [
    {
      name: "Final Billing Upload",
      icon: "upload",
      color: "green",
      tooltip: "Final Billing Upload",
    },
    {
      name: "Admission / Discharge Tracker",
      icon: "timeline",
      color: "#DA012D",
      tooltip: "Admission / Discharge Tracker",
    },
    {
      name: "Upload Estimates",
      icon: "upload",
      color: "#1560bd",
      tooltip: "Upload Estimates",
    },
    {
      name: "Upload Bill Docs",
      icon: "upload",
      color: "orange",
      tooltip: "Upload Bill Docs",
    },
    {
      name: "Add Hospital UHID",
      icon: "add",
      color: "#1560bd",
      tooltip: "Add Hospital UHID",
    },
  ];
}
