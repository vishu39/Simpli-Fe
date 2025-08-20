import { Component, Inject, Input, OnInit, SimpleChanges } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogFormConfig } from "src/app/smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { QueryHospitalService } from "../query.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { hospitalAdminUserType } from "src/app/core/models/role";

@Component({
  selector: "app-hospital-query-tabs",
  templateUrl: "./hospital-query-tabs.component.html",
  styleUrls: ["./hospital-query-tabs.component.scss"],
})
export class HospitalQueryTabsComponent implements OnInit {
  @Input() queryData: any;
  tabs: any[];
  queryButtons: any[] = this.querySvc.queryButtons;
  dialogFormConfig: DialogFormConfig[];
  currentTab: string;

  @Input("tabName") tabName: string;

  decodedToken = this.sharedService.decodeToken();

  treating_doc_constant: any = hospitalAdminUserType.treatingDoctor;

  constructor(
    private svc: CommonService,
    public querySvc: QueryHospitalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matRef: MatDialogRef<HospitalQueryTabsComponent>,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.currentTab = changes.tabName.currentValue;
  }
}
