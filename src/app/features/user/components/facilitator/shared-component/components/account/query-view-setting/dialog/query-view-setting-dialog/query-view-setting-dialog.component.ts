import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { cloneDeep } from "lodash";
@Component({
  selector: "app-query-view-setting-dialog",
  templateUrl: "./query-view-setting-dialog.component.html",
  styleUrls: ["./query-view-setting-dialog.component.scss"],
})
export class QueryViewSettingDialogComponent implements OnInit {
  dialogTitle: string;
  queryViewForm: FormGroup;
  zone: FormArray;
  internalUserData: any = [];
  queryViewParams = {
    page: 1,
    limit: 0,
    search: "",
  };

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
  isLoadingCountrySelectAll = false;
  selectedCountrySearch: any = [];
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
  isLoadingTreatmentSelectAll = false;
  selectedTreatmentSearch: any = [];

  internalUserId: string;
  selectedQueryViewData: any;
  isEdit = false;
  zoneIndex: number;

  constructor(
    private dialogRef: MatDialogRef<QueryViewSettingDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.getCountryData(false);
    this.getTreatmentData(false);
    this.getOwnReferralPartner(false);
  }

  buildForm() {
    this.queryViewForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      treatment: [[]],
      country: [[]],
      ownReferralPartner: [[]],
    });
  }

  getCountryData(selectAll: Boolean) {
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
        if (selectAll) {
          const allCountryNames = this.countryData.map((item) => item.name);
          allCountryNames.forEach(
            (country) =>
              this.selectedCountrySearch.includes(country) ||
              this.selectedCountrySearch.push(country)
          );
          this.queryViewForm.patchValue({
            country: this.selectedCountrySearch,
          });
          this.isLoadingCountrySelectAll = false;
        }
      });
  }
  onInfiniteScrollCountry(): void {
    if (this.countryData.length < this.totalElementCountry) {
      this.getCountryData(false);
    }
  }

  searchCountry(filterValue: string) {
    clearTimeout(this.timeoutCountry);
    this.timeoutCountry = setTimeout(() => {
      this.countryParams.search = filterValue.trim();
      this.countryParams.page = 1;
      this.countryParams.limit = 20;
      this.countryData = []; // Clear existing data when searching
      this.isLoadingCountry = false;
      this.getCountryData(false);
    }, 600);
  }

  onClickCountry(item) {
    const index = this.selectedCountrySearch.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCountrySearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCountrySearch.push(item);
    }
    this.queryViewForm.patchValue({
      country: [...new Set(this.selectedCountrySearch)],
    });
  }
  selectAllCountry(event) {
    if (event.checked) {
      this.countryParams.page = 1;
      this.countryParams.limit = 0;
      this.isLoadingCountry = false;
      this.isLoadingCountrySelectAll = true;
      this.getCountryData(true);
    } else {
      this.selectedCountrySearch = [];
      this.queryViewForm.patchValue({
        country: [],
      });
    }
  }

  getTreatmentData(selectAll: Boolean) {
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
        if (selectAll) {
          const allTreatmentNames = this.treatmentData.map((item) => item.name);
          allTreatmentNames.forEach(
            (treatment) =>
              this.selectedTreatmentSearch.includes(treatment) ||
              this.selectedTreatmentSearch.push(treatment)
          );
          this.queryViewForm.patchValue({
            treatment: this.selectedTreatmentSearch,
          });
          this.isLoadingTreatmentSelectAll = false;
        }
      });
  }
  onInfiniteScrollTreatment(): void {
    if (this.treatmentData.length < this.totalElementTreatment) {
      this.getTreatmentData(false);
    }
  }

  searchTreatment(filterValue: string) {
    clearTimeout(this.timeoutTreatment);
    this.timeoutTreatment = setTimeout(() => {
      this.treatmentParams.search = filterValue.trim();
      this.treatmentParams.page = 1;
      this.treatmentParams.limit = 20;
      this.treatmentData = []; // Clear existing data when searching
      this.isLoadingTreatment = false;
      this.getTreatmentData(false);
    }, 600);
  }

  onClickTreatment(item) {
    const index = this.selectedTreatmentSearch.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedTreatmentSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedTreatmentSearch.push(item);
    }
    this.queryViewForm.patchValue({
      treatment: [...new Set(this.selectedTreatmentSearch)],
    });
  }
  selectAllTreatment(event) {
    if (event.checked) {
      this.treatmentParams.page = 1;
      this.treatmentParams.limit = 0;
      this.isLoadingTreatment = false;
      this.isLoadingTreatmentSelectAll = true;
      this.getTreatmentData(true);
    } else {
      this.selectedTreatmentSearch = [];
      this.queryViewForm.patchValue({
        treatment: [],
      });
    }
  }

  queryViewFormSubmit() {
    this.queryViewForm.value.internalUser = this.internalUserId;
    // console.log('this.queryViewForm.value', this.queryViewForm.value)

    if (this.queryViewForm.valid) {
      // console.log('this.queryViewForm.value', this.queryViewForm.value)
      // console.log('selected', this.selectedQueryViewData)
      if (!this.selectedQueryViewData) {
        const data = {
          internalUser: this.queryViewForm.value.internalUser,
          zone: [
            {
              name: this.queryViewForm.value.name,
              country: this.queryViewForm.value.country,
              treatment: this.queryViewForm.value.treatment,
              ownReferralPartner: this.queryViewForm.value.ownReferralPartner,
            },
          ],
        };
        this.facilitatorService
          .addQueryViewSetting(data)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        if (this.isEdit) {
          this.selectedQueryViewData.zone[this.zoneIndex] = {
            name: this.queryViewForm.value.name,
            country: this.queryViewForm.value.country,
            treatment: this.queryViewForm.value.treatment,
            ownReferralPartner: this.queryViewForm.value.ownReferralPartner,
          };
        } else {
          this.selectedQueryViewData.zone.push({
            name: this.queryViewForm.value.name,
            country: this.queryViewForm.value.country,
            treatment: this.queryViewForm.value.treatment,
            ownReferralPartner: this.queryViewForm.value.ownReferralPartner,
          });
        }

        const data = {
          zone: this.selectedQueryViewData.zone,
        };
        this.facilitatorService
          .editQueryViewSetting(this.selectedQueryViewData._id, data)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.queryViewForm.controls).forEach((key) => {
        this.queryViewForm.controls[key].markAsTouched();
      });
    }
  }

  onEdit(index: number) {
    this.isEdit = true;
    this.zoneIndex = index;
    this.selectedCountrySearch =
      this.selectedQueryViewData.zone[this.zoneIndex].country;
    this.selectedTreatmentSearch =
      this.selectedQueryViewData.zone[this.zoneIndex].treatment;
    this.queryViewForm.patchValue({
      name: this.selectedQueryViewData.zone[this.zoneIndex].name,
      country: this.selectedQueryViewData.zone[this.zoneIndex].country,
      treatment: this.selectedQueryViewData.zone[this.zoneIndex].treatment,
      ownReferralPartner:
        this.selectedQueryViewData.zone[this.zoneIndex].ownReferralPartner,
    });
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  ownReferralPartnerData = [];
  ownReferralPartnerFreshData = [];
  selectedOwnReferralPartnerSearch = [];
  totalElementOwnReferralPartner: number;
  isLoadingOwnReferralPartner: boolean = false;
  isLoadingOwnReferralPartnerSelectAll: boolean = false;
  timeoutOwnReferralPartner = null;

  getOwnReferralPartner(selectAll: boolean) {
    if (this.isLoadingOwnReferralPartner) {
      return;
    }
    this.isLoadingOwnReferralPartner = true;
    this.facilitatorService.getAllReferralPartner().subscribe((res: any) => {
      if (selectAll) {
        this.ownReferralPartnerData = [];
      }

      this.ownReferralPartnerData.push(...res.data);
      this.ownReferralPartnerFreshData = cloneDeep(this.ownReferralPartnerData);
      this.totalElementOwnReferralPartner = res.data.totalElement;
      this.isLoadingOwnReferralPartner = false;

      if (selectAll) {
        const allPartnerNames = this.ownReferralPartnerData.map((item) => ({
          _id: item._id,
          name: item.name,
        }));

        allPartnerNames.forEach((hospital) => {
          const isPartnerAlreadySelected =
            this.selectedOwnReferralPartnerSearch.some(
              (selectedPartner) => selectedPartner._id === hospital._id
            );

          if (!isPartnerAlreadySelected) {
            this.selectedOwnReferralPartnerSearch.push(hospital);
          }
        });

        this.queryViewForm.patchValue({
          ownReferralPartner: this.selectedOwnReferralPartnerSearch,
        });
        this.isLoadingOwnReferralPartnerSelectAll = false;
      }
    });
  }

  searchOwnReferralPartner(filterValue: string) {
    clearTimeout(this.timeoutOwnReferralPartner);
    this.timeoutOwnReferralPartner = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.ownReferralPartnerFreshData);
        this.ownReferralPartnerData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.ownReferralPartnerData = filterArray;
      } else {
        this.ownReferralPartnerData = this.ownReferralPartnerFreshData;
      }
    }, 600);
  }

  onClickOwnReferralPartner(item) {
    const index = this.selectedOwnReferralPartnerSearch.findIndex(
      (element) => element._id === item._id
    ); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedOwnReferralPartnerSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedOwnReferralPartnerSearch.push(item);
    }
    this.queryViewForm.patchValue({
      ownReferralPartner: [...new Set(this.selectedOwnReferralPartnerSearch)],
    });
  }

  selectAllOwnReferralPartner(event) {
    if (event.checked) {
      this.isLoadingOwnReferralPartner = false;
      this.isLoadingOwnReferralPartnerSelectAll = true;
      this.getOwnReferralPartner(true);
    } else {
      this.selectedOwnReferralPartnerSearch = [];
      this.queryViewForm.patchValue({
        ownReferralPartner: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
