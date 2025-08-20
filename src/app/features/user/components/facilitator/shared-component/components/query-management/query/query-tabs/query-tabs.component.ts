import { Component, Inject, Input, OnInit, SimpleChanges } from "@angular/core";
import { Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, map } from "rxjs";
import {
  DialogFormConfig,
  SMFormEventData,
  SMFormListRow,
} from "src/app/smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { QueryService } from "../query.service";

@Component({
  selector: "shared-query-tabs",
  templateUrl: "./query-tabs.component.html",
  styleUrls: ["./query-tabs.component.scss"],
})
export class QueryTabsComponent implements OnInit {
  @Input() queryData: any;
  tabs: any[] = this.querySvc.tabs;
  queryButtons: any[] = this.querySvc.queryButtons;
  dialogFormConfig: DialogFormConfig[];
  currentTab: string;

  @Input("tabName") tabName: string;

  constructor(
    private svc: CommonService,
    public querySvc: QueryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matRef: MatDialogRef<QueryTabsComponent>
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    this.currentTab = changes.tabName.currentValue;
  }
}
