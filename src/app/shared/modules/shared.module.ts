import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  OWL_DATE_TIME_FORMATS,
} from "ng-pick-datetime";
import { ClipboardModule } from "ngx-clipboard";

import { MaterialModule } from "./material.module";
import { FeatherIconsModule } from "../components/feather-icons/feather-icons.module";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { MentionModule } from "angular-mentions";
import { MatSelectInfiniteScrollModule } from "ng-mat-select-infinite-scroll";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { FullCalendarModule } from "@fullcalendar/angular";
import { NgxMentionModule } from "@netcreaties/ngx-mention";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    PdfViewerModule,
    MentionModule,
    MatSelectInfiniteScrollModule,
    InfiniteScrollModule,
    FullCalendarModule,
    NgxMentionModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    MaterialModule,
    FeatherIconsModule,
    CKEditorModule,
    PerfectScrollbarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ClipboardModule,
    PdfViewerModule,
    MentionModule,
    MatSelectInfiniteScrollModule,
    InfiniteScrollModule,
    FullCalendarModule,
    NgxMentionModule,
  ],
})
export class SharedModule {}
