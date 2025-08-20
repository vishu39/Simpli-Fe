import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { role } from "src/app/core/models/role";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "shared-operation-board-filter",
  templateUrl: "./operation-board-filter.component.html",
  styleUrls: ["./operation-board-filter.component.scss"],
})
export class OperationBoardFilterComponent implements OnInit {
  title = "Select Filter";

  userType = role;
  decodedToken: any = this.sharedService.decodeToken();
  patientData: any;
  referralPartnerData: any = [];
  referralPartnerFreshData: any = [];

  // Country Linking
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
  // Treatment Linking

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

  filterForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<OperationBoardFilterComponent>,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  referralTypeName = {
    pre: "Pre defined",
    own: "Own",
  };

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: "",
      country: null,
      treatment: null,
      referralPartner: "",
      user: [],
    });
    this.getCountryData();
    this.getTreatmentData();
    this.getAllInternalUserForHospital();
    if (this.decodedToken?.userType === this.userType.referralPartner) {
      this.filterForm.controls["referralPartner"].disable();
    } else {
      this.getAllReferralPartner();
    }

    this.editFilter();
  }

  editFilter() {
    let { name, country, treatment, referralPartner, user } = this.data.params;
    if (
      !!name ||
      !!country ||
      !!treatment ||
      !!referralPartner ||
      user?.length > 0
    ) {
      this.filterForm.patchValue({
        name,
        country,
        treatment,
        referralPartner,
        user,
      });

      if (country?.length) {
        this.selectedCountry = country;
      }
      if (treatment?.length) {
        this.selectTreatment = treatment;
      }
      if (user?.length) {
        this.selectedUserSearch = user;
      }
    }
  }

  resetFilter() {
    this.filterForm.reset({
      name: "",
      country: "",
      treatment: "",
      referralPartner: "",
      user: [],
    });
    this.dialogRef.close({
      apiCall: true,
      data: this.filterForm.value,
    });
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  closeDialog(apiCall: boolean) {
    let values = cloneDeep(this.filterForm?.value);
    values["country"] = values?.country?.length ? values?.country : [];
    values["treatment"] = values?.treatment?.length ? values?.treatment : [];
    this.dialogRef.close({
      apiCall,
      data: values,
    });
  }

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

  // getAllReferralPartner() {
  //   this.hospitalService.getAllReferralPartner().subscribe((res: any) => {
  //     this.referralPartnerData = res.data;
  //     this.referralPartnerFreshData = res.data;
  //     // console.log('this.referralPartnerData', this.referralPartnerData)
  //   });
  // }

  getAllReferralPartner() {
    this.hospitalService.getAllReferralPartner().subscribe((res: any) => {
      if (res?.data?.length) {
        let data = res?.data?.map((d: any) => {
          d["referralType"] = "own";
          return d;
        });

        this.referralPartnerData = data;
        this.referralPartnerFreshData = cloneDeep(this.referralPartnerData);
      }
      this.getPreReferralPartner();
    });
  }

  preReferralPartnerParams = {
    page: 1,
    limit: "",
    search: "",
  };
  getPreReferralPartner() {
    this.sharedService
      .getAllFacilitator(this.preReferralPartnerParams)
      .subscribe((res: any) => {
        if (res?.data?.content?.length) {
          let data = res?.data?.content?.map((d: any) => {
            d["referralType"] = "pre";
            return d;
          });
          this.referralPartnerData.push(...data);
          this.referralPartnerFreshData.push(...data);
        }
      });
  }

  // onClickReferralItem(item: any) {
  //   this.addPatientForm.patchValue({
  //     referralType: item?.referralType,
  //     referralPartnerName: item?.name,
  //   });
  // }

  searchReferralPartner(filterValue: string) {
    clearTimeout(this.timeoutPartner);
    this.timeoutPartner = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.referralPartnerFreshData);
        this.referralPartnerData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.referralPartnerData = filterArray;
      } else {
        this.referralPartnerData = this.referralPartnerFreshData;
      }
    }, 600);
  }

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

  // user data linking
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
      user: [...new Set(this.selectedUserSearch)],
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
        user: [...new Set(this.selectedUserSearch)],
      });
    } else {
      this.selectedUserSearch = [];
      this.filterForm.patchValue({
        user: [],
      });
    }
  }

  compareObjectsForUser(item1, item2) {
    return item1._id === item2._id;
  }
}
