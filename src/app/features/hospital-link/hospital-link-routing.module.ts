import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { OpdRequestComponent } from "./components/opd-request/opd-request.component";
import { HospitalLinkGuard } from "src/app/core/guard/hospital-link.guard";
import { OpinionRequestComponent } from "./components/opinion-request/opinion-request.component";
import { VilRequestComponent } from "./components/vil-request/vil-request.component";
import { ProformaRequestComponent } from "./components/proforma-request/proforma-request.component";
import { ConfirmationRequestComponent } from "./components/confirmation-request/confirmation-request.component";
import { DoctorDetailsComponent } from "./components/doctor-details/doctor-details.component";
import { VilVerificationComponent } from "./components/vil-verification/vil-verification.component";

const routes: Routes = [
  {
    path: "hospital-login",
    component: LoginComponent,
  },
  {
    path: "opd-request",
    canActivate: [HospitalLinkGuard],
    component: OpdRequestComponent,
  },
  {
    path: "opinion-request",
    canActivate: [HospitalLinkGuard],
    component: OpinionRequestComponent,
  },
  {
    path: "vil-request",
    canActivate: [HospitalLinkGuard],
    component: VilRequestComponent,
  },
  {
    path: "proforma-invoice-request",
    canActivate: [HospitalLinkGuard],
    component: ProformaRequestComponent,
  },
  {
    path: "doctor-opinion-request",
    canActivate: [HospitalLinkGuard],
    component: DoctorDetailsComponent,
  },
  {
    path: "patient-confirmation",
    canActivate: [HospitalLinkGuard],
    component: ConfirmationRequestComponent,
  },
  {
    path: "vil-verification",
    component: VilVerificationComponent,
  },
  { path: "", redirectTo: "hospital-login", pathMatch: "full" },
  { path: "**", redirectTo: "hospital-login" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitalLinkRoutingModule {}
