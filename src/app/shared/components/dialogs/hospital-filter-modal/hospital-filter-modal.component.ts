import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";

@Component({
  selector: "app-hospital-filter-modal",
  templateUrl: "./hospital-filter-modal.component.html",
  styleUrls: ["./hospital-filter-modal.component.scss"],
})
export class HospitalFilterModalComponent implements OnInit {
  dialogTitle: string;
  filterForm: FormGroup;
  selectedFilters: any;
  loginType = GET_LOGIN_TYPE();

  constructor(
    public dialogRef: MatDialogRef<HospitalFilterModalComponent>,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      accreditation: [],
      beds: [""],
      country: [],
      hospital: [],
      city: [],
    });
    this.getCountryData();
    this.getAllAccreditation();
    this.getAllCity();
    this.getAllHospital(false);

    this.editFilter();
  }

  editFilter() {
    let { hospital, country, city, beds, accreditation } = this.selectedFilters;
    if (
      accreditation?.length > 0 ||
      country?.length > 0 ||
      city?.length > 0 ||
      hospital?.length > 0 ||
      !!beds
    ) {
      if (hospital?.length > 0) {
        this.selectedHospitalSearch = hospital;
      }
      if (country?.length > 0) {
        this.selectedCountry = country;
      }
      if (city?.length > 0) {
        this.selectedCity = city;
      }
      if (accreditation?.length > 0) {
        this.selectedAccreditation = accreditation;
      }

      this.filterForm.patchValue({
        accreditation: this.selectedAccreditation,
        country: this.selectedCountry,
        city: this.selectedCity,
        hospital: this.selectedHospitalSearch,
        beds,
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
          const allCountry = this.countryData?.map((item) => ({
            _id: item?._id,
            name: item.name,
          }));
          allCountry.forEach((country) => {
            const isCountryAlreadySelected = this.selectedCountry.some(
              (selectedCountry) => selectedCountry?._id === country?._id
            );

            if (!isCountryAlreadySelected) {
              this.selectedCountry.push(country);
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
    const index = this.selectedCountry.indexOf(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedCountry.splice(index, 1);
    } else {
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

  // accreditation linking
  accreditationParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  isLoadingAccreditation = false;
  isLoadingAccreditationSelectAll = false;
  accreditationData = [];
  timeoutAccreditation = null;
  totalElementAccreditation = 0;
  selectedAccreditation: any = [];

  getAllAccreditation(selectAll = false) {
    if (this.isLoadingAccreditation) {
      return;
    }

    this.isLoadingAccreditation = true;
    this.sharedService
      .getCmsData("getAllAccreditation", this.accreditationParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.accreditationData = [];
        }
        this.accreditationData.push(...res.data.content);
        this.totalElementAccreditation = res.data.totalElement;
        this.accreditationParams.page = this.accreditationParams.page + 1;
        this.isLoadingAccreditation = false;

        // select all
        if (selectAll) {
          const allAccreditation = this.accreditationData?.map((item) => ({
            _id: item?._id,
            name: item?.name,
          }));
          allAccreditation.forEach((accreditation) => {
            const isAccreditationAlreadySelected =
              this.selectedAccreditation.some(
                (selectedAccreditation) =>
                  selectedAccreditation === accreditation
              );

            if (!isAccreditationAlreadySelected) {
              this.selectedAccreditation.push(accreditation);
            }
          });

          this.filterForm.patchValue({
            accreditation: this.selectedAccreditation,
          });
          this.isLoadingAccreditationSelectAll = false;
        }
      });
  }

  onInfiniteScrollAccreditation(): void {
    if (this.accreditationData.length < this.totalElementAccreditation) {
      this.getAllAccreditation();
    }
  }

  searchAccreditation(filterValue: string) {
    clearTimeout(this.timeoutAccreditation);
    this.timeoutAccreditation = setTimeout(() => {
      this.accreditationParams.search = filterValue.trim();
      this.accreditationParams.page = 1;
      this.accreditationData = []; // Clear existing data when searching
      this.isLoadingAccreditation = false;
      this.getAllAccreditation();
    }, 600);
  }

  onClickAccreditation(item: any) {
    const index = this.selectedAccreditation.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedAccreditation.splice(index, 1);
    } else {
      this.selectedAccreditation.push(item);
    }
    this.filterForm.patchValue({
      accreditation: [...new Set(this.selectedAccreditation)],
    });
  }

  selectAllAccreditation(event: any) {
    if (event.checked) {
      this.accreditationParams.page = 1;
      this.accreditationParams.limit = 0;
      this.isLoadingAccreditation = false;
      this.isLoadingAccreditationSelectAll = true;
      this.getAllAccreditation(true);
    } else {
      this.selectedAccreditation = [];
      this.filterForm.patchValue({
        accreditation: [],
      });
    }
  }

  // city linking
  cityParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  isLoadingCity = false;
  isLoadingCitySelectAll = false;
  cityData = [];
  timeoutCity = null;
  totalElementCity = 0;
  selectedCity: any = [];

  getAllCity(selectAll = false) {
    if (this.isLoadingCity) {
      return;
    }
    
    this.isLoadingCity = true;

    this.sharedService
      .getCmsData("getAllCity", this.cityParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.cityData = [];
        }
        this.cityData.push(...res.data.content);
        this.totalElementCity = res.data.totalElement;
        this.cityParams.page = this.cityParams.page + 1;
        this.isLoadingCity = false;

        // select all
        if (selectAll) {
          const allCity = this.cityData?.map((item) => ({
            _id: item?._id,
            name: item?.name,
          }));
          allCity.forEach((city) => {
            const isCityAlreadySelected = this.selectedCity.some(
              (selectedCity) => selectedCity === city
            );

            if (!isCityAlreadySelected) {
              this.selectedCity.push(city);
            }
          });

          this.filterForm.patchValue({
            city: this.selectedCity,
          });
          this.isLoadingCitySelectAll = false;
        }
      });
  }

  onInfiniteScrollCity(): void {
    if (this.cityData.length < this.totalElementCity) {
      this.getAllCity();
    }
  }

  searchCity(filterValue: string) {
    clearTimeout(this.timeoutCity);
    this.timeoutCity = setTimeout(() => {
      this.cityParams.search = filterValue.trim();
      this.cityParams.page = 1;
      this.cityData = []; // Clear existing data when searching
      this.isLoadingCity = false;
      this.getAllCity();
    }, 600);
  }

  onClickCity(item: any) {
    const index = this.selectedCity.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedCity.splice(index, 1);
    } else {
      this.selectedCity.push(item);
    }
    this.filterForm.patchValue({
      city: [...new Set(this.selectedCity)],
    });
  }

  selectAllCity(event: any) {
    if (event.checked) {
      this.cityParams.page = 1;
      this.cityParams.limit = 0;
      this.isLoadingCity = false;
      this.isLoadingCitySelectAll = true;
      this.getAllCity(true);
    } else {
      this.selectedCity = [];
      this.filterForm.patchValue({
        city: [],
      });
    }
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

  compareObjects(item1, item2) {
    return item1._id === item2._id;
  }

  closeDialog(apiCall: boolean): void {
    let filterData = this.filterForm.value;
    this.dialogRef.close({ apiCall, filterData });
  }

  submit() {
    this.closeDialog(true);
  }

  resetFilter() {
    this.filterForm.reset({
      accreditation: [],
      city: [],
      country: [],
      hospital: [],
      beds: "",
    });
    this.closeDialog(true);
  }
}
