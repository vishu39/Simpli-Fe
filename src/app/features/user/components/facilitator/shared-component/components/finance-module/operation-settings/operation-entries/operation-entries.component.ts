import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddHospitalUhidComponent } from "src/app/features/user/components/facilitator/shared-component/components/finance-module/operation-settings/operation-entries/components/add-hospital-uhid/add-hospital-uhid.component";
import { AdmissionDischargeTrackerComponent } from "src/app/features/user/components/facilitator/shared-component/components/finance-module/operation-settings/operation-entries/components/admission-discharge-tracker/admission-discharge-tracker.component";
import { UploadBillingDocComponent } from "src/app/features/user/components/facilitator/shared-component/components/finance-module/operation-settings/operation-entries/components/upload-billing-doc/upload-billing-doc.component";
import { UploadEstimatesComponent } from "src/app/features/user/components/facilitator/shared-component/components/finance-module/operation-settings/operation-entries/components/upload-estimates/upload-estimates.component";
import { UploadFinalBillComponent } from "src/app/features/user/components/facilitator/shared-component/components/finance-module/operation-settings/operation-entries/components/upload-final-bill/upload-final-bill.component";
import { SMToolBar } from "src/app/smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddPatientDepositComponent } from "./components/add-patient-deposit/add-patient-deposit.component";

@Component({
  selector: "shared-operation-entries",
  templateUrl: "./operation-entries.component.html",
  styleUrls: ["./operation-entries.component.scss"],
})
export class OperationEntriesComponent implements OnInit {
  patientList: any = [];
  totalElement: number;
  patientParams = {
    page: 1,
    limit: 20,
    search: "",
    status: "open",
    filterObj: {},
    // user: [],
    // treatment: [],
    // currentStatus: [],
    // country: [],
    // referralPartner: [],
    // gender: "",
    // age: "",
  };
  uhidCode: string;
  isLoadingPatient: boolean = false;
  pageBeforeScrollDown = 1;
  timeoutPatient = null;
  selectedQueryID: string;
  queryData: any = undefined;
  queryLoading: boolean = true;
  selectedQueryId: number;

  direction: boolean = true;
  arrow: string;
  constructor(
    public svc: CommonService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllPatient();
    this.getAccountDetailsAttribute();
  }

  toolbarConfig: SMToolBar = {
    title: "Query Management",
    button: [
      { name: "Add Patient", icon: "add", color: "gray", mode: "Create" },
      { name: "Filter", icon: "filter_list", color: "gray", mode: "Filter" },
      { name: "Refresh", icon: "refresh", color: "gray", mode: "Refresh" },
    ],
    filterConfig: {
      cols: 6,
      rows: 6,
      fields: [
        { name: "name", label: "Name", type: "text" },
        { name: "role.roleName", label: "Role Name", type: "text" },
        {
          name: "gender",
          label: "Select Gender",
          type: "custom-list",
          list$: this.demoList.bind(this),
        },
      ],
    },
  };
  demoList() {}

  dialogButtonConfig = [
    { name: "NO", color: "warn" },
    { name: "YES", color: "primary" },
  ];

  queryEventHandler(data: any) {
    if (data?.mode === "Final Billing Upload") {
      this.uploadFinalBill();
    }
    if (data?.mode === "Admission / Discharge Tracker") {
      this.admissionDischargeTracker();
    }
    if (data?.mode === "Upload Estimates") {
      this.uploadEstimates();
    }
    if (data?.mode === "Patient Deposit") {
      this.addPatientDeposit();
    }
    if (data?.mode === "Upload Bill Docs") {
      this.uploadBillDoc();
    }
    if (data?.mode === "Add Hospital UHID") {
      this.addHospitalUhid();
    }
  }

  addHospitalUhid() {
    const dialogRef = this.dialog.open(AddHospitalUhidComponent, {
      width: "50%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Add Hospital UHID";
    dialogRef.componentInstance.patientData = this.queryData;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
      }
    });
  }

  admissionDischargeTracker() {
    const dialogRef = this.dialog.open(AdmissionDischargeTrackerComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Admission / Discharge Tracker";
    dialogRef.componentInstance.patientData = this.queryData;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
      }
    });
  }

  uploadBillDoc() {
    const dialogRef = this.dialog.open(UploadBillingDocComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Upload Billing Doc";
    dialogRef.componentInstance.patientData = this.queryData;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
      }
    });
  }

  uploadEstimates() {
    const dialogRef = this.dialog.open(UploadEstimatesComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Upload Estimates";
    dialogRef.componentInstance.patientData = this.queryData;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
      }
    });
  }

  uploadFinalBill() {
    const dialogRef = this.dialog.open(UploadFinalBillComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Final Bill Upload";
    dialogRef.componentInstance.patientData = this.queryData;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
      }
    });
  }

  addPatientDeposit() {
    const dialogRef = this.dialog.open(AddPatientDepositComponent, {
      width: "80%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Add Patient Deposit";
    dialogRef.componentInstance.patientData = this.queryData;
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall == true) {
      }
    });
  }

  searchEventHandler(searchText: string) {
    this.patientParams.search = searchText.trim();
    this.patientParams.page = 1;
    this.patientList = [];
    this.getAllPatient();
  }

  getAllPatient() {
    if (this.isLoadingPatient) {
      return;
    }
    this.isLoadingPatient = true;

    this.facilitatorService.getAllPatient(this.patientParams).subscribe(
      (res: any) => {
        this.totalElement = res?.data?.totalElement;
        this.patientList.push(...res.data.content);
        this.pageBeforeScrollDown = this.patientParams.page;
        this.patientParams.page = this.patientParams.page + 1;
        if (this.queryData === undefined && this.patientList?.length) {
          this.selectedQuery({ id: this.patientList[0]?._id });
        } else {
          this.queryLoading = false;
        }
        if (!this.patientList?.length) {
          this.queryData = undefined;
        }
        this.isLoadingPatient = false;
      },
      (err) => {
        this.isLoadingPatient = false;
      }
    );
  }
  getAccountDetailsAttribute() {
    this.facilitatorService
      .getAccountDetailsAttribute()
      .subscribe((res: any) => {
        this.uhidCode = res?.data?.uhidCode;
      });
  }
  onInfiniteScrollPatient(): void {
    if (this.patientList.length < this.totalElement) {
      this.getAllPatient();
    }
  }

  searchTreatment(filterValue: string) {
    clearTimeout(this.timeoutPatient);
    this.timeoutPatient = setTimeout(() => {
      this.patientParams.search = filterValue.trim();
      this.patientParams.page = 1;
      this.patientList = [];
      this.isLoadingPatient = false;
      this.getAllPatient();
    }, 600);
  }

  selectedQuery(data: any, type = "") {
    if (data?._id || data?.id !== this.selectedQueryId) {
      this.selectedQueryId = data?.id || data?._id;
      this.queryLoading = true;
      this.facilitatorService.getPatient(data?.id || data?._id).subscribe(
        (res: any) => {
          this.queryData = res?.data;
          this.sharedService.queryDetailSubject.next(res?.data);
          this.queryLoading = false;

          if (type === "assignedDialogClosed") {
            let index = this.patientList?.findIndex(
              (patient: any) => patient?._id === res?.data?._id
            );
            this.patientList[index] = res?.data;
          }
        },
        (err) => {
          this.queryLoading = false;
        }
      );
    }
  }
}
