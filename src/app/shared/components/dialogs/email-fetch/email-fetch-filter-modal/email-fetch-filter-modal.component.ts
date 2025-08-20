import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "app-email-fetch-filter-modal",
  templateUrl: "./email-fetch-filter-modal.component.html",
  styleUrls: ["./email-fetch-filter-modal.component.scss"],
})
export class EmailFetchFilterModalComponent implements OnInit {
  dialogTitle: string = "Filter Email";
  openedComponent: string;
  selectedFilter: any;

  filterForm: FormGroup;

  emailFetchSettingForFilterParams = {
    limit: 20,
    page: 1,
    search: "",
  };

  // origin

  constructor(
    public dialogRef: MatDialogRef<EmailFetchFilterModalComponent>,
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      origin: [],
    });

    if (this.selectedFilter?.origin?.length > 0) {
      const { origin } = this.selectedFilter;
      this.selectedEmaiFetchSettingForFilterSearch = origin;
      this.filterForm.patchValue({
        origin: this.selectedEmaiFetchSettingForFilterSearch,
      });
    }

    if (this.openedComponent === "hospital") {
      this.getAllEmailFetchSettingForFilterForHospital(false);
    }
    if (this.openedComponent === "facilitator") {
      this.getAllEmailFetchSettingForFilterForFacilitator(false);
    }
  }

  resetFilter() {
    this.selectedEmaiFetchSettingForFilterSearch = [];
    this.filterForm.reset({
      oirigin: [],
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

  compareObjectsForOrigin(item1, item2) {
    return item1 === item2;
  }

  // Email Fetch Setting For Filter Linking
  isLoadingEmaiFetchSettingForFilter = false;
  isLoadingEmaiFetchSettingForFilterSelectAll = false;
  emaiFetchSettingForFilterData: any = [];
  selectedEmaiFetchSettingForFilterSearch: any = [];
  totalElementEmaiFetchSettingForFilter = 0;
  timeoutEmaiFetchSettingForFilter = null;

  getAllEmailFetchSettingForFilterForHospital(selectAll: Boolean) {
    if (this.isLoadingEmaiFetchSettingForFilter) {
      return;
    }
    this.isLoadingEmaiFetchSettingForFilter = true;

    this.hospitalService
      .getAllEmailFetchSettingForFilter(this.emailFetchSettingForFilterParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.emaiFetchSettingForFilterData = [];
        }
        this.emaiFetchSettingForFilterData.push(...res.data.content);
        this.totalElementEmaiFetchSettingForFilter = res.data.totalElement;
        this.emailFetchSettingForFilterParams.page =
          this.emailFetchSettingForFilterParams.page + 1;
        this.isLoadingEmaiFetchSettingForFilter = false;
        if (selectAll) {
          const allEmailFetchSettingForFilter =
            this.emaiFetchSettingForFilterData.map((item) => item.emailId);
          allEmailFetchSettingForFilter.forEach(
            (emailFetchSettingForFilter) => {
              const isEmailFetchSettingForFilterAlreadySelected =
                this.selectedEmaiFetchSettingForFilterSearch.some(
                  (selectedEmailFetchSettingForFilter) =>
                    selectedEmailFetchSettingForFilter ===
                    emailFetchSettingForFilter
                );

              if (!isEmailFetchSettingForFilterAlreadySelected) {
                this.selectedEmaiFetchSettingForFilterSearch.push(
                  emailFetchSettingForFilter
                );
              }
            }
          );

          this.filterForm.patchValue({
            origin: this.selectedEmaiFetchSettingForFilterSearch,
          });
          this.isLoadingEmaiFetchSettingForFilterSelectAll = false;
        }
      });
  }

  getAllEmailFetchSettingForFilterForFacilitator(selectAll: Boolean) {
    if (this.isLoadingEmaiFetchSettingForFilter) {
      return;
    }
    this.isLoadingEmaiFetchSettingForFilter = true;

    this.facilitatorService
      .getAllEmailFetchSettingForFilter(this.emailFetchSettingForFilterParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.emaiFetchSettingForFilterData = [];
        }
        this.emaiFetchSettingForFilterData.push(...res.data.content);
        this.totalElementEmaiFetchSettingForFilter = res.data.totalElement;
        this.emailFetchSettingForFilterParams.page =
          this.emailFetchSettingForFilterParams.page + 1;
        this.isLoadingEmaiFetchSettingForFilter = false;
        if (selectAll) {
          const allEmailFetchSettingForFilter =
            this.emaiFetchSettingForFilterData.map((item) => item.emailId);
          allEmailFetchSettingForFilter.forEach(
            (emailFetchSettingForFilter) => {
              const isEmailFetchSettingForFilterAlreadySelected =
                this.selectedEmaiFetchSettingForFilterSearch.some(
                  (selectedEmailFetchSettingForFilter) =>
                    selectedEmailFetchSettingForFilter ===
                    emailFetchSettingForFilter
                );

              if (!isEmailFetchSettingForFilterAlreadySelected) {
                this.selectedEmaiFetchSettingForFilterSearch.push(
                  emailFetchSettingForFilter
                );
              }
            }
          );

          this.filterForm.patchValue({
            origin: this.selectedEmaiFetchSettingForFilterSearch,
          });
          this.isLoadingEmaiFetchSettingForFilterSelectAll = false;
        }
      });
  }

  onInfiniteScrollEmailFetchSettingForFilter(): void {
    if (
      this.emaiFetchSettingForFilterData.length <
      this.totalElementEmaiFetchSettingForFilter
    ) {
      if (this.openedComponent === "hospital") {
        this.getAllEmailFetchSettingForFilterForHospital(false);
      }
      if (this.openedComponent === "facilitator") {
        this.getAllEmailFetchSettingForFilterForFacilitator(false);
      }
    }
  }

  searchEmailFetchSettingForFilter(filterValue: string) {
    clearTimeout(this.timeoutEmaiFetchSettingForFilter);
    this.timeoutEmaiFetchSettingForFilter = setTimeout(() => {
      this.emailFetchSettingForFilterParams.search = filterValue.trim();
      this.emailFetchSettingForFilterParams.page = 1;
      this.emailFetchSettingForFilterParams.limit = 20;
      this.emaiFetchSettingForFilterData = [];
      this.isLoadingEmaiFetchSettingForFilter = false;
      if (this.openedComponent === "hospital") {
        this.getAllEmailFetchSettingForFilterForHospital(false);
      }
      if (this.openedComponent === "facilitator") {
        this.getAllEmailFetchSettingForFilterForFacilitator(false);
      }
    }, 600);
  }

  onClickEmailFetchSettingForFilter(item) {
    const index = this.selectedEmaiFetchSettingForFilterSearch.findIndex(
      (element) => element === item
    );
    if (index !== -1) {
      this.selectedEmaiFetchSettingForFilterSearch.splice(index, 1);
    } else {
      this.selectedEmaiFetchSettingForFilterSearch.push(item);
    }

    this.filterForm.patchValue({
      origin: [...new Set(this.selectedEmaiFetchSettingForFilterSearch)],
    });
  }

  selectAllEmailFetchSettingForFilter(event) {
    if (event.checked) {
      this.emailFetchSettingForFilterParams.page = 1;
      this.emailFetchSettingForFilterParams.limit = 0;
      this.isLoadingEmaiFetchSettingForFilter = false;
      this.isLoadingEmaiFetchSettingForFilterSelectAll = true;
      if (this.openedComponent === "hospital") {
        this.getAllEmailFetchSettingForFilterForHospital(true);
      }
      if (this.openedComponent === "facilitator") {
        this.getAllEmailFetchSettingForFilterForFacilitator(true);
      }
    } else {
      this.selectedEmaiFetchSettingForFilterSearch = [];
      this.filterForm.patchValue({
        origin: [],
      });
    }
  }

  onSubmit() {
    this.closeDialog(true);
  }
}
