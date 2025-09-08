import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-finance-logs",
  templateUrl: "./finance-logs.component.html",
  styleUrls: ["./finance-logs.component.scss"],
})
export class FinanceLogsComponent implements OnInit {
  displayedColumns: string[] = ["createdAt", "userName", "message"];

  tableData = new MatTableDataSource<any>([]);
  totalElement: number;

  issuedParams: any = {
    page: 1,
    limit: 10,
    search: "",
    filterObj: {},
  };

  constructor(
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {}

  auditLogs = [
    {
      createdAt: "2025-08-26T10:15:00Z",
      userName: "Vishu",
      message: "Change in Hospital Payout Masters (Kokilaben Hospital)",
      bgColor: "#E3F2FD",
      color: "#1565C0",
    },
    {
      createdAt: "2025-08-26T11:00:00Z",
      userName: "Dhruv",
      message: "Add in Company Master (Apollo Hospital)",
      bgColor: "#F1F8E9",
      color: "#2E7D32",
    },
    {
      createdAt: "2025-08-26T11:45:00Z",
      userName: "Saurabh Shah",
      message: "Change in Partner Payout Masters (Fortis Hospital)",
      bgColor: "#FFF3E0",
      color: "#EF6C00",
    },
    {
      createdAt: "2025-08-26T12:30:00Z",
      userName: "Mihir Vohra",
      message: "Add in Sales Incentive Master (AIIMS Delhi)",
      bgColor: "#FCE4EC",
      color: "#AD1457",
    },
    {
      createdAt: "2025-08-26T13:10:00Z",
      userName: "Jeet Bhat",
      message: "Change in Generation of Invoice (Jaslok Hospital)",
      bgColor: "#E8F5E9",
      color: "#1B5E20",
    },
    {
      createdAt: "2025-08-26T13:45:00Z",
      userName: "Vishu",
      message: "Add in Approval of Invoice (Lilavati Hospital)",
      bgColor: "#EDE7F6",
      color: "#4527A0",
    },
    {
      createdAt: "2025-08-26T14:15:00Z",
      userName: "Dhruv",
      message: "Change in Hospital Payout Masters (Fortis Hospital)",
      bgColor: "#FFF8E1",
      color: "#F57F17",
    },
    {
      createdAt: "2025-08-26T15:00:00Z",
      userName: "Saurabh Shah",
      message: "Add in Company Master (AIIMS Delhi)",
      bgColor: "#F3E5F5",
      color: "#6A1B9A",
    },
    {
      createdAt: "2025-08-26T15:30:00Z",
      userName: "Mihir Vohra",
      message: "Change in Partner Payout Masters (Kokilaben Hospital)",
      bgColor: "#E0F2F1",
      color: "#00695C",
    },
    {
      createdAt: "2025-08-26T16:00:00Z",
      userName: "Jeet Bhat",
      message: "Add in Sales Incentive Master (Apollo Hospital)",
      bgColor: "#FFFDE7",
      color: "#F9A825",
    },
  ];

  ngOnInit(): void {
    this.getAllIssuedVil();
  }

  isDataLoading: boolean = false;
  getAllIssuedVil() {
    this.tableData.data = this.auditLogs;
    //  this.tableData.data = [];
    //  this.isDataLoading = true;
    //  this.facilitatorService
    //    .getAllIssuedVil(this.issuedParams)
    //    .subscribe((res: any) => {
    //      this.totalElement = res?.data?.totalElement;
    //      this.tableData.data = res?.data?.content;
    //      this.isDataLoading = false;
    //    });
  }

  onPaginateChange(value) {
    this.issuedParams.limit = value.pageSize;
    this.issuedParams.page = value.pageIndex + 1;
    this.getAllIssuedVil();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  timeout = null;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.issuedParams.search = filterValue.trim();
      this.issuedParams.page = 1;
      this.paginator.firstPage();
      this.getAllIssuedVil();
    }, 600);
  }

  //  onClickDownload(data: any) {
  //    this.sharedService.getS3Object({ key: data?.key }).subscribe((res: any) => {
  //      window.open(res?.data, "_blank");
  //    });
  //  }

  isFilterSelected = false;
  selectedFilters: any = {};
  openFilterModal() {
    //  const dialogRef = this.dialog.open(IssuedVilFilterModalComponent, {
    //    width: "40%",
    //    disableClose: true,
    //    autoFocus: false,
    //  });
    //  dialogRef.componentInstance.dialogTitle = "Issued VIL Filter";
    //  dialogRef.componentInstance.selectedFilters = this.selectedFilters;
    //  dialogRef.afterClosed().subscribe((result) => {
    //    const { apiCall, filterData, type } = result;
    //    if (type === "reset") {
    //      this.isFilterSelected = false;
    //      this.issuedParams.page = "1";
    //      this.issuedParams.filterObj = {};
    //      this.paginator.firstPage();
    //      this.getAllIssuedVil();
    //    }
    //    if (apiCall) {
    //      this.selectedFilters = filterData;
    //      const { hospital, userType, treatment, country, userName } = filterData;
    //      if (
    //        hospital?.length > 0 ||
    //        country?.length > 0 ||
    //        treatment?.length > 0 ||
    //        userType?.length > 0 ||
    //        userName?.length > 0
    //      ) {
    //        this.isFilterSelected = true;
    //        this.issuedParams.page = "1";
    //        let filterObj = {};
    //        if (hospital?.length > 0) {
    //          filterObj["hospital"] = this.filterIdArray(hospital);
    //        }
    //        if (userName?.length > 0) {
    //          filterObj["userName"] = this.filterIdArray(userName || []);
    //        }
    //        if (userType?.length > 0) {
    //          filterObj["vilUserType"] = userType;
    //        }
    //        if (country) {
    //          filterObj["country"] = country;
    //        }
    //        if (treatment) {
    //          filterObj["treatment"] = treatment;
    //        }
    //        this.issuedParams.filterObj = filterObj;
    //        this.paginator.firstPage();
    //        this.getAllIssuedVil();
    //      }
    //    }
    //  });
  }

  //  returnNameArray(array: any) {
  //    let nameArray = [];
  //    if (array?.length > 0) {
  //      array?.forEach((a: any) => {
  //        nameArray.push(a?.name);
  //      });
  //    }
  //    return nameArray;
  //  }

  //  filterIdArray(array: any) {
  //    let newArray = [];
  //    if (array?.length) {
  //      array.forEach((e) => {
  //        newArray.push(e?._id);
  //      });
  //    }
  //    return newArray;
  //  }
}
