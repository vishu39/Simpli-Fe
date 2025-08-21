import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InternalUserPanelRoutingModule } from "./internal-user-panel-routing.module";
import { InternalUserMainLayoutComponent } from "./components/internal-user-main-layout/internal-user-main-layout.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AppLayoutModule } from "src/app/features/app-layout/app-layout.module";

import { NgxEchartsModule } from "ngx-echarts";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { InternalUserComponent } from "./components/internal-user/internal-user.component";
import { SmCrudModule } from "src/app/smvt-framework/sm-crud/sm-crud.module";
import { QueryManagementComponent } from "./components/query-management/query-management.component";
import { OperationBoardComponent } from "./components/operation-board/operation-board.component";
import { OperationDialogComponent } from "./components/operation-board/operation-dialog/operation-dialog.component";
import { HospitalStaffComponent } from "./components/hospital-staff/hospital-staff.component";
import { SharedModule } from "src/app/shared/modules/shared.module";
import { SharedComponentModule } from "../shared-component/shared-component.module";
import { ReportComponent } from "./components/report/report.component";
import { PatientComponent } from "./components/patient/patient.component";
import { DoctorComponent } from "./components/doctor/doctor.component";
import { HospitalComponent } from "./components/hospital/hospital.component";
import { DoctorProfileComponent } from "./components/doctor/doctor-profile/doctor-profile.component";
import { HospitalProfileComponent } from "./components/hospital/hospital-profile/hospital-profile.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
// import { UserPermissionComponent } from "./components/user-permission/user-permission.component";
import { ErrorLogComponent } from "./components/error-log/error-log.component";
import { EmailComponent } from "./components/email/email.component";
import { EmailDetailsComponent } from "./components/email/component/email-details/email-details.component";
import { MessageFetchComponent } from "./components/message-fetch/message-fetch.component";
import { UserPermissionRevampComponent } from "./components/user-permission-revamp/user-permission-revamp.component";
import { DashboardRevampComponent } from "./components/dashboard-revamp/dashboard-revamp.component";
import { FinanceModuleRoutingModule } from "./components/finance-module/finance-module-routing.module";

@NgModule({
  declarations: [
    DashboardComponent,
    InternalUserMainLayoutComponent,
    InternalUserComponent,
    QueryManagementComponent,
    OperationBoardComponent,
    OperationDialogComponent,
    HospitalStaffComponent,
    ReportComponent,
    PatientComponent,
    DoctorComponent,
    HospitalComponent,
    DoctorProfileComponent,
    HospitalProfileComponent,
    CalendarComponent,
    // UserPermissionComponent,
    ErrorLogComponent,
    EmailComponent,
    EmailDetailsComponent,
    MessageFetchComponent,
    UserPermissionRevampComponent,
    DashboardRevampComponent,
  ],
  imports: [
    CommonModule,
    InternalUserPanelRoutingModule,
    AppLayoutModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    chartjsModule,
    NgApexchartsModule,
    ComponentsModule,
    SmCrudModule,
    SharedComponentModule,
    FinanceModuleRoutingModule,
  ],
})
export class InternalUserPanelModule {}
