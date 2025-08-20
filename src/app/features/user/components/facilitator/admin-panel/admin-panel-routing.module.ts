import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { InternalUserComponent } from "./components/internal-user/internal-user.component";
import { QueryManagementComponent } from "./components/query-management/query-management.component";
import { OperationBoardComponent } from "./components/operation-board/operation-board.component";
import { HospitalStaffComponent } from "./components/hospital-staff/hospital-staff.component";
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

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  // { path: "analytics-dashboard", component: DashboardRevampComponent },
  {
    path: "account",
    loadChildren: () =>
      import("./components/account/account.module").then(
        (m) => m.AccountModule
      ),
  },
  {
    path: "finance",
    loadChildren: () =>
      import("./components/finance-module/finance-module.module").then(
        (m) => m.FinanceModuleModule
      ),
  },
  { path: "internal-user", component: InternalUserComponent },
  { path: "query-management", component: QueryManagementComponent },
  { path: "patient", component: PatientComponent },
  { path: "doctor", component: DoctorComponent },
  { path: "calendar", component: CalendarComponent },
  { path: "error-log", component: ErrorLogComponent },
  { path: "doctor/:id", component: DoctorProfileComponent },
  { path: "hospital", component: HospitalComponent },
  { path: "hospital/:id", component: HospitalProfileComponent },
  { path: "operation-board", component: OperationBoardComponent },
  { path: "hospital-staff", component: HospitalStaffComponent },
  // { path: "user-permission", component: UserPermissionComponent },
  { path: "user-permission", component: UserPermissionRevampComponent },
  { path: "email-fetch", component: EmailComponent },
  { path: "email-fetch/:id", component: EmailDetailsComponent },

  { path: "message-fetch", component: MessageFetchComponent },

  { path: "report", component: ReportComponent },

  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "dashboard" },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
