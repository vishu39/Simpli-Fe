import { Component, Inject, Input, OnInit, SimpleChanges } from "@angular/core";
import { FinanceModuleService } from "../../../finance-module.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { DialogFormConfig } from "src/app/smvt-framework/interfaces/sm-framework-defaults";

@Component({
  selector: "app-master-setting-details-tabs",
  templateUrl: "./master-setting-details-tabs.component.html",
  styleUrls: ["./master-setting-details-tabs.component.scss"],
})
export class MasterSettingDetailsTabsComponent implements OnInit {
  @Input() queryData: any;
  tabs: any[];
  queryButtons: any[] = this.financeModuleService.queryButtons;
  dialogFormConfig: DialogFormConfig[];
  currentTab: string;

  @Input("tabName") tabName: string;

  decodedToken = this.sharedService.decodeToken();

  uhidArray = [
    {
      hospitalName: "Fortis Kolkata",
      uhid: "UHID124215",
    },
    {
      hospitalName: "Fortis Mulund",
      uhid: "UHID29887715",
    },
    {
      hospitalName: "Fortis Mumbai",
      uhid: "UHID7896474215",
    },
    {
      hospitalName: "Fortis Pune",
      uhid: "UHID122215",
    },
    {
      hospitalName: "Fortis Dubai",
      uhid: "UHID23626",
    },
  ];

  amountArray = [
    {
      hospitalName: "Fortis Kolkata",
      amount: 100,
      currency: {
        code: "USD",
      },
    },
    {
      hospitalName: "Fortis Mulund",
      amount: 400,
      currency: {
        code: "EUR",
      },
    },
    {
      hospitalName: "Fortis Kolkata",
      amount: 1000,
      currency: {
        code: "INR",
      },
    },
    {
      hospitalName: "Fortis America",
      amount: 2000,
      currency: {
        code: "INR",
      },
    },
  ];

  constructor(
    private svc: CommonService,
    private financeModuleService: FinanceModuleService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matRef: MatDialogRef<MasterSettingDetailsTabsComponent>,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.currentTab = changes.tabName.currentValue;
  }

  getTotalAmount(array: any): number {
    return array?.reduce((sum, item) => sum + (item?.amount || 0), 0);
  }
}
