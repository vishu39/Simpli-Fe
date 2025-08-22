import { Component, OnInit } from "@angular/core";

@Component({
  selector: "global-shared-finance-billing-view-admission-tracker-details",
  templateUrl:
    "./finance-billing-view-admission-tracker-details.component.html",
  styleUrls: [
    "./finance-billing-view-admission-tracker-details.component.scss",
  ],
})
export class FinanceBillingViewAdmissionTrackerDetailsComponent implements OnInit {
  
  admissionTrackerData = [
    {
      _id: "64f3c2a91a11a1",
      admissionOnPlannedDate: "Yes",
      admissionDate: "2025-08-10",
      dischargeDate: "2025-08-15",
      admissionOnPlannedDateComment:
        "Patient admitted as per original schedule.",
      hospitalId: "H001",
      hospitalName: "City Care Hospital",
      file: [
        {
          fileName: "admission_form.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/admission_form.pdf",
        },
      ],
    },
    {
      _id: "64f3c2a91a11a2",
      admissionOnPlannedDate: "No",
      admissionDate: "2025-07-05",
      dischargeDate: "2025-07-12",
      admissionOnPlannedDateComment:
        "Admission delayed due to patient’s personal reasons.",
      hospitalId: "H002",
      hospitalName: "Green Valley Clinic",
      file: [
        {
          fileName: "delay_report.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/delay_report.pdf",
        },
        {
          fileName: "medical_summary.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/medical_summary.pdf",
        },
      ],
    },
    {
      _id: "64f3c2a91a11a3",
      admissionOnPlannedDate: "Yes",
      admissionDate: "2025-06-18",
      dischargeDate: "2025-06-20",
      admissionOnPlannedDateComment:
        "Admission completed on the planned date with no delays.",
      hospitalId: "H003",
      hospitalName: "Sunrise Medical Center",
      file: [
        {
          fileName: "discharge_summary.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/discharge_summary.pdf",
        },
        {
          fileName: "treatment_invoice.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/treatment_invoice.pdf",
        },
        {
          fileName: "followup_schedule.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/followup_schedule.pdf",
        },
      ],
    },
    {
      _id: "64f3c2a91a11a4",
      admissionOnPlannedDate: "No",
      admissionDate: "2025-05-22",
      dischargeDate: "2025-05-29",
      admissionOnPlannedDateComment:
        "Emergency rescheduling required due to unforeseen health condition.",
      hospitalId: "H004",
      hospitalName: "Lotus Specialty Hospital",
      file: [
        {
          fileName: "emergency_case_report.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/emergency_case_report.pdf",
        },
      ],
    },
    {
      _id: "64f3c2a91a11a5",
      admissionOnPlannedDate: "Yes",
      admissionDate: "2025-09-01",
      dischargeDate: "2025-09-07",
      admissionOnPlannedDateComment:
        "Smooth admission process as per original date.",
      hospitalId: "H005",
      hospitalName: "Healing Hands Hospital",
      file: [
        {
          fileName: "admission_bill.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/admission_bill.pdf",
        },
        {
          fileName: "insurance_claim.pdf",
          fileType: "application/pdf",
          signedUrl: "https://example.com/files/insurance_claim.pdf",
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
