import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FinanceModuleService {
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

  tabsForMasterData: any[] = [{ name: "Medical History" }, { name: "Reports" }];

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

  buttonsForMasterData: any[] = [
    {
      name: "Add Company Master",
      icon: "add",
      color: "green",
      tooltip: "Add Company Master",
    },
    {
      name: "Add Hospital Master Payout",
      icon: "add",
      color: "#DA012D",
      tooltip: "Add Hospital Master Payout",
    },
    {
      name: "Add Partner Master Payout",
      icon: "add",
      color: "#1560bd",
      tooltip: "Add Partner Master Payout",
    },
    {
      name: "Add Sales Incentive Master",
      icon: "add",
      color: "orange",
      tooltip: "Add Sales Incentive Master",
    },
  ];
}
