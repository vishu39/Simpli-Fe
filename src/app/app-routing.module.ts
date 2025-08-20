import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "./authentication/page404/page404.component";
import { SampleListComponent } from "./sample/sample-list.component";

const routes: Routes = [
  {
    path: "user",
    loadChildren: () =>
      import("./features/user/user.module").then((m) => m.UserModule),
  },
  {
    path: "supreme",
    loadChildren: () =>
      import("./features/supreme/supreme.module").then((m) => m.SupremeModule),
  },
  {
    path: "hospital",
    loadChildren: () =>
      import("./features/hospital-link/hospital-link.module").then(
        (m) => m.HospitalLinkModule
      ),
  },
  { path: "", redirectTo: "user", pathMatch: "full" },
  { path: "**", redirectTo: "user" },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
