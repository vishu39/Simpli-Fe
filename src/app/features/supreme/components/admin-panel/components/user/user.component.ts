import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { UserDialogComponent } from "./dialog/user-dialog/user-dialog.component";
const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "userName",
    "emailId",
    "role",
    "blocked",
    "actions",
  ];
  userData = new MatTableDataSource<any>([]);
  totalElement: number;
  userDataDetails = {
    page: 1,
    limit: 10,
    search: "",
  };
  timeout = null;

  constructor(
    private supremeService: SupremeService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllUser();
  }
  addUser(heading: string) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllUser();
      }
    });
  }
  editUser(heading: string, data: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(data);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllUser();
      }
    });
  }

  isDataLoading = true;
  getAllUser() {
    this.userData.data = [];
    this.isDataLoading = true;
    this.supremeService.getAllUser(this.userDataDetails).subscribe(
      (res: any) => {
        this.userData.data = res.data.content;
        this.totalElement = res.data.totalElement;
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  onPaginateChange(value) {
    this.userDataDetails.limit = value.pageSize;
    this.userDataDetails.page = value.pageIndex + 1;
    this.getAllUser();
  }

  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.userDataDetails.search = filterValue.trim();
      this.userDataDetails.page = 1;

      this.getAllUser();
    }, 600);
  }
  deleteRecord(id: any) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.supremeService.deleteUser(id).subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getAllUser();
          });
        }
      });
  }
}
