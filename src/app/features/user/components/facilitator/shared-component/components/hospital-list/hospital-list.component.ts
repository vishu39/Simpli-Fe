import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { HospitalFilterModalComponent } from "src/app/shared/components/dialogs/hospital-filter-modal/hospital-filter-modal.component";

@Component({
  selector: "shared-hospital-list",
  templateUrl: "./hospital-list.component.html",
})
export class HospitalListComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "accreditation",
    "city",
    "country",
    "review",
    "beds",
  ];
  hospitalData = new MatTableDataSource<any>([]);
  totalElement: number;
  hospitalParams = {
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

  ngOnInit(): void {
    this.getHospitalData();
  }

  isDataLoading: boolean = true;
  getHospitalData() {
    this.hospitalData.data = [];
    this.isDataLoading = true;
    this.sharedService.getAllHospital(this.hospitalParams).subscribe(
      (res: any) => {
        this.hospitalData.data = res.data.content;
        this.totalElement = res.data.totalElement;
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  onPaginateChange(value) {
    this.hospitalParams.limit = value.pageSize;
    this.hospitalParams.page = value.pageIndex + 1;
    this.getHospitalData();
  }

  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.getHospitalData();
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
    this.router.navigate(["/user/facilitator/admin/hospital", id]);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // hospital filter
  isFilterSelected = false;
  selectedFilters: any = {};

  openFilterModal() {
    const dialogRef = this.dialog.open(HospitalFilterModalComponent, {
      width: "70%",
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.componentInstance.dialogTitle = "Filter Hospital";
    dialogRef.componentInstance.selectedFilters = this.selectedFilters;

    dialogRef.afterClosed().subscribe((result) => {
      const { apiCall, filterData } = result;
      if (apiCall) {
        if (
          filterData?.accreditation?.length > 0 ||
          filterData?.country?.length > 0 ||
          filterData?.beds ||
          filterData?.city?.length > 0 ||
          filterData?.name
        ) {
          this.isFilterSelected = true;
          this.selectedFilters = filterData;
          this.hospitalData.data = [];
          this.hospitalParams.page = 1;
          this.paginator.firstPage();

          let filterObj = {};
          if (filterData?.city?.length > 0) {
            filterObj["city"] = this.returnIdArray(filterData?.city || []);
          }
          if (filterData?.accreditation?.length > 0) {
            filterObj["accreditation"] = this.returnIdArray(
              filterData?.accreditation || []
            );
          }
          if (filterData?.country?.length > 0) {
            filterObj["country"] = this.returnIdArray(
              filterData?.country || []
            );
          }
          if (filterData?.beds) {
            filterObj["beds"] = filterData?.beds;
          }
          if (filterData?.hospital?.length > 0) {
            filterObj["name"] = this.returnNameArray(filterData?.hospital);
          } 

          this.hospitalParams.filterObj = filterObj;

          this.getHospitalData();
        } else {
          this.selectedFilters = {};
          this.isFilterSelected = false;
          this.hospitalData.data = [];
          this.hospitalParams.page = 1;
          this.paginator.firstPage();
          this.hospitalParams.filterObj = {};
          this.getHospitalData();
        }
      }
    });
  }

  returnNameArray(array: any) {
    let nameArray = [];
    if (array?.length > 0) {
      array?.forEach((a: any) => {
        nameArray.push(a?.name);
      });
    }    
    return nameArray;
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
