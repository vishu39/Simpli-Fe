import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { HeaderComponent } from "../../layout/header/header.component";
import { SidebarComponent } from "../../layout/sidebar/sidebar.component";
import { RightSidebarComponent } from "../../layout/right-sidebar/right-sidebar.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { SharedModule } from "src/app/shared/modules/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { PricePlanSidebarComponent } from "src/app/layout/price-plan-sidebar/price-plan-sidebar.component";
import { TimeagoModule } from "ngx-timeago";

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    PricePlanSidebarComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    TimeagoModule.forRoot(),
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    PricePlanSidebarComponent,
  ],
  providers: [DatePipe],
})
export class AppLayoutModule {}
