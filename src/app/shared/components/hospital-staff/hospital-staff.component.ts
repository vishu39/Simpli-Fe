import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { HospitalStaffDialogComponent } from "./dialog/hospital-staff-dialog/hospital-staff-dialog.component";
import { MatPaginator } from "@angular/material/paginator";
const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "app-shared-hospital-staff",
  templateUrl: "./hospital-staff.component.html",
  styleUrls: ["./hospital-staff.component.scss"],
})
export class HospitalStaffComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "name",
    "emailId",
    "contact",
    "type",
    "hospital",
    "action",
  ];
  hospitalStaffData = new MatTableDataSource<any>([]);
  totalElement: number;
  hospitalStaffParams = {
    page: 1,
    limit: 10,
    search: "",
    hospital: "",
  };
  timeout = null;

  // Hospital Linking
  selectHospital = {
    _id: "",
  };
  hospitalData: any = [];
  totalElementHospital: number;
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutHospital = null;
  isLoadingHospital = false;

  constructor(
    private supremeService: SupremeService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getHospitalData();
    // this.getAllHospitalStaff();
  }
  addHospitalStaff(heading: string) {
    const dialogRef = this.dialog.open(HospitalStaffDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllHospitalStaff();
      }
    });
  }
  editHospitalStaff(heading: string, item: any) {
    const dialogRef = this.dialog.open(HospitalStaffDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(item);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllHospitalStaff();
      }
    });
  }

  isDataLoading = false;
  getAllHospitalStaff() {
    this.hospitalStaffData.data = [];
    this.isDataLoading = true;
    this.supremeService.getStaffByHospital(this.hospitalStaffParams).subscribe(
      (res: any) => {
        this.hospitalStaffData.data = res.data.content;
        this.totalElement = res.data.totalElement;
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  onPaginateChange(value) {
    this.hospitalStaffParams.limit = value.pageSize;
    this.hospitalStaffParams.page = value.pageIndex + 1;
    this.getAllHospitalStaff();
  }

  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.hospitalStaffParams.search = filterValue.trim();
      this.hospitalStaffParams.page = 1;
      this.getAllHospitalStaff();
    }, 600);
  }

  concatHospital(hospital: any) {
    if (hospital.length === 0) {
      return ""; // Return an empty string for an empty array
    }

    let concatHospital = hospital[0].name; // Start with the first element
    for (let i = 1; i < hospital.length; i++) {
      concatHospital += ", " + hospital[i].name;
    }

    return concatHospital;
  }
  truncateText(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    const truncatedText = words.slice(0, wordLimit).join(" ");
    return truncatedText + "...";
  }
  deleteRecord(id: string) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.supremeService.deleteHospitalStaff(id).subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getAllHospitalStaff();
          });
        }
      });
  }

  onChangeHospital(event) {
    this.hospitalStaffParams.hospital = event.value;
    this.getAllHospitalStaff();
  }

  // Hospital linking
  getHospitalData() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        if (res.data.content?.length) {
          this.selectHospital._id = res.data.content[0]._id;
          this.hospitalStaffParams.hospital = this.selectHospital?._id;
          this.getAllHospitalStaff();
        } else {
          this.hospitalStaffParams.hospital = "";
          this.getAllHospitalStaff();
        }
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;
        this.isLoadingHospital = false;
      });
  }
  onInfiniteScrollHospital(): void {
    if (this.hospitalData.length < this.totalElementHospital) {
      this.getHospitalData();
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalData = []; // Clear existing data when searching
      this.isLoadingHospital = false;
      this.paginator.firstPage();
      this.getHospitalData();
    }, 600);
  }
}
