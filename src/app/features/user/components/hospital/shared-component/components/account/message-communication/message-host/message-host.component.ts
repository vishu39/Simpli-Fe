import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddMessageHostComponent } from "./components/add-message-host/add-message-host.component";
import { SubjectService } from "src/app/core/service/subject/subject.service";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "shared-message-host",
  templateUrl: "./message-host.component.html",
  styleUrls: ["./message-host.component.scss"],
})
export class MessageHostComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "messageId",
    "accessToken",
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
    private subjectService: SubjectService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllMessageSetting();
  }

  emailFetchSettingData = new MatTableDataSource<any>([]);
  totalElement: number;
  isDataLoading: boolean = true;
  getAllMessageSetting() {
    this.emailFetchSettingData.data = [];
    this.isDataLoading = true;
    this.hospitalService.getAllMessageSetting(this.emailFetchParams).subscribe(
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
      this.getAllMessageSetting();
    }, 600);
  }

  onPaginateChange(value) {
    this.emailFetchParams.limit = value.pageSize;
    this.emailFetchParams.page = value.pageIndex + 1;
    this.getAllMessageSetting();
  }

  openModalForAdd(heading: any) {
    const dialogRef = this.dialog.open(AddMessageHostComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllMessageSetting();
      }
    });
  }

  openModalForEdit(heading: any, item: any) {
    const dialogRef = this.dialog.open(AddMessageHostComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.emailFetchData = item;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllMessageSetting();
      }
    });
  }

  deleteRecord(id: any) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.hospitalService
            .deleteMessageSetting(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.subjectService.messageCommunicationChangedSubjectForHospital.next(
                {
                  isChanged: true,
                }
              );
              this.getAllMessageSetting();
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
