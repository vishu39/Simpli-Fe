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
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { OperationEntriesService } from "./operation-entries.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { SmFormComponent } from "src/app/smvt-framework/sm-crud/sm-form/sm-form.component";
import { PotentialTreatmentModalComponent } from "src/app/shared/components/dialogs/potential-treatment-modal/potential-treatment-modal.component";

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
  // queryButtons = this.opEntService.queryButtons;
  queryButtons: any;
  decodedToken: any = this.sharedService.decodeToken();

  @Output("queryEvent") queryEvent: EventEmitter<any> = new EventEmitter();
  @Input() queryData: any;
  @ViewChild(SmFormComponent) dialogForm: SmFormComponent;

  constructor(
    private svc: CommonService,
    private opEntService: OperationEntriesService,
    private sharedService: SharedService,
    private hospitalService: HospitalService,
    private dialog: MatDialog
  ) {
    this.windowWidth = window.innerWidth;
  }

  ngOnChanges(changes: SimpleChanges) {}

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
    // if (this.decodedToken.userType === "treating doctor") {
    //   this.tabs = this.opEntService.tabsForTratingDoctor;
    //   this.queryButtons = this.opEntService.queryButtonsForTreatingDoctor;
    // } else {
    this.tabs = this.opEntService.tabs;
    this.queryButtons = this.opEntService.queryButtons;
    // }
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

  openedExpansion: string;

  changeExpansionMode(name: string) {
    if (this.openedExpansion !== name) this.openedExpansion = name;
    else this.openedExpansion = "";
  }
}
