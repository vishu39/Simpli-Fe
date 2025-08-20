import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { ReportDialogComponent } from "./dialog/report-dialog/report-dialog.component";
import { MatPaginator } from "@angular/material/paginator";
@Component({
  selector: "shared-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  displayedColumns: string[] = ["createdAt", "userName", "userType", "report"];
  patientExcelReportData = new MatTableDataSource<any>([]);
  totalElement: number;
  patientExcelReportParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  timeout = null;

  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getAllPatientExcelReport();
  }
  downloadReport(heading: string) {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      minWidth: "40%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllPatientExcelReport();
      }
    });
  }

  isDataLoading: boolean = true;
  getAllPatientExcelReport() {
    this.patientExcelReportData.data = [];
    this.isDataLoading = true;
    this.facilitatorService
      .getAllPatientExcelReport(this.patientExcelReportParams)
      .subscribe(
        (res: any) => {
          this.patientExcelReportData.data = res.data.content;
          this.totalElement = res.data.totalElement;
          this.isDataLoading = false;
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  onPaginateChange(value) {
    this.patientExcelReportParams.limit = value.pageSize;
    this.patientExcelReportParams.page = value.pageIndex + 1;
    this.getAllPatientExcelReport();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.patientExcelReportParams.search = filterValue.trim();
      this.patientExcelReportParams.page = 1;
      this.paginator.firstPage();
      this.getAllPatientExcelReport();
    }, 600);
  }
  fetchFile(key) {
    const data = {
      key: key,
    };
    this.sharedService.getS3Object(data).subscribe((res: any) => {
      window.open(res.data);
    });
  }
}
