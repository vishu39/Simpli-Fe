import { NgModule } from "@angular/core";

import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/modules/shared.module";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PageLoaderComponent } from "./layout/page-loader/page-loader.component";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ClickOutsideModule } from "ng-click-outside";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";

import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { NgxUiLoaderConfig, NgxUiLoaderModule } from "ngx-ui-loader";
import { CustomInterceptor } from "./core/interceptor/custom.interceptor";
import { LoaderInterceptor } from "./core/interceptor/loader.interceptor";
import { CommonService } from "./smvt-framework/services/common.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { SmCrudModule } from "./smvt-framework/sm-crud/sm-crud.module";
import { SampleDialogComponent } from "./sample/sample-dialog.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};
import { MatSelectInfiniteScrollModule } from "ng-mat-select-infinite-scroll";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { DestroyApiCall } from "./core/interceptor/destroy-api-call";




const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "red",
  bgsOpacity: 0.5,
  bgsPosition: "bottom-right",
  bgsSize: 60,
  bgsType: "ball-spin-clockwise",
  blur: 5,
  delay: 0,
  fastFadeOut: true,
  fgsColor: "#54b4e2",
  fgsPosition: "center-center",
  fgsSize: 60,
  fgsType: "cube-grid",
  gap: 24,
  logoPosition: "center-center",
  logoSize: 120,
  logoUrl: "../assets/images/logo.png",
  masterLoaderId: "master",
  overlayBorderRadius: "0",
  overlayColor: "rgba(40, 40, 40, 0.8)",
  pbColor: "#54b4e2",
  pbDirection: "ltr",
  pbThickness: 3,
  hasProgressBar: true,
  text: "",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  maxTime: -1,
  minTime: 300,
};
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    PageLoaderComponent,
    AuthLayoutComponent,
    SampleDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    HttpClientModule,
    PerfectScrollbarModule,
    ClickOutsideModule,
    LoadingBarRouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    // core & shared
    CoreModule,
    SmCrudModule,
    MatSelectInfiniteScrollModule,
    InfiniteScrollModule,
    LoadingBarHttpClientModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
    
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    CommonService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DestroyApiCall,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
