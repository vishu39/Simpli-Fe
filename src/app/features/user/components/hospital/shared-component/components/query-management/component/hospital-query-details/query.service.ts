import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class QueryHospitalService {
  constructor() {}
  tabs: any[] = [
    { name: "Medical History" },
    { name: "Reports" },
    { name: "Doctor Opinion Requested" },
    { name: "Doctor Opinion Received" },
    { name: "Opinion Added" },
    { name: "Opinion Pending" },
    { name: "Requested For VIL" },
    { name: "VIL Added" },
    { name: "Patient Confirmed" },
    { name: "Intimation Sent" },
    { name: "PI Requested" },
    { name: "OPD Requested" },
    { name: "OPD Added" },
  ];

  tabsForTratingDoctor: any[] = [
    { name: "Recordings" },
    { name: "Opinion Pending" },
    { name: "Opinion Added" },
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
    {
      name: "Forward to doctor",
      icon: null,
      color: "#1560bd",
      tooltip: "Forward to doctor",
    },
  ];

  queryButtonsForTreatingDoctor: any[] = [
    {
      name: "Record",
      icon: "mic_none",
      color: "#DA012D",
      tooltip: "Record Audio",
    },
    { name: "Add", icon: "add", color: "#1560bd", tooltip: "Add Details" },
  ];
}
