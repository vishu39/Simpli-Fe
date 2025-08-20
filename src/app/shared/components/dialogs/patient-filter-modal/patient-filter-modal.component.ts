import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";

@Component({
  selector: "app-patient-filter-modal",
  templateUrl: "./patient-filter-modal.component.html",
  styleUrls: ["./patient-filter-modal.component.scss"],
})
export class PatientFilterModalComponent implements OnInit {
  dialogTitle: string;
  filterForm: FormGroup;
  selectedFilters: any = {};
  loginType = GET_LOGIN_TYPE();

  genderData = ["male", "female"];

  constructor(
    public dialogRef: MatDialogRef<PatientFilterModalComponent>,
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      country: [],
      treatment: [],
      gender: [],
      age: "",
    });

    let { country, treatment, gender, age } = this.selectedFilters;

    if (country?.length > 0 || treatment?.length > 0 || !!age || !!gender) {
      this.selectedCountry = country;
      this.selectTreatment = treatment;
      this.selectedGender=gender
      this.filterForm.patchValue({
        country: this.selectedCountry,
        treatment: this.selectTreatment,
        gender: this.selectedGender,
        age: age,
      });
    }

    this.getCountryData();
    this.getTreatmentData();
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

  compareObjectsForUser(item1, item2) {
    return item1._id === item2._id;
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

  closeDialog(apiCall: boolean, type = "close"): void {
    let filterData = this.filterForm.value;
    this.dialogRef.close({ apiCall, filterData, type });
  }

  submit() {
    this.closeDialog(true);
  }

  resetFilter() {
    this.selectedCountry = [];
    this.selectTreatment = [];
    this.filterForm.reset({
      country: [],
      treatment: [],
      gender: [],
      age: "",
    });
    this.closeDialog(true);
  }
}
