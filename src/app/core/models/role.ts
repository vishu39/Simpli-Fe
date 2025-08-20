export const role = {
  admin: "admin",
  employee: "employee",
  branchOffice: "branch office",
  referralPartner: "referral partner",
};

export const patientStatus = {
  preIntimationSent: "Pre Intimation Sent",
  opdRequested: "OPD Requested",
  opdReceived: "OPD Received",
  opdSent: "OPD Sent",
  proformaInvoiceRequested: "Proforma Invoice Requested",
  proformaInvoiceReceived: "Proforma Invoice Received",
  proformaInvoiceSent: "Proforma Invoice Sent",
  proformaInvoiceDownloaded: "Proforma Invoice Downloaded",
  opinionRequested: "Opinion Requested",
  opinionReceived: "Opinion Received",
  opinionSent: "Opinion Sent",
  opinionDownloaded: "Opinion Downloaded",
  vilRequested: "VIL Requested",
  vilReceived: "VIL Received",
  vilSent: "VIL Sent",
  vilDownloaded: "VIL Downloaded",
  confirmationSent: "Confirmation Sent",
  confirmationAcknowledged: "Confirmation Acknowledged",
  patientMapped: "Patient Mapped",
};

export const facilitatorAdminUserType = {
  employee: "employee",
  branchOffice: "branch office",
  referralPartner: "referral partner",
};

export const hospitalAdminUserType = {
  employee: "employee",
  branchOffice: "branch office",
  referralPartner: "referral partner",
  treatingDoctor: "treating doctor",
  referralDoctor: "referral doctor",
  insurance: "insurance",
  corporate: "corporate",
};

export const treatingDoctorUserType = hospitalAdminUserType.treatingDoctor;

export const doctorStaffType = {
  assistantDoctor: "assistant doctor",
  coordinator: "coordinator",
};

export const patientStatusForFac = {
  preIntimationSent: "Pre Intimation Sent",
  opdRequested: "OPD Requested",
  opdReceived: "OPD Received",
  opdSent: "OPD Sent",
  proformaInvoiceRequested: "Proforma Invoice Requested",
  proformaInvoiceReceived: "Proforma Invoice Received",
  proformaInvoiceSent: "Proforma Invoice Sent",
  proformaInvoiceDownloaded: "Proforma Invoice Downloaded",
  opinionRequested: "Opinion Requested",
  opinionReceived: "Opinion Received",
  opinionSent: "Opinion Sent",
  opinionDownloaded: "Opinion Downloaded",
  vilRequested: "VIL Requested",
  vilRequestEdited: "VIL Request Edited",
  vilReceived: "VIL Received",
  vilSent: "VIL Sent",
  vilDownloaded: "VIL Downloaded",
  confirmationSent: "Confirmation Sent",
};

export const patientStatusForFacString = [
  "Pre Intimation Sent",
  "OPD Requested",
  "OPD Received",
  "OPD Sent",
  "Proforma Invoice Requested",
  "Proforma Invoice Received",
  "Proforma Invoice Sent",
  "Proforma Invoice Downloaded",
  "Opinion Requested",
  "Opinion Received",
  "Opinion Sent",
  "Opinion Downloaded",
  "VIL Requested",
  // "VIL Request Edited",
  "VIL Received",
  "VIL Sent",
  "VIL Downloaded",
  "Confirmation Sent",
];

export const patientStatusForHos = {
  queryAdded: "Query Added",
  preIntimationSent: "Pre Intimation Sent",
  opinionRequested: "Opinion Requested",
  opinionAdded: "Opinion Added",
  queryForwardedToDoctor: "Query Forwarded to Doctor",
  doctorReplied: "Doctor Replied",
  opinionSent: "Opinion Sent",
  opinionDownloaded: "Opinion Downloaded",
  vilRequested: "VIL Requested",
  vilAdded: "VIL Added",
  vilSent: "VIL Sent",
  vilDownloaded: "VIL Downloaded",
  opdRequested: "OPD Requested",
  opdAdded: "OPD Added",
  opdSent: "OPD Sent",
  proformaInvoiceRequested: "Proforma Invoice Requested",
  proformaInvoiceSent: "Proforma Invoice Sent",
  proformaInvoiceDownloaded: "Proforma Invoice Downloaded",
  confirmationSent: "Confirmation Sent",
};

export const patientStatusForHosString = [
  "Query Added",
  "Pre Intimation Sent",
  "OPD Requested",
  "OPD Added",
  "OPD Sent",
  "Proforma Invoice Requested",
  "Proforma Invoice Sent",
  "Proforma Invoice Downloaded",
  "Opinion Requested",
  "Query Forwarded to Doctor",
  "Doctor Replied",
  "Opinion Added",
  "Opinion Sent",
  "Opinion Downloaded",
  "VIL Requested",
  "VIL Added",
  "VIL Sent",
  "VIL Downloaded",
  "Confirmation Sent",
];
