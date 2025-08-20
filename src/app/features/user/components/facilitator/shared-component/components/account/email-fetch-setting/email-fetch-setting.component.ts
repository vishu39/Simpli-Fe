import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddEmailFetchSettingComponent } from "./component/add-email-fetch-setting/add-email-fetch-setting.component";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "shared-email-fetch-setting",
  templateUrl: "./email-fetch-setting.component.html",
  styleUrls: ["./email-fetch-setting.component.scss"],
})
export class EmailFetchSettingComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "emailId",
    "password",
    "emailHost",
    "smtpEmailHost",
    "internalUser",
    "action",
  ];

  emailFetchParams: any = {
    limit: 10,
    page: 1,
    search: "",
  };
  timeout = null;

  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllEmailFetchSetting();
  }

  emailFetchSettingData = new MatTableDataSource<any>([]);
  totalElement: number;
  isDataLoading: boolean = true;
  getAllEmailFetchSetting() {
    this.emailFetchSettingData.data = [];
    this.isDataLoading = true;
    this.facilitatorService
      .getAllEmailFetchSetting(this.emailFetchParams)
      .subscribe(
        (res: any) => {
          this.emailFetchSettingData.data = res.data.content;
          this.totalElement = res.data.totalElement;
          this.isDataLoading = false;
        },
        () => {
          this.isDataLoading = false;
        }
      );
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.emailFetchParams.search = filterValue.trim();
      this.emailFetchParams.page = 1;
      this.paginator.firstPage();
      this.getAllEmailFetchSetting();
    }, 600);
  }

  onPaginateChange(value) {
    this.emailFetchParams.limit = value.pageSize;
    this.emailFetchParams.page = value.pageIndex + 1;
    this.getAllEmailFetchSetting();
  }

  openModalForAdd(heading: any) {
    const dialogRef = this.dialog.open(AddEmailFetchSettingComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllEmailFetchSetting();
      }
    });
  }

  openModalForEdit(heading: any, item: any) {
    const dialogRef = this.dialog.open(AddEmailFetchSettingComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.emailFetchData = item;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllEmailFetchSetting();
      }
    });
  }

  deleteRecord(id: any) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.facilitatorService
            .deleteEmailFetchSetting(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.getAllEmailFetchSetting();
            });
        }
      });
  }

  showInternalUserOnHover(item: any) {
    let internalUserArray = item?.internalUser;
    const eventString = internalUserArray
      .map((obj: any) => `${obj?.name} - ${obj?.userType}`)
      ?.join(", ");
    return eventString;
  }
}
