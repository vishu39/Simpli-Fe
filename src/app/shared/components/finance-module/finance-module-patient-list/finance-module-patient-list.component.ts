import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { SharedTimlimeComponent } from "../../shared-timlime/shared-timlime.component";
import { treatingDoctorUserType } from "src/app/core/models/role";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "global-shared-finance-module-patient-list",
  templateUrl: "./finance-module-patient-list.component.html",
  styleUrls: ["./finance-module-patient-list.component.scss"],
})
export class FinanceModulePatientListComponent implements OnInit {
  @Input() patientList: any;
  @Input() uhidCode: string;
  @Input() isLoadingPatient: boolean;
  @Output("selectedQuery") selectedQuery: EventEmitter<any> =
    new EventEmitter();
  @Input() selectedQueryId: number;
  userDetails: any;

  constructor(private sharedService: SharedService, private dialog: MatDialog) {
    this.userDetails = sharedService.decodeToken();
  }

  treatingDoctorUserType = treatingDoctorUserType;

  createdAt: Date | string = new Date().toISOString();
  isDetails: any = true;
  specificExpantionIsOpen = [];

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (this.specificExpantionIsOpen?.length !== this.patientList?.length) {
      this.patientList.forEach((patient: any, index: number) => {
        this.specificExpantionIsOpen[index] = true;
      });
    }
  }

  isOpen(i: number) {
    this.specificExpantionIsOpen[i] = !this.specificExpantionIsOpen[i];
  }

  emitSelectedEvent($event: HTMLButtonElement, id: number) {
    let data = { $event, id };
    this.selectedQuery.emit(data);
  }

  openHistoryModal(list: any) {
    const dialogRef = this.dialog.open(SharedTimlimeComponent, {
      width: "100%",
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Patient History";
    dialogRef.componentInstance.patientId = list?._id;
    dialogRef.componentInstance.component = "hospital";
  }
}
