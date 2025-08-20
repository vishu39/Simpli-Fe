import { Component, OnInit } from "@angular/core";

@Component({
  selector: "global-shared-finance-billing-view-estimate-bills",
  templateUrl: "./finance-billing-view-estimate-bills.component.html",
  styleUrls: ["./finance-billing-view-estimate-bills.component.scss"],
})
export class FinanceBillingViewEstimateBillsComponent implements OnInit {
  estimateData = [
    {
      _id: "64f2b1c83a01a1",
      estimateGiven: "Yes",
      estimateDate: "2025-08-01",
      hospitalId: "H001",
      hospitalName: "City Care Hospital",
      packageName: "Basic Health Checkup",
      roomCategory: "General Ward",
      roomPrice: 2000,
      currency: {
        code: "INR",
        symbol: "₹",
        name: "Indian Rupee",
      },
      approxAdmissionDate: "2025-08-15",
    },
    {
      _id: "64f2b1c83a01a2",
      estimateGiven: "No",
      comment: "Patient is still deciding on admission date.",
    },
    {
      _id: "64f2b1c83a01a3",
      estimateGiven: "Yes",
      estimateDate: "2025-07-20",
      hospitalId: "H002",
      hospitalName: "Green Valley Clinic",
      packageName: "Orthopedic Surgery Package",
      roomCategory: "Private Room",
      roomPrice: 7500,
      currency: {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
      },
      approxAdmissionDate: "2025-07-25",
    },
    {
      _id: "64f2b1c83a01a4",
      estimateGiven: "No",
      comment: "Package not finalized due to pending tests.",
    },
    {
      _id: "64f2b1c83a01a5",
      estimateGiven: "Yes",
      estimateDate: "2025-09-10",
      hospitalId: "H003",
      hospitalName: "Sunrise Medical Center",
      packageName: "Maternity Care Deluxe",
      roomCategory: "Deluxe Suite",
      roomPrice: 12000,
      currency: {
        code: "EUR",
        symbol: "€",
        name: "Euro",
      },
      approxAdmissionDate: "2025-09-15",
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  hasEstimateNotGiven(): boolean {
  return this.estimateData?.some(est => est?.estimateGiven === 'No');
}

hasEstimateGiven(): boolean {
  return this.estimateData?.some(e => e?.estimateGiven === 'Yes');
}
}
