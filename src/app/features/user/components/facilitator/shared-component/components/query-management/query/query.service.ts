import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class QueryService {
  constructor() {}

  tabs: any[] = [
    { name: "Medical History" },
    { name: "Reports" },
    { name: "Opinion Received" },
    { name: "Opinion Pending" },
    { name: "Requested For VIL" },
    { name: "VIL Response" },
    { name: "Patient Confirmed" },
    { name: "Intimation Sent" },
    { name: "PI Requested" },
    { name: "Proforma Invoice Response" },
    { name: "OPD Requested" },
    { name: "OPD Received" },
  ];

  hospitalTabs: any[] = [
    { name: "Medical History" },
    { name: "Reports" },
    { name: "Opinion Received" },
    { name: "Opinion Pending" },
    { name: "Requested For VIL" },
    { name: "VIL Response" },
    { name: "Patient Confirmed" },
    { name: "Intimation Sent" },
    { name: "PI Requested" },
    { name: "OPD Requested" },
    { name: "OPD Received" },
  ];

  queryButtons: any[] = [
    { name: "Edit", icon: "edit", color: "#1560bd", tooltip: "Edit" },
    { name: "Delete", icon: "delete", color: "#DA012D", tooltip: "Delete" },
    {
      name: "Download",
      icon: "download",
      color: "#1560bd",
      tooltip: "Download",
    },
    {
      name: "Send",
      icon: null,
      color: "#1560bd",
      tooltip: "Send To Patient/Partner",
    },
    { name: "Add", icon: "add", color: "#1560bd", tooltip: "Add Details" },
    {
      name: "Assign",
      icon: null,
      color: "#1560bd",
      tooltip: "Assign Hospital",
    },
  ];
}
