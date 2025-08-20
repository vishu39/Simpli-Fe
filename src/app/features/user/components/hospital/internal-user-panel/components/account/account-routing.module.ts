import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountDetailsComponent } from "./components/account-details/account-details.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { EmailSettingComponent } from "./components/email-setting/email-setting.component";
import { HospitalEmailZoneComponent } from "./components/hospital-email-zone/hospital-email-zone.component";
import { TemplateSettingComponent } from "./components/template-setting/template-setting.component";
import { QueryViewSettingComponent } from "./components/query-view-setting/query-view-setting.component";
import { HospitalEmailContentComponent } from "./components/hospital-email-content/hospital-email-content.component";
import { BankDetailsComponent } from "./components/bank-details/bank-details.component";
import { VilSettingComponent } from "./components/vil-setting/vil-setting.component";
import { EmailSentSettingComponent } from "./components/email-sent-setting/email-sent-setting.component";
import { TopHospitalComponent } from "./components/top-hospital/top-hospital.component";
import { ReferralPartnerDetailsComponent } from "./components/referral-partner-details/referral-partner-details.component";
import { BranchOfficeDetailsComponent } from "./components/branch-office-details/branch-office-details.component";
import { CommentSettingComponent } from "./components/comment-setting/comment-setting.component";
import { NotificationSettingComponent } from "./components/notification-setting/notification-setting.component";
import { EmailFetchSettingComponent } from "./components/email-fetch-setting/email-fetch-setting.component";
import { DoctorEmailZoneComponent } from "./components/doctor-email-zone/doctor-email-zone.component";
import { EmailHostComponent } from "./components/email-communication/email-host/email-host.component";
import { DefaultEmailComponent } from "./components/email-communication/default-email/default-email.component";
import { AcknowledgementSettingComponent } from "./components/acknowledgement-setting/acknowledgement-setting.component";
import { FollowupSettingComponent } from "./components/followup-setting/followup-setting.component";
import { MessageContentComponent } from "./components/message-content/message-content.component";
import { CommunicationSettingComponent } from "./components/communication-setting/communication-setting.component";
import { MessageHostComponent } from "./components/message-communication/message-host/message-host.component";
import { DefaultMessageComponent } from "./components/message-communication/default-message/default-message.component";
import { MessageFetchSettingComponent } from "./components/message-fetch-setting/message-fetch-setting.component";
import { ReferralPartnerPreZoneComponent } from "./components/referral-partner-zone/referral-partner-pre-zone/referral-partner-pre-zone.component";
import { ReferralPartnerPreStaffComponent } from "./components/referral-partner-zone/referral-partner-pre-staff/referral-partner-pre-staff.component";
import { ReferralPartnerOwnZoneComponent } from "./components/referral-partner-zone/referral-partner-own-zone/referral-partner-own-zone.component";
import { ReferralPartnerOwnStaffComponent } from "./components/referral-partner-zone/referral-partner-own-staff/referral-partner-own-staff.component";

const routes: Routes = [
  { path: "account-details", component: AccountDetailsComponent },
  { path: "change-password", component: ChangePasswordComponent },
  { path: "user-profile", component: UserProfileComponent },
  // { path: "email-setting", component: EmailSettingComponent },
  { path: "email-communication/email-host", component: EmailHostComponent },
  {
    path: "email-communication/default-email",
    component: DefaultEmailComponent,
  },
  { path: "hospital-communication", component: HospitalEmailZoneComponent },
  { path: "doctor-communication", component: DoctorEmailZoneComponent },
  { path: "email-content", component: HospitalEmailContentComponent },
  { path: "template-setting", component: TemplateSettingComponent },
  { path: "query-view-setting", component: QueryViewSettingComponent },

  { path: "bank-details", component: BankDetailsComponent },
  { path: "vil-setting", component: VilSettingComponent },
  { path: "email-send-setting", component: EmailSentSettingComponent },
  { path: "top-hospital", component: TopHospitalComponent },

  { path: "comment-setting", component: CommentSettingComponent },
  { path: "notification-setting", component: NotificationSettingComponent },
  { path: "communication-setting", component: CommunicationSettingComponent },

  {
    path: "message-communication/message-host",
    component: MessageHostComponent,
  },
  {
    path: "message-communication/default-message",
    component: DefaultMessageComponent,
  },

  {
    path: "referral-partner-details",
    component: ReferralPartnerDetailsComponent,
  },
  { path: "branch-office-details", component: BranchOfficeDetailsComponent },
  { path: "email-fetch-setting", component: EmailFetchSettingComponent },
  {
    path: "acknowledgement-setting",
    component: AcknowledgementSettingComponent,
  },
  { path: "followup-setting", component: FollowupSettingComponent },

  { path: "message-content", component: MessageContentComponent },

  { path: "message-send-setting", component: MessageFetchSettingComponent },

  {
    path: "referral-partner-communication/pre-zone",
    component: ReferralPartnerPreZoneComponent,
  },
  {
    path: "referral-partner-communication/pre-staff",
    component: ReferralPartnerPreStaffComponent,
  },
  {
    path: "referral-partner-communication/own-zone",
    component: ReferralPartnerOwnZoneComponent,
  },
  {
    path: "referral-partner-communication/own-staff",
    component: ReferralPartnerOwnStaffComponent,
  },

  { path: "", redirectTo: "details", pathMatch: "full" },
  { path: "**", redirectTo: "details" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
