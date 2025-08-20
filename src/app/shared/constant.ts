import { v4 as uuidv4 } from "uuid";

export const getExtensionFromMimeType = (mimeType: string) => {
  const mimeTypes: { [key: string]: string } = {
    // Document MIME Types
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "application/rtf": "rtf",
    "text/plain": "txt",
    "text/csv": "csv",
    "text/html": "html",
    "application/json": "json",
    "application/xml": "xml",

    // Image MIME Types
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/svg+xml": "svg",
    "image/webp": "webp",
    "image/tiff": "tiff",

    // Audio MIME Types
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
    "audio/x-ms-wma": "wma",
    "audio/aac": "aac",

    // Video MIME Types
    "video/mp4": "mp4",
    "video/x-msvideo": "avi",
    "video/x-matroska": "mkv",
    "video/webm": "webm",
    "video/mpeg": "mpeg",
    "video/quicktime": "mov",

    // Compressed/Archive MIME Types
    "application/zip": "zip",
    "application/x-rar-compressed": "rar",
    "application/x-7z-compressed": "7z",
    "application/x-tar": "tar",
    "application/gzip": "gz",

    // Application MIME Types
    "application/vnd.android.package-archive": "apk",
    "application/x-msdownload": "exe",
    "application/x-shockwave-flash": "swf",
    "application/x-bzip": "bz",
    "application/x-bzip2": "bz2",
    "application/x-rpm": "rpm",

    // Font MIME Types
    "font/woff": "woff",
    "font/woff2": "woff2",
    "application/x-font-ttf": "ttf",
    "application/x-font-opentype": "otf",

    // Other
    "application/octet-stream": "bin",
    "application/vnd.apple.installer+xml": "mpkg",
  };

  return mimeTypes[mimeType] || "unknown";
};

export const extractEmailFormMail = (emailString: string): string => {
  const emailPattern = /<([^>]+)>/;
  const match = emailString.match(emailPattern);
  if (!!match) {
    return match ? match[1] : "";
  } else {
    return emailString;
  }
};

export const convertBufferToFile = (
  buffer: ArrayBuffer,
  fileName: string,
  mimeType: string
): File => {
  const blob = new Blob([buffer], { type: mimeType });
  const file = new File([blob], fileName, { type: mimeType });
  return file;
};

export const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceID");
  if (!deviceId) {
    deviceId = uuidv4(); // Generate a new UUID
    localStorage.setItem("deviceID", deviceId);
  }
  return deviceId;
};

export const getDeviceIdFromLocalStorage = () => {
  let deviceId = localStorage.getItem("deviceID");
  if (deviceId) {
    return deviceId;
  } else {
    return "";
  }
};

export const userPermissionDisplayName = {
  internalUserProfile: "Internal User Profile",
  accountDetails: "Account Details",
  accountDetailsAttribute: "Account Details Attribute",
  referralPartnerDetails: "Referral Partner Details",
  branchOfficeDetails: "Branch Office Details",
  internalUser: "Internal User",
  emailCommunication: "Email Communication",
  templateSetting: "Template Setting",
  vilSetting: "VIL Setting",
  bankDetails: "Bank Details",
  userPermissionHospital: "User Permission Hospital",
  hospitalStaffSupreme: "Hospital Staff Supreme",
  hospitalEmailSupreme: "Hospital Email Supreme",
  queryViewSetting: "Query View Setting",
  emailContentUser: "Email Content User",
  topHospital: "Top Hospital",
  patient: "Patient",
  emailSendSetting: "Email Send Setting",
  opinion: "Opinion",
  opd: "OPD",
  vil: "VIL",
  proformaInvoice: "Proforma Invoice",
  preIntimation: "Pre Intimation",
  patientConfirmation: "Patient Confirmation",
  issuedVil: "Issued VIL",
  dashboard: "Dashboard",
  operationBoard: "Operation Board",
  patientItinerary: "Patient Itinerary",
  commentSetting: "Comment Setting",
  notificationSetting: "Notification Setting",
  logsHospital: "Logs Hospital",
  emailFetchSetting: "Email Fetch Setting",
  emailFetch: "Email Fetch",
  messageFetch: "Message Fetch",
  patientExcelReport: "Patient Excel Report",
  doctorStaff: "Doctor Staff",
  doctorEmail: "Doctor Email",
  treatmentPackage: "Treatment Package",
  acknowledgementSetting: "Acknowledgement Setting",
  followUpSetting: "Follow Up Setting",
  messageContent: "Message Content",
  communicationSetting: "Communication Setting",
  messageCommunication: "Message Communication",
  messageSendSetting: "Message Send Setting",
  referralPartnerPreStaff: "Referral Partner Pre Staff",
  referralPartnerPreZone: "Referral Partner Pre Zone",
  referralPartnerOwnStaff: "Referral Partner Own Staff",
  referralPartnerOwnZone: "Referral Partner Own Zone",
};

export const permissionDisplayName = {
  get: "Get",
  put: "Put",
  post: "Post",
  delete: "Delete",
  changePassword: "Change Password",
  editProfile: "Edit Profile",
  getProfile: "Get Profile",
  addDefaultEmail: "Add Default Email",
  addDefaultMessage: "Add Default Message",
  addHospitalEmailZone: "Add Hospital Email Zone",
  deleteHospitalEmailZone: "Delete Hospital Email Zone",
  editHospitalEmailZone: "Edit Hospital Email Zone",
  editHospitalEmailZoneSetting: "Edit Hospital Email Zone Setting",
  getAllHospitalEmailZone: "Get All Hospital Email Zones",
  getDefaultEmail: "Get Default Email",
  getDefaultMessage: "Get Default Message",
  getHospitalEmailZone: "Get Hospital Email Zone",
  getHospitalEmailZoneSetting: "Get Hospital Email Zone Setting",
  addPatient: "Add Patient",
  checkDuplicatePatient: "Check Duplicate Patient",
  closePatientQuery: "Close Patient Query",
  deletePatient: "Delete Patient",
  editPatient: "Edit Patient",
  getAllPatient: "Get All Patients",
  getPatient: "Get Patient",
  openPatientQuery: "Open Patient Query",
  addOpinion: "Add Opinion",
  addOpinionByDoctor: "Add Opinion By Doctor",
  addOpinionEdited: "Add Edited Opinion",
  addOpinionRequest: "Add Opinion Request",
  addRecordingByDoctor: "Add Recording By Doctor",
  assignOpinionRequestToDoctor: "Assign Opinion Request To Doctor",
  downloadOpinion: "Download Opinion",
  getAllAddedOpinion: "Get All Added Opinion",
  getAllAddedOpinionByDoctor: "Get All Added Opinion By Doctor",
  getAllAddedOpinionEdited: "Get All Added Edited Opinion",
  getAllOpinionRequest: "Get All Opinion Request",
  getAllOpinionRequestByDoctor: "Get All Opinion Request By Doctor",
  getAllRecordingByDoctor: "Get All Recording By Doctor",
  getCompletedOpinionRequest: "Get Completed Opinion Request",
  getOpinionRequestRecipients: "Get Opinion Request Recipients",
  getPendingOpinionRequest: "Get Pending Opinion Request",
  getPendingOpinionRequestByDoctor: "Get Pending Opinion Request By Doctor",
  resendOpinionRequest: "Resend Opinion Request",
  sendOpinion: "Send Opinion",
  addOpd: "Add OPD",
  addOpdEdited: "Add OPD (Edited)",
  addOpdRequest: "Add OPD Request",
  getAllAddedOpd: "Get All Added OPDs",
  getAllAddedOpdEdited: "Get All Added OPDs (Edited)",
  getAllOpdRequest: "Get All OPD Requests",
  getCompletedOpdRequest: "Get Completed OPD Requests",
  getOpdRequestRecipients: "Get OPD Request Recipients",
  getPendingOpdRequest: "Get Pending OPD Requests",
  resendOpdRequest: "Resend OPD Request",
  sendOpd: "Send OPD",
  addVil: "Add VIL",
  addVilEdited: "Add VIL (Edited)",
  addVilRequest: "Add VIL Request",
  downloadVil: "Download VIL",
  editVilRequest: "Edit VIL Request",
  getAllAddedVil: "Get All Added VILs",
  getAllAddedVilEdited: "Get All Added VILs (Edited)",
  getAllVilRequest: "Get All VIL Requests",
  getCompletedVilRequest: "Get Completed VIL Requests",
  getPendingVilRequest: "Get Pending VIL Requests",
  getVilRecipients: "Get VIL Recipients",
  resendVilRequest: "Resend VIL Request",
  sendVil: "Send VIL",
  addProformaInvoiceRequest: "Add Proforma Invoice Request",
  downloadProformaInvoice: "Download Proforma Invoice",
  getAllProformaInvoiceRequest: "Get All Proforma Invoice Requests",
  getCompletedProformaInvoice: "Get Completed Proforma Invoices",
  getPendingProformaInvoiceRequest: "Get Pending Proforma Invoice Requests",
  getProformaInvoiceRecipients: "Get Proforma Invoice Recipients",
  resendProformaInvoiceRequest: "Resend Proforma Invoice Request",
  sendProformaInvoice: "Send Proforma Invoice",
  addPreIntimation: "Add Pre-Intimation",
  getAllPreIntimation: "Get All Pre-Intimations",
  getPreIntimationRecipients: "Get Pre-Intimation Recipients",
  resendPreIntimation: "Resend Pre-Intimation",
  getAllPatientConfirmation: "Get All Patient Confirmations",
  getAllPatientConfirmationEdited: "Get All Patient Confirmations (Edited)",
  getCompletedPatientConfirmation: "Get Completed Patient Confirmations",
  getPatientConfirmationRecipients: "Get Patient Confirmation Recipients",
  getPendingPatientConfirmation: "Get Pending Patient Confirmations",
  patientConfirmation: "Patient Confirmation",
  patientConfirmationEdited: "Patient Confirmation (Edited)",
  resendPatientConfirmation: "Resend Patient Confirmation",
  getAllIssuedVil: "Get All Issued VILs",
  getIssuedVil: "Get Issued VIL",
  getAllComment: "Get All Comments",
  getAvgOpinionTime: "Get Average Opinion Time",
  getJourneyFromOpinion: "Get Journey From Opinion",
  getJourneyFromVil: "Get Journey From VIL",
  getLast6MonthPatientConfirmationCount:
    "Get Last 6 Month Patient Confirmation Count",
  getLast6MonthQueryCount: "Get Last 6 Month Query Count",
  getLast6MonthVilCount: "Get Last 6 Month VIL Count",
  getPatientConfirmationCalendar: "Get Patient Confirmation Calendar",
  getPatientConfirmationCount: "Get Patient Confirmation Count",
  getQueryByCountry: "Get Query By Country",
  getQueryByDepartment: "Get Query By Department",
  getQueryByPartner: "Get Query By Partner",
  getQueryCount: "Get Query Count",
  getVilCount: "Get VIL Count",
  addComment: "Add Comment",
  addPatientOperationStatus: "Add Patient Operation Status",
  downloadFinanceQuery: "Download Finance Query",
  downloadFollowUpQuery: "Download Follow-Up Query",
  downloadOnGroundQuery: "Download On-Ground Query",
  downloadPendingQuery: "Download Pending Query",
  downloadTodayQuery: "Download Today's Query",
  downloadUpcomingArrival: "Download Upcoming Arrival",
  getComment: "Get Comment",
  getCompletedQuery: "Get Completed Query",
  getFinanceQuery: "Get Finance Query",
  getFollowUpQuery: "Get Follow-Up Query",
  getOnGroundQuery: "Get On-Ground Query",
  getPatientOperationStatus: "Get Patient Operation Status",
  getPendingQuery: "Get Pending Query",
  getTodayQuery: "Get Today's Query",
  getUpcomingArrival: "Get Upcoming Arrival",
  moveToCompletedQuery: "Move To Completed Query",
  moveToFinanceQuery: "Move To Finance Query",
  addPatientItinerary: "Add Patient Itinerary",
  getPatientItinerary: "Get Patient Itinerary",
  getAllErrorLog: "Get All Error Logs",
  downloadPatientExcelReport: "Download Patient Excel Report",
  getAllPatientExcelReport: "Get All Patient Excel Reports",
  addDoctorDefaultEmail: "Add Doctor Default Email",
  addDoctorDefaultMessage: "Add Doctor Default Message",
  getDoctorDefaultEmail: "Get Doctor Default Email",
  getDoctorDefaultMessage: "Get Doctor Default Message",
  sendAcknowledgement: "Send Acknowledgement",
  addFollowUp: "Add Follow-Up",
  closeFollowUp: "Close Follow-Up",
  addReferralPartnerDefaultEmail: "Add Referral Partner Default Email",
  addReferralPartnerDefaultMessage: "Add Referral Partner Default Message",
  addReferralPartnerZone: "Add Referral Partner Zone",
  deleteReferralPartnerZone: "Delete Referral Partner Zone",
  editReferralPartnerZone: "Edit Referral Partner Zone",
  getAllReferralPartnerZone: "Get All Referral Partner Zones",
  getReferralPartnerDefaultEmail: "Get Referral Partner Default Email",
  getReferralPartnerDefaultMessage: "Get Referral Partner Default Message",
  getReferralPartnerZone: "Get Referral Partner Zone",
};

// export const camelCaseToNormal = (str) => {
//   if (!str) return "";

//   let newStr = str
//     .replace(/([A-Z])/g, " $1")
//     .replace(/^./, (match) => match.toUpperCase());

//   if (newStr === "Get") {
//     newStr = "View";
//   } else if (newStr === "Post") {
//     newStr = "Add";
//   } else if (newStr === "Put") {
//     newStr = "Edit";
//   }

//   return newStr;
// };

export const camelCaseToNormal = (str) => {
  if (!str) return "";
  const input = str.charAt(0).toUpperCase() + str.slice(1);

  let replacedStr = input
    .replace(/\bGet\b/g, "View")
    .replace(/\bPost\b/g, "Add")
    .replace(/\bPut\b/g, "Edit")
    .replace(/Get/g, "View")
    .replace(/Post/g, "Add")
    .replace(/Put/g, "Edit");

  return replacedStr
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};
