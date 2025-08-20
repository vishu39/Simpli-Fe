import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HospitalComponent } from "./components/hospital/hospital.component";
import { DoctorComponent } from "./components/doctor/doctor.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { InternalUserMainLayoutComponent } from "./components/internal-user-main-layout/internal-user-main-layout.component";
import { AppLayoutModule } from "src/app/features/app-layout/app-layout.module";
import { SharedModule } from "src/app/shared/modules/shared.module";
import { SmCrudModule } from "src/app/smvt-framework/sm-crud/sm-crud.module";
import { NgxEchartsModule } from "ngx-echarts";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { InternalUserPanelRoutingModule } from "./internal-user-panel-routing.module";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { HospitalProfileComponent } from "./components/hospital/components/hospital-profile/hospital-profile.component";
import { DoctorProfileComponent } from "./components/doctor/components/doctor-profile/doctor-profile.component";
import { HospitalStaffComponent } from "./components/hospital-staff/hospital-staff.component";
// import { HospitalUserPermissionComponent } from "./components/hospital-user-permission/hospital-user-permission.component";
import { SharedComponentModule } from "../shared-component/shared-component.module";
import { QueryManagementComponent } from "./components/query-management/query-management.component";
import { IssuedVilComponent } from "./components/issued-vil/issued-vil.component";
import { HospitalPatientComponent } from "./components/hospital-patient/hospital-patient.component";
import { TreatingDocDashboardComponent } from "./components/treating-doctor/components/treating-doc-dashboard/treating-doc-dashboard.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { HospitalInternalUserComponent } from "./components/hospital-internal-user/hospital-internal-user.component";
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
    InternalUserMainLayoutComponent,
    HospitalComponent,
    HospitalProfileComponent,
    DoctorComponent,
    DashboardComponent,
    DoctorProfileComponent,
    HospitalStaffComponent,
    // HospitalUserPermissionComponent,
    QueryManagementComponent,
    IssuedVilComponent,
    HospitalPatientComponent,
    TreatingDocDashboardComponent,
    CalendarComponent,
    HospitalInternalUserComponent,
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
    InternalUserPanelRoutingModule,
    AppLayoutModule,
    SharedModule,
    SmCrudModule,
    ComponentsModule,
    SharedComponentModule,
  ],
})
export class InternalUserPanelModule {}
