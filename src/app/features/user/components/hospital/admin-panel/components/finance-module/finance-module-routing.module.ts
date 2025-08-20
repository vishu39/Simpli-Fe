import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OperationEntriesComponent } from "./components/operation-entries/operation-entries.component";

const routes: Routes = [
  { path: "billing-entries", component: OperationEntriesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceModuleRoutingModule {}
