import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { cloneDeep } from "lodash";
import { SharedService } from "src/app/core/service/shared/shared.service";
import {
  hospitalAdminUserType,
  patientStatusForFac,
  patientStatusForFacString,
  patientStatusForHos,
  patientStatusForHosString,
} from "src/app/core/models/role";

@Component({
  selector: "app-query-management-filter-dialog",
  templateUrl: "./query-management-filter-dialog.component.html",
  styleUrls: ["./query-management-filter-dialog.component.scss"],
})
export class QueryManagementFilterDialogComponent implements OnInit {
  dialogTitle: string = "Filter Patient";
  openedComponent: string;
  selectedFilter: any;

  genderData = ["male", "female"];

  filterForm: FormGroup;

  userType = hospitalAdminUserType;
  decodedToken: any = this.sharedService.decodeToken();
  referralPartnerArray = [
    this.userType.referralPartner,
    this.userType.referralDoctor,
    this.userType.insurance,
    this.userType.corporate,
  ];

  // user

  constructor(
    public dialogRef: MatDialogRef<QueryManagementFilterDialogComponent>,
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      user: [],
      country: [],
      treatment: [],
      gender: [],
      age: "",
      referralPartner: [],
      currentStatus: [],
    });

    // set local storage data
    if (this.selectedFilter?.user?.length > 0) {
      const { user } = this.selectedFilter;
      this.selectedUserSearch = user;
      this.filterForm.patchValue({
        user: this.selectedUserSearch,
      });
    }

    let { country, treatment, gender, age, referralPartner, currentStatus } =
      this.selectedFilter;

    if (
      country?.length > 0 ||
      treatment?.length > 0 ||
      referralPartner?.length > 0 ||
      currentStatus?.length > 0 ||
      !!age ||
      gender?.length > 0
    ) {
      this.selectedCountry = country;
      this.selectTreatment = treatment;
      this.referralPartnerSelected = referralPartner;
      this.selectedStatus = currentStatus;
      this.selectedGender = gender;
      this.filterForm.patchValue({
        country: this.selectedCountry,
        treatment: this.selectTreatment,
        gender: this.selectedGender,
        age: age,
        referralPartner: this.referralPartnerSelected,
        currentStatus: this.selectedStatus,
      });
    }

    this.getCountryData();
    this.getTreatmentData();

    if (this.openedComponent === "hospital") {
      this.getAllInternalUserForHospital();
      if (!this.referralPartnerArray.includes(this.decodedToken.userType)) {
      this.getAllReferralPartnerForHos();
      }
      this.statusArray = patientStatusForHosString;
      this.freshStatusArray = patientStatusForHosString;
    }
    if (this.openedComponent === "facilitator") {
      this.getAllInternalUserForFacilitator();
      if (this.decodedToken?.userType !== this.userType.referralPartner) {
      this.getAllReferralPartnerForFac();
      }
      this.statusArray = patientStatusForFacString;
      this.freshStatusArray = patientStatusForFacString;
    }
  }

  resetFilter() {
    this.selectedUserSearch = [];
    this.selectedCountry = [];
    this.selectTreatment = [];
    this.referralPartnerSelected = [];
    this.filterForm.reset({
      oirigin: [],
      country: [],
      treatment: [],
      gender: [],
      age: "",
      referralPartner: [],
      currentStatus: [],
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

  referralTypeName = {
    pre: "Pre defined",
    own: "Own",
  };
  referralPartnerData: any = [];
  referralPartnerFreshData: any = [];
  referralPartnerSelected: any = [];
  isLoadingReferral = false;
  isLoadingReferralSelectAll = false;

  getAllReferralPartnerForHos(selectAll = false) {
    if (this.isLoadingReferral) {
      return;
    }

    this.isLoadingReferral = true;
    this.hospitalService.getAllReferralPartner().subscribe((res: any) => {
      if (res?.data?.length) {
        let data = res?.data?.map((d: any) => {
          d["referralType"] = "own";
          return d;
        });

        this.referralPartnerData = data;
        this.referralPartnerFreshData = cloneDeep(this.referralPartnerData);
      }
      this.getPreReferralPartner(selectAll);
    });
  }

  preReferralPartnerParams = {
    page: 1,
    limit: "",
    search: "",
  };

  getPreReferralPartner(selectAll = false) {
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

          this.isLoadingReferral = false;
          // this.referralPartnerSelectAllLogic(selectAll);
        } else {
          this.isLoadingReferral = false;
          // this.referralPartnerSelectAllLogic(selectAll);
        }
      });
  }

  referralPartnerSelectAllLogic(selectAll = false) {
    // select all
    if (selectAll) {
      const allReferral = this.referralPartnerData?.map((item) => ({
        _id: item?._id,
        name: item?.name,
      }));
      allReferral.forEach((partner) => {
        const isReferralAlreadySelected = this.referralPartnerSelected.some(
          (selectedReferral) => selectedReferral?._id === partner?._id
        );

        if (!isReferralAlreadySelected) {
          this.referralPartnerSelected.push(partner);
        }
      });

      this.filterForm.patchValue({
        referralPartner: this.referralPartnerSelected,
      });
      this.isLoadingReferralSelectAll = false;
    }
  }

  onClickReferralItem(item: any) {
    const index = this.referralPartnerSelected.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.referralPartnerSelected.splice(index, 1);
    } else {
      this.referralPartnerSelected.push(item);
    }
    this.filterForm.patchValue({
      referralPartner: [...new Set(this.referralPartnerSelected)],
    });
  }

  selectAllReferralPartner(event: any) {
    if (event.checked) {
      this.preReferralPartnerParams.page = 1;
      this.preReferralPartnerParams.limit = "";
      this.isLoadingReferral = false;
      this.isLoadingReferralSelectAll = true;
      if (this.openedComponent === "facilitator") {
        // this.getAllReferralPartnerForFac(true);
        this.referralPartnerSelectAllLogic(true)
      } else if (this.openedComponent === "hospital") {
        // this.getAllReferralPartnerForHos(true);
        this.referralPartnerSelectAllLogic(true)
      }
    } else {
      this.referralPartnerSelected = [];
      this.filterForm.patchValue({
        referralPartner: [],
      });
    }
  }

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

  // referralPartner Fac
  getAllReferralPartnerForFac(selectAll = false) {
    if (this.isLoadingReferral) {
      return;
    }

    this.isLoadingReferral = true;
    this.facilitatorService.getAllReferralPartner().subscribe((res: any) => {
      this.referralPartnerData = res.data;
      this.referralPartnerFreshData = res.data;
      this.isLoadingReferral = false;
      // this.referralPartnerSelectAllLogic(selectAll);
    });
  }

  // referral Partner linking end

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

  // status linking
  statusArray: any = [];
  freshStatusArray: any = [];
  selectedStatus: any = [];
  timeoutStatus = null;

  onClickStatus(item: any) {
    const index = this.selectedStatus.findIndex((element) => element === item);
    if (index !== -1) {
      this.selectedStatus.splice(index, 1);
    } else {
      this.selectedStatus.push(item);
    }
    this.filterForm.patchValue({
      currentStatus: [...new Set(this.selectedStatus)],
    });
  }

  searchStatus(filterValue: any) {
    clearTimeout(this.timeoutStatus);
    this.timeoutStatus = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshStatusArray);
        this.statusArray = [];
        let filterData = filterArray.filter((f: any) =>
          f?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.statusArray = filterArray;
      } else {
        this.statusArray = this.freshStatusArray;
      }
    }, 600);
  }

  selectAllStatus(event: any) {
    if (event.checked) {
      this.selectedStatus = [];

      const allStatus = this.statusArray.map((item) => item);

      allStatus.forEach((iu: any) => {
        const isStatusSelected = this.selectedStatus.some(
          (selectedStat: any) => selectedStat === iu
        );

        if (!isStatusSelected) {
          this.selectedStatus.push(iu);
        }
      });
      this.filterForm.patchValue({
        currentStatus: this.selectedStatus,
      });
    } else {
      this.selectedStatus = [];
      this.filterForm.patchValue({
        currentStatus: [],
      });
    }
  }

  // gender linking
  selectedGender = [];

  onClickGender(item: any) {
    const index = this.selectedGender?.indexOf(item);
    if (index !== -1) {
      this.selectedGender.splice(index, 1);
    } else {
      this.selectedGender.push(item);
    }
    this.filterForm.patchValue({
      gender: [...new Set(this.selectedGender)],
    });
  }

  selectAllGender(event: any) {
    if (event.checked) {
      this.selectedGender = [];

      const allGender = this.genderData.map((item) => item);

      allGender.forEach((iu: any) => {
        const isGenderSelected = this.selectedGender.some(
          (selectedGender: any) => selectedGender === iu
        );

        if (!isGenderSelected) {
          this.selectedGender.push(iu);
        }
      });
      this.filterForm.patchValue({
        gender: this.selectedGender,
      });
    } else {
      this.selectedGender = [];
      this.filterForm.patchValue({
        gender: [],
      });
    }
  }

  compareObjectsForUser(item1, item2) {
    return item1._id === item2._id;
  }

  onSubmit() {
    this.closeDialog(true);
  }
}
