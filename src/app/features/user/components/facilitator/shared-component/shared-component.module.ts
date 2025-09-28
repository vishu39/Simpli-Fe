import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { SharedModule } from "src/app/shared/modules/shared.module";
import { NgxEchartsModule } from "ngx-echarts";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { TemplateSettingComponent } from "./components/account/template-setting/template-setting.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { AutoReminderSettingComponent } from "./components/account/auto-reminder-setting/auto-reminder-setting.component";
import { UserProfileComponent } from "./components/account/user-profile/user-profile.component";
import { ChangePasswordComponent } from "./components/account/change-password/change-password.component";
import { EmailSettingComponent } from "./components/account/email-setting/email-setting.component";
import { ReportComponent } from "./components/report/report.component";
import { ReportDialogComponent } from "./components/report/dialog/report-dialog/report-dialog.component";
import { PatientComponent } from "./components/patient/patient.component";
import { ClosePatientDialogComponent } from "./components/patient/dialog/close-patient-dialog/close-patient-dialog.component";
import { AddPatientDialogComponent } from "./components/patient/dialog/add-patient-dialog/add-patient-dialog.component";
import { QueryViewSettingComponent } from "./components/account/query-view-setting/query-view-setting.component";
import { QueryViewSettingDialogComponent } from "./components/account/query-view-setting/dialog/query-view-setting-dialog/query-view-setting-dialog.component";
import { SmCrudModule } from "src/app/smvt-framework/sm-crud/sm-crud.module";
import { HospitalListComponent } from "./components/hospital-list/hospital-list.component";
import { HospitalProfileComponent } from "./components/hospital-list/hospital-profile/hospital-profile.component";
import { QueryManagementComponent } from "./components/query-management/query-management.component";
import { QueryComponent } from "./components/query-management/query/query.component";
import { ToolbarComponent } from "./components/query-management/toolbar/toolbar.component";
import { QueryTabsComponent } from "./components/query-management/query/query-tabs/query-tabs.component";
import { QueryListComponent } from "./components/query-management/patient-list/patient-list.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { CalendarDialogComponent } from "./components/calendar/dialog/calendar-dialog/calendar-dialog.component";
import { AddHospitalDialogComponent } from "./components/query-management/dialog/add-hospital-dialog/add-hospital-dialog.component";
import { OpinionComponent } from "./components/query-management/components/opinion/opinion.component";
import { AddOpinionComponent } from "./components/query-management/components/opinion/components/add-opinion/add-opinion.component";
import { OpdComponent } from "./components/query-management/components/opd/opd.component";
import { AddOpdRequestComponent } from "./components/query-management/components/opd/components/add-opd-request/add-opd-request.component";
import { PreIntemationComponent } from "./components/query-management/components/pre-intemation/pre-intemation.component";
import { AddPreIntemationComponent } from "./components/query-management/components/pre-intemation/components/add-pre-intemation/add-pre-intemation.component";
import { ProformaInvoiceComponent } from "./components/query-management/components/proforma-invoice/proforma-invoice.component";
import { AddProformaInvoiceComponent } from "./components/query-management/components/proforma-invoice/components/add-proforma-invoice/add-proforma-invoice.component";
import { PatientConfirmationComponent } from "./components/query-management/components/patient-confirmation/patient-confirmation.component";
import { AddPatientConfirmationComponent } from "./components/query-management/components/patient-confirmation/components/add-patient-confirmation/add-patient-confirmation.component";
import { VilComponent } from "./components/query-management/components/vil/vil.component";
import { AddVilRequestComponent } from "./components/query-management/components/vil/components/add-vil-request/add-vil-request.component";
import { OpdReceivedComponent } from "./components/query-management/components/opd/components/opd-received/opd-received.component";
import { EmailContentComponent } from "./components/account/email-content/email-content.component";
import { EmailContentDialogComponent } from "./components/account/email-content/dialog/email-content-dialog/email-content-dialog.component";
import { TopHospitalComponent } from "./components/account/top-hospital/top-hospital.component";
import { HospitalStaffComponent } from "./components/hospital-staff/hospital-staff.component";
import { HospitalStaffDialogComponent } from "./components/hospital-staff/dialog/hospital-staff-dialog/hospital-staff-dialog.component";
import { HospitalEmailZoneComponent } from "./components/account/hospital-email-zone/hospital-email-zone.component";
import { DoctorComponent } from "./components/account/hospital-email-zone/components/doctor/doctor.component";
import { EmployeeComponent } from "./components/account/hospital-email-zone/components/employee/employee.component";
import { DefaultEmailComponent } from "./components/account/hospital-email-zone/components/default-email/default-email.component";
import { ZoneComponent } from "./components/account/hospital-email-zone/components/zone/zone.component";
import { ZoneDialogComponent } from "./components/account/hospital-email-zone/components/zone/dialog/zone-dialog/zone-dialog.component";
import { ZoneDefaultComponent } from "./components/account/hospital-email-zone/components/zone-default/zone-default.component";
import { DoctorListComponent } from "./components/doctor-list/doctor-list.component";
import { DoctorProfileComponent } from "./components/doctor-list/doctor-profile/doctor-profile.component";
import { AddDetailsDialogComponent } from "./components/query-management/dialog/add-details-dialog/add-details-dialog.component";
import { AddProformaInvoiceDetailsComponent } from "./components/query-management/components/proforma-invoice/components/add-proforma-invoice-details/add-proforma-invoice-details.component";
import { AddVilDetailsComponent } from "./components/query-management/components/vil/components/add-vil-details/add-vil-details.component";
import { AddOpinionDetailsComponent } from "./components/query-management/components/opinion/components/add-opinion-details/add-opinion-details.component";
import { AddOpdDetailsComponent } from "./components/query-management/components/opd/components/add-opd-details/add-opd-details.component";
import { VilReceivedComponent } from "./components/query-management/components/vil/components/vil-received/vil-received.component";
import { ProformaReceivedComponent } from "./components/query-management/components/proforma-invoice/components/proforma-received/proforma-received.component";
import { OpinionReceivedComponent } from "./components/query-management/components/opinion/components/opinion-received/opinion-received.component";
import { AccountDetailsComponent } from "./components/account/account-details/account-details.component";
import { InternalUserComponent } from "./components/internal-user/internal-user.component";
import { InternalUserDialogComponent } from "./components/internal-user/dialog/internal-user-dialog/internal-user-dialog.component";
import { UserPermissionComponent } from "./components/user-permission/user-permission.component";
import { UserPermissionDialogComponent } from "./components/user-permission/dialog/user-permission-dialog/user-permission-dialog.component";
import { EmailSentDialogComponent } from "./components/query-management/dialog/email-sent-dialog/email-sent-dialog.component";
import { SendOpdComponent } from "./components/query-management/components/opd/components/send-opd/send-opd.component";
import { SendOpinionComponent } from "./components/query-management/components/opinion/components/send-opinion/send-opinion.component";
import { SendVilComponent } from "./components/query-management/components/vil/components/send-vil/send-vil.component";
import { SendProformaInvoiceComponent } from "./components/query-management/components/proforma-invoice/components/send-proforma-invoice/send-proforma-invoice.component";
import { DownloadOpinionComponent } from "./components/query-management/components/opinion/components/download-opinion/download-opinion.component";
import { DowloadProformaComponent } from "./components/query-management/components/proforma-invoice/components/dowload-proforma/dowload-proforma.component";
import { DowloadConfirmationComponent } from "./components/query-management/components/patient-confirmation/components/dowload-confirmation/dowload-confirmation.component";
import { DowloadVilComponent } from "./components/query-management/components/vil/components/dowload-vil/dowload-vil.component";
import { DowloadDetailsDialogComponent } from "./components/query-management/dialog/dowload-details-dialog/dowload-details-dialog.component";
import { ErrorLogComponent } from "./components/error-log/error-log.component";
import { EmployeeDefaultComponent } from "./components/account/hospital-email-zone/components/employee-default/employee-default.component";
import { DoctorDefaultComponent } from "./components/account/hospital-email-zone/components/doctor-default/doctor-default.component";
import { OperationBoardComponent } from "./components/operation-board/operation-board.component";
import { TodayQueryListComponent } from "./components/operation-board/components/today-query-list/today-query-list.component";
import { PendingQueryListComponent } from "./components/operation-board/components/pending-query-list/pending-query-list.component";
import { OnGroundListComponent } from "./components/operation-board/components/on-ground-list/on-ground-list.component";
import { UpcommingArrivalListComponent } from "./components/operation-board/components/upcomming-arrival-list/upcomming-arrival-list.component";
import { FinanceListComponent } from "./components/operation-board/components/finance-list/finance-list.component";
import { ClosedQueryListComponent } from "./components/operation-board/components/closed-query-list/closed-query-list.component";
import { OperationBoardFilterComponent } from "./components/operation-board/dialog/operation-board-filter/operation-board-filter.component";
import { AddCommentsDialogComponent } from "./components/operation-board/dialog/add-comments-dialog/add-comments-dialog.component";
import { CommentListComponent } from "./components/dashboard/components/comment-list/comment-list.component";
import { TimeagoModule } from "ngx-timeago";
import { CommentSettingComponent } from "./components/account/comment-setting/comment-setting.component";
import { OperationStatusComponent } from "./components/operation-board/components/operation-status/operation-status.component";
import { NotificationSettingComponent } from "./components/account/notification-setting/notification-setting.component";
import { HospitalSentComponent } from "./components/operation-board/components/hospital-sent/hospital-sent.component";
import { EmailSentSettingComponent } from "./components/account/email-sent-setting/email-sent-setting.component";
import { EmailFetchSettingComponent } from "./components/account/email-fetch-setting/email-fetch-setting.component";
import { AddEmailFetchSettingComponent } from "./components/account/email-fetch-setting/component/add-email-fetch-setting/add-email-fetch-setting.component";
import { EmailComponent } from "./components/email/email.component";
import { EmailDetailsComponent } from "./components/email/component/email-details/email-details.component";
import { InboxComponent } from "./components/email/component/inbox/inbox.component";
import { AddPatientEmailFetchComponent } from "./components/email/dialog/add-patient-email-fetch/add-patient-email-fetch.component";
import { EmailFetchOverlayComponent } from "./components/email/component/email-fetch-overlay/email-fetch-overlay.component";
import { EmailFetchCommonEmailComponent } from "./components/email/component/email-fetch-common-email/email-fetch-common-email.component";
import { EmailFetchChoosePatientComponent } from "./components/email/component/email-fetch-choose-patient/email-fetch-choose-patient.component";
import { EmailFetchImagePreviewerComponent } from "./components/email/preview-component/email-fetch-image-previewer/email-fetch-image-previewer.component";
import { EmailFetchImageLightboxComponent } from "./components/email/preview-component/email-fetch-image-lightbox/email-fetch-image-lightbox.component";
import { AddOpinionEmailFetchComponent } from "./components/email/component/add-details/add-opinion-email-fetch/add-opinion-email-fetch.component";
import { AddOpdEmailFetchComponent } from "./components/email/component/add-details/add-opd-email-fetch/add-opd-email-fetch.component";
import { AddVilEmailFetchComponent } from "./components/email/component/add-details/add-vil-email-fetch/add-vil-email-fetch.component";
import { AddProformaEmailFetchComponent } from "./components/email/component/add-details/add-proforma-email-fetch/add-proforma-email-fetch.component";
import { AssignConfirmationEmailFetchComponent } from "./components/email/component/assign-components/assign-confirmation-email-fetch/assign-confirmation-email-fetch.component";
import { AssignOpdEmailFetchComponent } from "./components/email/component/assign-components/assign-opd-email-fetch/assign-opd-email-fetch.component";
import { AssignOpinionEmailFetchComponent } from "./components/email/component/assign-components/assign-opinion-email-fetch/assign-opinion-email-fetch.component";
import { AssignPreintimationEmailFetchComponent } from "./components/email/component/assign-components/assign-preintimation-email-fetch/assign-preintimation-email-fetch.component";
import { AssignProformaEmailFetchComponent } from "./components/email/component/assign-components/assign-proforma-email-fetch/assign-proforma-email-fetch.component";
import { AssignVilEmailFetchComponent } from "./components/email/component/assign-components/assign-vil-email-fetch/assign-vil-email-fetch.component";
import { ReplyToAllComponent } from "./components/email/component/reply-to-all/reply-to-all.component";
import { EmailFetchSendOpdComponent } from "./components/email/component/send-email-components/email-fetch-send-opd/email-fetch-send-opd.component";
import { EmailFetchSendOpinionComponent } from "./components/email/component/send-email-components/email-fetch-send-opinion/email-fetch-send-opinion.component";
import { EmailFetchSendVilComponent } from "./components/email/component/send-email-components/email-fetch-send-vil/email-fetch-send-vil.component";
import { EmailFetchSendProformaComponent } from "./components/email/component/send-email-components/email-fetch-send-proforma/email-fetch-send-proforma.component";
import { EmailHostComponent } from "./components/account/email-communication/email-host/email-host.component";
import { DefaultEmailComponent as EmailCommunicationDefaultEmail } from "./components/account/email-communication/default-email/default-email.component";
import { AddEmailHostForCommunicationComponent } from "./components/account/email-communication/email-host/component/add-email-host-for-communication/add-email-host-for-communication.component";
import { AcknowledgementSettingComponent } from "./components/account/acknowledgement-setting/acknowledgement-setting.component";
import { FollowupSettingComponent } from "./components/account/followup-setting/followup-setting.component";
import { FollowupListComponent } from "./components/operation-board/components/followup-list/followup-list.component";
import { NgxMatIntlTelInputComponent } from "ngx-mat-intl-tel-input";
import { MessageContentComponent } from "./components/account/message-content/message-content.component";
import { AddMessageContentComponent } from "./components/account/message-content/add-message-content/add-message-content.component";
import { DefaultMessageComponent } from "./components/account/hospital-email-zone/components/default-message/default-message.component";
import { CommunicationSettingComponent } from "./components/account/communication-setting/communication-setting.component";
import { MessageHostComponent } from "./components/account/message-communication/message-host/message-host.component";
import { AddMessageHostComponent } from "./components/account/message-communication/message-host/components/add-message-host/add-message-host.component";
import { DefaultMessageComponent as DefaultMessageComponentForCommunication } from "./components/account/message-communication/default-message/default-message.component";
import { MessageFetchSettingComponent } from "./components/account/message-fetch-setting/message-fetch-setting.component";
import { MessageFetchComponent } from "./components/message-fetch/message-fetch.component";
import { ChatsComponent } from "./components/message-fetch/component/chats/chats.component";
import { MessageFetchActionComponent } from "./components/message-fetch/component/message-fetch-action/message-fetch-action.component";
import { MessageFetchAddPatientComponent } from "./components/message-fetch/component/action-components/message-fetch-add-patient/message-fetch-add-patient.component";
import { MessageFetchAssignOpinionComponent } from "./components/message-fetch/component/action-components/assign-components/message-fetch-assign-opinion/message-fetch-assign-opinion.component";
import { MessageFetchAssignOpdComponent } from "./components/message-fetch/component/action-components/assign-components/message-fetch-assign-opd/message-fetch-assign-opd.component";
import { MessageFetchAssignProformaComponent } from "./components/message-fetch/component/action-components/assign-components/message-fetch-assign-proforma/message-fetch-assign-proforma.component";
import { MessageFetchAssignPreIntimationComponent } from "./components/message-fetch/component/action-components/assign-components/message-fetch-assign-pre-intimation/message-fetch-assign-pre-intimation.component";
import { MessageFetchAssignVilComponent } from "./components/message-fetch/component/action-components/assign-components/message-fetch-assign-vil/message-fetch-assign-vil.component";
import { MessageFetchAssignConfirmationComponent } from "./components/message-fetch/component/action-components/assign-components/message-fetch-assign-confirmation/message-fetch-assign-confirmation.component";
import { MessageFetchAddOpinionComponent } from "./components/message-fetch/component/action-components/add-components/message-fetch-add-opinion/message-fetch-add-opinion.component";
import { MessageFetchAddOpdComponent } from "./components/message-fetch/component/action-components/add-components/message-fetch-add-opd/message-fetch-add-opd.component";
import { MessageFetchAddVilComponent } from "./components/message-fetch/component/action-components/add-components/message-fetch-add-vil/message-fetch-add-vil.component";
import { MessageFetchAddProformaComponent } from "./components/message-fetch/component/action-components/add-components/message-fetch-add-proforma/message-fetch-add-proforma.component";
import { ReferralPartnerPreStaffComponent } from "./components/account/referral-partner-zone/referral-partner-pre-staff/referral-partner-pre-staff.component";
import { AddReferralPartnerPreStaffComponent } from "./components/account/referral-partner-zone/referral-partner-pre-staff/dialog/add-referral-partner-staff/add-referral-partner-pre-staff.component";
import { ReferralPartnerPreZoneComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/referral-partner-pre-zone.component";
import { ReferralZoneComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-zone/referral-zone.component";
import { ReferralStaffComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-staff/referral-staff.component";
import { ReferralDefaultEmailComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-default-email/referral-default-email.component";
import { ReferralDefaultMessageComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-default-message/referral-default-message.component";
import { AddReferralZoneComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-zone/dialog/add-referral-zone/add-referral-zone.component";
import { OwnReferralDefaultEmailComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-default-email/own-referral-default-email.component";
import { OwnReferralDefaultMessageComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-default-message/own-referral-default-message.component";
import { OwnReferralStaffComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-staff/own-referral-staff.component";
import { OwnReferralZoneComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-zone/own-referral-zone.component";
import { SharedReferralPartnerOwnZoneComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/shared-referral-partner-own-zone.component";
import { SharedReferralPartnerOwnStaffComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-staff/shared-referral-partner-own-staff.component";
import { AddReferralPartnerOwnStaffComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-staff/dialog/add-referral-partner-own-staff/add-referral-partner-own-staff.component";
import { AddOwnReferralPartnerZoneComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-zone/component/add-own-referral-partner-zone/add-own-referral-partner-zone.component";
import { UserPermissionRevampComponent } from "./components/user-permission-revamp/user-permission-revamp.component";
import { AddUserPermissionComponent } from "./components/user-permission-revamp/dialog/add-user-permission/add-user-permission.component";
import { EditUserPermissionComponent } from "./components/user-permission-revamp/dialog/edit-user-permission/edit-user-permission.component";
import { DeleteUserPermissionComponent } from "./components/user-permission-revamp/dialog/delete-user-permission/delete-user-permission.component";
import { DashboardRevampComponent } from "./components/dashboard-revamp/dashboard-revamp.component";
import { DashboardRevampFilterModalComponent } from "./components/dashboard-revamp/component/dashboard-revamp-filter-modal/dashboard-revamp-filter-modal.component";
import { DashboardRevampDownloadModalComponent } from "./components/dashboard-revamp/component/dashboard-revamp-download-modal/dashboard-revamp-download-modal.component";
import { OperationEntriesComponent } from "./components/finance-module/operation-settings/operation-entries/operation-entries.component";
import { OperationEntriesDetailsTabsComponent } from "./components/finance-module/operation-settings/operation-entries-right-details/operation-entries-details-tabs/operation-entries-details-tabs.component";
import { OperationEntriesRightDetailsComponent } from "./components/finance-module/operation-settings/operation-entries-right-details/operation-entries-right-details.component";
import { MasterDataEntriesComponent } from "./components/finance-module/master-settings/master-data-entries/master-data-entries.component";
import { MasterAddCompanyComponent } from "./components/finance-module/master-settings/components/master-add-company/master-add-company.component";
import { MasterAddHospitalPayoutComponent } from "./components/finance-module/master-settings/components/master-add-hospital-payout/master-add-hospital-payout.component";
import { MasterAddPartnerPayoutComponent } from "./components/finance-module/master-settings/components/master-add-partner-payout/master-add-partner-payout.component";
import { MasterAddSalesIncentivesComponent } from "./components/finance-module/master-settings/components/master-add-sales-incentives/master-add-sales-incentives.component";
import { MasterDataViewDocsComponent } from "./components/finance-module/master-settings/dialog/master-data-view-docs/master-data-view-docs.component";
import { FinanceLogsComponent } from "./components/finance-module/finance-logs/finance-logs.component";
import { OpPartnerPayoutComponent } from "./components/finance-module/master-settings/components/master-add-partner-payout/component/op-partner-payout/op-partner-payout.component";
import { IpPartnerPayoutComponent } from "./components/finance-module/master-settings/components/master-add-partner-payout/component/ip-partner-payout/ip-partner-payout.component";
import { PackagesPartnerPayoutComponent } from "./components/finance-module/master-settings/components/master-add-partner-payout/component/packages-partner-payout/packages-partner-payout.component";
import { IpHospitalPayoutComponent } from "./components/finance-module/master-settings/components/master-add-hospital-payout/component/ip-hospital-payout/ip-hospital-payout.component";
import { OpHospitalPayoutComponent } from "./components/finance-module/master-settings/components/master-add-hospital-payout/component/op-hospital-payout/op-hospital-payout.component";
import { PackagesHospitalPayoutComponent } from "./components/finance-module/master-settings/components/master-add-hospital-payout/component/packages-hospital-payout/packages-hospital-payout.component";
import { AddHospitalUhidComponent } from "./components/finance-module/operation-settings/operation-entries/components/add-hospital-uhid/add-hospital-uhid.component";
import { UploadBillingDocComponent } from "./components/finance-module/operation-settings/operation-entries/components/upload-billing-doc/upload-billing-doc.component";
import { UploadEstimatesComponent } from "./components/finance-module/operation-settings/operation-entries/components/upload-estimates/upload-estimates.component";
import { AdmissionDischargeTrackerComponent } from "./components/finance-module/operation-settings/operation-entries/components/admission-discharge-tracker/admission-discharge-tracker.component";
import { UploadFinalBillComponent } from "./components/finance-module/operation-settings/operation-entries/components/upload-final-bill/upload-final-bill.component";
import { FinanceBillingViewHospitalUhidComponent } from "./components/finance-module/operation-settings/operation-entries/components/finance-billing-view-hospital-uhid/finance-billing-view-hospital-uhid.component";
import { FinanceBillingViewDocBillsComponent } from "./components/finance-module/operation-settings/operation-entries/components/finance-billing-view-doc-bills/finance-billing-view-doc-bills.component";
import { FinanceBillingViewAdmissionTrackerDetailsComponent } from "./components/finance-module/operation-settings/operation-entries/components/finance-billing-view-admission-tracker-details/finance-billing-view-admission-tracker-details.component";
import { FinanceBillingViewEstimateBillsComponent } from "./components/finance-module/operation-settings/operation-entries/components/finance-billing-view-estimate-bills/finance-billing-view-estimate-bills.component";
import { FinanceBillingViewFinalBillsComponent } from "./components/finance-module/operation-settings/operation-entries/components/finance-billing-view-final-bills/finance-billing-view-final-bills.component";
import { FinanceInvoiceComponent } from "./components/finance-module/finance-invoice/finance-invoice.component";
import { AddPatientDepositComponent } from './components/finance-module/operation-settings/operation-entries/components/add-patient-deposit/add-patient-deposit.component';
import { ViewPatientDepositComponent } from './components/finance-module/operation-settings/operation-entries/components/view-patient-deposit/view-patient-deposit.component';

@NgModule({
  declarations: [
    DashboardComponent,
    TemplateSettingComponent,
    AutoReminderSettingComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    EmailSettingComponent,
    ReportComponent,
    ReportDialogComponent,
    PatientComponent,
    ClosePatientDialogComponent,
    AddPatientDialogComponent,
    QueryViewSettingComponent,
    QueryViewSettingDialogComponent,
    HospitalListComponent,
    HospitalProfileComponent,
    QueryManagementComponent,
    QueryComponent,
    ToolbarComponent,
    QueryTabsComponent,
    QueryListComponent,
    CalendarComponent,
    CalendarDialogComponent,
    OpinionComponent,
    AddOpinionComponent,
    AddHospitalDialogComponent,
    EmailContentComponent,
    EmailContentDialogComponent,
    TopHospitalComponent,
    OpdComponent,
    AddOpdRequestComponent,
    PreIntemationComponent,
    AddPreIntemationComponent,
    ProformaInvoiceComponent,
    AddProformaInvoiceComponent,
    PatientConfirmationComponent,
    AddPatientConfirmationComponent,
    VilComponent,
    AddVilRequestComponent,
    OpdReceivedComponent,
    HospitalStaffComponent,
    HospitalStaffDialogComponent,
    HospitalEmailZoneComponent,
    DoctorComponent,
    EmployeeComponent,
    DefaultEmailComponent,
    ZoneComponent,
    ZoneDialogComponent,
    ZoneDefaultComponent,
    DoctorListComponent,
    DoctorProfileComponent,
    AddDetailsDialogComponent,
    AddProformaInvoiceDetailsComponent,
    AddVilDetailsComponent,
    AddOpinionDetailsComponent,
    AddOpdDetailsComponent,
    VilReceivedComponent,
    ProformaReceivedComponent,
    OpinionReceivedComponent,
    AccountDetailsComponent,
    InternalUserComponent,
    InternalUserDialogComponent,
    UserPermissionComponent,
    UserPermissionDialogComponent,
    EmailSentDialogComponent,
    SendOpdComponent,
    SendOpinionComponent,
    SendVilComponent,
    SendProformaInvoiceComponent,
    DownloadOpinionComponent,
    DowloadProformaComponent,
    DowloadConfirmationComponent,
    DowloadVilComponent,
    DowloadDetailsDialogComponent,
    ErrorLogComponent,
    EmployeeDefaultComponent,
    DoctorDefaultComponent,
    OperationBoardComponent,
    TodayQueryListComponent,
    PendingQueryListComponent,
    OnGroundListComponent,
    UpcommingArrivalListComponent,
    FinanceListComponent,
    ClosedQueryListComponent,
    OperationBoardFilterComponent,
    AddCommentsDialogComponent,
    CommentListComponent,
    CommentSettingComponent,
    OperationStatusComponent,
    NotificationSettingComponent,
    HospitalSentComponent,
    EmailSentSettingComponent,
    EmailFetchSettingComponent,
    AddEmailFetchSettingComponent,
    EmailComponent,
    EmailDetailsComponent,
    InboxComponent,
    AddPatientEmailFetchComponent,
    EmailFetchOverlayComponent,
    EmailFetchCommonEmailComponent,
    EmailFetchChoosePatientComponent,
    EmailFetchImagePreviewerComponent,
    EmailFetchImageLightboxComponent,
    AddOpinionEmailFetchComponent,
    AddOpdEmailFetchComponent,
    AddVilEmailFetchComponent,
    AddProformaEmailFetchComponent,
    AssignConfirmationEmailFetchComponent,
    AssignOpdEmailFetchComponent,
    AssignOpinionEmailFetchComponent,
    AssignPreintimationEmailFetchComponent,
    AssignProformaEmailFetchComponent,
    AssignVilEmailFetchComponent,
    ReplyToAllComponent,
    EmailFetchSendOpdComponent,
    EmailFetchSendOpinionComponent,
    EmailFetchSendVilComponent,
    EmailFetchSendProformaComponent,
    EmailHostComponent,
    EmailCommunicationDefaultEmail,
    AddEmailHostForCommunicationComponent,
    AcknowledgementSettingComponent,
    FollowupSettingComponent,
    FollowupListComponent,
    MessageContentComponent,
    AddMessageContentComponent,
    DefaultMessageComponent,
    CommunicationSettingComponent,
    MessageHostComponent,
    DefaultMessageComponentForCommunication,
    AddMessageHostComponent,
    MessageFetchSettingComponent,
    MessageFetchComponent,
    ChatsComponent,
    MessageFetchActionComponent,
    MessageFetchAddPatientComponent,
    MessageFetchAssignOpinionComponent,
    MessageFetchAssignOpdComponent,
    MessageFetchAssignProformaComponent,
    MessageFetchAssignPreIntimationComponent,
    MessageFetchAssignVilComponent,
    MessageFetchAssignConfirmationComponent,
    MessageFetchAddOpinionComponent,
    MessageFetchAddOpdComponent,
    MessageFetchAddVilComponent,
    MessageFetchAddProformaComponent,
    ReferralPartnerPreStaffComponent,
    AddReferralPartnerPreStaffComponent,
    ReferralPartnerPreZoneComponent,
    ReferralZoneComponent,
    ReferralStaffComponent,
    ReferralDefaultEmailComponent,
    ReferralDefaultMessageComponent,
    AddReferralZoneComponent,
    SharedReferralPartnerOwnStaffComponent,
    AddReferralPartnerOwnStaffComponent,
    SharedReferralPartnerOwnZoneComponent,
    OwnReferralDefaultEmailComponent,
    OwnReferralDefaultMessageComponent,
    OwnReferralStaffComponent,
    OwnReferralZoneComponent,
    AddOwnReferralPartnerZoneComponent,
    UserPermissionRevampComponent,
    AddUserPermissionComponent,
    EditUserPermissionComponent,
    DeleteUserPermissionComponent,
    DashboardRevampComponent,
    DashboardRevampFilterModalComponent,
    DashboardRevampDownloadModalComponent,
    // finance module
    OperationEntriesComponent,
    OperationEntriesRightDetailsComponent,
    OperationEntriesDetailsTabsComponent,
    MasterDataEntriesComponent,
    MasterAddCompanyComponent,
    MasterAddHospitalPayoutComponent,
    MasterAddPartnerPayoutComponent,
    MasterAddSalesIncentivesComponent,
    MasterDataViewDocsComponent,
    FinanceLogsComponent,
    OpPartnerPayoutComponent,
    IpPartnerPayoutComponent,
    PackagesPartnerPayoutComponent,
    IpHospitalPayoutComponent,
    OpHospitalPayoutComponent,
    PackagesHospitalPayoutComponent,

    // billing entries
    AddHospitalUhidComponent,
    UploadBillingDocComponent,
    UploadEstimatesComponent,
    AdmissionDischargeTrackerComponent,
    UploadFinalBillComponent,
    FinanceBillingViewHospitalUhidComponent,
    FinanceBillingViewDocBillsComponent,
    FinanceBillingViewAdmissionTrackerDetailsComponent,
    FinanceBillingViewEstimateBillsComponent,
    FinanceBillingViewFinalBillsComponent,
    FinanceInvoiceComponent,
    AddPatientDepositComponent,
    ViewPatientDepositComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    chartjsModule,
    NgApexchartsModule,
    ComponentsModule,
    SmCrudModule,
    TimeagoModule.forRoot(),
    NgxMatIntlTelInputComponent,
  ],
  exports: [
    DashboardComponent,
    TemplateSettingComponent,
    AutoReminderSettingComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    EmailSettingComponent,
    ReportComponent,
    PatientComponent,
    QueryViewSettingComponent,
    DoctorProfileComponent,
    HospitalListComponent,
    HospitalProfileComponent,
    QueryManagementComponent,
    CalendarComponent,
    EmailContentComponent,
    TopHospitalComponent,
    HospitalStaffComponent,
    HospitalEmailZoneComponent,
    DoctorListComponent,
    DoctorProfileComponent,
    AccountDetailsComponent,
    InternalUserComponent,
    UserPermissionComponent,
    ErrorLogComponent,
    OperationBoardComponent,
    CommentSettingComponent,
    NotificationSettingComponent,
    EmailSentSettingComponent,
    EmailFetchSettingComponent,
    EmailComponent,
    EmailDetailsComponent,
    InboxComponent,
    EmailHostComponent,
    EmailCommunicationDefaultEmail,
    AcknowledgementSettingComponent,
    FollowupSettingComponent,
    MessageContentComponent,
    CommunicationSettingComponent,
    MessageHostComponent,
    DefaultMessageComponentForCommunication,
    MessageFetchSettingComponent,
    MessageFetchComponent,
    ReferralPartnerPreStaffComponent,
    ReferralPartnerPreZoneComponent,
    SharedReferralPartnerOwnStaffComponent,
    SharedReferralPartnerOwnZoneComponent,
    UserPermissionRevampComponent,
    DashboardRevampComponent,
    // finance
    OperationEntriesComponent,
    MasterDataEntriesComponent,
    FinanceLogsComponent,
    FinanceInvoiceComponent,
  ],
  providers: [DatePipe],
})
export class SharedComponentModule {}
