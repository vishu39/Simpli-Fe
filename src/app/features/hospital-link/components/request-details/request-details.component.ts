import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { RecordOpinionComponent } from "../treating-doctor/record-opinion/record-opinion.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-request-details",
  templateUrl: "./request-details.component.html",
  styleUrls: ["./request-details.component.scss"],
})
export class RequestDetailsComponent implements OnInit {
  @Input() patientData: any;
  @Input() requestData: any;
  @Input() type = "";
  @Input() decodedToken: any;
  @Output("patchForm") patchForm: EventEmitter<any> = new EventEmitter();
  @Output("refetch") refetch: EventEmitter<any> = new EventEmitter();

  isOpenTopDetails: boolean = true;
  // isDetails: boolean = true;
  isTabs: boolean = false;
  tabs = [
    {
      name: "Medical History",
      value: "medicalHistory",
    },
    {
      name: "Reports",
      value: "reports",
    },
  ];

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.changeExpansionMode("details");
    if (this.type === "opinion") {
      let additionalTabs = [
        {
          name: "Opinion Request",
          value: "opinionRequest",
        },
        {
          name: "Doctor Opinion Received",
          value: "opinionReceived",
        },
        {
          name: "Doctor Opinion Pending",
          value: "opinionPending",
        },
      ];
      this.tabs.push(...additionalTabs);

      this.isTabs = false;
      this.isOpenTopDetails = true;
    }
    if (this.type === "opd") {
      let additionalTabs = [
        {
          name: "OPD Request",
          value: "opdRequest",
        },
      ];
      this.tabs.push(...additionalTabs);
    }
    if (this.type === "vil") {
      let additionalTabs = [
        {
          name: "VIL Request",
          value: "vilRequest",
        },
      ];
      this.tabs.push(...additionalTabs);
    }
    if (this.type === "proforma") {
      let additionalTabs = [
        {
          name: "Proforma Invoice",
          value: "proformaInvoce",
        },
      ];
      this.tabs.push(...additionalTabs);
    }
    if (this.type === "confirmation") {
      let additionalTabs = [
        {
          name: "Patient Confirmation",
          value: "patientConfirmation",
        },
      ];
      this.tabs.push(...additionalTabs);
    }

    if (
      !!this.decodedToken?.customerType &&
      this.decodedToken?.customerType === "hospital"
    ) {
      this.tabs.splice(0, 1);
      let additionalTabs = [
        {
          name: "Opinion Pending",
          value: "opinionPendingDoc",
        },
        {
          name: "Opinion Added",
          value: "opinionAddedDoc",
        },
      ];
      this.tabs.push(...additionalTabs);
    }
  }

  patchOpinionForm(item: any) {
    this.patchForm.emit(item);
  }

  openRecordModal() {
    const dialogRef = this.dialog.open(RecordOpinionComponent, {
      width: "60%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Record Opinion";
    dialogRef.componentInstance.patientData = this.patientData;
    dialogRef.componentInstance.requestData = this.requestData;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.refetch.emit();
      }
    });
  }

  openedExpansion: string;

  changeExpansionMode(name: string) {
    if (this.openedExpansion !== name) this.openedExpansion = name;
    else this.openedExpansion = "";
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["/hospital/hospital-login"]);
  }
}
