import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";

@Component({
  selector: "app-add-referral-zone",
  templateUrl: "./add-referral-zone.component.html",
  styleUrls: ["./add-referral-zone.component.scss"],
})
export class AddReferralZoneComponent implements OnInit {
  zoneForm: FormGroup;
  zoneData: any;
  referralId: string;
  dialogTitle: string;
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
  // QueryTo Linking
  queryToData: any = [];
  totalElementQueryTo: number;
  queryToParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutQueryTo = null;
  isLoadingQueryTo = false;
  isLoadingQueryToSelectAll = false;
  selectedQueryToSearch: any = [];

  // QueryCc Linking
  queryCcData: any = [];
  totalElementQueryCc: number;
  queryCcParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutQueryCc = null;
  isLoadingQueryCc = false;
  isLoadingQueryCcSelectAll = false;
  selectedQueryCcSearch: any = [];

  // VilTo Linking
  vilToData: any = [];
  totalElementVilTo: number;
  vilToParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutVilTo = null;
  isLoadingVilTo = false;
  isLoadingVilToSelectAll = false;
  selectedVilToSearch: any = [];

  // VilCc Linking
  vilCcData: any = [];
  totalElementVilCc: number;
  vilCcParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutVilCc = null;
  isLoadingVilCc = false;
  isLoadingVilCcSelectAll = false;
  selectedVilCcSearch: any = [];

  // ConfirmationTo Linking
  dailyStatusToData: any = [];
  totalElementDailyStatusTo: number;
  dailyStatusToParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutDailyStatusTo = null;
  isLoadingDailyStatusTo = false;
  isLoadingDailyStatusToSelectAll = false;
  selectedDailyStatusToSearch: any = [];

  // ConfirmationCc Linking
  dailyStatusCcData: any = [];
  totalElementDailyStatusCc: number;
  dailyStatusCcParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutDailyStatusCc = null;
  isLoadingDailyStatusCc = false;
  isLoadingDailyStatusCcSelectAll = false;
  selectedDailyStatusCcSearch: any = [];

  // DoctorTo Linking
  queryStatusToData: any = [];
  totalElementQueryStatusTo: number;
  queryStatusToParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "doctor",
  };
  timeoutDoctorTo = null;
  isLoadingQueryStatusTo = false;
  isLoadingQueryStatusToSelectAll = false;
  selectedQueryStatusToSearch: any = [];

  // DoctorCc Linking
  queryStatusCcData: any = [];
  totalElementQueryStatusCc: number;
  queryStatusCcParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "doctor",
  };
  timeoutQueryStatusCc = null;
  isLoadingQueryStatusCc = false;
  isLoadingQueryStatusCcSelectAll = false;
  selectedQueryStatusCcSearch: any = [];

  // QueryMessage Linking
  queryMessageData: any = [];
  totalElementQueryMessage: number;
  queryMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutQueryMessage = null;
  isLoadingQueryMessage = false;
  isLoadingQueryMessageSelectAll = false;
  selectedQueryMessageSearch: any = [];

  // VilMessage Linking
  vilMessageData: any = [];
  totalElementVilMessage: number;
  vilMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutVilMessage = null;
  isLoadingVilMessage = false;
  isLoadingVilMessageSelectAll = false;
  selectedVilMessageSearch: any = [];

  // ConfirmationMessage Linking
  dailyStatusMessageData: any = [];
  totalElementDailyStatusMessage: number;
  dailyStatusMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutDailyStatusMessage = null;
  isLoadingDailyStatusMessage = false;
  isLoadingDailyStatusMessageSelectAll = false;
  selectedDailyStatusMessageSearch: any = [];

  // query Status message Linking
  queryStatusMessageData: any = [];
  totalElementQueryStatusMessage: number;
  queryStatusMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutQueryStatusMessage = null;
  isLoadingQueryStatusMessage = false;
  isLoadingQueryStatusMessageSelectAll = false;
  selectedQueryStatusMessageSearch: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private supremeService: SupremeService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<AddReferralZoneComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    this.queryToParams.referralPartner = this.referralId;
    this.queryCcParams.referralPartner = this.referralId;

    this.vilToParams.referralPartner = this.referralId;
    this.vilCcParams.referralPartner = this.referralId;

    this.dailyStatusToParams.referralPartner = this.referralId;
    this.dailyStatusCcParams.referralPartner = this.referralId;

    this.queryStatusToParams.referralPartner = this.referralId;
    this.queryStatusCcParams.referralPartner = this.referralId;

    this.queryMessageParams.referralPartner = this.referralId;
    this.vilMessageParams.referralPartner = this.referralId;
    this.dailyStatusMessageParams.referralPartner = this.referralId;

    this.queryStatusMessageParams.referralPartner = this.referralId;

    this.getQueryToData(false);
    this.getQueryCcData(false);
    this.getVilToData(false);
    this.getVilCcData(false);
    this.getDailyStatusToData(false);
    this.getDailyStatusCcData(false);
    this.getQueryStatusToData(false);
    this.getQueryStatusCcData(false);
    this.getCountryData(false);
    this.getTreatmentData(false);
    this.getQueryMessageData(false);
    this.getVilMessageData(false);
    this.getDailyStatusMessageData(false);
    this.getQueryStatusMessageData(false);
  }
  buildForm() {
    this.zoneForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      treatment: [[], [Validators.required]],
      country: [[], [Validators.required]],
      queryTo: [[], [Validators.required]],
      queryCc: [],
      vilTo: [[], [Validators.required]],
      vilCc: [],
      dailyStatusTo: [[], [Validators.required]],
      dailyStatusCc: [],
      queryStatusTo: [[], [Validators.required]],
      queryStatusCc: [],
      queryMessage: [[], [Validators.required]],
      vilMessage: [[], [Validators.required]],
      dailyStatusMessage: [[], [Validators.required]],
      queryStatusMessage: [[], [Validators.required]],
    });
  }

  mapIdArray(array: any) {
    let modifiedArray = [];
    if (array?.length > 0) {
      array.forEach((a: any) => {
        modifiedArray.push(a?._id);
      });
    }
    return modifiedArray;
  }

  modifyData(array: any) {
    let modifiedArray = [];
    if (array?.length > 0) {
      array.forEach((a: any) => {
        modifiedArray.push({
          _id: a?._id,
          name: a?.name,
        });
      });
    }
    return modifiedArray;
  }

  formSubmit() {
    if (this.zoneForm.valid) {
      this.zoneForm.value.referralId = this.referralId;

      let values = this.zoneForm.value;
      let newData = {
        name: values?.name,
        country: values?.country,
        treatment: values?.treatment,
        referralPartnerId: this.referralId,
        queryTo: this.mapIdArray(values?.queryTo),
        queryCc: this.mapIdArray(values?.queryCc),
        vilTo: this.mapIdArray(values?.vilTo),
        vilCc: this.mapIdArray(values?.vilCc),
        dailyStatusTo: this.mapIdArray(values?.dailyStatusTo),
        dailyStatusCc: this.mapIdArray(values?.dailyStatusCc),
        queryStatusTo: this.mapIdArray(values?.queryStatusTo),
        queryStatusCc: this.mapIdArray(values?.queryStatusCc),
        queryMessage: this.mapIdArray(values?.queryMessage),
        vilMessage: this.mapIdArray(values?.vilMessage),
        dailyStatusMessage: this.mapIdArray(values?.dailyStatusMessage),
        queryStatusMessage: this.mapIdArray(values?.queryStatusMessage),
      };

      if (!this.zoneData) {
        this.supremeService
          .addReferralPartnerZone(newData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.supremeService
          .editReferralPartnerZone(this.zoneData._id, newData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.zoneForm.controls).forEach((key) => {
        this.zoneForm.controls[key].markAsTouched();
      });
    }
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
          this.zoneForm.patchValue({
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
    this.zoneForm.patchValue({
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
      this.zoneForm.patchValue({
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
          this.zoneForm.patchValue({
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
    this.zoneForm.patchValue({
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
      this.zoneForm.patchValue({
        treatment: [],
      });
    }
  }

  // QueryTo Linking

  getQueryToData(selectAll: Boolean) {
    if (this.isLoadingQueryTo) {
      return;
    }
    this.isLoadingQueryTo = true;

    this.supremeService
      .getStaffByReferralPartner(this.queryToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryToData = [];
        }
        this.queryToData.push(...res.data.content);
        this.totalElementQueryTo = res.data.totalElement;
        this.queryToParams.page = this.queryToParams.page + 1;
        this.isLoadingQueryTo = false;
        if (selectAll) {
          const allQueryTo = this.queryToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allQueryTo.forEach((queryTo) => {
            const isQueryToAlreadySelected = this.selectedQueryToSearch.some(
              (selectedQueryTo) => selectedQueryTo._id === queryTo._id
            );

            if (!isQueryToAlreadySelected) {
              this.selectedQueryToSearch.push(queryTo);
            }
          });

          this.zoneForm.patchValue({
            queryTo: this.selectedQueryToSearch,
          });
          this.isLoadingQueryToSelectAll = false;
        }
      });
  }
  onInfiniteScrollQueryTo(): void {
    if (this.queryToData.length < this.totalElementQueryTo) {
      this.getQueryToData(false);
    }
  }

  searchQueryTo(filterValue: string) {
    clearTimeout(this.timeoutQueryTo);
    this.timeoutQueryTo = setTimeout(() => {
      this.queryToParams.search = filterValue.trim();
      this.queryToParams.page = 1;
      this.queryToParams.limit = 20;
      this.queryToData = []; // Clear existing data when searching
      this.isLoadingQueryTo = false;
      this.getQueryToData(false);
    }, 600);
  }

  onClickQueryTo(item) {
    const index = this.selectedQueryToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryToSearch.push(item);
    }
    this.zoneForm.patchValue({
      queryTo: [...new Set(this.selectedQueryToSearch)],
    });
  }
  selectAllQueryTo(event) {
    if (event.checked) {
      this.queryToParams.page = 1;
      this.queryToParams.limit = 0;
      this.isLoadingQueryTo = false;
      this.isLoadingQueryToSelectAll = true;
      this.getQueryToData(true);
    } else {
      this.selectedQueryToSearch = [];
      this.zoneForm.patchValue({
        queryTo: [],
      });
    }
  }

  // QueryCc Linking

  getQueryCcData(selectAll: Boolean) {
    if (this.isLoadingQueryCc) {
      return;
    }
    this.isLoadingQueryCc = true;

    this.supremeService
      .getStaffByReferralPartner(this.queryCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryCcData = [];
        }
        this.queryCcData.push(...res.data.content);
        this.totalElementQueryCc = res.data.totalElement;
        this.queryCcParams.page = this.queryCcParams.page + 1;
        this.isLoadingQueryCc = false;
        if (selectAll) {
          const allQueryCc = this.queryCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allQueryCc.forEach((queryCc) => {
            const isQueryCcAlreadySelected = this.selectedQueryCcSearch.some(
              (selectedQueryCc) => selectedQueryCc._id === queryCc._id
            );

            if (!isQueryCcAlreadySelected) {
              this.selectedQueryCcSearch.push(queryCc);
            }
          });

          this.zoneForm.patchValue({
            queryCc: this.selectedQueryCcSearch,
          });
          this.isLoadingQueryCcSelectAll = false;
        }
      });
  }
  onInfiniteScrollQueryCc(): void {
    if (this.queryCcData.length < this.totalElementQueryCc) {
      this.getQueryCcData(false);
    }
  }

  searchQueryCc(filterValue: string) {
    clearTimeout(this.timeoutQueryCc);
    this.timeoutQueryCc = setTimeout(() => {
      this.queryCcParams.search = filterValue.trim();
      this.queryCcParams.page = 1;
      this.queryCcParams.limit = 20;
      this.queryCcData = []; // Clear existing data when searching
      this.isLoadingQueryCc = false;
      this.getQueryCcData(false);
    }, 600);
  }

  onClickQueryCc(item) {
    const index = this.selectedQueryCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryCcSearch.push(item);
    }
    this.zoneForm.patchValue({
      queryCc: [...new Set(this.selectedQueryCcSearch)],
    });
  }
  selectAllQueryCc(event) {
    if (event.checked) {
      this.queryCcParams.page = 1;
      this.queryCcParams.limit = 0;
      this.isLoadingQueryCc = false;
      this.isLoadingQueryCcSelectAll = true;
      this.getQueryCcData(true);
    } else {
      this.selectedQueryCcSearch = [];
      this.zoneForm.patchValue({
        queryCc: [],
      });
    }
  }

  // VilTo Linking

  getVilToData(selectAll: Boolean) {
    if (this.isLoadingVilTo) {
      return;
    }
    this.isLoadingVilTo = true;

    this.supremeService
      .getStaffByReferralPartner(this.vilToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.vilToData = [];
        }
        this.vilToData.push(...res.data.content);
        this.totalElementVilTo = res.data.totalElement;
        this.vilToParams.page = this.vilToParams.page + 1;
        this.isLoadingVilTo = false;
        if (selectAll) {
          const allVilTo = this.vilToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allVilTo.forEach((vilTo) => {
            const isVilToAlreadySelected = this.selectedVilToSearch.some(
              (selectedVilTo) => selectedVilTo._id === vilTo._id
            );

            if (!isVilToAlreadySelected) {
              this.selectedVilToSearch.push(vilTo);
            }
          });

          this.zoneForm.patchValue({
            vilTo: this.selectedVilToSearch,
          });
          this.isLoadingVilToSelectAll = false;
        }
      });
  }
  onInfiniteScrollVilTo(): void {
    if (this.vilToData.length < this.totalElementVilTo) {
      this.getVilToData(false);
    }
  }

  searchVilTo(filterValue: string) {
    clearTimeout(this.timeoutVilTo);
    this.timeoutVilTo = setTimeout(() => {
      this.vilToParams.search = filterValue.trim();
      this.vilToParams.page = 1;
      this.vilToParams.limit = 20;
      this.vilToData = []; // Clear existing data when searching
      this.isLoadingVilTo = false;
      this.getVilToData(false);
    }, 600);
  }

  onClickVilTo(item) {
    const index = this.selectedVilToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedVilToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedVilToSearch.push(item);
    }
    this.zoneForm.patchValue({
      vilTo: [...new Set(this.selectedVilToSearch)],
    });
  }
  selectAllVilTo(event) {
    if (event.checked) {
      this.vilToParams.page = 1;
      this.vilToParams.limit = 0;
      this.isLoadingVilTo = false;
      this.isLoadingVilToSelectAll = true;
      this.getVilToData(true);
    } else {
      this.selectedVilToSearch = [];
      this.zoneForm.patchValue({
        vilTo: [],
      });
    }
  }

  // VilCc Linking

  getVilCcData(selectAll: Boolean) {
    if (this.isLoadingVilCc) {
      return;
    }
    this.isLoadingVilCc = true;

    this.supremeService
      .getStaffByReferralPartner(this.vilCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.vilCcData = [];
        }
        this.vilCcData.push(...res.data.content);
        this.totalElementVilCc = res.data.totalElement;
        this.vilCcParams.page = this.vilCcParams.page + 1;
        this.isLoadingVilCc = false;
        if (selectAll) {
          const allVilCc = this.vilCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allVilCc.forEach((vilCc) => {
            const isVilCcAlreadySelected = this.selectedVilCcSearch.some(
              (selectedVilCc) => selectedVilCc._id === vilCc._id
            );

            if (!isVilCcAlreadySelected) {
              this.selectedVilCcSearch.push(vilCc);
            }
          });

          this.zoneForm.patchValue({
            vilCc: this.selectedVilCcSearch,
          });
          this.isLoadingVilCcSelectAll = false;
        }
      });
  }
  onInfiniteScrollVilCc(): void {
    if (this.vilCcData.length < this.totalElementVilCc) {
      this.getVilCcData(false);
    }
  }

  searchVilCc(filterValue: string) {
    clearTimeout(this.timeoutVilCc);
    this.timeoutVilCc = setTimeout(() => {
      this.vilCcParams.search = filterValue.trim();
      this.vilCcParams.page = 1;
      this.vilCcParams.limit = 20;
      this.vilCcData = []; // Clear existing data when searching
      this.isLoadingVilCc = false;
      this.getVilCcData(false);
    }, 600);
  }

  onClickVilCc(item) {
    const index = this.selectedVilCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedVilCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedVilCcSearch.push(item);
    }
    this.zoneForm.patchValue({
      vilCc: [...new Set(this.selectedVilCcSearch)],
    });
  }
  selectAllVilCc(event) {
    if (event.checked) {
      this.vilCcParams.page = 1;
      this.vilCcParams.limit = 0;
      this.isLoadingVilCc = false;
      this.isLoadingVilCcSelectAll = true;
      this.getVilCcData(true);
    } else {
      this.selectedVilCcSearch = [];
      this.zoneForm.patchValue({
        vilCc: [],
      });
    }
  }

  // dailyStatusToData Linking

  getDailyStatusToData(selectAll: Boolean) {
    if (this.isLoadingDailyStatusTo) {
      return;
    }
    this.isLoadingDailyStatusTo = true;

    this.supremeService
      .getStaffByReferralPartner(this.dailyStatusToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.dailyStatusToData = [];
        }
        this.dailyStatusToData.push(...res.data.content);
        this.totalElementDailyStatusTo = res.data.totalElement;
        this.dailyStatusToParams.page = this.dailyStatusToParams.page + 1;
        this.isLoadingDailyStatusTo = false;
        if (selectAll) {
          const allConfirmationTo = this.dailyStatusToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allConfirmationTo.forEach((confirmationTo) => {
            const isConfirmationToAlreadySelected =
              this.selectedDailyStatusToSearch.some(
                (selectedConfirmationTo) =>
                  selectedConfirmationTo._id === confirmationTo._id
              );

            if (!isConfirmationToAlreadySelected) {
              this.selectedDailyStatusToSearch.push(confirmationTo);
            }
          });

          this.zoneForm.patchValue({
            dailyStatusTo: this.selectedDailyStatusToSearch,
          });
          this.isLoadingDailyStatusToSelectAll = false;
        }
      });
  }

  onInfiniteScrollDailyStatusTo(): void {
    if (this.dailyStatusToData.length < this.totalElementDailyStatusTo) {
      this.getDailyStatusToData(false);
    }
  }

  searchDailyStatusTo(filterValue: string) {
    clearTimeout(this.timeoutDailyStatusTo);
    this.timeoutDailyStatusTo = setTimeout(() => {
      this.dailyStatusToParams.search = filterValue.trim();
      this.dailyStatusToParams.page = 1;
      this.dailyStatusToParams.limit = 20;
      this.dailyStatusToData = []; // Clear existing data when searching
      this.isLoadingDailyStatusTo = false;
      this.getDailyStatusToData(false);
    }, 600);
  }

  onClickDailyStatusTo(item) {
    const index = this.selectedDailyStatusToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedDailyStatusToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedDailyStatusToSearch.push(item);
    }
    this.zoneForm.patchValue({
      dailyStatusTo: [...new Set(this.selectedDailyStatusToSearch)],
    });
  }

  selectAllDailyStatusTo(event) {
    if (event.checked) {
      this.dailyStatusToParams.page = 1;
      this.dailyStatusToParams.limit = 0;
      this.isLoadingDailyStatusTo = false;
      this.isLoadingDailyStatusToSelectAll = true;
      this.getDailyStatusToData(true);
    } else {
      this.selectedDailyStatusToSearch = [];
      this.zoneForm.patchValue({
        dailyStatusTo: [],
      });
    }
  }

  // dailyStatusCcData Linking

  getDailyStatusCcData(selectAll: Boolean) {
    if (this.isLoadingDailyStatusCc) {
      return;
    }
    this.isLoadingDailyStatusCc = true;

    this.supremeService
      .getStaffByReferralPartner(this.dailyStatusCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.dailyStatusCcData = [];
        }
        this.dailyStatusCcData.push(...res.data.content);
        this.totalElementDailyStatusCc = res.data.totalElement;
        this.dailyStatusCcParams.page = this.dailyStatusCcParams.page + 1;
        this.isLoadingDailyStatusCc = false;
        if (selectAll) {
          const allConfirmationCc = this.dailyStatusCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allConfirmationCc.forEach((confirmationCc) => {
            const isConfirmationCcAlreadySelected =
              this.selectedDailyStatusCcSearch.some(
                (selectedConfirmationCc) =>
                  selectedConfirmationCc._id === confirmationCc._id
              );

            if (!isConfirmationCcAlreadySelected) {
              this.selectedDailyStatusCcSearch.push(confirmationCc);
            }
          });

          this.zoneForm.patchValue({
            dailyStatusCc: this.selectedDailyStatusCcSearch,
          });
          this.isLoadingDailyStatusCcSelectAll = false;
        }
      });
  }

  onInfiniteScrollDailyStatusCc(): void {
    if (this.dailyStatusCcData.length < this.totalElementDailyStatusCc) {
      this.getDailyStatusCcData(false);
    }
  }

  searchDailyStatusCc(filterValue: string) {
    clearTimeout(this.timeoutDailyStatusCc);
    this.timeoutDailyStatusCc = setTimeout(() => {
      this.dailyStatusCcParams.search = filterValue.trim();
      this.dailyStatusCcParams.page = 1;
      this.dailyStatusCcParams.limit = 20;
      this.dailyStatusCcData = []; // Clear existing data when searching
      this.isLoadingDailyStatusCc = false;
      this.getDailyStatusCcData(false);
    }, 600);
  }

  onClickDailyStatusCc(item) {
    const index = this.selectedDailyStatusCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedDailyStatusCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedDailyStatusCcSearch.push(item);
    }
    this.zoneForm.patchValue({
      dailyStatusCc: [...new Set(this.selectedDailyStatusCcSearch)],
    });
  }

  selectAllDailyStatusCc(event) {
    if (event.checked) {
      this.dailyStatusCcParams.page = 1;
      this.dailyStatusCcParams.limit = 0;
      this.isLoadingDailyStatusCc = false;
      this.isLoadingDailyStatusCcSelectAll = true;
      this.getDailyStatusCcData(true);
    } else {
      this.selectedDailyStatusCcSearch = [];
      this.zoneForm.patchValue({
        dailyStatusCc: [],
      });
    }
  }

  // QueryStatusTo Linking

  getQueryStatusToData(selectAll: Boolean) {
    if (this.isLoadingQueryStatusTo) {
      return;
    }
    this.isLoadingQueryStatusTo = true;

    this.supremeService
      .getStaffByReferralPartner(this.queryStatusToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryStatusToData = [];
        }
        this.queryStatusToData.push(...res.data.content);
        this.totalElementQueryStatusTo = res.data.totalElement;
        this.queryStatusToParams.page = this.queryStatusToParams.page + 1;
        this.isLoadingQueryStatusTo = false;
        if (selectAll) {
          const allDoctorTo = this.queryStatusToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allDoctorTo.forEach((doctorTo) => {
            const isDoctorToAlreadySelected =
              this.selectedQueryStatusToSearch.some(
                (selectedDoctorTo) => selectedDoctorTo._id === doctorTo._id
              );

            if (!isDoctorToAlreadySelected) {
              this.selectedQueryStatusToSearch.push(doctorTo);
            }
          });

          this.zoneForm.patchValue({
            queryStatusTo: this.selectedQueryStatusToSearch,
          });
          this.isLoadingQueryStatusToSelectAll = false;
        }
      });
  }

  onInfiniteScrollQueryStatusTo(): void {
    if (this.queryStatusToData.length < this.totalElementQueryStatusTo) {
      this.getQueryStatusToData(false);
    }
  }

  searchQueryStatusTo(filterValue: string) {
    clearTimeout(this.timeoutDoctorTo);
    this.timeoutDoctorTo = setTimeout(() => {
      this.queryStatusToParams.search = filterValue.trim();
      this.queryStatusToParams.page = 1;
      this.queryStatusToParams.limit = 20;
      this.queryStatusToData = []; // Clear existing data when searching
      this.isLoadingQueryStatusTo = false;
      this.getQueryStatusToData(false);
    }, 600);
  }

  onClickQueryStatusTo(item) {
    const index = this.selectedQueryStatusToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryStatusToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryStatusToSearch.push(item);
    }
    this.zoneForm.patchValue({
      queryStatusTo: [...new Set(this.selectedQueryStatusToSearch)],
    });
  }

  selectAllQueryStatusTo(event) {
    if (event.checked) {
      this.queryStatusToParams.page = 1;
      this.queryStatusToParams.limit = 0;
      this.isLoadingQueryStatusTo = false;
      this.isLoadingQueryStatusToSelectAll = true;
      this.getQueryStatusToData(true);
    } else {
      this.selectedQueryStatusToSearch = [];
      this.zoneForm.patchValue({
        queryStatusTo: [],
      });
    }
  }

  // Query Status Cc Linking

  getQueryStatusCcData(selectAll: Boolean) {
    if (this.isLoadingQueryStatusCc) {
      return;
    }
    this.isLoadingQueryStatusCc = true;

    this.supremeService
      .getStaffByReferralPartner(this.queryStatusCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryStatusCcData = [];
        }
        this.queryStatusCcData.push(...res.data.content);
        this.totalElementQueryStatusCc = res.data.totalElement;
        this.queryStatusCcParams.page = this.queryStatusCcParams.page + 1;
        this.isLoadingQueryStatusCc = false;
        if (selectAll) {
          const allDoctorCc = this.queryStatusCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allDoctorCc.forEach((doctorCc) => {
            const isDoctorCcAlreadySelected =
              this.selectedQueryStatusCcSearch.some(
                (selectedDoctorCc) => selectedDoctorCc._id === doctorCc._id
              );

            if (!isDoctorCcAlreadySelected) {
              this.selectedQueryStatusCcSearch.push(doctorCc);
            }
          });

          this.zoneForm.patchValue({
            queryStatusCc: this.selectedQueryStatusCcSearch,
          });
          this.isLoadingQueryStatusCcSelectAll = false;
        }
      });
  }

  onInfiniteScrollQueryStatusCc(): void {
    if (this.queryStatusCcData.length < this.totalElementQueryStatusCc) {
      this.getQueryStatusCcData(false);
    }
  }

  searchQueryStatusCc(filterValue: string) {
    clearTimeout(this.timeoutQueryStatusCc);
    this.timeoutQueryStatusCc = setTimeout(() => {
      this.queryStatusCcParams.search = filterValue.trim();
      this.queryStatusCcParams.page = 1;
      this.queryStatusCcParams.limit = 20;
      this.queryStatusCcData = []; // Clear existing data when searching
      this.isLoadingQueryStatusCc = false;
      this.getQueryStatusCcData(false);
    }, 600);
  }

  onClickQueryStatusc(item) {
    const index = this.selectedQueryStatusCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryStatusCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryStatusCcSearch.push(item);
    }
    this.zoneForm.patchValue({
      queryStatusCc: [...new Set(this.selectedQueryStatusCcSearch)],
    });
  }

  selectAllQueryStatusCc(event) {
    if (event.checked) {
      this.queryStatusCcParams.page = 1;
      this.queryStatusCcParams.limit = 0;
      this.isLoadingQueryStatusCc = false;
      this.isLoadingQueryStatusCcSelectAll = true;
      this.getQueryStatusCcData(true);
    } else {
      this.selectedQueryStatusCcSearch = [];
      this.zoneForm.patchValue({
        queryStatusCc: [],
      });
    }
  }

  // QueryMessage Linking

  getQueryMessageData(selectAll: Boolean) {
    if (this.isLoadingQueryMessage) {
      return;
    }
    this.isLoadingQueryMessage = true;

    this.supremeService
      .getStaffByReferralPartner(this.queryMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryMessageData = [];
        }
        this.queryMessageData.push(...res.data.content);
        this.totalElementQueryMessage = res.data.totalElement;
        this.queryMessageParams.page = this.queryMessageParams.page + 1;
        this.isLoadingQueryMessage = false;
        if (selectAll) {
          const allQueryMessage = this.queryMessageData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allQueryMessage.forEach((queryMessage) => {
            const isQueryMessageAlreadySelected =
              this.selectedQueryMessageSearch.some(
                (selectedQueryMessage) =>
                  selectedQueryMessage._id === queryMessage._id
              );

            if (!isQueryMessageAlreadySelected) {
              this.selectedQueryMessageSearch.push(queryMessage);
            }
          });

          this.zoneForm.patchValue({
            queryMessage: this.selectedQueryMessageSearch,
          });
          this.isLoadingQueryMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollQueryMessage(): void {
    if (this.queryMessageData.length < this.totalElementQueryMessage) {
      this.getQueryMessageData(false);
    }
  }

  searchQueryMessage(filterValue: string) {
    clearTimeout(this.timeoutQueryMessage);
    this.timeoutQueryMessage = setTimeout(() => {
      this.queryMessageParams.search = filterValue.trim();
      this.queryMessageParams.page = 1;
      this.queryMessageParams.limit = 20;
      this.queryMessageData = []; // Clear existing data when searching
      this.isLoadingQueryMessage = false;
      this.getQueryMessageData(false);
    }, 600);
  }

  onClickQueryMessage(item) {
    const index = this.selectedQueryMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryMessageSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryMessageSearch.push(item);
    }
    this.zoneForm.patchValue({
      queryMessage: [...new Set(this.selectedQueryMessageSearch)],
    });
  }

  selectAllQueryMessage(event) {
    if (event.checked) {
      this.queryMessageParams.page = 1;
      this.queryMessageParams.limit = 0;
      this.isLoadingQueryMessage = false;
      this.isLoadingQueryMessageSelectAll = true;
      this.getQueryMessageData(true);
    } else {
      this.selectedQueryMessageSearch = [];
      this.zoneForm.patchValue({
        queryMessage: [],
      });
    }
  }

  // VilMessage Linking

  getVilMessageData(selectAll: Boolean) {
    if (this.isLoadingVilMessage) {
      return;
    }
    this.isLoadingVilMessage = true;

    this.supremeService
      .getStaffByReferralPartner(this.vilMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.vilMessageData = [];
        }
        this.vilMessageData.push(...res.data.content);
        this.totalElementVilMessage = res.data.totalElement;
        this.vilMessageParams.page = this.vilMessageParams.page + 1;
        this.isLoadingVilMessage = false;
        if (selectAll) {
          const allVilMessage = this.vilMessageData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allVilMessage.forEach((vilMessage) => {
            const isVilMessageAlreadySelected =
              this.selectedVilMessageSearch.some(
                (selectedVilMessage) =>
                  selectedVilMessage._id === vilMessage._id
              );

            if (!isVilMessageAlreadySelected) {
              this.selectedVilMessageSearch.push(vilMessage);
            }
          });

          this.zoneForm.patchValue({
            vilMessage: this.selectedVilMessageSearch,
          });
          this.isLoadingVilMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollVilMessage(): void {
    if (this.vilMessageData.length < this.totalElementVilMessage) {
      this.getVilMessageData(false);
    }
  }

  searchVilMessage(filterValue: string) {
    clearTimeout(this.timeoutVilMessage);
    this.timeoutVilMessage = setTimeout(() => {
      this.vilMessageParams.search = filterValue.trim();
      this.vilMessageParams.page = 1;
      this.vilMessageParams.limit = 20;
      this.vilMessageData = []; // Clear existing data when searching
      this.isLoadingVilMessage = false;
      this.getVilMessageData(false);
    }, 600);
  }

  onClickVilMessage(item) {
    const index = this.selectedVilMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedVilMessageSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedVilMessageSearch.push(item);
    }
    this.zoneForm.patchValue({
      vilMessage: [...new Set(this.selectedVilMessageSearch)],
    });
  }

  selectAllVilMessage(event) {
    if (event.checked) {
      this.vilMessageParams.page = 1;
      this.vilMessageParams.limit = 0;
      this.isLoadingVilMessage = false;
      this.isLoadingVilMessageSelectAll = true;
      this.getVilMessageData(true);
    } else {
      this.selectedVilMessageSearch = [];
      this.zoneForm.patchValue({
        vilMessage: [],
      });
    }
  }

  // dailystaus Linking

  getDailyStatusMessageData(selectAll: Boolean) {
    if (this.isLoadingDailyStatusMessage) {
      return;
    }
    this.isLoadingDailyStatusMessage = true;

    this.supremeService
      .getStaffByReferralPartner(this.dailyStatusMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.dailyStatusMessageData = [];
        }
        this.dailyStatusMessageData.push(...res.data.content);
        this.totalElementDailyStatusMessage = res.data.totalElement;
        this.dailyStatusMessageParams.page =
          this.dailyStatusMessageParams.page + 1;
        this.isLoadingDailyStatusMessage = false;
        if (selectAll) {
          const allDailyStatusMessage = this.dailyStatusMessageData.map(
            (item) => ({
              _id: item._id,
              name: item.name,
            })
          );
          allDailyStatusMessage.forEach((dailyStatusMessage) => {
            const isDailyStatusMessageAlreadySelected =
              this.selectedDailyStatusMessageSearch.some(
                (selectedDailyStatusMessage) =>
                  selectedDailyStatusMessage._id === dailyStatusMessage._id
              );

            if (!isDailyStatusMessageAlreadySelected) {
              this.selectedDailyStatusMessageSearch.push(dailyStatusMessage);
            }
          });

          this.zoneForm.patchValue({
            dailyStatusMessage: this.selectedDailyStatusMessageSearch,
          });
          this.isLoadingDailyStatusMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollDailyStatusMessage(): void {
    if (
      this.dailyStatusMessageData.length < this.totalElementDailyStatusMessage
    ) {
      this.getDailyStatusMessageData(false);
    }
  }

  searchDailyStatusMessage(filterValue: string) {
    clearTimeout(this.timeoutDailyStatusMessage);
    this.timeoutDailyStatusMessage = setTimeout(() => {
      this.dailyStatusMessageParams.search = filterValue.trim();
      this.dailyStatusMessageParams.page = 1;
      this.dailyStatusMessageParams.limit = 20;
      this.dailyStatusMessageData = []; // Clear existing data when searching
      this.isLoadingDailyStatusMessage = false;
      this.getDailyStatusMessageData(false);
    }, 600);
  }

  onClickDailyStatusMessage(item) {
    const index = this.selectedDailyStatusMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedDailyStatusMessageSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedDailyStatusMessageSearch.push(item);
    }
    this.zoneForm.patchValue({
      dailyStatusMessage: [...new Set(this.selectedDailyStatusMessageSearch)],
    });
  }

  selectAllDailyStatusMessage(event) {
    if (event.checked) {
      this.dailyStatusMessageParams.page = 1;
      this.dailyStatusMessageParams.limit = 0;
      this.isLoadingDailyStatusMessage = false;
      this.isLoadingDailyStatusMessageSelectAll = true;
      this.getDailyStatusMessageData(true);
    } else {
      this.selectedDailyStatusMessageSearch = [];
      this.zoneForm.patchValue({
        dailyStatusMessage: [],
      });
    }
  }

  // query status Linking

  getQueryStatusMessageData(selectAll: Boolean) {
    if (this.isLoadingQueryStatusMessage) {
      return;
    }
    this.isLoadingQueryStatusMessage = true;

    this.supremeService
      .getStaffByReferralPartner(this.queryStatusMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryStatusMessageData = [];
        }
        this.queryStatusMessageData.push(...res.data.content);
        this.totalElementQueryStatusMessage = res.data.totalElement;
        this.queryStatusMessageParams.page =
          this.queryStatusMessageParams.page + 1;
        this.isLoadingQueryStatusMessage = false;
        if (selectAll) {
          const allDailyStatusMessage = this.queryStatusMessageData.map(
            (item) => ({
              _id: item._id,
              name: item.name,
            })
          );
          allDailyStatusMessage.forEach((dailyStatusMessage) => {
            const isDailyStatusMessageAlreadySelected =
              this.selectedQueryStatusMessageSearch.some(
                (selectedDailyStatusMessage) =>
                  selectedDailyStatusMessage._id === dailyStatusMessage._id
              );

            if (!isDailyStatusMessageAlreadySelected) {
              this.selectedQueryStatusMessageSearch.push(dailyStatusMessage);
            }
          });

          this.zoneForm.patchValue({
            queryStatusMessage: this.selectedQueryStatusMessageSearch,
          });
          this.isLoadingQueryStatusMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollQueryStatusMessage(): void {
    if (
      this.queryStatusMessageData.length < this.totalElementQueryStatusMessage
    ) {
      this.getQueryStatusMessageData(false);
    }
  }

  searchQueryStatusMessage(filterValue: string) {
    clearTimeout(this.timeoutQueryStatusMessage);
    this.timeoutQueryStatusMessage = setTimeout(() => {
      this.queryStatusMessageParams.search = filterValue.trim();
      this.queryStatusMessageParams.page = 1;
      this.queryStatusMessageParams.limit = 20;
      this.queryStatusMessageData = []; // Clear existing data when searching
      this.isLoadingQueryStatusMessage = false;
      this.getQueryStatusMessageData(false);
    }, 600);
  }

  onClickQueryStatusMessage(item) {
    const index = this.selectedQueryStatusMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryStatusMessageSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryStatusMessageSearch.push(item);
    }
    this.zoneForm.patchValue({
      queryStatusMessage: [...new Set(this.selectedQueryStatusMessageSearch)],
    });
  }

  selectAllQueryStatusMessage(event) {
    if (event.checked) {
      this.queryStatusMessageParams.page = 1;
      this.queryStatusMessageParams.limit = 0;
      this.isLoadingQueryStatusMessage = false;
      this.isLoadingQueryStatusMessageSelectAll = true;
      this.getQueryStatusMessageData(true);
    } else {
      this.selectedQueryStatusMessageSearch = [];
      this.zoneForm.patchValue({
        queryStatusMessage: [],
      });
    }
  }

  onEdit(data) {
    this.zoneData = data;
    this.selectedCountrySearch = this.zoneData?.country;
    this.selectedTreatmentSearch = this.zoneData?.treatment;

    this.selectedQueryToSearch = this.zoneData?.queryTo;
    this.selectedQueryCcSearch = this.zoneData?.queryCc;

    this.selectedVilToSearch = this.zoneData?.vilTo;
    this.selectedVilCcSearch = this.zoneData?.vilCc;

    this.selectedDailyStatusToSearch = this.zoneData?.dailyStatusTo;
    this.selectedDailyStatusCcSearch = this.zoneData?.dailyStatusCc;

    this.selectedQueryStatusToSearch = this.zoneData?.queryStatusTo;
    this.selectedQueryStatusCcSearch = this.zoneData?.queryStatusCc;

    this.selectedQueryMessageSearch = this.zoneData?.queryMessage;
    this.selectedVilMessageSearch = this.zoneData?.vilMessage;
    this.selectedDailyStatusMessageSearch = this.zoneData?.dailyStatusMessage;
    this.selectedQueryStatusMessageSearch = this.zoneData?.queryStatusMessage;

    this.zoneForm.patchValue({
      name: this.zoneData.name,
      country: this.selectedCountrySearch,
      treatment: this.selectedTreatmentSearch,
      queryTo: this.modifyData(this.selectedQueryToSearch),
      queryCc: this.modifyData(this.selectedQueryCcSearch),
      vilTo: this.modifyData(this.selectedVilToSearch),
      vilCc: this.modifyData(this.selectedVilCcSearch),
      dailyStatusTo: this.modifyData(this.selectedDailyStatusToSearch),
      dailyStatusCc: this.modifyData(this.selectedDailyStatusCcSearch),
      queryStatusTo: this.modifyData(this.selectedQueryStatusToSearch),
      queryStatusCc: this.modifyData(this.selectedQueryStatusCcSearch),
      queryMessage: this.modifyData(this.selectedQueryMessageSearch),
      vilMessage: this.modifyData(this.selectedVilMessageSearch),
      dailyStatusMessage: this.modifyData(
        this.selectedDailyStatusMessageSearch
      ),
      queryStatusMessage: this.modifyData(
        this.selectedQueryStatusMessageSearch
      ),
    });
  }
  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
}
