import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { SmFormComponent } from "src/app/smvt-framework/sm-crud/sm-form/sm-form.component";
import { QueryService } from "./query.service";
import { PotentialTreatmentModalComponent } from "src/app/shared/components/dialogs/potential-treatment-modal/potential-treatment-modal.component";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "shared-query",
  templateUrl: "./query.component.html",
  styleUrls: ["./query.component.scss"],
})
export class QueryComponent implements OnInit, OnChanges {
  windowWidth: number | any;
  isDetails: boolean = true;
  isTabs: boolean = false;
  tabs = this.querySvc.tabs;
  queryButtons = this.querySvc.queryButtons;

  @Output("queryEvent") queryEvent: EventEmitter<any> = new EventEmitter();
  @Input() queryData: any;
  @ViewChild(SmFormComponent) dialogForm: SmFormComponent;

  constructor(
    private svc: CommonService,
    private querySvc: QueryService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {
    this.windowWidth = window.innerWidth;
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit(): void {
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
  validateButton(name: string) {
    return name !== "Assign";
  }

  openedExpansion: string;
  changeExpansionMode(name: string) {
    if (this.openedExpansion !== name) this.openedExpansion = name;
    else this.openedExpansion = "";
  }

  potentialData: any;
  onClickPotentialTreatment() {
    this.sharedService.startLoader();
    let id = this.queryData?._id;
    this.sharedService.getTreatmentFromReport(id).subscribe(
      (res: any) => {
        if (!res?.isError) {
          this.potentialData = res?.data;
          this.sharedService.stopLoader();
          this.openModalForPotential();
        } else {
          this.potentialData = null;
          this.sharedService.stopLoader();
          this.sharedService.showNotification("snackBar-danger", res?.message);
        }
      },
      () => {
        this.potentialData = null;
        this.sharedService.stopLoader();
      }
    );
  }

  openModalForPotential() {
    const dialogRef = this.dialog.open(PotentialTreatmentModalComponent, {
      width: "60%",
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.componentInstance.dialogTitle = "Potential Treatment";

    dialogRef.componentInstance.potentialData = this.potentialData;

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
