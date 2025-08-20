import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginGuard } from "src/app/core/guard/login.guard";
import { AuthLayoutComponent } from "src/app/layout/app-layout/auth-layout/auth-layout.component";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";

const routes: Routes = [
  {
    path: "facilitator",
    loadChildren: () =>
      import("./components/facilitator/facilitator.module").then(
        (m) => m.FacilitatorModule
      ),
  },
  {
    path: "hospital",
    loadChildren: () =>
      import("./components/hospital/hospital.module").then(
        (m) => m.HospitalModule
      ),
  },
  { path: "", redirectTo: `${GET_LOGIN_TYPE()}`, pathMatch: "full" },
  { path: "**", redirectTo: "facilitator" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
