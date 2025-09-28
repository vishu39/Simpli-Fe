import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HospitalComponent } from "./components/hospital/hospital.component";
import { DoctorComponent } from "./components/doctor/doctor.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AdminMainLayoutComponent } from "./components/admin-main-layout/admin-main-layout.component";
import { AdminPanelRoutingModule } from "./admin-panel-routing.module";
import { AppLayoutModule } from "src/app/features/app-layout/app-layout.module";
import { SharedModule } from "src/app/shared/modules/shared.module";
import { NgxEchartsModule } from "ngx-echarts";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { SmCrudModule } from "src/app/smvt-framework/sm-crud/sm-crud.module";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { HospitalProfileComponent } from "./components/hospital/components/hospital-profile/hospital-profile.component";
import { DoctorProfileComponent } from "./components/doctor/components/doctor-profile/doctor-profile.component";
import { HospitalStaffComponent } from "./components/hospital-staff/hospital-staff.component";
import { TemplateSettingComponent } from "./components/account/components/template-setting/template-setting.component";
// import { HospitalUserPermissionComponent } from "./components/hospital-user-permission/hospital-user-permission.component";
import { SharedComponentModule } from "../shared-component/shared-component.module";
import { HospitalInternalUserComponent } from "./components/hospital-internal-user/hospital-internal-user.component";
import { HospitalPatientComponent } from "./components/hospital-patient/hospital-patient.component";
import { QueryManagementComponent } from "./components/query-management/query-management.component";
import { IssuedVilComponent } from "./components/issued-vil/issued-vil.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { OperationBoardComponent } from "./components/operation-board/operation-board.component";
import { ErrorLogComponent } from "./components/error-log/error-log.component";
import { SentVilHistoryComponent } from "./components/sent-vil-history/sent-vil-history.component";
import { EmailComponent } from "./components/email/email.component";
import { EmailDetailsComponent } from "./components/email/component/email-details/email-details.component";
import { ReportComponent } from "./components/report/report.component";
import { DoctorStaffComponent } from "./components/doctor-staff/doctor-staff.component";
import { TreatmentPackageComponent } from "./components/treatment-package/treatment-package.component";
import { MessageFetchComponent } from "./components/message-fetch/message-fetch.component";
import { UserPermissionRevampComponent } from "./components/user-permission-revamp/user-permission-revamp.component";
import { DashboardRevampComponent } from "./components/dashboard-revamp/dashboard-revamp.component";

@NgModule({
  declarations: [
    AdminMainLayoutComponent,
    HospitalComponent,
    DoctorComponent,
    DoctorProfileComponent,
    DashboardComponent,
    HospitalProfileComponent,
    HospitalStaffComponent,
    TemplateSettingComponent,
    // HospitalUserPermissionComponent,
    HospitalInternalUserComponent,
    HospitalPatientComponent,
    QueryManagementComponent,
    IssuedVilComponent,
    CalendarComponent,
    OperationBoardComponent,
    ErrorLogComponent,
    SentVilHistoryComponent,
    EmailComponent,
    EmailDetailsComponent,
    ReportComponent,
    DoctorStaffComponent,
    TreatmentPackageComponent,
    MessageFetchComponent,
    UserPermissionRevampComponent,
    DashboardRevampComponent
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    AppLayoutModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    chartjsModule,
    NgApexchartsModule,
    SmCrudModule,
    ComponentsModule,
    SharedComponentModule,
  ],
})
export class AdminPanelModule {}
