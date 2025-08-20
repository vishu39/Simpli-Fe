import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { ClosePatientDialogComponent } from "./dialog/close-patient-dialog/close-patient-dialog.component";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddPatientDialogComponent } from "./dialog/add-patient-dialog/add-patient-dialog.component";
import { MatPaginator } from "@angular/material/paginator";
import { facilitatorAdminUserType } from "src/app/core/models/role";
import { PatientFilterModalComponent } from "src/app/shared/components/dialogs/patient-filter-modal/patient-filter-modal.component";
const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "shared-patient",
  templateUrl: "./patient.component.html",
  styleUrls: ["./patient.component.scss"],
})
export class PatientComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "name",
    "gender",
    "country",
    "age",
    "treatment",
    "emailId",
    "contact",
    "action",
  ];
  patientData = new MatTableDataSource<any>([]);
  totalElement: number;
  patientParams = {
    page: 1,
    limit: 10,
    search: "",
    status: "open",
    filterObj: {},
  };
  timeout = null;

  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllPatient();
  }

  addPatient(heading: string) {
    const dialogRef = this.dialog.open(AddPatientDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllPatient();
      }
    });
  }

  editPatient(heading: string, data: any) {
    const dialogRef = this.dialog.open(AddPatientDialogComponent, {
      width: "100%",
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.getPatientById(data?._id);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllPatient();
      }
    });
  }

  closeQuery(heading: string, patientId: string) {
    const dialogRef = this.dialog.open(ClosePatientDialogComponent, {
      minWidth: "40%",
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.patientId = patientId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllPatient();
      }
    });
  }
  changeStatus(event) {
    this.patientParams.status = event.value;
    this.patientParams.page = 1;
    this.paginator.firstPage();
    this.getAllPatient();
  }
  openQuery(patientId: string) {
    this.facilitatorService
      .openPatientQuery(patientId)
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.getAllPatient();
      });
  }

  isDataLoading: boolean = true;
  getAllPatient() {
    this.patientData.data = [];
    this.isDataLoading = true;
    this.facilitatorService.getAllPatient(this.patientParams).subscribe(
      (res: any) => {
        this.patientData.data = res.data.content;
        this.totalElement = res.data.totalElement;
        if (this.patientParams.status === "close") {
          this.displayedColumns = [
            "createdAt",
            "name",
            "gender",
            "country",
            "age",
            "treatment",
            "emailId",
            "contact",
            "closedDate",
            "closedReason",
            "action",
          ];
        } else {
          this.displayedColumns = [
            "createdAt",
            "name",
            "gender",
            "country",
            "age",
            "treatment",
            "emailId",
            "contact",
            "action",
          ];
        }
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  onPaginateChange(value) {
    this.patientParams.limit = value.pageSize;
    this.patientParams.page = value.pageIndex + 1;
    this.getAllPatient();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.patientParams.search = filterValue.trim();
      this.patientParams.page = 1;
      this.paginator.firstPage();
      this.getAllPatient();
    }, 600);
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
            this.getAllPatient();
          });
        }
      });
  }

  tokenData: any = this.sharedService.decodeToken();

  showFilterArray = [
    facilitatorAdminUserType.branchOffice,
    facilitatorAdminUserType.employee,
    "admin",
  ];
  selectedFilter: any = {};
  isFilterActive = false;

  openFilterModal() {
    // if (this.showFilterArray?.includes(this.tokenData?.userType)) {
      const dialogRef = this.dialog.open(PatientFilterModalComponent, {
        width: "70%",
        disableClose: true,
        autoFocus: false,
      });

      dialogRef.componentInstance.dialogTitle = "Filter Patient";
      dialogRef.componentInstance.selectedFilters = this.selectedFilter;

      dialogRef.afterClosed().subscribe((result) => {
        const { apiCall, filterData } = result;
        if (apiCall) {
          if (
            filterData?.treatment?.length > 0 ||
            filterData?.country?.length > 0 ||
            filterData?.age ||
            filterData?.gender?.length > 0
          ) {
            this.isFilterActive = true;
            this.selectedFilter = filterData;
            let filterObj = {};
            if (filterData?.country?.length > 0) {
              filterObj["country"] = filterData?.country;
            }
            if (filterData?.treatment) {
              filterObj["treatment"] = filterData?.treatment;
            }
            if (filterData?.age) {
              filterObj["age"] = filterData?.age;
            }
            if (filterData?.gender?.length > 0) {
              filterObj["gender"] = filterData?.gender;
            }

            this.patientParams.filterObj = filterObj;
            this.patientParams.page = 1;
            this.paginator.firstPage();
            this.patientData.data = [];
            this.getAllPatient();
          } else {
            this.isFilterActive = false;
            this.selectedFilter = filterData;
            this.patientParams.filterObj = {};
            this.patientParams.page = 1;
            this.paginator.firstPage();
            this.patientData.data = [];
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
