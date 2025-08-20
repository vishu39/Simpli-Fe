import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddDoctorStaffComponent } from "./dialog/add-doctor-staff/add-doctor-staff.component";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { MatDialog } from "@angular/material/dialog";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "shared-doctor-staff",
  templateUrl: "./doctor-staff.component.html",
  styleUrls: ["./doctor-staff.component.scss"],
})
export class DoctorStaffComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "name",
    "emailId",
    "contact",
    "type",
    "doctor",
    "action",
  ];

  doctorStaffData = new MatTableDataSource<any>([]);
  totalElement: number;

  doctorStaffParams = {
    page: 1,
    limit: 10,
    search: "",
    doctor: "",
  };

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllDoctorStaff();
  }

  concatDoctor(doctor: any) {
    if (doctor.length === 0) {
      return ""; // Return an empty string for an empty array
    }

    let concatDoctor = doctor[0].name; // Start with the first element
    for (let i = 1; i < doctor.length; i++) {
      concatDoctor += ", " + doctor[i].name;
    }

    return concatDoctor;
  }

  truncateText(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    const truncatedText = words.slice(0, wordLimit).join(" ");
    return truncatedText + "...";
  }

  isDataLoading: boolean = true;
  getAllDoctorStaff() {
    this.doctorStaffData.data = [];
    this.isDataLoading = true;
    this.hospitalService.getAllDoctorStaff(this.doctorStaffParams).subscribe(
      (res: any) => {
        this.totalElement = res?.data?.totalElement;
        this.doctorStaffData.data = res?.data?.content;
        this.isDataLoading = false;
      },
      () => {
        this.isDataLoading = false;
      }
    );
  }

  onPaginateChange(value) {
    this.doctorStaffParams.limit = value.pageSize;
    this.doctorStaffParams.page = value.pageIndex + 1;
    this.getAllDoctorStaff();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  timeout = null;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.doctorStaffParams.search = filterValue.trim();
      this.doctorStaffParams.page = 1;
      this.paginator.firstPage();
      this.getAllDoctorStaff();
    }, 600);
  }

  onClickDownload(data: any) {
    this.sharedService.getS3Object({ key: data?.key }).subscribe((res: any) => {
      window.open(res?.data, "_blank");
    });
  }

  addDoctorStaff(heading: string) {
    const dialogRef = this.dialog.open(AddDoctorStaffComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllDoctorStaff();
      }
    });
  }

  editDoctorStaff(heading: string, item: any) {
    const dialogRef = this.dialog.open(AddDoctorStaffComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(item);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllDoctorStaff();
      }
    });
  }

  deleteRecord(id: string) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.hospitalService.deleteDoctorStaff(id).subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getAllDoctorStaff();
          });
        }
      });
  }
}
