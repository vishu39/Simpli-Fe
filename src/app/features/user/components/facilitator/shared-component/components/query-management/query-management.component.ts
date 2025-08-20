import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SMToolBar } from "src/app/smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddPatientDialogComponent } from "../patient/dialog/add-patient-dialog/add-patient-dialog.component";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddHospitalDialogComponent } from "./dialog/add-hospital-dialog/add-hospital-dialog.component";
import { AddDetailsDialogComponent } from "./dialog/add-details-dialog/add-details-dialog.component";
import { EmailSentDialogComponent } from "./dialog/email-sent-dialog/email-sent-dialog.component";
import { DowloadDetailsDialogComponent } from "./dialog/dowload-details-dialog/dowload-details-dialog.component";
import { QueryManagementFilterDialogComponent } from "src/app/shared/components/query-management/component/query-management-filter-dialog/query-management-filter-dialog.component";
import { hospitalAdminUserType } from "src/app/core/models/role";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "shared-query-management",
  templateUrl: "./query-management.component.html",
  styleUrls: ["./query-management.component.scss"],
})
export class QueryManagementComponent implements OnInit {
  patientList: any = [];
  totalElement: number;
  patientParams = {
    page: 1,
    limit: 20,
    search: "",
    status: "open",
    filterObj: {},
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
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this.showFilterArray?.includes(this.tokenData?.userType)) {
      this.selectedQueryManagementUserList = localStorage.getItem(
        "selectedQueryManagementUserList"
      );

      if (
        this.selectedQueryManagementUserList !== null &&
        this.selectedQueryManagementUserList !== undefined
      ) {
        this.selectedQueryManagementUserList = JSON.parse(
          this.selectedQueryManagementUserList
        );
        if (this.selectedQueryManagementUserList?.length > 0) {
          this.isFilterActive = true;
          this.selectedFilter = {
            user: this.selectedQueryManagementUserList,
          };

          let userIdArray = this.returnIdArray(
            this.selectedQueryManagementUserList
          );

          this.patientParams.filterObj = {
            user: userIdArray,
          };
        } else {
          this.patientParams.filterObj = {};
        }
      }
    }

    this.getAllPatient();
    this.getAccountDetailsAttribute();
  }

  returnUserIdArray(array: any) {
    let idArray = [];
    array?.forEach((a: any) => {
      idArray.push(a?._id);
    });
    return idArray;
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
    if (data.mode === "Delete") {
      this.deletePatient(data?.data?._id);
    }
    if (data?.mode === "Add_Query") {
      this.addQuery();
    }
    if (data?.mode === "Edit") {
      this.editQuery(data?.data);
    }
    if (data?.mode === "Assign") {
      this.assignHospital();
    }
    if (data?.mode === "Add") {
      this.openAddDetailsModal();
    }
    if (data?.mode === "Send") {
      this.openSendDetailsModal();
    }
    if (data?.mode === "Download") {
      this.openDownloadDetailsModal();
    }
  }

  openDownloadDetailsModal() {
    const dialogRef = this.dialog.open(DowloadDetailsDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        patient: this.queryData,
      },
    });
    dialogRef.componentInstance.dialogTitle = "Download";
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.selectedQuery(this.queryData, "assignedDialogClosed");
      }
    });
  }

  openSendDetailsModal() {
    const dialogRef = this.dialog.open(EmailSentDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        patient: this.queryData,
      },
    });
    dialogRef.componentInstance.dialogTitle = "Send to Patient/Partner";
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.selectedQuery(this.queryData, "assignedDialogClosed");
      }
    });
  }
  openAddDetailsModal() {
    const dialogRef = this.dialog.open(AddDetailsDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        patient: this.queryData,
      },
    });
    dialogRef.componentInstance.dialogTitle = "Add Details";
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.selectedQuery(this.queryData, "assignedDialogClosed");
      }
    });
  }

  assignHospital() {
    const dialogRef = this.dialog.open(AddHospitalDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        patient: this.queryData,
      },
    });
    dialogRef.componentInstance.dialogTitle = "Assign Hospital";
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.selectedQuery(this.queryData, "assignedDialogClosed");
      }
    });
  }

  addQuery() {
    const dialogRef = this.dialog.open(AddPatientDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Add Patient";

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.patientList = [];
        this.patientParams.page = 1;
        this.queryData = undefined;
        this.getAllPatient();
      }
    });
  }

  editQuery(data: any) {
    const dialogRef = this.dialog.open(AddPatientDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Edit Patient";
    dialogRef.componentInstance.onEdit(data);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.patientList = [];
        this.patientParams.page = 1;
        this.getAllPatient();
        this.selectedQuery({ _id: this.queryData?._id });
      }
    });
  }

  deletePatient(id: string) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.facilitatorService.deletePatient(id).subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.patientList = [];
            this.patientParams.page = 1;
            this.queryData = undefined;
            this.getAllPatient();
          });
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

  tokenData: any = this.sharedService.decodeToken();

  showFilterArray = [
    hospitalAdminUserType.branchOffice,
    hospitalAdminUserType.employee,
    "admin",
  ];

  selectedQueryManagementUserList: any = [];

  selectedFilter: any = {};
  isFilterActive = false;
  openFilterModal() {
    // if (this.showFilterArray?.includes(this.tokenData?.userType)) {
      const dialogRef = this.dialog.open(QueryManagementFilterDialogComponent, {
        width: "70%",
        disableClose: true,
        autoFocus: false,
      });

      dialogRef.componentInstance.openedComponent = "facilitator";

      dialogRef.componentInstance.selectedFilter = this.selectedFilter;

      dialogRef.afterClosed().subscribe((result) => {
        const { apiCall, filteredData } = result;

        if (apiCall) {
          const {
            user,
            age,
            treatment,
            country,
            gender,
            referralPartner,
            currentStatus,
          } = filteredData;

          if (
            user?.length > 0 ||
            treatment?.length > 0 ||
            country?.length > 0 ||
            referralPartner?.length > 0 ||
            currentStatus?.length > 0 ||
            age ||
            gender?.length > 0
          ) {
            this.isFilterActive = true;
            this.selectedFilter = filteredData;

            localStorage.setItem(
              "selectedQueryManagementUserList",
              JSON.stringify(user)
            );

            this.selectedQueryManagementUserList = user;
            let userIdArray = this.returnIdArray(
              this.selectedQueryManagementUserList
            );

            let filterObj = {};
            if (userIdArray?.length > 0) {
              filterObj["user"] = userIdArray;
            }
            if (country?.length > 0) {
              filterObj["country"] = country;
            }
            if (treatment?.length > 0) {
              filterObj["treatment"] = treatment;
            }
            if (currentStatus?.length > 0) {
              filterObj["currentStatus"] = currentStatus;
            }
            if (referralPartner?.length > 0) {
              filterObj["referralPartner"] =
                this.returnIdArray(referralPartner);
            }
            if (age) {
              filterObj["age"] = age;
            }
            if (gender?.length > 0) {
              filterObj["gender"] = gender;
            }

            this.patientParams.filterObj = filterObj;

            this.patientParams.page = 1;
            this.patientList = [];
            this.queryData = undefined;
            this.selectedQueryId = null;
            this.getAllPatient();
          } else {
            this.isFilterActive = false;
            this.selectedFilter = filteredData;

            localStorage.setItem(
              "selectedQueryManagementUserList",
              JSON.stringify([])
            );
            this.selectedQueryManagementUserList = user;
            this.patientParams.filterObj = {};
            this.patientParams.page = 1;
            this.patientList = [];
            this.queryData = undefined;
            this.selectedQueryId = null;
            this.getAllPatient();
          }
        }
      });
    // }
  }

  returnIdArray(array: any) {
    let idArray = [];
    array?.forEach((a: any) => {
      idArray.push(a?._id);
    });
    return idArray;
  }
}
