import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AccountRoutingModule } from "./account-routing.module";
import { SharedModule } from "src/app/shared/modules/shared.module";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { UserEmailContentComponent } from "./components/email-content/email-content.component";
import { TemplateSettingComponent } from "./components/template-setting/template-setting.component";
import { SharedComponentModule } from "../../../shared-component/shared-component.module";
import { AutoReminderSettingComponent } from "./components/auto-reminder-setting/auto-reminder-setting.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { EmailSettingComponent } from "./components/email-setting/email-setting.component";
import { QueryViewSettingComponent } from "./components/query-view-setting/query-view-setting.component";
import { TopHospitalComponent } from "./components/top-hospital/top-hospital.component";
import { HospitalEmailZoneComponent } from "./components/hospital-email-zone/hospital-email-zone.component";
import { AccountDetailsComponent } from "./components/account-details/account-details.component";
import { ReferralPartnerDetailsComponent } from "./components/referral-partner-details/referral-partner-details.component";
import { BranchOfficeDetailsComponent } from "./components/branch-office-details/branch-office-details.component";
import { SmCrudModule } from "src/app/smvt-framework/sm-crud/sm-crud.module";
import { CommentSettingComponent } from "./components/comment-setting/comment-setting.component";
import { NotificationSettingComponent } from "./components/notification-setting/notification-setting.component";
import { EmailSentSettingComponent } from "./components/email-sent-setting/email-sent-setting.component";
import { EmailFetchSettingComponent } from "./components/email-fetch-setting/email-fetch-setting.component";
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

@NgModule({
  declarations: [
    UserEmailContentComponent,
    TemplateSettingComponent,
    AutoReminderSettingComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    EmailSettingComponent,
    QueryViewSettingComponent,
    TopHospitalComponent,
    HospitalEmailZoneComponent,
    AccountDetailsComponent,
    ReferralPartnerDetailsComponent,
    BranchOfficeDetailsComponent,
    CommentSettingComponent,
    NotificationSettingComponent,
    EmailSentSettingComponent,
    EmailFetchSettingComponent,
    EmailHostComponent,
    DefaultEmailComponent,
    AcknowledgementSettingComponent,
    FollowupSettingComponent,
    MessageContentComponent,
    CommunicationSettingComponent,
    MessageHostComponent,
    DefaultMessageComponent,
    MessageFetchSettingComponent,
    ReferralPartnerPreZoneComponent,
    ReferralPartnerPreStaffComponent,
    ReferralPartnerOwnZoneComponent,
    ReferralPartnerOwnStaffComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    ComponentsModule,
    SharedComponentModule,
    SmCrudModule,
  ],
})
export class AccountModule {}
