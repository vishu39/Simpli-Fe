import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-doctor-list-filter-modal",
  templateUrl: "./doctor-list-filter-modal.component.html",
  styleUrls: ["./doctor-list-filter-modal.component.scss"],
})
export class DoctorListFilterModalComponent implements OnInit {
  selectedFilters: any;
  dialogTitle: string = "Filter Doctor";

  filterForm: FormGroup;

  // hospital linking
  hospitalData = [];
  freshHospitalData = [];
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll: boolean = false;
  totalElementHospital: number;
  selectedHospitalSearch = [];
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };

  selectedEmaiFetchSettingForFilterSearch: any = [];

  constructor(
    public dialogRef: MatDialogRef<DoctorListFilterModalComponent>,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fieldFirst: [],
      fieldSecond: [],
    });

    if (this.selectedFilters?.fieldFirst?.length > 0) {
      const { fieldFirst } = this.selectedFilters;
      this.selectedEmaiFetchSettingForFilterSearch = fieldFirst;
      this.selectedHospitalSearch=fieldFirst
      this.filterForm.patchValue({
        fieldFirst: this.selectedHospitalSearch,
      });
    }

    if (this.selectedFilters?.fieldSecond?.length > 0) {
      const { fieldSecond } = this.selectedFilters;
      this.selectedDepartmentSearch=fieldSecond
      this.filterForm.patchValue({
        fieldSecond: this.selectedDepartmentSearch,
      });
    }

    this.getAllHospital(false);
    this.getDepartmentData(false);
  }

  resetFilter() {
    this.selectedEmaiFetchSettingForFilterSearch = [];
    this.filterForm.reset({
      fieldFirst: [],
      fieldSecond: [],
    });
    this.closeDialog(true);
  }

  closeDialog(apiCall: boolean) {
    let data = {
      apiCall,
      filteredData: !apiCall ? {} : this.filterForm.value,
    };
    this.dialogRef.close(data);
  }

  getAllHospital(selectAll: Boolean) {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.hospitalData = [];
        }
        this.freshHospitalData.push(...res.data.content);
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;

        this.isLoadingHospital = false;

        if (selectAll) {
          const allHospital = this.hospitalData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allHospital.forEach((hospital) => {
            const isHospitalAlreadySelected = this.selectedHospitalSearch.some(
              (selectedHospital) => selectedHospital._id === hospital._id
            );

            if (!isHospitalAlreadySelected) {
              this.selectedHospitalSearch.push(hospital);
            }
          });

          this.filterForm.patchValue({
            fieldFirst: this.selectedHospitalSearch,
          });
          this.isLoadingHospitalSelectAll = false;
        }
      });
  }
  onInfiniteScrollHospital(): void {
    if (this.freshHospitalData.length < this.totalElementHospital) {
      this.getAllHospital(false);
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 20;
      this.hospitalData = [];
      this.freshHospitalData = [];
      this.isLoadingHospital = false;
      this.getAllHospital(false);
    }, 600);
  }

  onClickHospital(item) {
    const index = this.selectedHospitalSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedHospitalSearch.splice(index, 1);
    } else {
      this.selectedHospitalSearch.push(item);
    }
    this.filterForm.patchValue({
      fieldFirst: [...new Set(this.selectedHospitalSearch)],
    });
  }

  selectAllHospital(event: any) {
    if (event.checked) {
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 0;
      this.isLoadingHospital = false;
      this.isLoadingHospitalSelectAll = true;
      this.getAllHospital(true);
    } else {
      this.selectedHospitalSearch = [];
      this.filterForm.patchValue({
        fieldFirst: [],
      });
    }
  }

  // Department linking
  departmentParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  isLoadingDepartment = false;
  departmentData = [];
  totalElementDepartment = 0;
  timeoutDepartment = null;
  isLoadingDepartmentSelectAll: boolean = false;
  selectedDepartmentSearch = [];

  getDepartmentData(selectAll: boolean) {
    if (this.isLoadingDepartment) {
      return;
    }
    this.isLoadingDepartment = true;

    this.sharedService
      .getCmsData("getAllDepartment", this.departmentParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.departmentData = [];
        }

        this.departmentData.push(...res.data.content);
        this.totalElementDepartment = res.data.totalElement;
        this.departmentParams.page = this.departmentParams.page + 1;
        this.isLoadingDepartment = false;

        if (selectAll) {
          const allDepartment = this.departmentData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allDepartment.forEach((department) => {
            const isDepartmentAlreadySelected =
              this.selectedDepartmentSearch.some(
                (selectedDepartment) =>
                  selectedDepartment._id === department._id
              );

            if (!isDepartmentAlreadySelected) {
              this.selectedDepartmentSearch.push(department);
            }
          });

          this.filterForm.patchValue({
            fieldSecond: this.selectedDepartmentSearch,
          });
          this.isLoadingDepartmentSelectAll = false;
        }
      });
  }

  onInfiniteScrollDepartment(): void {
    if (this.departmentData.length < this.totalElementDepartment) {
      this.getDepartmentData(false);
    }
  }

  searchDepartment(filterValue: string) {
    clearTimeout(this.timeoutDepartment);
    this.timeoutDepartment = setTimeout(() => {
      this.departmentParams.search = filterValue.trim();
      this.departmentParams.page = 1;
      this.departmentParams.limit = 20;
      this.departmentData = [];
      this.isLoadingDepartment = false;
      this.getDepartmentData(false);
    }, 600);
  }

  onClickDepartment(item) {
    const index = this.selectedDepartmentSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedDepartmentSearch.splice(index, 1);
    } else {
      this.selectedDepartmentSearch.push(item);
    }
    this.filterForm.patchValue({
      fieldSecond: [...new Set(this.selectedDepartmentSearch)],
    });
  }

  selectAllDepartment(event: any) {
    if (event.checked) {
      this.departmentParams.page = 1;
      this.departmentParams.limit = 0;
      this.isLoadingDepartment = false;
      this.isLoadingDepartmentSelectAll = true;
      this.getDepartmentData(true);
    } else {
      this.selectedDepartmentSearch = [];
      this.filterForm.patchValue({
        fieldSecond: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id;
  }

  onSubmit() {
    this.closeDialog(true);
  }
}
