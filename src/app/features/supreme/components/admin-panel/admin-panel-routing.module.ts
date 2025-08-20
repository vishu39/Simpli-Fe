import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerComponent } from "./components/customer/customer.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { OnPremiseUserComponent } from "./components/on-premise-user/on-premise-user.component";
import { UserPermissionComponent } from "./components/user-permission/user-permission.component";
import { UserComponent } from "./components/user/user.component";
import { OperationBoardComponent } from "./components/operation-board/operation-board.component";
import { EmailContentComponent } from "./components/email-content/email-content.component";
import { HospitalStaffComponent } from "./components/hospital-staff/hospital-staff.component";
import { HospitalEmailZoneComponent } from "./components/hospital-email-zone/hospital-email-zone.component";
import { HospitalPasswordComponent } from "./components/hospital-password/hospital-password.component";
import { EmailContentHospitalComponent } from "./components/email-content-hospital/email-content-hospital.component";
import { HospitalTemplateComponent } from "./components/hospital-template/hospital-template.component";
import { MessageContentFacilitatorComponent } from "./components/message-content/message-content-facilitator/message-content-facilitator.component";
import { MessageContentHospitalComponent } from "./components/message-content/message-content-hospital/message-content-hospital.component";
import { ReferralPartnerStaffComponent } from "./components/referral-partner-zone/referral-partner-staff/referral-partner-staff.component";
import { ReferralPartnerCommunicationComponent } from "./components/referral-partner-zone/referral-partner-communication/referral-partner-communication.component";

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "user", component: UserComponent },
  { path: "user-permission", component: UserPermissionComponent },
  { path: "on-premise-user", component: OnPremiseUserComponent },
  { path: "customer", component: CustomerComponent },
  { path: "hospital-password", component: HospitalPasswordComponent },
  { path: "hospital-template", component: HospitalTemplateComponent },
  // { path: "operation-board", component: OperationBoardComponent },
  { path: "email-content-facilitator", component: EmailContentComponent },
  { path: "email-content-hospital", component: EmailContentHospitalComponent },
  { path: "hospital-staff", component: HospitalStaffComponent },
  { path: "hospital-communication", component: HospitalEmailZoneComponent },
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  {
    path: "message-content-facilitator",
    component: MessageContentFacilitatorComponent,
  },
  {
    path: "message-content-hospital",
    component: MessageContentHospitalComponent,
  },
  {
    path: "referral-partner-staff",
    component: ReferralPartnerStaffComponent,
  },
  {
    path: "referral-partner-zone",
    component: ReferralPartnerCommunicationComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
