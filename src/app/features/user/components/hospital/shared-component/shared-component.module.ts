import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
// import { UserPermissionComponent } from "./components/user-permission/user-permission.component";
// import { UserPermissionDialogComponent } from "./components/user-permission/dialog/user-permission-dialog/user-permission-dialog.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { MaterialModule } from "src/app/shared/modules/material.module";
import { FeatherModule } from "angular-feather";
import { FeatherIconsModule } from "src/app/shared/components/feather-icons/feather-icons.module";
import { InternalUserComponent } from "./components/internal-user/internal-user.component";
import { InternalUserDialogComponent } from "./components/internal-user/dialog/internal-user-dialog/internal-user-dialog.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { QueryViewSettingComponent } from "./components/account/query-view-setting/query-view-setting.component";
import { QueryViewSettingDialogComponent } from "./components/account/query-view-setting/dialog/query-view-setting-dialog/query-view-setting-dialog.component";
import { EmailContentComponent } from "./components/account/email-content/email-content.component";
import { EmailContentDialogComponent } from "./components/account/email-content/dialog/email-content-dialog/email-content-dialog.component";
import { SharedModule } from "src/app/shared/modules/shared.module";
import { PatientComponent } from "./components/patient/patient.component";
import { AddPatientDialogComponent } from "./components/patient/dialog/add-patient-dialog/add-patient-dialog.component";
import { ClosePatientDialogComponent } from "./components/patient/dialog/close-patient-dialog/close-patient-dialog.component";

import { NgxEchartsModule } from "ngx-echarts";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { QueryManagementComponent } from "./components/query-management/query-management.component";
import { HospitalQueryDetailsComponent } from "./components/query-management/component/hospital-query-details/hospital-query-details.component";
import { HospitalQueryTabsComponent } from "./components/query-management/component/hospital-query-details/hospital-query-tabs/hospital-query-tabs.component";
import { AddHospitalDialogComponent } from "./components/query-management/dialog/add-hospital-dialog/add-hospital-dialog.component";
import { AddDetailsDialogComponent } from "./components/query-management/dialog/add-details-dialog/add-details-dialog.component";

import { DowloadDetailsDialogComponent } from "./components/query-management/dialog/dowload-details-dialog/dowload-details-dialog.component";
import { EmailSentDialogComponent } from "./components/query-management/dialog/email-sent-dialog/email-sent-dialog.component";
import { OpdComponent } from "./components/query-management/component/opd/opd.component";
import { AddOpdRequestComponent } from "./components/query-management/component/opd/components/add-opd-request/add-opd-request.component";
import { AddOpdDetailsComponent } from "./components/query-management/component/opd/components/add-opd-details/add-opd-details.component";
import { OpdReceivedComponent } from "./components/query-management/component/opd/components/opd-received/opd-received.component";
import { SendOpdComponent } from "./components/query-management/component/opd/components/send-opd/send-opd.component";
import { OpinionComponent } from "./components/query-management/component/opinion/opinion.component";
import { AddOpinionComponent } from "./components/query-management/component/opinion/components/add-opinion/add-opinion.component";
import { AddOpinionDetailsComponent } from "./components/query-management/component/opinion/components/add-opinion-details/add-opinion-details.component";
import { DownloadOpinionComponent } from "./components/query-management/component/opinion/components/download-opinion/download-opinion.component";
import { SendOpinionComponent } from "./components/query-management/component/opinion/components/send-opinion/send-opinion.component";
import { OpinionReceivedComponent } from "./components/query-management/component/opinion/components/opinion-received/opinion-received.component";
import { PatientConfirmationComponent } from "./components/query-management/component/patient-confirmation/patient-confirmation.component";
import { AddPatientConfirmationComponent } from "./components/query-management/component/patient-confirmation/components/add-patient-confirmation/add-patient-confirmation.component";
import { DowloadConfirmationComponent } from "./components/query-management/component/patient-confirmation/components/dowload-confirmation/dowload-confirmation.component";
import { PreIntemationComponent } from "./components/query-management/component/pre-intemation/pre-intemation.component";
import { AddPreIntemationComponent } from "./components/query-management/component/pre-intemation/components/add-pre-intemation/add-pre-intemation.component";
import { ProformaInvoiceComponent } from "./components/query-management/component/proforma-invoice/proforma-invoice.component";
import { AddProformaInvoiceComponent } from "./components/query-management/component/proforma-invoice/components/add-proforma-invoice/add-proforma-invoice.component";
import { AddProformaInvoiceDetailsComponent } from "./components/query-management/component/proforma-invoice/components/add-proforma-invoice-details/add-proforma-invoice-details.component";
import { DowloadProformaComponent } from "./components/query-management/component/proforma-invoice/components/dowload-proforma/dowload-proforma.component";
import { ProformaReceivedComponent } from "./components/query-management/component/proforma-invoice/components/proforma-received/proforma-received.component";
import { SendProformaInvoiceComponent } from "./components/query-management/component/proforma-invoice/components/send-proforma-invoice/send-proforma-invoice.component";
import { VilComponent } from "./components/query-management/component/vil/vil.component";
import { AddVilDetailsComponent } from "./components/query-management/component/vil/components/add-vil-details/add-vil-details.component";
import { AddVilRequestComponent } from "./components/query-management/component/vil/components/add-vil-request/add-vil-request.component";
import { DowloadVilComponent } from "./components/query-management/component/vil/components/dowload-vil/dowload-vil.component";
import { SendVilComponent } from "./components/query-management/component/vil/components/send-vil/send-vil.component";
import { VilReceivedComponent } from "./components/query-management/component/vil/components/vil-received/vil-received.component";
import { EmailSentSettingComponent } from "./components/account/email-sent-setting/email-sent-setting.component";
import { BankDetailsComponent } from "./components/account/bank-details/bank-details.component";
import { AddPatientConfirmationDetailsComponent } from "./components/query-management/component/patient-confirmation/components/add-patient-confirmation-details/add-patient-confirmation-details.component";
import { VilImagesPreviewComponent } from "./components/query-management/component/vil/components/vil-images-preview/vil-images-preview.component";
import { SmCrudModule } from "src/app/smvt-framework/sm-crud/sm-crud.module";
import { VilSettingComponent } from "./components/account/vil-setting/vil-setting.component";
import { IssuedVilComponent } from "./components/issued-vil/issued-vil.component";
import { TreatingDocQueryManagementComponent } from "./components/treating-doc-query-management/treating-doc-query-management.component";
import { ForwardToDoctorComponent } from "./components/treating-doc-query-management/components/forward-to-doctor/forward-to-doctor.component";
import { RecordOpinionComponent } from "./components/treating-doc-query-management/components/record-opinion/record-opinion.component";
import { TreatmentDocAddDetailComponent } from "./components/treating-doc-query-management/components/treatment-doc-add-detail/treatment-doc-add-detail.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { CalendarDialogComponent } from "./components/calendar/dialog/calendar-dialog/calendar-dialog.component";
import { OperationBoardComponent } from "./components/operation-board/operation-board.component";
import { ClosedQueryListComponent } from "./components/operation-board/components/closed-query-list/closed-query-list.component";
import { FinanceListComponent } from "./components/operation-board/components/finance-list/finance-list.component";
import { HospitalSentComponent } from "./components/operation-board/components/hospital-sent/hospital-sent.component";
import { OnGroundListComponent } from "./components/operation-board/components/on-ground-list/on-ground-list.component";
import { OperationStatusComponent } from "./components/operation-board/components/operation-status/operation-status.component";
import { PendingQueryListComponent } from "./components/operation-board/components/pending-query-list/pending-query-list.component";
import { TodayQueryListComponent } from "./components/operation-board/components/today-query-list/today-query-list.component";
import { UpcommingArrivalListComponent } from "./components/operation-board/components/upcomming-arrival-list/upcomming-arrival-list.component";
import { AddCommentsDialogComponent } from "./components/operation-board/dialog/add-comments-dialog/add-comments-dialog.component";
import { OperationBoardFilterComponent } from "./components/operation-board/dialog/operation-board-filter/operation-board-filter.component";
import { DoctorOpinionAddedComponent } from "./components/treating-doc-query-management/components/doctor-opinion-added/doctor-opinion-added.component";
import { TreatingDocAddedOpinionComponent } from "./components/treating-doc-query-management/components/treating-doc-added-opinion/treating-doc-added-opinion.component";
import { TreatingDocPendingOpinionComponent } from "./components/treating-doc-query-management/components/treating-doc-pending-opinion/treating-doc-pending-opinion.component";
import { TreatingDocRecoringComponent } from "./components/treating-doc-query-management/components/treating-doc-recoring/treating-doc-recoring.component";
import { EditVilComponent } from "./components/query-management/component/vil/components/edit-vil/edit-vil.component";
import { CommentListComponent } from "./components/dashboard/components/comment-list/comment-list.component";
import { NotificationSettingComponent } from "./components/account/notification-setting/notification-setting.component";
import { CommentSettingComponent } from "./components/account/comment-setting/comment-setting.component";
import { ErrorLogComponent } from "./components/error-log/error-log.component";
import { SentVilHistoryComponent } from "./components/sent-vil-history/sent-vil-history.component";
import { EmailFetchSettingComponent } from "./components/account/email-fetch-setting/email-fetch-setting.component";
import { AddEmailFetchSettingComponent } from "./components/account/email-fetch-setting/component/add-email-fetch-setting/add-email-fetch-setting.component";
import { EmailComponent } from "./components/email/email.component";
import { InboxComponent } from "./components/email/component/inbox/inbox.component";
import { EmailDetailsComponent } from "./components/email/component/email-details/email-details.component";
import { TimeagoModule } from "ngx-timeago";
import { AddPatientEmailFetchComponent } from "./components/email/dialog/add-patient-email-fetch/add-patient-email-fetch.component";
import { EmailFetchOverlayComponent } from "./components/email/component/email-fetch-overlay/email-fetch-overlay.component";
import { EmailFetchChoosePatientComponent } from "./components/email/component/email-fetch-choose-patient/email-fetch-choose-patient.component";
import { EmailFetchCommonEmailComponent } from "./components/email/component/email-fetch-common-email/email-fetch-common-email.component";
import { AssignOpinionEmailFetchComponent } from "./components/email/component/assign-opinion-email-fetch/assign-opinion-email-fetch.component";
import { AssignOpdEmailFetchComponent } from "./components/email/component/assign-opd-email-fetch/assign-opd-email-fetch.component";
import { AssignProformaEmailFetchComponent } from "./components/email/component/assign-proforma-email-fetch/assign-proforma-email-fetch.component";
import { AssignConfirmationEmailFetchComponent } from "./components/email/component/assign-confirmation-email-fetch/assign-confirmation-email-fetch.component";
import { AssignPreintimationEmailFetchComponent } from "./components/email/component/assign-preintimation-email-fetch/assign-preintimation-email-fetch.component";
import { AssignVilEmailFetchComponent } from "./components/email/component/assign-vil-email-fetch/assign-vil-email-fetch.component";
import { EmailFetchImagePreviewerComponent } from "./components/email/preview-component/email-fetch-image-previewer/email-fetch-image-previewer.component";
import { EmailFetchImageLightboxComponent } from "./components/email/preview-component/email-fetch-image-lightbox/email-fetch-image-lightbox.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FormGroupDirective } from "@angular/forms";
import { AddOpinionEmailFetchComponent } from "./components/email/component/add-details/add-opinion-email-fetch/add-opinion-email-fetch.component";
import { AddOpdEmailFetchComponent } from "./components/email/component/add-details/add-opd-email-fetch/add-opd-email-fetch.component";
import { AddVilEmailFetchComponent } from "./components/email/component/add-details/add-vil-email-fetch/add-vil-email-fetch.component";
import { ReportComponent } from "./components/report/report.component";
import { ReportDialogComponent } from "./components/report/dialog/report-dialog/report-dialog.component";
import { AddVilSettingComponent } from "./components/account/vil-setting/add-vil-setting/add-vil-setting.component";
import { ReplyToAllComponent } from "./components/email/component/reply-to-all/reply-to-all.component";
import { EmailFetchSendOpinionComponent } from "./components/email/component/send-email-component/email-fetch-send-opinion/email-fetch-send-opinion.component";
import { EmailFetchSendOpdComponent } from "./components/email/component/send-email-component/email-fetch-send-opd/email-fetch-send-opd.component";
import { EmailFetchSendVilComponent } from "./components/email/component/send-email-component/email-fetch-send-vil/email-fetch-send-vil.component";
import { EmailFetchSendProformaComponent } from "./components/email/component/send-email-component/email-fetch-send-proforma/email-fetch-send-proforma.component";
import { DoctorStaffComponent } from "./components/doctor-email/doctor-staff/doctor-staff.component";
import { AddDoctorStaffComponent } from "./components/doctor-email/doctor-staff/dialog/add-doctor-staff/add-doctor-staff.component";
import { DoctorEmailZoneComponent } from "./components/doctor-email/doctor-email-zone/doctor-email-zone.component";
import { DefaultEmailComponent } from "./components/doctor-email/doctor-email-zone/components/default-email/default-email.component";
import { AssistantDoctorComponent } from "./components/doctor-email/doctor-email-zone/components/assistant-doctor/assistant-doctor.component";
import { CoordinatorComponent } from "./components/doctor-email/doctor-email-zone/components/coordinator/coordinator.component";
import { EmailHostComponent } from "./components/account/email-communication/email-host/email-host.component";
import { DefaultEmailComponent as EmailCommunicationDefaultEmail } from "./components/account/email-communication/default-email/default-email.component";
import { AddEmailHostForCommunicationComponent } from "./components/account/email-communication/email-host/component/add-email-host-for-communication/add-email-host-for-communication.component";
import { TreatmentPackageComponent } from "./components/treatment-package/treatment-package.component";
import { AddTreatmentPackageDialogComponent } from "./components/treatment-package/add-treatment-package-dialog/add-treatment-package-dialog.component";
import { SharedTreatingDoctorDashboardComponent } from "./components/shared-treating-doctor-dashboard/shared-treating-doctor-dashboard.component";
import { AcknowledgementSettingComponent } from "./components/account/acknowledgement-setting/acknowledgement-setting.component";
import { FollowupSettingComponent } from "./components/account/followup-setting/followup-setting.component";
import { FollowupListComponent } from "./components/operation-board/components/followup-list/followup-list.component";
import { NgxMatIntlTelInputComponent } from "ngx-mat-intl-tel-input";
import { MessageContentComponent } from "./components/account/message-content/message-content.component";
import { AddMessageContentComponent } from "./components/account/message-content/add-message-content/add-message-content.component";
import { DoctorDefaultMessageComponent } from "./components/doctor-email/doctor-email-zone/components/doctor-default-message/doctor-default-message.component";
import { CommunicationSettingComponent } from "./components/account/communication-setting/communication-setting.component";
import { MessageHostComponent } from "./components/account/message-communication/message-host/message-host.component";
import { DefaultMessageComponent } from "./components/account/message-communication/default-message/default-message.component";
import { AddMessageHostComponent } from "./components/account/message-communication/message-host/components/add-message-host/add-message-host.component";
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
import { ReferralPartnerPreStaffComponent } from "./components/account/referral-partner-zone/referral-partner-pre-staff/referral-partner-pre-staff.component";
import { AddReferralPartnerPreStaffComponent } from "./components/account/referral-partner-zone/referral-partner-pre-staff/dialog/add-referral-partner-staff/add-referral-partner-pre-staff.component";
import { ReferralPartnerPreZoneComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/referral-partner-pre-zone.component";
import { ReferralZoneComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-zone/referral-zone.component";
import { ReferralDefaultEmailComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-default-email/referral-default-email.component";
import { ReferralDefaultMessageComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-default-message/referral-default-message.component";
import { AddReferralZoneComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-zone/dialog/add-referral-zone/add-referral-zone.component";
import { SharedReferralPartnerOwnStaffComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-staff/shared-referral-partner-own-staff.component";
import { SharedReferralPartnerOwnZoneComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/shared-referral-partner-own-zone.component";
import { AddReferralPartnerOwnStaffComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-staff/dialog/add-referral-partner-own-staff/add-referral-partner-own-staff.component";
import { OwnReferralDefaultEmailComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-default-email/own-referral-default-email.component";
import { OwnReferralDefaultMessageComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-default-message/own-referral-default-message.component";
import { OwnReferralStaffComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-staff/own-referral-staff.component";
import { OwnReferralZoneComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-zone/own-referral-zone.component";
import { AddOwnReferralPartnerZoneComponent } from "./components/account/referral-partner-zone/shared-referral-partner-own-zone/component/own-referral-zone/component/add-own-referral-partner-zone/add-own-referral-partner-zone.component";
import { ReferralStaffComponent } from "./components/account/referral-partner-zone/referral-partner-pre-zone/component/referral-staff/referral-staff.component";
import { UserPermissionRevampComponent } from "./components/user-permission-revamp/user-permission-revamp.component";
import { AddUserPermissionComponent } from "./components/user-permission-revamp/dialog/add-user-permission/add-user-permission.component";
import { EditUserPermissionComponent } from "./components/user-permission-revamp/dialog/edit-user-permission/edit-user-permission.component";
import { DeleteUserPermissionComponent } from "./components/user-permission-revamp/dialog/delete-user-permission/delete-user-permission.component";
import { DashboardRevampComponent } from "./components/dashboard-revamp/dashboard-revamp.component";
import { DashboardRevampFilterModalComponent } from "./components/dashboard-revamp/component/dashboard-revamp-filter-modal/dashboard-revamp-filter-modal.component";
import { DashboardRevampDownloadModalComponent } from "./components/dashboard-revamp/component/dashboard-revamp-download-modal/dashboard-revamp-download-modal.component";
import { OperationEntriesComponent } from "./components/finance-module/operation-entries/operation-entries.component";
import { OperationEntriesRightDetailsComponent } from "./components/finance-module/operation-entries-right-details/operation-entries-right-details.component";
import { OperationEntriesDetailsTabsComponent } from "./components/finance-module/operation-entries-right-details/operation-entries-details-tabs/operation-entries-details-tabs.component";
import { MasterDataEntriesComponent } from "./components/finance-module/master-data-entries/master-data-entries.component";

@NgModule({
  declarations: [
    DashboardComponent,
    // UserPermissionComponent,
    // UserPermissionDialogComponent,
    InternalUserComponent,
    InternalUserDialogComponent,
    QueryViewSettingComponent,
    QueryViewSettingDialogComponent,
    EmailContentComponent,
    EmailContentDialogComponent,
    PatientComponent,
    AddPatientDialogComponent,
    ClosePatientDialogComponent,
    QueryManagementComponent,
    HospitalQueryDetailsComponent,
    HospitalQueryTabsComponent,
    AddHospitalDialogComponent,
    DowloadDetailsDialogComponent,
    AddDetailsDialogComponent,
    EmailSentDialogComponent,

    // opd components
    OpdComponent,
    AddOpdRequestComponent,
    AddOpdDetailsComponent,
    OpdReceivedComponent,
    SendOpdComponent,
    // opinion components
    OpinionComponent,
    AddOpinionComponent,
    AddOpinionDetailsComponent,
    DownloadOpinionComponent,
    SendOpinionComponent,
    OpinionReceivedComponent,
    // patient confirmation components
    PatientConfirmationComponent,
    AddPatientConfirmationComponent,
    DowloadConfirmationComponent,
    // pre intimation components
    PreIntemationComponent,
    AddPreIntemationComponent,
    // proforma invoice components
    ProformaInvoiceComponent,
    AddProformaInvoiceComponent,
    AddProformaInvoiceDetailsComponent,
    DowloadProformaComponent,
    ProformaReceivedComponent,
    SendProformaInvoiceComponent,
    // vil components
    VilComponent,
    AddVilDetailsComponent,
    AddVilRequestComponent,
    DowloadVilComponent,
    SendVilComponent,
    VilReceivedComponent,
    EmailSentSettingComponent,
    BankDetailsComponent,
    AddPatientConfirmationDetailsComponent,
    VilImagesPreviewComponent,
    VilSettingComponent,
    IssuedVilComponent,
    CalendarComponent,
    CalendarDialogComponent,
    TreatingDocQueryManagementComponent,
    ForwardToDoctorComponent,
    RecordOpinionComponent,
    TreatmentDocAddDetailComponent,
    DoctorOpinionAddedComponent,
    TreatingDocAddedOpinionComponent,
    TreatingDocPendingOpinionComponent,
    TreatingDocRecoringComponent,
    OperationBoardComponent,
    ClosedQueryListComponent,
    FinanceListComponent,
    HospitalSentComponent,
    OnGroundListComponent,
    OperationStatusComponent,
    PendingQueryListComponent,
    TodayQueryListComponent,
    UpcommingArrivalListComponent,
    AddCommentsDialogComponent,
    OperationBoardFilterComponent,
    EditVilComponent,
    CommentListComponent,
    NotificationSettingComponent,
    CommentSettingComponent,
    ErrorLogComponent,
    SentVilHistoryComponent,
    EmailFetchSettingComponent,
    AddEmailFetchSettingComponent,
    EmailComponent,
    InboxComponent,
    EmailDetailsComponent,
    AddPatientEmailFetchComponent,
    EmailFetchOverlayComponent,
    EmailFetchChoosePatientComponent,
    EmailFetchCommonEmailComponent,
    AssignOpinionEmailFetchComponent,
    AssignOpdEmailFetchComponent,
    AssignProformaEmailFetchComponent,
    AssignConfirmationEmailFetchComponent,
    AssignPreintimationEmailFetchComponent,
    AssignVilEmailFetchComponent,
    EmailFetchImagePreviewerComponent,
    EmailFetchImageLightboxComponent,
    AddOpinionEmailFetchComponent,
    AddOpdEmailFetchComponent,
    AddVilEmailFetchComponent,
    ReportComponent,
    ReportDialogComponent,
    AddVilSettingComponent,
    ReplyToAllComponent,
    EmailFetchSendOpinionComponent,
    EmailFetchSendOpdComponent,
    EmailFetchSendVilComponent,
    EmailFetchSendProformaComponent,
    DoctorStaffComponent,
    AddDoctorStaffComponent,
    DoctorEmailZoneComponent,
    DefaultEmailComponent,
    AssistantDoctorComponent,
    CoordinatorComponent,

    EmailCommunicationDefaultEmail,
    EmailHostComponent,
    AddEmailHostForCommunicationComponent,
    TreatmentPackageComponent,
    AddTreatmentPackageDialogComponent,
    SharedTreatingDoctorDashboardComponent,
    AcknowledgementSettingComponent,
    FollowupSettingComponent,
    FollowupListComponent,
    MessageContentComponent,
    AddMessageContentComponent,
    DoctorDefaultMessageComponent,
    CommunicationSettingComponent,
    MessageHostComponent,
    DefaultMessageComponent,
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

    ReferralPartnerPreStaffComponent,
    AddReferralPartnerPreStaffComponent,
    ReferralPartnerPreZoneComponent,
    ReferralZoneComponent,
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
    ReferralStaffComponent,
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
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MaterialModule,
    FeatherModule,
    FeatherIconsModule,
    PerfectScrollbarModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    chartjsModule,
    NgApexchartsModule,
    SmCrudModule,
    TimeagoModule.forRoot(),
    DragDropModule,
    NgxMatIntlTelInputComponent,
  ],
  exports: [
    // UserPermissionComponent,
    // UserPermissionDialogComponent,
    InternalUserComponent,
    QueryViewSettingComponent,
    EmailContentComponent,
    DashboardComponent,
    PatientComponent,
    QueryManagementComponent,
    EmailSentSettingComponent,
    BankDetailsComponent,
    VilSettingComponent,
    IssuedVilComponent,
    CalendarComponent,
    CalendarDialogComponent,
    TreatingDocQueryManagementComponent,
    OperationBoardComponent,
    NotificationSettingComponent,
    CommentSettingComponent,
    ErrorLogComponent,
    SentVilHistoryComponent,
    EmailFetchSettingComponent,
    EmailComponent,
    EmailDetailsComponent,
    ReportComponent,
    DoctorStaffComponent,
    DoctorEmailZoneComponent,
    EmailCommunicationDefaultEmail,
    EmailHostComponent,
    TreatmentPackageComponent,
    SharedTreatingDoctorDashboardComponent,
    AcknowledgementSettingComponent,
    FollowupSettingComponent,
    MessageContentComponent,
    CommunicationSettingComponent,
    MessageHostComponent,
    DefaultMessageComponent,
    MessageFetchSettingComponent,
    MessageFetchComponent,
    ReferralPartnerPreStaffComponent,
    ReferralPartnerPreZoneComponent,
    SharedReferralPartnerOwnStaffComponent,
    SharedReferralPartnerOwnZoneComponent,
    UserPermissionRevampComponent,
    DashboardRevampComponent,
    OperationEntriesComponent,
    MasterDataEntriesComponent,
  ],
  providers: [FormGroupDirective],
})
export class SharedComponentModule {}
