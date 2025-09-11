import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FinanceModuleRoutingModule } from "./finance-module-routing.module";
import { OperationEntriesComponent } from "./components/operation-entries/operation-entries.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedComponentModule } from "../../../shared-component/shared-component.module";
import { MasterDataEntriesComponent } from './components/master-data-entries/master-data-entries.component';
import { FinanceLogsComponent } from './components/finance-logs/finance-logs.component';
import { FinanceInvoiceComponent } from './components/finance-invoice/finance-invoice.component';

@NgModule({
  declarations: [OperationEntriesComponent, MasterDataEntriesComponent, FinanceLogsComponent, FinanceInvoiceComponent],
  imports: [
    CommonModule,
    FinanceModuleRoutingModule,
    ComponentsModule,
    SharedComponentModule,
  ],
})
export class FinanceModuleModule {}
