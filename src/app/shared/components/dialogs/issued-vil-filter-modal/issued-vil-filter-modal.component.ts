import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-issued-vil-filter-modal",
  templateUrl: "./issued-vil-filter-modal.component.html",
  styleUrls: ["./issued-vil-filter-modal.component.scss"],
})
export class IssuedVilFilterModalComponent implements OnInit {
  dialogTitle: string;
  filterForm: FormGroup;
  selectedFilters: any;
  loginType = GET_LOGIN_TYPE();

  constructor(
    public dialogRef: MatDialogRef<IssuedVilFilterModalComponent>,
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getHospitalAdminUserType();
    this.getAllHospital(false);
    // this.getCountryData();
    // this.getTreatmentData();

    if (this.loginType === "hospital") {
      this.getAllInternalUserForHospital();
    }

    if (this.loginType === "facilitator") {
      this.getAllInternalUserForHospital();
    }

    this.editFilter();
  }

  editFilter() {
    let { hospital, country, treatment, userName, userType } =
      this.selectedFilters;
    if (
      !!hospital ||
      !!country ||
      !!treatment ||
      userName?.length > 0 ||
      !!userType
    ) {
      this.filterForm.patchValue({
        hospital,
        // country,
        // treatment,
        userType,
        userName,
      });

      if (hospital?.length) {
        this.selectedHospitalSearch = hospital;
      }
      if (userType?.length) {
        this.selectedUserType = userType;
      }
      if (userName?.length) {
        this.selectedUserSearch = userName;
      }
      // if (country?.length) {
      //   this.selectedCountry = country;
      // }
      // if (treatment?.length) {
      //   this.selectTreatment = treatment;
      // }
    }
  }

  createForm() {
    this.filterForm = this.fb.group({
      hospital: [[]],
      userName: [[]],
      // country: [[]],
      // treatment: [[]],
      userType: [[]],
    });
  }

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
            hospital: this.selectedHospitalSearch,
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
      hospital: [...new Set(this.selectedHospitalSearch)],
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
        hospital: [],
      });
    }
  }

  // country linking
  countryData: any = [];
  totalElementCountry: number;
  countryParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutCountry = null;
  isLoadingCountry = false;
  fileList: any[] = [];
  filePreviewUrls: string[] = [];

  getCountryData(selectAll = false) {
    if (this.isLoadingCountry) {
      return;
    }
    this.isLoadingCountry = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.countryData = [];
        }
        this.countryData.push(...res.data.content);
        this.totalElementCountry = res.data.totalElement;
        this.countryParams.page = this.countryParams.page + 1;
        this.isLoadingCountry = false;

        // select all
        if (selectAll) {
          const allHospital = this.countryData?.map((item) => item.name);
          allHospital.forEach((hospital) => {
            const isHospitalAlreadySelected = this.selectedCountry.some(
              (selectedHospital) => selectedHospital === hospital
            );

            if (!isHospitalAlreadySelected) {
              this.selectedCountry.push(hospital);
            }
          });

          this.filterForm.patchValue({
            country: this.selectedCountry,
          });
          this.isLoadingCountrySelectAll = false;
        }
      });
  }

  onInfiniteScrollCountry(): void {
    if (this.countryData.length < this.totalElementCountry) {
      this.getCountryData();
    }
  }

  searchCountry(filterValue: string) {
    clearTimeout(this.timeoutCountry);
    this.timeoutCountry = setTimeout(() => {
      this.countryParams.search = filterValue.trim();
      this.countryParams.page = 1;
      this.countryData = []; // Clear existing data when searching
      this.isLoadingCountry = false;
      this.getCountryData();
    }, 600);
  }

  selectedCountry = [];
  isLoadingCountrySelectAll: boolean = false;
  onClickCountry(item: any) {
    const index = this.selectedCountry.indexOf(item);
    // console.log('index', index)
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCountry.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCountry.push(item);
    }

    this.filterForm.patchValue({
      country: [...new Set(this.selectedCountry)],
    });
  }

  selectAllCountry(event: any) {
    if (event.checked) {
      this.countryParams.page = 1;
      this.countryParams.limit = 0;
      this.isLoadingCountry = false;
      this.isLoadingCountrySelectAll = true;
      this.getCountryData(true);
    } else {
      this.selectedCountry = [];
      this.filterForm.patchValue({
        country: [],
      });
    }
  }

  // treatment linking
  treatmentData: any = [];
  totalElementTreatment: number;
  treatmentParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutTreatment = null;
  isLoadingTreatment = false;

  timeoutPartner = null;

  getTreatmentData(selectAll = false) {
    if (this.isLoadingTreatment) {
      return;
    }
    this.isLoadingTreatment = true;

    this.sharedService
      .getCmsData("getAllTreatment", this.treatmentParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.treatmentData = [];
        }

        this.treatmentData.push(...res.data.content);
        this.totalElementTreatment = res.data.totalElement;
        this.treatmentParams.page = this.treatmentParams.page + 1;
        this.isLoadingTreatment = false;

        // select all
        if (selectAll) {
          const allTreatment = this.treatmentData?.map((item) => item.name);
          allTreatment.forEach((treat: any) => {
            const isTreatmentAlreadySelected = this.selectTreatment.some(
              (selectTreatment) => selectTreatment === treat
            );

            if (!isTreatmentAlreadySelected) {
              this.selectTreatment.push(treat);
            }
          });

          this.filterForm.patchValue({
            treatment: this.selectTreatment,
          });
          this.isLoadingTreatmentSelectAll = false;
        }
      });
  }

  onInfiniteScrollTreatment(): void {
    if (this.treatmentData.length < this.totalElementTreatment) {
      this.getTreatmentData();
    }
  }

  searchTreatment(filterValue: string) {
    clearTimeout(this.timeoutTreatment);
    this.timeoutTreatment = setTimeout(() => {
      this.treatmentParams.search = filterValue.trim();
      this.treatmentParams.page = 1;
      this.treatmentData = []; // Clear existing data when searching
      this.isLoadingTreatment = false;
      this.getTreatmentData();
    }, 600);
  }

  selectTreatment = [];
  isLoadingTreatmentSelectAll: boolean = false;
  onClickTreatment(item: any) {
    const index = this.selectTreatment?.indexOf(item);
    // console.log('index', index)
    if (index !== -1) {
      // If the item exists, remove it
      this.selectTreatment.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectTreatment.push(item);
    }
    this.filterForm.patchValue({
      treatment: [...new Set(this.selectTreatment)],
    });
  }

  selectAllTreatment(event: any) {
    if (event.checked) {
      this.treatmentParams.page = 1;
      this.treatmentParams.limit = 0;
      this.isLoadingTreatment = false;
      this.isLoadingTreatmentSelectAll = true;
      this.getTreatmentData(true);
    } else {
      this.selectTreatment = [];
      this.filterForm.patchValue({
        treatment: [],
      });
    }
  }

  // userType linking

  userTypeData: any;
  freshUserTypeData: any;
  userTypeLoading = false;
  selectedUserType = [];
  timeoutUserType = null;
  getHospitalAdminUserType() {
    this.userTypeLoading = true;
    this.sharedService.getHospitalAdminUserType().subscribe((res: any) => {
      this.userTypeData = ["admin",...res.data];
      this.freshUserTypeData = ["admin",...res.data];      
      this.userTypeLoading = false;
    });
  }

  getFacilitatorAdminUserType() {
    this.userTypeLoading = true;
    this.sharedService.getFacilitatorAdminUserType().subscribe((res: any) => {
      this.userTypeData = ["admin",...res.data];
      this.freshUserTypeData = ["admin",...res.data];    
      this.userTypeLoading = false;
    });
  }

  onTypeChange(item: any) {
    const index = this.selectedUserType.findIndex(
      (element) => element === item
    );
    if (index !== -1) {
      this.selectedUserType.splice(index, 1);
    } else {
      this.selectedUserType.push(item);
    }
    this.filterForm.patchValue({
      userType: [...new Set(this.selectedUserType)],
    });
  }

  searchUserType(filterValue: string) {
    clearTimeout(this.timeoutUserType);
    this.timeoutUserType = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshUserTypeData);
        this.userTypeData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.userTypeData = filterArray;
      } else {
        this.userTypeData = this.freshUserTypeData;
      }
    }, 600);
  }

  selectAllUserType(event: any) {
    if (event.checked) {
      this.selectedUserType = [];

      const allUserType = this.userTypeData?.map((item) => item);

      allUserType.forEach((iu: any) => {
        const isTypeSelected = this.selectedUserType.some(
          (selectedUserType: any) => selectedUserType === iu
        );

        if (!isTypeSelected) {
          this.selectedUserType.push(iu);
        }
      });
      this.filterForm.patchValue({
        userType: this.selectedUserType,
      });
    } else {
      this.selectedUserType = [];
      this.filterForm.patchValue({
        userType: [],
      });
    }
  }

  // internal user linking
  isInternalUserLoading = true;
  getAllInternalUserForHospital() {
    this.isInternalUserLoading = true;
    this.isAdminLoading = true;
    this.hospitalService
      .getAllEmployeeUserHopsital({ isPatient: true })
      .subscribe(
        (res: any) => {
          this.internalUserData = res.data || [];
          this.getAdminDetails();
          this.isInternalUserLoading = false;
        },
        (err) => {
          this.isInternalUserLoading = false;
          this.isAdminLoading = false;
        }
      );
  }

  getAllInternalUserForFacilitator() {
    this.isInternalUserLoading = true;
    this.isAdminLoading = true;
    this.facilitatorService
      .getAllEmployeeUserFacilitator({ isPatient: true })
      .subscribe(
        (res: any) => {
          this.internalUserData = res.data || [];
          this.getAdminDetails();
          this.isInternalUserLoading = false;
        },
        (err) => {
          this.isInternalUserLoading = false;
          this.isAdminLoading = false;
        }
      );
  }

  copyInternalUserData: any = [];
  isAdminLoading = false;
  isAdminLoadingSelectAll = false;
  getAdminDetails() {
    this.isAdminLoading = true;
    this.sharedService.getAdminDetails().subscribe(
      (res: any) => {
        this.internalUserData.unshift(res.data);
        if (this.internalUserData?.length) {
          this.isAdminLoading = false;
        } else {
          this.isAdminLoading = false;
        }
        this.copyInternalUserData = cloneDeep(this.internalUserData);
      },
      () => {
        this.isAdminLoading = false;
      }
    );
  }

  timeoutInternalUser = null;
  internalUserData: any = [];
  selectedUserSearch: any = [];

  searchInternalUser(filterValue: string) {
    clearTimeout(this.timeoutInternalUser);
    this.timeoutInternalUser = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.internalUserData);
        this.internalUserData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.internalUserData = filterArray;
      } else {
        this.internalUserData = this.copyInternalUserData;
      }
    }, 600);
  }

  onClickUser(item) {
    const index = this.selectedUserSearch.findIndex(
      (element) => element?._id === item?._id
    );
    if (index !== -1) {
      this.selectedUserSearch.splice(index, 1);
    } else {
      this.selectedUserSearch.push(item);
    }
    this.filterForm.patchValue({
      userName: [...new Set(this.selectedUserSearch)],
    });
  }

  selectAllUser(event) {
    if (event.checked) {
      this.isAdminLoading = false;
      // this.isAdminLoadingSelectAll = true;
      this.selectedUserSearch = [];
      this.internalUserData?.forEach((iud: any) => {
        this.selectedUserSearch.push({
          _id: iud?._id,
          name: iud?.name,
        });
      });

      this.filterForm.patchValue({
        userName: [...new Set(this.selectedUserSearch)],
      });
    } else {
      this.selectedUserSearch = [];
      this.filterForm.patchValue({
        userName: [],
      });
    }
  }

  compareObjectsForUser(item1, item2) {
    return item1._id === item2._id;
  }

  compareObjectsUserType(item1, item2) {
    return item1 === item2;
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id;
  }

  closeDialog(apiCall: boolean, type = "close"): void {
    let filterData = this.filterForm.value;
    this.dialogRef.close({ apiCall, filterData, type });
  }

  submit() {
    this.closeDialog(true, "submit");
  }

  resetFilter() {
    this.filterForm.reset({
      hospital: [],
      userName: [],
      // country: [],
      // treatment: [],
      userType: [],
    });
    this.closeDialog(true, "reset");
  }
}
