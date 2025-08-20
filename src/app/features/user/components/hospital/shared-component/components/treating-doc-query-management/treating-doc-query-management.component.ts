import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SMToolBar } from "src/app/smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddPatientDialogComponent } from "../patient/dialog/add-patient-dialog/add-patient-dialog.component";
import { RecordOpinionComponent } from "./components/record-opinion/record-opinion.component";
import { ForwardToDoctorComponent } from "./components/forward-to-doctor/forward-to-doctor.component";
import { TreatmentDocAddDetailComponent } from "./components/treatment-doc-add-detail/treatment-doc-add-detail.component";
import { QueryManagementFilterDialogComponent } from "src/app/shared/components/query-management/component/query-management-filter-dialog/query-management-filter-dialog.component";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "app-treating-doc-query-management",
  templateUrl: "./treating-doc-query-management.component.html",
  styleUrls: ["./treating-doc-query-management.component.scss"],
})
export class TreatingDocQueryManagementComponent implements OnInit {
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
    private hospitalService: HospitalService,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
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

    this.getAllPatient();
    this.getAccountDetailsAttribute();
  }

  queryEventHandler(data: any) {
    if (data.mode === "Record") {
      this.recordAddOpinion();
    }

    if (data?.mode === "Add") {
      this.openAddDetailsModal();
    }
  }

  recordAddOpinion() {
    const dialogRef = this.dialog.open(RecordOpinionComponent, {
      width: "60%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Record Opinion";
    dialogRef.componentInstance.patientData = this.queryData;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.patientParams.page = 1;
        this.patientList = [];
        this.getAllPatient();
        this.selectedQuery({ _id: this.queryData?._id });
      }
    });
  }

  openAddDetailsModal() {
    const dialogRef = this.dialog.open(TreatmentDocAddDetailComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Add Details";
    dialogRef.componentInstance.patientData = this.queryData;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.patientParams.page = 1;
        this.patientList = [];
        this.getAllPatient();
        this.selectedQuery({ _id: this.queryData?._id });
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

    this.hospitalService.getAllPatient(this.patientParams).subscribe(
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
    this.hospitalService.getAccountDetailsAttribute().subscribe((res: any) => {
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
      this.hospitalService.getPatient(data?.id || data?._id).subscribe(
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

      dialogRef.componentInstance.openedComponent = "hospital";

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
