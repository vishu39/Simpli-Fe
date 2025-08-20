import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ThirdPartyDraggable } from "@fullcalendar/interaction";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { HospitalPasswordDialogComponent } from "./dialog/hospital-password-dialog/hospital-password-dialog.component";
// import { HospitalPasswordDialogComponent } from './dialog/hospitalPassword-dialog/hospitalPassword-dialog.component';
@Component({
  selector: "app-hospital-password",
  templateUrl: "./hospital-password.component.html",
  styleUrls: ["./hospital-password.component.scss"],
})
export class HospitalPasswordComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "hospitalName",
    "password",
    "action",
  ];
  hospitalPasswordData = new MatTableDataSource<any>([]);
  totalElement: number;
  hospitalPasswordParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  timeout = null;

  constructor(
    private supremeService: SupremeService,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getAllHospitalPassword();
  }
  generateAllHospitalPassword() {
    this.supremeService.generateAllHospitalPassword().subscribe((res: any) => {
      this.sharedService.showNotification("snackBar-success", res.message);
      this.getAllHospitalPassword();
    });
  }
  editHospitalPassword(heading: string, hospitalPasswordId: string) {
    const dialogRef = this.dialog.open(HospitalPasswordDialogComponent, {
      minWidth: "50%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.hospitalPasswordId = hospitalPasswordId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllHospitalPassword();
      }
    });
  }

  isDataLoading = true;
  getAllHospitalPassword() {
    this.hospitalPasswordData.data = [];
    this.isDataLoading = true;
    this.supremeService
      .getAllHospitalPassword(this.hospitalPasswordParams)
      .subscribe(
        (res: any) => {
          this.hospitalPasswordData.data = res.data.content;
          // console.log(this.hospitalPasswordData.data);
          this.totalElement = res.data.totalElement;
          this.isDataLoading = false;
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }
  sendPasswordEmailToHospital(hospitalId: string) {
    const data = {
      hospitalId: hospitalId,
    };
    this.supremeService
      .sendPasswordEmailToHospital(data)
      .subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
      });
  }
  onPaginateChange(value) {
    this.hospitalPasswordParams.limit = value.pageSize;
    this.hospitalPasswordParams.page = value.pageIndex + 1;
    this.getAllHospitalPassword();
  }

  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.hospitalPasswordParams.search = filterValue.trim();
      this.hospitalPasswordParams.page = 1;
      this.getAllHospitalPassword();
    }, 600);
  }
}
