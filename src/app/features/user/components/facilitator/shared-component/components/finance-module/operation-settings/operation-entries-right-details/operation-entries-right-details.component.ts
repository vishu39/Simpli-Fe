import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { treatingDoctorUserType } from "src/app/core/models/role";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FinanceModuleService } from "../../finance-module.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { SmFormComponent } from "src/app/smvt-framework/sm-crud/sm-form/sm-form.component";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-operation-entries-right-details",
  templateUrl: "./operation-entries-right-details.component.html",
  styleUrls: ["./operation-entries-right-details.component.scss"],
})
export class OperationEntriesRightDetailsComponent implements OnInit {
  windowWidth: number | any;
  isDetails: boolean = true;
  isTabs: boolean = false;
  isRecording: boolean = false;
  isReports: boolean = false;
  tabs;
  // queryButtons = this.financeModuleService.queryButtons;
  queryButtons: any;
  decodedToken: any = this.sharedService.decodeToken();

  @Output("queryEvent") queryEvent: EventEmitter<any> = new EventEmitter();
  @Input() queryData: any;
  @ViewChild(SmFormComponent) dialogForm: SmFormComponent;

  constructor(
    private svc: CommonService,
    private financeModuleService: FinanceModuleService,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {
    this.windowWidth = window.innerWidth;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getAllHospitalUhidForFinanceBilling();
    this.getAllBillingDocForFinanceBilling();
  }

  docsParams: any = {
    page: 1,
    limit: 0,
    search: "",
  };
  isDocsLoading: boolean = false;
  docsData = [];
  formattedAmounts: string = "";
  total: number = 0;
  getAllBillingDocForFinanceBilling() {
    this.isDocsLoading = true;
    this.facilitatorService
      .getAllBillingDocForFinanceBilling(this.docsParams, this.queryData?._id)
      .subscribe(
        (res: any) => {
          this.docsData = res?.data?.content;
          this.formattedAmounts = this.docsData
            .map((a) => `${a.amount} ${a?.currency?.code}`)
            .join(" + ");

          // Calculate total
          this.total = this.docsData.reduce((sum, a) => sum + (+a.amount), 0);
          this.isDocsLoading = false;
        },
        () => {
          this.isDocsLoading = false;
        }
      );
  }

  hospitalUhidParams: any = {
    page: 1,
    limit: 0,
    search: "",
  };

  uhidArray: any = [];
  isLoading: any = false;
  getAllHospitalUhidForFinanceBilling() {
    this.isLoading = true;
    this.facilitatorService
      .getAllHospitalUhidForFinanceBilling(
        this.hospitalUhidParams,
        this.queryData?._id
      )
      .subscribe(
        (res: any) => {
          this.uhidArray = res?.data?.content;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  treatingDoctorUserType = treatingDoctorUserType;

  ngOnInit(): void {
    // if (this.decodedToken.userType === "treating doctor") {
    //   this.tabs = this.financeModuleService.tabsForTratingDoctor;
    //   this.queryButtons = this.financeModuleService.queryButtonsForTreatingDoctor;
    // } else {
    this.tabs = this.financeModuleService.tabs;
    this.queryButtons = this.financeModuleService.queryButtons;
    // }
    this.changeExpansionMode("isDetails");
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }

  btnHandler($event, prop, itemData: any) {
    let data = { $event, prop, mode: prop.name, data: this.queryData };
    this.queryEvent.emit(data);
  }

  openedExpansion: string;

  changeExpansionMode(name: string) {
    if (this.openedExpansion !== name) this.openedExpansion = name;
    else this.openedExpansion = "";
  }
}
