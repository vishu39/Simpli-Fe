import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminPanelRoutingModule } from "./admin-panel-routing.module";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { SharedModule } from "src/app/shared/modules/shared.module";
import { NgxEchartsModule } from "ngx-echarts";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { UserComponent } from "./components/user/user.component";
import { UserDialogComponent } from "./components/user/dialog/user-dialog/user-dialog.component";
import { UserPermissionComponent } from "./components/user-permission/user-permission.component";
import { PermissionDialogComponent } from "./components/user-permission/dialog/permission-dialog/permission-dialog.component";
import { CustomerComponent } from "./components/customer/customer.component";
import { CustomerDialogComponent } from "./components/customer/dialog/customer-dialog/customer-dialog.component";
import { OnPremiseUserComponent } from "./components/on-premise-user/on-premise-user.component";
import { SmCrudModule } from "src/app/smvt-framework/sm-crud/sm-crud.module";
import { QueryManagementComponent } from "./components/query-management/query-management.component";
import { ToolbarComponent } from "./components/query-management/toolbar/toolbar.component";
import { ListItemComponent } from "./components/query-management/list/list-item.component";
import { QueryComponent } from "./components/query-management/query/query.component";
import { QueryDialog } from "./components/query-management/query-dialog/query-dialog.component";
import { QueryTabComponent } from "./components/query-management/query/query-tab/query-tab.component";
import { OperationBoardComponent } from "./components/operation-board/operation-board.component";
import { OperationDialogComponent } from "./components/operation-board/operation-dialog/operation-dialog.component";
import { EmailContentComponent } from "./components/email-content/email-content.component";
import { HospitalStaffComponent } from "./components/hospital-staff/hospital-staff.component";
import { MatSelect } from "@angular/material/select";
import { EmailContentDialogComponent } from "./components/email-content/dialog/email-content-dialog/email-content-dialog.component";
import { HospitalStaffDialogComponent } from "./components/hospital-staff/dialog/hospital-staff-dialog/hospital-staff-dialog.component";
import { HospitalEmailZoneComponent } from "./components/hospital-email-zone/hospital-email-zone.component";
import { ZoneComponent } from "./components/hospital-email-zone/components/zone/zone.component";
import { EmployeeComponent } from "./components/hospital-email-zone/components/employee/employee.component";
import { DoctorComponent } from "./components/hospital-email-zone/components/doctor/doctor.component";
import { DefaultEmailComponent } from "./components/hospital-email-zone/components/default-email/default-email.component";
import { ZoneDialogComponent } from "./components/hospital-email-zone/components/zone/dialog/zone-dialog/zone-dialog.component";
import { HospitalPasswordComponent } from "./components/hospital-password/hospital-password.component";
import { HospitalPasswordDialogComponent } from "./components/hospital-password/dialog/hospital-password-dialog/hospital-password-dialog.component";
import { EmailContentHospitalComponent } from "./components/email-content-hospital/email-content-hospital.component";
import { EmailContentHospitalDialogComponent } from "./components/email-content-hospital/dialog/email-content-hospital-dialog/email-content-hospital-dialog.component";
import { HospitalTemplateComponent } from "./components/hospital-template/hospital-template.component";
import { NgxMatIntlTelInputComponent } from "ngx-mat-intl-tel-input";
import { MessageContentHospitalComponent } from "./components/message-content/message-content-hospital/message-content-hospital.component";
import { MessageContentFacilitatorComponent } from "./components/message-content/message-content-facilitator/message-content-facilitator.component";
import { AddMessageContentHosComponent } from "./components/message-content/message-content-hospital/dialog/add-message-content-hos/add-message-content-hos.component";
import { AddMessageContentFacComponent } from "./components/message-content/message-content-facilitator/dialog/add-message-content-fac/add-message-content-fac.component";
import { DefaultMessageComponent } from "./components/hospital-email-zone/components/default-message/default-message.component";
import { ReferralPartnerStaffComponent } from "./components/referral-partner-zone/referral-partner-staff/referral-partner-staff.component";
import { ReferralPartnerCommunicationComponent } from "./components/referral-partner-zone/referral-partner-communication/referral-partner-communication.component";
import { AddReferralPartnerStaffComponent } from "./components/referral-partner-zone/referral-partner-staff/dialog/add-referral-partner-staff/add-referral-partner-staff.component";
import { ReferralDefaultEmailComponent } from './components/referral-partner-zone/referral-partner-communication/component/referral-default-email/referral-default-email.component';
import { ReferralDefaultMessageComponent } from './components/referral-partner-zone/referral-partner-communication/component/referral-default-message/referral-default-message.component';
import { ReferralStaffComponent } from './components/referral-partner-zone/referral-partner-communication/component/referral-staff/referral-staff.component';
import { ReferralZoneComponent } from './components/referral-partner-zone/referral-partner-communication/component/referral-zone/referral-zone.component';
import { AddReferralZoneComponent } from './components/referral-partner-zone/referral-partner-communication/component/referral-zone/dialog/add-referral-zone/add-referral-zone.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    UserDialogComponent,
    UserPermissionComponent,
    PermissionDialogComponent,
    CustomerComponent,
    CustomerDialogComponent,
    OnPremiseUserComponent,
    QueryManagementComponent,
    ToolbarComponent,
    ListItemComponent,
    QueryComponent,
    QueryDialog,
    QueryTabComponent,
    OperationBoardComponent,
    OperationDialogComponent,
    EmailContentComponent,
    HospitalStaffComponent,
    EmailContentDialogComponent,
    HospitalStaffDialogComponent,
    HospitalEmailZoneComponent,
    ZoneComponent,
    EmployeeComponent,
    DoctorComponent,
    DefaultEmailComponent,
    ZoneDialogComponent,
    HospitalPasswordComponent,
    HospitalPasswordDialogComponent,
    EmailContentHospitalComponent,
    EmailContentHospitalDialogComponent,
    HospitalTemplateComponent,
    MessageContentHospitalComponent,
    MessageContentFacilitatorComponent,
    AddMessageContentHosComponent,
    AddMessageContentFacComponent,
    DefaultMessageComponent,
    ReferralPartnerStaffComponent,
    ReferralPartnerCommunicationComponent,
    AddReferralPartnerStaffComponent,
    ReferralDefaultEmailComponent,
    ReferralDefaultMessageComponent,
    ReferralStaffComponent,
    ReferralZoneComponent,
    AddReferralZoneComponent,
  ],
  imports: [
    SmCrudModule,
    CommonModule,
    AdminPanelRoutingModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    chartjsModule,
    NgApexchartsModule,
    ComponentsModule,
    NgxMatIntlTelInputComponent,
  ],
  providers: [MatSelect],
})
export class AdminPanelModule {}
