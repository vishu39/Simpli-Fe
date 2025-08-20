import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddTreatmentPackageDialogComponent } from "./add-treatment-package-dialog/add-treatment-package-dialog.component";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "shared-treatment-package",
  templateUrl: "./treatment-package.component.html",
  styleUrls: ["./treatment-package.component.scss"],
})
export class TreatmentPackageComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "doctorName",
    "countryDuration",
    "hospitalDuration",
    "action",
  ];
  packageData = new MatTableDataSource<any>([]);
  totalElement: number;
  packageParams = {
    page: 1,
    limit: 10,
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
    this.getAllTreatmentPackage();
  }

  addTreatmentPackage(heading: string) {
    const dialogRef = this.dialog.open(AddTreatmentPackageDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllTreatmentPackage();
      }
    });
  }

  editTreatmentPackage(heading: string, data: any) {
    const dialogRef = this.dialog.open(AddTreatmentPackageDialogComponent, {
      width: "100%",
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.packageData = data;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllTreatmentPackage();
      }
    });
  }

  isDataLoading: boolean = true;
  getAllTreatmentPackage() {
    this.packageData.data = [];
    this.isDataLoading = true;
    this.hospitalService.getAllTreatmentPackage(this.packageParams).subscribe(
      (res: any) => {
        this.packageData.data = res.data.content;
        this.totalElement = res.data.totalElement;
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  onPaginateChange(value) {
    this.packageParams.limit = value.pageSize;
    this.packageParams.page = value.pageIndex + 1;
    this.getAllTreatmentPackage();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.packageParams.search = filterValue.trim();
      this.packageParams.page = 1;
      this.paginator.firstPage();
      this.getAllTreatmentPackage();
    }, 600);
  }

  deleteTreatmentPackage(id: string) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.hospitalService
            .deleteTreatmentPackage(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.getAllTreatmentPackage();
            });
        }
      });
  }
}
