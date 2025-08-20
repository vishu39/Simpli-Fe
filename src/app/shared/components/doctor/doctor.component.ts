import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { SharedService } from "src/app/core/service/shared/shared.service";
import FileSaver from "file-saver";
import { MatDialog } from "@angular/material/dialog";
import { AddDoctorDialogComponent } from "./dialog/add-doctor-dialog/add-doctor-dialog.component";
import {
  GET_LOGIN_TYPE,
  GET_URL_BASED_ON_LOGIN_TYPE,
} from "../../routing-constant";
import { MatPaginator } from "@angular/material/paginator";
import { DownloadDoctorProfileModalComponent } from "../dialogs/download-doctor-profile-modal/download-doctor-profile-modal.component";
import { DoctorListFilterModalComponent } from "../dialogs/doctor-list-filter-modal/doctor-list-filter-modal.component";

@Component({
  selector: "app-shared-doctor",
  templateUrl: "./doctor.component.html",
  styleUrls: ["./doctor.component.scss"],
})
export class DoctorListComponent implements OnInit {
  @Input() userType: string;

  displayedColumns: string[] = [
    "name",
    "department",
    "associatedHospital",
    "experience",
    "review",
    "downloadProfile",
  ];
  doctorData = new MatTableDataSource<any>([]);
  totalElement: number;
  doctorParams = {
    page: 1,
    limit: 10,
    search: "",
    filterObj: {},
  };
  timeout = null;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  loginType = GET_LOGIN_TYPE();

  ngOnInit(): void {
    this.getDoctorData();
  }

  hospitalDisplayColumns = [
    "name",
    "department",
    "associatedHospital",
    "experience",
    "review",
    "downloadProfile",
    "action",
  ];

  isDataLoading: boolean = true;
  getDoctorData() {
    if (this.loginType === "hospital") {
      this.displayedColumns = this.hospitalDisplayColumns;
    }
    this.doctorData.data = [];
    this.isDataLoading = true;
    this.sharedService.getAllDoctor(this.doctorParams).subscribe(
      (res: any) => {
        this.doctorData.data = res.data.content;
        this.totalElement = res.data.totalElement;
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  onPaginateChange(value) {
    this.doctorParams.limit = value.pageSize;
    this.doctorParams.page = value.pageIndex + 1;
    this.getDoctorData();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.doctorParams.search = filterValue.trim();
      this.doctorParams.page = 1;
      this.paginator.firstPage();
      this.getDoctorData();
    }, 600);
  }

  generateStarRating(rating) {
    const maxRating = 5;
    const fullStar =
      '<i class="fas fa-star" style="color: rgb(252, 213, 63);"></i>';
    const halfStar =
      '<i class="fas fa-star-half-alt" style="color: rgb(252, 213, 63);"></i>';
    const emptyStar =
      '<i class="far fa-star" style="color: rgb(252, 213, 63);"></i>';

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.25;

    let starsHTML = "";
    for (let i = 0; i < fullStars; i++) {
      starsHTML += fullStar;
    }

    if (hasHalfStar) {
      starsHTML += halfStar;
    }

    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += emptyStar;
    }

    return starsHTML;
  }

  navigateToProfile(id: number) {
    let loginType = localStorage.getItem("loginType");
    this.router.navigate([`/user/${loginType}/${this.userType}/doctor`, id]);
  }

  downloadProfile(id) {
    const dialogRef = this.dialog.open(DownloadDoctorProfileModalComponent, {
      width: "40%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "Download Doctor Profile";
    dialogRef.componentInstance.doctorId = id;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
      }
    });
    // const data = {
    //   doctorId: id,
    // };

    // this.sharedService.generateDoctorProfile(data).subscribe((res: any) => {
    //   res.data.forEach((e) => {
    //     const uint8Array = new Uint8Array(e?.content?.data);
    //     let blob = new Blob([uint8Array], { type: e?.contentType });
    //     FileSaver.saveAs(blob, e?.filename);
    //   });

    //   this.sharedService.showNotification("snackBar-success", res.message);
    // });
  }
  concatDepartment(department: any) {
    if (department.length === 0) {
      return "NIL"; // Return an empty string for an empty array
    }

    let concatDepartment = department[0].name; // Start with the first element
    for (let i = 1; i < department.length; i++) {
      concatDepartment += ", " + department[i].name;
    }
    return concatDepartment;
  }

  // edit doctor
  editDoctorProfile(item: any) {
    const dialogRef = this.dialog.open(AddDoctorDialogComponent, {
      width: "100%",
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.componentInstance.title = "Edit Doctor Profile";
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.editData = item;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getDoctorData();
      }
    });
  }

  // doctor filter
  isFilterSelected = false;
  selectedFilters: any = {};

  openFilterModal() {
    const dialogRef = this.dialog.open(DoctorListFilterModalComponent, {
      width: "40%",
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.componentInstance.selectedFilters = this.selectedFilters;

    dialogRef.afterClosed().subscribe((result) => {
      const { apiCall, filteredData } = result;
      if (apiCall) {
        const { fieldFirst, fieldSecond } = filteredData;
        if (fieldFirst?.length > 0 || fieldSecond?.length > 0) {
          this.isFilterSelected = true;
          this.selectedFilters = filteredData;
          this.doctorData.data = [];
          this.doctorParams.page = 1;
          this.paginator.firstPage();
          let idArray = this.returnIdArray(fieldFirst || []);
          let departmentIdArray = this.returnIdArray(fieldSecond || []);

          let filterObj = {};
          if (fieldFirst?.length > 0) {
            filterObj["hospital"] = idArray;
          }
          if (fieldSecond?.length > 0) {
            filterObj["department"] = departmentIdArray;
          }

          this.doctorParams.filterObj = filterObj;
          this.getDoctorData();
        } else {
          this.selectedFilters = {};
          this.isFilterSelected = false;
          this.doctorData.data = [];
          this.doctorParams.page = 1;
          this.paginator.firstPage();
          this.doctorParams.filterObj = {};
          this.getDoctorData();
        }
      }
    });
  }

  returnIdArray(array: any) {
    let idArray = [];
    if (array?.length > 0) {
      array?.forEach((a: any) => {
        idArray.push(a?._id);
      });
    }
    return idArray;
  }
}
