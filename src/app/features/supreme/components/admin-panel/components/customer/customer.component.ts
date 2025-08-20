import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { CustomerDialogComponent } from "./dialog/customer-dialog/customer-dialog.component";
import { ClipboardService } from "ngx-clipboard";
import { CommonService } from "src/app/smvt-framework/services/common.service";
const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"],
})
export class CustomerComponent implements OnInit {
  displayedColumns: string[] = [
    "customerType",
    "name",
    "emailId",
    "role",
    "onPremiseDB",
    "credentialPushed",
    "action",
  ];
  customerData = new MatTableDataSource<any>([]);
  totalElement: number;
  customerDataDetails = {
    page: 1,
    limit: 10,
    search: "",
  };
  timeout = null;

  constructor(
    private supremeService: SupremeService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private _clipboardService: ClipboardService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllCustomer();
  }
  addCustomer(heading: string) {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllCustomer();
      }
    });
  }
  editCustomer(heading: string, data: any) {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(data);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllCustomer();
      }
    });
  }

  isDataLoading = true;
  getAllCustomer() {
    this.customerData.data = [];
    this.isDataLoading = true;
    this.supremeService.getAllCustomer(this.customerDataDetails).subscribe(
      (res: any) => {
        this.customerData.data = res.data.content;
        // console.log(this.customerData.data);
        this.totalElement = res.data.totalElement;
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  onPaginateChange(value) {
    this.customerDataDetails.limit = value.pageSize;
    this.customerDataDetails.page = value.pageIndex + 1;
    this.getAllCustomer();
  }

  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.customerDataDetails.search = filterValue.trim();
      this.customerDataDetails.page = 1;
      this.getAllCustomer();
    }, 600);
  }
  deleteRecord(id: any) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.supremeService.deleteCustomer(id).subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getAllCustomer();
          });
        }
      });
  }
  copyItem(item) {
    const data = {
      id: item._id,
      name: item.dbName,
    };
    this._clipboardService.copy(JSON.stringify(data));
    this.sharedService.showNotification(
      "snackBar-success",
      "Content copied successfully"
    );
  }
  pushCredential(data) {
    const dataSend = {
      _id: data._id,
    };
    this.supremeService.pushCustomerCredential(dataSend).subscribe((res) => {
      this.sharedService.showNotification(
        "snackBar-success",
        "Credential pushed successfully"
      );
      this.getAllCustomer();
    });
  }
}
