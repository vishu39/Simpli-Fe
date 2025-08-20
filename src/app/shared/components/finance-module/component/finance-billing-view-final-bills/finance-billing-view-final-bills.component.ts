import { Component, OnInit } from "@angular/core";

@Component({
  selector: "global-shared-finance-billing-view-final-bills",
  templateUrl: "./finance-billing-view-final-bills.component.html",
  styleUrls: ["./finance-billing-view-final-bills.component.scss"],
})
export class FinanceBillingViewFinalBillsComponent implements OnInit {
  finalBillData = [
    {
      _id: "64f4d3a51a21a1",
      admissionDate: "2025-08-10",
      dischargeDate: "2025-08-15",
      hospitalId: "H001",
      hospitalName: "City Care Hospital",
      fileFirst: [
        {
          fileName: "admission_form.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/admission_form.pdf",
        },
        {
          fileName: "pre_admission_report.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/pre_admission_report.pdf",
        },
      ],
      fileSecond: [
        {
          fileName: "discharge_summary.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/discharge_summary.pdf",
        },
      ],
    },
    {
      _id: "64f4d3a51a21a2",
      admissionDate: "2025-07-05",
      dischargeDate: "2025-07-12",
      hospitalId: "H002",
      hospitalName: "Green Valley Clinic",
      fileFirst: [
        {
          fileName: "admission_invoice.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/admission_invoice.pdf",
        },
      ],
      fileSecond: [
        {
          fileName: "final_bill.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/final_bill.pdf",
        },
        {
          fileName: "insurance_paper.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/insurance_paper.pdf",
        },
      ],
    },
    {
      _id: "64f4d3a51a21a3",
      admissionDate: "2025-06-18",
      dischargeDate: "2025-06-20",
      hospitalId: "H003",
      hospitalName: "Sunrise Medical Center",
      fileFirst: [
        {
          fileName: "surgery_consent.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/surgery_consent.pdf",
        },
        {
          fileName: "pre_op_tests.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/pre_op_tests.pdf",
        },
        {
          fileName: "anesthesia_clearance.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/anesthesia_clearance.pdf",
        },
      ],
      fileSecond: [
        {
          fileName: "post_op_report.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/post_op_report.pdf",
        },
        {
          fileName: "recovery_notes.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/recovery_notes.pdf",
        },
      ],
    },
    {
      _id: "64f4d3a51a21a4",
      admissionDate: "2025-05-22",
      dischargeDate: "2025-05-29",
      hospitalId: "H004",
      hospitalName: "Lotus Specialty Hospital",
      fileFirst: [
        {
          fileName: "maternity_registration.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/maternity_registration.pdf",
        },
      ],
      fileSecond: [
        {
          fileName: "delivery_report.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/delivery_report.pdf",
        },
        {
          fileName: "baby_health_card.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/baby_health_card.pdf",
        },
        {
          fileName: "mother_discharge_summary.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/mother_discharge_summary.pdf",
        },
      ],
    },
    {
      _id: "64f4d3a51a21a5",
      admissionDate: "2025-09-01",
      dischargeDate: "2025-09-07",
      hospitalId: "H005",
      hospitalName: "Healing Hands Hospital",
      fileFirst: [
        {
          fileName: "emergency_admission_slip.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/emergency_admission_slip.pdf",
        },
        {
          fileName: "triage_report.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/triage_report.pdf",
        },
      ],
      fileSecond: [
        {
          fileName: "followup_instructions.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/followup_instructions.pdf",
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
