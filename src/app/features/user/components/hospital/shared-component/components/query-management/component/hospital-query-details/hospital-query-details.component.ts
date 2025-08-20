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
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { SmFormComponent } from "src/app/smvt-framework/sm-crud/sm-form/sm-form.component";
import { QueryHospitalService } from "./query.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { treatingDoctorUserType } from "src/app/core/models/role";
import { PotentialTreatmentModalComponent } from "src/app/shared/components/dialogs/potential-treatment-modal/potential-treatment-modal.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-hospital-query-details",
  templateUrl: "./hospital-query-details.component.html",
  styleUrls: ["./hospital-query-details.component.scss"],
})
export class HospitalQueryDetailsComponent implements OnInit {
  windowWidth: number | any;
  isDetails: boolean = true;
  isTabs: boolean = false;
  isRecording: boolean = false;
  isReports: boolean = false;
  tabs;
  // queryButtons = this.querySvc.queryButtons;
  queryButtons: any;
  decodedToken: any = this.sharedService.decodeToken();

  @Output("queryEvent") queryEvent: EventEmitter<any> = new EventEmitter();
  @Input() queryData: any;
  @ViewChild(SmFormComponent) dialogForm: SmFormComponent;

  constructor(
    private svc: CommonService,
    private querySvc: QueryHospitalService,
    private sharedService: SharedService,
    private hospitalService: HospitalService,
    private dialog: MatDialog
  ) {
    this.windowWidth = window.innerWidth;
  }

  ngOnChanges(changes: SimpleChanges) {}

  treatingDoctorUserType = treatingDoctorUserType;

  recordingData = [];
  isDataLoading = true;
  getAllRecordingByDoctor() {
    this.isDataLoading = true;
    this.hospitalService.getAllRecordingByDoctor(this.queryData?._id).subscribe(
      (res: any) => {
        this.recordingData = res?.data;
        this.isDataLoading = false;
      },
      () => {
        this.isDataLoading = false;
      }
    );
  }

  ngOnInit(): void {
    if (this.decodedToken.userType === "treating doctor") {
      this.tabs = this.querySvc.tabsForTratingDoctor;
      this.queryButtons = this.querySvc.queryButtonsForTreatingDoctor;
    } else {
      this.tabs = this.querySvc.tabs;
      this.queryButtons = this.querySvc.queryButtons;
    }
    this.changeExpansionMode("isDetails");
    this.getAllRecordingByDoctor();
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
    return name !== "Assign" && name !== "Forward to doctor";
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
