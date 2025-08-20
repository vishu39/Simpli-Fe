import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountDetailsComponent } from "./components/account-details/account-details.component";
import { AccountRoutingModule } from "./account-routing.module";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { EmailSettingComponent } from "./components/email-setting/email-setting.component";
import { HospitalEmailZoneComponent } from "./components/hospital-email-zone/hospital-email-zone.component";
import { QueryViewSettingComponent } from "./components/query-view-setting/query-view-setting.component";
import { SharedComponentModule } from "../../../shared-component/shared-component.module";
import { HospitalEmailContentComponent } from "./components/hospital-email-content/hospital-email-content.component";
import { EmailSentSettingComponent } from "./components/email-sent-setting/email-sent-setting.component";
import { BankDetailsComponent } from "./components/bank-details/bank-details.component";
import { TopHospitalComponent } from "./components/top-hospital/top-hospital.component";
import { VilSettingComponent } from "./components/vil-setting/vil-setting.component";
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
import { ReferralPartnerOwnStaffComponent } from "./components/referral-partner-zone/referral-partner-own-staff/referral-partner-own-staff.component";
import { ReferralPartnerOwnZoneComponent } from "./components/referral-partner-zone/referral-partner-own-zone/referral-partner-own-zone.component";

@NgModule({
  declarations: [
    AccountDetailsComponent,
    ChangePasswordComponent,
    UserProfileComponent,
    EmailSettingComponent,
    HospitalEmailZoneComponent,
    QueryViewSettingComponent,
    HospitalEmailContentComponent,
    EmailSentSettingComponent,
    BankDetailsComponent,
    TopHospitalComponent,
    VilSettingComponent,
    CommentSettingComponent,
    NotificationSettingComponent,
    EmailFetchSettingComponent,
    DoctorEmailZoneComponent,
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
    ReferralPartnerOwnStaffComponent,
    ReferralPartnerOwnZoneComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ComponentsModule,
    SharedComponentModule,
  ],
})
export class AccountModule {}
