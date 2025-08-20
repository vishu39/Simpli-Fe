import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OperationEntriesComponent } from "./components/operation-entries/operation-entries.component";
import { MasterDataEntriesComponent } from "./components/master-data-entries/master-data-entries.component";

const routes: Routes = [
  { path: "master-settings", component: MasterDataEntriesComponent },
  { path: "billing-entries", component: OperationEntriesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceModuleRoutingModule {}
