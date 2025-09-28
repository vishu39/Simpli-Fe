import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DoctorComponent } from "./components/doctor/doctor.component";
import { HospitalComponent } from "./components/hospital/hospital.component";
import { HospitalProfileComponent } from "./components/hospital/components/hospital-profile/hospital-profile.component";
import { DoctorProfileComponent } from "./components/doctor/components/doctor-profile/doctor-profile.component";
import { HospitalStaffComponent } from "./components/hospital-staff/hospital-staff.component";
import { HospitalUserPermissionComponent } from "./components/hospital-user-permission/hospital-user-permission.component";
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
  { path: "internal-user", component: HospitalInternalUserComponent },
  { path: "hospital-staff", component: HospitalStaffComponent },
  { path: "doctor-staff", component: DoctorStaffComponent },
  // { path: "user-permission", component: HospitalUserPermissionComponent },
  { path: "user-permission", component: UserPermissionRevampComponent },
  { path: "patient", component: HospitalPatientComponent },
  { path: "doctor", component: DoctorComponent },
  { path: "doctor/:id", component: DoctorProfileComponent },
  { path: "hospital", component: HospitalComponent },
  { path: "hospital/:id", component: HospitalProfileComponent },
  { path: "query-management", component: QueryManagementComponent },
  { path: "email-fetch", component: EmailComponent },
  { path: "email-fetch/:id", component: EmailDetailsComponent },
  { path: "calendar", component: CalendarComponent },
  { path: "error-log", component: ErrorLogComponent },
  { path: "issued-vil", component: IssuedVilComponent },
  { path: "sent-vil-history", component: SentVilHistoryComponent },
  { path: "operation-board", component: OperationBoardComponent },

  { path: "treatment-package", component: TreatmentPackageComponent },

  { path: "message-fetch", component: MessageFetchComponent },

  { path: "report", component: ReportComponent },

  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "dashboard" },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule { }
