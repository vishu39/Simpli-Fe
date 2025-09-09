import {
  Component,
  Inject,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { DialogFormConfig } from "src/app/smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FinanceModuleService } from "../../../finance-module.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-operation-entries-details-tabs",
  templateUrl: "./operation-entries-details-tabs.component.html",
  styleUrls: ["./operation-entries-details-tabs.component.scss"],
})
export class OperationEntriesDetailsTabsComponent implements OnInit, OnChanges {
  @Input() queryData: any;
  tabs: any[];
  queryButtons: any[] = this.financeModuleService.queryButtons;
  dialogFormConfig: DialogFormConfig[];
  currentTab: string;

  @Input("tabName") tabName: string;

  decodedToken = this.sharedService.decodeToken();

  constructor(
    private svc: CommonService,
    private financeModuleService: FinanceModuleService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matRef: MatDialogRef<OperationEntriesDetailsTabsComponent>,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.currentTab = simpleChanges.tabName.currentValue;

    if (!!simpleChanges?.queryData?.currentValue) {
      this.getAllBillingDocForFinanceBilling();
    } else {
      // if (!!this.queryData._id) {
      //   this.getAllBillingDocForFinanceBilling();
      // }
    }
  }

  docsParams: any = {
    page: 1,
    limit: 0,
    search: "",
  };
  isDocsLoading: boolean = false;
  docsData = [];
  getAllBillingDocForFinanceBilling() {
    this.isDocsLoading = true;
    this.facilitatorService
      .getAllBillingDocForFinanceBilling(this.docsParams, this.queryData?._id)
      .subscribe(
        (res: any) => {
          this.docsData = res?.data?.content;
          this.docsData.map((data: any) => {
            data.currency = JSON.parse(data?.currency);
          });
          this.isDocsLoading = false;
        },
        () => {
          this.isDocsLoading = false;
        }
      );
  }

  getTotalAmount(array: any): number {
    return array?.reduce((sum, item) => sum + (+item?.amount || 0), 0);
  }
}
