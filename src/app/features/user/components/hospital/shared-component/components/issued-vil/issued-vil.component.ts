import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { IssuedVilFilterModalComponent } from "src/app/shared/components/dialogs/issued-vil-filter-modal/issued-vil-filter-modal.component";

@Component({
  selector: "shared-issued-vil",
  templateUrl: "./issued-vil.component.html",
  styleUrls: ["./issued-vil.component.scss"],
})
export class IssuedVilComponent implements OnInit {
  displayedColumns: string[] = [
    "downloadAt",
    "name",
    "userName",
    "userType",
    "referenceNo",
    "patientName",
    "country",
    "treatment",
    "vilLetter",
  ];

  issuedVilData = new MatTableDataSource<any>([]);
  totalElement: number;

  issuedParams: any = {
    page: 1,
    limit: 10,
    search: "",
    filterObj: {},
  };

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllIssuedVil();
  }

  isDataLoading: boolean = true;
  getAllIssuedVil() {
    this.issuedVilData.data = [];
    this.isDataLoading = true;
    this.hospitalService
      .getAllIssuedVil(this.issuedParams)
      .subscribe((res: any) => {
        this.totalElement = res?.data?.totalElement;
        this.issuedVilData.data = res?.data?.content;
        this.isDataLoading = false;
      });
  }

  onPaginateChange(value) {
    this.issuedParams.limit = value.pageSize;
    this.issuedParams.page = value.pageIndex + 1;
    this.getAllIssuedVil();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  timeout = null;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.issuedParams.search = filterValue.trim();
      this.issuedParams.page = 1;
      this.paginator.firstPage();
      this.getAllIssuedVil();
    }, 600);
  }

  onClickDownload(data: any) {
    this.sharedService.getS3Object({ key: data?.key }).subscribe((res: any) => {
      window.open(res?.data, "_blank");
    });
  }

  isFilterSelected = false;
  selectedFilters: any = {};
  openFilterModal() {
    const dialogRef = this.dialog.open(IssuedVilFilterModalComponent, {
      width: "40%",
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.componentInstance.dialogTitle = "Issued VIL Filter";
    dialogRef.componentInstance.selectedFilters = this.selectedFilters;

    dialogRef.afterClosed().subscribe((result) => {
      const { apiCall, filterData, type } = result;

      if (type === "reset") {
        this.isFilterSelected = false;
        this.issuedParams.page = "1";
        this.issuedParams.filterObj = {};
        this.paginator.firstPage();
        this.getAllIssuedVil();
      }

      if (apiCall) {
        this.selectedFilters = filterData;
        const { hospital, userType, treatment, country, userName } = filterData;
        if (
          hospital?.length > 0 ||
          country?.length > 0 ||
          treatment?.length > 0 ||
          userType?.length > 0 ||
          userName?.length > 0
        ) {
          this.isFilterSelected = true;
          this.issuedParams.page = "1";

          let filterObj = {};
          if (hospital?.length > 0) {
            filterObj["hospital"] = this.filterIdArray(hospital);
          }
          if (userName?.length > 0) {
            filterObj["userName"] = this.filterIdArray(userName || []);
          }
          if (userType?.length > 0) {
            filterObj["vilUserType"] = userType;
          }
          if (country) {
            filterObj["country"] = country;
          }
          if (treatment) {
            filterObj["treatment"] = treatment;
          }

          this.issuedParams.filterObj = filterObj;

          this.paginator.firstPage();
          this.getAllIssuedVil();
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

  filterIdArray(array: any) {
    let newArray = [];
    if (array?.length) {
      array.forEach((e) => {
        newArray.push(e?._id);
      });
    }
    return newArray;
  }
}
