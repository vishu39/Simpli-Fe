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
    { name: "PI Response" },
    { name: "OPD Requested" },
    { name: "OPD Received" },
  ];
  queryButtons: any[] = [
    { name: "Edit", icon: "edit", color: "#5c5c00", tooltip: "Edit" },
    { name: "Delete", icon: "delete", color: "red", tooltip: "Delete" },
    { name: "Download", icon: "download", color: "gray", tooltip: "Download" },
    {
      name: "Send",
      icon: null,
      color: "#313bbf",
      tooltip: "Send To Patient/Partner",
    },
    { name: "Add", icon: "add", color: "#5a4b9d", tooltip: "Add Details" },
    { name: "Assign", icon: null, color: "gray", tooltip: "Assign Hospital" },
  ];
}
