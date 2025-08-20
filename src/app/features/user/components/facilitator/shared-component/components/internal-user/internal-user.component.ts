import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { ClipboardService } from "ngx-clipboard";
import { InternalUserDialogComponent } from "./dialog/internal-user-dialog/internal-user-dialog.component";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { MatPaginator } from "@angular/material/paginator";
import { InternalUserFilterModalComponent } from "src/app/shared/components/dialogs/internal-user-filter-modal/internal-user-filter-modal.component";
const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "shared-internal-user",
  templateUrl: "./internal-user.component.html",
  styleUrls: ["./internal-user.component.scss"],
})
export class InternalUserComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "emailId",
    "role",
    "userType",
    "actions",
  ];
  internalUserData = new MatTableDataSource<any>([]);
  totalElement: number;
  isDataLoading: boolean = true;
  internalUserDataDetails = {
    page: "1",
    limit: "10",
    search: "",
    filterObj: {},
  };
  timeout = null;

  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private _clipboardService: ClipboardService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllRole();
    this.getAllInternalUser();
  }

  roleData: any;
  getAllRole() {
    this.facilitatorService.getAllRole().subscribe((res: any) => {
      this.roleData = res.data;
      console.log(this.roleData);
    });
  }

  addInternalUser(heading: string) {
    const dialogRef = this.dialog.open(InternalUserDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllInternalUser();
      }
    });
  }
  editInternalUser(heading: string, data: any) {
    const dialogRef = this.dialog.open(InternalUserDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(data);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllInternalUser();
      }
    });
  }
  getAllInternalUser() {
    this.internalUserData.data = [];
    this.isDataLoading = true;
    this.facilitatorService
      .getAllInternalUser(this.internalUserDataDetails)
      .subscribe(
        (res: any) => {
          this.internalUserData.data = res.data.content;
          this.totalElement = res.data.totalElement;
          this.isDataLoading = false;
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  onPaginateChange(value) {
    this.internalUserDataDetails.limit = value.pageSize;
    this.internalUserDataDetails.page = value.pageIndex + 1;
    this.getAllInternalUser();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.internalUserDataDetails.search = filterValue.trim();
      this.internalUserDataDetails.page = "1";
      this.paginator.firstPage();
      this.getAllInternalUser();
    }, 600);
  }
  deleteRecord(id: any) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.facilitatorService
            .deleteInternalUser(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.getAllInternalUser();
            });
        }
      });
  }

  isFilterSelected = false;
  selectedFilters: any = {};
  openFilterModal() {
    const dialogRef = this.dialog.open(InternalUserFilterModalComponent, {
      width: "40%",
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.componentInstance.dialogTitle = "Internal User Filter";
    dialogRef.componentInstance.selectedFilters = this.selectedFilters;

    dialogRef.afterClosed().subscribe((result) => {
      const { apiCall, filterData, type } = result;

      if (type === "reset") {
        this.isFilterSelected = false;
        this.internalUserDataDetails.page = "1";
        this.internalUserDataDetails.filterObj = {};
        this.paginator.firstPage();
        this.getAllInternalUser();
      }

      if (apiCall) {
        this.selectedFilters = filterData;
        const { role, userType } = filterData;
        if (role?.length > 0 || userType?.length > 0) {
          this.isFilterSelected = true;
          this.internalUserDataDetails.page = "1";
          let filterObj = {};
          if (role?.length > 0) {
            filterObj["role"] = this.filterRoleArray(role);
          }
          if (userType) {
            filterObj["userType"] = userType;
          }

          this.internalUserDataDetails.filterObj = filterObj;

          this.paginator.firstPage();
          this.getAllInternalUser();
        }
      }
    });
  }

  filterRoleArray(array: any) {
    let newArray = [];
    if (array?.length) {
      array.forEach((e) => {
        newArray.push(e?._id);
      });
    }
    return newArray;
  }
}
