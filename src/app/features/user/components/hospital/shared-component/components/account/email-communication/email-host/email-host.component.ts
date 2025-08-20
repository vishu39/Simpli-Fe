import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddEmailHostForCommunicationComponent } from "./component/add-email-host-for-communication/add-email-host-for-communication.component";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "app-shared-email-host",
  templateUrl: "./email-host.component.html",
  styleUrls: ["./email-host.component.scss"],
})
export class EmailHostComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "emailId",
    "password",
    "emailHost",
    "type",
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
    private hospitalService: HospitalService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllEmailSetting();
  }

  emailFetchSettingData = new MatTableDataSource<any>([]);
  totalElement: number;
  isDataLoading: boolean = true;
  getAllEmailSetting() {
    this.emailFetchSettingData.data = [];
    this.isDataLoading = true;
    this.hospitalService.getAllEmailSetting(this.emailFetchParams).subscribe(
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
      this.getAllEmailSetting();
    }, 600);
  }

  onPaginateChange(value) {
    this.emailFetchParams.limit = value.pageSize;
    this.emailFetchParams.page = value.pageIndex + 1;
    this.getAllEmailSetting();
  }

  openModalForAdd(heading: any) {
    const dialogRef = this.dialog.open(AddEmailHostForCommunicationComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllEmailSetting();
      }
    });
  }

  openModalForEdit(heading: any, item: any) {
    const dialogRef = this.dialog.open(AddEmailHostForCommunicationComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.emailFetchData = item;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllEmailSetting();
      }
    });
  }

  deleteRecord(id: any) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.hospitalService.deleteEmailSetting(id).subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.sharedService.emailCommunicationChangedSubjectForHospital.next(
              {
                isChanged: true,
              }
            );
            this.getAllEmailSetting();
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
