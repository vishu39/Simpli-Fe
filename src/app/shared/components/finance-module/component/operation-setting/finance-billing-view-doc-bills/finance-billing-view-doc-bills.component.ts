import { Component, OnInit } from "@angular/core";

@Component({
  selector: "global-shared-finance-billing-view-doc-bills",
  templateUrl: "./finance-billing-view-doc-bills.component.html",
  styleUrls: ["./finance-billing-view-doc-bills.component.scss"],
})
export class FinanceBillingViewDocBillsComponent implements OnInit {
  docBillArray = [
    {
      _id: "64f1a1b23c45d1",
      hospitalId: "H001",
      hospitalName: "City Care Hospital",
      category: "Registration Bill",
      amount: "500",
      currency: {
        code: "INR",
        symbol: "₹",
        name: "Indian Rupee",
      },
      file: [
        {
          fileName: "registration_bill_1.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/registration_bill_1.pdf",
        },
      ],
    },
    {
      _id: "64f1a1b23c45d2",
      hospitalId: "H002",
      hospitalName: "Green Valley Clinic",
      category: "OP Bill",
      amount: "1500",
      currency: {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
      },
      file: [
        {
          fileName: "op_bill_1.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/op_bill_1.pdf",
        },
        {
          fileName: "op_bill_2.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/op_bill_2.pdf",
        },
      ],
    },
    {
      _id: "64f1a1b23c45d3",
      hospitalId: "H003",
      hospitalName: "Sunrise Medical Center",
      category: "IP Bill",
      amount: "25000",
      currency: {
        code: "EUR",
        symbol: "€",
        name: "Euro",
      },
      file: [
        {
          fileName: "ip_bill_main.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/ip_bill_main.pdf",
        },
        {
          fileName: "ip_bill_extra.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/ip_bill_extra.pdf",
        },
        {
          fileName: "ip_bill_discharge.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/ip_bill_discharge.pdf",
        },
      ],
    },
    {
      _id: "64f1a1b23c45d4",
      hospitalId: "H004",
      hospitalName: "Lotus Specialty Hospital",
      category: "Registration Bill",
      amount: "750",
      currency: {
        code: "GBP",
        symbol: "£",
        name: "British Pound",
      },
      file: [
        {
          fileName: "registration_bill_lotus.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/registration_bill_lotus.pdf",
        },
      ],
    },
    {
      _id: "64f1a1b23c45d5",
      hospitalId: "H005",
      hospitalName: "Healing Hands Hospital",
      category: "OP Bill",
      amount: "3200",
      currency: {
        code: "AUD",
        symbol: "A$",
        name: "Australian Dollar",
      },
      file: [
        {
          fileName: "op_bill_healing_1.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/op_bill_healing_1.pdf",
        },
        {
          fileName: "op_bill_healing_2.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/op_bill_healing_2.pdf",
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
