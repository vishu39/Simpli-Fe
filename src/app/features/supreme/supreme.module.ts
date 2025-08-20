import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { environment } from "src/environments/environment";

import { SupremeRoutingModule } from "./supreme-routing.module";
import { SupremeMainLayoutComponent } from "./components/supreme-main-layout/supreme-main-layout.component";
import { AppLayoutModule } from "../app-layout/app-layout.module";
import { NgxMatIntlTelInputComponent } from "ngx-mat-intl-tel-input";

@NgModule({
  declarations: [SupremeMainLayoutComponent],
  imports: [
    CommonModule,
    SupremeRoutingModule,
    AppLayoutModule,
    NgxMatIntlTelInputComponent,
  ],
})
export class SupremeModule {}
